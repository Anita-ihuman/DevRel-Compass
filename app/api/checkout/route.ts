import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Map plan IDs to Stripe Price IDs (set these in your .env.local / Vercel env vars)
const PLANS: Record<string, { priceId: string; mode: 'payment' | 'subscription'; credits: number }> = {
  starter:   { priceId: process.env.STRIPE_PRICE_STARTER!,   mode: 'payment',      credits: 10  },
  pro:       { priceId: process.env.STRIPE_PRICE_PRO!,       mode: 'payment',      credits: 30  },
  unlimited: { priceId: process.env.STRIPE_PRICE_UNLIMITED!, mode: 'subscription', credits: 999 },
}

export async function POST(req: NextRequest) {
  const { plan } = await req.json()
  const config = PLANS[plan as string]

  if (!config) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: config.priceId, quantity: 1 }],
    mode: config.mode,
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancel_url:  `${appUrl}/`,
    metadata: { plan, credits: String(config.credits) },
  })

  return NextResponse.json({ url: session.url })
}
