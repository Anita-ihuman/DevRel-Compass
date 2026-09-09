import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pool } from '@/lib/db'
import { getCustomerPortalUrl } from '@/lib/lemonsqueezy'
import { siteUrl } from '@/lib/site'

// Sends a subscriber to Lemon Squeezy's hosted billing portal, where they can
// update their card, change plan, or cancel.
//
// The portal URL is minted per request rather than read from the database:
// Lemon Squeezy signs these URLs with a few hours' expiry, so a stored one is
// dead by the next time most people click it. Users hit this route, we fetch a
// fresh URL, and redirect.
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(`${siteUrl}/signin`)
  }

  try {
    const { rows } = await pool.query(
      'SELECT ls_subscription_id FROM users WHERE id = $1',
      [session.user.id],
    )
    const subscriptionId = rows[0]?.ls_subscription_id

    // No subscription to manage — a free account, or one comped by hand that
    // Lemon Squeezy has never heard of.
    if (!subscriptionId) {
      return NextResponse.redirect(`${siteUrl}/profile?billing=none`)
    }

    const url = await getCustomerPortalUrl(String(subscriptionId))
    if (!url) {
      return NextResponse.redirect(`${siteUrl}/profile?billing=error`)
    }
    return NextResponse.redirect(url)
  } catch (e) {
    console.error('Billing portal lookup failed:', e instanceof Error ? e.message : e)
    return NextResponse.redirect(`${siteUrl}/profile?billing=error`)
  }
}
