'use client'

import { useState } from 'react'

// Sends one issue to the whole confirmed list. This is irreversible, so it
// confirms first and reports exactly what happened rather than optimistically
// showing success.
export default function SendIssueButton({
  slug,
  title,
  recipients,
}: {
  slug: string
  title: string
  recipients: number
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function send() {
    const ok = window.confirm(
      `Send "${title}" to ${recipients} confirmed ${recipients === 1 ? 'subscriber' : 'subscribers'}?\n\nThis cannot be undone.`,
    )
    if (!ok) return

    setState('sending')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || `Send failed (${res.status})`)
      setState('sent')
      setMessage(
        `Sent to ${json.sent}${json.failed ? ` · ${json.failed} failed` : ''}. Reload to refresh.`,
      )
    } catch (e) {
      setState('error')
      setMessage(e instanceof Error ? e.message : 'Send failed.')
    }
  }

  return (
    <div className="admin-nl-send">
      <button
        className="profile-plan-link"
        onClick={send}
        disabled={state === 'sending' || state === 'sent' || recipients === 0}
      >
        {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Sent' : 'Send issue'}
      </button>
      {message && <p className="admin-cost-note" style={{ margin: '.5rem 0 0' }}>{message}</p>}
    </div>
  )
}
