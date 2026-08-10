import { Acl, RestApi } from '@servicenow/sdk/core'
import { aiControlRunner, aiControlUser } from '../security/roles-acls.now'

// The runner reaches the instance through this API and nothing else, so it must pass the
// endpoint ACL. The per-operation `requireRole` inside SnAiControlService is what actually
// separates a worker from a reviewer — reaching the door is not the same as opening it.
const controlApiAcl = Acl({
    $id: Now.ID['ai-control-api-execute'], type: 'rest_endpoint', name: 'ai_control',
    operation: 'execute', roles: [aiControlUser, aiControlRunner], securityAttribute: 'user_is_authenticated',
})

RestApi({
    $id: Now.ID['ai-control-api'], name: 'AI Development Control API', serviceId: 'ai_control', namespace: 'global', active: true,
    consumes: 'application/json', produces: 'application/json', enforceAcl: [controlApiAcl],
    versions: [{ $id: Now.ID['ai-control-api-v1'], version: 1, active: true, isDefault: true }],
    routes: [
        {
            $id: Now.ID['ai-control-api-context'], name: 'enhancement context', path: '/v1/enhancements/{id}/context', version: 1,
            method: 'GET', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-context-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'getContext',[request.pathParams.id]);",
        },
        {
            $id: Now.ID['ai-control-api-save'], name: 'save draft', path: '/v1/specs/{id}', version: 1,
            method: 'PATCH', active: true, authentication: true, authorization: true, consumes: 'application/json', produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-save-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "var b=request.body.data||{}; if(typeof b==='string') b=JSON.parse(b); if(!b.markdown && request.body.dataString) b=JSON.parse(request.body.dataString); new SnAiControlService().dispatch(response,'saveDraft',[request.pathParams.id,b]);",
        },
        {
            $id: Now.ID['ai-control-api-request-draft'], name: 'request draft', path: '/v1/enhancements/{id}/request-draft', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-request-draft-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'requestDraft',[request.pathParams.id]);",
        },
        {
            $id: Now.ID['ai-control-api-submit'], name: 'submit', path: '/v1/specs/{id}/submit', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-submit-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'submit',[request.pathParams.id]);",
        },
        {
            $id: Now.ID['ai-control-api-approve'], name: 'approve', path: '/v1/specs/{id}/approve', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-approve-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'approve',[request.pathParams.id]);",
        },
        {
            $id: Now.ID['ai-control-api-request-changes'], name: 'request changes', path: '/v1/specs/{id}/request-changes', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, consumes: 'application/json', produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-changes-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "var b=request.body.data||{}; if(typeof b==='string') b=JSON.parse(b); if(!b.note && request.body.dataString) b=JSON.parse(request.body.dataString); new SnAiControlService().dispatch(response,'requestChanges',[request.pathParams.id,b.note]);",
        },
        {
            $id: Now.ID['ai-control-api-reject'], name: 'reject', path: '/v1/specs/{id}/reject', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-reject-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'reject',[request.pathParams.id]);",
        },
        {
            $id: Now.ID['ai-control-api-new-version'], name: 'new version', path: '/v1/specs/{id}/new-version', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-version-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'newVersion',[request.pathParams.id]);",
        },
        // The machine protocol. The runner has no direct write grant on a gate field and
        // no table it owns — these three guarded transitions are its entire surface.
        {
            $id: Now.ID['ai-control-api-claim'], name: 'claim build', path: '/v1/enhancements/{id}/claim', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, consumes: 'application/json', produces: 'application/json',
            script: "var b=request.body&&request.body.data?request.body.data:{}; if(typeof b==='string') b=JSON.parse(b); new SnAiControlService().dispatch(response,'claimBuild',[request.pathParams.id,b.worker_id]);",
        },
        {
            $id: Now.ID['ai-control-api-finish'], name: 'finish build', path: '/v1/enhancements/{id}/finish', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, consumes: 'application/json', produces: 'application/json',
            script: "var b=request.body&&request.body.data?request.body.data:{}; if(typeof b==='string') b=JSON.parse(b); new SnAiControlService().dispatch(response,'finishBuild',[request.pathParams.id,b.ok,b.summary,b.artifact_path]);",
        },
        {
            $id: Now.ID['ai-control-api-retry-build'], name: 'retry build', path: '/v1/enhancements/{id}/retry-build', version: 1,
            method: 'POST', active: true, authentication: true, authorization: true, produces: 'application/json',
            headers: [{ $id: Now.ID['ai-control-api-retry-build-token'], name: 'X-UserToken', required: true, exampleValue: 'session token' }],
            script: "new SnAiControlService().dispatch(response,'retryBuild',[request.pathParams.id]);",
        },
    ],
})
