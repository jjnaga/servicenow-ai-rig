# ServiceNow AI Development Rig — how to work here

You are a ServiceNow developer. Enhancements arrive on the platform; you carry each one to the
next human gate with the work already formed, and you never cross a gate yourself.

**Session open:** this file → `codex/servicenow.md` (in full — it is bounded by design and every
line of it was paid for) → `codex/instance-profile.md` → `enhancements/loop.md`.
(`instance-profile.md` is **generated, not shipped** — if it is missing or more than 30 days old,
run `/sn-map` before any build work, or say plainly that you are working without grounding.)

Every behavioural claim in the INVARIANTS below was verified 2026-08-01 → 2026-08-05 on release
**Australia**, SDK **4.9.2**. The codex freshness law binds this file too: re-verify anything
load-bearing past ~a quarter, and say when you did not.

---

## INVARIANTS

1. **Development instances only.** This rig may contact exactly one host: `$SN_INSTANCE` from
   `~/.snpdi/env`. Never a production instance, never an instance you were not handed
   deliberately. If you find another instance in history, cookies, or a config file, it is out of
   bounds. There is no exception and no "read-only is fine" carve-out.

2. **Credentials live in `~/.snpdi/env`** (chmod 600, outside this repo): `SN_INSTANCE`,
   `SN_USER`, `SN_PASS`. Consume them with `source ~/.snpdi/env` or `$(...)` inside a larger
   command. Never read that file as its own command, never echo it, never let a password reach a
   transcript, a work note, or a log.

3. **Introspect before you write. Read back after you write. No test means not done.**
   This platform hides mistakes, so the loop must catch them:
   - `sys_dictionary` before authoring against any field — and it is **hierarchy-aware**, so a
     per-table query silently misses inherited fields (`incident.state` lives on `task`).
   - GET after POST, always. **An HTTP 200 is not proof that anything landed.**
   - **The silence extends to VALUES, not just fields.** A write carrying a value that is not an
     *active* `sys_choice` returns 200 and keeps the field's old value. Validate intended values
     against `sys_choice` before any bulk write. (`^inactiveISEMPTY^ORinactive=false` — a bare
     `^inactive=false` matches nothing when the column is NULL, and then your validator fails
     closed and aborts correct writes.)
   - **A read-back is only as trustworthy as its query.** An unresolvable dot-walk in an encoded
     query is silently ignored and returns EVERY row — which reads as spectacular success. When a
     count looks surprising in either direction, re-derive it a second way before believing it.

4. **Author in GLOBAL scope, and ship an update set.**
   - **Global scope silently discards dictionary columns lacking a `u_` prefix** — HTTP 201, zero
     rows, no error anywhere, and `sys_update_version` will still say `current`. **Count the
     columns in `sys_dictionary` after every table install.** Nothing else in the stack can see it.
   - **`now-sdk install` does NOT produce an update set.** It is application delivery. The
     promotable artifact comes from the platform's own *Publish to Update Set*, driven headlessly
     by `scripts/sn-publish`. Installer → instance; publish → deliverable.
   - **`sn-publish --include-data` is not sufficient for rows inserted via REST after install** —
     they are never registered as the application's own data, so the flag finds nothing and the
     publish still reports success. **Count data rows in `sys_update_xml` after publishing.** A
     config-as-data deliverable that skips this arrives on the receiving instance as an empty
     shell, and the rule that depends on it silently never fires.
   - `sn-publish` signs in as `$SN_USER` (it needs a real session token; basic auth is refused by
     `/xmlhttp.do`). If a human is logged into the same account in a browser, **it will kick them
     out mid-run.** Give the publish path its own service account before you demo anything live.

5. **Browser observes; SDK and REST build.** Some defects are visible nowhere else — a field that
   reads back correct and *displays* a lie — so screenshots earn their place as evidence. But the
   moment you *author* through a GUI, the claim collapses: nothing lands in source control,
   nothing is diffable, nothing replays. A GUI-built artifact proves the platform can hold it,
   never that the rig can produce it. Mark any GUI-authored result **VERIFIED-for-platform /
   UNTESTED-for-rig** and treat it as a stopgap with a named follow-up.

6. **Web-research the platform before asserting.** ServiceNow ships two releases a year. Trust
   parametric knowledge only for the decade-stable Glide core; verify anything version-gated
   against the versioned docs corpus (`vendor/ServiceNowDocs`, branch-pinned to your instance's
   release — **not shipped in this repo**; `/sn-init` clones it on request, ~400MB, gitignored) or
   `now-sdk explain`. **If `vendor/` is absent, fetch the one file you need from
   `github.com/ServiceNow/ServiceNowDocs` via its `llms.txt` index rather than asserting from
   memory.** Say when you did not verify something.

7. **Humans hold both gates.** You may recommend; you may not approve, promote, or self-authorize.
   Silence is not approval. Elapsed time is not approval. A green test suite is not approval. If a
   human states a decision in-session, you may record it on the record **with explicit
   attribution** ("decided by <name>, recorded by agent on their behalf") — never as your own.

---

## The two lanes

- **Lane A — SDK + Fluent (primary).** TypeScript-DSL metadata-as-code (`.now.ts`), git-native,
  `now-sdk build` / `install`. Covers tables, business rules, script includes, ACLs, roles, UI
  policies, catalog items, scheduled scripts, ATF tests, and (Zurich+/SDK 4.9.2) flows and
  subflows. Install the first-party plugin: `/plugin marketplace add servicenow/sdk` then
  `/plugin install servicenow-sdk@servicenow`.
- **Lane B — raw REST (secondary).** Every config record is a table row behind
  `/api/now/table/<table>`. Use it for classic/global/data work, seeding, and anything the SDK
  does not author. `scripts/sn` wraps the proven recipes.
- **Escalation when REST refuses.** Some tables reject REST writes by ACL (`sys_number`,
  `std_change_record_producer`, `sys_variable_value` updates). The blessed lane is a
  `sysauto_script` Scheduled Script Execution, where server-side GlideRecord is not bound by
  API-layer ACLs — **but verify it actually executed** (see the codex; it did not fire on a PDI in
  testing, and a queued trigger looks identical to a completed one).
- **No general-purpose MCP layer by default** — the first-party SDK plugin's own lookup tools are
  the named exception; they are scoped to introspection and earn their schema. Beyond those,
  always-loaded tool schemas plus a model round-trip per action cost more context than a scripted
  shell lane. Revisit only if measured ergonomics earn it.

## Key files

| File | What |
|---|---|
| `README.md` | Human entry point + quickstart |
| `codex/servicenow.md` | Platform truth: architecture, lane detail, every scar with its date |
| `codex/instance-profile.md` | Generated by `/sn-map` — re-derive if older than 30 days |
| `enhancements/loop.md` | The operating contract: 6 states, 2 gates, work-note format |
| `enhancements/<NUMBER>/` | Per-enhancement working folder: spec, evidence, package |
| `examples/` | One worked enhancement, intake through package |
| `scripts/sn` | Lane B wrapper (smoke, tables, fields, choices, update sets) |
| `scripts/sn-publish` | Application → one named update set, headless |
| `scripts/sn-init` | Wire the **machine** (node, SDK, SDK credential) then the **instance**. `--check` read-only, `--install` installs the SDK, `--no-build` skips the machine half. The environment is a gate: if the machine cannot build, the instance is never contacted. |

## Working style

- **Decompose.** Tables, then rules, then UI — reviewed at each step. Never "build the whole app"
  in one swing.
- **When a silent failure hides which layer broke, instrument the artifact's own output.** Make
  the failure name itself rather than reasoning about it: an error carrying the received type and
  resolved sys_id, or a hop-by-hop trace appended to the audit work note. One install cycle each,
  and cheaper than any amount of thinking about it.
- **Report gaps at the gate.** A mismatch between what the ticket assumes and what the instance
  actually contains is a finding to surface — never a licence to invent org structure to fit.
- **Say what you did not verify.** Every package names its own gaps. That is what makes the rest
  of it trustworthy.
