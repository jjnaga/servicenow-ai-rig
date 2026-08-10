import React from 'react'
import type { ControlContext } from '../types'

export function AuthorityRail({ context }: { context: ControlContext }): JSX.Element {
    const spec = context.current_spec
    const state = spec?.state || 'no_spec'
    const next = !spec ? 'Request a governed draft' : state === 'draft' ? 'Save exact bytes, then submit' : state === 'in_review' ? 'Reviewer decision required' : 'Create a new version to change content'
    return <header className={`authority-rail state-${state}`}>
        <p className="eyebrow">Authority status</p>
        <h1 id="workbench-title">{context.enhancement.number} · {context.enhancement.short_description}</h1>
        <dl>
            <div><dt>Version</dt><dd>{spec ? `v${spec.version}` : 'None'}</dd></div>
            <div><dt>State</dt><dd>{state.replace('_', ' ')}</dd></div>
            <div><dt>Exact hash</dt><dd className="hash">{spec?.content_sha256 || 'Appears after submit'}</dd></div>
            <div><dt>Decision owner</dt><dd>{spec?.decided_by || 'Unassigned'}</dd></div>
            <div><dt>Next action</dt><dd>{next}</dd></div>
        </dl>
    </header>
}
