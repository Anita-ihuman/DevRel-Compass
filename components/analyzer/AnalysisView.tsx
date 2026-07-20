'use client'

import { useRouter } from 'next/navigation'
import ResultsScreen from './ResultsScreen'
import type { AnalysisResult } from '@/types'

// Renders a saved analysis from history using the same rich results view. The
// "start over" action returns to the analyzer to run a new one.
export default function AnalysisView({ data, hasJD }: { data: AnalysisResult; hasJD: boolean }) {
  const router = useRouter()
  return <ResultsScreen data={data} hasJD={hasJD} onReset={() => router.push('/')} />
}
