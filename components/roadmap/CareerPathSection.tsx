import { ROADMAP_PHASES } from '@/lib/roadmap-data'
import CareerMap from './CareerMap'

// First section of the roadmap page: the DevRel career path as a map, with a
// compass that travels between the phases (see CareerMap).

const totalTopics = ROADMAP_PHASES.reduce((n, p) => n + p.groups.reduce((m, g) => m + g.topics.length, 0), 0)
const totalModules = ROADMAP_PHASES.reduce((n, p) => n + p.groups.length, 0)

export default function CareerPathSection() {
  return (
    <section className="ct-section" aria-labelledby="ct-title">
      <div className="ct-head">
        <div className="hero-badge">DevRel Compass</div>
        <h1 id="ct-title" className="ct-title">
          Your Path <span className="hero-accent">into DevRel</span>
        </h1>
        <p className="ct-sub">
          Everything it takes to grow a Developer Relations career, and everything you&apos;ll learn
          on the way: {ROADMAP_PHASES.length} phases, {totalModules} skill modules and {totalTopics} topics.
          Follow the compass from any background to DevRel leadership, and click any pin or topic
          to open its lesson.
        </p>
      </div>

      <CareerMap />
    </section>
  )
}
