import Link from 'next/link'

export default function LimitReached() {
  return (
    <div className="credits-page">
      <div className="credits-header">
        <div className="credits-icon">✦</div>
        <h2 className="credits-title">You&apos;ve used your 3 free analyses</h2>
        <p className="credits-sub">
          DevRel Compass is free while we&apos;re in beta, and paid plans are coming
          soon. Check back shortly to run more resume analyses — in the meantime,
          explore your career roadmap.
        </p>
      </div>
      <Link href="/roadmap" className="retry-btn">Explore the Career Roadmap →</Link>
    </div>
  )
}
