import Link from 'next/link'

export default function LimitReached() {
  return (
    <div className="credits-page">
      <div className="credits-header">
        <div className="credits-icon">✦</div>
        <h2 className="credits-title">You&apos;ve used your free analyses</h2>
        <p className="credits-sub">
          Thanks for trying DevRel Compass! Paid plans with more analyses are coming
          soon. In the meantime, revisit your saved analyses or explore your career
          roadmap.
        </p>
      </div>
      <Link href="/roadmap" className="retry-btn">Explore the Career Roadmap →</Link>
    </div>
  )
}
