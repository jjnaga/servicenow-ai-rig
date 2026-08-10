import type { ControlContext, SpecView } from './types'

declare global { interface Window { g_ck?: string } }

const base = '/api/global/ai_control'

async function request<T>(path: string, method = 'GET', body?: object): Promise<T> {
    if (!window.g_ck) throw new Error('Your ServiceNow session token is unavailable. Reload the page from the Workspace.')
    const response = await fetch(base + path, {
        method,
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-UserToken': window.g_ck },
        body: body ? JSON.stringify(body) : undefined,
    })
    const payload = await response.json()
    const receipt = typeof payload?.result?.ok === 'boolean' ? payload.result : payload
    if (!response.ok || !receipt.ok) throw new Error(receipt?.error?.message || `Control API failed (${response.status}).`)
    return receipt.result as T
}

export const loadContext = (enhancementId: string) => request<ControlContext>(`/v1/enhancements/${encodeURIComponent(enhancementId)}/context`)
export const saveDraft = (specId: string, body: object) => request<SpecView>(`/v1/specs/${encodeURIComponent(specId)}`, 'PATCH', body)
export const specAction = (specId: string, action: string, body?: object) => request<object>(`/v1/specs/${encodeURIComponent(specId)}/${action}`, 'POST', body)
export const enhancementAction = (enhancementId: string, action: string) => request<object>(`/v1/enhancements/${encodeURIComponent(enhancementId)}/${action}`, 'POST')
