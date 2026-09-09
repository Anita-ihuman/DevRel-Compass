import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { getAnalysisById, getEntitlement } from '@/lib/usage'
import AnalysisView from '@/components/analyzer/AnalysisView'

export const metadata: Metadata = {
  title: 'Saved analysis',
  robots: { index: false },
}

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/signin')
  // Viewing saved analyses is a paid perk. Check the entitlement rather than the
  // session's cached plan, so a subscription that has run out actually locks up
  // — the session can outlive the billing period it was issued under.
  const { paid } = await getEntitlement(session.user.id)
  if (!paid) redirect('/profile')

  const { id } = await params
  const row = await getAnalysisById(session.user.id, id)
  if (!row) notFound()

  return (
    <div>
      <div className="profile-backbar">
        <Link href="/profile" className="bl-back">← Your analyses</Link>
      </div>
      <AnalysisView data={row.result} hasJD={row.has_job_fit} />
    </div>
  )
}
