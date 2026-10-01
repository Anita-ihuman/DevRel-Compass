import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createCheckout } from '@/lib/bachs'
import { siteUrl } from '@/lib/site'

// Starts a Bachs hosted checkout for the signed-in user.
//
// Checkout must be authed: the user id travels as the checkout reference and is
// how the webhook knows which account to upgrade. An anonymous checkout would
// take someone's money with no account to credit it to.
export async function POST() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Sign in to upgrade.' }, { status: 401 })
  }

  // Bachs needs a customer email to create a subscription. Accounts normally
  // have one; an OAuth login that didn't share it can't subscribe yet.
  const email = session.user.email
  if (!email) {
    return NextResponse.json(
      { error: 'Add an email address to your account before upgrading.' },
      { status: 400 },
    )
  }

  try {
    const url = await createCheckout({
      successUrl: `${siteUrl}/profile?upgraded=1`,
      cancelUrl: `${siteUrl}/profile`,
      email,
      reference: String(userId),
      metadata: { user_id: String(userId) },
    })
    return NextResponse.json({ url })
  } catch (e) {
    // The detail names env vars and API responses — log it, don't return it.
    console.error('Checkout: could not create Bachs checkout:', e instanceof Error ? e.message : e)
    return NextResponse.json(
      { error: "We couldn't start checkout right now. Please try again in a moment." },
      { status: 502 },
    )
  }
}
