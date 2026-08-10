import { Acl, Applicability, Dashboard, UxListMenuConfig, Workspace } from '@servicenow/sdk/core'
import { aiControlReviewer, aiControlUser } from '../security/roles-acls.now'

const audience = Applicability({ $id: Now.ID['ai-control-workspace-audience'], name: 'AI control workspace audience', roles: [aiControlUser, aiControlReviewer] })
const lists = UxListMenuConfig({
    $id: Now.ID['ai-control-list-menu'], name: 'AI Development Control Plane navigation', active: true,
    categories: [
        { $id: Now.ID['ai-control-intake-category'], title: 'Intake', order: 10, lists: [
            { $id: Now.ID['ai-control-active-enhancements'], title: 'Active enhancements', table: 'u_sn_enhancement', columns: 'number,short_description,u_phase,u_gate_1_decision', condition: 'active=true^u_phase!=closed', order: 10, applicabilities: [{ $id: Now.ID['ai-control-active-enhancements-audience'], applicability: audience }] },
            { $id: Now.ID['ai-control-my-enhancements'], title: 'My enhancements', table: 'u_sn_enhancement', columns: 'number,short_description,u_phase,u_gate_1_decision', condition: 'opened_byDYNAMIC90d1921e5f510100a9ad2572f2b477fe', order: 20, applicabilities: [{ $id: Now.ID['ai-control-my-enhancements-audience'], applicability: audience }] },
        ] },
        { $id: Now.ID['ai-control-review-category'], title: 'Review', order: 20, lists: [
            { $id: Now.ID['ai-control-draft-specs'], title: 'Draft specs', table: 'u_sn_spec_version', columns: 'u_title,u_version,u_state,sys_updated_on', condition: 'u_state=draft', order: 10, applicabilities: [{ $id: Now.ID['ai-control-draft-specs-audience'], applicability: audience }] },
            { $id: Now.ID['ai-control-review-specs'], title: 'Waiting for review', table: 'u_sn_spec_version', columns: 'u_title,u_version,u_state,u_content_sha256', condition: 'u_state=in_review', order: 20, applicabilities: [{ $id: Now.ID['ai-control-review-specs-audience'], applicability: audience }] },
            { $id: Now.ID['ai-control-approved-specs'], title: 'Approved specs', table: 'u_sn_spec_version', columns: 'u_title,u_version,u_state,u_decided_at', condition: 'u_state=approved', order: 30, applicabilities: [{ $id: Now.ID['ai-control-approved-specs-audience'], applicability: audience }] },
            { $id: Now.ID['ai-control-changes-specs'], title: 'Changes requested', table: 'u_sn_spec_version', columns: 'u_title,u_version,u_state,u_review_notes', condition: 'u_state=changes_requested', order: 40, applicabilities: [{ $id: Now.ID['ai-control-changes-specs-audience'], applicability: audience }] },
        ] },
        // Execution reads off the enhancement's own phase and work clock. The three states
        // a human cares about are expressible as filters on fields that already existed.
        { $id: Now.ID['ai-control-execution-category'], title: 'Execution', order: 30, lists: [
            { $id: Now.ID['ai-control-waiting-builds'], title: 'Approved, waiting for a worker', table: 'u_sn_enhancement', columns: 'number,short_description,u_gate_1_decision,u_current_spec', condition: 'u_phase=spec^u_gate_1_decision=approved', order: 10, applicabilities: [{ $id: Now.ID['ai-control-waiting-builds-audience'], applicability: audience }] },
            { $id: Now.ID['ai-control-running-builds'], title: 'Building now', table: 'u_sn_enhancement', columns: 'number,short_description,assigned_to,work_start', condition: 'u_phase=build^work_endISEMPTY', order: 20, applicabilities: [{ $id: Now.ID['ai-control-running-builds-audience'], applicability: audience }] },
            { $id: Now.ID['ai-control-attention-builds'], title: 'Stopped — needs a decision', table: 'u_sn_enhancement', columns: 'number,short_description,work_end,u_evidence_summary', condition: 'u_phase=build^work_endISNOTEMPTY', order: 30, applicabilities: [{ $id: Now.ID['ai-control-attention-builds-audience'], applicability: audience }] },
        ] },
    ],
})

export const aiControlWorkspace = Workspace({ $id: Now.ID['ai-control-workspace'], title: 'AI Development Control', path: 'ai-development-control', landingPath: 'home', active: true, tables: ['u_sn_enhancement', 'u_sn_spec_version'], listConfig: lists })
Acl({ $id: Now.ID['ai-control-workspace-route'], type: 'ux_route', operation: 'read', localOrExisting: 'Existing', name: 'ai-development-control.*', roles: [aiControlUser, aiControlReviewer] })

Dashboard({ $id: Now.ID['ai-control-dashboard'], name: 'Authority queue', permissions: [{ $id: Now.ID['ai-control-dashboard-user'], role: 'global.ai_control_user', canRead: true }], visibilities: [{ $id: Now.ID['ai-control-dashboard-visibility'], experience: aiControlWorkspace }], tabs: [{ $id: Now.ID['ai-control-dashboard-overview'], name: 'Authority queue', widgets: [
    { $id: Now.ID['ai-control-review-indicator'], component: 'single-score', componentProps: { headerTitle: 'Waiting for human review', dataSources: [{ label: 'Specs', sourceType: 'table', tableOrViewName: 'u_sn_spec_version', filterQuery: 'u_state=in_review', id: 'review' }], metrics: [{ dataSource: 'review', id: 'review-count', aggregateFunction: 'COUNT', axisId: 'primary' }] }, height: 10, width: 12, position: { x: 0, y: 0 } },
    { $id: Now.ID['ai-control-motion-indicator'], component: 'single-score', componentProps: { headerTitle: 'Work in motion', dataSources: [{ label: 'Enhancements', sourceType: 'table', tableOrViewName: 'u_sn_enhancement', filterQuery: 'u_phase=build^work_endISEMPTY^ORu_phase=spec^u_gate_1_decision=approved', id: 'motion' }], metrics: [{ dataSource: 'motion', id: 'motion-count', aggregateFunction: 'COUNT', axisId: 'primary' }] }, height: 10, width: 12, position: { x: 12, y: 0 } },
    { $id: Now.ID['ai-control-failed-indicator'], component: 'single-score', componentProps: { headerTitle: 'Stopped / needs attention', dataSources: [{ label: 'Enhancements', sourceType: 'table', tableOrViewName: 'u_sn_enhancement', filterQuery: 'u_phase=build^work_endISNOTEMPTY', id: 'failed' }], metrics: [{ dataSource: 'failed', id: 'failed-count', aggregateFunction: 'COUNT', axisId: 'primary' }] }, height: 10, width: 12, position: { x: 24, y: 0 } },
    { $id: Now.ID['ai-control-pipeline-indicator'], component: 'vertical-bar', componentProps: { headerTitle: 'Pipeline by enhancement phase', dataSources: [{ label: 'Enhancements', sourceType: 'table', tableOrViewName: 'u_sn_enhancement', filterQuery: '', id: 'pipeline' }], metrics: [{ dataSource: 'pipeline', id: 'pipeline-count', aggregateFunction: 'COUNT', axisId: 'primary' }], groupBy: [{ groupBy: [{ dataSource: 'pipeline', groupByField: 'u_phase' }], maxNumberOfGroups: 10, showOthers: false }] }, height: 14, width: 24, position: { x: 0, y: 10 } },
    { $id: Now.ID['ai-control-evidence-indicator'], component: 'vertical-bar', componentProps: { headerTitle: 'Spec decisions this week', dataSources: [{ label: 'Decided specs', sourceType: 'table', tableOrViewName: 'u_sn_spec_version', filterQuery: 'u_stateINapproved,changes_requested,rejected,superseded^sys_updated_onRELATIVEGE@dayofweek@ago@7', id: 'evidence' }], metrics: [{ dataSource: 'evidence', id: 'evidence-count', aggregateFunction: 'COUNT', axisId: 'primary' }], groupBy: [{ groupBy: [{ dataSource: 'evidence', groupByField: 'u_state' }], maxNumberOfGroups: 5, showOthers: false }] }, height: 14, width: 24, position: { x: 24, y: 10 } },
] }] })
