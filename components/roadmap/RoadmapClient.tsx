'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CAREER_STAGES, ENTRY_PATHS, SKILLS } from '@/lib/constants'
import { getScoreColor, getScoreLabel } from '@/lib/utils'
import type { CareerStage } from '@/lib/constants'
import RoadmapFlow from './RoadmapFlow'

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

            <div className="stage-grid">
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

              {/* Milestones + Activities */}
              <div className="stage-section">
                <div className="stage-section-title">Key Milestones</div>
                <ul className="stage-list">
                  {stage.milestones.map((m, i) => (
                    <li key={i} className="stage-list-item" style={{ '--dot-color': stage.color } as React.CSSProperties}>
                      {m}
                    </li>
                  ))}
                </ul>

                <div className="stage-section-title" style={{ marginTop: '1.25rem' }}>Typical Activities</div>
                <ul className="stage-list">
                  {stage.activities.map((a, i) => (
                    <li key={i} className="stage-list-item stage-list-item--dim" style={{ '--dot-color': stage.color } as React.CSSProperties}>
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="stage-companies">
                  <span className="stage-companies-label">Where you&apos;ll find this role:</span>
                  {stage.companies}
                </div>
              </div>
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
  const [openEntry, setOpenEntry] = useState<number | null>(null)

  function toggleStage(id: string) {
    setOpenStage(prev => (prev === id ? null : id))
  }

  function toggleEntry(i: number) {
    setOpenEntry(prev => (prev === i ? null : i))
  }

  return (
    <div className="roadmap-page">

      {/* Hero */}
      <section className="roadmap-hero">
        <div className="roadmap-hero-inner">
          <div className="hero-badge">DevRel Compass</div>
          <h1 className="roadmap-hero-title">
            Your Path<br />
            <span className="hero-accent">into DevRel</span>
          </h1>
          <p className="roadmap-hero-sub">
            A complete, step-by-step career map for anyone breaking into or growing in
            Developer Relations — covering every skill, milestone, and transition point
            from first principles to leadership. Start from any background, at any level.
          </p>
          <div className="roadmap-hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">5</span>
              <span className="hero-stat-label">Entry Paths</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">5</span>
              <span className="hero-stat-label">Career Stages</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">1</span>
              <span className="hero-stat-label">Path to DevRel</span>
            </div>
          </div>
          <Link href="/" className="roadmap-hero-cta">
            Analyze Your Profile
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Entry Paths */}
      <section className="roadmap-section">
        <div className="roadmap-section-inner">
          <div className="section-header">
            <h2 className="section-title">Where DevRel Practitioners Come From</h2>
            <p className="section-sub">
              DevRel is one of the most interdisciplinary roles in tech. People arrive
              from five main backgrounds — each with different strengths and gaps to close.
            </p>
          </div>

          <div className="entry-grid">
            {ENTRY_PATHS.map((path, i) => (
              <div key={i} className={`entry-card${openEntry === i ? ' entry-card--open' : ''}`}>
                <button className="entry-header" onClick={() => toggleEntry(i)}>
                  <span className="entry-icon">{path.icon}</span>
                  <div className="entry-header-info">
                    <div className="entry-from">From {path.from}</div>
                    <div className="entry-timeline">{path.timeline}</div>
                  </div>
                  <div className={`entry-chevron${openEntry === i ? ' entry-chevron--open' : ''}`}>›</div>
                </button>
                {openEntry === i && (
                  <div className="entry-body">
                    <p className="entry-desc">{path.description}</p>
                    <div className="entry-bridge-label">Skills to bridge:</div>
                    <div className="entry-bridge-tags">
                      {path.bridgeSkills.map((s, j) => (
                        <span key={j} className="bridge-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Stages */}
      <section className="roadmap-section roadmap-section--dark">
        <div className="roadmap-section-inner">
          <div className="section-header">
            <h2 className="section-title">The 5 Career Stages</h2>
            <p className="section-sub">
              Click each stage to see the expected skill profile, key milestones,
              and the activities that define the role. Scores reflect the typical range
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

      {/* Comprehensive step-by-step roadmap */}
      <RoadmapFlow />

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
