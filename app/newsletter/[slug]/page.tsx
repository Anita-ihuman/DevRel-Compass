import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { getAllIssues, getIssueBySlug, formatIssueDate } from '@/lib/newsletter'
import { siteUrl, siteName } from '@/lib/site'
import SubscribeForm from '@/components/newsletter/SubscribeForm'

// Only published issues get a page — a draft has no URL to leak.
export function generateStaticParams() {
  return getAllIssues().map((i) => ({ slug: i.meta.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const issue = getIssueBySlug(slug)
  if (!issue || issue.meta.draft) return { title: 'Issue not found' }
  const { title, description } = issue.meta
  return {
    title,
    description,
    alternates: { canonical: `/newsletter/${issue.meta.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/newsletter/${issue.meta.slug}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const issue = getIssueBySlug(slug)
  if (!issue || issue.meta.draft) notFound()

  const html = await marked.parse(issue.content)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: issue.meta.title,
    description: issue.meta.description,
    author: { '@type': 'Organization', name: issue.meta.author },
    datePublished: issue.meta.date || undefined,
    url: `${siteUrl}/newsletter/${issue.meta.slug}`,
    publisher: { '@type': 'Organization', name: siteName, logo: `${siteUrl}/icon` },
  }

  return (
    <div className="bl-wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <article className="bl-post">
        <Link href="/newsletter" className="bl-back">← All issues</Link>

        <header className="bl-post-head">
          <div className="bl-card-meta">
            <span className="bl-tag">Issue {String(issue.meta.issue).padStart(2, '0')}</span>
            {issue.meta.date && (
              <span className="bl-date">{formatIssueDate(issue.meta.date)}</span>
            )}
          </div>
          <h1 className="bl-post-title">{issue.meta.title}</h1>
        </header>

        <div className="bl-prose" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="bl-post-foot">
          <div className="nl-signup nl-signup--inline">
            <p className="nl-signup-pitch">
              Get the next issue in your inbox.
            </p>
            <SubscribeForm source="issue-footer" />
          </div>
          <Link href="/newsletter" className="bl-back">← Back to all issues</Link>
        </footer>
      </article>
    </div>
  )
}
