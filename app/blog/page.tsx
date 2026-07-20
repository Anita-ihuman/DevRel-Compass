import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Essays and field notes on Developer Relations — career growth, developer education, community, and systems thinking for DevRel practitioners.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blog',
    description:
      'Essays and field notes on Developer Relations — career growth, developer education, community, and systems thinking for DevRel practitioners.',
  },
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="bl-wrap">
      <header className="bl-hero">
        <span className="bl-pill">The DevRel Compass Blog</span>
        <h1 className="bl-hero-title">
          Notes on <span style={{ color: 'var(--accent)' }}>Developer Relations</span>
        </h1>
        <p className="bl-hero-sub">
          Essays and field notes on building a DevRel career — developer education, community,
          and systems thinking from the trenches.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="bl-empty">No posts yet — check back soon.</p>
      ) : (
        <div className="bl-grid">
          {posts.map((p) => (
            <Link key={p.meta.slug} href={`/blog/${p.meta.slug}`} className="bl-card">
              {p.meta.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="bl-card-img" src={p.meta.thumbnail} alt="" loading="lazy" />
              )}
              <div className="bl-card-body">
                <div className="bl-card-meta">
                  {p.meta.tag && <span className="bl-tag">{p.meta.tag}</span>}
                  {p.meta.date && <span className="bl-date">{formatDate(p.meta.date)}</span>}
                </div>
                <h2 className="bl-card-title">{p.meta.title}</h2>
                <p className="bl-card-desc">{p.meta.description}</p>
                {p.meta.author && <p className="bl-card-author">By {p.meta.author}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
