(function () {
    var enhancementId = '', specId = ''
    function assertTrue(value, message) { if (!value) throw 'AI control ATF: ' + message }
    function remove(table, query) {
        var record = new GlideRecord(table); record.addEncodedQuery(query); record.query()
        while (record.next()) { record.setWorkflow(false); record.deleteRecord() }
    }
    try {
        var enhancement = new GlideRecord('u_sn_enhancement'); enhancement.initialize()
        enhancement.setValue('short_description', 'ATF authority happy ' + gs.generateGUID())
        enhancement.setValue('u_phase', 'intake'); enhancement.setValue('u_gate_1_decision', 'pending'); enhancement.setValue('u_gate_2_decision', 'not_reached')
        enhancementId = String(enhancement.insert()); assertTrue(enhancementId, 'enhancement insert failed')
        var spec = new GlideRecord('u_sn_spec_version'); spec.initialize()
        spec.setValue('u_enhancement', enhancementId); spec.setValue('u_version', 1); spec.setValue('u_title', 'ATF exact snapshot')
        spec.setValue('u_state', 'draft'); spec.setValue('u_markdown', '# WHY\nExact authority.\n\n# WHAT\nOne snapshot.\n\n# HOW\nATF.')
        specId = String(spec.insert()); assertTrue(specId, 'spec insert failed')
        var service = new SnAiControlService(); var submitted = service.submit(specId)
        spec.get(specId); assertTrue(spec.getValue('u_state') === 'in_review', 'submit state')
        assertTrue(submitted.content_sha256 === service.sha256(spec.getValue('u_markdown')), 'exact hash')

        var approved = service.approve(specId)
        spec.get(specId); assertTrue(spec.getValue('u_state') === 'approved' && spec.getValue('u_decided_by') && spec.getValue('u_decided_at'), 'approval attribution')
        assertTrue(approved.content_sha256 === service.sha256(spec.getValue('u_markdown')), 'approved hash is the submitted hash')
        enhancement.get(enhancementId)
        assertTrue(enhancement.getValue('u_gate_1_decision') === 'approved', 'gate 1 aftermath')
        // THE point of the redesign: a human decision does not start work. Only a worker's
        // claim moves spec→build, so `build` never lies about somebody being on it.
        assertTrue(enhancement.getValue('u_phase') === 'spec', 'approval advanced the phase — the claim is the worker\'s, not the reviewer\'s')
        assertTrue(!String(enhancement.getValue('work_start') || ''), 'approval stamped the work clock')
        assertTrue(enhancement.getValue('u_current_spec') === specId, 'current spec pointer')

        var repeated = service.approve(specId)
        assertTrue(repeated.duplicate && repeated.state === 'approved', 'double approval is not a second decision')
        enhancement.get(enhancementId); assertTrue(enhancement.getValue('u_phase') === 'spec', 'double approval moved the phase')

        var context = service.getContext(enhancementId)
        assertTrue(context.current_spec.sys_id === specId, 'workbench context receipt')
        assertTrue(context.build.state === 'waiting_for_worker' && context.build.phase === 'spec', 'build view reads approved-and-unclaimed')
    } finally {
        if (enhancementId) { remove('u_sn_spec_version', 'u_enhancement=' + enhancementId); remove('u_sn_enhancement', 'sys_id=' + enhancementId) }
    }
})()
