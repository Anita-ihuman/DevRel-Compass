import NextAuth, { type NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import PostgresAdapter from '@auth/pg-adapter'
import { pool } from '@/lib/db'
import { isAdmin } from '@/lib/admin'

// Social logins are added only when their OAuth apps are configured, so the app
// runs fine before you set them up. allowDangerousEmailAccountLinking lets the
// same person use magic link, GitHub, or Google and land on ONE account — safe
// here because GitHub and Google both return verified emails.
const providers: NextAuthConfig['providers'] = [
  Resend({
    apiKey: process.env.AUTH_RESEND_KEY,
    from: process.env.AUTH_EMAIL_FROM || 'onboarding@resend.dev',
  }),
]
if (process.env.AUTH_GITHUB_ID) {
  providers.push(GitHub({ allowDangerousEmailAccountLinking: true }))
}
if (process.env.AUTH_GOOGLE_ID) {
  providers.push(Google({ allowDangerousEmailAccountLinking: true }))
}

// Auth.js (NextAuth v5) — passwordless magic-link auth over Neon Postgres.
// AUTH_SECRET, AUTH_RESEND_KEY, and DATABASE_URL are read from the environment.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: 'database' },
  pages: { signIn: '/signin' },
  providers,
  callbacks: {
    async session({ session, user }) {
      // The default pg adapter doesn't return custom columns, so attach the id
      // and (separately fetched) username onto the session for the app to use.
      session.user.id = user.id
      try {
        const { rows } = await pool.query('SELECT username, plan FROM users WHERE id = $1', [user.id])
        session.user.username = rows[0]?.username ?? null
        session.user.plan = rows[0]?.plan ?? 'free'
      } catch {
        session.user.username = null
        session.user.plan = 'free'
      }
      session.user.isAdmin = isAdmin(session.user.email)
      return session
    },
  },
})
