import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from '@/lib/redis'

// ── Server-side analysis limiter (M1) ───────────────────────────────────────
// The client-side free counter (localStorage) is a soft nudge and trivially
// bypassed. This is the real ceiling on Anthropic token spend: a per-IP limit
// enforced before every paid Claude call.
//
// Tune the ceiling with RATE_LIMIT_PER_DAY (default 5). The window is a rolling
// day, so a bypassed client counter can burn at most this many analyses per IP
// per 24h.
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY ?? '5')

// If no Redis is configured — local dev, or a deploy made before provisioning —
// the limiter is disabled and analysis is allowed, so shipping this code never
// breaks a running site.
const redis = getRedis()

if (!redis && process.env.NODE_ENV === 'production') {
  console.warn(
    'Rate limiting disabled: no Upstash Redis credentials found. /api/analyze is unmetered.',
  )
}

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_DAY, '1 d'),
      prefix: 'analyze',
      analytics: false,
    })
  : null

export type RateLimitResult =
  | { enabled: false }
  | { enabled: true; success: boolean; remaining: number; limit: number; reset: number }

// Consumes one unit of the caller's allowance and reports whether it was within
// the limit. Fails open (returns `{ enabled: false }`) if Redis is unreachable —
// a limiter outage must not take analysis down.
export async function consumeAnalysisLimit(identifier: string): Promise<RateLimitResult> {
  if (!ratelimit) return { enabled: false }
  try {
    const { success, remaining, limit, reset } = await ratelimit.limit(identifier)
    return { enabled: true, success, remaining, limit, reset }
  } catch (e) {
    console.error(
      'Rate limit check failed; allowing request:',
      e instanceof Error ? e.message : e,
    )
    return { enabled: false }
  }
}
