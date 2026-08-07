# The enhancement loop — operating contract

How an enhancement request becomes a reviewable, installable ServiceNow change. Deliberately
enhancement-agnostic: this is the process, not any past run.

## Evidence language

- **VERIFIED** — exercised on a live instance, or confirmed in release-pinned documentation. A
  verification statement names its date.
- **ASSUMED** — not yet proven here. Say so out loud rather than rounding up.
- **DECISION** — an operating rule, not a claim about platform behaviour.

## State model

| State | Owner | Entry condition | Required artifact | Exit condition |
|---|---|---|---|---|
| 1. INTAKE | Requester | A request exists on-platform | Record with title, current pain, requested outcome, owner, needed-by date | Intake is readable and assigned for analysis |
| 2. TALK-STORY | Agent | Intake is complete enough to investigate | Diagnosis, instance evidence, options, tradeoffs, unknowns | Evidence supports a bounded recommendation |
| 3. SPEC | Agent, then human | TALK-STORY recommends a path | WHY/WHAT/HOW spec, decisions, rejected alternatives, tests, open questions | **Gate 1:** a human approves, rejects, or requests changes |
| 4. BUILD | Agent | Gate 1 explicitly approved | Source, deterministic identities, tests, build output | Build is clean and source matches the approved spec |
| 5. PACKAGE + VERIFY | Agent | Build artifact exists | Update set, read-back, test results, screenshots, metrics delta | Evidence package complete; **no promotion has occurred** |
| 6. REVIEW | Human | Verification package attached | Review notes and a promote/reject decision | **Gate 2:** a human promotes or rejects |
| 7. CLOSED | Human | Gate 2 decided | Promotion record: update-set identifier, target instance, timestamp, promoting human | `u_phase=closed` — set by the human, not the agent |

**DECISION:** Forward transitions are 1→2→3→4→5→6→7. "Changes requested" returns to the state whose
artifact must change. "Rejected" stops the run. A human can stop any run at any point.

**DECISION:** `closed` is the terminal state and **the human sets it.** Until they do, the record
still matches the agent's queue filter (`active=true^u_phase!=closed`) and will resurface on every
subsequent run — permanently blocking newer requests from being the earliest-phase record. The
agent may not close it: closing follows a gate decision, and gate decisions are not the agent's.

**DECISION:** The agent never **decides** a gate and never promotes an artifact.
**Silence, elapsed time, and a green test suite are not approval.** A human may state a gate
decision in-session rather than typing it themselves; the agent may then transcribe it **only** in
the form `decided by <named human>, recorded by agent on their behalf, <timestamp>`. An
unattributed approval is void, and the agent never originates a decision.

## Gate mechanics

### Gate 1 — build authority

The packet contains: the original requester language unchanged; the TALK-STORY diagnosis with
timestamped instance evidence; the proposed WHY/WHAT/HOW; decisions and rejected alternatives;
acceptance criteria and the automated-test plan; and every unresolved assumption **with its
consequence**.

**DECISION:** Three valid outcomes, written **exactly** as the stored choice values —
`approved`, `changes_requested`, `rejected`. Only `approved`, attributed to a named human with a
timestamp, permits BUILD. The field starts at `pending`.

**Introspect these values before writing one.** A value that is not an active `sys_choice`
returns HTTP 200 and leaves the field unchanged — on the gate, that means a record that
misreports its own authority state. `./scripts/sn choices <table> u_gate_1_decision`.

### Gate 2 — promotion authority

The packet contains: the approved Gate-1 spec; the exact update-set identifier and its row count;
the source revision and deterministic record identities; **instance read-back for every material
artifact**; headless test output; screenshots captured *after* the write; and known gaps, rollback
steps, and before/after metrics.

**DECISION:** Gate 2 is always a named human action. The agent may recommend promotion or
rejection; it may not perform the promotion. Stored values are `not_reached` (initial),
`promoted`, `rejected` — introspect before writing, same rule as Gate 1.

## Artifact contract

| State | Repository artifact | On-platform artifact |
|---|---|---|
| INTAKE | Request transcript or immutable quotation | The enhancement record |
| TALK-STORY | Evidence notes with the commands/queries and their results | Work note summarising, with evidence pointers |
| SPEC | Versioned WHY/WHAT/HOW document | Work note with spec path, decision summary, Gate-1 request |
| BUILD | Source, lockfile, identity-key map, automated tests | None until a write window is authorized |
| PACKAGE + VERIFY | Update set export, test output, read-back data, screenshots | Installed artifacts plus verification work notes |
| REVIEW | Review packet | Gate-2 work note and the human's decision |

## On-platform conventions

- **DECISION:** One enhancement has **one** package/update-set authority. Never split ownership of
  the same record between source and an update set.
- **DECISION:** Update sets are named for the enhancement they carry, and marked complete — which
  *locks* them, which is already a commit's semantics.
- **DECISION:** Source-owned records use stable generated keys, committed with the source.
- **DECISION (day-2 shape, optional):** bind commit ↔ update set at the Complete transition —
  commit first with the set's name, sys_id, and row count in the message; then complete the set
  and write the commit SHA into its description. Commit-first closes the drift window, since a
  locked set cannot take a change the commit does not know about. The value is provenance: from a
  promoted set on any instance you can name the exact source revision.

### Work notes

Every state change appends one work note in this shape:

```text
[<STATE>][<YYYY-MM-DD HH:mm:ss TZ>][<actor>]
outcome=<one-line result>
artifact=<repo path or platform identifier>
evidence=<journal, test, read-back, screenshot, or export pointer>
next=<named owner and next authorized action>
```

**DECISION:** Work notes summarize; immutable evidence stays in the repository. **Never paste
credentials, tokens, or secret-file contents into either surface.**

**DECISION:** Requester-supplied documents are the **customer's**, not the repository's. Ticket
attachments are downloaded, read in place, and **never committed** (`.gitignore` excludes
`handoff-in/`), never re-posted into a work note, and never quoted beyond what the spec needs.

**DECISION:** Screenshots and terminal recordings are **not versioned** — they are large and
binary. The package file records each one's filename, byte size, and SHA-256, so an unversioned
file stays attestable. Retention of the files themselves belongs to the adopting organization.

## Enforcement posture — read this before trusting the gates

These gates are **procedural controls on the agent's behaviour, not technical controls on the
instance.** The agent runs with an account technically capable of writing a gate field and
promoting an update set; it is instructed never to, and every transition is journaled with its
actor. That is a normal posture for change governance, but it should be chosen knowingly rather
than assumed.

An organization wanting a *technical* control should give the agent a dedicated non-admin service
account and restrict write access to the gate fields — and to update-set promotion — to a
human-held role. The product already needs a separate publish account for an unrelated reason
(`sn-publish` signs in as `$SN_USER` and will end a human's browser session), so the same account
boundary buys both. This contract does not assume any of that has been done.

**Read the note back off `sys_journal_field` after posting it.** On a Task-derived table the
inherited `task.work_notes` ACL can discard the write silently while the record itself saves fine.

## Build and verification policy

1. **Introspect before writing** — record existing tables, groups, catalog structures,
   dependencies, and exact identifiers.
2. **One source authority per artifact.** Centralize data and config on first use; extract shared
   behaviour only when the sites must change identically.
3. **Build locally before any instance write.** Validate deterministic keys on the final
   pre-install build, and never rebuild between pinning an artifact and installing it.
4. **Install only after Gate 1** and an explicit write-window authorization.
5. **Read back every material written field.** A successful HTTP or install response is **not**
   proof of state — this is the single most load-bearing rule in the contract.
6. **Run headless server-side tests for CI evidence.** Browser verification is separate evidence
   and never substitutes for it. (Form-based test steps cannot run headlessly at all.)
7. **Capture screenshots only after authoritative read-back**, and review each one before it
   enters a package.
8. **Assemble the Gate-2 packet and stop.**

## Failure and rollback posture

| Failure point | Required response |
|---|---|
| Intake incomplete | Stay at INTAKE; request the missing outcome, owner, or deadline |
| Evidence contradicts the request | Stay at TALK-STORY; post the contradiction and the alternatives |
| Gate 1 rejects or requests changes | Do not build; revise the spec or stop |
| Local build fails | Make no instance write; preserve compiler output and repair source |
| Install partially fails | Stop all dependent writes; read back actual state; use the platform's rollback path only after human authorization |
| Read-back differs from intent | Mark verification FAILED; do not proceed to packaging |
| Tests fail | Preserve the results and the cleanup status; return to BUILD |
| Screenshot differs from read-back | Treat it as a real defect; **never conceal it with prose** |
| Gate 2 rejects | Keep the package unpromoted; record the human's reason and the next owner |
