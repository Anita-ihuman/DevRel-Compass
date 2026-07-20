import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { getUserAnalyses, getAccountUsage, ACCOUNT_FREE_LIMIT, isPaidPlan } from '@/lib/usage'

export const metadata: Metadata = {
  title: 'Your profile',
  robots: { index: false },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/signin')
  if (!session.user.username) redirect('/onboarding')

  const paid = isPaidPlan(session.user.plan)
  const [analyses, used] = await Promise.all([
    // Only load history for paid users — it's a paid perk.
    paid ? getUserAnalyses(session.user.id) : Promise.resolve([]),
    getAccountUsage(session.user.id),
  ])
  const remaining = Math.max(0, ACCOUNT_FREE_LIMIT - used)

  return (
    <div className="profile-wrap">
      <header className="profile-head">
        <div className="profile-avatar">{session.user.username.slice(0, 1).toUpperCase()}</div>
        <div>
          <h1 className="profile-name">@{session.user.username}</h1>
          {session.user.email && <p className="profile-email">{session.user.email}</p>}
        </div>
      </header>

      <p className="profile-quota">
        {remaining} free {remaining === 1 ? 'analysis' : 'analyses'} remaining
      </p>

      <h2 className="profile-section">Your analyses</h2>

      {!paid ? (
        <div className="profile-locked">
          <div className="profile-lock-icon">🔒</div>
          <h3 className="profile-lock-title">Saved history is a paid feature</h3>
          <p className="profile-lock-sub">
            Upgrade to keep a saved history of every analysis and revisit them anytime.
            Your past analyses are already saved — they&apos;ll appear here the moment you
            upgrade. Paid plans are coming soon.
          </p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="profile-empty">
          <p>You haven&apos;t run any analyses yet.</p>
          <Link href="/" className="retry-btn">Analyze your resume →</Link>
        </div>
      ) : (
        <ul className="profile-list">
          {analyses.map((a) => (
            <li key={a.id}>
              <Link href={`/profile/analyses/${a.id}`} className="profile-item">
                <div className="profile-item-main">
                  <span className="profile-item-name">{a.candidate_name || 'Resume analysis'}</span>
                  <span className="profile-item-meta">
                    {a.career_level ?? ''}
                    {a.has_job_fit ? ' · Job fit' : ''}
                  </span>
                </div>
                <div className="profile-item-right">
                  {a.overall_score != null && (
                    <span className="profile-item-score">{a.overall_score}</span>
                  )}
                  <span className="profile-item-date">{formatDate(a.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
