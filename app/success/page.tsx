'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const TOTAL_KEY  = 'devrel_total_credits'
const FREE_LIMIT = 3

function SuccessContent() {
  const params    = useSearchParams()
  const router    = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [credits, setCredits] = useState(0)
  const [error, setError]    = useState('')

  useEffect(() => {
    const sessionId = params.get('session_id')
    const plan      = params.get('plan')

    if (!sessionId || !plan) {
      setError('Missing payment information.')
      setStatus('error')
      return
    }

    fetch(`/api/verify-payment?session_id=${sessionId}&plan=${plan}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        const current = parseInt(localStorage.getItem(TOTAL_KEY) ?? String(FREE_LIMIT), 10)
        localStorage.setItem(TOTAL_KEY, String(current + json.credits))
        setCredits(json.credits)
        setStatus('success')
        setTimeout(() => router.push('/'), 3000)
      })
      .catch(e => {
        setError(e.message)
        setStatus('error')
      })
  }, [params, router])

  if (status === 'verifying') return (
    <div className="success-screen">
      <div className="success-spinner" />
      <p className="success-msg">Verifying your payment…</p>
    </div>
  )

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
        {credits === 999
          ? 'Unlimited analyses unlocked.'
          : `${credits} analyses have been added to your account.`}
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
