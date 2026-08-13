# Codex: AI Development Control Plane

> Bounded, on-demand truth for implementing and operating this app. Read with the parent
> `codex/servicenow.md`; this file owns app-specific decisions and the 2026-08-08 targeted baseline.

## Why this codex exists

`SPEC.md` says what to build. This file records what the next agent must not have to rediscover:
the exact baseline already proven, which SDK surfaces were verified, which ServiceNow failure modes
are load-bearing here, and which claims still need wire-time proof.

It is intentionally not an instance profile. Broad `/sn-map` was waived for this build. Anything
outside the app's touched surfaces remains unknown and irrelevant.

## THE BOUNDARY — v0.0.2, 2026-08-09 (supersedes the job-table design below)

The product owner's ruling, and it is the shape of the whole app: *"it should just be a middleman, a spec
writer/editor/audit/state… it's more a repository / handoff boundary than something intimately
wired into the workflow."*

`u_sn_agent_job` is **deleted from source** — 24 columns, 3 indexes, its ACLs, its two business
rules, three of five notifications, and roughly half the runner went with it. What it modelled
already existed: the intake record carries a seven-phase lifecycle and two gate decisions, and
`task` supplies `work_start` / `work_end` / `assigned_to`. Two state machines for one flow is
what forced approval to be a five-part atomic transaction; deleting one dissolves the
requirement instead of solving it.

**The whole machine protocol, on fields that already existed:**

| | mechanism |
|---|---|
| work available | `u_phase=spec` + the current spec's own state picks the action (none → draft, `changes_requested` → revise, `approved` → build) |
| claim | `claimBuild` moves `u_phase` spec→build and stamps `work_start` — a server-side compare-and-swap |
| finished | `finishBuild` → `package_verify` + `work_end` + `u_evidence_summary` |
| failed | stays in `build` with `work_end` stamped |
| stuck | the scheduled sweeper stamps `work_end` — **the same shape as a failure, so a crash and a failure have exactly one recovery path** |
| retry | `retryBuild`, reviewer-only, clears the clock; approval stands |

**Approval no longer advances the phase.** A human decision records a decision; only a worker's
claim moves spec→build. That is what keeps `build` from lying about somebody being on it, and it
is what the sweeper reads. Pinned by ATF (`submit and approve exact snapshot` asserts
`u_phase=spec` after approve).

**`request-draft` HANDS THE WORK TO WHOEVER POLLS FIRST** (measured 2026-08-09, live LaunchAgent
runner in fixture mode). That is the design working, and it surprises the agent that called it. An
agent drove the loop by hand: `POST …/request-draft` → `u_phase=spec` with no current spec → the
runner's next poll selected `draft_spec` and wrote its **fixture** draft, ~3½ minutes later. The
agent's own insert then died on the unique index over (`u_enhancement`, `u_version`).

Three things that generalise past this one race:

- **A pre-write collision check is only true for the instant it ran.** The agent had queried the
  spec table three seconds earlier and correctly got zero rows. On an instance carrying an
  autonomous worker, that instant is short.
- **The Table API surfaced only `Operation Failed` / `Error during insert`.** The constraint name
  and duplicate key existed **only in `syslog`** — one query killed three wrong hypotheses (payload,
  ACL, the business-rule guard). Same lesson the parent codex records for record-producer 500s, now
  confirmed for Table API inserts. (The key printed as `u_enhancement` because the platform names an
  index after its leading column — see the index scar below.)
- **The fix is to adopt, not to create.** `saveDraft` PATCHes whatever draft exists and does its own
  read-back; version history stays intact and nothing is deleted or duplicated. Read
  `request-draft` as *"a draft will appear — adopt it"*, never *"a slot is reserved for me."*

**The same hazard sits at the approval step, and it is the sharper one:** an `approved` spec selects
`build`, so a loaded fixture runner will claim a record the moment a human approves it. Either stop
the LaunchAgent while an agent drives the loop by hand, or expect to clean up a fixture build.

**The sweeper fires — measured, not assumed.** `2026-08-10 02:30:01` UTC, `source=*** Script`, no
ATF run in the window, `sys_trigger.next_action` advanced one period. This also resolved the
platform's open question: periodic `sysauto_script` works on a PDI; only the on-demand Run Once
path is broken.

**Why a retry is never a timer.** In a queue, silent retry is correct. In a governed change
process, work that re-runs itself because a lease expired is the exact thing an auditor asks
about. The sweeper closes the clock and notifies; a human decides.

**No phase-guard business rule was added**, deliberately: `u_sn_enhancement` is shared with the
rest of the rig (`/sn-loop` writes it), so a guard installed by this app would police a lifecycle
it does not own. `SnAiControlService` is the one seam; the runner's field grants are layer two.

**The runner's entire write surface** is now three guarded REST transitions plus four columns
(`u_phase`, `work_start`, `work_end`, `u_evidence_summary`). It holds no grant on any gate field —
proven by ATF under `GlideRecordSecure`.

## Installed state — RE-VERIFIED 2026-08-09

The global app v0.0.1 is active on the sole authorized PDI (scope sys_id in `now.config.json`).
Final source digest is `55b6944bb98b64441b1b4f00355a3b785329c7e1e086fc767b82aef9359b7e45`
(recipe unrecorded — see the digest scar below).

Authoritative counts, fixture IDs, ATF/browser receipts, rollback, indexes, and the acceptance
matrix live in `../evidence/` (local run records — not in this repository) — start at `../evidence/handoff.md`. `../BUILD_JOURNAL.md` carries
the dated execution entries. This supersedes the blank-state baseline below for pickup; the
baseline remains the born-red receipt.

**Every material receipt is now banked.** The app is parked at the human review gate: two spec
versions `in_review`, one `draft`, Gate 1 `pending` and Gate 2 `not_reached` throughout.

## Live baseline — VERIFIED 2026-08-08

Read-only commands completed before the aborted build:

- `../../scripts/sn-init --check` → 13 passed, 0 warnings.
- exact instance: the operator's own developer PDI (developer host only — never a customer instance).
- REST identity smoke → authenticated as the configured PDI admin.
- Node `v26.5.1`.
- global/installed `now-sdk 4.10.1`.
- SDK credential present for the exact instance.
- ATF runner already enabled.
- intake table `u_sn_enhancement` present with 8 custom columns.
- record producer present.

No ServiceNow write occurred. A post-abort read-only re-query at 13:29 HST returned zero rows for
the exact application name, both proposed tables, and all three final role names. Specifically
absent from the PDI:

- `u_sn_spec_version`;
- `u_sn_agent_job`;
- roles `global.ai_control_user`, `global.ai_control_reviewer`, `global.ai_control_runner`;
- an application named `AI Development Control Plane`.

Workspace foundation tables `sys_ux_page_registry` and `sys_ux_app_config` exist. Their presence
does not prove the final Workspace will render; install + route ACL + dashboard + browser evidence
remain mandatory.

## Existing enhancement contract — VERIFIED 2026-08-08

Direct dictionary query returned these app-owned fields on `u_sn_enhancement`:

| Field | Type | Capacity / notes |
|---|---|---|
| `u_requested_outcome` | string | 8000 |
| `u_phase` | string choice | 40 |
| `u_gate_1_decision` | string choice | 40 |
| `u_gate_2_decision` | string choice | 40 |
| `u_repo_path` | string | 255 |
| `u_package_name` | string | 80 |
| `u_evidence_summary` | string | 4000 |
| `sys_id` | GUID | system field returned by the query |

Inherited Task fields are not in that per-table result. `number`, `short_description`,
`description`, `assigned_to`, `opened_by`, `active`, and `work_notes` must be queried through the
table hierarchy before use. Never mistake the per-table result for the full schema.

Active stored choice values:

### `u_phase`

`intake`, `talk_story`, `spec`, `build`, `package_verify`, `review`, `closed`

### `u_gate_1_decision`

`pending`, `approved`, `changes_requested`, `rejected`

### `u_gate_2_decision`

`not_reached`, `promoted`, `rejected`

The app must reuse these exact values. Re-query immediately before writes because choice validity is
a live-data claim and ServiceNow silently ignores inactive/nonexistent values.

## Targeted pre-write query set

Run equivalent narrow queries and save responses to the build journal/evidence directory. Do not
dump personal user data.

1. Exact host/auth: `sn-init --check`, then `sn smoke`.
2. Collisions: `sys_db_object` for the two table names and `sys_app` for name/scope.
3. Existing enhancement dictionary: table + inherited parent fields actually consumed.
4. Active choices for all three existing enhancement choice fields.
5. Role collisions for the three final role names.
6. Existing UI actions on each target table by name/action name before emitting Workspace bridge
   records.
7. Workspace route/path collisions and dashboard/list-config names.
8. Existing Scripted REST namespace/service collision.
9. Existing notification/event name collision.
10. Required platform role existence: `canvas_user` and any UI Page/Workspace runtime roles selected
    by current SDK docs.

A surprising zero or large count must be re-derived a second way. An invalid dot-walk can return
every row and look like success.

## SDK 4.10.1 knowledge — VERIFIED from bundled `now-sdk explain` 2026-08-08

The aborted scaffold was a distinct global Fluent project and completed the mandatory orientation:
both quickstart/fluent-language topic lists, every returned topic, `keys-file`, and CLI help.

Load-bearing surface facts:

- `now.config.json` accepts `scope: "global"`, `scopeId`, and requires package resolver `2.0.0+`
  for global modules.
- `Table` can create the two tables and `augments` can add fields to the existing enhancement table.
- `allowWebServiceAccess: true` is required for Table API runner access.
- SDK 4.10.1 docs say owned new-table columns may be bare, but this project still prefixes every
  custom column `u_` because the parent codex measured global loader silent discard on bare names.
- Define `Role` and explicit `Acl` records. Parent empirical evidence says table auto-ACL properties
  did not materialize reliably under SDK 4.9.2.
- `ScriptInclude` is string-only and uses `Now.include`; `Class.create` name/prototype/type must
  match. A package-private central service is valid.
- `UiAction` supports server scripts, role/condition gates, forms/lists, and Workspace V2 flags.
- A Workspace V2 UI Action also needs explicit `sys_ux_form_action` and
  `sys_ux_form_action_layout_item` records or it is unreachable.
- `Workspace` provides the app shell; `UxListMenuConfig` supplies categories/lists.
- A Workspace requires a `Dashboard`, visibility linking dashboard→workspace, and a `ux_route` ACL
  whose field matches `{workspace.path}.*`.
- `Dashboard` uses a 48-unit grid and table-backed visualizations.
- `UiPage` supports React 18.2.0 and ServiceNow React components. Use normal SDK client build rules;
  do not invent a custom bundler config.
- UI Page browser calls use the user's session token (`X-UserToken`) and server ACLs.
- `Test` authors Fluent ATF records. Headless verification should use server-side steps; form/UI
  steps require a browser runner and are not substitutes for Playwright evidence.
- `Now.ID` creates stable identities; never fabricate sys_ids. `keys.ts` is committed source when
  commit authority eventually exists.
- Removing a Fluent entity can generate an upgrade-time delete through `keys.ts`; never delete
  source casually after installation.
- `now-sdk build` output is not byte-stable because some placeholders regenerate. Pin the exact
  install candidate and record a source-tree digest.

The next scaffold is a new distinct Fluent project. The now-sdk skill requires repeating complete
orientation after the new `now.config.json` exists; this cached summary does not waive it.

## ServiceNow scars that directly shape this app

### Silent success is the default failure mode

- HTTP 200/201 and SDK “installation completed” are transport outcomes, not state proof.
- Global dictionary inserts can report success while columns vanish.
- Invalid choice values report success and preserve the old value.
- Unknown fields disappear from `sysparm_fields`, so omission is not proof of empty data.
- Unresolvable encoded-query dot-walks may drop the filter and return every row.

Countermeasure: introspect → write → read back → count → exercise runtime.

### Global column law

Every new field in this app is `u_` prefixed, including fields on app-owned `u_` tables. This is a
deliberate conservative override of SDK docs because the instance loader was empirically observed
discarding bare global dictionary columns with no error. Count dictionary rows after install.

### Roles/ACLs must be explicit

Do not trust `Table({ userRole, createAccessControls })`. Author each role and each record/field/API
ACL in Fluent. Read them back. Verify behavior under user/reviewer/runner identities, not admin alone.

Task inheritance matters on the enhancement table: `work_notes` security can come from `task` and
silently discard an agent write. After any attributed note, GET `sys_journal_field` and prove it.

Execution sharpened that law. Dictionary `readOnly: true` overrides an otherwise correct field ACL
for `GlideRecordSecure` and Table API writes; machine-owned fields stay dictionary-writable and use
specific runner ACLs. Also, `setValue('work_notes', text)` updated the parent but created zero
journal rows; direct journal assignment worked. The app's helper now requires exact
`sys_journal_field` read-back.

ATF has two related blind spots: RecordUpdate can succeed after ACL stripping, so assert
`GlideRecordSecure.canWrite()` plus independent read-back; and an intentional unique-index error
still fails a `failOnServerError=true` test even when caught. Bank the red database receipt, then
test uniqueness with a non-error count/idempotency control.

### Name fields vs reference fields

Passing a Fluent object to a field that stores a **name string** can emit a placeholder sys_id that
installs literally. Use literal table/name strings where the field schema is a string. Before every
install, scan `dist/` for name-carrying fields containing 32-hex placeholders.

An external role has the inverse trap: `Role.containsRoles: ['canvas_user']` treats the bare name
as a new deterministic identity. Use `Now.ref('sys_user_role', <verified live sys_id>)`; the final
installed relationship contains the real platform `canvas_user` record.

### UI Page and browser API edges

- Scripted REST browser responses arrive as `{result:{ok,...}}`; unwrap `result` before testing the
  authority receipt.
- SDK UI Page scripts must not contain HTML CDATA markers. Jelly split `//]]>` into `//]]` plus a
  bare `>`, producing a syntax error while the React module still rendered. Removing the markers
  produced the final zero-error pass.
- Sanitizer evidence is DOM evidence, not a substring ban: hostile source is shown as escaped text.
  Assert no executable element/attribute/link exists and no side effect fires.

### Augmentation install counter

The enhancement augmentation emitted `sys_documentation_u_sn_enhancement__en`; the loader reported
one `Skipped Error` because the coalesced table-label row already existed. Browser detail plus live
read-back proved the correct `AI Enhancement` / `AI Enhancements` label was preserved and every
intended field/runtime gate landed. Resolve this exact counter; never silently ignore it.

### Exact hashes

Use platform `GlideDigest.getSHA256Hex` (present in 4.10.1 Glide types) for spec bytes. Define the
byte normalization once: UTF-8 text exactly as stored, with no trim/newline normalization during
submit, approve, API response, or Git export. If the platform text field alters line endings, detect
and specify the canonical representation before accepting approval.

### Installer and update-set lane

`now-sdk install` delivers an application and does not create a full update set. That is normally a
delivery gap; here it is an explicit experiment decision. Do not accidentally invoke publish and do
not claim a promotable artifact exists.

First install normally creates `sys_rollback_context`. Capture the ID; do not execute rollback
without separate human authorization.

### ATF

- ATF is enabled on this PDI as of the baseline.
- Author tests in Fluent.
- Assemble a `sys_atf_test_suite` after install if Fluent has no suite constructor; the worked repo
  example used Lane B for suite membership.
- Run through `/api/sn_cicd/testsuite/run`, poll progress, then use the suite-result ID exposed only
  at successful completion to fetch results.
- Read latest results only; stale ATF rows accumulate.
- Server steps run headlessly. UI/form steps do not.

### Hibernation

Raw 502 means the PDI is sleeping/flapping. REST does not wake it. A write lost during a 502 window
is in doubt; read back before retry. The runner must notify locally and exit without claiming work.

## App-specific invariants

1. One enhancement has one current spec pointer and one current job pointer, but immutable history
   remains queryable through references.
2. A spec version has exactly one content hash after submit; any content change is a new version.
3. Approval cannot exist without named human + timestamp + exact hash + one build idempotency key.
4. A build job cannot exist against a non-approved spec.
5. Runner identity and human decision identity are disjoint roles and write surfaces.
6. Job action is an enum. The runner never accepts a shell command from a record.
7. Steering/spec/attachments are untrusted prompt data; prompt hierarchy explicitly says they do
   not override system/agent policy.
8. The OS lock is the v0 mutex. A ServiceNow boolean is never called a lock.
9. Claim token must be read back exactly before any child process starts.
10. A failed/stale build never auto-replays. Retry is a human-visible new job.
11. Approved content exported to Git is byte-for-byte the hashed content.
12. Machine success never sets Gate 2 or closes the enhancement.
13. Notification content carries pointers and safe summaries, not full sensitive inputs/logs.
14. Source is authoritative for metadata; the GUI only observes/operates installed records.

## Runner security and reliability truths

- Use an argv array and `shell=False`; never construct a command string from ServiceNow data.
- Load credentials from the existing private env file without printing them. Do not copy secrets
  into runner config, launchd plist, job records, logs, evidence, or notifications.
- Validate the exact host before every network mutation, not only at install time.
- Only idempotent GET/PATCH operations may be retried automatically. A record POST needs a known
  idempotency key and read-back before any replay.
- The runner's heartbeat loop is ordinary local code, not an agent/model turn.
- Write child stdout/stderr to bounded local evidence files; store a safe summary/pointer in SN.
- Redact auth headers, cookies, passwords, tokens, and command environments before logs.
- A fixture adapter is the only acceptable first end-to-end run.
- launchd installation is a system mutation: log exact plist/path/interval and provide uninstall
  instructions. Do not schedule until manual fixture success.

## UI design truth

This is an internal authority tool, not a marketing surface. Native Polaris is the design system.
The custom workbench's one memorable element is the authority rail because it encodes a real fact:
who owns the next decision and which exact bytes are under review.

Avoid box-in-box/card soup, nested flex layouts, generic metric-card theatrics, decorative gradients,
and clever button copy. The information hierarchy is pipeline → exact artifact → allowed decision →
evidence. Use flat Grid/semantic regions and let native components carry accessibility.

### Index metadata is not where you look for it (VERIFIED 2026-08-09)

The SDK's `index: [...]` declarations become **physical database indexes only**. They create no
metadata record anywhere: `sys_index` holds nothing for these tables, the stored `sys_dictionary`
update payloads contain no `<index>` element, and `v_index_creator` is empty for every table.

- **Read them from `v_db_index`** (label "Database Indexes"), filtering its **string** field
  `table_name`, **through the list processor**: `v_db_index_list.do?sysparm_query=table_name=<t>&XML`.
  The Table API returns 0 rows for it — it is virtual — so a REST zero means nothing.
- **The platform discards your declared index name** and names the index after its **leading
  column**, disambiguating with `_2`. A read-back searching for `u_sn_agent_job_idempotency` finds
  nothing and reads as a failed install. **Verify by column tuple, never by declared name.**
- **`sys_index` has two table-ish fields and only one is a name:** `logical_table_name` (string,
  label "Table") and `table` (**reference**, label "Reference Table"). Filtering names against the
  reference column silently yields zero — the failure that stalled this receipt.
- **A Task-derived table has no indexes of its own**; its rows live in `task`'s physical table, and
  its custom columns occupy generic aliased slots (`a_ref_1`…), so per-column attribution is not
  possible there.
- **No read-only surface exposes an index's unique flag.** `v_db_index` has no unique column and
  `sys_index` has no row. Uniqueness must come from `sys_dictionary.unique` (column-level only) or
  from a functional proof.

### Deleting a table from Fluent source deletes its BEHAVIOUR, not its SCHEMA (VERIFIED 2026-08-09)

Removing `u_sn_agent_job` from `tables.now.ts` made `now-sdk build` emit **68 `deleted: true`
tombstones** into `generated/keys.ts` — including one whose target is `sys_db_object`. That reads
like the table will be dropped. Measured after `now-sdk install`:

| artifact | after install |
|---|---|
| ACLs on the table | **0 — deleted** |
| UI actions on the table | **0 — deleted** |
| business rules on the table | **0 — deleted** |
| email notifications on the table | **0 — deleted** |
| `sys_db_object` row | **STILL PRESENT** |
| the `u_current_job` column on the augmented table | **STILL PRESENT** |
| rows in the table | **3, STILL PRESENT** |

**So an install leaves an orphaned table carrying live data with every one of its ACLs
removed.** Source says the table does not exist; the instance says it does, now unprotected. That
gap is invisible to anyone reading the repo, which is the dangerous half.

**Law:** after removing a table from Fluent source, verify `sys_db_object` and the dictionary
directly, and drop the physical table as a **separate, deliberate, human-authorized step**. Never
infer removal from a clean build, a successful install, or the presence of tombstones.

### The silent filter drop is not confined to app tables (VERIFIED 2026-08-09)

Reading the ATF results for a run, `sys_atf_test_result?sysparm_query=test_suite_result=<id>`
returned **102 rows spanning every app on the instance** — every historical ATF result, with
failures in them from unrelated suites. The field does not exist; the real one is **`parent`**
(reference → `sys_atf_test_suite_result`). Same scar as the `/sn-map` one: **an unresolvable field
name drops the condition instead of erroring**, and here it fabricated a plausible-looking
failure list for a run that was 4/4 green. Verification tables are not exempt — the tool you
check your work with can lie the same way.

### The source digest is reproducible — the recipe is code, not prose (VERIFIED 2026-08-09)

`runner/ai_control_runner.py::source_digest()` is the definition: `now.config.json`,
`package.json`, `package-lock.json`, then everything under `('src','runner','tests','launchd')`
recursively, `__pycache__` excluded, sorted by relative path, hashing path bytes then file bytes.
Rerunning it returns `55b6944b…` exactly, so the tree is byte-identical to the install candidate.

**The scar is how that was nearly recorded as a gap.** A `command grep`-less search for the recipe
returned zero because this app directory is gitignored and the shell's `grep` wrapper honours
ignore rules — a silent filter drop, the same failure family as an unresolvable encoded query
returning every row. **A zero from a search tool is a claim about the tool as much as the tree.**
When a zero is load-bearing, re-run it with `command grep` (or an explicit path) before believing it.

## Wire-time results — all receipts closed

1. Markdown capacity is 65,535; a 9,642-byte exact save/read-back passed. Submitted 132-byte
   fixtures match platform/computed SHA-256 exactly.
2. React UI Page and Workspace render on Australia; the final Playwright pass was zero-error and
   screenshots cover draft, review, 390px, and dashboard states.
3. Nine V2 action bridge/layout pairs and all native UI records read back; review controls rendered
   but were deliberately not clicked.
4. Role boundaries are proven by final 4/4 ATF, not assumed from admin semantics.
5. SMTP is disabled; a correctly addressed pointer-only send-ready email satisfies v0. Measured
   2026-08-09: only **one** of the five notifications ever generated a `sys_email`. The others
   were suppressed by `sendToCreator: false` (the sole recipient was the acting user) or fired
   only inside rolled-back ATF transactions. See `../evidence/notifications.md`.
6. Fixture/provider argv seams exist and unit-test green; only fixture mode was invoked by design.
7. Transition/idempotency controls pass headlessly; no human gate was crossed in live fixtures.
8. Pre-source collisions were zero and final artifact counts match source.
9. **Closed 2026-08-09:** all five declared indexes are physically present with exact column
   tuples and order, read from `v_db_index` (see the index scar above). Two limitations stand:
   declared index names are discarded by the platform, and no read-only surface exposes an index's
   unique flag.
10. **ATF rollback poisons event evidence.** Every notification event raised inside a test points
    at a record ATF has since deleted, so the event lands in `state=error`. Twenty-seven of the
    thirty-four events fired by this app are that case — verified individually, not assumed.
    When counting events, separate test-raised from runtime-raised before drawing a conclusion.

## Evidence required at handoff

- exact preflight output summary (no secrets);
- source-tree digest and final generated keys;
- build command/result and placeholder sweep;
- install progress/upgrade/rollback IDs;
- dictionary expected vs actual counts;
- active choice read-back;
- roles/ACLs and impersonated behavior results;
- Workspace/dashboard/actions/API/notification record counts;
- ATF suite/progress/result IDs and per-test status;
- fixture runner lock/claim/heartbeat/terminal receipts;
- LaunchAgent path/status/uninstall command if installed;
- Playwright conclusions and reviewed screenshot filenames/hashes;
- notification `sys_email` evidence;
- known gaps and explicit statement: no update set, promotion, commit, or push.

## Task router

| Need | Start |
|---|---|
| What is proven, what is not | `../evidence/handoff.md` (local, not shipped) |
| Full product behavior and acceptance | `../SPEC.md` |
| Agent authority and hard walls | `../AGENTS.md` |
| Cold pickup | `../HEAD_STATE.md` (local, not shipped) |
| Platform scars/details | parent `../../../codex/servicenow.md` |
| Enhancement gates/work notes | parent `../../../enhancements/loop.md` |
| Machine/PDI preflight | parent `../../../scripts/sn-init --check` |
| Raw targeted introspection | parent `../../../scripts/sn` |
| SDK Fluent truth | local `now-sdk explain` after scaffold |

## Freshness

All empirical claims above were verified or observed on 2026-08-08, and the installed state,
counts, roles, choices, hashes, indexes, and notification behaviour were **re-derived from the PDI
on 2026-08-09**, unless a parent scar carries its own earlier date. Re-derive live state before
mutation. Do not turn this codex into a permanent instance profile; retain only app-specific facts
and paid-for scars after implementation.
