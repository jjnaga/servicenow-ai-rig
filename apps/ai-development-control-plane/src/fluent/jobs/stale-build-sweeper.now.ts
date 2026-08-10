import { Record } from '@servicenow/sdk/core'

/**
 * The lease, as a platform primitive instead of runner code.
 *
 * A build claims by moving `u_phase` spec→build and stamping `work_start`. If the worker
 * dies mid-run nothing ever stamps `work_end`, so the record would sit in `build` forever.
 * Rather than teach ServiceNow about heartbeats and lease expiry — state it cannot observe —
 * a periodic Scheduled Script Execution reads the clock that already exists and ages the
 * record into the same "finished, needs a human" shape a reported failure lands in.
 *
 * PLATFORM NOTE (codex verify-item 5). An ON-DEMAND Run Once `sysauto_script`
 * (`sys_trigger.trigger_type=0`) never fired on this PDI (2026-08-05) despite an active job and
 * a queued trigger — so the primitive was under suspicion when this was written. PROVEN
 * 2026-08-09 for the PERIODIC path: this job fired at `2026-08-10 02:30:01` UTC exactly on
 * schedule (`source=*** Script`, zero ATF runs in the window, `next_action` advanced 02:30 →
 * 02:45). The failure is confined to the on-demand path. `ageOutStaleBuilds` still ends in a
 * `gs.info` marker — that marker is how the claim was proven and how a future session re-proves
 * it, so do not remove it.
 */
export const staleBuildSweeper = Record({
    $id: Now.ID['ai-control-stale-build-sweeper'],
    table: 'sysauto_script' as any,
    data: {
        name: 'AI control: age out stale builds',
        active: true,
        run_type: 'periodically',
        // Hourly, not every 15 minutes. A lease measured in hours does not need a
        // quarter-hourly check, and each sweep is a full query over the enhancement table.
        run_period: '1970-01-01 01:00:00',
        run_start: '2026-08-09 00:00:00',
        conditional: false,
        /*
         * LEASE: 24 hours (was 60 minutes). Product owner's call, 2026-08-09: "just make it
         * like hours then, even daily."
         *
         * WHY IT WAS TOO SHORT, AND WHY THIS NUMBER IS NOT THE WHOLE STORY. The first real
         * build to run through this app (TASK0020425) was aged out roughly SEVEN MINUTES after
         * claiming it, while it was actively running, and `finish` then refused with
         * `409 build already finished`.
         *
         * The 60 was not the cause. `claimBuild` writes `work_start` with `gs.nowDateTime()`,
         * which returns SESSION-LOCAL time, into a field the platform stores and compares as
         * UTC — while this sweeper's clause, `work_start < gs.minutesAgo(limit)`, is correctly
         * UTC. So a freshly stamped `work_start` already sits one UTC offset in the past
         * (seven hours on this instance) and satisfies the clause immediately. Measured: a
         * three-minute-old claim matched `gs.minutesAgo(30)`.
         *
         * A 24-hour lease absorbs that offset — the effective real-world lease becomes
         * 24h minus the offset, about 17 hours here — which is comfortably past "hours, even
         * daily" and fixes the symptom now.
         *
         * IT DOES NOT FIX THE CAUSE, and the residual matters: the effective lease is
         * whatever the offset happens to be, so it SHIFTS BY AN HOUR AT EVERY DST BOUNDARY and
         * changes if the instance's timezone is ever changed. The one-line real fix is to write
         * `new GlideDateTime()` instead of `gs.nowDateTime()` in `claimBuild` / `finishBuild`
         * (and audit the other `gs.nowDateTime()` calls in `SnAiControlService` for the same
         * mistake). Left as a separate, deliberate change rather than folded in here.
         */
        script: "new SnAiControlService().ageOutStaleBuilds(1440);",
    },
})
