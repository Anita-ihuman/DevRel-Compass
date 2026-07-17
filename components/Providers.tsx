'use client'

import { SessionProvider } from 'next-auth/react'

// Client-side session context so components like the nav can read auth state
// without forcing every page to render dynamically.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
