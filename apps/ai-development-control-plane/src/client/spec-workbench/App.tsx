import React, { useEffect, useState } from 'react'
import { Alert } from '@servicenow/react-components/Alert'
import { Modal } from '@servicenow/react-components/Modal'
import { ActionBar } from './components/ActionBar'
import { AuthorityRail } from './components/AuthorityRail'
import { EditorPreview } from './components/EditorPreview'
import { HistoryEvidence } from './components/HistoryEvidence'
import { useWorkbench } from './useWorkbench'

export default function App(): JSX.Element {
    const params = new URLSearchParams(window.location.search)
    const enhancementId = params.get('sysparm_enhancement_id') || ''
    const state = useWorkbench(enhancementId)
    const [leaveWarning, setLeaveWarning] = useState(false)
    useEffect(() => {
        const beforeUnload = (event: BeforeUnloadEvent) => { if (state.dirty) { event.preventDefault(); event.returnValue = '' } }
        const popState = () => { if (state.dirty) { history.pushState(null, '', window.location.href); setLeaveWarning(true) } }
        window.addEventListener('beforeunload', beforeUnload); window.addEventListener('popstate', popState)
        return () => { window.removeEventListener('beforeunload', beforeUnload); window.removeEventListener('popstate', popState) }
    }, [state.dirty])
    if (!enhancementId) return <main className="control-plane"><Alert status="critical" header="Enhancement missing" content="Open the workbench from an enhancement record so authority is unambiguous." /></main>
    if (!state.context) return <main className="control-plane"><Alert status={state.error ? 'critical' : 'info'} header={state.error ? 'Workbench unavailable' : 'Loading'} content={state.error || state.message} /></main>
    const editable = state.context.current_spec?.state === 'draft'
    return <main className="control-plane" aria-labelledby="workbench-title">
        <AuthorityRail context={state.context} />
        {state.error && <Alert status="critical" header="Action failed safely" content={state.error} />}
        <p className="status" role="status">{state.message}</p>
        <EditorPreview markdown={state.markdown} editable={editable} onChange={editable ? state.setMarkdown : () => undefined} />
        <ActionBar context={state.context} dirty={state.dirty} busy={state.busy} note={state.note} setNote={state.setNote} act={state.act} />
        <HistoryEvidence context={state.context} busy={state.busy} act={state.act} />
        <Modal opened={leaveWarning} headerLabel="Unsaved draft" content="Save the draft before leaving this page." footerActions={[{ label: 'Keep editing', variant: 'primary' }]} onFooterActionClicked={() => setLeaveWarning(false)} onOpenedSet={event => setLeaveWarning(event.detail.payload.value)} />
    </main>
}
