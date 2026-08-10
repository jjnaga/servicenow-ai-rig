"""
Runner unit tests for the phase-as-claim protocol.

The job-table era tested a queue: claim tokens, lease expiry, heartbeat overcorrection,
terminal reopening. None of those exist now — the claim is one server-side compare-and-swap
and the lease is a ServiceNow scheduled job. What is left to test locally is the boundary the
runner still owns: that it never runs an adapter it was not granted, never builds bytes it did
not verify, and never leaves a claimed build open.
"""
import hashlib
import sys
import tempfile
import threading
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'runner'))
import adapters  # noqa: E402
import ai_control_runner as runner  # noqa: E402


class FakeClient:
    """Models the server contract, including its refusals."""

    def __init__(self, work=None, specs=None, claim_error=None):
        self.work = work
        self.specs = specs or {}
        self.claim_error = claim_error
        self.claims = []
        self.finishes = []
        self.enhancement = {
            'sys_id': 'enh-1', 'u_phase': 'spec', 'u_gate_1_decision': 'pending', 'u_current_spec': '',
        }

    def identity_smoke(self):
        return None

    def next_work(self):
        return self.work

    def claim_build(self, enhancement_id, worker_id):
        if self.claim_error:
            raise RuntimeError(self.claim_error)
        self.claims.append((enhancement_id, worker_id))
        spec = self.specs[self.work['_spec_id']]
        markdown = spec['u_markdown']
        self.enhancement.update({'u_phase': 'build'})
        return {
            'enhancement_id': enhancement_id, 'spec_id': spec['sys_id'], 'markdown': markdown,
            'content_sha256': spec['u_content_sha256'], 'version': 1, 'repo_path': '',
        }

    def finish_build(self, enhancement_id, ok, summary, artifact_path=''):
        self.finishes.append({'ok': ok, 'summary': summary, 'artifact_path': artifact_path})
        phase = 'package_verify' if ok else 'build'
        self.enhancement.update({'u_phase': phase})
        return {'enhancement_id': enhancement_id, 'ok': ok, 'phase': phase}

    def get_spec(self, spec_id):
        return self.specs[spec_id]

    def create_draft(self, enhancement_id, title, markdown, repo_path=''):
        draft_id = f'spec-{len(self.specs) + 1}'
        record = {
            'sys_id': draft_id, 'u_enhancement': enhancement_id, 'u_version': str(len(self.specs) + 1),
            'u_title': title, 'u_state': 'draft', 'u_markdown': markdown, 'u_repo_path': repo_path,
        }
        self.specs[draft_id] = record
        self.enhancement.update({'u_current_spec': draft_id, 'u_phase': 'spec', 'u_gate_1_decision': 'pending'})
        return record

    def get_enhancement(self, enhancement_id):
        return self.enhancement


def root_fixture(temporary: str) -> Path:
    root = Path(temporary)
    for directory in ('src', 'runner', 'tests', 'launchd', 'evidence'):
        (root / directory).mkdir()
    for name in ('now.config.json', 'package.json', 'package-lock.json'):
        (root / name).write_text('{}\n')
    (root / 'src' / 'pin.txt').write_text('source\n')
    return root


def approved_spec(markdown='# Approved\n'):
    return {'spec-1': {
        'sys_id': 'spec-1', 'u_enhancement': 'enh-1', 'u_title': 'Approved', 'u_state': 'approved',
        'u_markdown': markdown, 'u_content_sha256': hashlib.sha256(markdown.encode()).hexdigest(),
    }}


class RunnerTests(unittest.TestCase):
    def test_draft_needs_no_claim_and_steering_text_never_executes(self):
        work = {'sys_id': 'enh-1', '_action': 'draft_spec', '_spec_id': '', 'u_steering_note': '$(touch should-not-run); & nope'}
        client = FakeClient(work)
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 0)
            # Drafting inserts a version; the unique (enhancement, version) index is the race guard.
            self.assertEqual(client.claims, [])
            self.assertEqual(client.finishes, [])
            self.assertEqual(client.enhancement['u_current_spec'], 'spec-1')
            self.assertIn('# WHY', client.specs['spec-1']['u_markdown'])
            # The control: the shell metacharacters survive as DATA, byte for byte.
            self.assertIn('$(touch should-not-run)', (root / 'evidence' / 'runner-local' / 'fixture-enh-1.json').read_text())
            self.assertFalse((root / 'should-not-run').exists())

    def test_build_claims_verifies_the_exact_bytes_and_finishes(self):
        work = {'sys_id': 'enh-1', '_action': 'build', '_spec_id': 'spec-1'}
        client = FakeClient(work, approved_spec())
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 0)
            self.assertEqual(client.claims, [('enh-1', runner.socket.gethostname()[:120])])
            self.assertEqual(len(client.finishes), 1)
            self.assertTrue(client.finishes[0]['ok'])
            self.assertIn('source ', client.finishes[0]['summary'])
            self.assertEqual(client.enhancement['u_phase'], 'package_verify')

    def test_claim_refused_by_server_runs_no_adapter(self):
        work = {'sys_id': 'enh-1', '_action': 'build', '_spec_id': 'spec-1'}
        client = FakeClient(work, approved_spec(), claim_error='AI control: expected spec, got build')
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 1)
            self.assertEqual(client.claims, [])
            # Nothing was claimed, so nothing may be reported finished.
            self.assertEqual(client.finishes, [])
            self.assertFalse((root / 'evidence' / 'runner-local').exists())

    def test_hash_drift_between_claim_and_recompute_fails_closed(self):
        specs = approved_spec()
        specs['spec-1']['u_content_sha256'] = '0' * 64  # server hands back a hash that is not the bytes
        work = {'sys_id': 'enh-1', '_action': 'build', '_spec_id': 'spec-1'}
        client = FakeClient(work, specs)
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 1)
            self.assertEqual(len(client.finishes), 1)
            self.assertFalse(client.finishes[0]['ok'])
            self.assertIn('SHA-256 mismatch', client.finishes[0]['summary'])

    def test_a_claimed_build_is_never_left_open_on_error(self):
        work = {'sys_id': 'enh-1', '_action': 'build', '_spec_id': 'spec-1'}
        client = FakeClient(work, approved_spec())
        original = runner.fixture
        runner.fixture = lambda *_args, **_kwargs: (_ for _ in ()).throw(RuntimeError('adapter exploded'))
        try:
            with tempfile.TemporaryDirectory() as temporary:
                root = root_fixture(temporary)
                self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 1)
                self.assertEqual(len(client.finishes), 1)
                self.assertFalse(client.finishes[0]['ok'])
                self.assertIn('adapter exploded', client.finishes[0]['summary'])
        finally:
            runner.fixture = original

    def test_cancel_after_adapter_closes_the_claim_at_a_safe_boundary(self):
        work = {'sys_id': 'enh-1', '_action': 'build', '_spec_id': 'spec-1'}
        client = FakeClient(work, approved_spec())
        cancel = threading.Event()
        original = runner.fixture

        def cancelling_fixture(prepared, evidence):
            result = original(prepared, evidence)
            cancel.set()
            return result

        runner.fixture = cancelling_fixture
        try:
            with tempfile.TemporaryDirectory() as temporary:
                root = root_fixture(temporary)
                self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock', cancel), 0)
                self.assertEqual(len(client.finishes), 1)
                self.assertFalse(client.finishes[0]['ok'])
                self.assertIn('safe boundary', client.finishes[0]['summary'])
        finally:
            runner.fixture = original

    def test_cancel_before_claim_takes_nothing(self):
        work = {'sys_id': 'enh-1', '_action': 'build', '_spec_id': 'spec-1'}
        client = FakeClient(work, approved_spec())
        cancel = threading.Event()
        cancel.set()
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock', cancel), 0)
            self.assertEqual(client.claims, [])
            self.assertEqual(client.finishes, [])

    def test_no_work_exits_without_claiming(self):
        client = FakeClient(None)
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 0)
            self.assertEqual(client.claims, [])
            self.assertEqual(client.finishes, [])

    def test_allowlist_redaction_and_provider_argv_are_shell_safe(self):
        with self.assertRaises(ValueError):
            runner.require_action('rm -rf /')
        self.assertNotIn('hunter2', runner.redact('password=hunter2 token=abc'))
        argv = adapters._provider_argv('codex', Path('/tmp/prompt with spaces.md'), '$(touch nope);&')
        self.assertIsInstance(argv, list)
        self.assertNotIn('$(touch nope);&', argv)
        self.assertEqual(argv[0], adapters.CODEX_BIN)
        self.assertTrue(argv[0].endswith('codex-wrapper'), 'provider binary is the configured wrapper')

    def test_lock_contention_does_not_run_second_worker(self):
        with tempfile.TemporaryDirectory() as temporary:
            lock = Path(temporary) / 'lock'
            with runner.exclusive_lock(lock) as first:
                self.assertTrue(first)
                with runner.exclusive_lock(lock) as second:
                    self.assertFalse(second)
            with runner.exclusive_lock(lock) as third:
                self.assertTrue(third)

    def test_host_guard_rejects_a_host_the_operator_did_not_declare(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / 'env'
            path.write_text('SN_INSTANCE=https://wrong.example\nSN_USER=u\nSN_PASS=p\n')
            original = runner.EXPECTED_HOST
            runner.EXPECTED_HOST = 'right.example'
            try:
                with self.assertRaisesRegex(RuntimeError, 'exact-host guard refused wrong.example'):
                    runner.load_env(path)
                path.write_text('SN_INSTANCE=https://right.example\nSN_USER=u\nSN_PASS=p\n')
                self.assertEqual(runner.load_env(path)['_host'], 'right.example')
            finally:
                runner.EXPECTED_HOST = original

    def test_missing_host_is_refused_even_with_no_pin_declared(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / 'env'
            path.write_text('SN_USER=u\nSN_PASS=p\n')
            original = runner.EXPECTED_HOST
            runner.EXPECTED_HOST = ''
            try:
                with self.assertRaisesRegex(RuntimeError, 'missing host'):
                    runner.load_env(path)
            finally:
                runner.EXPECTED_HOST = original

    def test_servicenow_datetime_is_not_an_epoch(self):
        self.assertEqual(runner.sn_datetime(0), '1970-01-01 00:00:00')

    def test_source_digest_ignores_runtime_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            before = runner.source_digest(root)
            (root / 'evidence' / 'receipt.json').write_text('{}')
            self.assertEqual(before, runner.source_digest(root))

    def test_preclaim_502_writes_health_receipt_without_mutation(self):
        class SleepingClient(FakeClient):
            def identity_smoke(self):
                raise runner.PDIUnavailable(False)

        with tempfile.TemporaryDirectory() as temporary:
            root = root_fixture(temporary)
            client = SleepingClient(None)
            self.assertEqual(runner.run_once(root, client, 'fixture', root / 'lock'), 2)
            self.assertEqual(client.claims, [])
            receipts = list((root / 'evidence' / 'runner-health').glob('*.json'))
            self.assertEqual(len(receipts), 1)
            self.assertIn('no mutation attempted', receipts[0].read_text())


if __name__ == '__main__':
    unittest.main()
