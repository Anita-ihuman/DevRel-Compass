// Single source of truth for the site's canonical URL and identity, shared by
// the root layout, sitemap, and robots so they never disagree.
//
// Prefer an explicit domain (NEXT_PUBLIC_APP_URL) — set it to your real domain
// for stable canonical URLs — else the Vercel-provided production/deploy URL,
// else localhost for dev.
export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:3000'

export const siteName = 'DevRel Compass'

export const siteDescription =
  'Open-source career development platform for Developer Relations practitioners. Skills assessment, career roadmap, and resources.'
