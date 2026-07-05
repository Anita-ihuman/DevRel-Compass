import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PLAN_CREDITS: Record<string, number> = {
  starter:   10,
  pro:       30,
  unlimited: 999,
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const plan      = req.nextUrl.searchParams.get('plan')

  if (!sessionId || !plan) {
    return NextResponse.json({ error: 'Missing session_id or plan' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  const paid =
    session.payment_status === 'paid' ||
    session.status === 'complete'

  if (!paid) {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
  }

  const credits = PLAN_CREDITS[plan] ?? 0
  return NextResponse.json({ credits, plan })
}
