import { pool } from '@/lib/db'

// One row per successful analysis, powering the admin dashboard. user_id is null
// for anonymous analyses.
export async function logAnalysisEvent(userId: string | null): Promise<void> {
  await pool.query('INSERT INTO analysis_events (user_id, signed_in) VALUES ($1, $2)', [
    userId,
    userId != null,
  ])
}

export type DailyPoint = { day: string; total: number; auth: number; anon: number }

export type AdminMetrics = {
  total: number
  today: number
  last7: number
  last30: number
  anon7: number
  auth7: number
  uniqueUsers7: number
  uniqueUsers30: number
  daily: DailyPoint[]
  recent: { signed_in: boolean; user_id: number | null; created_at: string }[]
}

const n = (v: unknown) => Number(v ?? 0)

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const [totals, splits, uniq, daily, recent] = await Promise.all([
    pool.query(`SELECT
        count(*) AS total,
        count(*) FILTER (WHERE created_at >= date_trunc('day', now())) AS today,
        count(*) FILTER (WHERE created_at >= now() - interval '7 days')  AS last7,
        count(*) FILTER (WHERE created_at >= now() - interval '30 days') AS last30
      FROM analysis_events`),
    pool.query(`SELECT
        count(*) FILTER (WHERE NOT signed_in) AS anon7,
        count(*) FILTER (WHERE signed_in)     AS auth7
      FROM analysis_events WHERE created_at >= now() - interval '7 days'`),
    pool.query(`SELECT
        count(DISTINCT user_id) FILTER (WHERE created_at >= now() - interval '7 days')  AS u7,
        count(DISTINCT user_id) FILTER (WHERE created_at >= now() - interval '30 days') AS u30
      FROM analysis_events WHERE signed_in`),
    pool.query(`SELECT
        to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
        count(*) AS total,
        count(*) FILTER (WHERE signed_in)     AS auth,
        count(*) FILTER (WHERE NOT signed_in) AS anon
      FROM analysis_events
      WHERE created_at >= now() - interval '13 days'
      GROUP BY day ORDER BY day`),
    pool.query(
      `SELECT signed_in, user_id, created_at FROM analysis_events ORDER BY created_at DESC LIMIT 20`,
    ),
  ])

  const t = totals.rows[0]
  const s = splits.rows[0]
  const u = uniq.rows[0]

  // Fill the last 14 days so the chart has no gaps.
  const byDay = new Map<string, DailyPoint>()
  for (const r of daily.rows) {
    byDay.set(r.day, { day: r.day, total: n(r.total), auth: n(r.auth), anon: n(r.anon) })
  }
  const series: DailyPoint[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    series.push(byDay.get(key) ?? { day: key, total: 0, auth: 0, anon: 0 })
  }

  return {
    total: n(t.total),
    today: n(t.today),
    last7: n(t.last7),
    last30: n(t.last30),
    anon7: n(s.anon7),
    auth7: n(s.auth7),
    uniqueUsers7: n(u.u7),
    uniqueUsers30: n(u.u30),
    daily: series,
    recent: recent.rows as AdminMetrics['recent'],
  }
}
