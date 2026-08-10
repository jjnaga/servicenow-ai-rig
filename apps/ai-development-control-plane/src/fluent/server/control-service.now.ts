import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['ai-control-service'],
    name: 'SnAiControlService',
    active: true,
    accessibleFrom: 'package_private',
    description: 'Single authority seam for immutable specs, gate decisions, and durable jobs.',
    script: Now.include('../../server/script-includes/sn-ai-control-service.server.js'),
})
