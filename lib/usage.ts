import { createHash } from 'crypto'
import { pool } from '@/lib/db'
import { getRedis } from '@/lib/redis'
import { PLAN } from '@/lib/plan'
import type { AnalysisResult } from '@/types'

// Free-analysis allowances (M2): one anonymous, then a couple more per account.
// Past those, an account needs a subscription (M3).
export const ANON_FREE_LIMIT = 1
export const ACCOUNT_FREE_LIMIT = 2

// Analyses included in the paid plan each billing month. Lives in lib/plan.ts
// alongside the price, because the two only make sense together — quota x cost
// per analysis is the floor the price has to clear (/admin shows the measured
// cost and does that multiplication for you).
export const PAID_MONTHLY_QUOTA = PLAN.quota

// Saved history is a paid perk. Any non-'free' plan unlocks it (M3 sets the plan
// via Lemon Squeezy webhooks).
export function isPaidPlan(plan: string | null | undefined): boolean {
  return Boolean(plan) && plan !== 'free'
}

// ── Signed-in account usage ─────────────────────────────────────────────────
// Reading usage on its own is never enough to decide anything — how many runs
// someone has left depends on their plan too. getEntitlement below is the
// read path; this is only the write.
export async function incrementAccountUsage(userId: string): Promise<void> {
  await pool.query(
    `INSERT INTO usage ("userId", analyses_used) VALUES ($1, 1)
     ON CONFLICT ("userId") DO UPDATE SET analyses_used = usage.analyses_used + 1`,
    [userId],
  )
}

// ── Entitlement: what one account is allowed to do right now ────────────────
// One place decides this, so /api/analyze, /api/usage, and the profile page can
// never disagree about whether someone has runs left.
export type Entitlement = {
  /** 'free' or the paid plan name from Lemon Squeezy. */
  plan: string
  /** True while the subscription still entitles them to the paid quota. */
  paid: boolean
  /** Lemon Squeezy status — active, past_due, cancelled, expired, … */
  status: string | null
  used: number
  limit: number
  remaining: number
  /** When the current paid period ends (also when a cancellation takes effect). */
  periodEnd: string | null
  /** Lemon Squeezy's hosted page for updating a card or cancelling. */
  portalUrl: string | null
}

type UserBillingRow = {
  plan: string | null
  plan_status: string | null
  current_period_end: Date | null
  monthly_quota: number | null
  ls_portal_url: string | null
  analyses_used: number | null
  period_start: Date | null
}

// A subscription entitles you to the quota until the paid period runs out —
// including after a cancellation, which is what the customer already paid for.
// A failed payment is the same: Lemon Squeezy retries during the period, and if
// it never succeeds the subscription expires on its own.
function isWithinPaidPeriod(row: UserBillingRow): boolean {
  if (!isPaidPlan(row.plan)) return false
  if (row.plan_status === 'expired' || row.plan_status === 'unpaid') return false
  return row.current_period_end != null && row.current_period_end.getTime() > Date.now()
}

export async function getEntitlement(userId: string): Promise<Entitlement> {
  const { rows } = await pool.query(
    `SELECT u.plan, u.plan_status, u.current_period_end, u.monthly_quota, u.ls_portal_url,
            g.analyses_used, g.period_start
       FROM users u LEFT JOIN usage g ON g."userId" = u.id
      WHERE u.id = $1`,
    [userId],
  )

  const row: UserBillingRow = rows[0] ?? {
    plan: 'free',
    plan_status: null,
    current_period_end: null,
    monthly_quota: null,
    ls_portal_url: null,
    analyses_used: 0,
    period_start: null,
  }

  const paid = isWithinPaidPeriod(row)
  let used = row.analyses_used ?? 0

  // Roll the counter over when a new billing month has started. The webhook
  // resets on payment, so this is the self-healing path for a webhook that was
  // missed or arrived out of order — it derives the period start from the
  // renewal date rather than trusting that a reset ever ran.
  if (paid && row.current_period_end && row.period_start) {
    const reset = await pool.query(
      `UPDATE usage
          SET analyses_used = 0, period_start = ($2::timestamptz - interval '1 month')
        WHERE "userId" = $1 AND period_start < ($2::timestamptz - interval '1 month')
        RETURNING analyses_used`,
      [userId, row.current_period_end.toISOString()],
    )
    if (reset.rowCount) used = 0
  }

  const limit = paid ? (row.monthly_quota ?? PAID_MONTHLY_QUOTA) : ACCOUNT_FREE_LIMIT

  return {
    plan: row.plan ?? 'free',
    paid,
    status: row.plan_status,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    periodEnd: row.current_period_end?.toISOString() ?? null,
    portalUrl: row.ls_portal_url,
  }
}

// ── Subscription state (written by the Lemon Squeezy webhook) ───────────────
export type SubscriptionUpdate = {
  plan: string
  status: string | null
  subscriptionId: string | null
  customerId: string | null
  portalUrl: string | null
  currentPeriodEnd: string | null
  monthlyQuota: number | null
}

export async function applySubscription(
  userId: string,
  sub: SubscriptionUpdate,
): Promise<void> {
  await pool.query(
    `UPDATE users
        SET plan = $2,
            plan_status = $3,
            ls_subscription_id = COALESCE($4, ls_subscription_id),
            ls_customer_id = COALESCE($5, ls_customer_id),
            ls_portal_url = COALESCE($6, ls_portal_url),
            current_period_end = COALESCE($7::timestamptz, current_period_end),
            monthly_quota = COALESCE($8, monthly_quota)
      WHERE id = $1`,
    [
      userId,
      sub.plan,
      sub.status,
      sub.subscriptionId,
      sub.customerId,
      sub.portalUrl,
      sub.currentPeriodEnd,
      sub.monthlyQuota,
    ],
  )
}

// Starts a fresh quota month. Called when a billing period is paid for, so the
// customer gets their full allowance from the moment the payment lands.
export async function startNewUsagePeriod(userId: string): Promise<void> {
  await pool.query(
    `INSERT INTO usage ("userId", analyses_used, period_start) VALUES ($1, 0, now())
     ON CONFLICT ("userId") DO UPDATE SET analyses_used = 0, period_start = now()`,
    [userId],
  )
}

// Resolve the account a webhook belongs to, most reliable identifier first.
// custom_data carries the user id we put on the checkout, so it's authoritative.
// The subscription id covers renewal and payment events, which don't echo
// custom_data. Email is the last resort — it also catches a subscription created
// by hand in the Lemon Squeezy admin, outside our checkout flow.
export async function findUserForWebhook(opts: {
  customUserId?: string
  subscriptionId?: string
  email?: string
}): Promise<string | null> {
  // The id column is an integer; a non-numeric custom value would error the query.
  if (opts.customUserId && /^\d+$/.test(opts.customUserId)) {
    const { rows } = await pool.query('SELECT id FROM users WHERE id = $1', [opts.customUserId])
    if (rows[0]) return String(rows[0].id)
  }
  if (opts.subscriptionId) {
    const { rows } = await pool.query('SELECT id FROM users WHERE ls_subscription_id = $1', [
      opts.subscriptionId,
    ])
    if (rows[0]) return String(rows[0].id)
  }
  if (opts.email) {
    const { rows } = await pool.query('SELECT id FROM users WHERE lower(email) = lower($1)', [
      opts.email,
    ])
    if (rows[0]) return String(rows[0].id)
  }
  return null
}

// ── Saved analysis history ──────────────────────────────────────────────────
export async function saveAnalysis(
  userId: string,
  result: AnalysisResult,
  hasJobFit: boolean,
): Promise<void> {
  await pool.query(
    `INSERT INTO analyses
       ("userId", candidate_name, overall_score, career_level, has_job_fit, result)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      userId,
      result.candidateName ?? null,
      result.overallScore ?? null,
      result.careerLevel ?? null,
      hasJobFit,
      JSON.stringify(result),
    ],
  )
}

export type AnalysisSummary = {
  id: number
  candidate_name: string | null
  overall_score: number | null
  career_level: string | null
  has_job_fit: boolean
  createdAt: string
}

export async function getUserAnalyses(userId: string): Promise<AnalysisSummary[]> {
  const { rows } = await pool.query(
    `SELECT id, candidate_name, overall_score, career_level, has_job_fit, "createdAt"
     FROM analyses WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
    [userId],
  )
  return rows as AnalysisSummary[]
}

export async function getAnalysisById(
  userId: string,
  id: string,
): Promise<{ result: AnalysisResult; has_job_fit: boolean; createdAt: string } | null> {
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) return null
  const { rows } = await pool.query(
    `SELECT result, has_job_fit, "createdAt" FROM analyses WHERE id = $1 AND "userId" = $2`,
    [numericId, userId],
  )
  const row = rows[0]
  if (!row) return null
  // jsonb usually parses to an object, but coerce defensively.
  const result = typeof row.result === 'string' ? JSON.parse(row.result) : row.result
  return { result, has_job_fit: row.has_job_fit, createdAt: row.createdAt }
}

// ── Anonymous usage (by hashed IP, in Redis) ────────────────────────────────
function anonKey(ip: string): string {
  return `anon:uses:${createHash('sha256').update(ip).digest('hex').slice(0, 16)}`
}

export async function getAnonUses(ip: string): Promise<number> {
  const redis = getRedis()
  if (!redis) return 0
  const v = await redis.get<number>(anonKey(ip))
  return v ?? 0
}

export async function incrementAnonUses(ip: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  const key = anonKey(ip)
  const n = await redis.incr(key)
  // First use starts a 30-day window for the free-trial counter.
  if (n === 1) await redis.expire(key, 60 * 60 * 24 * 30)
}
