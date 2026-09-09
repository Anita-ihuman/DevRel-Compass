import type { Metadata } from 'next'
import AnalyzerClient from '@/components/analyzer/AnalyzerClient'
import HomeUpcomingEvents from '@/components/HomeUpcomingEvents'

export const metadata: Metadata = {
  title: 'DevRel Skills Analyzer',
  description:
    'Upload your resume and get a precision assessment of all 8 DevRel skill dimensions — benchmarked against global standards from CNCF, Google, AWS, Stripe, Twilio, and HashiCorp.',
  alternates: { canonical: '/' },
}

// The upcoming-webinars strip drops sessions once their date passes, so this
// page can't be frozen at build time or it keeps advertising finished sessions.
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <AnalyzerClient />
      <HomeUpcomingEvents />
    </>
  )
}
