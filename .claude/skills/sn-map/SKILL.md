---
name: sn-map
description: Map a ServiceNow instance — discover the organization (foundation data, service model, operating model, operational shape) plus the custom code surface, and write codex/instance-profile.md as a freshness-dated grounding artifact. Use when the user says /sn-map, "map the instance", "learn the environment", "refresh the instance profile", or when any session finds instance-profile.md missing or more than 30 days stale.
---

# sn-map — learn the instance, on demand

**WHY:** "trained on your environment" is, structurally, a one-time introspection plus a
maintained grounding artifact. This is that artifact. Every build session depends on it, and it
is pinned to reality by **re-derivation, never by memory**.

**What "environment" means:** an instance is customized on four surfaces and only one of them is
code. A competent consultant walking into a client discovers (1) **who the company is**
(foundation data), (2) **what they run** (service model), (3) **how work flows** (operating model
and process config), (4) **what was built for them** (custom code). A map covering only surface 4
on a config-heavy instance reports "stock instance" and misses the client entirely. **All four
sweeps below are mandatory.**

**Tools:** `scripts/sn` (hierarchy-aware `fields`, `tables`, `choices`, raw `get`). Aggregations
via `GET /api/now/stats/<table>` with `sysparm_count` / `sysparm_group_by`. This skill is
**read-only** — the wrapper's write verbs are out of bounds here, no exceptions.

## Steps

1. **Guard:** `~/.snpdi/env` exists and `./scripts/sn smoke` returns the API user. Fail loudly otherwise.
2. **Identity:** instance URL; plugin posture headline — the count of active `v_plugin` rows plus
   any notable non-default activations. (`v_plugin.active` is a **string**, `active`/`inactive` —
   a boolean filter silently returns nothing.) Release name is often not exposed as a property;
   say so rather than guessing.
3. **Foundation sweep — who is this company:** the `core_company` tree top-down (parent chains),
   `business_unit`, `cmn_department` (with `dept_head`), `cmn_cost_center`, `cmn_location`
   (parent chains, countries, time zones). User population totals grouped by company; the
   leadership chain if discoverable; naming and email-domain conventions observed. Groups
   (`sys_user_group`): which exist beyond stock, their types, role grants
   (`sys_group_has_role`), membership density. Schedules beyond OOB.
   **Distinguish operating data from vendor demo data** — instances ship demo content; attribute
   by company reference, creation strata, and naming before claiming anything is "theirs."
4. **Service model sweep — what do they run:** CSDM occupancy — `cmdb_ci_business_app`,
   application services (Calculated vs Mapped), `service_offering`, technical services, dynamic CI
   groups (`cmdb_ci_query_based_service`). Infrastructure **by TRUE class**
   (`^sys_class_name=<class>`; a parent-class query double-counts descendants). Relationship
   density (`cmdb_rel_ci`) and service membership (`svc_ci_assoc`). Asset posture. CMDB health
   signals — owner, support group, environment, status completeness on the populated slice.
5. **Operating model sweep — how does work flow:** incident categories and subcategories (and
   whether the `dependent_value` wiring is real), assignment rules and what they route on, SLA
   definitions and **which schedules they resolve to**, on-call rotas, service catalogs →
   categories → items → record producers → variable counts, change models in use, CAB
   definitions, risk conditions, knowledge bases and article states (draft vs published).
6. **Operational shape — is this instance alive or staged-dead:** volumes and distributions on the
   task family grouped by company, priority, state; `task_sla` engagement (do SLAs actually
   attach?); which assignment groups actually receive work; CI linkage rate on tickets; creation
   strata (bursts vs organic spread). **Aggregates only — never row dumps.**
7. **Custom code surface:** `sys_app` (name, scope, version), `sys_store_app` count, and by scope:
   business rules, script includes, client scripts, UI policies, scheduled scripts — active only,
   name plus table, top-N with counts. Custom fields (`u_`/`x_`) on the task family via
   `./scripts/sn fields`, with type and reference; choice-list **deltas** from stock. OOB surface is not
   listed — the docs cover it.
8. **Tests and governance:** non-OOB ATF suites and tests — what do they assert, and therefore
   **what does this instance consider worth protecting?** ACL refusals encountered while mapping
   are **findings, not failures** — record them as the governance posture.
9. **Archaeology and conventions:** update-set names as build history, naming prefixes, keying
   conventions, creation-date strata. State plainly **how and when this instance appears to have
   been built**, from evidence alone.
10. **Write the artifact** — `codex/instance-profile.md`:
    - freshness header: instance, generated date; **stale after 30 days → re-run**
    - **executive summary FIRST:** "what this instance is", ≤15 lines, written the way a
      consultant would brief a stakeholder who will never read a table
    - then dense sections mirroring sweeps 2–9
    - a **conventions observed** section — grow it every refresh
    - an **open questions** section — what the map could not determine, and what would resolve it
11. **Close:** a one-line summary to the human, plus the delta versus the prior version if this
    was a refresh.

## Rules

- **Introspect, never recall.** Every claim in the profile comes from a live query in this run.
- **Deltas over dumps; aggregates over rows.** Record what makes THIS instance itself — never what
  every instance ships with, and never raw record payloads.
- **Verify your own queries.** An unresolvable dot-walk in an encoded query is **silently ignored
  and returns every row**; a parent-class count includes descendants; `sysparm_fields` silently
  omits fields that do not exist. When a number surprises you in either direction, **re-derive it
  a second way before it enters the profile.**
- **This skill never writes to the instance.**
- **Record roles, structure, and conventions — never individuals' names or email addresses.**
  `codex/instance-profile.md` is committed to the recipient's own source control, where it lands
  in a repo, a pull request, and every backup of both. "The department heads are recorded and the
  chain is three deep" is the finding; a roster of names is a liability you created for them.
  Same for email conventions: `first.last@` is the convention, an actual address is not.
