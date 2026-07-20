import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import UsernameForm from '@/components/auth/UsernameForm'

export const metadata: Metadata = {
  title: 'Choose a username',
  robots: { index: false },
}

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect('/signin')
  if (session.user.username) redirect('/')

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Choose your username</h1>
        <p className="auth-sub">
          This is how you&apos;ll appear on DevRel Compass. Letters, numbers, and underscores —
          3 to 30 characters.
        </p>
        <UsernameForm />
      </div>
    </div>
  )
}
