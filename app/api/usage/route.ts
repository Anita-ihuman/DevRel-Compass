import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getClientIp } from '@/lib/ip'
import { ANON_FREE_LIMIT, getEntitlement, getAnonUses } from '@/lib/usage'

// Tells the analyzer UI what gating state the visitor is in, so it can show the
// right screen (upload / sign-in prompt / upgrade / quota used up) without
// guessing. The server stays the source of truth — this only mirrors it.
export async function GET(req: NextRequest) {
  const session = await auth()

  if (session?.user?.id) {
    const entitlement = await getEntitlement(session.user.id)
    return NextResponse.json({
      signedIn: true,
      username: session.user.username,
      used: entitlement.used,
      limit: entitlement.limit,
      remaining: entitlement.remaining,
      plan: entitlement.plan,
      paid: entitlement.paid,
      periodEnd: entitlement.periodEnd,
    })
  }

  const used = await getAnonUses(getClientIp(req))
  return NextResponse.json({
    signedIn: false,
    used,
    limit: ANON_FREE_LIMIT,
    remaining: Math.max(0, ANON_FREE_LIMIT - used),
    plan: 'free',
    paid: false,
    periodEnd: null,
  })
}
