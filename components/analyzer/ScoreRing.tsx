'use client'

import { useState, useEffect } from 'react'
import { getScoreColor } from '@/lib/utils'

interface Props {
  score: number
  size?: number
  strokeWidth?: number
}

export default function ScoreRing({ score, size = 140, strokeWidth = 12 }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circ = radius * 2 * Math.PI
  const offset = circ - (displayed / 100) * circ
  const color = getScoreColor(score)

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(score), 80)
    return () => clearTimeout(t)
  }, [score])

  return (
    <svg width={size} height={size} className="score-ring" aria-label={`Score: ${score} out of 100`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a2e" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text
        x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.22}
        fontFamily="'Space Mono', monospace" fontWeight="700"
      >
        {Math.round(displayed)}
      </text>
      <text
        x="50%" y="65%" textAnchor="middle" dominantBaseline="middle"
        fill="#5a5a7a" fontSize={size * 0.1}
        fontFamily="'Inter', sans-serif"
      >
        / 100
      </text>
    </svg>
  )
}
