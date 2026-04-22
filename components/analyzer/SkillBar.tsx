'use client'

import { useState, useEffect } from 'react'
import { getScoreColor, getScoreLabel } from '@/lib/utils'
import type { SkillMeta } from '@/types'

interface Props {
  skill: SkillMeta
  score: number
  delay?: number
}

export default function SkillBar({ skill, score, delay = 0 }: Props) {
  const [width, setWidth] = useState(0)
  const color = getScoreColor(score)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 120 + delay)
    return () => clearTimeout(t)
  }, [score, delay])

  return (
    <div className="skill-bar-item">
      <div className="skill-bar-header">
        <span className="skill-bar-label">{skill.label}</span>
        <div className="skill-bar-meta">
          <span className="skill-bar-level" style={{ color }}>{getScoreLabel(score)}</span>
          <span className="skill-bar-score" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}66`,
            transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          }}
        />
      </div>
      <p className="skill-bar-hint">{skill.hint}</p>
    </div>
  )
}
