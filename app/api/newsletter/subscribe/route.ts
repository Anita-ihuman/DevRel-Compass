import { NextRequest, NextResponse } from 'next/server'
import { consumeAnalysisLimit } from '@/lib/ratelimit'
import { getClientIp } from '@/lib/ip'
import { isValidEmail, upsertSubscriber } from '@/lib/subscribers'
import { sendEmail } from '@/lib/email'
import { confirmationEmail } from '@/lib/emails/newsletter-templates'
import { siteUrl } from '@/lib/site'

// Newsletter signup, step one of double opt-in: record the address as pending
// and email a confirmation link. Nothing is ever mailed to an address that
// hasn't clicked that link.
export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = (body.email ?? '').trim()
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // A public form that sends mail is a spam amplifier if left open — reuse the
  // per-IP limiter so one address can't be used to blast confirmations at
  // strangers.
  const limit = await consumeAnalysisLimit(`newsletter:${getClientIp(req)}`)
  if (limit.enabled && !limit.success) {
    return NextResponse.json(
      { error: 'Too many signups from this network. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    const { subscriber, alreadyConfirmed } = await upsertSubscriber(
      email,
      body.source ?? 'unknown',
    )

    if (alreadyConfirmed) {
      // Don't re-send anything, and don't reveal that this address is on the
      // list — the response is identical either way.
      return NextResponse.json({ ok: true })
    }

    await sendEmail(
      confirmationEmail({
        to: subscriber.email,
        confirmUrl: `${siteUrl}/api/newsletter/confirm?token=${subscriber.token}`,
      }),
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Newsletter subscribe failed:', e instanceof Error ? e.message : e)
    return NextResponse.json(
      { error: "We couldn't sign you up right now. Please try again in a moment." },
      { status: 500 },
    )
  }
}
