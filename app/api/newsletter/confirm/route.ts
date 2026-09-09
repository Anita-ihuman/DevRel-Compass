import { NextRequest, NextResponse } from 'next/server'
import { confirmSubscriber } from '@/lib/subscribers'
import { siteUrl } from '@/lib/site'

// Step two of double opt-in. Linked from the confirmation email, so this is a
// GET a mail client follows — it redirects to a human-readable page rather than
// returning JSON.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token) {
    return NextResponse.redirect(`${siteUrl}/newsletter?state=invalid`)
  }

  try {
    const email = await confirmSubscriber(token)
    return NextResponse.redirect(`${siteUrl}/newsletter?state=${email ? 'confirmed' : 'invalid'}`)
  } catch (e) {
    console.error('Newsletter confirm failed:', e instanceof Error ? e.message : e)
    return NextResponse.redirect(`${siteUrl}/newsletter?state=error`)
  }
}
