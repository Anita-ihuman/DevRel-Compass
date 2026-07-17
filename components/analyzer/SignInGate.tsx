import Link from 'next/link'

// Shown when an anonymous visitor has used their one free analysis — nudges
// them to create an account (which grants more free analyses + saved history).
export default function SignInGate() {
  return (
    <div className="credits-page">
      <div className="credits-header">
        <div className="credits-icon">✦</div>
        <h2 className="credits-title">You&apos;ve used your free analysis</h2>
        <p className="credits-sub">
          Create a free account to run more DevRel skills analyses and keep a saved
          history of your results. It only takes a few seconds — no password needed.
        </p>
      </div>
      <Link href="/signin" className="retry-btn">Sign in / Create account →</Link>
    </div>
  )
}
