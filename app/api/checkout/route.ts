import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createCheckout } from '@/lib/lemonsqueezy'
import { siteUrl } from '@/lib/site'

// Starts a Lemon Squeezy hosted checkout for the signed-in user.
//
// Checkout must be authed: the user id travels in custom_data and is how the
// webhook knows which account to upgrade. An anonymous checkout would take
// someone's money with no account to credit it to.
export async function POST() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Sign in to upgrade.' }, { status: 401 })
  }

  try {
    const url = await createCheckout({
      redirectUrl: `${siteUrl}/profile?upgraded=1`,
      email: session.user.email ?? undefined,
      custom: { user_id: String(userId) },
    })
    return NextResponse.json({ url })
  } catch (e) {
    // The detail names env vars and API responses — log it, don't return it.
    console.error('Checkout: could not create Lemon Squeezy checkout:', e instanceof Error ? e.message : e)
    return NextResponse.json(
      { error: "We couldn't start checkout right now. Please try again in a moment." },
      { status: 502 },
    )
  }
}
