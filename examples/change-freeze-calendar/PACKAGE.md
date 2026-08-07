# PACKAGE — ENH0000007: Change Freeze Calendar for Group Platforms

Gate-2 evidence package: **stop here, do not promote.** Spec-first shape per the loop contract —
this file is the footnote layer; `SPEC.md` is the artifact. Everything below is read-back evidence,
not narrative.

## The deliverable

| | |
|---|---|
| Update set | **ENH0000007 sf-change-freeze-calendar v2** |
| sys_id | `<update_set_sys_id>` |
| State | `complete` (locked — publishing marks the target set complete) |
| Scope/application | `global` |
| Rows | **81** |
| Source app | `apps/sf-change-freeze/` (Fluent, global scope), installed as `SF Change Freeze Calendar`, sys_id `<app_sys_id>` |

**A superseded first attempt exists on the instance**: `ENH0000007 sf-change-freeze-calendar`
(no `v2`, also `complete`, also 81 rows) — published without `--include-data`. Not the deliverable;
left in place because **a completed set cannot be deleted or reused, only superseded** — publishing
locks the target set, so a corrected build always costs a fresh set and leaves the old one behind.
See "Known gap — config data" below for why a second publish happened at all.

### Distinct artifact classes in the set (`sys_update_xml.type`, read back, not asserted)

| Type | Count | | Type | Count |
|---|---|---|---|---|
| Dictionary | 18 | | Field Label | 18 |
| Test Step | 9 | | Test | 5 |
| Question Choice | 5 | | Variable | 5 |
| Access Control | 2 | | Access Roles | 2 |
| Choice list | 2 | | Script Include | 2 |
| Table | 2 | | Table Subscription Configuration | 2 |
| EcmaScript Module | 2 | | Business Rule | 1 |
| Catalog Client Scripts | 1 | | Catalog Item Category | 1 |
| Catalog Items Catalog | 1 | | Custom Application | 1 |
| Flow | 1 | | Record Producer | 1 |

18 Dictionary = 16 field-level columns (14 on `u_sf_freeze_window`, 2 on `u_sf_finance_critical_app`)
+ 2 table-level entries. Every number above was queried from `sys_update_xml`, not counted by hand.

## ATF

**5 tests, 5 passed, 0 failed, 0 error, 0 skipped — headless, via CI/CD API, 5-second suite.**

- Run: `POST /api/sn_cicd/testsuite/run?test_suite_sys_id=<test_suite_sys_id>`
- Result: `POST .../testsuite/results/<results_sys_id>` →
  `test_suite_status=success, rolledup_test_success_count=5, _failure_count=0, _error_count=0, _skip_count=0`
- One test per rule, server-side steps only (`Record Insert` / `Record Validation`, `atf.server.*`) —
  no form/UI steps, so this is genuinely the headless CI lane, not a browser-driven substitute.
- Suite (`sys_atf_test_suite` `<test_suite_sys_id>`) was assembled via Lane B REST after
  install — Fluent's `Test()` API has no suite-grouping construct (confirmed absent from every
  `now-sdk explain` topic pulled this session and from the installed SDK's own `Test.d.ts`).

## What was read back after every write (the mandatory law, not a courtesy)

| Write | Read-back | Result |
|---|---|---|
| `now-sdk install` | `sys_dictionary` on both tables | 14/14 + 2/2 custom columns present — **zero discarded** (the global-scope silent-discard scar did not fire; every column and both table names carry the `u_` prefix) |
| Table install | `sys_db_object.sys_scope.scope` | both `global`, confirmed |
| Business Rule | `sys_script` (`collection`, `when`, `action`, `active`, `order`) | matches source exactly |
| Script Includes | `sys_script_include.client_callable` | validator `false`, ajax `true` — correct, not swapped |
| Flow | `sys_hub_flow.active` / `.status` | `true` / `published` — the "draft flow captures a shell" scar does not apply (install auto-activates) |
| Record Producer | `sc_cat_item_producer.table_name` | literal string `u_sf_freeze_window` — the dangling-placeholder scar (codex Layer 2) (a `Table()` object reference here silently breaks every submit) did **not** reproduce, because the string form was used deliberately |
| Catalog Client Script | `catalog_script_client.global` | `false` — the known scar (SDK 4.9.2 defaults `global:true`, silently applying the script instance-wide) did **not** reproduce, because it was set explicitly |
| ACLs | `sys_security_acl` + `sys_security_acl_role` | 2 ACLs (create, read), both role `itil`, both active |
| Choice lists | `sys_choice` for `u_sf_reason` / `u_sf_state` | 9/9 values, all `inactive=false` |
| Config seed (Lane B REST, 3 rows) | `u_sf_finance_critical_app` by display value | all 3 apps correct, `u_sf_active=true` |
| ATF suite link | `sys_atf_test_suite_test` count | 5/5 |
| ATF steps | `sys_atf_step` per test, `step_config` + `order` | 9/9, correct type and sequence |

## What the platform silently discarded

**Nothing on this run** — the two scars this codex names by name (global-scope column discard,
record-producer string-vs-object) were both deliberately guarded against in the source and both
read back clean. That is a claim about *this run*, not a claim that the platform stopped doing it.

**One real gap, found and only partly closed — name it plainly:** `--include-data` on `sn-publish`
does **not** capture the 3 seed rows in `u_sf_finance_critical_app`, even though they are exactly the
"bounded, source-owned data set" the codex says the flag is for. Read back: the update set carries
only `Dictionary`/`Field Label` rows for that table, no data-type rows, with or without the flag —
confirmed by querying `sys_update_xml` directly (see BUILD/PACKAGE journal entries for the exact
query). Best available explanation, unconfirmed: those 3 rows were inserted via a plain REST POST
after install, entirely outside the Fluent build/install lifecycle, so the platform never registered
them as "this app's data" for the publish step to find, regardless of the flag. **Consequence for
promotion: a receiving instance gets the table with zero seed rows, and rule 4 (CFO approval on a
finance-critical month-end) will never fire there until someone re-seeds it.** Fix, if this is
promoted: 3 rows, `u_sf_application` = the receiving instance's own equivalents of the three
finance-critical platforms, `u_sf_active=true` — a five-minute manual step or a one-line follow-up
script, not a redesign.

## Known gaps, named rather than hidden

1. **The config-data gap above** — the sharpest one, because it's silent until someone requests a
   finance-critical month-end window on a fresh install and the CFO approval simply never appears.
2. **No screenshots this run.** Every artifact above was verified by REST read-back and ATF, not by
   driving a browser — deliberately: CLAUDE.md INVARIANT 5 reserves the browser for defects nothing else can
   see, and nothing surfaced here that read-back + a 5/5 ATF suite couldn't already prove. The
   corollary is real, though: the record producer's actual on-screen rendering (list-collector
   picker behavior, the onSubmit error message's wording as a user would see it) was never visually
   confirmed. If Gate 2 wants that layer, it is a follow-up, not assumed done.
3. **Multi-owner approval routing is built but unexercised**, per SPEC.md Back End — every business
   application on this instance shares one owner today, so the flow's per-distinct-owner
   `askForApproval` loop has no data on this instance that could ever drive it past one iteration.
4. **No editing after creation.** `u_sf_freeze_window` records are immutable once created except by
   the Business Rule/Flow's own state transitions — matches the ticket (no edit workflow was asked
   for), named so it doesn't read as an oversight.
5. **Visibility is broader than "Group Change Management."** The read ACL is gated on `itil`
   (68 of the 95 users on this instance), not a role scoped to that one group — SPEC.md Open
   Questions #1 has the full reasoning (granting the existing group a new role touches a record
   this run didn't create).
6. **The CFO approver is pinned by `sys_user` sys_id in the Business Rule** — instance-local, so
   the CFO leg of rule 4 resolves to nobody on any instance this is promoted to. Same failure
   shape as gap 1, and it contradicts the spec's own config-not-code reasoning for the
   finance-critical application list. SPEC.md Open Questions #6.

## Rollback

`now-sdk install` wrote a `sys_rollback_context` (`<rollback_context_sys_id>`) at first
install — the SDK-native undo path. The update set itself, once promoted elsewhere, follows that
target instance's own back-out path (`sys_remote_update_set` / `Back Out` — not exercised in this
run, since nothing was promoted).

## Gate 2

**Not reached. This run stops here by design.** `gate_2_decision` on the platform record remains
`Not reached` — untouched, not spoofed. The platform record's `phase` was advanced to
`package_verify` to reflect real work state; **no gate field was written at any point in this run.**
That distinction is the contract: the agent moves work state freely and never moves a gate.
