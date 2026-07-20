import { createHash } from 'crypto'
import { pool } from '@/lib/db'
import { getRedis } from '@/lib/redis'
import type { AnalysisResult } from '@/types'

// Free-analysis allowances (M2). M3 will replace the account limit with a
// subscription-based monthly quota.
export const ANON_FREE_LIMIT = 1
export const ACCOUNT_FREE_LIMIT = 2

// Saved history is a paid perk. Any non-'free' plan unlocks it (M3 sets the plan
// via Lemon Squeezy webhooks).
export function isPaidPlan(plan: string | null | undefined): boolean {
  return Boolean(plan) && plan !== 'free'
}

// ── Signed-in account usage ─────────────────────────────────────────────────
export async function getAccountUsage(userId: string): Promise<number> {
  const { rows } = await pool.query('SELECT analyses_used FROM usage WHERE "userId" = $1', [userId])
  return rows[0]?.analyses_used ?? 0
}

export async function incrementAccountUsage(userId: string): Promise<void> {
  await pool.query(
    `INSERT INTO usage ("userId", analyses_used) VALUES ($1, 1)
     ON CONFLICT ("userId") DO UPDATE SET analyses_used = usage.analyses_used + 1`,
    [userId],
  )
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
