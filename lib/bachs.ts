import crypto from 'crypto'

// Bachs handles checkout, subscriptions, and tax, so no card data or billing
// PII ever reaches this app. Docs: https://docs.bachs.io
//
// BACHS_API_BASE defaults to production. Point it at https://sandbox-api.bachs.io
// (with an sk_sandbox_ key) to test without moving real money.
function apiBase(): string {
  return (process.env.BACHS_API_BASE || 'https://api.bachs.io').replace(/\/+$/, '')
}

function apiKey(): string {
  const key = process.env.BACHS_API_KEY
  if (!key) throw new Error('BACHS_API_KEY is not configured (see .env.example).')
  return key
}

interface CreateCheckoutParams {
  /** Where Bachs sends the customer after paying (it appends ?checkout_id=…). */
  successUrl: string
  /** Where Bachs sends the customer if they back out. */
  cancelUrl: string
  /**
   * The subscriber. Required: Bachs refuses a subscription checkout without a
   * customer, since recurring billing needs a durable identity.
   */
  email: string
  /** Our user id. Echoed back on checkout.completed so the webhook knows who paid. */
  reference: string
  /** Extra key/value data echoed back in webhooks. */
  metadata?: Record<string, string>
}

/**
 * Create a hosted Bachs checkout for the Pro plan and return its URL.
 *
 * BACHS_PRODUCT_ID must be a product with a monthly billing_cycle — Bachs turns
 * a checkout for a recurring product into a subscription automatically.
 */
export async function createCheckout({
  successUrl,
  cancelUrl,
  email,
  reference,
  metadata,
}: CreateCheckoutParams): Promise<string> {
  const productId = process.env.BACHS_PRODUCT_ID
  if (!productId) {
    throw new Error('BACHS_PRODUCT_ID is not configured (see .env.example).')
  }

  const res = await fetch(`${apiBase()}/v1/checkout-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email },
      success_url: successUrl,
      cancel_url: cancelUrl,
      reference,
      metadata,
    }),
  })

  if (!res.ok) {
    throw new Error(`Bachs checkout failed (${res.status}): ${await res.text()}`)
  }

  const json = await res.json()
  const url = json?.checkout_url
  if (!url) throw new Error('Bachs did not return a checkout URL.')
  return url as string
}

/**
 * Mint a customer portal URL. Portal sessions are short-lived, so one cannot be
 * stored at webhook time and reused — create a fresh one per click.
 */
export async function createPortalUrl(customerId: string): Promise<string | null> {
  const res = await fetch(
    `${apiBase()}/v1/customers/${encodeURIComponent(customerId)}/portal-sessions`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey()}` },
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    throw new Error(`Bachs portal session failed (${res.status}): ${await res.text()}`)
  }

  const json = await res.json()
  return json?.url ?? null
}

// Bachs rejects deliveries older than this on their side too; it bounds replays.
const SIGNATURE_TOLERANCE_SECONDS = 300

/**
 * Verify a Bachs webhook. The signature is an HMAC-SHA256 hex digest of
 * "{timestamp}.{raw body}", keyed with the endpoint's signing secret.
 *
 * Prefers X-Bachs-Signature-V2 ("t=…,v1=…[,v1=…]"), which carries one v1 per
 * active secret during a rotation, and falls back to the older
 * X-Bachs-Timestamp + X-Bachs-Signature pair.
 */
export function verifyWebhookSignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.BACHS_WEBHOOK_SECRET
  if (!secret) return false

  let timestamp: string | null = null
  let signatures: string[] = []

  const v2 = headers.get('x-bachs-signature-v2')
  if (v2) {
    for (const part of v2.split(',')) {
      const [k, v] = part.trim().split('=', 2)
      if (k === 't') timestamp = v
      else if (k === 'v1' && v) signatures.push(v)
    }
  } else {
    timestamp = headers.get('x-bachs-timestamp')
    const sig = headers.get('x-bachs-signature')
    if (sig) signatures = [sig]
  }

  if (!timestamp || signatures.length === 0) return false
  const ts = Number(timestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > SIGNATURE_TOLERANCE_SECONDS) {
    return false
  }

  const expected = Buffer.from(
    crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex'),
    'hex',
  )
  return signatures.some((sig) => {
    const given = Buffer.from(sig, 'hex')
    return given.length === expected.length && crypto.timingSafeEqual(given, expected)
  })
}

// ── Webhook payload shapes ──────────────────────────────────────────────────
// Only the fields we actually read. Bachs sends far more.
export type BachsCustomer = { customer_id?: string; email?: string }

export type BachsEvent = {
  id?: string
  type?: string
  data?: {
    // checkout.completed
    checkout_id?: string
    mode?: string
    reference?: string | null
    // checkout.completed and invoice.* point at a subscription; subscription
    // events carry the id directly.
    subscription?: { subscription_id?: string } | null
    subscription_id?: string
    customer?: BachsCustomer | null
    customer_details?: { email?: string } | null
    metadata?: Record<string, string> | null
    // customer.subscription.*
    status?: string
    current_period_end?: string | null
    cancel_at_period_end?: boolean
    // invoice.*
    period_end?: string | null
  }
}
