import { NextRequest, NextResponse } from 'next/server'
import { unsubscribe } from '@/lib/subscribers'
import { siteUrl } from '@/lib/site'

// Unsubscribing must work in one click, with no sign-in and no confirmation
// step — the token in the link is the authorisation. Anything more friction-y
// pushes people to the spam button instead, which costs the sending domain far
// more than the subscriber does.

/** Clicked from the footer link in an issue. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token) return NextResponse.redirect(`${siteUrl}/newsletter?state=invalid`)

  try {
    const email = await unsubscribe(token)
    return NextResponse.redirect(
      `${siteUrl}/newsletter?state=${email ? 'unsubscribed' : 'invalid'}`,
    )
  } catch (e) {
    console.error('Newsletter unsubscribe failed:', e instanceof Error ? e.message : e)
    return NextResponse.redirect(`${siteUrl}/newsletter?state=error`)
  }
}

/**
 * RFC 8058 one-click unsubscribe. Gmail and Outlook POST here when the reader
 * uses the mail client's own unsubscribe control, and expect a 2xx — they never
 * render a page, so this returns a bare response rather than a redirect.
 */
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token) return new NextResponse(null, { status: 400 })

  try {
    await unsubscribe(token)
    return new NextResponse(null, { status: 200 })
  } catch (e) {
    console.error('Newsletter one-click unsubscribe failed:', e instanceof Error ? e.message : e)
    return new NextResponse(null, { status: 500 })
  }
}
