import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { getAllPosts } from '@/lib/blog'

// Generated at /sitemap.xml — lists every indexable route (static pages + blog
// posts) so search engines can discover and crawl the whole site.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/roadmap', '/events', '/blog'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const postRoutes = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.meta.slug}`,
    lastModified: post.meta.date ? new Date(post.meta.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes]
}
