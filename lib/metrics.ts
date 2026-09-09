import { pool } from '@/lib/db'
import { analysisCostUsd, type TokenUsage } from '@/lib/pricing'

// One row per successful analysis, powering the admin dashboard. user_id is null
// for anonymous analyses.
//
// Token usage is recorded alongside so cost per analysis is measured rather than
// estimated — that number sets the monthly quota and the price (M3). Usage is
// optional: an analysis that somehow lands without it still counts toward volume.
export async function logAnalysisEvent(
  userId: string | null,
  usage?: TokenUsage,
): Promise<void> {
  await pool.query(
    `INSERT INTO analysis_events
       (user_id, signed_in, input_tokens, output_tokens, cache_read_tokens,
        cache_write_tokens, cost_usd)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      userId != null,
      usage?.input ?? null,
      usage?.output ?? null,
      usage?.cacheRead ?? null,
      usage?.cacheWrite ?? null,
      usage ? analysisCostUsd(usage) : null,
    ],
  )
}

export type DailyPoint = { day: string; total: number; auth: number; anon: number }

// Measured Anthropic spend. `priced` is how many analyses carry token data —
// rows logged before instrumentation have none, so averages are taken over
// `priced`, not over every event.
export type CostMetrics = {
  priced: number
  avgUsd: number
  medianUsd: number
  p90Usd: number
  spend30Usd: number
  spendAllUsd: number
  avgInputTokens: number
  avgOutputTokens: number
  cacheHitRate: number
}

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
  cost: CostMetrics
}

const n = (v: unknown) => Number(v ?? 0)

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const [totals, splits, uniq, daily, recent, cost] = await Promise.all([
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
    // Percentiles matter more than the mean here: a resume with a job
    // description costs noticeably more than one without, so the quota has to
    // clear the expensive end, not the average.
    pool.query(`SELECT
        count(*)                                                       AS priced,
        coalesce(avg(cost_usd), 0)                                     AS avg_usd,
        coalesce(percentile_cont(0.5) WITHIN GROUP (ORDER BY cost_usd::float8), 0) AS median_usd,
        coalesce(percentile_cont(0.9) WITHIN GROUP (ORDER BY cost_usd::float8), 0) AS p90_usd,
        coalesce(sum(cost_usd) FILTER (WHERE created_at >= now() - interval '30 days'), 0) AS spend30,
        coalesce(sum(cost_usd), 0)                                     AS spend_all,
        coalesce(avg(input_tokens), 0)                                 AS avg_in,
        coalesce(avg(output_tokens), 0)                                AS avg_out,
        coalesce(sum(cache_read_tokens), 0)                            AS cache_read,
        coalesce(sum(cache_read_tokens) + sum(cache_write_tokens) + sum(input_tokens), 0) AS prompt_total
      FROM analysis_events WHERE cost_usd IS NOT NULL`),
  ])

  const t = totals.rows[0]
  const s = splits.rows[0]
  const u = uniq.rows[0]
  const c = cost.rows[0]

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
    cost: {
      priced: n(c.priced),
      avgUsd: n(c.avg_usd),
      medianUsd: n(c.median_usd),
      p90Usd: n(c.p90_usd),
      spend30Usd: n(c.spend30),
      spendAllUsd: n(c.spend_all),
      avgInputTokens: Math.round(n(c.avg_in)),
      avgOutputTokens: Math.round(n(c.avg_out)),
      cacheHitRate: n(c.prompt_total) > 0 ? n(c.cache_read) / n(c.prompt_total) : 0,
    },
  }
}
