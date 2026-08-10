import React from 'react'
import { Button } from '@servicenow/react-components/Button'
import type { ControlContext } from '../types'

export function HistoryEvidence({ context, busy, act }: { context: ControlContext; busy: boolean; act: (action: string) => void }): JSX.Element {
    return <section className="history-evidence" aria-label="Version history and execution evidence">
        <div><h2>Version history</h2>{context.versions.length ? <table><thead><tr><th>Version</th><th>State</th><th>Hash</th><th>Decision</th></tr></thead><tbody>{context.versions.map(spec => <tr key={spec.sys_id}><td>v{spec.version}</td><td>{spec.state}</td><td className="hash">{spec.content_sha256 || 'draft'}</td><td>{spec.decided_by || '—'}</td></tr>)}</tbody></table> : <p>No version history yet.</p>}</div>
        <div><h2>Build state</h2><table><tbody>
            <tr><th scope="row">State</th><td>{({ idle: 'Not started', waiting_for_worker: 'Approved — waiting for a worker', running: 'Building now', attention: 'Stopped — needs a decision', done: 'Finished' })[context.build.state]}</td></tr>
            <tr><th scope="row">Phase</th><td>{context.build.phase || '—'}</td></tr>
            <tr><th scope="row">Worker</th><td>{context.build.worker || '—'}</td></tr>
            <tr><th scope="row">Started</th><td>{context.build.started_at || '—'}</td></tr>
            <tr><th scope="row">Ended</th><td>{context.build.ended_at || '—'}</td></tr>
            <tr><th scope="row">Evidence</th><td>{context.build.evidence_summary || '—'}</td></tr>
        </tbody></table>
        {context.build.state === 'attention' && context.authority.can_review && <Button label="Retry build" variant="secondary" size="sm" disabled={busy} onClicked={() => act('retry-build')} />}
        {context.build.state === 'idle' && <p>No build yet. Approving a spec puts it in front of the next worker.</p>}</div>
    </section>
}
