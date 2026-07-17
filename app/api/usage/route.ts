import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getClientIp } from '@/lib/ip'
import {
  ANON_FREE_LIMIT,
  ACCOUNT_FREE_LIMIT,
  getAccountUsage,
  getAnonUses,
} from '@/lib/usage'

// Tells the analyzer UI what gating state the visitor is in, so it can show the
// right screen (upload / sign-in prompt / paywall) without guessing.
export async function GET(req: NextRequest) {
  const session = await auth()

  if (session?.user?.id) {
    const used = await getAccountUsage(session.user.id)
    return NextResponse.json({
      signedIn: true,
      username: session.user.username,
      used,
      limit: ACCOUNT_FREE_LIMIT,
      remaining: Math.max(0, ACCOUNT_FREE_LIMIT - used),
    })
  }

  const used = await getAnonUses(getClientIp(req))
  return NextResponse.json({
    signedIn: false,
    used,
    limit: ANON_FREE_LIMIT,
    remaining: Math.max(0, ANON_FREE_LIMIT - used),
  })
}
