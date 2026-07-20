import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAdminMetrics } from '@/lib/metrics'

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

  const m = await getAdminMetrics()
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

      <h2 className="admin-section">Recent activity</h2>
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
