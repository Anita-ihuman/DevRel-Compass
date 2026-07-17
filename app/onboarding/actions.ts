'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { pool } from '@/lib/db'

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/

export type UsernameState = { error: string } | null

export async function saveUsername(
  _prev: UsernameState,
  formData: FormData,
): Promise<UsernameState> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'You are not signed in.' }

  const username = String(formData.get('username') ?? '').trim()
  if (!USERNAME_RE.test(username)) {
    return { error: 'Use 3–30 characters: letters, numbers, or underscores.' }
  }

  // Case-insensitive uniqueness check (excluding the current user).
  const taken = await pool.query(
    'SELECT 1 FROM users WHERE lower(username) = lower($1) AND id <> $2',
    [username, session.user.id],
  )
  if (taken.rows.length > 0) return { error: 'That username is already taken.' }

  await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, session.user.id])
  redirect('/')
}
