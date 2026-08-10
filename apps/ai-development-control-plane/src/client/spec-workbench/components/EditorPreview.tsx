import React, { useMemo } from 'react'
import { Textarea } from '@servicenow/react-components/Textarea'
import { renderMarkdown } from '../markdown'

interface Props { markdown: string; editable: boolean; onChange: (value: string) => void }

export function EditorPreview({ markdown, editable, onChange }: Props): JSX.Element {
    const preview = useMemo(() => renderMarkdown(markdown), [markdown])
    return <section className="workbench" aria-label="Markdown workbench">
        <div className="editor-pane">
            <Textarea
                label="Markdown editor" value={markdown} rows={24} resize="vertical" disableMaxHeight
                readonly={!editable} maxlength={65535} showCounter
                helperContent={editable ? 'Only a draft is editable. Save before submitting.' : 'This reviewed version is an immutable snapshot.'}
                onInput={event => onChange(event.detail.payload.fieldValue)}
            />
        </div>
        <article aria-label="Sanitized preview">
            <h2>Sanitized preview</h2>
            {preview ? <div className="preview" dangerouslySetInnerHTML={{ __html: preview }} /> : <p>No spec yet — request a draft.</p>}
        </article>
    </section>
}
