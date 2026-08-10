(function () {
    var enhancementId = '', specId = ''
    function assertTrue(value, message) { if (!value) throw 'AI control ATF: ' + message }
    function expectError(work, fragment) { var failed = false; try { work() } catch (error) { failed = String(error).indexOf(fragment) >= 0 } assertTrue(failed, 'expected error ' + fragment) }
    function remove(table, query) { var record = new GlideRecord(table); record.addEncodedQuery(query); record.query(); while (record.next()) { record.setWorkflow(false); record.deleteRecord() } }
    try {
        var enhancement = new GlideRecord('u_sn_enhancement'); enhancement.initialize(); enhancement.setValue('short_description', 'ATF authority bad ' + gs.generateGUID())
        enhancement.setValue('u_phase', 'intake'); enhancement.setValue('u_gate_1_decision', 'pending'); enhancement.setValue('u_gate_2_decision', 'not_reached')
        enhancementId = String(enhancement.insert()); assertTrue(enhancementId, 'enhancement insert')
        var spec = new GlideRecord('u_sn_spec_version'); spec.initialize(); spec.setValue('u_enhancement', enhancementId); spec.setValue('u_version', 1)
        spec.setValue('u_title', 'ATF bad paths'); spec.setValue('u_state', 'draft'); spec.setValue('u_markdown', ' '); specId = String(spec.insert())
        var service = new SnAiControlService(); expectError(function () { service.submit(specId) }, 'markdown is required')
        spec.get(specId); assertTrue(spec.getValue('u_state') === 'draft' && !spec.getValue('u_content_sha256'), 'empty submit changed state')
        service.saveDraft(specId, { title: 'ATF bad paths', markdown: '# Frozen\n' }); service.submit(specId)
        spec.get(specId); var frozen = String(spec.getValue('u_markdown')); spec.setValue('u_markdown', '# Tampered\n'); spec.update(); spec.get(specId)
        assertTrue(String(spec.getValue('u_markdown')) === frozen, 'reviewed bytes changed')
        spec.setWorkflow(false); spec.setValue('u_markdown', '# Drifted underneath guard\n'); spec.update()
        expectError(function () { service.approve(specId) }, 'submitted content changed')
        spec.get(specId); spec.setWorkflow(false); spec.setValue('u_markdown', frozen); spec.update()
        expectError(function () { service.requestChanges(specId, '') }, 'review note is required')
        spec.get(specId); assertTrue(spec.getValue('u_state') === 'in_review' && !spec.getValue('u_decided_by'), 'empty note changed authority')
        // Machine transitions fail closed on an un-approved record. There is no action
        // string to smuggle any more — the only verbs are these three methods.
        expectError(function () { service.claimBuild(enhancementId, 'atf') }, 'gate 1 is not approved')
        expectError(function () { service.finishBuild(enhancementId, true, 'never claimed') }, 'expected build')
        expectError(function () { service.retryBuild(enhancementId) }, 'expected build')
        enhancement.get(enhancementId); assertTrue(enhancement.getValue('u_phase') !== 'build', 'a refused claim moved the phase')

        var rejected = service.reject(specId); assertTrue(rejected.state === 'rejected', 'reject decision')
        enhancement.get(enhancementId); assertTrue(enhancement.getValue('u_gate_1_decision') === 'rejected', 'reject gate')
    } finally {
        if (enhancementId) { remove('u_sn_spec_version', 'u_enhancement=' + enhancementId); remove('u_sn_enhancement', 'sys_id=' + enhancementId) }
    }
})()
