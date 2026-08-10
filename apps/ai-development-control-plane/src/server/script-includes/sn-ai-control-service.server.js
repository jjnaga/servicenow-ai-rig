var SnAiControlService = Class.create()
SnAiControlService.prototype = {
    initialize: function () {},

    sha256: function (text) {
        return new GlideDigest().getSHA256Hex(String(text))
    },

    hasRole: function (role) {
        return gs.hasRole('admin') || gs.hasRole(role)
    },

    requireRole: function (role) {
        if (!this.hasRole(role)) throw new Error('AI control: role required: ' + role)
    },

    requireState: function (record, expected) {
        var actual = String(record.getValue('u_state'))
        if (actual !== expected) throw new Error('AI control: expected ' + expected + ', got ' + actual)
    },

    requireChoice: function (table, field, value) {
        var choice = new GlideRecord('sys_choice')
        choice.addQuery('name', table)
        choice.addQuery('element', field)
        choice.addQuery('value', value)
        var active = choice.addQuery('inactive', false)
        active.addOrCondition('inactive', '')
        choice.setLimit(1)
        choice.query()
        if (!choice.next()) throw new Error('AI control: inactive or invalid choice ' + table + '.' + field + '=' + value)
        return value
    },

    getRecord: function (table, id, label) {
        var record = new GlideRecord(table)
        if (!record.get(String(id || ''))) throw new Error('AI control: ' + label + ' not found')
        return record
    },

    assertReadBack: function (table, id, expected, label) {
        var record = this.getRecord(table, id, label)
        for (var field in expected) {
            if (expected.hasOwnProperty(field)) {
                var actual = String(record.getValue(field) || '')
                var wanted = String(expected[field] || '')
                if (wanted === 'true' && (actual === 'true' || actual === '1')) continue
                if (wanted === 'false' && (actual === 'false' || actual === '0' || actual === '')) continue
                if (actual !== wanted) throw new Error('AI control: ' + label + ' read-back mismatch: ' + field)
            }
        }
        return record
    },

    workNote: function (enhancementId, message) {
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        var value = 'AI control — ' + message + ' [actor=' + gs.getUserName() + ']'
        enhancement.work_notes = value
        if (!enhancement.update()) throw new Error('AI control: work-note update failed')
        var receipt = new GlideRecord('sys_journal_field')
        receipt.addQuery('name', 'u_sn_enhancement')
        receipt.addQuery('element', 'work_notes')
        receipt.addQuery('element_id', enhancementId)
        receipt.addQuery('value', value)
        receipt.setLimit(1)
        receipt.query()
        if (!receipt.next()) throw new Error('AI control: work-note read-back failed')
    },

    event: function (name, record, parm1, parm2) {
        gs.eventQueue(name, record, String(parm1 || ''), String(parm2 || ''))
    },

    specView: function (spec) {
        var markdown = String(spec.getValue('u_markdown') || '')
        var storedHash = String(spec.getValue('u_content_sha256') || '')
        return {
            sys_id: String(spec.getUniqueValue()),
            enhancement_id: String(spec.getValue('u_enhancement') || ''),
            version: parseInt(spec.getValue('u_version'), 10) || 0,
            title: String(spec.getValue('u_title') || ''),
            state: String(spec.getValue('u_state') || ''),
            markdown: markdown,
            review_notes: String(spec.getValue('u_review_notes') || ''),
            content_sha256: storedHash,
            computed_sha256: markdown ? this.sha256(markdown) : '',
            hash_matches: !storedHash || storedHash === this.sha256(markdown),
            authored_by: String(spec.getDisplayValue('u_authored_by') || ''),
            submitted_by: String(spec.getDisplayValue('u_submitted_by') || ''),
            submitted_at: String(spec.getValue('u_submitted_at') || ''),
            decided_by: String(spec.getDisplayValue('u_decided_by') || ''),
            decided_at: String(spec.getValue('u_decided_at') || ''),
            repo_path: String(spec.getValue('u_repo_path') || ''),
            commit_sha: String(spec.getValue('u_commit_sha') || ''),
            updated_at: String(spec.getValue('sys_updated_on') || ''),
        }
    },

    /**
     * The execution half of the record, read straight off the enhancement's own fields.
     * There is no job table: `u_phase` IS the claim, `work_start`/`work_end` ARE the clock.
     */
    buildView: function (enhancement) {
        var phase = String(enhancement.getValue('u_phase') || '')
        var started = String(enhancement.getValue('work_start') || '')
        var ended = String(enhancement.getValue('work_end') || '')
        var state = 'idle'
        if (phase === 'build') state = ended ? 'attention' : 'running'
        else if (phase === 'package_verify' || phase === 'review' || phase === 'closed') state = 'done'
        else if (String(enhancement.getValue('u_gate_1_decision')) === 'approved') state = 'waiting_for_worker'
        return {
            state: state,
            phase: phase,
            worker: String(enhancement.getDisplayValue('assigned_to') || ''),
            started_at: started,
            ended_at: ended,
            evidence_summary: String(enhancement.getValue('u_evidence_summary') || ''),
        }
    },

    getContext: function (enhancementId) {
        this.requireRole('global.ai_control_user')
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        var currentId = String(enhancement.getValue('u_current_spec') || '')
        var specs = []
        var history = new GlideRecord('u_sn_spec_version')
        history.addQuery('u_enhancement', enhancementId)
        history.orderByDesc('u_version')
        history.query()
        while (history.next()) {
            if (!currentId) currentId = String(history.getUniqueValue())
            specs.push(this.specView(history))
        }
        var current = null
        for (var index = 0; index < specs.length; index++) {
            if (specs[index].sys_id === currentId) current = specs[index]
        }
        return {
            enhancement: {
                sys_id: String(enhancement.getUniqueValue()),
                number: String(enhancement.getValue('number') || ''),
                short_description: String(enhancement.getValue('short_description') || ''),
                phase: String(enhancement.getValue('u_phase') || ''),
                gate_1: String(enhancement.getValue('u_gate_1_decision') || ''),
                gate_2: String(enhancement.getValue('u_gate_2_decision') || ''),
            },
            current_spec: current,
            versions: specs,
            build: this.buildView(enhancement),
            authority: {
                can_use: this.hasRole('global.ai_control_user'),
                can_review: this.hasRole('global.ai_control_reviewer'),
                actor: gs.getUserDisplayName(),
            },
        }
    },

    saveDraft: function (specId, body) {
        this.requireRole('global.ai_control_user')
        var spec = this.getRecord('u_sn_spec_version', specId, 'spec')
        this.requireState(spec, 'draft')
        body = body || {}
        if (typeof body.markdown !== 'string') throw new Error('AI control: markdown must be a string')
        var title = typeof body.title === 'string' ? body.title.trim() : String(spec.getValue('u_title') || '')
        if (!title) throw new Error('AI control: title is required')
        spec.setValue('u_title', title.substring(0, 160))
        spec.setValue('u_markdown', body.markdown)
        if (typeof body.repo_path === 'string') spec.setValue('u_repo_path', body.repo_path.substring(0, 255))
        if (!spec.update()) throw new Error('AI control: draft save failed')
        spec = this.assertReadBack('u_sn_spec_version', specId, { u_title: title.substring(0, 160), u_markdown: body.markdown }, 'draft')
        return this.specView(spec)
    },

    /**
     * Put the request in front of the agent. There is nothing to enqueue — a worker polls
     * for `u_phase=spec` and reads the spec state to decide what it owes: no current spec
     * means draft, `changes_requested` means revise, `approved` means build.
     */
    requestDraft: function (enhancementId) {
        this.requireRole('global.ai_control_user')
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        var phase = String(enhancement.getValue('u_phase') || '')
        if (phase === 'build') throw new Error('AI control: expected an idle phase, got build')
        enhancement.setValue('u_phase', this.requireChoice('u_sn_enhancement', 'u_phase', 'spec'))
        if (!enhancement.update()) throw new Error('AI control: draft request update failed')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_phase: 'spec' }, 'enhancement')
        this.workNote(enhancementId, 'moved to the spec phase; the next worker poll will draft')
        return { enhancement_id: String(enhancementId), phase: 'spec' }
    },

    submit: function (specId) {
        this.requireRole('global.ai_control_user')
        var spec = this.getRecord('u_sn_spec_version', specId, 'spec')
        this.requireState(spec, 'draft')
        var markdown = String(spec.getValue('u_markdown') || '')
        if (!markdown.trim()) throw new Error('AI control: markdown is required')
        var enhancementId = String(spec.getValue('u_enhancement'))
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        this.requireChoice('u_sn_spec_version', 'u_state', 'in_review')
        var hash = this.sha256(markdown)
        spec.setValue('u_content_sha256', hash)
        spec.setValue('u_state', 'in_review')
        spec.setValue('u_submitted_by', gs.getUserID())
        spec.setValue('u_submitted_at', gs.nowDateTime())
        if (!spec.update()) throw new Error('AI control: submit update failed')
        enhancement.setValue('u_current_spec', specId)
        enhancement.setValue('u_gate_1_decision', this.requireChoice('u_sn_enhancement', 'u_gate_1_decision', 'pending'))
        enhancement.setValue('u_phase', this.requireChoice('u_sn_enhancement', 'u_phase', 'spec'))
        if (!enhancement.update()) throw new Error('AI control: submit pointer update failed')
        this.assertReadBack('u_sn_spec_version', specId, { u_state: 'in_review', u_content_sha256: hash }, 'submitted spec')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_current_spec: specId, u_gate_1_decision: 'pending', u_phase: 'spec' }, 'enhancement')
        this.event('global.ai_control.review_needed', spec, enhancement.getValue('assigned_to'), enhancement.getValue('opened_by'))
        this.workNote(enhancementId, 'submitted spec v' + spec.getValue('u_version') + ' for review; SHA-256 ' + hash)
        return { spec_id: String(specId), state: 'in_review', content_sha256: hash }
    },

    approve: function (specId) {
        this.requireRole('global.ai_control_reviewer')
        var spec = this.getRecord('u_sn_spec_version', specId, 'spec')
        var enhancementId = String(spec.getValue('u_enhancement'))
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        var hash = this.sha256(String(spec.getValue('u_markdown') || ''))
        if (hash !== String(spec.getValue('u_content_sha256') || '')) throw new Error('AI control: submitted content changed')
        // Approving twice is the same decision, not a second one. Idempotent by state.
        if (String(spec.getValue('u_state')) === 'approved') {
            return { spec_id: String(specId), state: 'approved', content_sha256: hash, gate_1: 'approved', duplicate: true }
        }
        this.requireState(spec, 'in_review')
        this.requireChoice('u_sn_spec_version', 'u_state', 'approved')
        this.requireChoice('u_sn_enhancement', 'u_gate_1_decision', 'approved')
        var oldGate = String(enhancement.getValue('u_gate_1_decision') || '')
        try {
            spec.setValue('u_state', 'approved')
            spec.setValue('u_decided_by', gs.getUserID())
            spec.setValue('u_decided_at', gs.nowDateTime())
            if (!spec.update()) throw new Error('AI control: approval update failed')
            // The phase is NOT advanced here. Approval records a human decision; advancing
            // spec→build is the worker's claim, so `build` keeps meaning "somebody is
            // actually building this" — which is what the stale sweeper reads.
            enhancement.setValue('u_gate_1_decision', 'approved')
            enhancement.setValue('u_current_spec', specId)
            if (!enhancement.update()) throw new Error('AI control: approval gate update failed')
            this.assertReadBack('u_sn_spec_version', specId, { u_state: 'approved', u_content_sha256: hash }, 'approved spec')
            this.assertReadBack('u_sn_enhancement', enhancementId, { u_gate_1_decision: 'approved', u_phase: 'spec', u_current_spec: specId }, 'enhancement')
            var prior = new GlideRecord('u_sn_spec_version')
            prior.addQuery('u_enhancement', enhancementId)
            prior.addQuery('u_state', 'approved')
            prior.addQuery('sys_id', '!=', specId)
            prior.query()
            while (prior.next()) {
                prior.setValue('u_state', 'superseded')
                if (!prior.update()) throw new Error('AI control: prior approval supersede failed')
            }
        } catch (error) {
            spec.setWorkflow(false)
            spec.setValue('u_state', 'in_review')
            spec.setValue('u_decided_by', '')
            spec.setValue('u_decided_at', '')
            spec.update()
            enhancement.setWorkflow(false)
            enhancement.setValue('u_gate_1_decision', oldGate)
            enhancement.update()
            throw error
        }
        this.workNote(enhancementId, 'approved spec v' + spec.getValue('u_version') + ' at SHA-256 ' + hash + '; awaiting a worker')
        return { spec_id: String(specId), state: 'approved', content_sha256: hash, gate_1: 'approved', duplicate: false }
    },

    // ---------------------------------------------------------------------------
    // The machine protocol. Three guarded transitions, no job records, no tokens.
    // The runner holds no write grant on gate fields — it can only call these.
    // ---------------------------------------------------------------------------

    /** Compare-and-swap: only an approved-and-unclaimed request can move spec→build. */
    claimBuild: function (enhancementId, workerId) {
        this.requireRole('global.ai_control_runner')
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        var phase = String(enhancement.getValue('u_phase') || '')
        if (phase !== 'spec') throw new Error('AI control: expected spec, got ' + phase)
        if (String(enhancement.getValue('u_gate_1_decision')) !== 'approved') throw new Error('AI control: gate 1 is not approved')
        var specId = String(enhancement.getValue('u_current_spec') || '')
        var spec = this.getRecord('u_sn_spec_version', specId, 'spec')
        this.requireState(spec, 'approved')
        var markdown = String(spec.getValue('u_markdown') || '')
        var hash = this.sha256(markdown)
        if (hash !== String(spec.getValue('u_content_sha256') || '')) throw new Error('AI control: approved spec hash mismatch')
        this.requireChoice('u_sn_enhancement', 'u_phase', 'build')
        enhancement.setValue('u_phase', 'build')
        enhancement.setValue('work_start', gs.nowDateTime())
        enhancement.setValue('work_end', '')
        enhancement.setValue('u_evidence_summary', '')
        if (!enhancement.update()) throw new Error('AI control: claim update failed')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_phase: 'build' }, 'claimed enhancement')
        this.workNote(enhancementId, 'claimed for build by worker ' + String(workerId || 'unnamed'))
        return {
            enhancement_id: String(enhancementId),
            number: String(enhancement.getValue('number') || ''),
            spec_id: specId,
            version: parseInt(spec.getValue('u_version'), 10) || 0,
            markdown: markdown,
            content_sha256: hash,
            repo_path: String(spec.getValue('u_repo_path') || ''),
            claimed_at: String(enhancement.getValue('work_start') || ''),
        }
    },

    /**
     * Terminal for a claimed build. Success advances to package_verify; failure stops in
     * `build` with `work_end` stamped — the same shape the sweeper leaves a dead worker in,
     * so a crash and a failure have exactly one recovery path, and it belongs to a human.
     */
    finishBuild: function (enhancementId, ok, summary, artifactPath) {
        this.requireRole('global.ai_control_runner')
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        if (String(enhancement.getValue('u_phase')) !== 'build') throw new Error('AI control: expected build, got ' + String(enhancement.getValue('u_phase')))
        if (String(enhancement.getValue('work_end') || '')) throw new Error('AI control: build already finished')
        var succeeded = ok === true || String(ok) === 'true'
        var evidence = String(summary || '').substring(0, 4000)
        if (artifactPath) evidence = evidence + ' [artifact=' + String(artifactPath).substring(0, 255) + ']'
        if (succeeded) enhancement.setValue('u_phase', this.requireChoice('u_sn_enhancement', 'u_phase', 'package_verify'))
        enhancement.setValue('work_end', gs.nowDateTime())
        enhancement.setValue('u_evidence_summary', evidence)
        if (!enhancement.update()) throw new Error('AI control: finish update failed')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_phase: succeeded ? 'package_verify' : 'build' }, 'finished enhancement')
        this.workNote(enhancementId, (succeeded ? 'build succeeded: ' : 'build FAILED: ') + evidence)
        if (!succeeded) this.event('global.ai_control.build_attention', enhancement, enhancement.getValue('assigned_to'), enhancement.getValue('opened_by'))
        return { enhancement_id: String(enhancementId), ok: succeeded, phase: String(enhancement.getValue('u_phase')) }
    },

    /** A retry is a decision, never a timer. Clears the clock and hands it back to the queue. */
    retryBuild: function (enhancementId) {
        this.requireRole('global.ai_control_reviewer')
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        if (String(enhancement.getValue('u_phase')) !== 'build') throw new Error('AI control: expected build, got ' + String(enhancement.getValue('u_phase')))
        if (!String(enhancement.getValue('work_end') || '')) throw new Error('AI control: build is still running')
        enhancement.setValue('u_phase', this.requireChoice('u_sn_enhancement', 'u_phase', 'spec'))
        enhancement.setValue('work_start', '')
        enhancement.setValue('work_end', '')
        if (!enhancement.update()) throw new Error('AI control: retry update failed')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_phase: 'spec' }, 'retried enhancement')
        this.workNote(enhancementId, 'build retry authorized; gate 1 approval stands')
        return { enhancement_id: String(enhancementId), phase: 'spec' }
    },

    /**
     * Called only by the scheduled sweeper. Ages out a build whose worker went silent —
     * no lease field, no heartbeat: `work_start` is the clock and it already existed.
     */
    ageOutStaleBuilds: function (minutes) {
        var limit = parseInt(minutes, 10)
        if (isNaN(limit) || limit < 1) limit = 60
        var stale = new GlideRecord('u_sn_enhancement')
        stale.addQuery('u_phase', 'build')
        stale.addQuery('work_start', '<', gs.minutesAgo(limit))
        stale.addNullQuery('work_end')
        stale.query()
        var aged = []
        while (stale.next()) {
            var id = String(stale.getUniqueValue())
            stale.setValue('work_end', gs.nowDateTime())
            stale.setValue('u_evidence_summary', 'Worker went silent; aged out after ' + limit + ' minutes by the AI control stale-build sweeper.')
            if (stale.update()) {
                aged.push(id)
                this.event('global.ai_control.build_attention', stale, stale.getValue('assigned_to'), stale.getValue('opened_by'))
            }
        }
        gs.info('AI control stale-build sweeper: aged ' + aged.length + ' build(s) older than ' + limit + ' minutes')
        return { aged: aged.length, enhancements: aged }
    },

    requestChanges: function (specId, note) {
        this.requireRole('global.ai_control_reviewer')
        note = String(note || '').trim()
        if (!note) throw new Error('AI control: review note is required')
        var spec = this.getRecord('u_sn_spec_version', specId, 'spec')
        this.requireState(spec, 'in_review')
        var enhancementId = String(spec.getValue('u_enhancement'))
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        this.requireChoice('u_sn_spec_version', 'u_state', 'changes_requested')
        this.requireChoice('u_sn_enhancement', 'u_gate_1_decision', 'changes_requested')
        var oldGate = String(enhancement.getValue('u_gate_1_decision') || '')
        try {
            spec.setValue('u_state', 'changes_requested')
            spec.setValue('u_review_notes', note)
            spec.setValue('u_decided_by', gs.getUserID())
            spec.setValue('u_decided_at', gs.nowDateTime())
            if (!spec.update()) throw new Error('AI control: changes update failed')
            // No revise job: the spec's own `changes_requested` state IS the work signal,
            // and the attributed note is the steering. A worker polling `u_phase=spec`
            // reads both off records the human already wrote.
            enhancement.setValue('u_gate_1_decision', 'changes_requested')
            if (!enhancement.update()) throw new Error('AI control: changes gate update failed')
            this.assertReadBack('u_sn_spec_version', specId, { u_state: 'changes_requested', u_review_notes: note }, 'changes-requested spec')
            this.assertReadBack('u_sn_enhancement', enhancementId, { u_gate_1_decision: 'changes_requested' }, 'enhancement')
        } catch (error) {
            spec.setWorkflow(false); spec.setValue('u_state', 'in_review'); spec.setValue('u_review_notes', ''); spec.setValue('u_decided_by', ''); spec.setValue('u_decided_at', ''); spec.update()
            enhancement.setWorkflow(false); enhancement.setValue('u_gate_1_decision', oldGate); enhancement.update()
            throw error
        }
        this.event('global.ai_control.changes_requested', spec, enhancement.getValue('opened_by'), enhancement.getValue('assigned_to'))
        this.workNote(enhancementId, 'requested changes on spec v' + spec.getValue('u_version'))
        return { spec_id: String(specId), state: 'changes_requested' }
    },

    reject: function (specId) {
        this.requireRole('global.ai_control_reviewer')
        var spec = this.getRecord('u_sn_spec_version', specId, 'spec')
        this.requireState(spec, 'in_review')
        var enhancementId = String(spec.getValue('u_enhancement'))
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        this.requireChoice('u_sn_spec_version', 'u_state', 'rejected')
        this.requireChoice('u_sn_enhancement', 'u_gate_1_decision', 'rejected')
        spec.setValue('u_state', 'rejected')
        spec.setValue('u_decided_by', gs.getUserID())
        spec.setValue('u_decided_at', gs.nowDateTime())
        if (!spec.update()) throw new Error('AI control: rejection update failed')
        enhancement.setValue('u_gate_1_decision', 'rejected')
        if (!enhancement.update()) throw new Error('AI control: rejection gate update failed')
        this.assertReadBack('u_sn_spec_version', specId, { u_state: 'rejected' }, 'rejected spec')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_gate_1_decision: 'rejected' }, 'enhancement')
        this.workNote(enhancementId, 'rejected spec v' + spec.getValue('u_version'))
        return { spec_id: String(specId), state: 'rejected' }
    },

    newVersion: function (specId) {
        this.requireRole('global.ai_control_user')
        var prior = this.getRecord('u_sn_spec_version', specId, 'spec')
        if (String(prior.getValue('u_state')) === 'draft') throw new Error('AI control: draft is already editable')
        var enhancementId = String(prior.getValue('u_enhancement'))
        var latest = new GlideRecord('u_sn_spec_version')
        latest.addQuery('u_enhancement', enhancementId)
        latest.orderByDesc('u_version')
        latest.setLimit(1)
        latest.query()
        var version = latest.next() ? parseInt(latest.getValue('u_version'), 10) + 1 : 1
        var draft = new GlideRecord('u_sn_spec_version')
        draft.initialize()
        draft.setValue('u_enhancement', enhancementId)
        draft.setValue('u_version', version)
        draft.setValue('u_title', prior.getValue('u_title'))
        draft.setValue('u_state', 'draft')
        draft.setValue('u_markdown', prior.getValue('u_markdown'))
        draft.setValue('u_authored_by', gs.getUserID())
        draft.setValue('u_repo_path', prior.getValue('u_repo_path'))
        var id = draft.insert()
        if (!id) throw new Error('AI control: draft insert failed')
        var enhancement = this.getRecord('u_sn_enhancement', enhancementId, 'enhancement')
        enhancement.setValue('u_current_spec', id)
        enhancement.setValue('u_gate_1_decision', this.requireChoice('u_sn_enhancement', 'u_gate_1_decision', 'pending'))
        enhancement.setValue('u_phase', this.requireChoice('u_sn_enhancement', 'u_phase', 'spec'))
        if (!enhancement.update()) throw new Error('AI control: new-version pointer update failed')
        this.assertReadBack('u_sn_spec_version', id, { u_state: 'draft', u_version: version, u_markdown: String(prior.getValue('u_markdown')) }, 'new draft')
        this.assertReadBack('u_sn_enhancement', enhancementId, { u_current_spec: id, u_gate_1_decision: 'pending', u_phase: 'spec' }, 'enhancement')
        this.workNote(enhancementId, 'created editable spec v' + version + ' from immutable v' + prior.getValue('u_version'))
        return { spec_id: String(id), state: 'draft', version: version }
    },

    dispatch: function (response, operation, args) {
        try {
            if (typeof this[operation] !== 'function' || operation === 'dispatch') throw new Error('AI control: unsupported operation')
            var result = this[operation].apply(this, args || [])
            response.setStatus(200)
            response.setBody({ ok: true, result: result })
        } catch (error) {
            var message = String(error && error.message ? error.message : error)
            if (message.indexOf('AI control:') !== 0) message = 'AI control: request failed safely'
            var status = 400
            if (message.indexOf('role required') >= 0) status = 403
            else if (message.indexOf('not found') >= 0) status = 404
            else if (message.indexOf('expected ') >= 0 || message.indexOf('immutable') >= 0 || message.indexOf('already') >= 0 || message.indexOf('changed') >= 0) status = 409
            response.setStatus(status)
            response.setBody({ ok: false, error: { status: status, message: message } })
        }
    },

    type: 'SnAiControlService',
}
