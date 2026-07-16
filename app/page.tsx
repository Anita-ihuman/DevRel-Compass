import type { Metadata } from 'next'
import AnalyzerClient from '@/components/analyzer/AnalyzerClient'

export const metadata: Metadata = {
  title: 'DevRel Skills Analyzer',
  description:
    'Upload your resume and get a precision assessment of all 8 DevRel skill dimensions — benchmarked against global standards from CNCF, Google, AWS, Stripe, Twilio, and HashiCorp.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <AnalyzerClient />
}
