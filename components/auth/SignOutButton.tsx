'use client'

import { signOut } from 'next-auth/react'

// Lives on the profile page, alongside history and billing — the one place
// account actions belong. The nav only links here.
export default function SignOutButton() {
  return (
    <button type="button" className="profile-signout" onClick={() => signOut({ redirectTo: '/' })}>
      Sign out
    </button>
  )
}
