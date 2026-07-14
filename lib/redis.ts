import { Redis } from '@upstash/redis'

function pickEnv(match: (key: string) => boolean): string | undefined {
  const key = Object.keys(process.env).find(match)
  return key ? process.env[key] : undefined
}

// Resolve Upstash REST credentials from either the standard Upstash env vars
// (UPSTASH_REDIS_REST_URL / _TOKEN) or the prefixed vars a Vercel Marketplace
// Redis/KV integration injects (e.g. MYSTORE_KV_REST_API_URL / _TOKEN) — matched
// by suffix so any store-name prefix works, and the read-only token is skipped
// since we need write access.
function resolveRedisCreds(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? pickEnv((k) => k.endsWith('KV_REST_API_URL'))
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    pickEnv((k) => k.endsWith('KV_REST_API_TOKEN') && !k.includes('READ_ONLY'))
  return url && token ? { url, token } : null
}

let cached: Redis | null | undefined

// Shared Upstash Redis client, or null when no credentials are configured (local
// dev / pre-provisioning) so callers can degrade gracefully instead of crashing.
export function getRedis(): Redis | null {
  if (cached !== undefined) return cached
  const creds = resolveRedisCreds()
  cached = creds ? new Redis({ url: creds.url, token: creds.token }) : null
  return cached
}
