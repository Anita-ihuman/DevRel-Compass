import { randomBytes } from 'crypto'
import { pool } from '@/lib/db'

// The newsletter list. Double opt-in throughout: signing up creates a 'pending'
// row, and only a click on the emailed link promotes it to 'confirmed'. Sends
// read 'confirmed' only.

export type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed'

export type Subscriber = { email: string; token: string; status: SubscriberStatus }

// Deliberately permissive — the confirmation email is the real validation, and a
// stricter pattern mostly rejects legitimate addresses.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254
}

/**
 * Add an address, or revive one that previously unsubscribed.
 *
 * Returns the row plus whether it already existed and was confirmed, so the
 * caller knows whether to send another confirmation email. Signing up twice is
 * a normal thing people do; it must never error or create a duplicate.
 */
export async function upsertSubscriber(
  email: string,
  source: string,
): Promise<{ subscriber: Subscriber; alreadyConfirmed: boolean }> {
  const token = randomBytes(32).toString('hex')
  const { rows } = await pool.query(
    `INSERT INTO newsletter_subscribers (email, status, token, source)
     VALUES ($1, 'pending', $2, $3)
     ON CONFLICT (lower(email)) DO UPDATE
       SET status = CASE
             -- Someone already confirmed stays confirmed; re-subscribing after
             -- an unsubscribe starts the opt-in over rather than silently
             -- resuming mail they once opted out of.
             WHEN newsletter_subscribers.status = 'confirmed' THEN 'confirmed'
             ELSE 'pending'
           END,
           token = CASE
             WHEN newsletter_subscribers.status = 'confirmed'
               THEN newsletter_subscribers.token
             ELSE EXCLUDED.token
           END,
           unsubscribed_at = NULL
     RETURNING email, token, status`,
    [email.trim(), token, source],
  )
  const row = rows[0]
  return {
    subscriber: { email: row.email, token: row.token, status: row.status },
    alreadyConfirmed: row.status === 'confirmed',
  }
}

/** Promote a pending row to confirmed. Idempotent — re-clicking the link is fine. */
export async function confirmSubscriber(token: string): Promise<string | null> {
  const { rows } = await pool.query(
    `UPDATE newsletter_subscribers
        SET status = 'confirmed',
            confirmed_at = COALESCE(confirmed_at, now()),
            unsubscribed_at = NULL
      WHERE token = $1 AND status <> 'unsubscribed'
      RETURNING email`,
    [token],
  )
  return rows[0]?.email ?? null
}

export async function unsubscribe(token: string): Promise<string | null> {
  const { rows } = await pool.query(
    `UPDATE newsletter_subscribers
        SET status = 'unsubscribed', unsubscribed_at = now()
      WHERE token = $1
      RETURNING email`,
    [token],
  )
  return rows[0]?.email ?? null
}

/** Everyone an issue should go to. */
export async function getConfirmedSubscribers(): Promise<Subscriber[]> {
  const { rows } = await pool.query(
    `SELECT email, token, status FROM newsletter_subscribers
      WHERE status = 'confirmed' ORDER BY confirmed_at`,
  )
  return rows as Subscriber[]
}

export type SubscriberCounts = { confirmed: number; pending: number; unsubscribed: number }

export async function getSubscriberCounts(): Promise<SubscriberCounts> {
  const { rows } = await pool.query(
    `SELECT
       count(*) FILTER (WHERE status = 'confirmed')    AS confirmed,
       count(*) FILTER (WHERE status = 'pending')      AS pending,
       count(*) FILTER (WHERE status = 'unsubscribed') AS unsubscribed
     FROM newsletter_subscribers`,
  )
  const r = rows[0]
  return {
    confirmed: Number(r?.confirmed ?? 0),
    pending: Number(r?.pending ?? 0),
    unsubscribed: Number(r?.unsubscribed ?? 0),
  }
}

// ── Send bookkeeping ────────────────────────────────────────────────────────
/**
 * Claim an issue for sending. Returns false if it was already sent — the insert
 * is the lock, so two concurrent send requests can't both mail the list.
 */
export async function claimIssueSend(slug: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `INSERT INTO newsletter_sends (slug) VALUES ($1) ON CONFLICT (slug) DO NOTHING`,
    [slug],
  )
  return rowCount === 1
}

export async function recordIssueRecipients(slug: string, recipients: number): Promise<void> {
  await pool.query(`UPDATE newsletter_sends SET recipients = $2 WHERE slug = $1`, [
    slug,
    recipients,
  ])
}

export async function releaseIssueSend(slug: string): Promise<void> {
  await pool.query(`DELETE FROM newsletter_sends WHERE slug = $1`, [slug])
}

/** Keyed by slug. `sentAt` is an ISO date string, not a Date, so callers can slice it. */
export async function getSentIssues(): Promise<
  Record<string, { recipients: number; sentAt: string }>
> {
  const { rows } = await pool.query(`SELECT slug, recipients, sent_at FROM newsletter_sends`)
  return Object.fromEntries(
    rows.map((r) => [
      r.slug,
      { recipients: Number(r.recipients), sentAt: new Date(r.sent_at).toISOString() },
    ]),
  )
}
