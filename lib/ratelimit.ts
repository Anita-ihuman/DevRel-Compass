import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Server-side analysis limiter (M1) ───────────────────────────────────────
// The client-side free counter (localStorage) is a soft nudge and trivially
// bypassed. This is the real ceiling on Anthropic token spend: a per-IP limit
// enforced before every paid Claude call.
//
// Tune the ceiling with RATE_LIMIT_PER_DAY (default 5). The window is a rolling
// day, so a bypassed client counter can burn at most this many analyses per IP
// per 24h.
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY ?? '5')

function pickEnv(match: (key: string) => boolean): string | undefined {
  const key = Object.keys(process.env).find(match)
  return key ? process.env[key] : undefined
}

// Resolve Upstash REST credentials from either:
//  1. the standard Upstash env vars (UPSTASH_REDIS_REST_URL / _TOKEN), or
//  2. the prefixed vars a Vercel Marketplace Redis/KV integration injects
//     (e.g. MYSTORE_KV_REST_API_URL / _TOKEN) — matched by suffix so any
//     store-name prefix works, and the read-only token is skipped since rate
//     limiting needs write access.
function resolveRedisCreds(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? pickEnv((k) => k.endsWith('KV_REST_API_URL'))
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    pickEnv((k) => k.endsWith('KV_REST_API_TOKEN') && !k.includes('READ_ONLY'))
  return url && token ? { url, token } : null
}

// If no credentials are found — local dev, or a deploy made before provisioning
// — the limiter is disabled and analysis is allowed, so shipping this code never
// breaks a running site.
const creds = resolveRedisCreds()

if (!creds && process.env.NODE_ENV === 'production') {
  console.warn(
    'Rate limiting disabled: no Upstash Redis credentials found. /api/analyze is unmetered.',
  )
}

const ratelimit = creds
  ? new Ratelimit({
      redis: new Redis({ url: creds.url, token: creds.token }),
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
