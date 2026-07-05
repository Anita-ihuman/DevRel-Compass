'use client'

import { useState } from 'react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$5',
    period: 'one-time',
    credits: 10,
    description: 'Perfect for a job search sprint',
    features: ['10 resume analyses', 'Full skill breakdown', 'Growth roadmap', 'Job fit scoring'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$15',
    period: 'one-time',
    credits: 30,
    description: 'Best value for ongoing career growth',
    features: ['30 resume analyses', 'Full skill breakdown', 'Growth roadmap', 'Job fit scoring', 'Priority support'],
    popular: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '$12',
    period: 'per month',
    credits: 999,
    description: 'For teams and power users',
    features: ['Unlimited analyses', 'Full skill breakdown', 'Growth roadmap', 'Job fit scoring', 'Priority support', 'Early access to new features'],
    popular: false,
  },
]

export default function CreditsScreen() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleCheckout(planId: string) {
    setLoading(planId)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Checkout failed')
      window.location.href = json.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <div className="credits-page">
      <div className="credits-header">
        <div className="credits-icon">✦</div>
        <h2 className="credits-title">You've used your 3 free analyses</h2>
        <p className="credits-sub">
          Choose a plan to continue analyzing resumes and unlocking your DevRel career insights.
        </p>
      </div>

      {error && <p className="credits-error">{error}</p>}

      <div className="pricing-grid">
        {PLANS.map(plan => (
          <div key={plan.id} className={`pricing-card${plan.popular ? ' pricing-card--popular' : ''}`}>
            {plan.popular && <div className="pricing-badge">Most Popular</div>}
            <div className="pricing-top">
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-amount">
                <span className="pricing-price">{plan.price}</span>
                <span className="pricing-period">/{plan.period}</span>
              </div>
              <p className="pricing-desc">{plan.description}</p>
            </div>
            <ul className="pricing-features">
              {plan.features.map(f => (
                <li key={f} className="pricing-feature">
                  <span className="feature-check">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              className={`pricing-btn${plan.popular ? ' pricing-btn--accent' : ''}`}
              onClick={() => handleCheckout(plan.id)}
              disabled={loading !== null}
            >
              {loading === plan.id ? 'Redirecting…' : `Get ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <p className="credits-footer">
        Payments are processed securely by Stripe. Cancel anytime.
      </p>
    </div>
  )
}
