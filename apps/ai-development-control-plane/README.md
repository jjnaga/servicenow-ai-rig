# AI Development Control Plane

The v0 global Fluent/SDK application is implemented, installed, and fully evidenced on the
authorized developer PDI. It is parked at the **human review gate**:
two spec versions are `in_review`, Gate 1 is `pending`, and no automation may go further.

Start with [`codex/APP.md`](codex/APP.md) § THE BOUNDARY — the design of record. `SPEC.md`
carries the WHY and is partly superseded; read it second.

**The run record is not in this repository.** Receipts, browser screenshots and the dated build
journal were evidence for one operator on one instance, not something a stranger can use or
verify. What ships is the thing you can run: source, runner, tests, and the codex of scars it
was built on.

## Read order

1. [`AGENTS.md`](AGENTS.md) — authority boundary and operating law.
2. [`SPEC.md`](SPEC.md) — original WHY/WHAT/HOW plus dated execution status.
3. [`codex/APP.md`](codex/APP.md) — installed truth and paid-for scars.
4. `evidence/handoff.md`, `HEAD_STATE.md`, `BUILD_JOURNAL.md` — the run records; they live with
   the instance owner's working copy and are not in this repository.
7. Parent `CLAUDE.md`, `codex/servicenow.md`, and `enhancements/loop.md`.

## Current result

- SDK 4.10.1 app, global v0.0.1, active; 367 scoped metadata
  rows re-counted and inventoried by class on 2026-08-09.
- Final ATF result `72c3d992c3e6cf10aaafb71d05013180` passed 4/4 in 16 seconds.
- All five source-declared database indexes confirmed present with exact column tuples.
- Workspace and workbench render with zero page/console errors;
  `/now/ai-development-control/home` shows the Authority queue dashboard.
- Three fixture jobs succeeded; two exact 132-byte specs are `in_review`, one is `draft`; Gate 1 is
  `pending` and Gate 2 `not_reached` throughout.
- A LaunchAgent from `launchd/` is loaded every 300 seconds, idle, last exit 0.
- SMTP is disabled; notification acceptance is a single send-ready `sys_email` receipt, and only
  one of five notification templates has a generated instance.

No update set was published. No promotion, Gate 2 decision, enhancement closure, commit, or push
occurred. Do not resurrect the aborted scaffold and do not run broad `/sn-map`.

## Known gaps

Six, each stated in [`evidence/handoff.md`](evidence/handoff.md): the composite index unique flag
has functional proof only; notifications are one-fifth exercised; SMTP is off so nothing was
delivered; role behaviour is proven by ATF rather than a non-admin browser pass; no model-backed
adapter has ever run; and the design is single-worker.

Not a gap: the source tree is byte-identical to the installed candidate — `source_digest()` in the
runner reproduces `55b6944b…` exactly.
