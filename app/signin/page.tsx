import type { Metadata } from 'next'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false },
}

export default function SignInPage() {
  // Only offer social buttons that are actually configured, so nothing appears
  // broken before the OAuth apps are set up.
  const providers = {
    github: Boolean(process.env.AUTH_GITHUB_ID),
    google: Boolean(process.env.AUTH_GOOGLE_ID),
  }
  return (
    <div className="auth-wrap">
      <SignInForm providers={providers} />
    </div>
  )
}
