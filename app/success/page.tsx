'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const TOTAL_KEY  = 'devrel_total_credits'
const FREE_LIMIT = 3

// Credits granted per plan (keep in sync with the checkout route + CreditsScreen)
const PLAN_CREDITS: Record<string, number> = {
  monthly: 25,
}

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus]   = useState<'success' | 'error'>('success')
  const [credits, setCredits] = useState(0)
  const [error, setError]     = useState('')
  const granted = useRef(false)

  useEffect(() => {
    // Guard against double-granting from React StrictMode's double-invoke.
    if (granted.current) return

    const plan = params.get('plan')

    // No plan param (e.g. a refresh after we strip it below) — nothing to grant.
    if (!plan) return

    const amount = PLAN_CREDITS[plan]
    if (amount === undefined) {
      setError('Unrecognized plan.')
      setStatus('error')
      return
    }

    granted.current = true
    const current = parseInt(localStorage.getItem(TOTAL_KEY) ?? String(FREE_LIMIT), 10)
    localStorage.setItem(TOTAL_KEY, String(current + amount))
    setCredits(amount)

    // Strip the query param so a page refresh doesn't grant credits again.
    window.history.replaceState({}, '', '/success')

    const t = setTimeout(() => router.push('/'), 3000)
    return () => clearTimeout(t)
  }, [params, router])

  if (status === 'error') return (
    <div className="success-screen">
      <div className="err-icon">⚠</div>
      <h2 className="err-title">Something went wrong</h2>
      <p className="err-hint">{error}</p>
      <button className="retry-btn" onClick={() => router.push('/')}>Go Home</button>
    </div>
  )

  return (
    <div className="success-screen">
      <div className="success-icon">✓</div>
      <h2 className="success-title">Payment confirmed!</h2>
      <p className="success-msg">
        {credits > 0
          ? `${credits} analyses have been added to your account.`
          : 'Your subscription is active.'}
      </p>
      <p className="success-redirect">Redirecting you back in a moment…</p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
