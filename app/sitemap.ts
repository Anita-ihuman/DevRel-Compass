import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { getAllPosts } from '@/lib/blog'
import { getAllIssues } from '@/lib/newsletter'

// Generated at /sitemap.xml — lists every indexable route (static pages, blog
// posts, newsletter issues) so search engines can discover and crawl the whole
// site. Draft issues are excluded: getAllIssues already filters them out.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/roadmap', '/events', '/blog', '/newsletter'].map((path) => ({
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

  const issueRoutes = getAllIssues().map((issue) => ({
    url: `${siteUrl}/newsletter/${issue.meta.slug}`,
    lastModified: issue.meta.date ? new Date(issue.meta.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...issueRoutes]
}
