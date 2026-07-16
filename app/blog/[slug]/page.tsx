import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { siteUrl, siteName } from '@/lib/site'
import ShareBar from '@/components/blog/ShareBar'
import LikeButton from '@/components/blog/LikeButton'

// Pre-render every post at build time.
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.meta.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post not found' }
  const { title, description, thumbnail } = post.meta
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.meta.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.meta.slug}`,
      images: thumbnail ? [thumbnail] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const html = await marked.parse(post.content)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta.title,
    description: post.meta.description,
    author: post.meta.author ? { '@type': 'Person', name: post.meta.author } : undefined,
    datePublished: post.meta.date || undefined,
    image: post.meta.thumbnail ? `${siteUrl}${post.meta.thumbnail}` : undefined,
    url: `${siteUrl}/blog/${post.meta.slug}`,
    publisher: { '@type': 'Organization', name: siteName, logo: `${siteUrl}/icon` },
  }

  return (
    <div className="bl-wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <article className="bl-post">
        <Link href="/blog" className="bl-back">← All posts</Link>

        <header className="bl-post-head">
          <div className="bl-card-meta">
            {post.meta.tag && <span className="bl-tag">{post.meta.tag}</span>}
            {post.meta.date && <span className="bl-date">{formatDate(post.meta.date)}</span>}
          </div>
          <h1 className="bl-post-title">{post.meta.title}</h1>
          {post.meta.author && <p className="bl-post-author">By {post.meta.author}</p>}
          <div className="bl-actions">
            <LikeButton slug={post.meta.slug} />
            <ShareBar title={post.meta.title} slug={post.meta.slug} />
          </div>
        </header>

        <div className="bl-prose" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="bl-post-foot">
          <Link href="/blog" className="bl-back">← Back to all posts</Link>
        </footer>
      </article>
    </div>
  )
}
