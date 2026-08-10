---
name: sn-loop
description: Run the ServiceNow enhancement loop as the developer seat — check the instance for open enhancement requests, then drive one record to the NEXT human gate and stop (talk-story → spec → Gate 1; after approval, build → package → Gate 2). Use when the user says /sn-loop, "check for enhancements", "any tickets?", or "run the loop". Judgment seat — run it in a capable model.
---

# sn-loop — the developer checks the queue

**WHY:** an enhancement arrives on the platform and an agent carries it to each human gate with
the work already 80–100% formed. This is the Tuesday-morning developer: *check for work, do the
next state, stop at the gate.* It never crosses a gate.

## Read-in (mandatory, in order — all bounded by design)

1. `CLAUDE.md` — the INVARIANTS are law. Especially: introspect before write, read back after
   write, **silence covers VALUES** (a 200 with a non-active choice value is silently discarded),
   global scope needs `u_` prefixes, and both gates belong to a human.
2. `codex/servicenow.md` **in full** — the platform scars are law; build on them rather than
   rediscovering them at your own expense.
3. `enhancements/loop.md` — the state model, gate mechanics, work-note format.
4. `codex/instance-profile.md` — grounding. If it is missing or older than 30 days, run `/sn-map`
   first or say plainly that you are working without current grounding.

## Step 1 — Take the named target, or poll the queue

**If the invocation names a record** (`/sn-loop ENH0001234`), work that one — look it up by
number, and fail loudly if it does not exist or is closed.

Otherwise poll the intake table (default `u_sn_enhancement`; `scripts/sn get` wraps this):
`active=true^u_phase!=closed`, fields
`number,sys_id,u_phase,short_description,u_gate_1_decision,u_gate_2_decision,opened_by`.
No rows → report "queue empty" and stop. Rows → announce what you found (number, title,
requester, phase) and work the record in the **earliest** phase
(`intake → talk_story → spec → build → package_verify → review`).

**Attachments are part of the ticket.** List them via
`/api/now/attachment?sysparm_query=table_sys_id=<sys_id>`, download each via
`/api/now/attachment/<id>/file` into `enhancements/<number>/handoff-in/`, and **read them**. A
business unit hands over documents; the loop's first job is to actually read what they sent.

## The states you drive

Each state: do the work → post a work note in the shape `loop.md` defines → read the note back off
`sys_journal_field` to prove it landed (an inherited `task.work_notes` ACL can silently discard it).

- **TALK-STORY** — diagnosis against instance evidence, read-only. What is really being asked,
  what already exists (catalog items, groups, users, applications named in the documents),
  options and tradeoffs, and what you could not determine. Advance `u_phase` — introspect the
  choice values first; an inactive value is discarded silently.

- **SPEC — the Gate-1 artifact.** The spec sheet IS the deliverable; everything technical is a
  footnote. Write `enhancements/<number>/SPEC.md`:
  1. **Top — "How I'm reading this":** your interpretation of the ask, and an inventory of what
     gets built (catalog item, N variables, UI policies, client scripts, flow, groups, config).
     Written so a human developer *or* another agent could implement from it.
  2. **Middle — the technical sections:** front end (variables, UI policies, client scripts) ·
     data and config (tables touched, mappings) · back end (flow design) · delivery plan.
  3. **End — OPEN QUESTIONS for Gate 1.** The gate is a read-through, not a yes/no.
  4. **Footnotes — the evidence machinery** (versions, read-backs, tests, transport). Indexed,
     never the headline.

  Post the spec path plus a five-line summary as a work note. **STOP. Gate 1 is the human's.**

- **GATE 1** — the human tunes and approves in-session. You may record their stated decision on
  the record **only with explicit attribution** ("decided by <name>, recorded by agent on their
  behalf"). *(This whole recording step is a workaround for having no review UI — if the control
  plane is installed, it does not apply. See the optional section below.)* **Introspect the gate choice values before writing one** —
  `./scripts/sn choices <table> u_gate_1_decision` — the stored values are lowercase
  (`approved`, `changes_requested`, `rejected`) and anything else is discarded silently at HTTP
  200, leaving the gate misreporting its own state. Fold their answers into the spec before any
  build.

- **BUILD** — per the approved spec, as a **GLOBAL-scope Fluent app** (`now.config.json` →
  `"scope": "global"`). Global removes the app's competing default update set and the cross-scope
  wall, so the deliverable stays one authority. Read back every write — **including
  `sys_dictionary` after any table install**, because global scope silently discards columns
  lacking a `u_` prefix (HTTP 201, zero rows) and no installer, test, or coverage table can see it.

- **PACKAGE + VERIFY** — resolve `<app_sys_id>` from `sys_app` by scope
  (`sn get "/api/now/table/sys_app?sysparm_query=scope=<scope>&sysparm_fields=sys_id,name"`).
  **Warn the human before you run it:** `sn-publish` performs a real sign-in as `$SN_USER`, so if
  they are logged into that account in a browser it **ends their session mid-run** — and it will
  look like an instance fault, not like you. Then
  `scripts/sn-publish <app_sys_id> --new "<name>"` produces **one named
  update set carrying the whole deliverable**, marked complete. `now-sdk install` does NOT capture;
  publishing is what produces the promotable artifact. **Count the rows in `sys_update_xml`
  yourself, data rows included** — `--include-data` does not capture rows inserted via REST after
  install, and the publish still reports success. Verify each artifact class against what you
  built, run headless ATF, capture screenshots only after the read-backs agree, then assemble the
  Gate-2 package spec-first. **STOP. Gate 2 is the human's.**

## Optional — if the AI Development Control Plane is installed

Probe once, at read-in: `./scripts/sn tables u_sn_spec_version`. No rows → skip this section
entirely; everything above is the whole loop.

Rows → the human's review surface lives **in ServiceNow**, and exactly three touchpoints change.
Same intake table, same phases, same two gates — the app adds a review surface, it does not add a
workflow.

| step | without the app | with the app |
|---|---|---|
| **SPEC** | write `enhancements/<n>/SPEC.md`, post the path as a work note | write the same file, **then** `POST /api/global/ai_control/v1/enhancements/<sys_id>/request-draft` and create the spec as a `u_sn_spec_version` draft. The human edits and submits it in the workbench; submitting freezes the exact bytes and their SHA-256 |
| **GATE 1** | human decides in-session; you record it with attribution | **you record nothing.** The human clicks Approve / Request changes / Reject themselves. The attribution workaround is retired — do not write `u_gate_1_decision` at all |
| **BUILD** | build from your own `SPEC.md` | `POST .../enhancements/<sys_id>/claim` → returns the **exact approved markdown + hash**. Build from *that*, never from the file on disk. Finish with `POST .../finish` |

Three things that follow, and they are the point:

- **The claim is the phase move.** `u_phase` spec→build only succeeds if Gate 1 is approved and
  nobody holds it. A refusal (`expected spec, got build`) is a correct answer, not an error to
  route around — someone or something else has the record.
- **The file on disk stops being the authority.** The human approved bytes, not your file. If they
  edited the spec in the workbench, the claim response is the only truthful copy.
- **A stalled build is not yours to restart.** A scheduled job closes the clock and notifies; a
  human clicks Retry build. Never re-claim a record you just failed.

## Hard rules

- **Never cross a gate.** Stopping at a gate with the work fully formed IS the deliverable.
- **Never `delete`.** The wrapper exposes the verb; you do not use it. A failed build is repaired
  by a corrected install, never by removing records.
- **Closing the record is the human's** (`u_phase=closed`, after Gate 2). Say so at the Gate-2
  stop — until they do it, this enhancement keeps surfacing as the earliest-phase record and
  blocks every newer request behind it.
- **Never trust a success message.** Seven installs in one real run printed success while
  leaving five defects on the instance. Read-back is the job, not the ceremony.
- Evidence lives in `enhancements/<number>/`: verbatim probes, read-backs, test output,
  screenshots. Every package names its own gaps.
- Scope: touch only the enhancement being worked. Nothing else in the repo, nothing else on the
  instance.
