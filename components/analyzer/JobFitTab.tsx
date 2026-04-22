'use client'

import { useState, useEffect } from 'react'
import { getFitBadge, getFitLabelColor } from '@/lib/utils'
import ScoreRing from './ScoreRing'
import type { AnalysisResult } from '@/types'

function AnimBar({ score, color }: { score: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200)
    return () => clearTimeout(t)
  }, [score])
  return (
    <div className="req-bar-track">
      <div style={{
        width: `${width}%`, backgroundColor: color,
        height: '100%', borderRadius: '2px',
        transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

interface Props {
  data: AnalysisResult
}

export default function JobFitTab({ data }: Props) {
  return (
    <div className="tab-pane">
      <div className="top-strength">
        <span className="ts-label">⚡ Top Strength</span>
        <p className="ts-text">{data.topStrength}</p>
      </div>

      <div className="fit-row">
        {data.fitScore !== null && (
          <div className="fit-ring-block">
            <ScoreRing score={data.fitScore} size={110} strokeWidth={10} />
            <div className="fit-label-text" style={{ color: getFitLabelColor(data.fitLabel ?? '') }}>
              {data.fitLabel}
            </div>
            <div className="fit-sub">Job Fit Score</div>
          </div>
        )}
        <div className="verdict-block">
          <div className="section-eyebrow">Verdict</div>
          <p className="verdict-text">{data.verdict}</p>
        </div>
      </div>

      <div className="sg-grid">
        <div className="sg-card sg-green">
          <div className="sg-title">Strengths</div>
          <ul className="sg-list">
            {data.strengths.map((s, i) => (
              <li key={i} className="sg-item sg-item-green">{s}</li>
            ))}
          </ul>
        </div>
        <div className="sg-card sg-red">
          <div className="sg-title">Gaps</div>
          <ul className="sg-list">
            {data.gaps.map((g, i) => (
              <li key={i} className="sg-item sg-item-red">{g}</li>
            ))}
          </ul>
        </div>
      </div>

      {data.jobFit && data.jobFit.length > 0 && (
        <div>
          <div className="section-eyebrow" style={{ marginBottom: '1rem' }}>Requirement Breakdown</div>
          <div className="req-list">
            {data.jobFit.map((item, i) => {
              const badge = getFitBadge(item.score)
              return (
                <div key={i} className="req-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="req-header">
                    <span className="req-label">{item.label}</span>
                    <div className="req-right">
                      <span className="req-badge"
                        style={{ background: badge.color + '22', color: badge.color, borderColor: badge.color + '55' }}>
                        {badge.label}
                      </span>
                      <span className="req-score" style={{ color: badge.color }}>{item.score}</span>
                    </div>
                  </div>
                  <AnimBar score={item.score} color={badge.color} />
                  <p className="req-desc">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
