# ServiceNow AI Development Rig

An AI developer for ServiceNow. You file an enhancement on the platform; the agent diagnoses it
against your live instance, writes a build spec for a human to approve, builds it as code, tests
it headlessly, and hands back a promotable update set. **A human approves twice and nothing
ships without them.**

There is no service to buy and no model to train. What makes this work is *context* — the files
in this repo. They are plain English and plain TypeScript, they live in your source control, and
they are yours to change.

---

## What you need first: Claude Code

**Claude Code is a command-line tool** — you run it in a terminal, in a folder, and it can read
and write the files in that folder and run commands. It is not a website and not an IDE plugin
(though extensions exist). It needs a Claude subscription or an API key.

```bash
npm install -g @anthropic-ai/claude-code    # then run `claude` inside a folder
```

Install and sign-in instructions: **https://claude.com/claude-code**

The **`/sn-init`, `/sn-map`, `/sn-loop`** commands below are *skills* — instruction files that
live in `.claude/skills/` in this folder. Claude Code picks them up automatically when you start
it **from this directory**, so you type `/sn-loop` at its prompt the same way you would type a
slash command in Slack. There is nothing to install for them and nothing to configure.

If you would rather not use Claude Code at all, the scripts in `scripts/` are plain
Python and shell, and `codex/servicenow.md` is readable on its own — the platform knowledge in it
is useful to a human developer with no AI involved.

---

## Quickstart (about 15 minutes, most of it waiting)

**1. Get an instance.** Free and yours: [developer.servicenow.com](https://developer.servicenow.com)
→ sign up for a free ServiceNow ID → Manage → Instances → Request. Provisioning takes a few
minutes. **Your instance admin password is under "Manage instance password" on that same page** —
it is generated per instance and is *not* your ServiceNow ID password. You need it in step 2.
Use a personal login. Never point any of this at production.

**Know this before day two:** idle developer instances **hibernate**, and **REST traffic does not
count as activity** — a full evening of API work still puts it to sleep. The symptom is a bare
`502` on every route with no interstitial, and since this whole rig is REST-driven you will hit
it. Wake it by signing in through the browser (~3 min, and it flaps for a while). This is the
failure that happens *after* everything already worked, so it reads as "the thing is broken." It
isn't. Details: `codex/servicenow.md` Layer 1.

**2. Drop the credentials** (outside this repo, so they can never be committed):

```bash
mkdir -p ~/.snpdi && chmod 700 ~/.snpdi
cat > ~/.snpdi/env <<'EOF'
SN_INSTANCE=https://devXXXXXX.service-now.com
SN_USER=admin
SN_PASS=your-instance-admin-password
EOF
chmod 600 ~/.snpdi/env
```

**3. Install Node 20.18+ and Python 3.9+** — the things you install by hand.

```bash
python3 --version     # macOS: `xcode-select --install` if missing
node --version        # need >= 20.18
```

Python runs the scripts; Node runs the ServiceNow SDK. Without Python 3, step 4 dies with
`env: python3: No such file or directory`, which names neither the rig nor the fix.

`sn-init` will not install node for you. How node arrives on a machine (brew, nvm, a distro
package, a corporate image) is the machine's business, and overwriting that breaks managed
laptops. It detects what you have and prints the command for your platform.

**4. Wire the machine and the instance:**

```bash
./scripts/sn-init --check      # read-only: report what is and isn't ready
./scripts/sn-init --install    # install the ServiceNow SDK, then wire the instance
```

It does two halves, in order. **The environment** — node, the ServiceNow SDK, and the SDK's
own credential (a separate store from `~/.snpdi/env`; REST auth passing does not mean the SDK
is authenticated). **Then the instance** — diagnoses the one authentication gotcha that bites
every new instance, enables the test runner, and creates the intake table plus a request form.

The environment is a **gate**. If your machine can't build, `sn-init` says so and does not
touch the instance — a green instance on a machine that cannot build is a trap that only
surfaces hours later at BUILD, after a human has already approved a spec.

Idempotent — run it as often as you like. `--no-build` skips the node/SDK half if you only
want the read-only lanes (`/sn-map` and diagnosis).

**What it touches on your instance, and nothing else:** a table `u_sn_enhancement` (extends
`task`) with its columns and choice lists, a Service Catalog category **AI Development** holding
one record producer (**Request an enhancement**), the `sn_atf.runner.enabled` property, and the
`snc_basic_auth_api_access` role on your API account. All reversible, all dev-only. `--check`
shows you the whole list before anything is written.

**It refuses non-developer hosts.** If `SN_INSTANCE` is not `https://dev<n>.service-now.com` the
script stops and does not contact the instance. That guard is a check, not a promise — override
it with `SN_ALLOW_NONDEV=1` only if you are certain the target is disposable.

**5. Start Claude Code from this folder** (`cd` here first, then run `claude`), and use the three
commands:

| Command | What it does |
|---|---|
| `/sn-init` | Step 4's wiring **plus the parts a script cannot judge** — it interprets failures, walks you through the SDK credential, and offers the versioned docs clone (~400MB). Worth running once even if step 4 reported success. |
| `/sn-map` | Reads your instance and writes `codex/instance-profile.md` — the grounding artifact |
| `/sn-loop` | Checks the queue and drives the next enhancement to its next human gate |

**6. File a request.** In a browser, log into your instance and go to **Self-Service → Service
Catalog → AI Development → Request an enhancement** — the form `sn-init` created in step 4.
Describe what you need in your own words; you do not have to write it like a spec.

Then back in Claude Code: `/sn-loop`. It will find the request and start working it.

---

## What actually happens

```
INTAKE ──▶ TALK-STORY ──▶ SPEC ──▶ ⟨ GATE 1 ⟩ ──▶ BUILD ──▶ PACKAGE+VERIFY ──▶ ⟨ GATE 2 · REVIEW ⟩ ──▶ CLOSED
requester     agent        agent      human        agent        agent               human               human
```

Seven states, two of them yours. **You close the record** — until you do, the agent keeps
surfacing it as the oldest open work and newer requests queue behind it.

The agent stops at both gates and will not cross them. At Gate 1 you read a spec and tune it; at
Gate 2 you get a named update set, headless test results, read-back evidence, and a list of what
is still unproven. Promotion is your click, always.

The full contract — entry and exit conditions, what belongs in each packet, what happens when a
step fails — is in [`enhancements/loop.md`](enhancements/loop.md).

## What's in here

| Path | What |
|---|---|
| `CLAUDE.md` | How the agent must work here. Invariants first — they are all scar tissue. |
| `codex/servicenow.md` | The platform truth: how to build on this platform without getting silently burned |
| `codex/instance-profile.md` | Written by `/sn-map`. What YOUR instance actually is. Regenerate monthly. |
| `.claude/skills/` | The three commands, as instructions the agent reads |
| `scripts/sn` | Read/introspect the instance from the shell |
| `scripts/sn-publish` | Turn a built application into one named, promotable update set |
| `scripts/sn-init` | Wire an instance from scratch |
| `enhancements/` | The loop contract, and a folder per enhancement as it is worked |
| `examples/` | One real enhancement, end to end: intake document → spec → package |
| `apps/ai-development-control-plane/` | **Optional.** A ServiceNow app that moves the human's review surface onto the platform: versioned Markdown specs, a hash-frozen approval, and a worker that claims work off the enhancement's own phase. The loop works without it — see its `codex/APP.md`. |

## The thing worth knowing

**This platform fails silently, and that is the entire reason the verification step exists.**

A write with a misspelled field returns HTTP 200 and discards your value. A dictionary column
without a `u_` prefix returns 201 and creates nothing. An installer prints
`Installation completed` over an instance it left broken — in one real run, seven installs
reported success and five defects got through. Read-back caught three, runtime caught two, and the
installer caught **none**. Not one was surfaced by the tool that reported success.

So the agent here is built to distrust its own tools: introspect before writing, read back after
writing, run the tests, and say plainly what it could not verify. That discipline is most of the
value. The codex is where each of those lessons is written down, with the date it was paid for.

## Honest limits

- Everything here has been proven on greenfield developer instances. **Cost and effort scale with
  mess**, and a long-lived instance with skipped upgrades is genuinely unmeasured.
- Integrations, upgrade remediation, and brownfield archaeology are not covered.
- The agent produces work that is 80–100% formed when it reaches you. It is not autonomous, and
  the two gates are not decoration.
