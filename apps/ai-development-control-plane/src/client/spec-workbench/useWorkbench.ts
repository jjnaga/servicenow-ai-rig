import { useCallback, useEffect, useState } from 'react'
import { enhancementAction, loadContext, saveDraft, specAction } from './api'
import type { ControlContext } from './types'

export function useWorkbench(enhancementId: string) {
    const [context, setContext] = useState<ControlContext | null>(null)
    const [markdown, setMarkdown] = useState('')
    const [dirty, setDirty] = useState(false)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('Loading authority state…')
    const [error, setError] = useState('')
    const [note, setNote] = useState('')
    const refresh = useCallback(async () => {
        const loaded = await loadContext(enhancementId)
        setContext(loaded); setMarkdown(loaded.current_spec?.markdown || ''); setDirty(false)
    }, [enhancementId])
    useEffect(() => { refresh().then(() => setMessage('Authority state loaded.')).catch(fail) }, [refresh])
    function fail(reason: unknown) { setError(reason instanceof Error ? reason.message : 'The request failed safely.'); setMessage('No authority state changed.') }
    async function act(action: string) {
        if (!context) return
        setBusy(true); setError('')
        try {
            const spec = context.current_spec
            if (action === 'save' && spec) await saveDraft(spec.sys_id, { markdown, title: spec.title, repo_path: spec.repo_path })
            else if (action === 'draft') await enhancementAction(enhancementId, 'request-draft')
            else if (action === 'retry-build') await enhancementAction(enhancementId, 'retry-build')
            else if (spec) await specAction(spec.sys_id, action, action === 'request-changes' ? { note } : undefined)
            await refresh(); setNote(''); setMessage(action === 'save' ? 'Draft saved. Submit when the exact content is ready.' : 'Action recorded and read back from ServiceNow.')
        } catch (reason) { fail(reason) } finally { setBusy(false) }
    }
    return { context, markdown, setMarkdown: (value: string) => { setMarkdown(value); setDirty(true); setMessage('Unsaved changes.') }, dirty, busy, message, error, note, setNote, act }
}
