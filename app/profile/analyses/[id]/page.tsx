import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { getAnalysisById, isPaidPlan } from '@/lib/usage'
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
  // Viewing saved analyses is a paid perk — send free users back to the profile.
  if (!isPaidPlan(session.user.plan)) redirect('/profile')

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
