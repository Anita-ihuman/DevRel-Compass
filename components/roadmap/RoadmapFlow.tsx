'use client'

import { useState } from 'react'
import { ROADMAP_PHASES } from '@/lib/roadmap-data'
import type { RoadmapGroup, RoadmapPhase } from '@/lib/roadmap-data'

// ─── Topic chip inside an expanded group ─────────────────────────────────────

function TopicRow({ title, desc, optional }: { title: string; desc: string; optional?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <button className="rf-topic" onClick={() => setOpen(v => !v)}>
      <div className="rf-topic-top">
        <span className="rf-topic-dot" />
        <span className="rf-topic-title">
          {title}
          {optional && <span className="rf-optional-tag">optional</span>}
        </span>
        <span className={`rf-topic-arrow${open ? ' rf-topic-arrow--open' : ''}`}>›</span>
      </div>
      {open && <p className="rf-topic-desc">{desc}</p>}
    </button>
  )
}

// ─── Individual group card ────────────────────────────────────────────────────

function GroupCard({ group, phaseColor }: { group: RoadmapGroup; phaseColor: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rf-group${open ? ' rf-group--open' : ''}`}
         style={{ '--phase-color': phaseColor } as React.CSSProperties}>
      <button className="rf-group-header" onClick={() => setOpen(v => !v)}>
        <div className="rf-group-header-left">
          <span className="rf-group-icon" style={{ color: phaseColor }}>{group.icon}</span>
          <div>
            <div className="rf-group-title">
              {group.title}
              {group.optional && <span className="rf-optional-tag">optional</span>}
            </div>
            <div className="rf-group-count">{group.topics.length} topics</div>
          </div>
        </div>
        <div className={`rf-group-chevron${open ? ' rf-group-chevron--open' : ''}`} style={{ color: phaseColor }}>
          {open ? '−' : '+'}
        </div>
      </button>

      {open && (
        <div className="rf-group-body">
          {group.topics.map((topic, i) => (
            <TopicRow key={i} title={topic.title} desc={topic.desc} optional={topic.optional} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Phase block ─────────────────────────────────────────────────────────────

function PhaseBlock({ phase }: { phase: RoadmapPhase }) {
  const isGrid = phase.layout === 'grid'
  return (
    <div className="rf-phase">
      {/* Phase header */}
      <div className="rf-phase-header" style={{ borderColor: phase.color + '44', background: phase.color + '0d' }}>
        <div className="rf-phase-num" style={{ color: phase.color, borderColor: phase.color + '44' }}>
          {phase.phase}
        </div>
        <div className="rf-phase-meta">
          <h3 className="rf-phase-title" style={{ color: phase.color }}>{phase.title}</h3>
          <p className="rf-phase-desc">{phase.description}</p>
        </div>
      </div>

      {/* Groups */}
      <div className={isGrid ? 'rf-groups-grid' : 'rf-groups-single'}>
        {phase.groups.map(group => (
          <GroupCard key={group.id} group={group} phaseColor={phase.color} />
        ))}
      </div>
    </div>
  )
}

// ─── Connector arrow between phases ──────────────────────────────────────────

function PhaseConnector({ color }: { color: string }) {
  return (
    <div className="rf-connector">
      <div className="rf-connector-line" style={{ borderColor: color + '55' }} />
      <div className="rf-connector-arrow" style={{ color: color + '88' }}>▼</div>
    </div>
  )
}

// ─── Expand/collapse all control ─────────────────────────────────────────────

// ─── Root component ───────────────────────────────────────────────────────────

export default function RoadmapFlow() {
  const totalTopics = ROADMAP_PHASES.reduce(
    (sum, p) => sum + p.groups.reduce((s, g) => s + g.topics.length, 0),
    0
  )
  const totalGroups = ROADMAP_PHASES.reduce((sum, p) => sum + p.groups.length, 0)

  return (
    <section className="rf-section">
      <div className="rf-section-inner">
        {/* Header */}
        <div className="rf-header">
          <h2 className="rf-header-title">Step-by-Step DevRel Career Roadmap</h2>
          <p className="rf-header-sub">
            A comprehensive, phase-by-phase guide covering every skill, tool, and concept
            you need to build a DevRel career — from first principles to leadership.
            Works for any background. Click any topic group to expand it.
          </p>
          <div className="rf-header-stats">
            <span className="rf-stat"><strong>{ROADMAP_PHASES.length}</strong> phases</span>
            <span className="rf-stat-sep">·</span>
            <span className="rf-stat"><strong>{totalGroups}</strong> topic groups</span>
            <span className="rf-stat-sep">·</span>
            <span className="rf-stat"><strong>{totalTopics}</strong> individual topics</span>
          </div>
        </div>

        {/* Phase blocks with connectors */}
        <div className="rf-flow">
          {ROADMAP_PHASES.map((phase, i) => (
            <div key={phase.id}>
              <PhaseBlock phase={phase} />
              {i < ROADMAP_PHASES.length - 1 && (
                <PhaseConnector color={ROADMAP_PHASES[i + 1].color} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
