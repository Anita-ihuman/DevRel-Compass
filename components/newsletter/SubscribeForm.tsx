'use client'

import { useState } from 'react'

// Newsletter signup. Success always says "check your inbox" rather than
// "you're subscribed", because nothing is confirmed until the emailed link is
// clicked — and it says the same thing for an address already on the list, so
// the form can't be used to probe who has subscribed.
export default function SubscribeForm({ source = 'newsletter-page' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setError('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.')
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="nl-form-done">
        <strong>Check your inbox.</strong> We&apos;ve sent a confirmation link — click it
        and you&apos;re on the list.
      </div>
    )
  }

  return (
    <form className="nl-form" onSubmit={submit}>
      <div className="nl-form-row">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          className="nl-input"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === 'loading'}
        />
        <button className="nl-submit" type="submit" disabled={state === 'loading'}>
          {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {error && <p className="nl-form-error">{error}</p>}
      <p className="nl-form-note">
        Free. No spam, unsubscribe in one click.
      </p>
    </form>
  )
}
