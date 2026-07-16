import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

// Generated at /robots.txt — allow all crawlers and point them to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
