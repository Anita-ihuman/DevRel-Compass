import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, type BachsEvent } from '@/lib/bachs'
import { PLAN } from '@/lib/plan'
import {
  PAID_MONTHLY_QUOTA,
  applySubscription,
  ensurePeriodEnd,
  findUserForWebhook,
  isWebhookEventProcessed,
  markWebhookEventProcessed,
  startNewUsagePeriod,
} from '@/lib/usage'

// Bachs webhooks are the only way the app learns about a payment — never the
// success redirect, which anyone can visit. They write plan, status, and period
// end onto the user; /api/analyze reads those to decide whether an analysis is
// allowed.
//
// Subscribe the endpoint (<site>/api/webhooks/bachs) to: checkout.completed,
// customer.subscription.created, customer.subscription.updated,
// customer.subscription.deleted, invoice.paid, invoice.payment_failed.

// Label stored in users.plan for a subscriber. Anything other than 'free'
// counts as paid, so this is a name rather than a switch.
const PAID_PLAN = PLAN.id

// Bachs spells it "canceled"; the rest of the app says "cancelled". A
// subscription set to cancel at period end is still "active" to Bachs, but to
// the customer it's cancelled and running out, so it's shown that way.
function normalizeStatus(status: string | undefined, cancelAtPeriodEnd?: boolean): string | null {
  if (!status) return null
  if (status === 'canceled') return 'cancelled'
  if (cancelAtPeriodEnd && (status === 'active' || status === 'trialing')) return 'cancelled'
  return status
}

// The signature covers the *raw* body, so read text() (not json()).
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifyWebhookSignature(rawBody, req.headers)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: BachsEvent
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
  }

  const type = event.type ?? ''
  const data = event.data ?? {}

  // Only subscription-related events change anything here.
  const handled = [
    'checkout.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.paid',
    'invoice.payment_failed',
  ]
  if (!handled.includes(type)) {
    return NextResponse.json({ received: true })
  }
  // A one-off payment (e.g. through a payment link) isn't the Pro subscription.
  if (type === 'checkout.completed' && data.mode && data.mode !== 'subscription') {
    return NextResponse.json({ received: true })
  }

  // Subscription events carry the id directly; checkout and invoice events
  // point at the subscription.
  const subscriptionId = data.subscription_id ?? data.subscription?.subscription_id ?? null
  const customerId = data.customer?.customer_id ?? null
  const email = data.customer?.email ?? data.customer_details?.email ?? null

  try {
    if (event.id && (await isWebhookEventProcessed(event.id))) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    const userId = await findUserForWebhook({
      reference: data.reference ?? data.metadata?.user_id ?? null,
      subscriptionId,
      email,
    })

    if (!userId) {
      // Acknowledge anyway: retrying won't conjure an account, and a 4xx here
      // just makes Bachs redeliver forever.
      console.error(`Bachs webhook ${type}: no matching user`, { subscriptionId, email })
      return NextResponse.json({ received: true, matched: false })
    }

    switch (type) {
      // Paid for and subscribed. Unlock now; the subscription events fill in the
      // real period end.
      case 'checkout.completed': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: 'active',
          subscriptionId,
          customerId,
          currentPeriodEnd: null,
          monthlyQuota: PAID_MONTHLY_QUOTA,
        })
        await ensurePeriodEnd(userId)
        await startNewUsagePeriod(userId)
        break
      }

      // New subscription, renewal, plan change, cancellation scheduled or
      // undone. Cancelled is not "off" — they keep the plan until the period
      // they paid for runs out, which is what current_period_end gates on.
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: normalizeStatus(data.status, data.cancel_at_period_end),
          subscriptionId,
          customerId,
          currentPeriodEnd: data.current_period_end ?? null,
          monthlyQuota: PAID_MONTHLY_QUOTA,
        })
        break
      }

      // The end of the line: back to the free tier.
      case 'customer.subscription.deleted': {
        await applySubscription(userId, {
          plan: 'free',
          status: 'expired',
          subscriptionId,
          customerId,
          currentPeriodEnd: null,
          monthlyQuota: null,
        })
        break
      }

      // Money landed for a period — start the new quota month so the customer
      // gets their full allowance immediately.
      case 'invoice.paid': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: 'active',
          subscriptionId,
          customerId,
          currentPeriodEnd: data.period_end ?? null,
          monthlyQuota: PAID_MONTHLY_QUOTA,
        })
        await startNewUsagePeriod(userId)
        break
      }

      // Bachs retries a failed payment on its own schedule. Access holds until
      // the paid period ends; if the retries never succeed, the subscription is
      // deleted and the branch above downgrades the account.
      case 'invoice.payment_failed': {
        await applySubscription(userId, {
          plan: PAID_PLAN,
          status: 'past_due',
          subscriptionId,
          customerId,
          currentPeriodEnd: null,
          monthlyQuota: null,
        })
        break
      }
    }

    if (event.id) await markWebhookEventProcessed(event.id, type)
  } catch (e) {
    // A 500 makes Bachs redeliver, which is what we want for a transient
    // database failure — the event isn't marked processed until it succeeds.
    console.error(`Bachs webhook ${type} failed:`, e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
