import type { Metadata } from 'next'
import Link from 'next/link'
import { upcomingEvents } from '@/lib/events'

const EVENTS_DESCRIPTION =
  'Live sessions exploring DevRel strategy, tool adoption psychology, and developer program design — from practitioners who have built in the trenches.'

export const metadata: Metadata = {
  title: 'DevRel Strategy Room — Webinar Series',
  description: EVENTS_DESCRIPTION,
  alternates: { canonical: '/events' },
  // Without its own og:url, this page inherits the home page's og:url from the
  // layout — so shared /events links send people to the home page. Pin it here.
  openGraph: {
    type: 'website',
    url: '/events',
    title: 'DevRel Strategy Room — Webinar Series',
    description: EVENTS_DESCRIPTION,
  },
}

// ── Past webinars ──────────────────────────────────────────────────────────
// When you have the YouTube embed URLs, replace `embedUrl: null` with the URL.
// YouTube embed format: https://www.youtube.com/embed/VIDEO_ID
const pastWebinars: {
  num: string
  title: string
  description: string
  embedUrl: string | null
  tags: string[]
}[] = [
  {
    num: '01',
    title: 'DevRel Strategy Room — Session 1',
    description:
      'An in-depth conversation on how AI is influencing the way companies connect with developers and how DevRel, developer education, and marketing teams can adapt.',
    embedUrl: 'https://www.youtube.com/embed/thTnBiZToKE',
    tags: ['AI', 'DevRel', 'Marketing'],
  },
  {
    num: '02',
    title: 'DevRel Strategy Room — Session 2',
    description:
      'A deep dive into how AI is transforming the way developers and platform teams build, deploy, and operate production-grade cloud systems, from infrastructure provisioning to debugging and optimization.',
    embedUrl: 'https://www.youtube.com/embed/OvyBAJYrzw0',
    tags: ['AI', 'DevRel', 'Cloud'],
  },
]

export default function EventsPage() {
  return (
    <div className="ev-root">
      <style>{`
        .ev-wrap { max-width: 960px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }

        .ev-pill {
          display: inline-block;
          font-family: var(--ff-m);
          font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 8px;
          background: var(--glow); color: var(--accent);
          border: 1px solid var(--border2);
        }
        .ev-tag {
          font-family: var(--ff-m);
          font-size: 11px; padding: 3px 9px; border-radius: 6px;
          background: var(--glow); color: var(--accent);
          border: 1px solid var(--border2);
        }
        .ev-date {
          display: inline-block;
          font-family: var(--ff-m);
          font-size: 11px; padding: 3px 9px; border-radius: 6px;
          background: rgba(45,212,191,.12); color: var(--teal);
          border: 1px solid rgba(45,212,191,.35);
        }

        .ev-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--bg3);
        }
        .ev-embed {
          width: 100%; aspect-ratio: 16 / 9;
          background: var(--bg4);
          display: flex; align-items: center; justify-content: center;
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .ev-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

        .ev-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .ev-cta {
          display: inline-block;
          background: var(--accent);
          color: #fff;
          padding: .65rem 1.5rem; border-radius: 8px;
          font-size: 14px; font-weight: 600;
        }
        .ev-cta:hover { background: var(--accent2); }

        @media (max-width: 640px) { .ev-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ev-wrap">

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="ev-pill" style={{ marginBottom: '1.25rem' }}>
            Webinar Series · Season 2
          </span>

          <h1
            style={{
              fontFamily: 'var(--ff-d)',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              margin: '1.25rem 0 1rem',
              color: 'var(--text)',
            }}
          >
            DevRel <span style={{ color: 'var(--accent)' }}>Strategy Room</span>
          </h1>

          <p
            style={{
              maxWidth: 520,
              margin: '0 auto',
              color: 'var(--text2)',
              fontSize: '1.0625rem',
              lineHeight: 1.65,
            }}
          >
            Live sessions exploring DevRel strategy, tool adoption psychology, and developer
            program design — from the perspective of practitioners who have built in the trenches.
          </p>
        </div>

        {/* ── Past Webinars ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
              Past Sessions
            </h2>
            <span className="ev-tag">{pastWebinars.length} Sessions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {pastWebinars.map((w) => (
              <div key={w.num} className="ev-card">
                {/* Embed area */}
                <div className="ev-embed">
                  {w.embedUrl ? (
                    <iframe
                      src={w.embedUrl}
                      title={w.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text3)' }}>
                      <p style={{ fontSize: 13, margin: 0 }}>Video embed coming soon</p>
                      <p style={{ fontFamily: 'var(--ff-m)', fontSize: 11, marginTop: 4 }}>
                        Session {w.num}
                      </p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '.75rem' }}>
                    {w.tags.map((tag) => (
                      <span key={tag} className="ev-tag">{tag}</span>
                    ))}
                  </div>
                  <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: 'var(--text)' }}>
                    {w.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>
                    {w.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Upcoming Events ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--ff-d)', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
              Upcoming Sessions
            </h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="ev-grid">
              {upcomingEvents.map((e) => (
                <div key={e.title} className="ev-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <span className="ev-date" style={{ alignSelf: 'flex-start', marginBottom: '.75rem' }}>{e.date}</span>
                  <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: 16, fontWeight: 700, margin: '.75rem 0 6px', color: 'var(--text)' }}>
                    {e.title}
                  </h3>
                  {e.speaker && (
                    <p style={{ fontFamily: 'var(--ff-m)', fontSize: 12, color: 'var(--accent)', margin: '0 0 .75rem' }}>
                      with {e.speaker}
                    </p>
                  )}
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>
                    {e.description}
                  </p>
                  {e.link && (
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ev-cta"
                      style={{ alignSelf: 'flex-start', marginTop: '1.25rem' }}
                    >
                      Register →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '2.5rem 2rem',
                background: 'var(--bg2)',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontFamily: 'var(--ff-d)', fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: 'var(--text)' }}>
                Next session being scheduled
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 400, margin: '0 auto 1.25rem' }}>
                Season 2 of the DevRel Strategy Room is in the works.
              </p>
              <Link href="/" className="ev-cta">Back to DevRel Compass →</Link>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
