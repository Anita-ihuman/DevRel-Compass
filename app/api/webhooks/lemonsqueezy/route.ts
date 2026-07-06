import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/lemonsqueezy'

// Lemon Squeezy sends the signature over the *raw* body, so read text() (not json()).
export async function POST(req: NextRequest) {
  const rawBody   = await req.text()
  const signature = req.headers.get('x-signature')

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event     = JSON.parse(rawBody)
  const eventName = event?.meta?.event_name as string | undefined
  const custom    = event?.meta?.custom_data as Record<string, string> | undefined

  switch (eventName) {
    case 'order_created':
    case 'subscription_created':
    case 'subscription_payment_success': {
      // Payment is confirmed by Lemon Squeezy here. In a persistence-backed app
      // you would grant `custom.credits` to the customer (keyed by email / user
      // id) at this point. This app currently stores credits client-side in
      // localStorage (see app/success/page.tsx), so there is no server-side
      // record to update yet — this handler is the hook point for that.
      console.log(`Lemon Squeezy webhook: ${eventName}`, {
        email: event?.data?.attributes?.user_email,
        custom,
      })
      break
    }
    default:
      // Ignore events we don't act on (subscription_updated, _cancelled, etc.)
      break
  }

  return NextResponse.json({ received: true })
}
