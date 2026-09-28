// Confirms every external link in the lessons still
// resolves, and that every YouTube video exists (via YouTube's oEmbed endpoint,
// which returns an error for removed or private videos).
//
//   npm run check:links
//
// URLs are pulled out of the source with regexes rather than by importing the
// TypeScript, so this runs on plain Node with no build step.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['lib/lessons', 'lib/events.ts']

function files(p) {
  try {
    if (statSync(p).isFile()) return [p]
  } catch {
    return []
  }
  return readdirSync(p).flatMap((f) => files(join(p, f)))
}

const urls = new Set()
for (const f of ROOTS.flatMap(files).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/url:\s*'(https?:\/\/[^']+)'/g)) urls.add(m[1])
  for (const m of src.matchAll(/yt\('([\w-]{11})'\)/g)) urls.add(`https://www.youtube.com/watch?v=${m[1]}`)
  for (const m of src.matchAll(/videoId:\s*'([\w-]{11})'/g)) urls.add(`https://www.youtube.com/watch?v=${m[1]}`)
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'

async function check(url) {
  const isYouTube = /youtube\.com\/watch\?v=/.test(url)
  const target = isYouTube
    ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`
    : url
  for (const method of isYouTube ? ['GET'] : ['HEAD', 'GET']) {
    try {
      const res = await fetch(target, {
        method,
        redirect: 'follow',
        headers: { 'user-agent': UA },
        signal: AbortSignal.timeout(20_000),
      })
      if (res.ok) return { url, ok: true, status: res.status }
      // Some sites reject HEAD or bots but serve the page to browsers.
      if (method === 'HEAD') continue
      return { url, ok: false, status: res.status }
    } catch (e) {
      if (method === 'HEAD') continue
      return { url, ok: false, status: e instanceof Error ? e.message : String(e) }
    }
  }
  return { url, ok: false, status: 'unknown' }
}

const list = [...urls].sort()
const results = []
for (let i = 0; i < list.length; i += 8) {
  results.push(...(await Promise.all(list.slice(i, i + 8).map(check))))
}

const failed = results.filter((r) => !r.ok)
console.log(`Checked ${results.length} links — ${results.length - failed.length} ok, ${failed.length} failed.`)
for (const f of failed) console.log(`  ✗ ${f.status}  ${f.url}`)
// 403/429 usually mean bot protection rather than a dead link — report but
// only fail on everything else.
const hard = failed.filter((f) => f.status !== 403 && f.status !== 429)
process.exit(hard.length ? 1 : 0)
