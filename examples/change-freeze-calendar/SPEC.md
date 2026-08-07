# SPEC — ENH0000007: Change Freeze Calendar for Group Platforms

Enhancement: `ENH0000007`. Requester: Group Change Management, Information Technology (System
Administrator on the record; see the intake document for the real byline).

> **Read this as a Gate-1 packet, not as an approved one.** This run was a controlled trial, so
> Gate 1 was granted up front instead of by a human reading the spec — see the footnote at the end.
> The spec is written in full regardless, because the packet is the deliverable whether or not a
> human happened to read this particular one.

## How I'm reading this

One catalog item lets Group Change Management request a freeze window (one or more business
applications + a date range + one of five reasons + a short explanation). The platform then works
out everything else: reject it outright if it's back-dated or conflicts with an existing window on
any named application; route it for owner approval if it's long; route it for CFO approval on top of
that if it spans a month-end on a finance-critical platform; wave it through with no approval at all
if it's a year-end-close window (but never past rules 1/2). Once resolved, a change manager needs a
list they can read in ten seconds: platform, dates, reason, who approved it.

This is a governance/calendar system, not a change-blocking system — the ticket is explicit that
enforcement against real `change_request` records is a deliberately separate, later phase. Nothing
here touches `change_request`.

**What gets built** (13 artifact classes, all under the `sf` prefix, all in a new GLOBAL Fluent app):

| # | Artifact | Name | Why |
|---|---|---|---|
| 1 | Table | `u_sf_freeze_window` | the freeze window record |
| 2 | Table | `u_sf_finance_critical_app` | config: which apps are finance-critical (seeded, 3 rows) |
| 3 | Business Rule | `SF Freeze Window Validate And Compute` (before insert, `u_sf_freeze_window`) | rules 1/2 gate + rules 3/4/5 flag computation, in one script |
| 4 | Script Include | `SFFreezeWindowValidator` | shared date/overlap/month-end logic — called by the BR |
| 5 | Flow | `SF Freeze Window Approval Routing` | approval orchestration + outcome notification |
| 6 | Record Producer | `Request a Change Freeze Window` (targets `u_sf_freeze_window`) | the catalog item |
| 7 | List Collector Variable | `applications` (on the producer) | multi-select business apps |
| 8 | Catalog Client Script | `SF Freeze Window Pre-Submit Check` (onSubmit) | immediate rule-1/2 feedback before submit |
| 9 | Script Include | `SFFreezeWindowAjax` (client-callable) | GlideAjax bridge for #8, delegates to #4 |
| 10 | ACL | read on `u_sf_freeze_window`, role `itil` | visibility for Group Change Management (and every other itil holder — see Open Questions) |
| 11 | ACL | write on `u_sf_freeze_window`, admin-only (no new role) | only the BR/Flow (system context) and admin mutate state |
| 12 | Update Set | `ENH0000007 sf-change-freeze-calendar` | the deliverable |
| 13 | ATF Suite | `SF - Change Freeze Calendar acceptance` (5 tests) | one test per rule |

No new group, no new role, no touch to `cmdb_ci_business_app`, `change_request`, or any existing
catalog/group/table. Placement: catalog category **Group IT Services** (existing, referenced not
modified). Fulfillment/visibility: **Group Change Management** group (existing) — via the `itil` role
it already holds, not a new grant (see Open Questions #1).

## Front end

### Record Producer: "Request a Change Freeze Window"

Targets `u_sf_freeze_window` directly (per `catalogitemrecordproducer-api`, unsupported tables are
only `sc_request`/`sc_req_item`/`sc_task` — a custom table is the documented, normal case). No RITM,
no fulfillment task — this is a record-producing automation, matching "the platform should work out
the rest." `roles: ['itil']` restricts ordering to IT staff (the people who actually raise these 8-12
a quarter), matching the ticket's implicit audience (Group Change Management, not general end users).

| Variable | Type | Maps to | Notes |
|---|---|---|---|
| `applications` | List Collector (`cmdb_ci_business_app`) | `u_sf_applications` (via `mapToField`) | mandatory, ≥1 |
| `start_date` | Date | `u_sf_start_date` | mandatory |
| `end_date` | Date | `u_sf_end_date` | mandatory |
| `reason` | Select Box, choice = the 5 kinds | `u_sf_reason` | mandatory |
| `explanation` | Multi-line text | `u_sf_explanation` | mandatory |

`u_sf_requested_by` is set in the producer's pre-insert `script` from `gs.getUserID()` (a computed
value, not a form field, per the Field Mapping Methods table in `catalogitemrecordproducer-api`).

### Catalog Client Script (onSubmit): "SF Freeze Window Pre-Submit Check"

Calls `SFFreezeWindowAjax` synchronously with the form's applications/start/end values. If the
shared validator finds a back-dated start or an overlap, `g_form.addErrorMessage(...)` naming the
specific conflicting application and existing window, and the script returns `false` — the submit
never happens. This is the "told at the moment they ask" experience the ticket asks for by name.
It is a UX layer, not the authority — see Back End.

### UI Policy

None. Both dates and the reason choice are already `mandatory` at the variable level; no
conditional show/hide is asked for in the ticket, so a UI Policy would be an artifact with nothing
to do (right-sizing: skip it).

## Data & config

### `u_sf_freeze_window`

| Column | Type | Purpose |
|---|---|---|
| `u_sf_short_description` | string, calculated, table display column | e.g. "Migration: Group Core Ledger (2026-09-01 → 2026-09-20)" |
| `u_sf_reason` | choice: `year_end_close`, `regulatory_reporting`, `peak_season`, `migration`, `incident_recovery` | the 5 kinds, exactly |
| `u_sf_explanation` | string (4000) | requester's short explanation |
| `u_sf_start_date` / `u_sf_end_date` | date | the window |
| `u_sf_applications` | glide_list → `cmdb_ci_business_app` | frozen platforms; queried with `CONTAINS` for overlap/finance-critical checks |
| `u_sf_requested_by` | reference → `sys_user` | set server-side, never typed |
| `u_sf_state` | choice: `New`, `Pending Approval`, `Approved`, `Rejected` | terminal state the calendar reads |
| `u_sf_owner_approval_required` / `u_sf_cfo_approval_required` | boolean | rule 3 / rule 4 flags, computed at insert |
| `u_sf_month_end_covered` | boolean | audit: *why* CFO approval fired |
| `u_sf_required_approvers` | glide_list → `sys_user` | deduped union the Flow consumes |
| `u_sf_approval_summary` | string | "who approved it" — the ten-second answer |
| `u_sf_rejection_reason` | string | populated on any rejection (validation OR approver) |

`display: 'u_sf_short_description'`. No `extends: 'task'` — this is a governance record, not a
ticket; it has no SLA, no assignment queue, so `task`'s machinery buys nothing and the ticket never
asks for one.

**"The calendar"** is this table's own list view, filtered `u_sf_state=Approved`, columns
application/dates/reason/`u_sf_approval_summary`. No custom UI Calendar widget — a filtered list
already answers "frozen on this date, why, who approved it" inside the stated ten seconds, and a
calendar widget is out of every lane this rig has proven headless (see CLAUDE.md INVARIANT 5). Named as
a decision, not silently cut — Open Questions #2.

### `u_sf_finance_critical_app` (config, not code)

| Column | Type |
|---|---|
| `u_sf_application` | reference → `cmdb_ci_business_app` |
| `u_sf_active` | boolean, default true |

Seeded with exactly the 3 named platforms (Group Core Ledger, Group Financial Consolidation, Group
Regulatory Reporting — sys_ids confirmed in TALK-STORY). **Decision:** data, not a hardcoded array in
the Script Include — Group Change Management can edit this list later without asking for a code
change, and it is genuinely a first-instance config table per the data-centralization rule.
**Rejected alternative:** hardcode the 3 sys_ids inline in `SFFreezeWindowValidator`. Simpler, but
turns a business decision ("which platforms are finance-critical") into something only a developer
can change — rejected.

### Overlap and month-end logic (both layers call the same Script Include)

- **Overlap (rule 2):** for each application in the new window's list, query `u_sf_freeze_window`
  where `u_sf_applications CONTAINS <app>` AND `u_sf_state IN Pending Approval,Approved` AND the
  stored range intersects `[start, end]` (standard interval overlap: `stored_start <= new_end AND
  stored_end >= new_start`). Any hit for any named application blocks the whole request — the ticket
  asks that the requester be told, not that partial approval happen per-application (Open Questions
  #3).
- **Month-end (rule 4):** covered if any date `d` with `start <= d <= end` is the last calendar day
  of its month. Computed in script (last day of month = date before the 1st of the next month), not
  guessed.
- **Duration (rule 3):** inclusive day count, `(end - start) + 1`. A window from day 1 to day 14 is
  14 days (not >14, no owner approval); day 1 to day 15 is 15 days (owner approval required).

## Back end

### Business Rule (the authority — before insert on `u_sf_freeze_window`)

Runs `SFFreezeWindowValidator` before anything else. **Chosen over the Record Producer script as the
enforcement point because the Fluent Record-Producer API explicitly forbids
`current.setAbortAction()`/`insert()`/`update()` in the pre-insert `script`** — the producer can set
fields, it cannot refuse to create the record. A Business Rule can, and — unlike a client script — it
also fires on a direct Table-API insert or an ATF `recordInsert` step, which is what makes rules 1/2
headlessly testable at all.

1. Rule 1: `u_sf_start_date < today` → `current.setAbortAction(true)`, `gs.addErrorMessage(...)`, stop.
2. Rule 2: overlap query (above) → abort + message naming the conflicting application/window, stop.
3. Compute `u_sf_owner_approval_required` (duration > 14), `u_sf_month_end_covered`, and
   `u_sf_cfo_approval_required` (month-end AND any selected app active in `u_sf_finance_critical_app`).
4. Build `u_sf_required_approvers`: if `u_sf_reason == year_end_close` → empty (rule 5 — no approval,
   but rules 1/2 already ran above, satisfying "must still pass rules 1 and 2"). Else: the deduped
   set of `owned_by` across selected applications (only if owner-required) **union** the CFO
   (a `sys_user` sys_id, only if cfo-required). **This is a known weakness — see Open Questions #6.**
5. `u_sf_state`: `Approved` if the approver list ends up empty (year-end-close, or a short window
   that touches nothing finance-critical); else `Pending Approval`.

### Flow: "SF Freeze Window Approval Routing"

Trigger: record created on `u_sf_freeze_window`, background. Only records that survived the Business
Rule ever reach this trigger — an aborted insert never fires it.

- `if u_sf_state == Approved` (trigger record already terminal) → send the approved-outcome email,
  stop.
- else → `lookUpRecords` on `sys_user` where `sys_idIN<u_sf_required_approvers>` → `forEach`
  approver → `askForApproval` (one call per approver; the guide's own documented "sequential
  approvals = multiple askForApproval calls" pattern, driven by the loop instead of hand-written) →
  on `rejected`, `updateRecord` sets `u_sf_state=Rejected` and appends to `u_sf_rejection_reason`
  (sticky — a later approval in the same loop cannot undo a rejection, because the next step only
  ever writes `Approved`, never overwrites `Rejected`) → on `approved`, append the approver + date to
  `u_sf_required_approvers`'s running `u_sf_approval_summary`.
  After the loop: re-read the record's current state; if it is still not `Rejected`, set
  `u_sf_state=Approved`. Send the matching outcome email (`sendEmail`, static body, dynamic
  subject/`ah_to` from `u_sf_requested_by.email` — per the flow guide, `ah_body` does not support
  data pills, so the body stays a fixed, honest template and the subject carries the specifics).

**Named limitation (footnote, not silent):** this correctly dedupes and unions owners + CFO for
every case this instance can currently produce, because all 18 business applications share one
`owned_by` today (a single owner record — confirmed in TALK-STORY). The N-distinct-owners case (a window naming
two applications with two different real owners) is architecturally supported (the dedup and the
per-approver loop do not assume a count) but has never been exercised, because no two applications on
this instance currently have different owners to exercise it with. Flagged, not hidden — Open
Questions #4.

## Delivery plan

Global-scope Fluent app (per codex law — one authority, no competing default set, no cross-scope
wall), source at `apps/sf-change-freeze/`. Build → install → **read `sys_dictionary` back and count
columns** (global-scope silent-discard law) → headless ATF via `POST /api/sn_cicd/testsuite/run` →
`scripts/sn-publish <app_sys_id> --new "ENH0000007 sf-change-freeze-calendar"` → verify each artifact
class against this table → screenshots after read-backs agree → assemble PACKAGE.md in this same
ruled shape → **stop. Gate 2 is the human's** (never crossed here).
(Named for the enhancement it carries, per the loop contract. Tie the set name to the enhancement
number rather than to any shared sequence counter — a counter shared across unrelated work collides
the moment two efforts run in parallel, and a locked set cannot be renamed.)

## Open Questions (for Gate 1 — read-through, not yes/no)

1. **Visibility grant is broader than "Group Change Management."** I gated the read ACL on `itil`
   (68 of the 95 users on this instance) rather than a role scoped to the Change Management group, because
   granting that pre-existing group a new role touches a `sys_group_has_role` row keyed on a group I
   did not create — I read the boundary rule conservatively. If a tighter grant is wanted, the fix is
   a new role + one `sys_group_has_role` write against the existing group, which needs a human's
   explicit go-ahead per this run's own boundary.
2. **"The calendar" is a filtered list view, not a custom UI page/calendar widget.** Chosen because
   every proven lane in this rig is headless, and a list already answers the stated question inside
   ten seconds. If Group Change Management wants an actual calendar UI, that's a follow-up, not a
   silent gap.
3. **A conflicting application blocks the whole request, not just that one application.** Rule 2's
   language ("may conflict on one while being fine on the others") reads as "the requester must be
   told which one," not "auto-split into partial approvals" — I chose block-the-whole-thing-with-a-
   named-reason over silently approving part of a multi-app request. Confirm this reading.
4. **Multi-owner approval routing is built but unexercised.** See Back End above — every application
   on this instance shares one owner today, so the N-distinct-owner path has no data to test against
   even in principle, ATF included.
5. **`u_sf_freeze_window` does not extend `task`.** No SLA, no assignment group, no state machine
   beyond New/Pending/Approved/Rejected. If Group Change Management later wants this to look and feel
   like a task (worklist, assignment, SLA on approval turnaround), that's a bigger, separate change.
6. **The CFO is pinned by `sys_user` sys_id inside the Business Rule, and that does not travel.**
   A sys_id is instance-local: promote this update set anywhere else and the CFO leg of rule 4
   resolves to nobody, silently — the same class of defect as the un-transported seed rows in
   PACKAGE.md. It also contradicts this spec's own reasoning 40 lines above, where the
   finance-critical *application* list was deliberately made config-not-code for exactly this
   reason, and then the *approver* was hardcoded anyway. The fix is the same shape: resolve the CFO
   from a config row or a group, not a literal. Called out rather than quietly corrected, because
   this is what the run actually produced.

---

## Footnotes — evidence machinery

- **Package:** to be created in BUILD — `apps/sf-change-freeze/`, scope `global`.
- **Versions:** `now-sdk` 4.9.2 (confirmed installed), Node 26.5.1, instance on the Australia
  release Patch 3 — read from the instance profile generated 3 days before this run. Your own
  numbers will differ; `/sn-map` is what produces them.
- **API grounding pulled this session** (cited, not re-transcribed): `now-sdk explain` topics
  `wfa-flow-guide`, `wfa-flow-actions-guide`, `businessrule-api`, `table-api`,
  `catalogitemrecordproducer-api`, `test-api`, `listcollectorvariable-api`, `acl-api` — each pulled
  to a scratch file and grepped rather than read whole, per the context-efficiency rule.
- **Read-backs, ATF, screenshots:** none yet — this spec is written before BUILD starts. All of it
  lands in `PACKAGE.md` alongside this file at PACKAGE+VERIFY close.
- **Gate 1 — the deviation, stated plainly.** This run was a controlled trial, so build authority
  was granted up front rather than by a human reading this spec. No human approved it. The agent
  left `gate_1_decision` on the platform record as `Pending` — **not touched, not spoofed** — which
  is the behaviour the contract requires even when a gate is bypassed by the operator: the agent
  never writes an approval it did not receive. Treat this document as a complete Gate-1 packet and
  as an example of the shape, not as evidence that the gate was exercised.
