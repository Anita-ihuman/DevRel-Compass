import Link from 'next/link'
import { upcomingEvents } from '@/lib/events'

// Landing-page highlight of the next few webinars. Renders nothing when there
// are no upcoming events, so it never shows an empty block.
export default function HomeUpcomingEvents() {
  if (upcomingEvents.length === 0) return null

  // Show at most the next 3 on the homepage; the Events page has the full list.
  const events = upcomingEvents.slice(0, 3)

  return (
    <section className="home-events">
      <div className="home-events-inner">
        <div className="home-events-head">
          <div>
            <span className="home-events-pill">Upcoming Webinars</span>
            <h2 className="home-events-title">
              DevRel <span style={{ color: 'var(--accent)' }}>Strategy Room</span>
            </h2>
          </div>
          <Link href="/events" className="home-events-all">All events →</Link>
        </div>

        <div className="home-events-grid">
          {events.map((e) => (
            <div key={e.title} className="home-event-card">
              <span className="home-event-date">{e.date}</span>
              <h3 className="home-event-title">{e.title}</h3>
              {e.speaker && <p className="home-event-speaker">with {e.speaker}</p>}
              {e.link && (
                <a
                  href={e.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-event-cta"
                >
                  Register →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
