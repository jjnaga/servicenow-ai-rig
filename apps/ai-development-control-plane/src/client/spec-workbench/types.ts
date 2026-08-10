export interface SpecView {
    sys_id: string
    version: number
    title: string
    state: string
    markdown: string
    review_notes: string
    content_sha256: string
    computed_sha256: string
    hash_matches: boolean
    authored_by: string
    submitted_by: string
    submitted_at: string
    decided_by: string
    decided_at: string
    repo_path: string
    updated_at: string
}

/** Execution state, read off the enhancement's own phase and work clock — no job table. */
export interface BuildView {
    state: 'idle' | 'waiting_for_worker' | 'running' | 'attention' | 'done'
    phase: string
    worker: string
    started_at: string
    ended_at: string
    evidence_summary: string
}

export interface ControlContext {
    enhancement: { sys_id: string; number: string; short_description: string; phase: string; gate_1: string; gate_2: string }
    current_spec: SpecView | null
    versions: SpecView[]
    build: BuildView
    authority: { can_use: boolean; can_review: boolean; actor: string }
}
