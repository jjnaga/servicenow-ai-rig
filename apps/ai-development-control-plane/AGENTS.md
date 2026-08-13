# Agent operating contract

`AGENTS.md` is the vendor-neutral convention for an **agent operating contract**: the local law a
coding agent must obey while working in this directory. It is the cross-vendor equivalent of a
project-specific `CLAUDE.md`.

This file scopes the build described in `SPEC.md`. Parent repository instructions still apply and
win on conflict.

## Mission

One-shot the AI Development Control Plane from source to verified PDI installation. The app makes
ServiceNow the human authority/control plane, Git the source/delivery plane, and cold local agents
the execution plane.

The result must be a working system, not a UI mock and not only a schema. A human must be able to:

1. request a spec draft from an enhancement;
2. edit and review versioned Markdown in ServiceNow;
3. approve the exact content for build or request changes;
4. enqueue only allowlisted agent work;
5. see queue, worker, heartbeat, results, failures, and artifacts;
6. retry or cancel safely; and
7. receive notification when attention is required.

## Current execution boundary

The build, install and closeout are complete. The app is parked at the human review gate, which is
its resting state by design.

**No agent work is authorized here without the operator granting scope.** Do not reimplement,
approve or reject a spec, invoke a real model job, publish an update set, promote, set Gate 2,
close an enhancement, commit, or push. Reads and questions are always free.

If new scope does arrive, **re-derive live state before any repair** — every number recorded in
this repository is a cache with a date on it, not the instance — and do not churn green artifacts
to repeat a prior run.

## Read before acting

Read in this exact order:

0. `codex/APP.md` in full — the design of record; § THE BOUNDARY first;
1. this file;
2. `SPEC.md` in full — the WHY, partly superseded by the codex where they disagree;
5. parent `../../CLAUDE.md`;
6. parent `../../codex/servicenow.md` in full;
7. parent `../../enhancements/loop.md`.

If a required skill applies, read its complete `SKILL.md` before work. In particular:

- use `servicenow-sdk:now-sdk` for all Fluent/SDK work;
- before any UI source, plan structure and design deliberately rather than improvising;
- prove tests, not merely author them — a test that cannot fail proves nothing;
- keep the implementation complete without speculative layers.

## Authority this contract grants

Authority comes from the operator, never from this file. What a granted run may do:

- create and modify files under this app directory and the normal evidence/journal locations;
- perform targeted read-only introspection against the exact PDI in `~/.snpdi/env`;
- build and install this global application directly into that PDI;
- create the app's roles, ACLs, tables, APIs, Workspace, UI actions, notifications, and ATF tests;
- seed only minimal attributed probe data needed to prove the workflow;
- install and exercise the local runner and its LaunchAgent only after fixture mode passes.

This authority does **not** include:

- any host other than the exact `$SN_INSTANCE` from `~/.snpdi/env`;
- production or test/customer instances;
- promotion to another ServiceNow instance;
- a Git commit or push;
- changing either human gate on the human's behalf;
- arbitrary deletion/cleanup of existing instance data;
- an update set for this experiment. Direct SDK install is the chosen lane.

## Deliberate grounding exception

This app was built **without** a broad instance map: the operator waived it, and the surfaces it
touches are few enough to introspect directly. Do not run broad `/sn-map` or generate the parent
`codex/instance-profile.md` on this app's account.

This is not permission to guess. Before each write, query the exact live tables, fields, choices,
roles, ACLs, and collisions the artifact uses. Record the narrow evidence in the build journal.

## Hard walls

- Run `../../scripts/sn-init --check` before any instance write. Stop unless it resolves to the
  exact developer host and both REST and SDK auth pass.
- Consume `~/.snpdi/env` inline. Never print or separately read the password.
- Browser observes. Fluent/SDK and REST author. Never create app metadata through the GUI.
- Read `sys_dictionary` before using a field and account for inherited fields.
- Validate every stored choice against active `sys_choice` rows before writing it.
- Read back every write. HTTP success and SDK “installed” output are not evidence.
- Never retry a POST blindly. Every create path needs a deterministic idempotency key.
- Never use an unresolved dot-walk to scope a destructive operation.
- Preserve unrelated dirty files in the working tree; they are not part of this app.

## Source and delivery law

- Global scope is required. Every custom table and dictionary column is `u_` prefixed, even where
  SDK 4.10.1 documentation suggests an owned table may accept bare columns. The parent codex's
  measured silent-discard scar wins.
- Fluent source is authoritative for application metadata. Do not create duplicate REST-owned
  copies of source-owned records.
- Commit `src/fluent/generated/keys.ts` when a human later authorizes a commit. Never fabricate a
  sys_id and never rename a stable `Now.ID` key casually.
- Never remove a Fluent entity without determining whether its deletion must propagate through
  `keys.ts`. This greenfield run should not need upgrade-time deletion.
- Build once for the install candidate. Do not rebuild between pinning evidence and installing.
- Direct `now-sdk install` is intentional here. Do not invoke `sn-publish` or produce an update set.

## Human authority law

- The agent may recommend; it never approves.
- Only a reviewer role held by a human can approve or reject a spec.
- Approval freezes the exact Markdown bytes and SHA-256, records the human identity and timestamp,
  updates Gate 1 with attribution, and enqueues exactly one build job in one server transaction.
- A runner role can update machine state only. It can never set Gate 1, Gate 2, `approved_by`, or
  `approved_at`.
- Approved/rejected/review-submitted versions are immutable. A change creates a new draft version.
- No automation closes the enhancement or promotes an artifact. Stop at review.

## Execution architecture

- ServiceNow stores authenticated human intent and observable status; it never runs a shell.
- The local runner makes outbound REST calls; there is no inbound endpoint to the Mac.
- The runner accepts an action enum, never a command string. Steering and spec text are untrusted
  data and must never be interpolated into a shell.
- Spawn agents with an argv array and `shell=false`. Keep provider adapters allowlisted in source.
- One worker is the v0 topology. Use an OS file lock plus durable job idempotency. Claim token and
  heartbeat are observability, not a fake distributed mutex.
- If a second machine/worker is introduced, stop and design an atomic server-side lease. Do not
  stretch the one-worker mechanism beyond its proof.
- Process one job and exit. A scheduler supplies recurrence; the agent process stays cold.

## UI law

- Native Workspace/list/form/dashboard surfaces carry navigation, status, and ordinary CRUD.
- Custom React earns one surface only: the Markdown workbench with exact-content editor, sanitized
  preview, authority status, version history, and contextual gate buttons.
- Neutral internal-tool mode: flat CSS Grid, semantic regions, no nested card soup, no decorative
  gradients, no invented design system over Polaris.
- The signature interaction is the **authority rail**: one compact strip that says whose decision
  is needed, what exact content hash is under review, and what the next allowed action is.
- Button labels are verbs and keep the same wording in success/failure messages.
- Provide keyboard focus, responsive behavior, reduced-motion compliance, and useful empty/error
  states. Sanitize Markdown HTML before rendering.

## Testing law

No test means not done.

- Bank a born-red receipt before implementation: target tables/roles absent and fixture runner
  flow unavailable.
- Every custom transition, authorization boundary, idempotency rule, and immutable-content rule
  gets an ATF test.
- Cover happy, bad, and over-correction paths. A positive-only suite is incomplete.
- Assemble and run a headless server-side ATF suite through the CI/CD API.
- Use Playwright-over-CDP for Workspace/workbench verification after authoritative read-back.
- Prove the runner with a deterministic fixture adapter before invoking a real model.
- Prove the test can fail: born-red is preferred; otherwise mutation-prove the assertion.
- Before accepting a test, confirm it both exercises the behavior AND can fail when the behavior breaks. Record any honest waiver.

## Audit and handoff

- Prepend every system mutation to the project's audit log, timestamped in one named timezone.
- Keep `BUILD_JOURNAL.md` inside this directory with commands, artifact counts, read-backs, test run
  IDs, fixture results, screenshots, gaps, and rollback context. Never include secrets.
- Log edits to agent files wherever the parent repository records its run journal.
- Do not claim the app is done from self-report. Re-derive final state from the PDI and filesystem.
- Leave the enhancement/control plane at the human review gate and report exactly what remains
  unverified.
- A useful discovery is unfinished until it is written into the repository at the right scope:
  app behavior/scars in `codex/APP.md`, reusable rig truth in the parent `codex/servicenow.md`,
  agent law here, current pickup in `HEAD_STATE.md`, and execution receipts in
  `BUILD_JOURNAL.md`/`evidence/` (local run records — not in this repository). One home per fact; link instead of duplicating.
- Before final response, re-read every human-authored context file under this directory and update
  stale status, paths, design claims, gaps, and reading order. The repository—not the transcript—
  is the durable handoff.

## Definition of done

All acceptance criteria in `SPEC.md` pass; the PDI contains the intended app and nothing was
promoted; the runner fixture completes one full job lifecycle without overlap; the UI is visibly
usable; notifications are generated; source/evidence are coherent; and no commit/push occurred.
