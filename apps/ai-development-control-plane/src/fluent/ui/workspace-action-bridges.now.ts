import { Record } from '@servicenow/sdk/core'
import { approveAction, draftSpecAction, newVersionAction, rejectAction, requestChangesAction, retryBuildAction } from './actions.now'

const bridge = 'sys_ux_form_action' as any
const layout = 'sys_ux_form_action_layout_item' as any
export const draftBridge = Record({ $id: Now.ID['ai-control-bridge-draft'], table: bridge, data: { name: 'Draft spec', table: 'u_sn_enhancement', ui_action: draftSpecAction, specificity: 100, action_type: 'ui_action', active: true, description: 'Workspace bridge' } })
export const approveBridge = Record({ $id: Now.ID['ai-control-bridge-approve'], table: bridge, data: { name: 'Approve for build', table: 'u_sn_spec_version', ui_action: approveAction, specificity: 100, action_type: 'ui_action', active: true, description: 'Workspace bridge' } })
export const changesBridge = Record({ $id: Now.ID['ai-control-bridge-changes'], table: bridge, data: { name: 'Request changes', table: 'u_sn_spec_version', ui_action: requestChangesAction, specificity: 100, action_type: 'ui_action', active: true, description: 'Workspace bridge' } })
export const rejectBridge = Record({ $id: Now.ID['ai-control-bridge-reject'], table: bridge, data: { name: 'Reject', table: 'u_sn_spec_version', ui_action: rejectAction, specificity: 100, action_type: 'ui_action', active: true, description: 'Workspace bridge' } })
export const versionBridge = Record({ $id: Now.ID['ai-control-bridge-version'], table: bridge, data: { name: 'Create new version', table: 'u_sn_spec_version', ui_action: newVersionAction, specificity: 100, action_type: 'ui_action', active: true, description: 'Workspace bridge' } })
export const retryBuildBridge = Record({ $id: Now.ID['ai-control-bridge-retry-build'], table: bridge, data: { name: 'Retry build', table: 'u_sn_enhancement', ui_action: retryBuildAction, specificity: 100, action_type: 'ui_action', active: true, description: 'Workspace bridge' } })
Record({ $id: Now.ID['ai-control-layout-draft'], table: layout, data: { name: 'Draft spec', label: 'Draft spec', table: 'u_sn_enhancement', action: draftBridge, order: 100, item_type: 'action', active: true } })
Record({ $id: Now.ID['ai-control-layout-retry-build'], table: layout, data: { name: 'Retry build', label: 'Retry build', table: 'u_sn_enhancement', action: retryBuildBridge, order: 110, item_type: 'action', active: true } })
Record({ $id: Now.ID['ai-control-layout-approve'], table: layout, data: { name: 'Approve for build', label: 'Approve for build', table: 'u_sn_spec_version', action: approveBridge, order: 100, item_type: 'action', active: true } })
Record({ $id: Now.ID['ai-control-layout-changes'], table: layout, data: { name: 'Request changes', label: 'Request changes', table: 'u_sn_spec_version', action: changesBridge, order: 110, item_type: 'action', active: true } })
Record({ $id: Now.ID['ai-control-layout-reject'], table: layout, data: { name: 'Reject', label: 'Reject', table: 'u_sn_spec_version', action: rejectBridge, order: 120, item_type: 'action', active: true } })
Record({ $id: Now.ID['ai-control-layout-version'], table: layout, data: { name: 'Create new version', label: 'Create new version', table: 'u_sn_spec_version', action: versionBridge, order: 130, item_type: 'action', active: true } })
