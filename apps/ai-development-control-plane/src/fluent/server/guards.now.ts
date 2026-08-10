import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ai-control-spec-immutable-guard'], name: 'AI control immutable spec guard',
    table: 'u_sn_spec_version', when: 'before', action: ['insert', 'update'], order: 10,
    script: Now.include('../../server/business-rules/spec-guard.server.js'),
})
BusinessRule({
    $id: Now.ID['ai-control-spec-draft-pointer'], name: 'AI control draft pointer authority',
    table: 'u_sn_spec_version', when: 'after', action: ['insert'], order: 100,
    script: Now.include('../../server/business-rules/spec-draft-pointer.server.js'),
})
/*
 * The job transition guard and the terminal-job notification rule are GONE with the table
 * they policed. No equivalent business rule was added on `u_sn_enhancement`, deliberately:
 * that table is shared with the rest of the rig (`/sn-loop` writes it too), so a phase
 * guard installed by this app would silently police a lifecycle it does not own. The
 * transitions are enforced in `SnAiControlService` — one seam, one owner — and the
 * runner's field grants are the second layer.
 */
