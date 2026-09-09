// End-to-end local test of the payment lifecycle.
//
//   npm run dev            # in one terminal
//   npm run test:webhook   # in another
//
// Lemon Squeezy can't reach localhost, so this signs realistic webhook payloads
// with your real LEMONSQUEEZY_WEBHOOK_SECRET and posts them at the local route.
// That exercises everything we own — signature verification, event handling,
// and the resulting database state — without needing a tunnel or a real card.
//
// It works on a throwaway user that it creates and deletes, so your own account
// and any real subscribers are never touched.

import fs from 'fs'
import crypto from 'crypto'
import { Pool } from '@neondatabase/serverless'

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000'
const HOOK = `${BASE}/api/webhooks/lemonsqueezy`

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }),
)

const SECRET = env.LEMONSQUEEZY_WEBHOOK_SECRET
if (!SECRET) { console.error('LEMONSQUEEZY_WEBHOOK_SECRET missing from .env.local'); process.exit(1) }

const pool = new Pool({ connectionString: env.DATABASE_URL })
const q = async (sql, p = []) => (await pool.query(sql, p)).rows

let pass = 0, fail = 0
const check = (name, ok, detail = '') => {
  if (ok) { pass++; console.log(`  PASS  ${name}`) }
  else { fail++; console.log(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`) }
}

// Sign exactly the way Lemon Squeezy does: HMAC-SHA256 over the raw body.
async function post(payload, { corrupt = false } = {}) {
  const raw = JSON.stringify(payload)
  let sig = crypto.createHmac('sha256', SECRET).update(raw).digest('hex')
  if (corrupt) sig = sig.replace(/^./, (c) => (c === 'a' ? 'b' : 'a'))
  const res = await fetch(HOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-signature': sig },
    body: raw,
  })
  return { status: res.status, body: await res.text() }
}

const SUB_ID = `test_sub_${Date.now()}`
const iso = (d) => new Date(d).toISOString()
const inDays = (n) => iso(Date.now() + n * 86400e3)

const subEvent = (event, userId, attrs = {}) => ({
  meta: { event_name: event, custom_data: { user_id: String(userId) } },
  data: {
    id: SUB_ID,
    attributes: {
      status: 'active',
      user_email: 'webhook-test@example.com',
      customer_id: 999001,
      renews_at: inDays(30),
      urls: { customer_portal: 'https://example.lemonsqueezy.com/billing/test' },
      ...attrs,
    },
  },
})

const paymentEvent = (event) => ({
  meta: { event_name: event },
  data: { id: `inv_${Date.now()}`, attributes: { subscription_id: SUB_ID, customer_id: 999001 } },
})

let userId

try {
  // Fail fast with a useful message rather than a confusing fetch error.
  try {
    const ping = await fetch(BASE, { method: 'GET' })
    if (!ping.ok && ping.status >= 500) throw new Error(`dev server returned ${ping.status}`)
  } catch {
    console.error(`\nCannot reach ${BASE}. Start the dev server first:\n\n  npm run dev\n`)
    process.exit(1)
  }

  const rows = await q(
    `INSERT INTO users (name, email, username, plan)
     VALUES ('Webhook Test', $1, $2, 'free') RETURNING id`,
    [`webhook-test-${Date.now()}@example.com`, `whtest${Date.now()}`],
  )
  userId = rows[0].id
  console.log(`\nThrowaway test user id=${userId}\n`)

  const state = async () => (await q(
    `SELECT u.plan, u.plan_status, u.current_period_end, u.monthly_quota, u.ls_subscription_id,
            u.ls_portal_url, g.analyses_used
       FROM users u LEFT JOIN usage g ON g."userId" = u.id WHERE u.id = $1`, [userId]))[0]

  console.log('1. Rejects a bad signature')
  const badSig = await post(subEvent('subscription_created', userId), { corrupt: true })
  check('tampered signature -> 401', badSig.status === 401, `got ${badSig.status}`)

  console.log('\n2. subscription_created')
  const created = await post(subEvent('subscription_created', userId))
  check('accepted -> 200', created.status === 200, `got ${created.status}: ${created.body.slice(0, 200)}`)
  let s = await state()
  check('plan = pro', s.plan === 'pro', `got ${s.plan}`)
  check('plan_status = active', s.plan_status === 'active', `got ${s.plan_status}`)
  check('current_period_end in the future', s.current_period_end && s.current_period_end > new Date())
  check('monthly_quota = 25', s.monthly_quota === 25, `got ${s.monthly_quota}`)
  check('subscription id stored', s.ls_subscription_id === SUB_ID, `got ${s.ls_subscription_id}`)
  check('portal url stored', Boolean(s.ls_portal_url))

  console.log('\n3. Quota resets when a renewal is paid')
  await q(`UPDATE usage SET analyses_used = 17 WHERE "userId" = $1`, [userId])
  const paid = await post(paymentEvent('subscription_payment_success'))
  check('accepted -> 200', paid.status === 200, `got ${paid.status}`)
  s = await state()
  check('usage reset to 0', Number(s.analyses_used) === 0, `got ${s.analyses_used}`)

  console.log('\n4. Matches by subscription id when custom_data is absent')
  // Payment events carry no custom_data, so this only works if the subscription
  // id was persisted in step 2 — the most fragile link in the chain.
  check('resolved without custom_data', paid.status === 200 && Number(s.analyses_used) === 0)

  console.log('\n5. Failed payment keeps access until the period ends')
  const failed = await post(paymentEvent('subscription_payment_failed'))
  check('accepted -> 200', failed.status === 200, `got ${failed.status}`)
  s = await state()
  check('plan_status = past_due', s.plan_status === 'past_due', `got ${s.plan_status}`)
  check('still inside paid period', s.current_period_end > new Date())

  console.log('\n6. Cancellation keeps access until the period ends')
  const cancelled = await post(
    subEvent('subscription_cancelled', userId, { status: 'cancelled', ends_at: inDays(12), renews_at: null }))
  check('accepted -> 200', cancelled.status === 200, `got ${cancelled.status}`)
  s = await state()
  check('plan_status = cancelled', s.plan_status === 'cancelled', `got ${s.plan_status}`)
  check('period end ~12 days out (not immediate)', s.current_period_end > new Date())

  console.log('\n7. Expiry downgrades to free')
  const expired = await post(
    subEvent('subscription_expired', userId, { status: 'expired', ends_at: iso(Date.now() - 1000), renews_at: null }))
  check('accepted -> 200', expired.status === 200, `got ${expired.status}`)
  s = await state()
  check('plan = free', s.plan === 'free', `got ${s.plan}`)
  check('plan_status = expired', s.plan_status === 'expired', `got ${s.plan_status}`)

  console.log('\n8. Unknown user is acknowledged, not retried forever')
  // Must miss on all three lookups — custom user id, subscription id, AND email —
  // so it needs its own subscription id and an address nobody owns.
  const orphan = await post({
    meta: { event_name: 'subscription_created', custom_data: { user_id: '99999999' } },
    data: {
      id: `test_sub_orphan_${Date.now()}`,
      attributes: {
        status: 'active',
        user_email: `nobody-${Date.now()}@example.invalid`,
        customer_id: 999002,
        renews_at: inDays(30),
      },
    },
  })
  check('unmatched user -> 200', orphan.status === 200, `got ${orphan.status}`)
  check('reports matched:false', orphan.body.includes('"matched":false'), orphan.body.slice(0, 120))
} finally {
  if (userId) {
    await q(`DELETE FROM users WHERE id = $1`, [userId])
    console.log(`\nCleaned up test user id=${userId}`)
  }
  await pool.end()
}

console.log(`\n${fail === 0 ? 'ALL CHECKS PASSED' : `${fail} FAILED`}  (${pass} passed)`)
process.exit(fail === 0 ? 0 : 1)
