import { Acl, Role } from '@servicenow/sdk/core'

export const aiControlUser = Role({
    name: 'global.ai_control_user', description: 'Requests and edits AI control-plane drafts.', containsRoles: [Now.ref('sys_user_role', '8536f54bc713330072b211d4d8c26080')],
})
export const aiControlReviewer = Role({
    name: 'global.ai_control_reviewer', description: 'Makes attributed human review decisions.', containsRoles: [aiControlUser],
})
export const aiControlRunner = Role({
    name: 'global.ai_control_runner', description: 'Creates draft specs and moves the build phase; never decides a gate.',
})

const human = [aiControlUser, aiControlReviewer]
const all = [aiControlUser, aiControlReviewer, aiControlRunner]

Acl({ $id: Now.ID['ai-control-enhancement-read'], type: 'record', table: 'u_sn_enhancement', operation: 'read', localOrExisting: 'Existing', roles: all })
Acl({ $id: Now.ID['ai-control-spec-read'], type: 'record', table: 'u_sn_spec_version', operation: 'read', roles: all })
Acl({ $id: Now.ID['ai-control-spec-create'], type: 'record', table: 'u_sn_spec_version', operation: 'create', roles: all })
Acl({ $id: Now.ID['ai-control-spec-write'], type: 'record', table: 'u_sn_spec_version', operation: 'write', roles: human })
Acl({ $id: Now.ID['ai-control-spec-fields-write'], type: 'record', table: 'u_sn_spec_version', field: '*', operation: 'write', roles: human })
Acl({ $id: Now.ID['ai-control-enhancement-write'], type: 'record', table: 'u_sn_enhancement', operation: 'write', localOrExisting: 'Existing', roles: all })

// Human decision and snapshot fields never inherit the broad draft-field grant.
Acl({ $id: Now.ID['ai-control-spec-state-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_state', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-spec-hash-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_content_sha256', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-spec-submitted-by-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_submitted_by', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-spec-submitted-at-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_submitted_at', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-spec-review-notes-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_review_notes', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-spec-decided-by-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_decided_by', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-spec-decided-at-write'], type: 'record', table: 'u_sn_spec_version', field: 'u_decided_at', operation: 'write', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-enhancement-gate-one-write'], type: 'record', table: 'u_sn_enhancement', field: 'u_gate_1_decision', operation: 'write', localOrExisting: 'Existing', roles: [aiControlReviewer] })
Acl({ $id: Now.ID['ai-control-enhancement-gate-two-write'], type: 'record', table: 'u_sn_enhancement', field: 'u_gate_2_decision', operation: 'write', localOrExisting: 'Existing', roles: [aiControlReviewer] })

// Machine protocol fields — now four columns on the enhancement instead of a job table.
// The runner may move the build phase and stamp the clock. It may not touch a gate.
Acl({ $id: Now.ID['ai-control-enhancement-phase-write'], type: 'record', table: 'u_sn_enhancement', field: 'u_phase', operation: 'write', localOrExisting: 'Existing', roles: all })
Acl({ $id: Now.ID['ai-control-enhancement-work-start-write'], type: 'record', table: 'u_sn_enhancement', field: 'work_start', operation: 'write', localOrExisting: 'Existing', roles: all })
Acl({ $id: Now.ID['ai-control-enhancement-work-end-write'], type: 'record', table: 'u_sn_enhancement', field: 'work_end', operation: 'write', localOrExisting: 'Existing', roles: all })
Acl({ $id: Now.ID['ai-control-enhancement-evidence-write'], type: 'record', table: 'u_sn_enhancement', field: 'u_evidence_summary', operation: 'write', localOrExisting: 'Existing', roles: all })

// Explicit runner denies document the human/machine boundary even if a future wildcard grant appears.
Acl({ $id: Now.ID['ai-control-runner-gate-one-deny'], type: 'record', table: 'u_sn_enhancement', field: 'u_gate_1_decision', operation: 'write', localOrExisting: 'Existing', decisionType: 'deny', roles: [aiControlRunner] })
Acl({ $id: Now.ID['ai-control-runner-gate-two-deny'], type: 'record', table: 'u_sn_enhancement', field: 'u_gate_2_decision', operation: 'write', localOrExisting: 'Existing', decisionType: 'deny', roles: [aiControlRunner] })
Acl({ $id: Now.ID['ai-control-runner-decision-deny'], type: 'record', table: 'u_sn_spec_version', field: 'u_decided_by', operation: 'write', decisionType: 'deny', roles: [aiControlRunner] })
Acl({ $id: Now.ID['ai-control-runner-decision-time-deny'], type: 'record', table: 'u_sn_spec_version', field: 'u_decided_at', operation: 'write', decisionType: 'deny', roles: [aiControlRunner] })
