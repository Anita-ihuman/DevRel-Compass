import Link from 'next/link'

// Shown when an anonymous visitor has used their one free analysis. Signing in
// unlocks the second free analysis, and the first one carries over into the
// account (see lib/carryover.ts).
export default function SignInGate() {
  return (
    <div className="credits-page">
      <div className="credits-header">
        <div className="credits-icon">✦</div>
        <h2 className="credits-title">Sign in to run your next analysis</h2>
        <p className="credits-sub">
          Create a free account to get your second free analysis. We&apos;ll keep the one
          you just ran, too — it moves into your account when you sign in. It only takes
          a few seconds, no password needed.
        </p>
      </div>
      <Link href="/signin" className="retry-btn">Sign in / Create account →</Link>
      <p className="credits-note">
        <Link href="/pricing">See plans and pricing</Link>
      </p>
    </div>
  )
}
