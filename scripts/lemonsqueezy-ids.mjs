// Prints the Lemon Squeezy store and variant IDs this app needs.
//
//   npm run ls:ids
//
// Reads LEMONSQUEEZY_API_KEY from .env.local so the key never has to be typed
// on a command line (where it would end up in shell history or a transcript).
//
// Run it again after switching Lemon Squeezy out of test mode: test and live
// objects are separate, with different IDs.

import fs from 'fs'
import path from 'path'

const API = 'https://api.lemonsqueezy.com/v1'
const ENV_FILE = '.env.local'

function readEnv() {
  const file = path.join(process.cwd(), ENV_FILE)
  if (!fs.existsSync(file)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
      }),
  )
}

async function get(pathname, apiKey) {
  const res = await fetch(`${API}${pathname}`, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`GET ${pathname} failed (${res.status}). ${detail.slice(0, 300)}`)
  }
  return res.json()
}

const money = (cents, currency = 'USD') =>
  typeof cents === 'number' ? `${(cents / 100).toFixed(2)} ${currency}` : '—'

const env = readEnv()
const apiKey = env.LEMONSQUEEZY_API_KEY

if (!apiKey) {
  console.error(
    `\nNo LEMONSQUEEZY_API_KEY found in ${ENV_FILE}.\n\n` +
      `Create a key in Lemon Squeezy (Settings -> API), then add this line to ${ENV_FILE}:\n\n` +
      `  LEMONSQUEEZY_API_KEY=your_key_here\n\n` +
      `and run this again.\n`,
  )
  process.exit(1)
}

try {
  const stores = await get('/stores', apiKey)
  console.log('\nSTORES')
  if (stores.data.length === 0) {
    console.log('  (none — create a store in Lemon Squeezy first)')
  }
  for (const s of stores.data) {
    console.log(`  LEMONSQUEEZY_STORE_ID=${s.id}   ${s.attributes.name} (${s.attributes.domain})`)
  }

  const [products, variants] = await Promise.all([
    get('/products', apiKey),
    get('/variants', apiKey),
  ])
  // Purchasability is a property of the PRODUCT, not the variant. Lemon Squeezy
  // leaves the auto-created default variant of a single-price product at status
  // 'pending' even when the product is published and selling — so checking the
  // variant's own status reports a perfectly good setup as broken.
  const productById = Object.fromEntries(
    products.data.map((p) => [String(p.id), p.attributes]),
  )

  console.log('\nVARIANTS')
  if (variants.data.length === 0) {
    console.log('  (none — create a subscription product priced at $5/month)')
  }

  let match = null
  for (const v of variants.data) {
    const a = v.attributes
    const p = productById[String(a.product_id)]
    const product = p?.name ?? `product ${a.product_id}`
    const published = p?.status === 'published'
    const interval = a.interval ? `every ${a.interval_count ?? 1} ${a.interval}` : 'one-time'
    const flags = []
    if (!published) flags.push(`PRODUCT NOT PUBLISHED (${p?.status ?? 'unknown'})`)
    if (!a.is_subscription) flags.push('NOT A SUBSCRIPTION')
    console.log(
      `  id=${v.id}  ${product} / ${a.name}  ${money(a.price)}  ${interval}` +
        `  [product: ${p?.status ?? '?'}]` +
        (flags.length ? `  <-- ${flags.join(', ')}` : ''),
    )
    if (a.is_subscription && a.price === 500 && a.interval === 'month' && published) {
      match = v.id
    }
  }

  console.log('')
  if (match) {
    console.log(`Matched a published $5/month subscription:\n`)
    console.log(`  LEMONSQUEEZY_VARIANT_MONTHLY=${match}\n`)
  } else {
    console.log(
      'No $5.00/month subscription found on a published product.\n' +
        'The app advertises $5/month in lib/plan.ts, so the variant must match —\n' +
        'check the price is 500 cents, the interval is monthly, and the PRODUCT is\n' +
        'published. A variant of its own showing "pending" is normal and fine.\n',
    )
  }
} catch (e) {
  console.error(`\n${e.message}\n`)
  console.error(
    'A 401 means the key is wrong or was created in the other mode —\n' +
      'test-mode and live-mode keys are not interchangeable.\n',
  )
  process.exit(1)
}
