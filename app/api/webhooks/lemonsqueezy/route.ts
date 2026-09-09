import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, type LemonSqueezyEvent } from '@/lib/lemonsqueezy'
import { PLAN } from '@/lib/plan'
import {
  PAID_MONTHLY_QUOTA,
  applySubscription,
  findUserForWebhook,
  startNewUsagePeriod,
} from '@/lib/usage'

// Lemon Squeezy is the merchant of record; these webhooks are the only way the
// app learns about a payment. They write plan, status, and period end onto the
// user — /api/analyze reads those to decide whether an analysis is allowed.

// Label stored in users.plan for a subscriber. Anything other than 'free'
// counts as paid, so this is a name rather than a switch.
const PAID_PLAN = PLAN.id

// Lemon Squeezy sends the signature over the *raw* body, so read text() (not json()).
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature')

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: LemonSqueezyEvent
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
  }

  const eventName = event.meta?.event_name
  const attrs = event.data?.attributes ?? {}
  const custom = event.meta?.custom_data

  // Subscription events carry the subscription as the object itself; payment
  // events carry an invoice that points at one. Either way we need its id.
  const isPaymentEvent =
    eventName === 'subscription_payment_success' || eventName === 'subscription_payment_failed'
  const subscriptionId = isPaymentEvent
    ? (attrs as { subscription_id?: number }).subscription_id?.toString()
    : event.data?.id

  const userId = await findUserForWebhook({
    customUserId: custom?.user_id,
    subscriptionId,
    email: attrs.user_email,
  })

  if (!userId) {
    // Acknowledge anyway: retrying won't conjure an account, and a 4xx here just
    // makes Lemon Squeezy redeliver forever.
    console.error(`Lemon Squeezy webhook ${eventName}: no matching user`, {
      subscriptionId,
      email: attrs.user_email,
    })
    return NextResponse.json({ received: true, matched: false })
  }

  try {
    switch (eventName) {
      // A new subscription, a renewal, a plan change, or a resume. Lemon Squeezy
      // sends `subscription_updated` on renewal with the new renews_at, so this
      // one branch keeps the period end current.
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
      case 'subscription_unpaused': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: attrs.status ?? 'active',
          subscriptionId: subscriptionId ?? null,
          customerId: attrs.customer_id?.toString() ?? null,
          portalUrl: attrs.urls?.customer_portal ?? null,
          // renews_at is null once cancelled; ends_at then holds the date access
          // actually runs out, which is what we gate on.
          currentPeriodEnd: attrs.renews_at ?? attrs.ends_at ?? null,
          monthlyQuota: PAID_MONTHLY_QUOTA,
        })
        if (eventName === 'subscription_created') await startNewUsagePeriod(userId)
        break
      }

      // Money landed — start the new quota month so the customer gets their full
      // allowance immediately rather than waiting for the next analysis to notice.
      case 'subscription_payment_success': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: 'active',
          subscriptionId: subscriptionId ?? null,
          customerId: attrs.customer_id?.toString() ?? null,
          portalUrl: null,
          currentPeriodEnd: null,
          monthlyQuota: PAID_MONTHLY_QUOTA,
        })
        await startNewUsagePeriod(userId)
        break
      }

      // Lemon Squeezy retries a failed payment on its own schedule. Access holds
      // until the paid period ends; if the retries never succeed, the
      // subscription expires and the branch below downgrades the account.
      case 'subscription_payment_failed': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: 'past_due',
          subscriptionId: subscriptionId ?? null,
          customerId: null,
          portalUrl: null,
          currentPeriodEnd: null,
          monthlyQuota: null,
        })
        break
      }

      // Cancelled is not "off" — they keep the plan until the period they paid
      // for runs out. `ends_at` is that date.
      case 'subscription_cancelled':
      case 'subscription_paused': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: attrs.status ?? 'cancelled',
          subscriptionId: subscriptionId ?? null,
          customerId: null,
          portalUrl: attrs.urls?.customer_portal ?? null,
          currentPeriodEnd: attrs.ends_at ?? attrs.renews_at ?? null,
          monthlyQuota: null,
        })
        break
      }

      // The end of the line: back to the free tier.
      case 'subscription_expired': {
        await applySubscription(userId, {
          plan: 'free',
          status: 'expired',
          subscriptionId: subscriptionId ?? null,
          customerId: null,
          portalUrl: null,
          currentPeriodEnd: attrs.ends_at ?? null,
          monthlyQuota: null,
        })
        break
      }

      default:
        // Events we don't act on (order_created, license keys, …).
        break
    }
  } catch (e) {
    // A 500 makes Lemon Squeezy redeliver, which is what we want for a
    // transient database failure — the handlers above are idempotent.
    console.error(`Lemon Squeezy webhook ${eventName} failed:`, e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
