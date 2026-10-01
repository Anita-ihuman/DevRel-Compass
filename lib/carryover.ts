import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { claimPendingAnalysis } from '@/lib/usage'

// An anonymous visitor's free analysis is held server-side (pending_analyses)
// and this cookie remembers which one is theirs. When they sign in, the
// analysis moves into their account: it shows in their history and counts as
// one of their two free analyses.
export const CARRYOVER_COOKIE = 'dc_pending_analysis'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function setCarryoverCookie(res: NextResponse, token: string): void {
  res.cookies.set(CARRYOVER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export function clearCarryoverCookie(res: NextResponse): void {
  res.cookies.delete(CARRYOVER_COOKIE)
}

// Claims this browser's pending analysis for the account, if there is one.
// Safe to call on every request: a token can only be claimed once, so a cookie
// left behind (server components can't delete cookies) is a harmless no-op.
// Returns whether a cookie was present, so route handlers know to clear it.
export async function claimCarryover(userId: string): Promise<boolean> {
  const token = (await cookies()).get(CARRYOVER_COOKIE)?.value
  if (!token) return false
  try {
    await claimPendingAnalysis(userId, token)
  } catch (e) {
    // Never block the page over this; the next request will try again.
    console.error('Carry-over claim failed:', e instanceof Error ? e.message : e)
    return false
  }
  return true
}
