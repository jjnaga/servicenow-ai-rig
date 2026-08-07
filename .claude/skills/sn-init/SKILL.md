---
name: sn-init
description: Wire a ServiceNow developer instance for the AI development loop — verify tooling and credentials, diagnose auth, enable the test runner, create the enhancement intake table and request form, and confirm the instance is ready. Use when the user says /sn-init, "set up the instance", "wire a new PDI", "get started", or when any other command reports the instance is not wired.
---

# sn-init — get an instance ready

**WHY:** everything else here assumes two things are true — a **machine** that can author and
build (node, the ServiceNow SDK, and the SDK's own credential) and an **instance** that can be
reached over REST, has somewhere for enhancements to arrive, and a test runner that will actually
run. This gets you there from nothing, and it explains anything it cannot fix rather than failing
quietly.

**The environment half is a gate, not a warning list.** If the machine cannot build, the script
reports that and does not contact the instance at all. A green instance on a machine missing the
SDK is the worst possible outcome: it looks ready, and the gap surfaces at BUILD — hours in, after
a human has already approved a spec at Gate 1.

`scripts/sn-init` does the mechanical work and is idempotent. Your job is the judgment: read what
it reports, fix what it flags, verify the result, and tell the human plainly where they stand.

## Step 1 — Read the ground rules

Read `CLAUDE.md` (INVARIANTS 1–3 are the ones that bite during setup). You do not need the full
codex for this command; you will need it before any build.

## Step 2 — Run the check pass first

```bash
./scripts/sn-init --check
```

Read-only. Report the state back in plain language before changing anything.

## Step 3 — Resolve blockers

Fix what you can; hand back what only a human can do. The ones you will actually hit:

- **node missing or below 20.18** → the human installs it. The script prints the command for their
  platform. **Do not install node for them** — how node arrives on a machine is the machine's
  business and a managed laptop can break. Stop here; nothing downstream works without it.
- **`now-sdk` missing** → this one you CAN fix: re-run as `./scripts/sn-init --install` and it
  installs the SDK as an npm global. If that fails it is almost always an npm prefix/permissions
  problem — surface the script's hint rather than reaching for `sudo`.
- **No SDK credential for the instance** (step 3b) → the human runs the printed
  `now-sdk auth --add ... --type basic --alias pdi`. It is **interactive and prompts for the
  password** — you must not run it for them or supply the password. Note for your own reasoning:
  the SDK keeps a credential store entirely separate from `~/.snpdi/env`, so **step 3 passing does
  not mean Lane A is authenticated**.
- **No `~/.snpdi/env`** → the human creates it. Print the exact block from the script's output.
  **Never ask for the password in chat and never write it to a file yourself** — they create the
  file; you never read it as a standalone command.
- **HTTP 401** → almost never the password. Fresh instances enforce the basic-auth restriction, so
  REST 401s for any account lacking the role **`snc_basic_auth_api_access`** while UI login keeps
  working. Walk the human through granting it (User Administration → Users → the API user →
  Roles). This is 30 seconds and it unblocks everything.
- **HTTP 502** → the instance is hibernating, and **REST traffic does not wake it**. The human
  signs in at developer.servicenow.com → Manage instance → Refresh. Wake can take ~45 minutes and
  **flaps** — do not call it up until 6 consecutive 200s at 15s spacing.

## Step 4 — Wire it

```bash
./scripts/sn-init            # add --install to also install the ServiceNow SDK
```

Creates, idempotently: the intake table (extending `task`, in global scope, all columns `u_`
prefixed because **global silently discards anything else**), its choice lists, and a Service
Catalog record producer so a human can file a request through the portal. Enables the ATF runner,
which ships disabled.

## Step 5 — Verify it yourself. Do not trust the script's own report

The whole discipline of this repo is that a success message is not evidence. Independently
confirm:

1. **Columns landed:** query `sys_dictionary` for the intake table and count the `u_` columns
   against what the script claimed. Global scope discards unprefixed columns with HTTP 201 and no
   error, so this is the check that matters.
2. **The intake path works end to end:** submit the record producer the way the portal does —
   `POST /api/sn_sc/v1/servicecatalog/items/<producer_sys_id>/submit_producer` with the variables
   — then GET the created record off the intake table and confirm the fields and the defaults:
   **`u_phase=intake`, `u_gate_1_decision=pending`, `u_gate_2_decision=not_reached`.** Use the
   `u_` names exactly — a query naming a column that does not exist is **silently ignored and
   returns every row**, which reads as a spectacular pass. If the submit returns an **empty HTTP
   500**, the real error is in `syslog` (`level!=0`, newest first) and never in the response body.
3. **ATF runner** — `sn_atf.runner.enabled` is `true` in `sys_properties`.
4. **Gate choice values exist**, including `changes_requested` on `u_gate_1_decision` — the loop
   routes a changes-requested outcome, and a missing choice value is discarded silently:
   `./scripts/sn choices <table> u_gate_1_decision`.

Delete nothing. If you created a probe record, say so and leave it for the human.

## Step 6 — Optional, offer it

- **Docs grounding** (recommended before real build work): clone
  `github.com/ServiceNow/ServiceNowDocs` into `vendor/`, on the **branch matching the instance's
  release**. It is large (~400MB) and gitignored — ask before pulling it.

(The SDK lane is no longer optional or deferred — it is steps 1 and 3b above, because the loop
cannot reach BUILD without it. `--no-build` exists for the deliberate read-only case.)

## Step 7 — Report

Tell the human: what state the instance is in, what you changed, what you verified *yourself* and
how, anything still broken with the single next action, and the next command to run
(`/sn-map` to learn the instance, then `/sn-loop` once a request exists).

## Hard rules

- **The allowlist is one host** — `$SN_INSTANCE` from `~/.snpdi/env`, never anything else. The
  script now enforces `https://dev<n>.service-now.com` and refuses anything else unless the human
  sets `SN_ALLOW_NONDEV=1`. **If you see that refusal, do not suggest the override reflexively** —
  read the hostname back to the human and make them state that the instance is non-production
  before they set it. This is the one mistake that cannot be undone.
- This command **creates** setup scaffolding. It never deletes, never wipes demo data (that kills
  the wiring), and never touches anything outside the intake surface it owns.
- If the instance already has an intake table under a different name, use it — pass `--table`
  rather than creating a second one.
