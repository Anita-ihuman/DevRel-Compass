// Single source of truth for the site's canonical URL and identity, shared by
// the root layout, sitemap, and robots so they never disagree.
//
// Prefer an explicit domain (NEXT_PUBLIC_APP_URL) — set it to your real domain
// for stable canonical URLs — else the Vercel-provided production/deploy URL,
// else localhost for dev.
const rawSiteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:3000'

// Tolerate a value set without a scheme (e.g. "devrelcompass.com") — otherwise
// `new URL(siteUrl)` in metadataBase throws and fails the build. Also strip any
// trailing slash so URLs concatenate cleanly.
export const siteUrl = (
  /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`
).replace(/\/+$/, '')

export const siteName = 'DevRel Compass'

export const siteDescription =
  'Open-source career development platform for Developer Relations practitioners. Skills assessment, career roadmap, and resources.'
