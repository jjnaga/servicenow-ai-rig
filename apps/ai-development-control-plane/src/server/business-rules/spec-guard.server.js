(function executeRule(current, previous) {
    function abort(message) {
        gs.addErrorMessage('AI control: ' + message)
        current.setAbortAction(true)
    }
    function changed(field) {
        return current.getElement(field).changes()
    }
    var state = String(current.getValue('u_state') || '')
    var version = parseInt(current.getValue('u_version'), 10)
    if (current.operation() === 'insert') {
        if (state !== 'draft') return abort('new spec versions must begin as draft.')
        if (isNaN(version) || version < 1) return abort('spec version must be at least 1.')
        if (current.getValue('u_content_sha256') || current.getValue('u_submitted_by') || current.getValue('u_submitted_at') || current.getValue('u_decided_by') || current.getValue('u_decided_at')) {
            return abort('new drafts cannot carry review authority metadata.')
        }
        if (!current.getValue('u_authored_by')) current.setValue('u_authored_by', gs.getUserID())
        return
    }

    var prior = String(previous.getValue('u_state') || '')
    var frozen = ['u_enhancement', 'u_version', 'u_title', 'u_markdown', 'u_content_sha256', 'u_authored_by', 'u_submitted_by', 'u_submitted_at', 'u_repo_path']
    if (prior !== 'draft') {
        for (var index = 0; index < frozen.length; index++) {
            if (changed(frozen[index])) return abort('reviewed spec versions are immutable; create a new draft version.')
        }
    }
    if (prior === 'draft') {
        if (state === 'draft') {
            if (current.getValue('u_content_sha256') || current.getValue('u_submitted_by') || current.getValue('u_submitted_at') || current.getValue('u_decided_by') || current.getValue('u_decided_at')) {
                return abort('draft edits cannot set review authority metadata.')
            }
            return
        }
        if (state !== 'in_review') return abort('draft may transition only to in review.')
        var markdown = String(current.getValue('u_markdown') || '')
        var expectedHash = new SnAiControlService().sha256(markdown)
        if (!markdown.trim() || String(current.getValue('u_content_sha256')) !== expectedHash || !current.getValue('u_submitted_by') || !current.getValue('u_submitted_at')) {
            return abort('submission requires exact hash and attributed submitter/time.')
        }
        return
    }
    if (prior === 'in_review') {
        if (state === 'in_review') return abort('an in-review snapshot cannot be edited.')
        if (['approved', 'changes_requested', 'rejected'].indexOf(state) < 0) return abort('illegal review decision transition.')
        if (!current.getValue('u_decided_by') || !current.getValue('u_decided_at')) return abort('review decisions require attributed reviewer/time.')
        if (state === 'changes_requested' && !String(current.getValue('u_review_notes') || '').trim()) return abort('changes requested requires review notes.')
        return
    }
    if (prior === 'approved' && state === 'superseded' && changed('u_state')) return
    if (changed('u_state') || changed('u_review_notes') || changed('u_decided_by') || changed('u_decided_at') || changed('u_commit_sha')) {
        return abort('decided spec versions are immutable.')
    }
})(current, previous)
