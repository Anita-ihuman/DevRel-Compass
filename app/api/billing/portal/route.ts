import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pool } from '@/lib/db'
import { createPortalUrl } from '@/lib/bachs'
import { siteUrl } from '@/lib/site'

// Sends a subscriber to the Bachs customer portal, where they can update their
// card or cancel.
//
// Portal sessions are short-lived, so the URL is minted per request rather than
// stored: users hit this route, we create a session, and redirect.
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(`${siteUrl}/signin`)
  }

  try {
    const { rows } = await pool.query('SELECT bachs_customer_id FROM users WHERE id = $1', [
      session.user.id,
    ])
    const customerId = rows[0]?.bachs_customer_id

    // Nothing to manage — a free account, or one comped by hand that Bachs has
    // never heard of.
    if (!customerId) {
      return NextResponse.redirect(`${siteUrl}/profile?billing=none`)
    }

    const url = await createPortalUrl(String(customerId))
    if (!url) {
      return NextResponse.redirect(`${siteUrl}/profile?billing=error`)
    }
    return NextResponse.redirect(url)
  } catch (e) {
    console.error('Billing portal lookup failed:', e instanceof Error ? e.message : e)
    return NextResponse.redirect(`${siteUrl}/profile?billing=error`)
  }
}
