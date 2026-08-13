# NGB Source-to-Pay Operations — Installed Capability Map

**Instance:** `dev409729` (Australia patch 3)  
**Observed:** 2026-08-11 HST  
**Method:** read-only Table API and Stats API introspection through `scripts/sn`  
**Purpose:** factual floor for the NGB Source-to-Pay business requirements; this is not a build inventory or runtime certification

## 1. Installation verdict

The Sourcing and Procurement / Source-to-Pay product family **is installed**. Seventeen exact S2P-family scopes exist and own 260 table definitions, 44 roles, 170 flows/subflows, 14 published playbooks, 24 active catalog surfaces, 44 Workspace routes, 34 Performance Analytics indicators, and 32 PA widgets.

The install is metadata-complete enough to configure a real sourcing and procurement operating slice, but it is **not business-configured**:

- zero suppliers, supplier details, or supplier payment rows;
- zero sourcing requests, purchase requisitions, purchases, purchase orders, receipts, or invoices;
- zero approval groups or approval rules;
- zero procurement cases, supplier cases, or procurement exceptions; and
- zero effective S2P-family roles on NGB users (`@nagahama.example`).

Presence is not runtime proof. This run did not activate, execute, seed, or modify anything.

## 2. Installed applications and scopes

`sys_scope` returns the following 17 exact scopes. The product components are Store-delivered scopes rather than `sys_app` rows: the same exact scope filter returns zero `sys_app` records. That is not an absence signal.

| Scope | Installed application | Version | Owned tables |
|---|---|---:|---:|
| `sn_fcms_intg` | ERP Integration Framework | 19.0.3 | 50 |
| `sn_fin` | Finance Common Architecture | 12.0.1 | 45 |
| `sn_pr` | Sourcing and Purchasing Automation | 11.4.1 | 3 |
| `sn_shop` | Source-to-Pay Common Architecture | 24.0.0 | 90 |
| `sn_shop_mobile` | Shopping Hub Mobile | 8.0.1 | 8 |
| `sn_shop_va` | Virtual Agent for Source-to-Pay Operations | 3.11.0 | 0 |
| `sn_slm` | Supplier Common Architecture | 11.0.6 | 8 |
| `sn_spend_cp` | Playbooks for Sourcing and Procurement Operations | 8.5.5 | 0 |
| `sn_spend_ftp_intg` | Procurement File Transfer Framework | 2.2.2 | 5 |
| `sn_spend_intg` | Source-to-Pay Integration Framework | 14.0.2 | 41 |
| `sn_spend_nlu` | NLU Models for Sourcing and Procurement Operations | 2.0.5 | 0 |
| `sn_spend_pa` | Performance Analytics for Sourcing and Procurement Operations | 3.0.16 | 1 |
| `sn_spend_ppm` | Project Costing for Sourcing and Procurement Operations | 4.0.1 | 0 |
| `sn_spend_psd` | Procurement Case Management | 19.0.3 | 4 |
| `sn_spend_sdc` | Common Service Delivery | 14.0.0 | 5 |
| `sn_spend_vrm` | Risk Assessments Integration for Sourcing and Procurement Operations | 1.9.0 | 0 |
| `sn_spend_workspace` | Source-to-Pay Workspace | 20.0.1 | 0 |

### Installed-boundary qualification

No full Accounts Payable-specific scope (`sn_ap_*`) or full Supplier Lifecycle-specific scope (`sn_slo_*`) exists. The installed bundle still supplies invoice data/acknowledgement, common supplier data/cases, procurement exceptions, and AP-viewer access, but it does **not** prove that the full Accounts Payable Operations or Supplier Lifecycle Operations products are licensed and installed.

## 3. Functional data model

The following OOB tables form the useful implementation spine. Counts below are current business-row counts, not schema counts; all are zero at this baseline.

### Finance and supplier foundation

| Table | Business object | Load-bearing direct fields |
|---|---|---|
| `sn_fin_supplier` | Supplier | number, related company, registration country, tax ID, legal/purchasing entities, payment term, onboarding/preferred/risk/NDA state, shipping region/lead |
| `sn_fin_supplier_detail` | Supplier-to-legal-entity terms | supplier, legal entity, payment method/term, remittance address, bank details, payment/posting holds |
| `sn_fin_supplier_payment` | Protected payment instructions | supplier, bank/country/currency, encrypted account number, routing/IBAN/SWIFT, payment method, primary flag |
| `sn_slm_case` | Supplier case | supplier, stage, playbook, location, resolution/root cause; inherits the finance case/task spine |
| `sn_slm_task` | Supplier fulfillment task | inherits the finance task spine |

Supporting master-data tables include legal entities, purchasing entities, buyer groups/members, ledger accounts, tax codes, payment terms, office locations, delivery locations, currencies, units of measure, and job codes.

### Source, procure, receive, pay

| Stage | OOB table(s) | Load-bearing direct fields / relationships |
|---|---|---|
| Source | `sn_shop_sourcing_activity`, `sn_shop_negotiation`, `sn_shop_negotiation_event`, `sn_shop_sourcing_task` | request owner, category/model, supplier need, budget, due dates, sourcing stage, negotiation/event, purchase line, status |
| Request | `sn_shop_purchase`, `sn_shop_purchase_line`, `sn_shop_purchase_requisition` | submitted/requested-for ownership, category, supplier, cost centre, legal/purchasing entity, amount, delivery date/location, payment term, approval/rejection, ERP state |
| Approve | `sn_shop_approval_rule`, `sn_shop_approval_group`, `sn_shop_approval_plan`, `sn_shop_approval_plan_detail` | threshold/trigger, approval sequence and decision method, users/groups/job levels, self-approval rule, approving header/line objects |
| Order | `sn_shop_purchase_order`, `sn_shop_purchase_order_line` | buyer group, order/line details, supplier contact, category/SKU, invoice progress, reference back to the originating purchase |
| Receive | `sn_shop_receipt`, `sn_shop_receipt_task` | PO line, quantity/amount/percentage received, receiver/date, source/status, ERP state |
| Invoice | `sn_shop_invoice`, `sn_shop_invoice_line`, `sn_shop_invoice_task` | supplier and external invoice number, PO, legal entity, due/payment terms, line cost centre/ledger/order line, approval, acknowledgement, tax, `erp_number`, `erp_source`, `erp_posting_date`, payment date, and status |

### Service cases and exceptions

| Table | Purpose |
|---|---|
| `sn_spend_psd_procurement_request` | Procurement case; inherits the finance case spine |
| `sn_spend_psd_procurement_request_line` | Case line |
| `sn_spend_psd_procurement_task` | Agent fulfillment task |
| `sn_spend_psd_purchase_modification` | Edit/cancel/return purchase request context |
| `sn_spend_sdc_exception` | Procurement exception with direct PR, PO, receipt, supplier, correlation ID/display, assignment, `exception_type`, and `root_cause` fields; inherits finance case behavior |

`sn_spend_sdc_exception.exception_type` is a string with no installed choice rows. An NGB exception taxonomy may be configured against this OOB field, but the install does not supply one.

### Integration seam already supplied

- `sn_fcms_intg` owns ERP source/configuration, job tracking, role/user mapping, and 50 inbound staging/mapping tables for suppliers, cost centres, legal entities, purchase orders, receipts, invoice responses, tax, currency, and related master data.
- `sn_spend_intg` owns 41 catalog/sourcing/requisition/order/receipt outbound and inbound queue/stage/error tables.
- `sn_spend_ftp_intg` owns five file-ingestion tables/configurations for catalog, invoice, order acknowledgement, and shipment files.

These are real seams, but no external ERP or third-party connection is configured for NGB.

## 4. Roles and personas

The scopes ship 44 roles. The useful persona map is:

| Persona | Principal OOB roles |
|---|---|
| Requester / shopper | `sn_shop.shopper`, `sn_spend_psd.requestor`, `sn_spend_sdc.requestor` |
| Procurement specialist | `sn_shop.procurement_specialist`, `sn_shop.purchasing_task_owner`, `sn_spend_psd.agent`, `sn_spend_psd.procurement_task_owner` |
| Procurement lead / administrator | `sn_shop.procurement_specialist_manager`, `sn_shop.procurement_administrator`, `sn_shop.procurement_common_admin`, `sn_spend_psd.manager`, `sn_spend_psd.psd_admin` |
| Finance / primary-data administrator | `sn_fin.finance_user`, `sn_fin.finance_admin`, `sn_fin.accountant`, `sn_fin.organization_admin`, `sn_fin.procurement_primary_data_admin` |
| Supplier operations | `sn_slm.owner`, `sn_slm.fulfiller`, `sn_slm.agent`, `sn_slm.manager`, `sn_slm.admin`, `sn_slm.contact` |
| Accounts-payable visibility / acknowledgement | `sn_shop.accounts_payable_viewer`, `sn_shop.invoice_owner`, `sn_shop.acknowledgement_task_owner` |
| Sensitive supplier-payment access | `sn_fin.supplier_payment_info_read`, `sn_fin.supplier_payment_info_write` |
| Integration operations | `sn_fcms_intg.integration_user`, `sn_fcms_intg.admin`, `sn_spend_intg.procurement_integrator`, `sn_spend_intg.admin` |
| Analytics / project costing | `sn_spend_ppm.project_manager`; procurement dashboards are restricted to procurement specialist/manager/admin roles |

No NGB user currently holds any effective role owned by these scopes. Role-to-group assignment is therefore a required configuration decision, not an inherited fact.

For manual invoice entry, active table-level `sn_shop_invoice` create/write ACLs name `sn_shop.procurement_common_user` and `sn_shop.procurement_common_admin`; read ACLs separately name `sn_shop.accounts_payable_viewer` and `sn_shop.invoice_owner`. The common-user role is therefore an explicit restricted grant for named invoice-entry operators, not an implied child of the AP viewer. Field-level and impersonated form outcomes still require later acceptance testing.

## 5. OOB automation

### Flow Designer inventory

The installed scopes own 170 flows/subflows:

- 161 Published and active;
- 6 Published and inactive;
- 2 Draft and inactive; and
- 1 Draft but active.

The process backbone already includes:

- Sourcing Request, Negotiation, Negotiation Event, Purchase Requisition, Purchase Order, receipt, and line state flows/handlers;
- generic approval and approval-group-plan processing, requisition approvals, notifications, reminders, and attachment handling;
- purchase-order creation/update/cancellation and receipt/invoice operations at the ERP boundary;
- procurement-case creation, task assignment, confirmation/rejection, and auto-close;
- supplier-contact onboarding and contact approval/rejection; and
- file/integration queue and error handling.

Nine definitions require caution before a later build depends on them. Six are Published+inactive, two are Draft+inactive, and `Create/update receipt on outbound table` is Draft+active. Their presence does not establish runtime readiness.

### Published playbooks

All 14 installed process definitions are Published and active:

1. Cancel a purchase order
2. Cancel a purchase requisition
3. Edit a purchase order
4. Edit a purchase requisition
5. Edit a receipt
6. Generate procurement case and procurement case lines
7. Negotiation setup
8. Replace a purchase
9. Request a copy of contract
10. Return a Purchase
11. Send NDA for signature
12. Sourcing intake
13. Verify and approve accounting fields on PRL
14. Verify and approve delivery address

The installed playbook set is procurement-centered. It does not include a full supplier-onboarding playbook or AP invoice-exception playbook.

## 6. Requester and operator surfaces

### Active catalog and Employee Center surfaces

All 24 scoped catalog records are active.

| Component | Surfaces |
|---|---|
| Source-to-Pay Common Architecture | `Buy something`; `I need a product`; `I need a service`; `I need to submit a quote`; `Cancel a purchase`; `Edit a purchase`; goods/services sourcing checkouts; goods/services contract renewals |
| Sourcing and Purchasing Automation | goods/services purchasing checkouts; goods/services award-supplier checkouts |
| Procurement Case Management / Playbooks | two `Ask procurement` variants; `Edit a receipt`; `Request a copy of contract`; `Return a purchase` |
| Supplier Common Architecture | `New supplier contact user request`; `Request an access change request`; `Update default supplier`; `Create a new task`; `Submit an idea` |

Representative record-producer targets prove the front-to-back seam:

| Request surface | Creates / drives |
|---|---|
| `I need a product` / `I need a service` | `sn_shop_sourcing_activity`; captures requested-for, supplier posture, delivery/service location and dates, purchase reason, quote/proposal/POC needs |
| `I need to submit a quote` | `sn_shop_purchase_requisition`; captures existing/new supplier, goods/services, business reason, and quote attachment |
| `Ask Procurement` | `sn_spend_psd_procurement_request`; optionally links an existing requisition or order and captures the needed help |
| `Cancel a purchase` / `Edit a purchase` / `Return a purchase` | `sn_spend_psd_purchase_modification`; captures affected records, reason, scope, quantities, budget, and delivery changes |
| `New supplier contact user request` | `sn_slm_case`; captures supplier-contact identity and primary-contact status |

### Workspace and classic fulfiller surfaces

`sn_spend_workspace` owns one active UX app configuration (`PSM App Config`) and 44 routes. Key routes include:

- landing, inbox, list, record, search, and task-tab surfaces;
- Sourcing and Procurement, Analytics Center, and Category Analytics;
- add sourcing request, add supplier, add-to-sourcing-event, award suppliers, and merge requisition; and
- procurement case/task creation and related case/task views.

The product scopes also own 212 classic modules. Functional modules include all/my sourcing requests, negotiations, requisitions, purchase orders, purchasing tasks, invoices, acknowledgements, receipts, suppliers, approval rules/groups/plans, primary data, procurement cases, knowledge, integrations, and dashboards.

## 7. Analytics and reporting surfaces

The analytics install is present, but not as legacy `pa_dashboards` records:

- 34 S2P-family PA indicators;
- 32 `sn_spend_pa` widgets;
- zero scoped `pa_dashboards` rows;
- active classic `Dashboards` modules; and
- Workspace `Analytics Center` and `Category Analytics` routes.

Installed measures/widgets cover open requisitions and sourcing requests, requisition/sourcing cycle time, open negotiations, purchasing tasks, spend by category, spend by supplier, negotiated savings, expiring contracts, after-the-fact requisitions, procurement SLA duration/breaches, and employee/team performance.

Because all business tables are empty, these surfaces have metadata but no NGB operating story yet.

## 8. Live NGB readiness snapshot

Re-queried read-only on 2026-08-11 HST:

- all `95` active `@nagahama.example` users belong to Nagahama Group and span `16` departments;
- all `95` have a blank cost-centre reference;
- `11` `NGB-*` cost centres exist, including `NGB-6000 Financial Services` and `NGB-8000 Corporate & Shared Services`, and all `11` have a blank manager;
- `NGB Asset & Procurement` is managed by Tiare Kaaihue and has five members, including two Procurement Specialists;
- `NGB Controllers Office` is managed by Bruno Miyashiro and has five members, including two Finance Financial Analysts;
- the `Finance` department belongs to the `Corporate & Shared Services` business unit; and
- Nagahama Financial Holdings is a subsidiary/line of business under Nagahama Group, not the corporate Finance department.

These rows establish real operators but not approval readiness. User cost-centre and cost-centre-manager population is a go-live prerequisite for OOB cost-centre approval.

## 9. Evidence limits and implications

### Verified

- exact installed scope names/versions;
- owned-table, role, flow, playbook, catalog, route, module, indicator, and widget counts from Stats API filters;
- key table existence, inheritance, and direct dictionary columns;
- direct invoice/exception integration, correlation, relationship, and assignment columns;
- table-level invoice create/write/read ACL-to-role mappings;
- selected catalog producer targets and variables;
- publish/active state for flows and playbooks; and
- empty business baseline plus absence of NGB product-role assignments.

### Not verified in this read-only run

- runtime execution of any flow, playbook, catalog item, Workspace route, or dashboard;
- field-level ACL outcomes and persona experience under impersonation;
- whether the two same-named `Ask procurement` producers are intentionally exposed together;
- precise packaging/licensing relationship between the installed common supplier/invoice capabilities and the uninstalled full SLO/AP products;
- external ERP/file/punchout/catalog/sourcing connections; none were configured or tested; and
- business choice/configuration values, because the key OOB business/config tables are empty.

The requirements spec must therefore configure the installed OOB procurement spine, keep ERP/external boundaries manual or stubbed, avoid claiming full AP/Supplier Lifecycle capability, and make all unverified runtime behavior an acceptance condition for the later build.
