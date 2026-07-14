import type { NextRequest } from 'next/server'

// On Vercel the client IP arrives in x-forwarded-for (first entry is the real
// client; the rest are proxies). Fall back to x-real-ip, then a constant so
// callers still function in local dev where no forwarding header is set.
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || '127.0.0.1'
}
