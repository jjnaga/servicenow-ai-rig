/**
 * The clock pin. See control-plane.atf.now.ts :: claimClock.
 *
 * Asserts two things about a JUST-stamped `work_start`:
 *   1. it is within a small window of UTC now — i.e. it was not written in session-local time;
 *   2. the sweeper's own lease clause does NOT match it — i.e. a fresh build is not stale.
 *
 * (2) is the real assertion. (1) alone would still pass on an instance whose session timezone
 * happens to be UTC, which is exactly the environment where this bug hides.
 */
(function () {
    var svc = new SnAiControlService();

    var stamped = svc.nowUtc();
    var utcNow = new GlideDateTime();
    var drift = Math.abs(utcNow.getNumericValue() - new GlideDateTime(stamped).getNumericValue()) / 1000;
    if (drift > 120) {
        throw 'clock: nowUtc() is ' + drift + 's from UTC now — it is writing a session-local time ' +
            'into a UTC-compared field (stamped=' + stamped + ' utcNow=' + utcNow.getValue() + ')';
    }

    // Build a fixture in `build` phase with a work_start of RIGHT NOW, then run the sweeper's
    // exact clause against it. A correct clock means zero matches.
    var e = new GlideRecord('u_sn_enhancement');
    e.initialize();
    e.setValue('short_description', 'ATF claim clock pin');
    e.setValue('u_phase', 'build');
    e.setValue('u_gate_1_decision', 'pending');
    e.setValue('u_gate_2_decision', 'not_reached');
    e.setValue('work_start', svc.nowUtc());
    var id = e.insert();
    if (!id) throw 'clock: could not create fixture';

    var probe = new GlideRecord('u_sn_enhancement');
    probe.addQuery('sys_id', id);
    probe.addQuery('work_start', '<', gs.minutesAgo(60));
    probe.query();
    if (probe.hasNext()) {
        var got = new GlideRecord('u_sn_enhancement'); got.get(id);
        throw 'clock: a build claimed SECONDS ago already matches the 60-minute stale clause ' +
            '(work_start=' + got.getValue('work_start') + ', gs.minutesAgo(60) threshold is UTC). ' +
            'The lease is effectively negative and every build will be aged out.';
    }

    // Control: the same record IS matched by a threshold that genuinely is in its past, so the
    // assertion above is proving the clock and not merely a broken query.
    var control = new GlideRecord('u_sn_enhancement');
    control.addQuery('sys_id', id);
    control.addQuery('work_start', '<', gs.minutesAgo(-60)); // 60 minutes into the FUTURE
    control.query();
    if (!control.hasNext()) {
        throw 'clock: control failed — the fixture is not matched even by a future threshold, ' +
            'so the probe above proves nothing about the clock.';
    }

    var del = new GlideRecord('u_sn_enhancement');
    if (del.get(id)) del.deleteRecord();

    gs.info('[AI control][ATF clock] fresh claim is not stale; nowUtc drift ' + drift + 's');
})();
