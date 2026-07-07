'use client'

import { useEffect, useState } from 'react'
import { LOADING_MESSAGES } from '@/lib/constants'

// Ease-out cadence: steps advance quickly at first, then slow down so the list
// doesn't run out before the (~30s) analysis returns. The final step stays
// "active" until the parent unmounts this screen — it never falsely completes.
const STEP_DELAYS = [2600, 3400, 4200, 5200, 6500] // ms between each of the 5 transitions

export default function LoadingScreen() {
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndex = LOADING_MESSAGES.length - 1

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0
    // Schedule advancing up to the last step, then hold there.
    for (let i = 0; i < lastIndex; i++) {
      elapsed += STEP_DELAYS[Math.min(i, STEP_DELAYS.length - 1)]
      timers.push(setTimeout(() => setActiveIndex(i + 1), elapsed))
    }
    return () => timers.forEach(clearTimeout)
  }, [lastIndex])

  return (
    <div className="loading-screen">
      <h2 className="loading-title">Analyzing your DevRel profile</h2>

      <ul className="loading-steps">
        {LOADING_MESSAGES.map((label, i) => {
          const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending'
          return (
            <li key={label} className={`loading-step loading-step--${state}`}>
              <span className="step-icon">
                {state === 'done' && <span className="step-check">✓</span>}
                {state === 'active' && <span className="step-spinner" />}
                {state === 'pending' && <span className="step-dot" />}
              </span>
              <span className="step-label">{label}</span>
            </li>
          )
        })}
      </ul>

      <p className="loading-note">Typically 20–35 seconds — hang tight</p>
    </div>
  )
}
