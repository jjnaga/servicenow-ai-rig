import React from 'react'
import { Button } from '@servicenow/react-components/Button'
import { Textarea } from '@servicenow/react-components/Textarea'
import type { ControlContext } from '../types'

interface Props { context: ControlContext; dirty: boolean; busy: boolean; note: string; setNote: (note: string) => void; act: (action: string) => void }

export function ActionBar({ context, dirty, busy, note, setNote, act }: Props): JSX.Element {
    const spec = context.current_spec
    const state = spec?.state
    return <section className="actions" aria-label="Allowed actions">
        {state === 'in_review' && context.authority.can_review && <Textarea
            label="Attributed review note" value={note} rows={3} maxlength={8000} showCounter
            helperContent="Required for Request changes; retained on the immutable reviewed version."
            onInput={event => setNote(event.detail.payload.fieldValue)}
        />}
        <div className="action-row">
            {!spec && <Button label="Request a draft" variant="primary" disabled={busy} onClicked={() => act('draft')} />}
            {state === 'draft' && <Button label="Save changes" variant="primary" disabled={busy || !dirty} onClicked={() => act('save')} />}
            {state === 'draft' && <Button label="Submit for review" variant="secondary" disabled={busy || dirty || !spec.markdown.trim()} onClicked={() => act('submit')} />}
            {state === 'in_review' && context.authority.can_review && <Button label="Approve for build" variant="primary-positive" disabled={busy || !spec.hash_matches} onClicked={() => act('approve')} />}
            {state === 'in_review' && context.authority.can_review && <Button label="Request changes" variant="secondary" disabled={busy || !note.trim()} onClicked={() => act('request-changes')} />}
            {state === 'in_review' && context.authority.can_review && <Button label="Reject" variant="primary-negative" disabled={busy} onClicked={() => act('reject')} />}
            {spec && ['approved', 'changes_requested', 'rejected', 'superseded'].includes(state || '') && <Button label="Create new version" variant="secondary" disabled={busy} onClicked={() => act('new-version')} />}
        </div>
    </section>
}
