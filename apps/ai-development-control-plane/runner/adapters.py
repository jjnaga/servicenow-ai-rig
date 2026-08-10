"""Allowlisted, shell-free runner adapters. Provider output is always untrusted data."""
from __future__ import annotations

import json
import os
import re
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path
from threading import Event

ALLOWED_ACTIONS = frozenset({'draft_spec', 'revise_spec', 'build', 'verify', 'package_review'})


@dataclass(frozen=True)
class AdapterResult:
    ok: bool
    summary: str
    artifact_path: str
    draft_markdown: str | None = None
    draft_title: str | None = None


def require_action(action: str) -> None:
    if action not in ALLOWED_ACTIONS:
        raise ValueError(f'unsupported action: {action}')


def fixture(job: dict, workdir: Path) -> AdapterResult:
    """Produce deterministic data only inside the supplied evidence directory."""
    action = str(job['u_action'])
    require_action(action)
    workdir.mkdir(parents=True, exist_ok=True)
    artifact = workdir / f"fixture-{job['sys_id']}.json"
    draft = None
    title = None
    if action == 'draft_spec':
        title = 'Fixture control-plane specification'
        draft = '# WHY\n\nProve the governed draft path.\n\n# WHAT\n\nOne deterministic fixture draft.\n\n# HOW\n\nCreated by the allowlisted fixture adapter.\n'
    elif action == 'revise_spec':
        title = str(job.get('_spec_title') or 'Revised fixture specification')
        draft = str(job.get('_spec_markdown') or '') + '\n\n## Revision receipt\n\n' + str(job.get('_review_notes') or 'Changes applied.') + '\n'
    artifact.write_text(json.dumps({
        'action': action, 'job_id': job['sys_id'], 'status': 'fixture-complete',
        'steering_note': job.get('u_steering_note', ''), 'draft_sha256_input': draft,
    }, sort_keys=True) + '\n', encoding='utf-8')
    return AdapterResult(True, f'fixture completed {action}', str(artifact), draft, title)


# Portability: the codex adapter shells out to a site-provided wrapper implementing the
# summon/status/answer contract. Point AI_CONTROL_CODEX_BIN at yours; the default assumes a
# `codex-wrapper` on PATH, so moving this worker between hosts is configuration, not a code edit.
CODEX_BIN = os.environ.get('AI_CONTROL_CODEX_BIN', 'codex-wrapper')


def _provider_argv(provider_name: str, prompt_path: Path, job_id: str) -> list[str]:
    if provider_name == 'claude':
        return ['claude', '--print', '--permission-mode', 'acceptEdits']
    if provider_name == 'codex':
        safe_id = re.sub(r'[^a-zA-Z0-9_-]', '-', job_id)[:48]
        workdir = prompt_path.parents[2] if len(prompt_path.parents) > 2 else prompt_path.parent
        return [CODEX_BIN, 'summon', f'ai-control-{safe_id}', str(prompt_path), str(workdir)]
    raise ValueError(f'unsupported provider: {provider_name}')


def _run_cancellable(argv: list[str], evidence_path: Path, cancel: Event, stdin_path: Path | None = None) -> int:
    with evidence_path.open('w', encoding='utf-8') as output:
        stdin = stdin_path.open('r', encoding='utf-8') if stdin_path else subprocess.DEVNULL
        try:
            process = subprocess.Popen(argv, shell=False, stdin=stdin, stdout=output, stderr=subprocess.STDOUT, text=True)
            while process.poll() is None:
                if cancel.wait(1):
                    process.terminate()
                    try:
                        return process.wait(timeout=10)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        return process.wait(timeout=5)
            return int(process.returncode or 0)
        finally:
            if stdin_path and stdin is not subprocess.DEVNULL:
                stdin.close()


def provider(provider_name: str, job: dict, prompt_path: Path, evidence_path: Path, cancel: Event) -> AdapterResult:
    """Invoke only hard-coded argv; record values never become executable syntax."""
    require_action(str(job['u_action']))
    argv = _provider_argv(provider_name, prompt_path, str(job['sys_id']))
    code = _run_cancellable(argv, evidence_path, cancel, prompt_path if provider_name == 'claude' else None)
    if provider_name == 'codex' and code == 0 and not cancel.is_set():
        status_path = evidence_path.with_suffix('.status.log')
        deadline = time.monotonic() + int(os.environ.get('AI_CONTROL_PROVIDER_TIMEOUT', '3600'))
        while time.monotonic() < deadline and not cancel.wait(5):
            status = subprocess.run([CODEX_BIN, 'status'], shell=False, stdin=subprocess.DEVNULL, capture_output=True, text=True, check=False)
            status_path.write_text(status.stdout + status.stderr, encoding='utf-8')
            if status.returncode == 0 and 'running' not in status.stdout.lower():
                answer = subprocess.run([CODEX_BIN, 'answer'], shell=False, stdin=subprocess.DEVNULL, capture_output=True, text=True, check=False)
                evidence_path.write_text(answer.stdout + answer.stderr, encoding='utf-8')
                code = answer.returncode
                break
        else:
            code = 124
    summary = 'cancelled at safe boundary' if cancel.is_set() else f'{provider_name} exited {code}'
    return AdapterResult(code == 0 and not cancel.is_set(), summary, str(evidence_path))
