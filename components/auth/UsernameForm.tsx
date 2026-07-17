'use client'

import { useActionState } from 'react'
import { saveUsername, type UsernameState } from '@/app/onboarding/actions'

export default function UsernameForm() {
  const [state, action, pending] = useActionState<UsernameState, FormData>(saveUsername, null)

  return (
    <form action={action} className="auth-form">
      <div className="auth-username">
        <span className="auth-at">@</span>
        <input
          name="username"
          required
          placeholder="yourname"
          className="auth-input auth-input--username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          pattern="[a-zA-Z0-9_]{3,30}"
        />
      </div>
      <button type="submit" className="auth-btn" disabled={pending}>
        {pending ? 'Saving…' : 'Continue'}
      </button>
      {state?.error && <p className="auth-error">{state.error}</p>}
    </form>
  )
}
