import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllIssues, formatIssueDate } from '@/lib/newsletter'
import SubscribeForm from '@/components/newsletter/SubscribeForm'

const NEWSLETTER_DESCRIPTION =
  'A newsletter on Developer Relations and developer experience — practical writing, useful resources, and what is actually moving in the industry.'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: NEWSLETTER_DESCRIPTION,
  alternates: { canonical: '/newsletter' },
  openGraph: {
    type: 'website',
    url: '/newsletter',
    title: 'The DevRel Compass Newsletter',
    description: NEWSLETTER_DESCRIPTION,
  },
}

// Confirm and unsubscribe both redirect back here with ?state=… so the reader
// lands on a real page instead of a bare JSON response.
const BANNERS: Record<string, { tone: 'ok' | 'warn'; text: string }> = {
  confirmed: {
    tone: 'ok',
    text: "You're subscribed. The next issue will land in your inbox.",
  },
  unsubscribed: {
    tone: 'ok',
    text: "You've been unsubscribed. No further issues will be sent.",
  },
  invalid: {
    tone: 'warn',
    text: 'That link is no longer valid. Subscribe again below if you meant to.',
  },
  error: {
    tone: 'warn',
    text: "Something went wrong on our end. Please try again in a moment.",
  },
}

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const { state } = await searchParams
  const banner = state ? BANNERS[state] : undefined
  const issues = getAllIssues()

  return (
    <div className="bl-wrap">
      <header className="bl-hero">
        <span className="bl-pill">The DevRel Compass Newsletter</span>
        <h1 className="bl-hero-title">
          DevRel &amp; <span style={{ color: 'var(--accent)' }}>Developer Experience</span>
        </h1>
        <p className="bl-hero-sub">
          Writing on Developer Relations and developer experience — practical lessons,
          resources worth your time, and what&apos;s actually moving in the industry.
          Free, and always will be.
        </p>
      </header>

      {banner && (
        <div className={`nl-banner nl-banner--${banner.tone}`} role="status">
          {banner.text}
        </div>
      )}

      <div className="nl-signup">
        <SubscribeForm />
      </div>

      <h2 className="bl-section-title">Past issues</h2>

      {issues.length === 0 ? (
        <p className="bl-empty">
          The first issue is on its way — subscribe above and you won&apos;t miss it.
        </p>
      ) : (
        <div className="bl-grid">
          {issues.map((i) => (
            <Link key={i.meta.slug} href={`/newsletter/${i.meta.slug}`} className="bl-card">
              <div className="bl-card-body">
                <div className="bl-card-meta">
                  <span className="bl-tag">
                    Issue {String(i.meta.issue).padStart(2, '0')}
                  </span>
                  {i.meta.date && <span className="bl-date">{formatIssueDate(i.meta.date)}</span>}
                </div>
                <h2 className="bl-card-title">{i.meta.title}</h2>
                <p className="bl-card-desc">{i.meta.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
