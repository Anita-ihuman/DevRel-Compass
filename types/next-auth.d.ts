import type { DefaultSession } from 'next-auth'

// Extend the session user with our app-specific fields (see the session
// callback in auth.ts).
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string | null
      plan: string
      isAdmin: boolean
    } & DefaultSession['user']
  }
}
