(function () {
    var enhancementId = '', firstSpecId = '', secondSpecId = ''
    function assertTrue(value, message) { if (!value) throw 'AI control ATF: ' + message }
    function expectError(work, fragment) { var failed = false; try { work() } catch (error) { failed = String(error).indexOf(fragment) >= 0 } assertTrue(failed, 'expected error ' + fragment) }
    function remove(table, query) { var record = new GlideRecord(table); record.addEncodedQuery(query); record.query(); while (record.next()) { record.setWorkflow(false); record.deleteRecord() } }
    try {
        var enhancement = new GlideRecord('u_sn_enhancement'); enhancement.initialize(); enhancement.setValue('short_description', 'ATF lifecycle ' + gs.generateGUID())
        enhancement.setValue('u_phase', 'intake'); enhancement.setValue('u_gate_1_decision', 'pending'); enhancement.setValue('u_gate_2_decision', 'not_reached')
        enhancementId = String(enhancement.insert())
        var spec = new GlideRecord('u_sn_spec_version'); spec.initialize(); spec.setValue('u_enhancement', enhancementId); spec.setValue('u_version', 1)
        spec.setValue('u_title', 'ATF lifecycle'); spec.setValue('u_state', 'draft'); spec.setValue('u_markdown', '# Draft one\n'); firstSpecId = String(spec.insert())
        var service = new SnAiControlService()

        // --- the human half: edit, submit, request changes, revise -------------------
        service.saveDraft(firstSpecId, { title: 'ATF lifecycle edited', markdown: '# Draft edited\n' })
        spec.get(firstSpecId); assertTrue(spec.getValue('u_markdown') === '# Draft edited\n', 'draft overcorrection')
        service.submit(firstSpecId); service.requestChanges(firstSpecId, 'Add a control receipt.')
        var revision = service.newVersion(firstSpecId); secondSpecId = revision.spec_id
        spec.get(firstSpecId); assertTrue(spec.getValue('u_state') === 'changes_requested' && spec.getValue('u_review_notes') === 'Add a control receipt.', 'old snapshot changed')
        var second = new GlideRecord('u_sn_spec_version'); second.get(secondSpecId); assertTrue(second.getValue('u_state') === 'draft' && second.getValue('u_version') === '2', 'new draft contract')
        enhancement.get(enhancementId); assertTrue(enhancement.getValue('u_gate_1_decision') === 'pending' && enhancement.getValue('u_current_spec') === secondSpecId, 'authority reset')
        var versionCount = new GlideAggregate('u_sn_spec_version'); versionCount.addQuery('u_enhancement', enhancementId); versionCount.addQuery('u_version', 2); versionCount.addAggregate('COUNT'); versionCount.query(); versionCount.next()
        assertTrue(parseInt(versionCount.getAggregate('COUNT'), 10) === 1, 'new-version call duplicated version 2')

        // --- the machine half: claim → finish, with no job record anywhere -----------
        expectError(function () { service.claimBuild(enhancementId, 'atf') }, 'gate 1 is not approved')
        service.submit(secondSpecId); service.approve(secondSpecId)
        var claim = service.claimBuild(enhancementId, 'atf-worker-1')
        assertTrue(claim.spec_id === secondSpecId && claim.content_sha256 && claim.markdown, 'claim returns the exact approved bytes')
        enhancement.get(enhancementId)
        assertTrue(enhancement.getValue('u_phase') === 'build' && String(enhancement.getValue('work_start') || ''), 'claim moved the phase and started the clock')
        // The compare-and-swap: a second worker finds the phase already gone and is refused.
        expectError(function () { service.claimBuild(enhancementId, 'atf-worker-2') }, 'expected spec, got build')

        // A reported failure stops IN build with the clock closed — not a new state.
        service.finishBuild(enhancementId, false, 'ATF safe failure')
        enhancement.get(enhancementId)
        assertTrue(enhancement.getValue('u_phase') === 'build' && String(enhancement.getValue('work_end') || ''), 'failure left build open')
        assertTrue(String(enhancement.getValue('u_evidence_summary')).indexOf('ATF safe failure') >= 0, 'failure evidence')
        expectError(function () { service.finishBuild(enhancementId, true, 'second finish') }, 'already finished')

        // Retry is a decision. It clears the clock and hands the record back to the queue.
        service.retryBuild(enhancementId)
        enhancement.get(enhancementId)
        assertTrue(enhancement.getValue('u_phase') === 'spec' && !String(enhancement.getValue('work_end') || ''), 'retry did not reset the clock')
        assertTrue(enhancement.getValue('u_gate_1_decision') === 'approved', 'retry erased the human approval')

        // --- the sweeper: a silent worker lands in the same shape as a failure -------
        service.claimBuild(enhancementId, 'atf-worker-3')
        enhancement.get(enhancementId); enhancement.setWorkflow(false)
        var longAgo = new GlideDateTime(); longAgo.addSeconds(-7200); enhancement.setValue('work_start', longAgo); enhancement.update()
        var fresh = service.ageOutStaleBuilds(60)
        assertTrue(fresh.aged >= 1, 'sweeper aged nothing')
        enhancement.get(enhancementId)
        assertTrue(enhancement.getValue('u_phase') === 'build' && String(enhancement.getValue('work_end') || ''), 'sweeper did not close the clock')
        assertTrue(String(enhancement.getValue('u_evidence_summary')).indexOf('went silent') >= 0, 'sweeper evidence')
        // Idempotent: a record it already closed is no longer a candidate.
        var again = service.ageOutStaleBuilds(60)
        assertTrue(again.enhancements.indexOf(enhancementId) < 0, 'sweeper re-aged a closed build')
    } finally {
        if (enhancementId) { remove('u_sn_spec_version', 'u_enhancement=' + enhancementId); remove('u_sn_enhancement', 'sys_id=' + enhancementId) }
    }
})()
