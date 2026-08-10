# AI Development Control Plane — one-shot implementation spec

> Put the human authority surface for AI-built ServiceNow enhancements inside ServiceNow, while
> keeping source in Git and execution in disposable local agents.

## ⚠ SUPERSEDED IN PART — v0.0.2, 2026-08-09 evening

**Decisions 3, 5, 6, 7 and the whole `u_sn_agent_job` domain model below are no longer the
design.** The product owner reviewed the built result and ruled it over-wired: *"it should just be a middleman,
a spec writer/editor/audit/state… more a repository / handoff boundary."* The job table is deleted;
the machine protocol runs on the enhancement's existing `u_phase` + `work_start`/`work_end`, and
the lease became a Scheduled Script Execution. Approval no longer advances the phase.

Everything in this spec about **authority** — immutable versions, the SHA-256 freeze, the two
gates, allowlisted actions, no shell from ServiceNow, outbound-only polling, one worker, process-
one-and-exit — stands unchanged and is what survived. The current design of record is
[`codex/APP.md`](codex/APP.md) § THE BOUNDARY. Read this file for WHY; read the codex for WHAT.

## Execution status — CLOSED TO THE HUMAN GATE 2026-08-09

The v0 specified below is implemented, installed, and fully evidenced on the authorized
developer PDI. Closeout finished on 2026-08-09: the last open receipt (index
metadata) is closed, installed state was re-derived from the PDI rather than trusted, and every
acceptance criterion is mapped to a verdict in [`evidence/handoff.md`](evidence/handoff.md). The
installed source digest is `55b6944bb98b64441b1b4f00355a3b785329c7e1e086fc767b82aef9359b7e45`,
re-computed on 2026-08-09 and identical — the tree is byte-identical to the install candidate.

**The next action is a human's.** Two spec versions are `in_review`, Gate 1 is `pending`, Gate 2 is
`not_reached`, and no update set, promotion, closure, commit, or push exists.

Thirteen of fifteen acceptance criteria pass outright. Criterion 11 (notifications) is **partial**
— only one of five templates ever generated a `sys_email`, because `sendToCreator: false` suppressed
those whose sole recipient was the acting user and the rest fired only inside rolled-back ATF
transactions. Criterion 13 passes with two named limits: the platform discards declared index names,
and no read-only surface exposes an index's unique flag.

Material gates green:

- SDK 4.10.1 frozen-key build; 367 scoped metadata rows read back, including 42 dictionary
  records, 39 ACLs/58 ACL roles, 10 Control API routes, all Workspace/dashboard/action records,
  five events/notifications, and four ATF tests with 18 steps;
- final ATF suite result `72c3d992c3e6cf10aaafb71d05013180`: 4 passed, 0 failed/error/
  skipped in 16 seconds;
- three fixture jobs completed claim/heartbeat/result paths; the macOS mutex contention control
  exited without claiming and the next run reacquired cleanly;
- final authenticated Workspace/workbench browser run rendered the dashboard, draft and review
  states, inert hostile Markdown, dirty-navigation guard, and 390px layout with zero browser
  errors; screenshots are under `evidence/browser/`;
- a send-ready review email and attributed `sys_journal_field` rows were read back; SMTP itself is
  disabled on this PDI, which satisfies the v0 generated-email floor.

Closed on 2026-08-09, in addition: all five source-declared indexes confirmed physically present
with exact column tuples (read from `v_db_index`, not `sys_index`); 367 scoped metadata rows
inventoried by class; every governed choice list, role, and containment re-read; the two `in_review`
specs' stored SHA-256 recomputed locally from the API-returned bytes and matched.

No further agent work is authorized without new scope. Do not rebuild product scope, approve a
spec, invoke a real model job, publish an update set, promote, close an enhancement, commit, or
push.

## WHY

The current rig is a strong proof-first development operating system, but it is still driven from
the shell. A human has to notice a request, start an agent, find the artifacts, understand which
version is authoritative, and manually keep the execution state in their head. A cron trigger alone
does not solve the control problem; it only wakes the same manual loop on a schedule.

The product owner's insight is the product:

> “why not put the spec files as a custom app itself, have it editable/reviewable in servicenow,
> and then have a series of buttons to drive/steer/direct these agents.”

The real pain is not “we lack a scheduler.” It is that human intent, exact review authority, agent
execution, Git state, and PDI verification do not share one durable, inspectable control surface.
The missing layer should make the workflow feel set-and-forget **without removing the human from the
loop**.

### What happens if we do nothing

- New requests still depend on somebody remembering to start the loop.
- The exact spec a human approved can drift from the file an agent builds.
- Two workers can overlap or repeat non-idempotent work without a durable claim.
- Failures remain terminal output in a shell instead of actionable status with notification.
- Reviewers must translate repository/process knowledge before they can make a gate decision.
- The rig stays a powerful workshop rather than becoming an operable development system.

## Desired outcome

A human opens one ServiceNow application and can see the enhancement pipeline, edit a Markdown
specification, submit an exact version for review, approve it for build or request changes, enqueue
allowlisted agent work, monitor the worker and heartbeat, inspect results/evidence, retry/cancel,
and receive notification when attention is required.

ServiceNow does not execute a shell. A local scheduled runner polls outward, claims one durable job,
invokes one cold agent, records results, and exits. Git remains the code/delivery authority. The PDI
remains the review environment. Humans retain both gates.

## WHAT

### Core architecture

```text
Human in ServiceNow
  │ authenticated buttons + editable draft
  ▼
ServiceNow control plane
  enhancement ── spec versions ── durable agent jobs ── notifications/dashboard
  │                                      ▲
  │ outbound Table/Control API           │ status + evidence pointers
  ▼                                      │
Local cold runner ── OS file lock ── allowlisted agent adapter
  │
  ├── exact approved SPEC.md ── Git working tree
  └── Fluent build/install/tests ── exact authorized PDI
```

### Authority split

| Concern | Authority | Rule |
|---|---|---|
| Enhancement and human gates | ServiceNow | Existing `u_sn_enhancement` fields remain authoritative. |
| Draft/review spec | ServiceNow | Versioned Markdown is editable only while draft. |
| Approved spec | ServiceNow hash + exported Git file | Approval freezes exact bytes/SHA; runner exports those exact bytes before build. |
| Application metadata/code | Git working tree | Fluent source is the only metadata authoring authority. |
| Agent intent/status | ServiceNow | Jobs are durable, allowlisted, idempotent records. |
| Execution | Local runner | Outbound poller invokes agents; ServiceNow never shells out. |
| Review environment | Authorized PDI | Install/read-back/tests/screenshots happen here only. |
| Promotion/closure | Human | Out of scope; automation stops before Gate 2 promotion/close. |

### Decisions

1. **Global Fluent/SDK application.** This matches the rig's proven delivery lane and avoids a new
   scoped boundary. All custom tables and columns use `u_` prefixes because the measured global
   silent-discard scar outranks newer permissive documentation.
2. **Direct SDK install for this experiment.** The product owner explicitly allowed skipping update sets. Do not
   run `sn-publish`; the human reviews in the PDI.
3. **Two new tables, one targeted augmentation.** Spec versions and agent jobs are app-owned. The
   existing enhancement table gains only current-spec/current-job references; no duplicate intake.
4. **Immutable review snapshots.** A submitted/approved/rejected/changes-requested version cannot be
   edited. Feedback produces a new draft version, preserving what the reviewer actually saw.
5. **Approval and queue insertion are one server transaction.** Gate 1 approval is invalid unless it
   freezes content, attributes the human, and produces exactly one build intent.
6. **Allowlisted actions, never arbitrary commands.** Buttons store typed intent; steering text is
   untrusted data. Neither a record nor a spec can supply a shell command.
7. **One worker in v0.** An OS file lock is the actual mutex. Job idempotency and claim tokens add
   durability/observability. Distributed leasing waits for a real second worker.
8. **Process one job and exit.** launchd/cron provides recurrence; model context remains cold and a
   failed daemon cannot silently accumulate state.
9. **Native Workspace for the shell; custom React for one earned surface.** Native lists/forms and
   dashboard handle ordinary CRUD/status. A custom Markdown workbench supplies edit/preview and
   authority controls without turning the whole app into a bespoke frontend.
10. **Notifications are part of v0.** ServiceNow generates attention emails; the runner provides a
    local fallback when the sleeping PDI cannot be reached.
11. **Fixture adapter before real model adapter.** The queue/mutex/claim/result path must be proven
    without spending model budget or allowing the test itself to rewrite the app.
12. **No Git commit/push.** The runner and implementing agent may modify the working tree but leave
    provenance as an evidence digest until a human grants commit authority.

### Rejected alternatives

- **“Just cron the existing loop.”** Trigger solved; durable intent, exact authority, overlap,
  failure handling, and review visibility remain unsolved.
- **Run Claude/Codex inside ServiceNow.** The platform should not hold local credentials, Git keys,
  or a shell. It also creates an inbound network/security problem.
- **Inbound webhook to the Mac.** A laptop endpoint is unnecessary; outbound polling is simpler and
  keeps the machine private.
- **Boolean mutex in ServiceNow.** It goes stale and cannot prove ownership. The v0 mutex is an OS
  lock; a future multi-worker design needs an atomic server lease.
- **Use Git as the draft review UI.** Reviewers lose native identity, actions, notifications, and
  ServiceNow context. Git becomes authority only after the exact reviewed content is frozen.
- **Editable approved specs.** That destroys the meaning of approval. New content means new version
  and a fresh Gate 1 decision.
- **A custom React cockpit for everything.** Native Workspace already solves navigation, lists,
  forms, dashboard, ACL-aware CRUD, and accessibility better.
- **ServiceNow AI/LLM APIs as the execution engine.** This rig's execution context and source live on
  the Mac; the app is a control plane, not a replacement model platform.
- **PDI keep-alive automation.** REST does not wake a sleeping PDI and automated login is not an
  acceptable reclamation workaround.
- **Distributed queue machinery now.** One worker is the actual requirement; speculative leasing is
  complexity without a consumer.

### Scope

**In:**

- global Fluent app source, lockfile, deterministic keys, and durable docs;
- targeted augmentation of `u_sn_enhancement`;
- `u_sn_spec_version` and `u_sn_agent_job` tables;
- roles, table/field/API/Workspace ACLs, and server-side transition service;
- native Workspace, dashboard, list navigation, forms, and Workspace-integrated UI actions;
- one React Markdown workbench with sanitized preview and authority rail;
- Scripted REST/control endpoints used by the workbench;
- job/event email notifications;
- headless ATF suite plus browser verification;
- local Python runner, fixture/Claude/Codex adapters, OS file lock, heartbeat, and launchd template;
- direct install and verification on the exact PDI;
- audit/build journal and rollback evidence.

**Out:**

- update-set creation or promotion;
- Git commit/push;
- production/test/customer instances;
- automatic Gate 2 promotion or enhancement closure;
- multiple concurrent workers or cross-machine leases;
- arbitrary user-authored actions, prompts, tools, or shell commands;
- a secrets UI or credentials stored in ServiceNow/Git;
- a full Git hosting/review replacement;
- automated PDI wake/keep-alive;
- historical migration of every existing repo spec into the app;
- mobile-specific UI beyond responsive/browser-accessible behavior.

## Domain model

### Existing table augmentation: `u_sn_enhancement`

Add only:

| Field | Type | Purpose |
|---|---|---|
| `u_current_spec` | reference → `u_sn_spec_version` | Current draft or approved version surfaced in the app. |
| `u_current_job` | reference → `u_sn_agent_job` | Most recent active/terminal job for fast status navigation. |

Do not duplicate `u_phase`, `u_gate_1_decision`, `u_gate_2_decision`, `u_repo_path`,
`u_package_name`, or `u_evidence_summary`. Their live choices/lengths were already confirmed and
must be re-read before authoring.

### New table: `u_sn_spec_version`

| Field | Type / constraint | Purpose |
|---|---|---|
| `u_enhancement` | mandatory reference → enhancement, restrict delete | Parent request. |
| `u_version` | integer ≥1; unique with enhancement | Monotonic human-readable version. |
| `u_title` | string 160, mandatory | Display name. |
| `u_state` | choice, server-governed | `draft`, `in_review`, `approved`, `changes_requested`, `rejected`, `superseded`. |
| `u_markdown` | long multi-line text, mandatory | Exact WHY/WHAT/HOW content. Verify actual installed capacity/no truncation. |
| `u_review_notes` | multi-line 8000 | Human feedback/steering for a new revision. |
| `u_content_sha256` | string 64, read-only | SHA-256 of exact submitted/approved bytes. |
| `u_authored_by` | reference → user, read-only | Creator identity. |
| `u_submitted_by` | reference → user, read-only | Human who submitted the snapshot. |
| `u_submitted_at` | date-time, read-only | Snapshot time. |
| `u_decided_by` | reference → user, read-only | Human who approved/rejected/requested changes. |
| `u_decided_at` | date-time, read-only | Decision time. |
| `u_repo_path` | string 255 | Exact exported `enhancements/<number>/SPEC.md` path. |
| `u_commit_sha` | string 64 | Optional later provenance; blank in this no-commit run. |

Indexes:

- unique (`u_enhancement`, `u_version`);
- non-unique (`u_enhancement`, `u_state`, `sys_created_on`).

Version assignment is server-side. Under the single-writer topology, compute max+1 and let the
unique index fail closed on a race; retry the calculation once, never silently overwrite.

### New table: `u_sn_agent_job`

| Field | Type / constraint | Purpose |
|---|---|---|
| `u_enhancement` | mandatory reference | Request being worked. |
| `u_spec_version` | conditional reference | Required for revise/build/verify/package actions. |
| `u_action` | mandatory allowlisted choice | `draft_spec`, `revise_spec`, `build`, `verify`, `package_review`. |
| `u_state` | server-governed choice | `queued`, `claimed`, `running`, `succeeded`, `failed`, `cancelled`. |
| `u_priority` | integer 1–1000, default 100 | Lower runs first. |
| `u_steering_note` | multi-line 8000 | Untrusted human instruction data. |
| `u_requested_by` | reference → user, read-only | Authenticated requester. |
| `u_requested_at` | date-time, read-only | Queue time. |
| `u_idempotency_key` | string 200, mandatory unique | Duplicate-action defense. |
| `u_worker_id` | string 120 | Non-secret runner identity. |
| `u_claim_token` | string 64 | Random ownership receipt; read back after claim. |
| `u_lease_until` | date-time | Observability/stale detection, not multi-worker correctness. |
| `u_heartbeat_at` | date-time | Last runner heartbeat. |
| `u_started_at` / `u_finished_at` | date-time | Execution bounds. |
| `u_current_step` | string 255 | Concise live progress. |
| `u_result_summary` | multi-line 8000 | Human-readable outcome. |
| `u_error_detail` | multi-line 16000 | Sanitized failure; no secrets/raw credential-bearing command. |
| `u_artifact_path` | string 255 | Evidence/build journal path. |
| `u_source_digest` | string 64 | Source-tree digest because SDK zip bytes are not stable. |
| `u_commit_sha` | string 64 | Blank unless a human later authorizes commit. |
| `u_update_set_sys_id` | string 32 | Blank in v0 direct-install lane. |
| `u_cancel_requested` | boolean | Cooperative cancellation for claimed/running work. |
| `u_retry_of` | self-reference | Retry lineage. |

Indexes:

- unique (`u_idempotency_key`);
- queue (`u_state`, `u_priority`, `u_requested_at`);
- active enhancement (`u_enhancement`, `u_state`).

### Roles

| Role | Contains | Powers |
|---|---|---|
| `global.ai_control_user` | `canvas_user` | Read app; create/edit drafts; submit; request jobs; cancel own/visible work. |
| `global.ai_control_reviewer` | user role | Approve/reject/request changes; retry; view all human evidence. |
| `global.ai_control_runner` | none | Read approved inputs and write machine-owned job/spec-draft fields only. |

Admin override remains available for the PDI owner. The runner role must have explicit field denies
or no grants for enhancement gate fields and spec decision fields. Hiding buttons is not security.

## State and action contracts

### Spec lifecycle

```text
draft ──Submit for review──> in_review
  ▲                              ├──Approve for build──> approved
  │                              ├──Request changes───> changes_requested ──runner──> new draft v+1
  │                              └──Reject────────────> rejected
  └──────────── Create new version from approved/rejected/changes_requested

approved ──later approved version exists──> superseded
```

- Only `draft` content is editable.
- Submit computes/stores SHA-256 and freezes the version.
- Approve recomputes SHA-256 and must match the submitted hash; otherwise fail and require a new
  submit. Approval records named human + timestamp, mirrors Gate 1 `approved`, advances phase to
  `build`, appends the prescribed attributed work note, and inserts exactly one build job.
- Request changes requires non-empty review notes, mirrors Gate 1 `changes_requested`, records the
  human, and queues exactly one `revise_spec` job.
- Reject records the human and mirrors Gate 1 `rejected`; it queues nothing.
- Post-decision edits require `Create new version`, which clones content into draft v+1, clears all
  decision/hash metadata, resets Gate 1 to `pending`, and returns phase to `spec`.
- Gate values must be checked against active `sys_choice` immediately before writes.

### Job lifecycle

```text
queued ──claim──> claimed ──start──> running ──finish──> succeeded
  │                  │                 ├──────────────> failed
  └──cancel────────> cancelled         └──cancel request──> cancelled at safe boundary

failed ──Retry──> new queued job linked by u_retry_of
```

- Terminal jobs never reopen. Retry creates a new row and new idempotency key.
- Immutable after insert: enhancement, spec, action, requester/time, idempotency key, retry parent.
- `claimed`/`running` require worker ID, claim token, and lease/heartbeat.
- A terminal transition requires finished time and result/error as appropriate.
- Same-state heartbeat/progress updates are allowed; this is the over-correction guard.
- A lease expiry never auto-replays a build. Mark the job failed/stale and notify a human to retry.

### Idempotency keys

Canonical key material is centralized in the server control service:

- draft: `draft_spec:<enhancement_sys_id>:<current_spec_version_or_0>`;
- revise: `revise_spec:<spec_sys_id>:<review_note_sha256>`;
- build/verify/package: `<action>:<approved_spec_sys_id>:<content_sha256>`;
- retry: `retry:<failed_job_sys_id>`; a failed job has at most one retry child. If that child fails,
  retry the child, producing a new lineage key without making the same parent ambiguous.

If the key exists, return the existing job; do not insert another. Approval double-clicks and
network retries must still yield one build job.

## Server control service

Create one package-private Script Include/service as the sole behavior seam for:

- create/clone spec version;
- submit for review;
- approve, request changes, reject;
- request allowlisted job;
- cancel and retry;
- compute exact SHA-256;
- update enhancement phase/gates/current references;
- append attributed work notes;
- insert notification events.

Native UI actions and Scripted REST routes are thin adapters calling this service. They must not
reimplement transition logic.

Every mutating method:

1. checks the actor's role server-side;
2. reloads authoritative records by sys_id;
3. validates current state and active choices;
4. validates content/action-specific prerequisites;
5. applies all changes in one transaction;
6. throws on any failed insert/update so partial gate/job state rolls back;
7. returns a small structured receipt containing record IDs, state, and content/idempotency hash.

Business rules are defense in depth for API/form bypass: immutable snapshots, allowed job state
transitions, immutable identity fields, approved-spec requirement, and runner prohibition on human
decisions. Do not duplicate the primary transition algorithm across rules.

## Control API

Create a versioned Scripted REST API used by the custom workbench. Require `X-UserToken` in browser
calls and explicit route ACLs. Return JSON receipts and actionable 4xx errors; never raw stack traces.

| Method/path | Role | Behavior |
|---|---|---|
| `POST /v1/enhancements/{id}/jobs` | user | Queue an allowlisted action with optional spec/note. |
| `POST /v1/specs/{id}/submit` | user | Freeze draft into review. |
| `POST /v1/specs/{id}/approve` | reviewer | Human Gate 1 + atomic build enqueue. |
| `POST /v1/specs/{id}/request-changes` | reviewer | Require note + revise enqueue. |
| `POST /v1/specs/{id}/reject` | reviewer | Human rejection, no job. |
| `POST /v1/specs/{id}/new-version` | user | Clone to new draft and reset Gate 1. |
| `POST /v1/jobs/{id}/cancel` | user | Cancel queued or request cooperative stop. |
| `POST /v1/jobs/{id}/retry` | reviewer | Clone failed job with lineage. |

The runner uses the Table API for queue polling/status because table/field ACLs are the protocol.
It does not need the human control endpoints.

## UI specification

### Subject, audience, single job

- **Subject:** governed AI development work, expressed as exact artifacts and explicit authority.
- **Audience:** enhancement owner/requester, human reviewer, and operator diagnosing a failed run.
- **Single job:** tell the human exactly what needs their decision next and make that decision safe.

### Native Workspace

Path: `/now/ai-development-control/home` (final exact path may change only if a live collision exists).

Navigation:

- **Intake:** Active enhancements; My enhancements.
- **Review:** Draft specs; Waiting for review; Approved specs; Changes requested.
- **Execution:** Queued/running jobs; Failed jobs; Completed jobs.

Dashboard “Authority queue”:

- Waiting for human review — spec `in_review` count.
- Work in motion — queued/claimed/running jobs.
- Failed / needs attention — failed jobs.
- Pipeline by enhancement phase — grouped visualization.
- Recent evidence — compact list of latest terminal jobs with result/artifact pointer.

Use native lists/forms/detail pages and Workspace V2 UI-action integration records. Create the
required `sys_ux_form_action` and layout-item records explicitly for every Workspace action.

### Markdown workbench

One React UI Page/route, linked from spec records:

```text
┌ Authority rail: version · state · exact hash · decision owner · next allowed action ┐
├───────────────────────────────┬─────────────────────────────────────────────────────┤
│ Markdown editor (5/12)        │ Sanitized preview (7/12)                            │
│ editable only in draft        │ headings/tables/code/criteria legible               │
├───────────────────────────────┴─────────────────────────────────────────────────────┤
│ Review notes / version history / job and repo evidence (flat ruled sections)        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

Design posture:

- inherit Polaris type and color tokens; do not invent a competing brand system;
- semantic colors only: neutral draft, blue review, green approved/succeeded, amber changes,
  red rejected/failed/cancelled;
- CSS Grid for macro layout, semantic regions, DOM depth under four per component;
- whitespace and rules instead of cards inside cards;
- left-aligned content; no purple gradient, glass, decorative hero, or motion theater;
- signature element is the authority rail, not decoration;
- one-dimensional button groups may use flex; no nested flex soup;
- preview sanitizes generated HTML and does not execute embedded HTML/scripts;
- warn on unsaved changes, preserve keyboard focus, support reduced motion and narrow screens;
- empty/error copy states the next action: “No spec yet — request a draft,” “Save the draft before
  submitting,” “The submitted hash changed — submit this version again.”

Contextual actions:

- enhancement: `Draft spec`;
- draft spec: `Save changes`, `Submit for review`;
- in-review spec (reviewer): `Approve for build`, `Request changes`, `Reject`;
- decided spec: `Create new version`, `Run verification`, `Prepare review packet` when applicable;
- job: `Cancel` or `Retry` only when valid.

## Local runner

Implement in Python 3 standard library unless an existing repo dependency clearly earns use.

### Process model

1. launchd invokes `runner/run-once` every five minutes.
2. The process acquires a non-blocking `fcntl` lock at a stable local path derived from the exact
   instance host. Lock contention exits successfully after logging “already running.”
3. It validates the host is the exact developer host from `~/.snpdi/env` and performs a read-only
   identity smoke check.
4. It fetches one queued job ordered by priority then request time.
5. It PATCHes claim token/worker/lease/state, then GETs the row and proceeds only if its exact token
   came back.
6. It validates action/spec state/SHA again locally.
7. It invokes one allowlisted adapter with argv arrays and `shell=False`.
8. A lightweight timer/thread PATCHes heartbeat/current step without model turns.
9. It records terminal result/evidence/source digest and exits.
10. SIGTERM/cancellation reaches the child process, then records cancelled at a safe boundary.

### Adapters

- **fixture:** deterministic no-model implementation used by tests. It produces a known draft or
  result artifact and cannot edit files outside a temporary fixture directory.
- **claude:** primary runtime adapter; command construction is hardcoded and takes the prompt via a
  file/stdin, not shell interpolation.
- **codex:** peer adapter with the same contract. invoke the CLI non-interactively where
  appropriate; preserve its journal protocol.

Provider selection comes from a local config allowlist, never a ServiceNow text field. Model output
is untrusted until artifacts/tests/read-back prove it.

### Action behavior

- `draft_spec`: fetch enhancement fields/attachments allowed by the parent loop, ask the agent for
  WHY/WHAT/HOW Markdown, then insert draft spec v1 in ServiceNow. Do not write a draft to Git.
- `revise_spec`: fetch immutable reviewed version + review notes, create new draft v+1, update
  `u_current_spec`, and leave the old version untouched.
- `build`: verify approved SHA, write exact bytes to `enhancements/<number>/SPEC.md`, invoke the
  implementation agent, build/install/read-back/test on the PDI, and record source/evidence paths.
- `verify`: rerun authoritative read-backs, ATF, and browser checks without changing human gates.
- `package_review`: assemble the Gate-2 evidence packet and notify the human; do not promote.

### Hibernation and notification

REST 502 does not wake the PDI. On repeated 502:

- do not claim or mutate a job;
- write a local runner-health receipt;
- emit a macOS notification and optional configured ntfy notification;
- exit; never automate a developer-portal login/keep-alive.

## Notifications

Generate ServiceNow events/notifications for:

- spec waiting for review → enhancement owner/assigned reviewer;
- changes requested or rejected → spec author/requester;
- job failed → requester + enhancement assignee;
- job succeeded → requester, with artifact/evidence pointer;
- stale/expired claim → reviewer/operator.

No hardcoded personal recipients. On a PDI, generated `sys_email` with correct recipients/content is
sufficient proof even if external sending is disabled. Notification text must not include full spec,
steering, secrets, raw command lines, or stack traces.

## Final source tree

The implementer may adjust filenames to SDK conventions, but the conceptual homes must remain:

```text
apps/ai-development-control-plane/
  README.md
  AGENTS.md
  HEAD_STATE.md
  SPEC.md
  BUILD_JOURNAL.md
  now.config.json
  package.json
  package-lock.json
  codex/APP.md
  src/fluent/
    data/tables.now.ts
    security/roles-acls.now.ts
    server/control-service.now.ts
    server/guards.now.ts
    api/control-api.now.ts
    ui/workspace.now.ts
    ui/actions.now.ts
    ui/spec-workbench.now.ts
    notifications/notifications.now.ts
    tests/control-plane.atf.now.ts
    generated/keys.ts
  src/server/
    script-includes/sn-ai-control-service.server.js
    business-rules/spec-guard.server.js
    business-rules/job-guard.server.js
    api/control-routes.ts
  src/client/spec-workbench/
    index.tsx
    styles.css
  runner/
    run-once
    ai_control_runner.py
    adapters.py
    prompt-templates/
    com.example.sn-ai-control-runner.plist
    README.md
  evidence/
    README.md
```

## HOW — implementation order

### Phase 0: gates and born-red receipt

1. Read the files in `AGENTS.md` order and open audit/build journals.
2. Run `../../scripts/sn-init --check`, then independent `../../scripts/sn smoke`.
3. Confirm exact dev host, REST auth, SDK auth, ATF enabled, SDK version, and PDI responsiveness.
4. Re-run targeted collision/schema/choice queries from `codex/APP.md`; do not run `/sn-map`.
5. Record born-red evidence: both app tables/roles/workspace absent and fixture flow nonexistent.
6. Inspect Git status and preserve unrelated dirt.

### Phase 1: scaffold and orient

1. Run `now-sdk init --help`, scaffold a global SDK 4.10.1 app in this existing directory without
   overwriting the handoff docs, then install pinned dependencies.
2. Ensure global projects use package resolver 2.0.0.
3. Because `now.config.json` now exists, run the complete now-sdk skill orientation: both topic
   lists, every returned topic, `keys-file`, and top-level help.
4. Search → peek → read full docs for every API actually used; run each subcommand's help before
   first use.

### Phase 2: data and security slice

1. Define enhancement augmentation and both tables with every custom column `u_` prefixed.
2. Define choices/indexes/audit/web-service access explicitly.
3. Define three roles and explicit table/field ACLs; never rely on `Table.userRole` auto-ACLs.
4. Build locally; inspect generated keys and `dist/` for name-field placeholder sys_ids.
5. Do not install yet unless the complete data/security slice builds and intended column counts are
   written in the journal.

### Phase 3: behavior and test slice

1. Author the central control service and thin adapters.
2. Add defensive business rules for bypass paths.
3. Author ATF tests before behavior is installed; the absent behavior is the born-red basis.
4. Build once after batching edits; fix compiler errors from documentation/types, not guessing.

### Phase 4: UI and notifications slice

1. Create Workspace/list config/dashboard/route ACL.
2. Create native UI actions plus required Workspace integration records.
3. Build the single React workbench with sanitized preview and Control API calls.
4. Create events/notifications and role-aware empty/failure messages.
5. Self-critique the UI plan against `frontend-structural`/`frontend-design` before build.

### Phase 5: runner slice

1. Implement fixture adapter, file lock, exact-host guard, queue poll, claim/read-back, heartbeat,
   terminal write, cancellation, and local logging.
2. Unit-test pure runner behavior locally: allowlist, key construction, lock contention, argv safety,
   secret redaction, state parsing, 502 behavior.
3. Implement Claude/Codex adapters only after fixture tests pass.
4. Do not install the LaunchAgent yet.

### Phase 6: build, pin, install

1. Run the full local test/build batch.
2. Count intended Fluent entities and dictionary columns from source/build output.
3. Run the global placeholder sweep and preserve the exact source-tree digest.
4. Run `now-sdk install --help`, then direct install using the existing PDI SDK credential.
5. If install is interrupted/502, read back before retrying. Never blindly replay.

### Phase 7: authoritative verification

1. Read back app/version/scope and each source-owned artifact class.
2. Count `sys_dictionary` columns for both tables and the augmentation; compare to spec exactly.
3. Read back active choices, indexes, roles, ACLs, API routes, Workspace/dashboard/list config,
   UI actions + V2 integration records, notifications, and ATF tests.
4. Create/assemble one ATF suite and run it headlessly via CI/CD; capture run/result IDs.
5. Run fixture end-to-end queue flow, including second-process lock contention and claim read-back.
6. Install the LaunchAgent only after fixture passes; run it once manually and inspect logs.
7. Use Playwright-over-CDP to verify Workspace, workbench, action visibility, edit/preview, failure
   states, and responsive layout. Close opened tabs and review screenshots for secrets.
8. Verify notifications through `sys_email` and journal-field attribution through
   `sys_journal_field`.

### Phase 8: handoff

1. Assemble `BUILD_JOURNAL.md` and `evidence/README.md` with exact counts, IDs, hashes, commands,
   tests, screenshots, rollback context, and honest gaps.
2. Leave the PDI at human review. Do not set Gate 2, close an enhancement, promote, commit, or push.
3. Update `HEAD_STATE.md` as a cache pointing to evidence/codex; update the run journal/audit log.

## Verification matrix

| Claim | Happy | Bad path | Over-correction/control |
|---|---|---|---|
| Submit spec | Non-empty draft freezes hash and enters review | Empty draft/invalid state rejected | Draft remains editable before submit |
| Approve | Reviewer attribution + Gate 1 + exactly one build job | Non-reviewer/runner rejected; hash drift rejected | Double-click/network retry returns same job |
| Changes | Non-empty note creates revise job | Empty note rejected | Old review snapshot remains immutable |
| Versioning | New draft v+1 clears decision metadata | Duplicate version blocked | Prior approved version remains readable/superseded |
| Job states | queued→claimed→running→succeeded | Illegal jump/terminal reopen rejected | Same-state heartbeat/progress allowed |
| Cancellation | Queued cancels; running stops at safe boundary | Terminal cancel rejected | Other jobs unaffected |
| Runner mutex | One fixture job completes | Second process exits without claim | Next run can acquire lock after first exits |
| Claim receipt | Exact token read back before execution | Mismatched token aborts without child process | No-job run exits cleanly |
| Input safety | Normal steering reaches prompt data | Shell metacharacters never execute | Literal text survives unchanged in artifact |
| ACLs | Intended role can perform its action | runner cannot decide; user cannot approve | admin PDI access remains for recovery |
| UI | Workbench saves/preview/actions work | sanitized malicious Markdown and errors are safe | narrow screen/keyboard/native forms still usable |
| Notifications | Correct attention email generated | no recipients produces visible config/test failure | no spec/secrets/raw stack in message |
| PDI delivery | install/read-back/counts/tests match | 502/partial install treated as in doubt | unrelated existing records untouched |

## Acceptance criteria

1. A human can file/use an enhancement and request a spec without leaving ServiceNow.
2. The fixture runner creates a ServiceNow draft spec; the human can edit it in the workbench.
3. Submitting creates an immutable reviewed snapshot with a correct SHA-256.
4. Only a reviewer can approve; approval records identity/time, sets exact Gate 1 values, advances
   phase, and creates one build job atomically.
5. Approved content cannot change. A new version resets authority and preserves history.
6. ServiceNow cannot provide a shell command or arbitrary action to the runner.
7. The runner processes one job at a time under a real OS lock, verifies its claim token, emits
   heartbeats, writes terminal evidence, and exits.
8. Queue retries, double clicks, and network ambiguity do not create duplicate build intent.
9. The dashboard exposes waiting review, active work, failures, pipeline, and recent evidence.
10. Native UI and workbench are role-correct, accessible, sanitized, responsive, and visually
    coherent with Polaris.
11. Failure/success/review events generate correct notifications without leaking sensitive data.
12. ATF covers every custom behavior with happy/bad/control paths and passes headlessly.
13. Every table column, choice, ACL, role, route, UI action, Workspace record, notification, and
    test is read back from the PDI and matches source.
14. No update set, promotion, production contact, broad map, Git commit, or push occurs.
15. The build journal names anything not verified; silence is never rounded up to success.

## Rollback and failure posture

- First SDK install should create a rollback context; capture its ID but do not execute rollback
  without fresh human authorization.
- On partial install, stop dependent writes and inventory actual state before repair/reinstall.
- On failed read-back/test/UI evidence, mark verification failed and return to source; do not hide a
  mismatch in prose.
- Runner failures preserve job/error/evidence and never auto-replay a build.
- Fixture records are prefixed/attributed and left unless safe cleanup was designed and explicitly
  authorized. Never broad-delete PDI data.
- Uninstall is not part of the one-shot run. Source + rollback context are the recovery mechanisms.

## Implementation-time probes, not open design decisions

- Verify SDK 4.10.1 exact APIs/field names through `now-sdk explain`; never rely on this prose over
  current generated types.
- Verify the actual large-text column capacity after install; a truncating spec field fails the app.
- Verify Workspace V2 action integration and UI Page route on this PDI with browser evidence.
- Verify whether outbound email sends; generated `sys_email` is the v0 acceptance floor.
- Verify installed Claude/Codex CLI syntax without printing secrets; fixture remains the gate.
- PDI hibernation remains a human wake boundary by design.

## Confidence

**Implementation is green and closeout is complete.** The architecture and runtime were exercised
on SDK 4.10.1/Australia, and the installed state was re-derived from the PDI on 2026-08-09 rather
than carried forward from the build run's own report.

What remains is honest residue, not unfinished work: notifications are one-fifth exercised on an
instance whose SMTP is disabled; the composite index's unique flag has functional proof but no
metadata receipt, because no read-only surface on this platform exposes one; role behaviour is
proven by ATF under `GlideRecordSecure` rather than by a non-admin browser session; and no
model-backed adapter has ever run. Each is listed with its consequence in
[`evidence/handoff.md`](evidence/handoff.md).
