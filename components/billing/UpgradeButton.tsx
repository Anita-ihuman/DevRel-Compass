'use client'

import { useState } from 'react'

// Sends the user to the Bachs hosted checkout. The checkout is created
// server-side (/api/checkout) so the user id rides along as the reference and
// the webhook knows which account to upgrade.
export default function UpgradeButton({
  label = 'Upgrade',
  className = 'profile-plan-link',
}: {
  label?: string
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function upgrade() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error || "We couldn't start checkout. Please try again.")
      }
      window.location.href = json.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't start checkout. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button className={className} onClick={upgrade} disabled={loading}>
        {loading ? 'Starting checkout…' : `${label} →`}
      </button>
      {error && <p className="profile-plan-note">{error}</p>}
    </div>
  )
}
