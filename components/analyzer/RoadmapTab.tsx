'use client'

import { useState, useEffect } from 'react'
import type { AnalysisResult, RoadmapAction } from '@/types'

const TIMEFRAME_META: Record<string, { label: string; sub: string }> = {
  '0–3 months':  { label: 'Now',   sub: '0–3 Months'  },
  '3–6 months':  { label: 'Soon',  sub: '3–6 Months'  },
  '6–12 months': { label: 'Later', sub: '6–12 Months' },
}

const PRIORITY_COLOR: Record<string, string> = {
  High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e',
}

const ORDERED_FRAMES = ['0–3 months', '3–6 months', '6–12 months']

interface Props {
  data: AnalysisResult
}

export default function RoadmapTab({ data }: Props) {
  const byFrame = ORDERED_FRAMES.reduce<Record<string, RoadmapAction[]>>((acc, tf) => {
    acc[tf] = (data.roadmap ?? []).filter(r => r.timeframe === tf)
    return acc
  }, {})

  return (
    <div className="tab-pane">
      {ORDERED_FRAMES.map(tf => {
        const items = byFrame[tf]
        if (!items.length) return null
        const meta = TIMEFRAME_META[tf]
        return (
          <div key={tf} className="rm-group">
            <div className="rm-group-header">
              <span className="rm-group-label">{meta.label}</span>
              <span className="rm-group-sub">{meta.sub}</span>
            </div>
            <div className="rm-items">
              {items.map((item, i) => (
                <RoadmapCard key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RoadmapCard({ item, index }: { item: RoadmapAction; index: number }) {
  const color = PRIORITY_COLOR[item.priority] ?? '#9090b0'
  return (
    <div className="rm-card" style={{ animationDelay: `${index * 0.09}s` }}>
      <div className="rm-card-top">
        <span
          className="priority-badge"
          style={{ background: color + '22', color, borderColor: color + '55' }}
        >
          {item.priority}
        </span>
        <span className="rm-tf">{item.timeframe}</span>
      </div>
      <h4 className="rm-action">{item.action}</h4>
      <p className="rm-why">
        <span className="rm-why-label">Why: </span>{item.why}
      </p>
      <div className="rm-resource">
        <span className="rm-resource-icon">↗</span>
        <span className="rm-resource-text">{item.resource}</span>
      </div>
    </div>
  )
}
