'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CAREER_STAGES, SKILLS } from '@/lib/constants'
import { getScoreColor, getScoreLabel } from '@/lib/utils'
import type { CareerStage } from '@/lib/constants'
import CareerPathSection from './CareerPathSection'

// ─── Mini skill bar for roadmap stage cards ───────────────────────────────────

function MiniBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="rm-mini-bar-track">
      <div
        className="rm-mini-bar-fill"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  )
}

// ─── Stage Card ───────────────────────────────────────────────────────────────

function StageCard({ stage, isOpen, onToggle, index }: {
  stage: CareerStage
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const isLast = index === 4

  return (
    <div className="stage-wrapper">
      {/* Timeline connector */}
      {!isLast && <div className="stage-connector" style={{ borderColor: stage.color + '33' }} />}

      <div className={`stage-card${isOpen ? ' stage-card--open' : ''}`}>
        {/* Accent line */}
        <div className="stage-accent" style={{ backgroundColor: stage.color }} />

        {/* Header — always visible */}
        <button className="stage-header" onClick={onToggle} aria-expanded={isOpen}>
          <div className="stage-header-left">
            <div className="stage-dot" style={{ backgroundColor: stage.color, boxShadow: `0 0 12px ${stage.color}66` }} />
            <div>
              <div className="stage-level" style={{ color: stage.color }}>{stage.level}</div>
              <div className="stage-years">{stage.years}</div>
            </div>
          </div>
          <div className="stage-header-right">
            <div className="stage-tagline">{stage.tagline}</div>
            <div className={`stage-chevron${isOpen ? ' stage-chevron--open' : ''}`}>›</div>
          </div>
        </button>

        {/* Expanded content */}
        {isOpen && (
          <div className="stage-body">
            <p className="stage-desc">{stage.description}</p>

            {/* Skill Profile */}
            <div className="stage-section">
                <div className="stage-section-title">Expected Skill Profile</div>
                <div className="stage-skills">
                  {SKILLS.map(skill => {
                    const score = stage.skills[skill.key] ?? 0
                    const color = getScoreColor(score)
                    return (
                      <div key={skill.key} className="stage-skill-row">
                        <span className="stage-skill-name">{skill.label}</span>
                        <div className="stage-skill-right">
                          <MiniBar score={score} color={color} />
                          <span className="stage-skill-score" style={{ color }}>{score}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>

            <div className="stage-companies">
              <span className="stage-companies-label">Where you&apos;ll find this role:</span>
              {stage.companies}
            </div>

            <div className="stage-cta">
              <Link href="/" className="stage-cta-link">
                Analyze your profile to see where you land on this map →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function RoadmapClient() {
  const [openStage, setOpenStage] = useState<string | null>('junior')

  function toggleStage(id: string) {
    setOpenStage(prev => (prev === id ? null : id))
  }

  return (
    <div className="roadmap-page">

      {/* Career map — a compass travels the path; every pin and topic links to its lesson */}
      <CareerPathSection />

      {/* Career Stages */}
      <section className="roadmap-section roadmap-section--dark">
        <div className="roadmap-section-inner">
          <div className="section-header">
            <h2 className="section-title">The 5 Career Stages</h2>
            <p className="section-sub">
              Click each stage to see the expected skill profile and where the role
              is typically found. Scores reflect the typical range
              for practitioners at that level based on real hiring signals.
            </p>
          </div>

          <div className="stages-timeline">
            {CAREER_STAGES.map((stage, i) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={i}
                isOpen={openStage === stage.id}
                onToggle={() => toggleStage(stage.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="roadmap-cta-section">
        <div className="roadmap-cta-inner">
          <h2 className="roadmap-cta-title">Find Out Where You Stand</h2>
          <p className="roadmap-cta-sub">
            Upload your resume and get a precision score across all 8 dimensions —
            with a personalized roadmap to get you to the next level.
          </p>
          <Link href="/" className="roadmap-cta-btn">
            Analyze My DevRel Profile
            <span>→</span>
          </Link>
        </div>
      </section>

    </div>
  )
}
