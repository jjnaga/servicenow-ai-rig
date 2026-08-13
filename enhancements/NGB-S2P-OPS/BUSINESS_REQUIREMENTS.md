# NGB Source-to-Pay Operations

## Business requirements specification

| Document control | Value |
|---|---|
| Organization | Nagahama Group (NGB) |
| Release basis | ServiceNow Australia; live install evidence from `dev409729` |
| Evidence date | 2026-08-11 HST |
| Document status | Pre-build business requirements baseline |
| Intended audience | NGB Finance, Asset & Procurement, cost-centre owners, AP staff, ServiceNow delivery team |
| Coverage target | Approximately 35% of the full Source-to-Pay operational arc |
| Instance action in this phase | None; discovery was read-only |
| Authorship | Two independent AI analysts: draft + live install audit by one (GPT-5.6); independent product-model derivation + lead review/merge by the other (Claude Opus). Both derivations converged on the product boundary, the slice, and the operator model before merge. |

## 1. Executive summary

NGB will establish a production-shaped Source-to-Pay foundation on the applications already installed in its ServiceNow PDI. The first stage covers supplier primary-data readiness, requester intake, sourcing and negotiation, purchase requisition approval, purchase-order handling, receipt or service acknowledgement, procurement control cases, a manual invoice/AP verification checkpoint, and OOB operational analytics. This is approximately one-third of the full suite: large enough to carry real work end to end, but deliberately short of a full ERP or every licensed S2P product.

The implementation will be OOB-first. It proposes **no custom application, table, column, or workflow engine**. NGB will configure the installed S2P records, roles, forms, flows, playbooks, procurement cases, approval rules, workspaces, and dashboards. Full Supplier Lifecycle Operations, Accounts Payable Operations, Purchase Order Operations, supplier-portal onboarding, systematic invoice matching, payment execution, and all external ERP or third-party wiring are out of scope because those products or endpoints are not present. Their boundaries remain named seams so this foundation can accept them later.

The business outcome is a controlled system of engagement:

1. a requester can ask for a product or service through a real NGB form;
2. Asset & Procurement can source, compare, approve, order, and manage exceptions in one work surface;
3. cost-centre and finance owners can authorize spend at defined thresholds;
4. receivers can acknowledge goods or services against the order;
5. AP can record and verify an invoice, route discrepancies, and record the external posting/payment reference; and
6. procurement and finance leads can see the work, cycle time, spend shape, savings, cases, and control failures in OOB analytics.

## 2. Governing scope and design principles

### 2.1 In-scope foundation

- NGB requester and operator access using group-based OOB roles.
- NGB organizational, cost-centre, delivery-location, supplier, category, and approval master data.
- Limited supplier enablement: create primary supplier records, protect payment data, and perform an OOB due-diligence gate.
- Existing-supplier and new/off-catalog request paths.
- Sourcing requests, negotiation events, awards, purchase requisitions, approvals, purchase orders, receipts, and service acknowledgements.
- OOB procurement support and control cases.
- Manual invoice entry, verification, acknowledgement, discrepancy routing, and external handoff evidence.
- OOB Sourcing and Procurement Operations and Procurement Case Management dashboards, supplemented only by configured OOB lists/reports where a finance checkpoint is not prepackaged.

### 2.2 Invariants

- ServiceNow is the system of engagement for request through receipt; it is not the accounting ledger or payment engine in this stage.
- NGB data and users only. The ACME demo population is scenery and must not own, approve, or report on NGB transactions.
- No requester approves their own purchase.
- No purchase requisition goes live until the requester's cost centre and the cost centre's active manager are populated.
- Supplier payment data uses the installed restricted roles and is not exposed to the full procurement or finance population.
- External ERP status is manual/stubbed and visibly identified as such; no inactive endpoint is presented as an integration.
- Every included business object uses an installed OOB table. Configuration is allowed; custom schema is not proposed.

### 2.3 Evidence boundary

The live install map is [S2P-INSTALL-MAP.md](./S2P-INSTALL-MAP.md). It proves the presence of 17 S2P-family scopes, 260 owned tables, 170 flows/subflows, 14 published active playbooks, 24 active catalog items, workspace routes, PA content, and a blank NGB transaction baseline. It also records the re-queried NGB operators/readiness gaps and the exact invoice/exception fields and invoice ACL-to-role mappings used below. Full AP-specific and Supplier Lifecycle-specific scopes are absent. Presence is not runtime proof: later implementation must configure and exercise the selected paths before calling them operational.

## 3. Who operates S2P at NGB

### 3.1 Organization boundary

The corporate-finance/controllers function is the `Finance` department inside the `Corporate & Shared Services` business unit. It is not Nagahama Financial Holdings.

`Nagahama Financial Holdings` is a banking line of business and subsidiary of Nagahama Group. Its requesters consume S2P under `NGB-6000 Financial Services`, just as Water, Housing & Construction, Hospitality & Entertainment, Transportation, Apparel & Cosmetics, Technology, and other NGB lines consume the service. They do not own corporate AP or procurement controls merely because the subsidiary's name contains “Financial.”

### 3.2 Persona and role mapping

| Business persona | NGB owner/population | OOB access baseline | Accountability in this stage |
|---|---|---|---|
| Business sponsor / finance control owner | Bruno Miyashiro, Director, Finance (North America); manager of `NGB Controllers Office` | `sn_fin.finance_user`; approved finance administration roles only where needed | Ratifies approval policy, owns finance controls and manual AP handoff |
| Procurement service owner | Tiare Kaaihue, Manager, Asset & Procurement; manager of `NGB Asset & Procurement` | `sn_shop.procurement_specialist_manager`, `sn_spend_psd.manager` | Owns procurement queue, assignment, sourcing policy, supplier readiness, and team performance |
| Procurement specialists | Procurement Specialists in `NGB Asset & Procurement` | `sn_shop.procurement_specialist`, `sn_shop.purchasing_task_owner`, `sn_spend_psd.agent`, `sn_spend_psd.procurement_task_owner` | Fulfill sourcing, procurement, control cases, orders, and receiving follow-up |
| Primary-data stewards | Named delegates in `NGB Asset & Procurement`; finance custodian for payment data | `sn_fin.procurement_primary_data_admin`; sensitive payment roles only for approved custodians | Maintain suppliers, categories, locations, terms, and related reference data |
| Accounts-payable operators | Approved members of `NGB Controllers Office`, initially the finance analysts designated by Bruno | `sn_shop.accounts_payable_viewer`, `sn_shop.invoice_owner`, `sn_shop.acknowledgement_task_owner`; named invoice-entry operators also receive `sn_shop.procurement_common_user` | Enter/verify invoice evidence, route discrepancies, and record external posting/payment status |
| Cost-centre owner | Active manager on each `NGB-*` cost-centre record | Approval task access through OOB approval routing | Confirms business purpose, budget ownership, and coding for every PR |
| Requester / shopper | Active `@nagahama.example` users across all 16 NGB departments, through `NGB S2P Requesters` | `sn_shop.shopper`, `sn_spend_psd.requestor`, `sn_spend_sdc.requestor` | Requests goods/services, supplies business context, and confirms receipt where assigned |
| Subsidiary requester | Same requester role, including Nagahama Financial Holdings and other NGB operating lines | Same as requester/shopper | Initiates spend against the correct NGB company, department, cost centre, and location |

### 3.3 Access decisions

- Create one configuration-only group, `NGB S2P Requesters`, for active NGB requesters instead of granting roles directly to 95 users.
- Assign baseline operator roles to the two real operating groups; restrict invoice-entry write access and supplier-payment roles to named, approved custodians.
- Keep procurement administration, finance administration, supplier-payment write access, request creation, and approval distinct enough to prevent one person from creating a request, editing sensitive supplier payment data, and approving the same spend.
- Review group membership and effective roles before go-live; the live baseline currently shows no NGB user with an effective S2P-family role.

## 4. End-to-end processes in scope

### 4.1 Process A — establish primary data and supplier readiness

**Business need.** Requesters cannot raise controlled purchases if suppliers, cost centres, delivery locations, categories, payment terms, and approval owners are unreliable. NGB also needs a light supplier gate without pretending that full Supplier Lifecycle Operations is installed.

**Requester/operator surfaces.** Procurement works from Source-to-Pay Workspace primary-data lists and the installed supplier forms. A requester identifies an existing or proposed supplier on `I need a product or service`; procurement creates or completes the supplier record. The installed `New Supplier Contact User Request` is used only after a supplier has been accepted and contact access is actually required.

**OOB records and fulfillment.** Supplier identity, details, and payment records use `sn_fin_supplier`, `sn_fin_supplier_detail`, and `sn_fin_supplier_payment`. Procurement uses the OOB `Due Diligence` procurement case to hold and route the readiness check. Supplier payment fields are maintained only by restricted finance custodians.

**Decision and approval.** Tiare or a delegated procurement lead approves operational readiness. Bruno or his delegate approves sensitive payment terms/data. Any request or award naming a proposed supplier is blocked from advancing to PR/PO until mandatory data is complete and its due-diligence case is closed acceptably. This stage does not claim an OOB reference qualifier that hides the supplier from every selection list.

**Foundation value.** These same supplier records are the natural handoff point for a later SLO portal, qualification workflow, risk service, and ERP supplier master sync.

### 4.2 Process B — request, source, and award

**Business need.** NGB requesters need one front door for catalog, quote-backed, and off-catalog demand while procurement retains control over supplier selection and competitive events.

**Requester surfaces.** The primary form is `I need a product or service`. `Submit quote` supports a requester who already has a supplier quote. `Ask Procurement` handles questions and assisted intake. The form captures requested-for, supplier posture, goods/service description, delivery or service location and dates, business reason, and quote/proposal evidence.

**OOB records and fulfillment.** Off-catalog or no-contract demand creates `sn_shop_sourcing_activity`. Asset & Procurement assigns the work, qualifies the intake, creates a negotiation/event where competition is appropriate, compares suppliers, and records the award. The selected award proceeds into a purchase requisition. Quote-backed or already-controlled demand may proceed directly to a requisition under policy.

**Approval logic.** The business authorization point is the purchase requisition. Procurement may reject or return incomplete sourcing requests before spend approval. New-supplier and non-budgeted requests require the additional finance gate defined below regardless of amount.

**Foundation value.** The selected supplier, categories, negotiation history, and award data support later contract, supplier-lifecycle, spend-management, and savings capabilities without re-keying the demand history.

### 4.3 Process C — requisition, approve, order, and receive

**Business need.** NGB needs enforceable approval, traceable conversion from request to order, and evidence that goods or services were received.

**Requester/operator surfaces.** Requesters track their purchase in ShoppingHub/Employee Center. Approvers act from approval tasks or supported email/work surfaces. Procurement works the PR, PO, purchasing tasks, and modifications in Source-to-Pay Workspace. Requesters or assigned receivers complete receipt tasks or service acknowledgements.

**OOB records and fulfillment.** `sn_shop_purchase_requisition` and its lines hold the internal request and accounting allocation. Published OOB flows manage PR state and approvals. An approved PR becomes `sn_shop_purchase`/`sn_shop_purchase_order` with linked lines. `sn_shop_receipt` and receipt tasks record full or partial delivery. OOB playbooks support PR/PO cancel and edit, receipt edit, return, and replacement paths.

**Approval logic.** Initial policy, subject to business ratification:

1. every PR requires the applicable cost-centre manager;
2. total reference amount of USD 25,000 or more also requires the `NGB Asset & Procurement` manager;
3. total reference amount of USD 100,000 or more also requires the `NGB Controllers Office` manager;
4. any new-supplier or explicitly non-budgeted purchase requires both procurement-manager and finance approval regardless of amount;
5. approval groups execute in sequence: cost-centre owner, procurement, then finance;
6. a material amount, supplier, cost-centre, or line change after approval triggers reassessment; and
7. requester self-approval is disabled.

The foundation assumes USD transactions. Multi-currency approval is an expansion item even though the OOB engine can compare transaction amounts to a reference currency.

**Foundation value.** Stable PR, PO, line, approval, and receipt relationships are the required basis for later ERP order transmission, supplier acknowledgements, automated invoice matching, accruals, and advanced PO exception management.

### 4.4 Process D — procurement controls, changes, and support

**Business need.** A straight-through purchase is not credible unless exceptions and human questions have owned queues, due dates, and blocking rules.

**Requester/operator surfaces.** `Ask Procurement` creates an inquiry. Procurement specialists work OOB procurement cases and tasks in the workspace. Purchase edit, return, replacement, cancellation, and receipt-correction requests use the installed catalog items and playbooks.

**OOB cases in the foundation.** NGB will configure and use:

- `Inquiry` for requester assistance;
- `GL Coding Review` for missing or disputed accounting allocation;
- `Budget Review` for non-budgeted or unclear funding;
- `Delivery Address Review` for nonstandard delivery;
- `Due Diligence` for supplier readiness;
- `Edit purchase`, `Return purchase`, `Replace purchase`, and `Edit receipt` for post-request changes.

Cases that affect authorization, supplier readiness, or order accuracy block the related sourcing/order step until resolved. Inquiry cases do not block unless procurement explicitly changes their disposition.

**Foundation value.** The OOB finance-case spine, assignments, tasks, SLAs, linked PR/PO/receipt records, and root-cause data support later decision automation and supplier/AP exception products.

### 4.5 Process E — invoice/AP verification and manual financial handoff

**Business need.** NGB needs visible evidence that an invoice relates to an authorized order and receipt, even though full APO and an ERP endpoint are not installed.

**AP/operator surfaces.** Approved Controllers Office users work invoice lists/forms and acknowledgement tasks. Named invoice-entry operators receive the table-level write role `sn_shop.procurement_common_user` in addition to the narrower AP viewer/owner roles; representative-user ACL and form testing is a go-live gate. Procurement resolves purchasing discrepancies in the workspace. Finance views the linked supplier, PO, lines, receipt state, amount, due/payment terms, tax, and external invoice reference.

**OOB records and fulfillment.** AP manually creates or receives a controlled import of `sn_shop_invoice` and line data. The invoice links to the supplier and PO. AP manually compares invoice evidence to the PO and receipt/service acknowledgement. No requirement claims systematic ServiceNow invoice matching.

When a mismatch exists, AP creates an OOB procurement exception using `sn_spend_sdc_exception`, links the PO/receipt/supplier, and uses the external invoice number as the correlation identifier. The foundation configures a controlled exception taxonomy: price variance, quantity variance, missing receipt, duplicate invoice, tax mismatch, and supplier/payment-data issue. Assignment is manual to Controllers Office or Asset & Procurement according to ownership; automated APO case generation is out of scope.

After verification, AP records acknowledgement/approval and manually posts or hands the invoice to the external accounting/payment process. The handoff maps exactly to OOB invoice fields: external posting reference in `erp_number`, source/system in `erp_source`, posting date in `erp_posting_date`, and lifecycle result in `state`; OOB update/audit history identifies the operator and timestamp. “Sent externally” means a human completed the handoff; it does not mean an integration ran.

**Foundation value.** PO, receipt, supplier, invoice, line, exception, and external-reference data establish the exact records a future APO matcher and ERP integration can consume.

## 5. Numbered business requirements

No requirement below calls for a custom app, table, or column. “OOB configuration” means records, roles, choices, forms, reports, assignment, decision, or approval configuration inside an installed platform capability.

| ID | Requirement | Why NGB needs it | OOB capability that satisfies it | OOB-vs-custom verdict |
|---|---|---|---|---|
| REQ-001 | The solution shall operate only on NGB users, companies, departments, cost centres, groups, suppliers, and transactions. | Prevents ACME demo data from contaminating ownership and analytics. | Company, user, group, department, cost-centre, and S2P reference fields. | OOB configuration; no custom schema. |
| REQ-002 | The solution shall treat Nagahama Financial Holdings as a requester line of business under Financial Services, not as the corporate finance owner. | Preserves the real NGB operating model. | NGB company hierarchy, business unit, department, and `NGB-6000` cost centre. | OOB master-data configuration. |
| REQ-003 | Active NGB requesters shall receive shopper/requestor access through `NGB S2P Requesters`. | Makes access maintainable and auditable. | `sys_user_group` plus installed shopper/requestor roles. | OOB platform configuration; one new group, no custom role. |
| REQ-004 | Procurement fulfillment and management access shall be assigned through `NGB Asset & Procurement`. | Uses the real operating team and queue owner. | Installed procurement specialist, manager, task-owner, and PCM roles. | OOB role-to-group configuration. |
| REQ-005 | Finance/AP access shall be assigned through approved membership in `NGB Controllers Office`; invoice-entry and payment-data write access shall be limited to named custodians. | Supports segregation of duties and protects sensitive supplier data. | Finance/AP roles; `sn_shop.procurement_common_user` for named invoice-entry operators; supplier-payment restricted roles for approved custodians. | OOB role configuration; no blanket write-role grant. |
| REQ-006 | Effective roles and group membership shall be reviewed before go-live and quarterly thereafter. | The current NGB baseline has no S2P roles and future drift creates control risk. | Group membership, role containment, and platform audit history. | OOB operating control. |
| REQ-007 | Every in-scope NGB requester shall have one valid NGB cost centre before creating a PR. | Enables coding, ownership, approval, and reporting. | `sys_user.cost_center` and `cmn_cost_center`. | OOB data remediation; go-live gate. |
| REQ-008 | Every active NGB cost centre shall have an active manager authorized to approve its spend. | The chosen OOB cost-centre approval route otherwise has no approver. | Cost-centre `Manager` plus Cost Center Managers approval rule type. | OOB data remediation and approval configuration. |
| REQ-009 | Supplier identity, detail, and payment data shall be held in the installed finance/supplier records, with duplicate checks before activation. | Creates one durable supplier spine and prevents duplicate spend records. | `sn_fin_supplier`, `sn_fin_supplier_detail`, `sn_fin_supplier_payment`. | OOB records and validation configuration. |
| REQ-010 | Supplier payment details shall be invisible to general requesters and procurement users without an approved business need. | Bank/payment data is materially more sensitive than supplier identity. | `sn_fin.supplier_payment_info_read` and `.write` roles. | OOB ACL/role model; no custom field. |
| REQ-011 | A request or award naming a proposed supplier shall not advance to PR/PO until an OOB Due Diligence case closes acceptably. | Provides a real blocking readiness gate without claiming full SLO onboarding or a universal supplier reference qualifier. | Base `Due Diligence` case, supplier references, and case dependency behavior. | OOB case configuration; no supplier-onboarding app or custom qualifier. |
| REQ-012 | Supplier contacts shall receive access only after supplier approval and only when an installed contact use case requires it. | Prevents the contact catalog item from becoming a fake onboarding portal. | `New Supplier Contact User Request` and Supplier Common contact records. | OOB catalog use with policy guardrail. |
| REQ-013 | Procurement shall maintain approved categories, supplier products/services, delivery locations, payment terms, and lead-time data needed by the forms. | Makes forms actionable and reporting meaningful. | ShoppingHub primary data and Finance Common Architecture. | OOB primary-data configuration. |
| REQ-014 | Primary/reference data loads shall produce owner-visible accepted, rejected, and corrected counts before promotion. | Manual loads otherwise hide partial success. | OOB forms/import sets and installed integration staging/error structures where validated. | OOB ingestion/control; no custom table. |
| REQ-015 | A requester shall be able to submit goods or service demand through `I need a product or service`. | Provides one recognizable NGB front door. | Installed record producer targeting `sn_shop_sourcing_activity`. | OOB catalog form configuration. |
| REQ-016 | Intake shall capture requester, company/cost centre, goods/service description, business reason, supplier posture, delivery/service location and dates, amount, and supporting quote/proposal. | Gives procurement and approvers enough context to decide without offline reconstruction. | Installed variables and S2P source/purchase fields. | OOB form configuration; no custom record type. |
| REQ-017 | A quote-backed or already-controlled request may proceed directly to a PR when procurement policy permits. | Avoids unnecessary sourcing work for known demand. | `Submit quote`, purchase requisition, and OOB purchase experience. | OOB process configuration. |
| REQ-018 | Off-catalog, no-contract, or competitively sourced demand shall create a sourcing request owned by Asset & Procurement. | Gives procurement control before spend authorization. | `sn_shop_sourcing_activity`, assignment, sourcing state flows. | OOB process and assignment configuration. |
| REQ-019 | Procurement shall be able to create a negotiation/event, compare suppliers, record an award, and carry the selected supplier into the PR. | Establishes transparent selection and reusable sourcing history. | Negotiation/event tables, sourcing workspace, award-to-PR flow. | OOB SPO capability. |
| REQ-020 | Requesters shall be able to ask a procurement question without creating a purchase. | Separates support from spend demand while preserving queue/SLA evidence. | `Ask Procurement` and base `Inquiry` procurement case. | OOB PCM configuration. |
| REQ-021 | Procurement work shall be assigned to an owned queue with due dates, priority, assignee, and escalation visibility. | Prevents work from disappearing in email. | Procurement cases/tasks, assignment fields, SLAs, workspace inbox. | OOB PCM/assignment configuration. |
| REQ-022 | Every PR shall require approval from its cost-centre manager. | Makes the budget owner accountable for every purchase. | OOB Cost Center Managers approval rule. | OOB approval configuration. |
| REQ-023 | PRs at or above USD 25,000 shall also require Tiare's procurement-manager seat. | Adds sourcing/control scrutiny for material purchases. | Specified group/manager approval rule and sequential approval groups. | OOB approval configuration; threshold awaits ratification. |
| REQ-024 | PRs at or above USD 100,000 shall also require Bruno's finance-control seat. | Adds finance oversight at the highest foundation threshold. | Specified group/manager approval rule and sequencing. | OOB approval configuration; threshold awaits ratification. |
| REQ-025 | New-supplier and non-budgeted PRs shall require procurement-manager and finance approval regardless of amount. | Risk is not captured by value alone. | Approval triggers/groups plus Due Diligence/Budget Review cases. | OOB approval and case configuration. |
| REQ-026 | Requester self-approval shall be disabled, and an unavailable approver shall have a controlled delegate/escalation path. | Prevents conflict and stalled approvals. | OOB self-approval control, delegates, approval tasks, scheduled escalation. | OOB approval configuration. |
| REQ-027 | Approval groups shall execute cost-centre, procurement, then finance in sequence; required peers within one group may act according to the ratified group decision method. | Preserves accountable review order without hard-coding users into a flow. | Approval group sequencing and decision methods. | OOB approval configuration. |
| REQ-028 | A material change to amount, supplier, cost centre, or purchase lines after approval shall trigger approval reassessment. | Prevents approved intent from being changed underneath the control. | PR revision and approval-plan reassessment behavior. | OOB process configuration. |
| REQ-029 | An approved PR shall create or advance the linked purchase/PO and retain lineage to source, lines, supplier, owner, and approvals. | Creates the transaction spine needed for receipt, invoice, analytics, and later ERP integration. | Purchase, PR, PO, and line tables plus published flows. | OOB SPO capability. |
| REQ-030 | Procurement shall process PO/PR edits, cancellation, return, replacement, and receipt correction through installed cases/playbooks. | Keeps post-approval changes visible and controlled. | Published cancel/edit/return/replace/edit-receipt playbooks. | OOB playbook/case configuration. |
| REQ-031 | Goods shall support full or partial receipts; services shall support service acknowledgement by an accountable receiver. | Establishes evidence that NGB received what it authorized. | Receipt, receipt task, quantity/amount/percentage, and acknowledgement capabilities. | OOB receiving configuration. |
| REQ-032 | Unresolved GL, budget, delivery-address, due-diligence, or material purchase-change cases shall block the affected sourcing/order step. | Prevents straight-through processing when a control is unresolved. | OOB procurement case dependency fields and case types. | OOB case/decision configuration. |
| REQ-033 | Inquiry cases shall be nonblocking unless procurement explicitly reclassifies the issue as a control case. | Keeps support responsive without unnecessarily stopping work. | Inquiry case type, case state, and dependency controls. | OOB case configuration. |
| REQ-034 | AP shall be able to record an invoice and its lines against the supplier and related PO using a unique external invoice number. | Creates visible AP evidence and supports duplicate review. | `sn_shop_invoice`, invoice line/task, supplier and PO references. | OOB records; manual/controlled import only. |
| REQ-035 | AP shall manually compare invoice amount/lines to the PO and required receipt or service acknowledgement. | Systematic matching is unavailable without APO/external capability. | Installed invoice, PO, line, and receipt records. | OOB data plus operating procedure; no fake automation. |
| REQ-036 | An invoice discrepancy shall create an OOB procurement exception linked to the PO, receipt, and supplier, with the external invoice number as correlation ID. | Gives discrepancies ownership, status, history, and traceability. | `sn_spend_sdc_exception` and its OOB relationship/correlation fields. | OOB record/configuration; manual creation. |
| REQ-037 | Invoice exceptions shall use controlled types for price, quantity, missing receipt, duplicate, tax, and supplier/payment-data issues, and capture root cause at close. | Makes exception trends actionable without a custom case table. | OOB `exception_type`, `root_cause`, state, assignment, and case history. | OOB field/value configuration; no custom column. |
| REQ-038 | AP shall route purchasing discrepancies to Asset & Procurement and finance/payment-data issues to Controllers Office with due dates and escalation. | Establishes clear cross-team ownership. | Exception assignment group, assignee, due date, priority, and task behavior. | OOB assignment/SLA configuration. |
| REQ-039 | AP shall record invoice acknowledgement/approval only after required receipt evidence or an approved policy exception exists. | Prevents payment readiness from outrunning receipt evidence. | Invoice acknowledgement/approval and linked exception/case records. | OOB control configuration and procedure. |
| REQ-040 | AP shall record the external accounting/payment handoff in invoice `erp_number`, `erp_source`, `erp_posting_date`, and `state`; OOB audit/update history shall evidence the operator and timestamp. ServiceNow shall not claim the external transaction was executed. | Provides reconciliation evidence while the ERP boundary is manual. | Exact installed invoice fields plus OOB audit/update history. | OOB fields plus manual procedure; no integration or custom handoff field. |
| REQ-041 | Procurement users shall receive the OOB Buyer, Strategy and Operations, and Team Performance dashboard experiences appropriate to their roles. | Avoids rebuilding analytics the product already supplies. | Installed PA indicators/widgets and Analytics Center/workspace routes. | OOB dashboard activation/configuration. |
| REQ-042 | Procurement leadership shall see open SRs/PRs, cycle time, negotiations, supplier/category spend, savings, overdue tasks, and SLA breaches. | Shows workload, throughput, value, and control health. | OOB SPO dashboard indicators/widgets. | OOB reporting configuration. |
| REQ-043 | Tiare shall see team workload and cycle/savings outcomes by buyer; individual specialists shall see their own due work. | Enables daily operating management. | Team Performance and Buyer dashboards. | OOB dashboard/role configuration. |
| REQ-044 | Bruno shall see PR value by cost centre, approval ageing, invoices pending verification, and exceptions by type/root cause. | Gives finance a control view without pretending APO dashboards exist. | OOB Strategy/Ops and PCM analytics plus configured platform lists/reports on invoice/exception records. | OOB reporting configuration; no custom dashboard app. |
| REQ-045 | Dashboard filters shall use NGB company, department, cost centre, supplier, category, buyer, and date; ACME data shall be excluded. | Makes metrics attributable and prevents demo-data leakage. | OOB PA/report filters and NGB reference data. | OOB reporting configuration. |
| REQ-046 | All status, approval, assignment, exception, acknowledgement, and external-handoff changes shall retain user and timestamp history. | Supports audit, troubleshooting, and future control testing. | Task/audit history, approval history, work notes, and record timestamps. | OOB platform behavior/configuration. |

## 6. Data and ingestion requirements

### 6.1 Current readiness facts

- `95` active `@nagahama.example` users exist across `16` departments.
- All `95` currently have blank cost-centre references.
- `11` `NGB-*` cost centres exist, including `NGB-6000 Financial Services` and `NGB-8000 Corporate & Shared Services`; all `11` currently have blank managers.
- The two operating groups and their managers exist.
- All mapped S2P supplier, approval, sourcing, requisition, PO, receipt, invoice, procurement-case, and exception business tables are empty.
- No NGB user currently has an effective role owned by the installed S2P-family scopes.

These are business-data prerequisites, not defects in the product install.

### 6.2 Required datasets and initial ingress

| Dataset | Business owner | OOB destination | Initial ingress | Acceptance gate |
|---|---|---|---|---|
| NGB users, departments, companies | NGB people-data owner | `sys_user`, `cmn_department`, `core_company` | Existing canon; controlled correction only | Active requester belongs to Nagahama Group and one valid department |
| User-to-cost-centre assignment | Each department owner; coordinated by Controllers Office | `sys_user.cost_center` | Validated CSV/import set or controlled form update | `95/95` in-scope users assigned; exceptions named and excluded |
| NGB cost centres and managers | Bruno / Controllers Office | `cmn_cost_center` | Validated CSV/import set or controlled form update | Every active `NGB-*` centre has one active manager and hierarchy |
| Requester/operator groups and roles | Tiare, Bruno, ServiceNow administrator | `sys_user_group`, memberships, role assignments; ShoppingHub buyer group/members for `NGB Asset & Procurement` | OOB group/role and buyer-group configuration | Effective-role read-back matches the persona matrix; buyer group resolves to real procurement members; no ACME member |
| Supplier identity/details | Tiare / primary-data steward | `sn_fin_supplier`, `sn_fin_supplier_detail` | OOB primary-data form; validated CSV/import set for volume | Unique supplier identity, status, owner, contact, terms, and required tax/address data complete |
| Supplier payment data | Bruno-approved custodian | `sn_fin_supplier_payment` | Restricted form or approved controlled load | Read/write access limited and read back under representative roles |
| Categories, products/services, supplier offerings | Asset & Procurement | ShoppingHub primary-data records | OOB forms or validated CSV/import set | Every acceptance journey can select an approved category/offering or use off-catalog intake |
| Delivery/service locations | Facilities / Asset & Procurement | OOB location/primary-data records | Existing locations plus controlled correction | Every acceptance journey has a valid pre-approved location |
| Legal entity, ledger/accounting, payment terms | Controllers Office | Finance Common/S2P primary data | Controlled form or validated import; legal entities map 1:1 to real NGB subsidiaries (Nagahama Financial Holdings, Nagahama Water, Naga Construction Hawaii/West, JDM Land, BettahBus, and regional divisions) so purchases carry the true operating company | Required PR/invoice fields resolve to active NGB values; every legal entity traces to a `core_company` subsidiary |
| Approval thresholds and groups | Bruno and Tiare | `sn_shop_approval_rule/group/plan` configuration | OOB configuration after policy sign-off | Each acceptance amount produces the expected non-self approval chain |
| Invoice evidence | Controllers Office/AP | `sn_shop_invoice` and lines | Manual form or controlled CSV/import; no supplier/ERP connection | Unique external number, supplier, PO, line, amount, currency, due terms, and operator recorded |
| ERP/accounting handoff evidence | Controllers Office/AP | Invoice `erp_number`, `erp_source`, `erp_posting_date`, `state`, and OOB audit/update history | Manual field update | External reference/source/date/status reconcile; audit identifies operator and update time |

### 6.3 Ingestion rules

1. Use OOB forms for small authoritative sets and OOB import sets for repeatable bulk loads.
2. Use installed `sn_fcms_intg`, `sn_spend_intg`, or FTP staging structures only after the later build proves the specific mapping and error route; their presence alone does not make an integration live.
3. Every load has a named owner, source file/version, expected count, accepted count, rejected count, duplicate count, and correction disposition.
4. Never load directly into S2P business tables merely because REST permits it when an installed intake/staging path owns the object.
5. No external scheduler, supplier portal, ERP connector, or third-party API is part of this stage.
6. Synthetic seed transactions must use NGB users and companies only and must be distinguishable from any preloaded ACME demo records.

## 7. Dashboards and reporting

### 7.1 OOB-first audience views

| Audience | Primary OOB view | Required decisions supported |
|---|---|---|
| Procurement specialist | Buyer dashboard and workspace inbox | What is mine, what is late, and what needs action today? |
| Tiare / procurement leadership | Team Performance plus Strategy and Operations | Where is work stuck, who is overloaded, what is cycle time, and where are savings or SLA problems? |
| Bruno / finance control | Strategy and Operations, PCM analytics, and configured invoice/exception lists | What spend is awaiting authorization, receipt, invoice verification, or exception resolution? |
| Cost-centre owner | Approval tasks and scoped request/PR visibility | What am I authorizing, against which centre, and what changed? |
| Requester | ShoppingHub/Employee Center request status | Where is my request, what action is required, and has delivery been recorded? |

### 7.2 Minimum measures

- count and value of open sourcing requests and PRs by state;
- PR approval age and cycle time;
- open negotiations and recorded savings/outcomes;
- PO value by supplier, category, cost centre, and buyer;
- receipt/service-acknowledgement lag;
- open procurement cases/tasks, priority, age, and SLA breach;
- invoices pending manual verification/acknowledgement;
- invoice/procurement exceptions by type, root cause, owner, age, and outcome; and
- manual external handoffs awaiting reference or reconciliation.

OOB indicators/widgets are used wherever they answer the question. Invoice checkpoint and manual-handoff measures may use configured platform lists/reports because the full APO dashboard package is not installed. No bespoke analytics application is required.

After configuration and acceptance, the dashboards can be operationally useful but will remain historically thin: the current S2P business tables contain no rows, so trend claims require accumulated NGB data.

## 8. Business acceptance outcomes

The later implementation is acceptable only when the business can demonstrate these journeys using synthetic NGB data and representative role impersonation:

| Journey | Expected business outcome |
|---|---|
| Existing supplier, USD 10,000 goods request | Requester submits; cost-centre owner approves; procurement creates/advances PO; receiver records partial then full receipt; AP records and verifies invoice; external handoff reference closes the checkpoint. |
| Quote-backed, USD 30,000 service request | Quote proceeds to PR; cost-centre owner then Tiare's procurement seat approve; a service acknowledgement, not a goods quantity receipt, supports invoice verification. |
| New supplier, USD 20,000 off-catalog request | Sourcing request and supplier due-diligence case are owned by Asset & Procurement; finance and procurement approve regardless of amount; award proceeds to PR only after readiness closes. |
| Existing supplier, USD 120,000 purchase | Cost-centre, procurement, and Bruno's finance seats approve in sequence; requester cannot self-approve; material revision re-evaluates approval. |
| Invoice quantity/receipt discrepancy | AP records invoice, detects mismatch manually, creates a linked exception, procurement resolves receipt/purchase evidence, AP records root cause and external handoff only after resolution. |
| Procurement question with no purchase | Requester uses Ask Procurement; a nonblocking inquiry is assigned, fulfilled, measured, and closed without creating a PR. |

Acceptance must include negative controls: an ACME user cannot operate an NGB transaction; a requester cannot self-approve; a user without restricted payment access cannot view supplier payment details; a PR with blank cost centre cannot proceed; and no UI or report labels a manual ERP/AP handoff as automated.

## 9. Explicitly out of scope

| Excluded capability | Why excluded now | Foundation seam retained |
|---|---|---|
| Full Supplier Lifecycle Operations | Required product/scope and supplier portal are not installed. | Supplier common records, primary data, contacts, due-diligence case, and supplier ownership. |
| Portal-led supplier onboarding, questionnaires, qualification, risk orchestration | Would falsely imply SLO and external supplier participation. | Approved supplier/contact records and readiness outcome can seed a future SLO workflow. |
| Full Accounts Payable Operations | AP-specific scopes are not installed. | Invoice/line, PO, receipt, acknowledgement, exception, and external-reference data. |
| Systematic two-/three-way invoice matching and automatic AP exception cases | Installed SPO documentation explicitly leaves matching external or manual. | Manual verification rules and structured exception/root-cause records define future automation inputs. |
| Payment execution, bank validation, tax settlement, GL posting, accruals | These belong to financial systems/APO/ERP and carry higher controls. | Manual external handoff status/reference makes the boundary auditable. |
| Purchase Order Operations supplier acknowledgements/exceptions | The dedicated product is not installed. | PO, PO lines, receipt, modification playbooks, and generic procurement cases. |
| ERP, supplier portal, bank, tax, carrier, e-signature, punchout, catalog, or third-party integrations | The brief explicitly excludes third-party/ERP wiring and no receiver is configured. | `sn_fcms_intg`, `sn_spend_intg`, and FTP staging/error data models remain named integration seams. |
| Full contract lifecycle management and contract authoring | Not required for the first operational loop and may depend on adjacent products. | Request/negotiation/award/PO can reference existing contract data where available. |
| Spend-management program, procurement pipeline/project costing, advanced savings planning | Valuable but not necessary to establish the transaction/control spine. | Categories, suppliers, buyers, negotiation outcomes, amounts, and PA history provide later inputs. |
| Mobile, Virtual Agent, NLU/Now Assist expansion | Not needed to prove the core browser/workspace process. | Installed mobile/VA/NLU scopes are untouched and can extend the same records later. |
| Multi-currency operating model | Approval thresholds, exchange-rate ownership, and accounting policy are not yet ratified. | OOB reference-currency approval behavior is available for a later stage. |
| Automated historical-data migration | The foundation needs clean reference data and controlled synthetic journeys first. | OOB import/staging patterns and ownership rules are defined. |

## 10. Assumptions

1. The implementation target remains the synthetic `dev409729` PDI; all data in it is synthetic and no production data of any kind enters it.
2. Australia release documentation is the relevant product baseline; the live PDI inventory wins whenever documentation describes an adjacent uninstalled product.
3. Tiare and Bruno are the accountable procurement and finance-control owners for the foundation; delegates must be explicitly approved.
4. NGB accepts ServiceNow as the system of engagement and a manual accounting/payment handoff for this stage.
5. The foundation operates in USD until NGB ratifies multi-currency rules.
6. The USD 25,000 and USD 100,000 thresholds are proposed starting policy, not discovered corporate policy.
7. NGB will provide or ratify cost-centre managers, requester assignments, supplier seed data, categories, locations, payment terms, and accounting references before process activation.
8. Installed OOB flows, playbooks, roles, and dashboards can be configured, but their runtime behavior remains subject to later read-back and end-to-end verification.

## 11. Risks and mitigations

| Risk | Consequence | Required mitigation |
|---|---|---|
| All 95 NGB users and all 11 NGB cost centres lack the cost-centre ownership needed by the chosen approval route. | Approval may have no accountable recipient or reporting dimension. | Treat both mappings as a go-live gate; report completeness before activating PR intake. |
| Product docs show end-to-end S2P journeys that rely on SLO/APO/POM, while those products are absent live. | Stakeholders may mistake documented suite behavior for installed capability. | Keep product boundaries explicit in forms, demos, requirements, and acceptance; live scope wins. |
| Flow/playbook presence has not been runtime-tested. | A published artifact may still depend on missing configuration or data. | Later build must inspect inputs/dependencies, execute representative journeys, and read records back. |
| Manual invoice and ERP handoff can drift from the external ledger. | ServiceNow and accounting statuses may disagree. | Require unique external reference, operator/date, reconciliation list, and aged-handoff owner. |
| Supplier payment details are sensitive. | Excess access can expose payment data or enable fraud. | Named custodians, restricted roles, representative-user access tests, and quarterly access review. |
| Blank transaction history produces empty or misleading trend dashboards. | Leaders may overread early metrics. | Label the baseline date, distinguish operational queues from historical trends, and accumulate clean NGB data. |
| Choice/taxonomy configuration on the generic exception spine may not supply automated routing by itself. | Exceptions may be classified but not reach the right team. | Require explicit assignment ownership and test each type; keep automated APO generation out of scope. |
| Manual imports can partially succeed. | Master data may appear complete while rows failed. | Reconcile expected/accepted/rejected/duplicate counts and assign every reject. |

## 12. Open business questions

| ID | Decision needed | Proposed owner | Why it blocks or changes the design |
|---|---|---|---|
| OQ-01 | Ratify or replace the USD 25,000 procurement and USD 100,000 finance thresholds. | Bruno and Tiare | Approval configuration and acceptance expected results depend on them. |
| OQ-02 | Name the manager/owner for each of the 11 `NGB-*` cost centres and map all 95 active users. | Bruno with department leaders | Cost-centre approval cannot go live honestly without it. |
| OQ-03 | Name the Controllers Office members who may enter invoices and the smaller set who may read/write supplier payment data. | Bruno | Determines segregation of duties and restricted access. |
| OQ-04 | Decide whether internal ServiceNow POs receive an NGB numbering policy and which external reference proves manual accounting handoff. | Bruno and Tiare | Defines reconciliation and the future ERP contract. |
| OQ-05 | Define which purchases allow two-way control without a receipt and which require goods receipt or service acknowledgement. | Bruno and Tiare | Changes invoice verification and exception outcomes. |
| OQ-06 | Ratify invoice exception owners, due times, escalation, and root-cause taxonomy. | Controllers Office and Asset & Procurement | Turns generic exception records into an operating control. |
| OQ-07 | Select the initial suppliers, categories, delivery locations, and representative NGB requesters for acceptance journeys. | Tiare | Determines the smallest real data set that exercises the foundation. |
| OQ-08 | Decide the trigger for adding SLO, APO, POM, ERP integration, or multi-currency in a later stage. | NGB program sponsors | Defines when the named seams become funded scope rather than assumptions. |

## 13. Traceability and source confidence

| Source | Used for | Confidence rule |
|---|---|---|
| Live read-only `dev409729` inventory captured in [S2P-INSTALL-MAP.md](./S2P-INSTALL-MAP.md) | Installed scopes, tables, fields, ACL-to-role mappings, flows, playbooks, catalog, workspace, analytics, live NGB readiness, and blank transaction baseline | Authoritative for what exists on this PDI as of 2026-08-11 |
| ServiceNow Australia Source-to-Pay documentation | Intended module boundaries, personas, and process semantics | Authoritative for product intent; not proof an adjacent product is installed |
| Live NGB organization records and `instance-profile.md` | Companies, business units, departments, cost centres, users, groups, and managers | Live read wins where cached counts have drifted |
| Thresholds, operating ownership, exception taxonomy, and USD-only boundary in this document | Proposed NGB business policy | Must be ratified before configuration is treated as approved policy |

This specification is the stage-setting contract for a later implementation. It does not authorize building, installing, seeding, changing the PDI, connecting an external system, or promoting any artifact.
