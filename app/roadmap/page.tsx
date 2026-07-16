import type { Metadata } from 'next'
import RoadmapClient from '@/components/roadmap/RoadmapClient'

export const metadata: Metadata = {
  title: 'DevRel Career Roadmap',
  description:
    'A comprehensive guide to the 5 stages of a Developer Relations career — skills, milestones, and what good looks like at each level.',
  alternates: { canonical: '/roadmap' },
}

export default function RoadmapPage() {
  return <RoadmapClient />
}
