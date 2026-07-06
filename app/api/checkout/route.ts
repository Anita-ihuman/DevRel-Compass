import { NextRequest, NextResponse } from 'next/server'
import { createCheckout } from '@/lib/lemonsqueezy'

// Credits granted per plan (keep in sync with the success page + CreditsScreen)
const PLANS: Record<string, { credits: number }> = {
  monthly: { credits: 25 },
}

export async function POST(req: NextRequest) {
  const { plan } = await req.json()
  const config = PLANS[plan as string]

  if (!config) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    const url = await createCheckout({
      redirectUrl: `${appUrl}/success?plan=${plan}`,
      custom: { plan, credits: String(config.credits) },
    })

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Checkout creation failed:', err)
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
