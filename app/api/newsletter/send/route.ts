import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getIssueBySlug } from '@/lib/newsletter'
import {
  claimIssueSend,
  getConfirmedSubscribers,
  recordIssueRecipients,
  releaseIssueSend,
} from '@/lib/subscribers'
import { sendBatch } from '@/lib/email'
import { issueEmail } from '@/lib/emails/newsletter-templates'
import { siteUrl } from '@/lib/site'

// Mails a published issue to every confirmed subscriber.
//
// This is the one endpoint in the app that can't be undone — once mail is
// accepted by Resend it's gone — so it's admin-only, refuses drafts, and takes
// a database-level lock on the issue slug so it can't run twice.
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    // Match the /admin dashboard: don't reveal that this endpoint exists.
    return new NextResponse(null, { status: 404 })
  }

  let body: { slug?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const slug = (body.slug ?? '').trim()
  const issue = slug ? getIssueBySlug(slug) : null
  if (!issue) {
    return NextResponse.json({ error: 'No such issue.' }, { status: 404 })
  }
  if (issue.meta.draft) {
    return NextResponse.json(
      { error: 'That issue is still a draft. Set its date to today or earlier to send it.' },
      { status: 400 },
    )
  }

  // The insert is the lock: if the slug is already recorded, it has been sent.
  if (!(await claimIssueSend(issue.meta.slug))) {
    return NextResponse.json(
      { error: 'That issue has already been sent.' },
      { status: 409 },
    )
  }

  try {
    const subscribers = await getConfirmedSubscribers()
    if (subscribers.length === 0) {
      await releaseIssueSend(issue.meta.slug)
      return NextResponse.json({ error: 'No confirmed subscribers yet.' }, { status: 400 })
    }

    const issueUrl = `${siteUrl}/newsletter/${issue.meta.slug}`
    const messages = subscribers.map((s) =>
      issueEmail({
        to: s.email,
        title: issue.meta.title,
        markdown: issue.content,
        issueUrl,
        // Per-subscriber token, so unsubscribing removes the right person.
        unsubscribeUrl: `${siteUrl}/api/newsletter/unsubscribe?token=${s.token}`,
      }),
    )

    const { sent, failed } = await sendBatch(messages)
    await recordIssueRecipients(issue.meta.slug, sent)

    return NextResponse.json({ ok: true, slug: issue.meta.slug, sent, failed })
  } catch (e) {
    // Release the lock so a failed run can be retried, rather than leaving the
    // issue permanently marked as sent when nothing went out.
    await releaseIssueSend(issue.meta.slug).catch(() => {})
    console.error('Newsletter send failed:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Send failed. Nothing was recorded.' }, { status: 500 })
  }
}
