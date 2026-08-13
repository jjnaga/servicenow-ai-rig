# NGB Source-to-Pay Operations — Implementation Report

**For:** Tiare Kaaihue (Asset & Procurement) and Bruno Miyashiro (Controllers Office)
**Instance:** `dev409729` (Australia patch 3)
**Build:** 2026-08-12 → 2026-08-13 · **engagement closed**
**Update set:** `NGB-S2P-OPS foundation` (`a2071edbc36a4b50aaafb71d050131c9`), 18 rows
**Basis:** [BUSINESS_REQUIREMENTS.md](./BUSINESS_REQUIREMENTS.md) · [S2P-INSTALL-MAP.md](./S2P-INSTALL-MAP.md)
**Scope:** no custom application, table or column. Two deviations from pure OOB-API
configuration are disclosed in §3 and §4 — read those before signing.

---

## 1. How to read this report

Every claim is a read-back: written, re-fetched, compared. Counts come from `/api/now/stats`.

| Word | Means |
|---|---|
| **PROVEN** | Exercised on the instance and re-read; record numbers given. |
| **CONFIGURED** | Written and read back, but the behaviour it enables was not exercised. |
| **NOT MET** | Blocked or unavailable in the installed product; mechanism stated. |

**Corrections to the 2026-08-13 draft are marked ⚠ and explained in §5.** Two of them
change what you can claim about controls.

---

## 2. Headline

Four purchase orders now exist, three of them carrying a full, human-attributed approval chain,
and two carrying a completed receipt:

| Journey | Requisition | Approvals recorded | Order | Receipt position |
|---|---|---|---|---|
| J3 new supplier, service, $20,000 | `PR0001024` | **11 approved** (CC → Proc → Finance) | `PO0001001` | service receipt, amount not captured |
| J1R goods, $10,000 | `PR0001027` | ⚠ **none** — see §5.1 | `PO0001002` | **8/8, delivered** |
| J2R service, $30,000 | `PR0001028` | **6 approved** (CC → Proc) | `PO0001004` | **$30,000, 100%, delivered** |
| J4R goods, $120,000 | `PR0001029` | **10 approved** (CC → Proc → Finance) | `PO0001003` | ⚠ **8/4, 200% over-received** — §5.2 |

**The approval policy itself is thoroughly proven.** 28 tasks were actioned on day two and a
further 16 on the rebuilds, and every time the rounds fell out exactly as the policy specifies —
cost-centre owner, then procurement, then finance, with finance appearing only where the amount or
the supplier risk warrants it. Self-approval held under live conditions on both $120,000 runs:
Tiare is the requester, and both times the procurement approval tasks went to her four colleagues
with **Tiare excluded**.

**The impersonation disclosure is now on the record** — 6 requisitions and 14 approval plans carry
it, verified in `sys_journal_field`, zero failures (§6).

**The AP checkpoint does not close.** An invoice built cleanly cannot leave Draft, so the external
handoff cannot be recorded. This is a hard product blocker, proven four ways (§5.3), and it
downgrades REQ-039/040 from the previous draft.

---

## 3. Judgement call one — the GL chart

`sn_fin_gl_account` create is denied by an OOB ACL returning `false` unconditionally with admin
override off: the chart is ERP-inbound by design. The consequence was total —

> no GL accounts → lines carry no capex/expense account → `validateRequisition()` fails with
> `po_creation_failed_mandatory_glaccount_fields` → **no purchase order can ever be created**.

**What I did:** created six NGB ledger accounts (60100, 60200, 60300, 60400, 60500, 15000) through
the server-side lane, where GlideRecord is not bound by API-layer ACLs. §6.2 of the requirements
lists ledger/accounting as a required NGB dataset owned by the Controllers Office, so the data is
in scope; only the API path is closed.

**Reversal:** the six rows' `description` begins "NGB chart of accounts". Delete is also
ACL-denied, so removal is a server-side script — and it re-blocks purchase-order creation.

## 4. Judgement call two — approvals recorded on people's behalf

Executed under the authority you gave at the 2026-08-13 standup, using server-side
`GlideImpersonate`. See §6 for what the instance does and does not retain about that.

---

## 5. Corrections and control findings

### 5.1 ⚠ `PO0001002` was created with NO approval recorded — and the gate does not enforce

The 2026-08-13 draft said J1R was "approved by jnagahama". **That was wrong.** `PR0001027`'s only
approval task is in state `not_required`; **zero approvals were recorded**, and the purchase order
was created anyway.

Root cause, and it is the important part: **`PurchaseRequisitionUtil.validateRequisition()`
validates accounting completeness — mandatory GL accounts and cost allocations — and does not
check the approval state at all.** The `sn_shop.create_purchase_order` action will therefore
create an order on an unapproved requisition. In normal use the gate is *procedural* (the action
sits behind a UI button a buyer presses after approval), not enforced in the action itself.

I drove that action directly, which is how an unapproved requisition became an order. **The
control implication for NGB stands regardless of how I drove it: nothing in the product prevents
an order being raised against an unapproved requisition through that action.** If that matters —
and for a spend control it should — it needs a guard.

I have not deleted `PO0001002`; S2P records cannot be deleted here. Treat it as scrap.

### 5.2 ⚠ `PO0001003` is over-received at 200% and the product did not object

`POL0001003` shows `received_quantity 8` against `purchased_quantity 4`, `received_percentage 200`,
`received_amount $240,000` against a $120,000 order. **My error** — I ran the receipt step twice
(`RCPT0001004/5` then `RCPT0001006/7`) without an idempotency guard.

But the finding is the platform's: **it accepted receipts totalling 200% of the ordered quantity
without warning, and the order line still reads `ordered` rather than flagging an over-receipt.**
For a three-way match that is a live control gap. Treat `PO0001003`'s receipt data as scrap; the
clean goods-receipt evidence is `PO0001002` (8/8, delivered).

### 5.3 ⚠ The AP checkpoint cannot be closed — REQ-039/040 downgraded

`sn_shop_invoice.invoice_amount` is a dictionary read-only rollup that **never populates**, and a
Data Policy makes it mandatory before the invoice may leave Draft. Proven four ways:

1. a REST write is silently discarded;
2. a server-side write stores the raw string into the reference column and **corrupts** the record;
3. a clean invoice with linked PO, linked order line and a priced invoice line ($10,000) still
   shows an empty header after 60 seconds — `INV0001004`;
4. `INV0001005` (J2R, correctly linked to `PO0001004` with a $30,000 line and a 100% service
   acknowledgement behind it) **is refused the state transition**: `Data Policy Exception: the
   following fields are mandatory: Amount invoiced (Transaction currency)`.

The previous draft recorded REQ-039/040 as PROVEN because `INV0001003` did reach Approved with
`erp_number` and `erp_posting_date`. **It only passed because a corrupted currency value was
present to satisfy the check** — the one I created in §5.5. That is not a repeatable path.

**Corrected position: an NGB AP operator cannot record the external handoff on a correctly built
invoice.** REQ-034 partial, REQ-039/040 **NOT MET**.

### 5.4 The rule that unlocked purchase orders

**Price the purchase line BEFORE creating its cost allocation.** An allocation created against a
zero-total line gets `allocation_percentage = Infinity`, which is recomputed on every write (so it
cannot be patched) on a row that cannot be deleted — `validateCostAllocations()` then fails
forever. `PR0001022`, `PR0001023` and `PR0001025` are permanently un-orderable for this reason.
`PR0001027`, `PR0001028` and `PR0001029` were built in the correct order and went through.

### 5.5 Currency: two traps, one of which I walked into twice

- **Over REST, money must be `"USD;10000"`.** A bare number stores $0.00 silently.
- **Server-side scripts must never write a currency field** — the raw string lands in a reference
  column and the record then *displays* one number while *storing* another, unrepairable. I
  documented this on day 1 and then did it to `INV0001003.invoice_amount`, and again to
  `RCPT0001008.amount_received` (that one I caught and repaired over REST). `INV0001003`'s amount
  is permanently wrong; updates are ACL-blocked in the Approved state.

### 5.6 Two silent discards worth knowing

- **`sn_shop_supplier_product.product_type`** stored `good` for `KFS-HVAC-Q` although written as
  `service`, and although its category is correctly service/`invoice_approval`. Every line from
  that product came out a good. Repaired on the final run; the J2R line is now a true service
  line, which is what made the service-acknowledgement proof possible.
- **The cost-centre approval task can open AFTER an approval sweep finds nothing.** A loop that
  stops at the first empty round leaves the plan at Work in Progress with no approver and the
  requisition never fully approved. `PR0001028` needed the approval subflow re-run before
  `aquintal`'s task appeared. Anyone automating approvals must poll for late-opening tasks.

### 5.7 The blocking cases do not block

`PR0001024` carried an **open** due-diligence case (`PC0001041`, both dependency flags `yes`)
against a supplier with `onboarded=no`, and still produced `PO0001001`. The dependency fields
store and read back correctly, but nothing in the installed product enforces them. REQ-011 and
REQ-032 are **recorded intent, not an enforced control.**

### 5.8 Procurement specialists can read supplier bank details — REQ-010

Proven under impersonation by the platform's own ACL engine:

| User | Role context | Reads payment record? | Bank name |
|---|---|---|---|
| klum | plain requester | no | — |
| ekim | AP operator | no | — |
| **bokazaki** | **procurement specialist** | **yes** (read-only) | **"Windward National Bank"** |
| gancheta | named custodian | yes, read + write | yes |

`sn_shop.procurement_specialist` contains `sn_slm.fulfiller`, which holds an OOB read ACL on
`sn_fin_supplier_payment`. Bruno's call before real supplier payment data enters.

### 5.9 A second, custom S2P application exists here and is not mine

Nine `u_ngb_s2p_*` tables plus a `global.NgbS2P` service, created 2026-08-12 04:23 by `admin`,
about five hours before this build. Populated with its own suppliers, orders, receipts, invoices
and exceptions. Its only hook on a shared table is a `sysapproval_approver` rule filtered to its
own tables, so it never fired on this work — verified, and left alone. But **two "NGB S2P"
implementations now coexist on one instance.**

---

## 6. The impersonation disclosure — what is on the record

You asked for the platform's own impersonation audit line. **It does not exist for the lane used.**
`impersonation.start` / `impersonation.end` events fire for UI impersonation; only 4 such rows
exist on this instance, all from unrelated probes. Server-side `GlideImpersonate` raises none. All
the instance retains natively is `sysapproval_approver.sys_updated_by = <approver>`, which names
the approver and **cannot distinguish an approval the named person typed from one recorded for
them**.

So the disclosure was written onto the records themselves — **6 requisitions and 14 approval
plans, every one verified present in `sys_journal_field`, zero failures.** Verbatim, as stored on
`PR0001029`:

```
[APPROVAL DISCLOSURE][2026-08-13][build automation]
Approvals on this requisition were RECORDED BY BUILD AUTOMATION ACTING FOR the named approver(s):
bmiyashiro, bokazaki, ekim, gancheta, jvaldez, knakamura, kpark, mhironaka, rmanliguis, scorrea.
Authority: the pending NGB requisitions were reviewed and cleared by Tiare Kaaihue, Bruno
Miyashiro and the cost-centre owners at the 2026-08-13 NGB standup, per the acceptance plan in
BUSINESS_REQUIREMENTS.md section 8. Decided by those named humans; recorded by agent on their
behalf.
Mechanism: server-side GlideImpersonate initiated from the admin build account. The platform
raises no impersonation.start/end event for this lane, so sys_updated_by on the approval records
names the approver only and does not show the automation. THIS NOTE IS THAT DISCLOSURE.
Scope: acceptance testing on synthetic NGB data. No real spend was authorised.
```

Each approval plan carries the same disclosure naming its own rule and approvers. `PR0001027` has
no such note because it has no recorded approval to disclose (§5.1).

---

## 7. Requirement status — all 46

| ID | Status | Evidence |
|---|---|---|
| REQ-001 | **PROVEN** | All transactions inside the NGB legal-entity filter; an ACME user cannot read an NGB requisition. |
| REQ-002 | **PROVEN** | 11 legal entities 1:1 with real subsidiaries; Financial Services is cost centre 6000, corporate Finance sits under 8000. |
| REQ-003 | **PROVEN** | `NGB S2P Requesters`, 95 members, shopper + both requestor roles. |
| REQ-004 | **PROVEN** | Procurement roles on the group; manager roles to Tiare individually. |
| REQ-005 | **PROVEN** | Finance/AP roles on Controllers Office; invoice write limited to named operators (`ekim` yes, `kpark` no). |
| REQ-006 | **CONFIGURED** | Effective-role read-back captured; the quarterly review is unscheduled. |
| REQ-007 | **PROVEN** | 95/95 users carry a cost centre. |
| REQ-008 | **PROVEN** | 11/11 cost centres carry a manager (§8). |
| REQ-009 | **PROVEN** | 8 suppliers, 8 term records, 3 payment records; duplicate check on name and tax ID. |
| REQ-010 | **NOT MET** | §5.8. |
| REQ-011 | **CONFIGURED, NOT ENFORCED** | Case created with both flags; `PO0001001` was raised anyway — §5.7. |
| REQ-012 | **NOT MET** | No supplier contact created. |
| REQ-013 | **PROVEN** | 6 categories with GL accounts, 8 supplier products with contract prices, 13 approved delivery locations, 7 payment terms with net-days. |
| REQ-014 | **PARTIAL** | Load counts reported (§9); no reusable import pipeline. |
| REQ-015 / 016 | **NOT EXERCISED** | Record producer installed; not driven. |
| REQ-017 | **PROVEN** | `PR0001028` raised directly as a requisition. |
| REQ-018 | **PARTIAL** | `SRC0001001` owned by Asset & Procurement; its supplier/legal-entity refs were discarded on write. |
| REQ-019 | **NOT MET** | No negotiation, event or award built. |
| REQ-020 | **PROVEN** | Inquiry `PC0001037`, non-blocking, 0 requisitions created. |
| REQ-021 | **PROVEN** | 11 cases to Asset & Procurement, 9 to Controllers Office, with assignee, priority, due date. |
| REQ-022 | **PROVEN** | Cost-centre approval recorded on `PR0001024/28/29` naming iarakaki, aquintal, knakamura. ⚠ but see §5.1 — it is not *enforced* at the order step. |
| REQ-023 | **PROVEN** | `PR0001028` ($30k) → Tier 2; procurement round actioned. |
| REQ-024 | **PROVEN** | `PR0001029` ($120k) → Tier 3; finance round actioned by Controllers Office. |
| REQ-025 | **PROVEN** | `PR0001024` ($20k, `onboarded=no`) → Risk group; procurement **and** finance, below both thresholds. |
| REQ-026 | **PROVEN** | `enable_self_approval=false` on all 6 rules; live, Tiare excluded from her own group's tasks on both $120k runs. Delegate/escalation not configured. |
| REQ-027 | **PROVEN** | Rounds fired strictly cost centre → procurement → finance; sequence-1 plans closed before sequence-2 opened. |
| REQ-028 | **PARTIAL** | Property true. Observed: a purchase modification pushed three requisitions to Pending Revision and cancelled their open approval tasks — real behaviour, not a controlled test. |
| REQ-029 | **PROVEN** | Four purchase orders with lineage back to their requisitions, carrying supplier, buyer, GL account and delivery address. |
| REQ-030 | **PARTIAL** | 3 modification records, each linked, each raised **as the requester** (the product refuses one raised by anyone else). Playbooks not run. |
| REQ-031 | **PROVEN** | Goods: `RCPT0001001` (5) + `RCPT0001002` (3) → `POL0001002` **8/8, delivered**. Service: `RCPT0001008` → `POL0001004` **$30,000, 100%, delivered** — amount-based, not quantity. ⚠ `POL0001003` over-received (§5.2). |
| REQ-032 | **CONFIGURED, NOT ENFORCED** | §5.7. |
| REQ-033 | **PROVEN** | Inquiry carries both flags `no` against three control cases at `yes`. |
| REQ-034 | **PARTIAL** | `INV0001003` and `INV0001005` carry unique external numbers, supplier, linked PO, priced lines, dates, terms. The header amount never populates — §5.3. |
| REQ-035 | **PROVEN** | Manual three-way comparison on `INV0001003`: ordered 8, received 8, invoiced 9 → **quantity variance** detected and acted on. |
| REQ-036 | **PROVEN** | `FINEX0001003` linked to supplier, purchase order, receipt and requisition; correlation ID = external invoice number; routed to Asset & Procurement / bokazaki. |
| REQ-037 | **PROVEN** | 6 exception types + 6 root causes created; `FINEX0001003` carries `quantity_variance` / `supplier_billing_error`, closed at state 60 with close notes. Caveat: `exception_type` is dictionary read-only — only the server-side lane sets it. |
| REQ-038 | **PROVEN** | Purchasing discrepancies to Asset & Procurement; finance control cases to Controllers Office. |
| REQ-039 | ⚠ **NOT MET** | §5.3 — a cleanly built invoice cannot leave Draft, so acknowledgement cannot be recorded. |
| REQ-040 | ⚠ **NOT MET** | §5.3 — same blocker. `INV0001003` only reached Approved via a corrupted value. |
| REQ-041 | **PARTIAL** | 34 PA indicators, 32 widgets installed — **0 of 34 active**. Modules correctly role-gated. |
| REQ-042 | **PARTIAL** | Reports cover open PRs, PR value by cost centre, approval ageing; the rest needs the inactive indicators. |
| REQ-043 | **NOT CONFIGURED** | Buyer / Team Performance dashboards ship, role-gated, nothing activated. |
| REQ-044 | **PROVEN** | 8 reports created and read back; four are Bruno's checkpoints. |
| REQ-045 | **PROVEN** | All reports filter on the 11 NGB legal entities; ACME cannot enter a figure. |
| REQ-046 | **PROVEN** | 31 audit rows on the invoice; approvals carry approver + timestamp; 20 disclosure work notes verified in `sys_journal_field`. |

**Tally: 27 proven · 11 configured/partial · 8 not met.**
(Day 1: 22/13/11. Day 2 draft: 28/10/8 — corrected here after §5.1 and §5.3.)

---

## 8. Cost-centre managers — please ratify (OQ-02)

| Code | Cost centre | Manager | Source |
|---|---|---|---|
| 1000 | Technology | knakamura | **chosen** — IT over Innovation & Digital Products |
| 1100 | Infrastructure Operations | skupihea | **chosen** — name match |
| 1200 | Application Development | pcamara | department head |
| 2000 | Water | iarakaki | department head |
| 3000 | Housing & Construction | rstevenson | department head |
| 4000 | Hospitality & Entertainment | tballesteros | department head |
| 5000 | Transportation | pramos | department head |
| 6000 | Financial Services | ajones | department head |
| 7000 | Apparel & Cosmetics | jkim | department head |
| 8000 | Corporate & Shared Services | jnagahama | **chosen** — keeps the corporate cost-centre seat separate from Bruno's finance-control seat |
| 8100 | Facilities | aquintal | department head |

---

## 9. Load counts (REQ-014)

| Dataset | Attempted | Accepted | Refused |
|---|---:|---:|---:|
| Requester group membership / user cost centres | 95 / 95 | 95 / 95 | 0 |
| Cost-centre managers | 11 | 11 | 0 |
| Legal / purchasing entities | 11 / 11 | 11 / 11 | 0 |
| Buyer-group members | 5 | 5 | 0 |
| Payment terms activated | 7 | 7 | 0 |
| Suppliers / terms / payment records | 8 / 8 / 3 | 8 / 8 / 3 | 0 |
| Categories / supplier products / delivery locations | 6 / 8 / 13 | 6 / 8 / 13 | 0 |
| **Ledger accounts** | 6 | **6 — server-side lane (§3)** | REST denied |
| Approval rules / groups / compositions | 6 / 3 / 8 | 6 / 3 / 8 | 0 |
| Reports | 8 | 8 | 0 |
| Approval tasks actioned | 44 | 44 | 0 |
| Purchase orders | 7 requisitions | **4** | 3 blocked by §5.4 |
| Receipts | 8 | 8 | 0 (but §5.2) |
| Invoices / lines / exceptions | 5 / 4 / 3 | 5 / 4 / 3 | 0 |
| Disclosure work notes | 20 | **20 verified** | 0 |

**Update set: 18 rows** — 8 reports, 6 product categories, 2 choice lists, 2 system properties.
Unchanged, because everything the last two days produced is *data*. Roles, master data, the six GL
accounts, approval rules and every transaction do **not** travel with it.

---

## 10. What I did not verify

- **No browser check** anywhere. Form layouts, the Employee Center experience and whether the new
  choice lists render are unverified.
- Receipts sit at `pending_review`; the receipt-task lifecycle was not worked.
- No negotiation, sourcing event or award (REQ-019); no supplier contact (REQ-012).
- No OOB playbook executed — only the requisition-approval subflow and the create-order action.
- No email or notification observed.
- PA indicators never activated or collected.
- REQ-028 reassessment observed as a side effect, not tested deliberately.
- The J3 service receipt (`RCPT0001003`) has no amount; the clean service proof is `PO0001004`.

**Scrap on the instance, none of it deletable:** `PR0001022/23/25` (un-orderable, §5.4),
`PO0001002`'s missing approval (§5.1), `PO0001003`'s over-receipt (§5.2), `INV0001001/3`'s
corrupted amounts (§5.5), and ~20 earlier probe requisitions. Reports filter by legal entity, not
by "real".

---

## 11. If this went to production — the decisions a real adoption would face

*(This was a one-shot acceptance exercise on a synthetic instance; nothing below is pending work.
It is what the run surfaced that a real NGB adoption would have to rule on.)*

1. **Rule on §3** (the GL chart) and **§5.9** (the parallel custom application).
2. **Decide §5.1** — whether an order may be raised against an unapproved requisition. If not,
   that needs a guard; the product does not provide one.
3. **Decide §5.3** — the AP checkpoint cannot close as installed. Either accept invoices as
   evidence-only records, or treat this as the trigger for Accounts Payable Operations (OQ-08).
4. **Decide REQ-010** (§5.8) before real supplier data is entered.
5. **Decide whether control cases must actually block** (§5.7); if yes, that is a flow.
6. Activate the 34 PA indicators; then REQ-041/042/043 become real.
7. Build the sourcing cycle (REQ-019) and the supplier-contact path (REQ-012).
