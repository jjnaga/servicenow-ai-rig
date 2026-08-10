import { Test } from '@servicenow/sdk/core'
import { aiControlRunner, aiControlUser } from '../security/roles-acls.now'

export const authorityHappy = Test({
    $id: Now.ID['ai-control-authority-happy'], name: 'AI control: submit and approve exact snapshot', active: true,
    description: 'Creates real app rows, submits exact bytes, approves once, and proves the gate aftermath — including that approval does NOT advance the phase.', failOnServerError: true,
}, atf => {
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-authority-happy-script'], script: Now.include('../../server/atf/authority-happy.server.js') })
})

export const authorityBad = Test({
    $id: Now.ID['ai-control-authority-bad'], name: 'AI control: invalid decisions fail closed', active: true,
    description: 'Proves empty submit/review notes and mutation of a reviewed snapshot fail without changing authority state.', failOnServerError: true,
}, atf => {
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-authority-bad-script'], script: Now.include('../../server/atf/authority-bad.server.js') })
})

export const lifecycleControl = Test({
    $id: Now.ID['ai-control-lifecycle-control'], name: 'AI control: claim, finish, sweep, and retry', active: true,
    description: 'Proves the phase-as-claim protocol end to end: double claim refused, failure stops in build, the sweeper ages a silent worker, and retry is reviewer-only.', failOnServerError: true,
}, atf => {
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-lifecycle-control-script'], script: Now.include('../../server/atf/lifecycle-control.server.js') })
})

export const securityBoundary = Test({
    $id: Now.ID['ai-control-security-boundary'], name: 'AI control: human and runner ACL boundary', active: true,
    description: 'Proves a user cannot decide, a runner cannot write human gates, and the runner can claim through only machine-owned fields.', failOnServerError: true,
}, atf => {
    const enhancement = atf.server.recordInsert({
        $id: Now.ID['ai-control-security-enhancement'], table: 'u_sn_enhancement', enforceSecurity: false,
        fieldValues: { short_description: 'ATF security boundary', u_phase: 'intake', u_gate_1_decision: 'pending', u_gate_2_decision: 'not_reached' },
    })
    const spec = atf.server.recordInsert({
        $id: Now.ID['ai-control-security-spec'], table: 'u_sn_spec_version', enforceSecurity: false,
        fieldValues: { u_enhancement: enhancement.record_id, u_version: 1, u_title: 'ATF security boundary', u_state: 'draft', u_markdown: '# Security\n' },
    })
    atf.server.createUser({ $id: Now.ID['ai-control-security-user'], firstName: 'ATF', lastName: 'AI control user', roles: [aiControlUser], impersonate: true })
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-security-user-denied'], script: "var r=new GlideRecordSecure('u_sn_spec_version'); r.addQuery('u_title','ATF security boundary'); r.orderByDesc('sys_created_on'); r.setLimit(1); r.query(); if(!r.next()) throw 'security fixture missing'; if(r.getElement('u_state').canWrite()) throw 'user can write review state'; r.setValue('u_state','approved'); r.update(); var c=new GlideRecord('u_sn_spec_version'); c.get(r.getUniqueValue()); if(c.getValue('u_state')!=='draft') throw 'user changed review state';" })
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-security-user-service-denied'], script: "var r=new GlideRecord('u_sn_spec_version'); r.addQuery('u_title','ATF security boundary'); r.orderByDesc('sys_created_on'); r.setLimit(1); r.query(); if(!r.next()) throw 'security fixture missing'; var denied=false; try { new SnAiControlService().approve(r.getUniqueValue()); } catch(e) { denied=String(e).indexOf('role required')>=0; } if(!denied) throw 'non-reviewer service approval escaped';" })
    atf.server.createUser({ $id: Now.ID['ai-control-security-runner'], firstName: 'ATF', lastName: 'AI control runner', roles: [aiControlRunner], impersonate: true })
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-security-runner-gate-denied'], script: "var r=new GlideRecordSecure('u_sn_enhancement'); r.addQuery('short_description','ATF security boundary'); r.orderByDesc('sys_created_on'); r.setLimit(1); r.query(); if(!r.next()) throw 'enhancement fixture missing'; if(r.getElement('u_gate_1_decision').canWrite()) throw 'runner can write Gate 1'; r.setValue('u_gate_1_decision','approved'); r.update(); var c=new GlideRecord('u_sn_enhancement'); c.get(r.getUniqueValue()); if(c.getValue('u_gate_1_decision')!=='pending') throw 'runner changed Gate 1';" })
    // The runner's whole write surface is now four columns on the enhancement. Prove it can
    // reach every one of them and still cannot reach a gate (asserted in the step above).
    atf.server.runServerSideScript({ $id: Now.ID['ai-control-security-runner-claim'], script: "var r=new GlideRecordSecure('u_sn_enhancement'); r.addQuery('short_description','ATF security boundary'); r.orderByDesc('sys_created_on'); r.setLimit(1); r.query(); if(!r.next()) throw 'enhancement fixture missing'; var fields=['u_phase','work_start','work_end','u_evidence_summary']; for(var i=0;i<fields.length;i++){if(!r.getElement(fields[i]).canWrite()) throw 'runner cannot write '+fields[i];} r.setValue('u_phase','build'); r.setValue('work_start',gs.nowDateTime()); var id=r.update(); if(!id) throw 'runner claim failed: '+r.getLastErrorMessage(); var c=new GlideRecord('u_sn_enhancement'); c.get(r.getUniqueValue()); if(c.getValue('u_phase')!=='build') throw 'runner claim did not persist'; if(c.getValue('u_gate_1_decision')!=='pending') throw 'gate moved during a claim';" })
    atf.server.recordValidation({ $id: Now.ID['ai-control-security-claim-valid'], table: 'u_sn_enhancement', recordId: enhancement.record_id, fieldValues: 'u_phase=build^u_gate_1_decision=pending', enforceSecurity: true })
    atf.server.impersonate({ $id: Now.ID['ai-control-security-admin'], user: '6816f79cc0a8016401c5a33be04be441' })
    atf.server.recordDelete({ $id: Now.ID['ai-control-security-spec-delete'], table: 'u_sn_spec_version', recordId: spec.record_id, enforceSecurity: false })
    atf.server.recordDelete({ $id: Now.ID['ai-control-security-enhancement-delete'], table: 'u_sn_enhancement', recordId: enhancement.record_id, enforceSecurity: false })
})
