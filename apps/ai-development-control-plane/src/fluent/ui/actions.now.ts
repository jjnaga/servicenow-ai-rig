import { UiAction } from '@servicenow/sdk/core'
import { aiControlReviewer, aiControlUser } from '../security/roles-acls.now'

export const draftSpecAction = UiAction({
    $id: Now.ID['ai-control-draft-spec-action'], table: 'u_sn_enhancement', name: 'Draft spec', actionName: 'ai_control_draft_spec',
    showUpdate: true, condition: 'current.u_current_spec.nil()', form: { showButton: true, style: 'primary' }, roles: [aiControlUser], workspace: { isConfigurableWorkspace: true, showFormButtonV2: true, clientScriptV2: "function onClick() { g_form.submit('ai_control_draft_spec'); }" },
    script: "new SnAiControlService().requestDraft(String(current.getUniqueValue())); action.setRedirectURL('global_ai_control_workbench.do?sysparm_enhancement_id='+current.getUniqueValue());",
})
export const approveAction = UiAction({
    $id: Now.ID['ai-control-approve-action'], table: 'u_sn_spec_version', name: 'Approve for build', actionName: 'ai_control_approve',
    showUpdate: true, condition: "current.u_state=='in_review'", form: { showButton: true, style: 'primary' }, roles: [aiControlReviewer], workspace: { isConfigurableWorkspace: true, showFormButtonV2: true, clientScriptV2: "function onClick() { g_form.submit('ai_control_approve'); }" },
    script: "new SnAiControlService().approve(String(current.getUniqueValue())); action.setRedirectURL(current);",
})
export const requestChangesAction = UiAction({
    $id: Now.ID['ai-control-request-changes-action'], table: 'u_sn_spec_version', name: 'Request changes', actionName: 'ai_control_request_changes',
    showUpdate: true, condition: "current.u_state=='in_review'", form: { showButton: true, style: 'primary' }, roles: [aiControlReviewer],
    workspace: { isConfigurableWorkspace: true, showFormButtonV2: true, clientScriptV2: "function onClick() { window.location.href='/global_ai_control_workbench.do?sysparm_enhancement_id='+g_form.getValue('u_enhancement'); }" },
    script: "action.setRedirectURL('global_ai_control_workbench.do?sysparm_enhancement_id='+current.getValue('u_enhancement'));",
})
export const rejectAction = UiAction({
    $id: Now.ID['ai-control-reject-action'], table: 'u_sn_spec_version', name: 'Reject', actionName: 'ai_control_reject',
    showUpdate: true, condition: "current.u_state=='in_review'", form: { showButton: true, style: 'destructive' }, roles: [aiControlReviewer], workspace: { isConfigurableWorkspace: true, showFormButtonV2: true, clientScriptV2: "function onClick() { g_form.submit('ai_control_reject'); }" },
    script: "new SnAiControlService().reject(String(current.getUniqueValue())); action.setRedirectURL(current);",
})
export const newVersionAction = UiAction({
    $id: Now.ID['ai-control-new-version-action'], table: 'u_sn_spec_version', name: 'Create new version', actionName: 'ai_control_new_version',
    showUpdate: true, condition: "['approved','changes_requested','rejected','superseded'].indexOf(String(current.u_state))>=0", form: { showButton: true, style: 'primary' }, roles: [aiControlUser], workspace: { isConfigurableWorkspace: true, showFormButtonV2: true, clientScriptV2: "function onClick() { g_form.submit('ai_control_new_version'); }" },
    script: "new SnAiControlService().newVersion(String(current.getUniqueValue())); action.setRedirectURL('global_ai_control_workbench.do?sysparm_enhancement_id='+current.getValue('u_enhancement'));",
})
/*
 * `Run verification` and `Prepare review packet` are gone. Both existed only to enqueue a
 * job; verification and packaging are steps INSIDE a build run, governed by the loop
 * contract, not separate things a human dispatches. Cancel is gone with the queue — there
 * is no longer a pending intent to withdraw, and killing a claimed build is the runner's
 * business, not the platform's.
 *
 * What replaces all four is one button, on the enhancement, for the one decision a human
 * actually has to make when a build stops.
 */
export const retryBuildAction = UiAction({
    $id: Now.ID['ai-control-retry-build-action'], table: 'u_sn_enhancement', name: 'Retry build', actionName: 'ai_control_retry_build',
    showUpdate: true, condition: "current.u_phase=='build' && !current.work_end.nil()", form: { showButton: true, style: 'primary' }, roles: [aiControlReviewer], workspace: { isConfigurableWorkspace: true, showFormButtonV2: true, clientScriptV2: "function onClick() { g_form.submit('ai_control_retry_build'); }" },
    script: "new SnAiControlService().retryBuild(String(current.getUniqueValue())); action.setRedirectURL(current);",
})
