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
        run_period: '1970-01-01 00:15:00',
        run_start: '2026-08-09 00:00:00',
        conditional: false,
        script: "new SnAiControlService().ageOutStaleBuilds(60);",
    },
})
