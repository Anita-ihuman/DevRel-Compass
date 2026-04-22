'use client'

import { useState } from 'react'
import ScoreRing from './ScoreRing'
import JobFitTab from './JobFitTab'
import SkillsTab from './SkillsTab'
import RoadmapTab from './RoadmapTab'
import type { AnalysisResult } from '@/types'

interface Props {
  data: AnalysisResult
  hasJD: boolean
  onReset: () => void
}

type TabId = 'jobfit' | 'skills' | 'roadmap'

export default function ResultsScreen({ data, hasJD, onReset }: Props) {
  const defaultTab: TabId = hasJD ? 'jobfit' : 'skills'
  const [tab, setTab] = useState<TabId>(defaultTab)

  const tabs: Array<{ id: TabId; label: string }> = [
    ...(hasJD ? [{ id: 'jobfit' as TabId, label: 'Job Fit Analysis' }] : []),
    { id: 'skills', label: 'DevRel Skills Assessment' },
    { id: 'roadmap', label: 'Growth Roadmap' },
  ]

  return (
    <div className="results-screen">
      <div className="results-header">
        <div className="rh-topbar">
          <button className="back-btn" onClick={onReset}>← New Analysis</button>
          <span className="rh-brand">DevRel Hub · Skills Analyzer</span>
        </div>
        <div className="rh-main">
          <div className="rh-identity">
            <h2 className="rh-name">{data.candidateName}</h2>
            <span className="rh-level">{data.careerLevel}</span>
          </div>
          <div className="rh-rings">
            <div className="rh-ring-item">
              <ScoreRing score={data.overallScore} size={88} strokeWidth={8} />
              <span className="rh-ring-label">DevRel Score</span>
            </div>
            {hasJD && data.fitScore !== null && (
              <div className="rh-ring-item">
                <ScoreRing score={data.fitScore} size={88} strokeWidth={8} />
                <span className="rh-ring-label">Job Fit</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Unmount/remount on switch so animations replay */}
      <div className="tab-content">
        {tab === 'jobfit'  && hasJD && <JobFitTab  data={data} />}
        {tab === 'skills'  && <SkillsTab  data={data} />}
        {tab === 'roadmap' && <RoadmapTab data={data} />}
      </div>
    </div>
  )
}
