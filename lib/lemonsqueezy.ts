import crypto from 'crypto'

const API_BASE = 'https://api.lemonsqueezy.com/v1'

interface CreateCheckoutParams {
  /** URL Lemon Squeezy redirects the customer to after a successful payment. */
  redirectUrl: string
  /** Arbitrary key/value data echoed back in the webhook payload (meta.custom_data). */
  custom: Record<string, string>
}

/**
 * Create a hosted Lemon Squeezy checkout and return its URL.
 *
 * Requires LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID and
 * LEMONSQUEEZY_VARIANT_MONTHLY to be set. Constructing/validating lazily here
 * means a missing key surfaces as a clean, catchable error instead of a crash.
 */
export async function createCheckout({ redirectUrl, custom }: CreateCheckoutParams): Promise<string> {
  const apiKey    = process.env.LEMONSQUEEZY_API_KEY
  const storeId   = process.env.LEMONSQUEEZY_STORE_ID
  const variantId = process.env.LEMONSQUEEZY_VARIANT_MONTHLY

  if (!apiKey || !storeId || !variantId) {
    throw new Error(
      'Lemon Squeezy is not configured. Set LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID and LEMONSQUEEZY_VARIANT_MONTHLY (see .env.example).',
    )
  }

  const res = await fetch(`${API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { custom },
          product_options: { redirect_url: redirectUrl },
        },
        relationships: {
          store:   { data: { type: 'stores',   id: String(storeId) } },
          variant: { data: { type: 'variants', id: String(variantId) } },
        },
      },
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Lemon Squeezy checkout failed (${res.status}): ${detail}`)
  }

  const json = await res.json()
  const url = json?.data?.attributes?.url
  if (!url) throw new Error('Lemon Squeezy did not return a checkout URL.')
  return url as string
}

/**
 * Verify a Lemon Squeezy webhook. The `X-Signature` header is an HMAC-SHA256
 * hex digest of the raw request body, keyed with your webhook signing secret.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  const expectedBuf  = Buffer.from(expected,  'hex')
  const signatureBuf = Buffer.from(signature, 'hex')
  if (expectedBuf.length !== signatureBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, signatureBuf)
}
