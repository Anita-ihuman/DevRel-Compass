import Link from 'next/link'
import UpgradeButton from '@/components/billing/UpgradeButton'
import { PLAN } from '@/lib/plan'

// Shown when an account has no analyses left. Two different situations land
// here, and they need opposite things: a free user needs a way to pay, a
// subscriber who has used their month needs to know when it resets.
type Props = {
  paid?: boolean
  limit?: number
  periodEnd?: string | null
}

export default function LimitReached({ paid = false, limit, periodEnd }: Props) {
  // Subscriber who has used their monthly quota — nothing to sell them.
  if (paid) {
    const resets = periodEnd
      ? new Date(periodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      : null
    return (
      <div className="credits-page">
        <div className="credits-header">
          <div className="credits-icon">✦</div>
          <h2 className="credits-title">You&apos;ve used this month&apos;s analyses</h2>
          <p className="credits-sub">
            {limit ? `All ${limit} analyses` : 'Your analyses'} in the current billing period
            are used up{resets ? `. Your quota resets on ${resets}` : ''}. Your saved
            analyses are still available on your profile.
          </p>
        </div>
        <Link href="/profile" className="retry-btn">View your saved analyses →</Link>
      </div>
    )
  }

  return (
    <div className="credits-page">
      <div className="credits-header">
        <div className="credits-icon">✦</div>
        <h2 className="credits-title">You&apos;ve used your 2 free analyses</h2>
        <p className="credits-sub">
          Subscribe to {PLAN.name} for {PLAN.price} a {PLAN.interval}: {PLAN.quota} analyses
          a month, plus a saved history of every analysis — including the ones you&apos;ve
          already run. The roadmap, playbook, events, and blog stay free.
        </p>
      </div>

      <UpgradeButton className="retry-btn" label={`Upgrade for ${PLAN.price}/${PLAN.interval}`} />

      <p className="credits-note">
        <Link href="/pricing">Compare plans</Link> · Payments are handled securely by Bachs.
      </p>
    </div>
  )
}
