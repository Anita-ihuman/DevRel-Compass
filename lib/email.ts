// Transactional + newsletter sending via Resend's REST API.
//
// Called directly over fetch rather than through the Resend SDK, so the app
// keeps one less dependency — the same approach lib/lemonsqueezy.ts takes. The
// API key is the one already used for magic-link sign-in (AUTH_RESEND_KEY).

const API_BASE = 'https://api.resend.com'

// Resend caps a batch send at 100 messages per call.
const BATCH_LIMIT = 100

export type EmailMessage = {
  to: string
  subject: string
  html: string
  /** Per-recipient unsubscribe URL, surfaced to mail clients as one-click. */
  unsubscribeUrl?: string
}

function config(): { apiKey: string; from: string } {
  const apiKey = process.env.AUTH_RESEND_KEY
  const from = process.env.AUTH_EMAIL_FROM
  if (!apiKey || !from) {
    throw new Error(
      'Email is not configured. Set AUTH_RESEND_KEY and AUTH_EMAIL_FROM (see .env.example).',
    )
  }
  return { apiKey, from }
}

function payload(from: string, m: EmailMessage) {
  return {
    from,
    to: m.to,
    subject: m.subject,
    html: m.html,
    // Gmail and Outlook render a native unsubscribe control from these, which
    // keeps people out of the spam button — the thing that actually wrecks
    // deliverability for a new sending domain.
    headers: m.unsubscribeUrl
      ? {
          'List-Unsubscribe': `<${m.unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : undefined,
  }
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  const { apiKey, from } = config()
  const res = await fetch(`${API_BASE}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload(from, message)),
  })
  if (!res.ok) {
    throw new Error(`Resend send failed (${res.status}): ${await res.text()}`)
  }
}

/**
 * Send many messages, chunked to Resend's batch limit.
 *
 * Returns how many were accepted rather than throwing on the first failure — a
 * newsletter run shouldn't abort halfway and leave the list half-mailed with no
 * way to tell where it stopped.
 */
export async function sendBatch(
  messages: EmailMessage[],
): Promise<{ sent: number; failed: number }> {
  const { apiKey, from } = config()
  let sent = 0
  let failed = 0

  for (let i = 0; i < messages.length; i += BATCH_LIMIT) {
    const chunk = messages.slice(i, i + BATCH_LIMIT)
    try {
      const res = await fetch(`${API_BASE}/emails/batch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk.map((m) => payload(from, m))),
      })
      if (res.ok) {
        sent += chunk.length
      } else {
        failed += chunk.length
        console.error(`Resend batch failed (${res.status}): ${await res.text()}`)
      }
    } catch (e) {
      failed += chunk.length
      console.error('Resend batch threw:', e instanceof Error ? e.message : e)
    }
  }

  return { sent, failed }
}
