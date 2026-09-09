import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAdminMetrics } from '@/lib/metrics'
import { formatUsd } from '@/lib/pricing'
import { PAID_MONTHLY_QUOTA } from '@/lib/usage'
import { getSubscriberCounts, getSentIssues } from '@/lib/subscribers'
import { getAllIssuesIncludingDrafts, formatIssueDate } from '@/lib/newsletter'
import SendIssueButton from '@/components/newsletter/SendIssueButton'

export const metadata: Metadata = {
  title: 'Admin · Metrics',
  robots: { index: false },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function AdminPage() {
  const session = await auth()
  // Private: anyone not on the admin allowlist gets a 404 (doesn't reveal it).
  if (!session?.user?.isAdmin) notFound()

  const [m, subscribers, sentIssues] = await Promise.all([
    getAdminMetrics(),
    getSubscriberCounts(),
    getSentIssues(),
  ])
  const issues = getAllIssuesIncludingDrafts()
  const maxDay = Math.max(1, ...m.daily.map((d) => d.total))

  const stats = [
    { label: 'Today', value: m.today },
    { label: 'Last 7 days', value: m.last7 },
    { label: 'Last 30 days', value: m.last30 },
    { label: 'All time', value: m.total },
  ]

  return (
    <div className="admin-wrap">
      <h1 className="admin-title">Metrics</h1>
      <p className="admin-sub">Successful resume analyses across the site.</p>

      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat">
            <div className="admin-stat-value">{s.value.toLocaleString()}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-cols">
        <div className="admin-stat admin-stat--wide">
          <div className="admin-stat-label">Last 7 days — signed-in vs anonymous</div>
          <div className="admin-split">
            <span><b>{m.auth7.toLocaleString()}</b> signed-in</span>
            <span><b>{m.anon7.toLocaleString()}</b> anonymous</span>
          </div>
        </div>
        <div className="admin-stat admin-stat--wide">
          <div className="admin-stat-label">Unique signed-in users</div>
          <div className="admin-split">
            <span><b>{m.uniqueUsers7.toLocaleString()}</b> in 7d</span>
            <span><b>{m.uniqueUsers30.toLocaleString()}</b> in 30d</span>
          </div>
        </div>
      </div>

      <h2 className="admin-section">Anthropic cost</h2>
      {m.cost.priced === 0 ? (
        <p className="admin-cost-note">
          No analyses have recorded token usage yet. Cost is captured from each
          Claude response, so this fills in as analyses run.
        </p>
      ) : (
        <>
          <div className="admin-cost">
            <div className="admin-stat">
              <div className="admin-stat-value">{formatUsd(m.cost.avgUsd)}</div>
              <div className="admin-stat-label">Avg per analysis</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{formatUsd(m.cost.medianUsd)}</div>
              <div className="admin-stat-label">Median</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{formatUsd(m.cost.p90Usd)}</div>
              <div className="admin-stat-label">p90</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{formatUsd(m.cost.spend30Usd)}</div>
              <div className="admin-stat-label">Spend, 30 days</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{formatUsd(m.cost.spendAllUsd)}</div>
              <div className="admin-stat-label">Spend, all time</div>
            </div>
            <div className="admin-stat">
              <div className="admin-stat-value">{Math.round(m.cost.cacheHitRate * 100)}%</div>
              <div className="admin-stat-label">Prompt cache hit rate</div>
            </div>
          </div>
          <p className="admin-cost-note">
            Measured over {m.cost.priced.toLocaleString()}{' '}
            {m.cost.priced === 1 ? 'analysis' : 'analyses'} · avg{' '}
            {m.cost.avgInputTokens.toLocaleString()} in /{' '}
            {m.cost.avgOutputTokens.toLocaleString()} out tokens.
            <br />
            A full month at the current quota of {PAID_MONTHLY_QUOTA} costs{' '}
            <b>{formatUsd(m.cost.avgUsd * PAID_MONTHLY_QUOTA)}</b> at the average and{' '}
            <b>{formatUsd(m.cost.p90Usd * PAID_MONTHLY_QUOTA)}</b> at p90 — price the plan
            above the p90 figure, since a subscriber who uses their whole quota is the
            case that has to stay profitable.
          </p>
        </>
      )}

      <h2 className="admin-section">Daily analyses (14 days)</h2>
      <div className="admin-chart">
        {m.daily.map((d) => (
          <div key={d.day} className="admin-bar-col" title={`${d.day}: ${d.total} (${d.auth} signed-in, ${d.anon} anon)`}>
            <div className="admin-bar-count">{d.total || ''}</div>
            <div className="admin-bar" style={{ height: `${(d.total / maxDay) * 100}%` }}>
              <div className="admin-bar-auth" style={{ height: d.total ? `${(d.auth / d.total) * 100}%` : '0%' }} />
            </div>
            <div className="admin-bar-day">{d.day.slice(5)}</div>
          </div>
        ))}
      </div>
      <div className="admin-legend">
        <span><i className="admin-dot admin-dot--auth" /> signed-in</span>
        <span><i className="admin-dot admin-dot--anon" /> anonymous</span>
      </div>

      <h2 className="admin-section">Newsletter</h2>
      <div className="admin-cost">
        <div className="admin-stat">
          <div className="admin-stat-value">{subscribers.confirmed.toLocaleString()}</div>
          <div className="admin-stat-label">Confirmed</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{subscribers.pending.toLocaleString()}</div>
          <div className="admin-stat-label">Pending confirmation</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{subscribers.unsubscribed.toLocaleString()}</div>
          <div className="admin-stat-label">Unsubscribed</div>
        </div>
      </div>

      {issues.length === 0 ? (
        <p className="admin-cost-note">
          No issues written yet. Add a markdown file in <b>content/newsletter/</b> to
          create one.
        </p>
      ) : (
        <ul className="admin-nl-list">
          {issues.map((i) => {
            const sent = sentIssues[i.meta.slug]
            return (
              <li key={i.meta.slug} className="admin-nl-item">
                <div>
                  <div className="admin-nl-title">
                    Issue {String(i.meta.issue).padStart(2, '0')} · {i.meta.title}
                  </div>
                  <div className="admin-nl-meta">
                    {i.meta.draft
                      ? 'Draft — not published, cannot be sent'
                      : sent
                        ? `Sent to ${sent.recipients} on ${formatIssueDate(sent.sentAt.slice(0, 10))}`
                        : `Published ${formatIssueDate(i.meta.date)} · not yet sent`}
                  </div>
                </div>
                {!i.meta.draft && !sent && (
                  <SendIssueButton
                    slug={i.meta.slug}
                    title={i.meta.title}
                    recipients={subscribers.confirmed}
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}

      <h2 className="admin-section" style={{ marginTop: '2.5rem' }}>Recent activity</h2>
      {m.recent.length === 0 ? (
        <p className="admin-empty">No analyses yet.</p>
      ) : (
        <ul className="admin-recent">
          {m.recent.map((r, i) => (
            <li key={i} className="admin-recent-item">
              <span>{r.signed_in ? `Signed-in · user #${r.user_id}` : 'Anonymous'}</span>
              <span className="admin-recent-time">{timeAgo(r.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
