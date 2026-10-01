'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ROADMAP_PHASES } from '@/lib/roadmap-data'
import { moduleHref, topicHref, topicKey, topicSlug } from '@/lib/lessons/paths'
import { TopicCheck } from '@/components/learn/Interactive'
import { useProgress } from '@/components/learn/progress'

// The DevRel career path drawn as a map. A trail winds from "any background"
// through the five phase regions to DevRel leadership; each skill module is a
// pin in its region, and a compass travels the trail to whichever phase you
// pick (starting at the first phase you haven't finished). The panel under the
// map lists every topic in the selected phase, each linking to its lesson.
//
// Coordinates are in the SVG's 1200×640 viewBox. A module without a position
// below is placed on a ring around its phase marker, so adding a roadmap group
// doesn't break the map — it just lands somewhere sensible until given a spot.

const W = 1200
const H = 640

const START = { x: 70, y: 575 }
const END = { x: 1150, y: 60 }

type Region = { cx: number; cy: number; rx: number; ry: number; label: { x: number; y: number } }

const PHASE_POS: Record<string, { x: number; y: number; region: Region }> = {
  foundation: { x: 225, y: 470, region: { cx: 215, cy: 480, rx: 165, ry: 120, label: { x: 250, y: 386 } } },
  'four-pillars': { x: 475, y: 320, region: { cx: 478, cy: 318, rx: 195, ry: 160, label: { x: 478, y: 470 } } },
  visibility: { x: 725, y: 470, region: { cx: 740, cy: 515, rx: 160, ry: 100, label: { x: 745, y: 524 } } },
  'open-source': { x: 905, y: 300, region: { cx: 885, cy: 262, rx: 115, ry: 88, label: { x: 885, y: 342 } } },
  advanced: { x: 1075, y: 175, region: { cx: 1065, cy: 195, rx: 130, ry: 150, label: { x: 1060, y: 226 } } },
}

const MODULE_POS: Record<string, { x: number; y: number }> = {
  'what-is-devrel': { x: 105, y: 395 },
  'technical-foundation': { x: 300, y: 560 },
  'content-creation': { x: 360, y: 225 },
  'community-building': { x: 585, y: 215 },
  'public-speaking': { x: 365, y: 420 },
  'developer-experience': { x: 590, y: 420 },
  'personal-brand': { x: 640, y: 575 },
  analytics: { x: 835, y: 565 },
  oss: { x: 820, y: 215 },
  'developer-marketing': { x: 975, y: 140 },
  'strategy-programs': { x: 1095, y: 300 },
}

// Smooth trail through start → each phase marker → end.
function trailPath(points: { x: number; y: number }[]): string {
  const [first, ...rest] = points
  let d = `M${first.x},${first.y}`
  let prev = first
  rest.forEach((p, i) => {
    // Alternate the bend so the trail snakes rather than zig-zags.
    const bend = i % 2 === 0 ? -1 : 1
    const mx = (prev.x + p.x) / 2
    const my = (prev.y + p.y) / 2 + bend * 70
    d += ` Q${mx},${my} ${p.x},${p.y}`
    prev = p
  })
  return d
}

type Pt = { x: number; y: number }

const PHASE_POINTS: Pt[] = ROADMAP_PHASES.map((p) => PHASE_POS[p.id] ?? { x: W / 2, y: H / 2 })
const TRAIL = trailPath([START, ...PHASE_POINTS, END])

function modulePos(phaseId: string, groupId: string, index: number, count: number): Pt {
  if (MODULE_POS[groupId]) return MODULE_POS[groupId]
  const c = PHASE_POS[phaseId] ?? { x: W / 2, y: H / 2 }
  const angle = (index / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2
  return { x: c.x + Math.cos(angle) * 110, y: c.y + Math.sin(angle) * 90 }
}

export default function CareerMap() {
  const progress = useProgress()
  const pathRef = useRef<SVGPathElement>(null)
  const [stops, setStops] = useState<number[]>([]) // trail length at each phase marker
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState(0)
  const [touched, setTouched] = useState(false)
  const [compass, setCompass] = useState<{ x: number; y: number; heading: number; at: number }>({
    x: START.x,
    y: START.y,
    heading: 0,
    at: 0,
  })


  // The learner's current phase: the first one with an unfinished topic.
  const currentPhase = useMemo(() => {
    const i = ROADMAP_PHASES.findIndex((p) =>
      p.groups.some((g) => g.topics.some((t) => !progress.topics[topicKey(p.id, g.id, t.title)])),
    )
    return i === -1 ? ROADMAP_PHASES.length - 1 : i
  }, [progress])

  // Follow progress until the visitor picks a phase themselves.
  useEffect(() => {
    if (!touched) setSelected(currentPhase)
  }, [currentPhase, touched])

  // Measure where each phase marker sits along the trail.
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    const samples = 600
    const found = PHASE_POINTS.map((pt) => {
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i <= samples; i++) {
        const l = (i / samples) * len
        const p = path.getPointAtLength(l)
        const dist = (p.x - pt.x) ** 2 + (p.y - pt.y) ** 2
        if (dist < bestDist) {
          bestDist = dist
          best = l
        }
      }
      return best
    })
    setTotal(len)
    setStops(found)
  }, [])

  // Walk the compass along the trail to the selected phase.
  useEffect(() => {
    const path = pathRef.current
    if (!path || !stops.length) return
    const from = compass.at
    const to = stops[selected]
    if (Math.abs(to - from) < 0.5) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 0 : Math.min(1600, 500 + Math.abs(to - from) * 1.1)
    const startTime = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = duration ? Math.min(1, (now - startTime) / duration) : 1
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      const at = from + (to - from) * eased
      const p = path.getPointAtLength(at)
      const ahead = path.getPointAtLength(Math.min(total, Math.max(0, at + (to > from ? 4 : -4))))
      const heading = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI + 90
      setCompass({ x: p.x, y: p.y, heading, at })
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, stops])

  function pick(i: number) {
    setTouched(true)
    setSelected(i)
  }

  const phase = ROADMAP_PHASES[selected]
  const travelled = stops.length ? stops[currentPhase] : 0

  return (
    <div className="cm">
      <div className="cm-frame">
        <svg className="cm-svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="DevRel career map">
          <defs>
            <filter id="cm-coast" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="34" />
            </filter>
            <pattern id="cm-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0H0V80" fill="none" stroke="#ffffff" strokeOpacity=".045" strokeWidth="1" />
            </pattern>
            <radialGradient id="cm-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="60%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity=".55" />
            </radialGradient>
          </defs>

          {/* Graticule */}
          <rect width={W} height={H} fill="url(#cm-grid)" className="cm-grid" />

          {/* Regions */}
          {ROADMAP_PHASES.map((p, i) => {
            const r = PHASE_POS[p.id]?.region
            if (!r) return null
            return (
              <g key={p.id} className={`cm-region${i === selected ? ' cm-region--on' : ''}`} style={{ '--phase-color': p.color } as React.CSSProperties}>
                <ellipse cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} filter="url(#cm-coast)" className="cm-region-land" />
                <text x={r.label.x} y={r.label.y} className="cm-region-name" textAnchor="middle">
                  {p.title.toUpperCase()}
                </text>
              </g>
            )
          })}

          {/* Trail: the whole route dashed, the part you've covered solid */}
          <path ref={pathRef} d={TRAIL} className="cm-trail" />
          {total > 0 && (
            <path d={TRAIL} className="cm-trail-done" strokeDasharray={`${travelled} ${total}`} />
          )}

          {/* Start and destination */}
          <g className="cm-start">
            <path d={`M${START.x - 9},${START.y - 9} l18,18 M${START.x + 9},${START.y - 9} l-18,18`} />
            <text x={START.x + 18} y={START.y + 26} className="cm-label">Start: any background</text>
          </g>
          <g className="cm-end">
            <path d={`M${END.x},${END.y + 22} V${END.y - 18} l22,8 -22,8`} />
            <text x={END.x - 14} y={END.y - 4} className="cm-label" textAnchor="end">DevRel leadership</text>
          </g>

          {/* Module pins */}
          {ROADMAP_PHASES.map((p) =>
            p.groups.map((g, gi) => {
              const pos = modulePos(p.id, g.id, gi, p.groups.length)
              return (
                <a key={g.id} href={moduleHref(p.id, g.id)} className="cm-pin" style={{ '--phase-color': p.color } as React.CSSProperties}>
                  <title>{`${g.title} — ${g.topics.length} topics. Open the lesson.`}</title>
                  <path
                    d={`M${pos.x},${pos.y} c-8,-12 -13,-18 -13,-25 a13,13 0 1 1 26,0 c0,7 -5,13 -13,25z`}
                    className="cm-pin-shape"
                  />
                  <text x={pos.x} y={pos.y - 21} className="cm-pin-icon" textAnchor="middle">{g.icon}</text>
                  <text x={pos.x} y={pos.y + 18} className="cm-pin-label" textAnchor="middle">{g.title}</text>
                </a>
              )
            }),
          )}

          {/* Phase markers on the trail */}
          {ROADMAP_PHASES.map((p, i) => {
            const pos = PHASE_POINTS[i]
            const on = i === selected
            return (
              <g
                key={p.id}
                className={`cm-stop${on ? ' cm-stop--on' : ''}${i < currentPhase ? ' cm-stop--done' : ''}`}
                style={{ '--phase-color': p.color } as React.CSSProperties}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`Phase ${p.phase}: ${p.title}`}
                onClick={() => pick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    pick(i)
                  }
                }}
              >
                <circle cx={pos.x} cy={pos.y} r={on ? 30 : 0} className="cm-stop-pulse" />
                <circle cx={pos.x} cy={pos.y} r={19} className="cm-stop-dot" />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="cm-stop-num">{p.phase}</text>
              </g>
            )
          })}

          {/* The traveling compass */}
          <g className="cm-compass" transform={`translate(${compass.x},${compass.y - 44})`} aria-hidden>
            <line x1="0" y1="18" x2="0" y2="30" className="cm-compass-tether" />
            <circle r="19" className="cm-compass-body" />
            <circle r="15" className="cm-compass-face" />
            <g transform={`rotate(${compass.heading})`}>
              <path d="M0,-12 L4,0 L0,3 L-4,0Z" className="cm-compass-north" />
              <path d="M0,12 L4,0 L0,-3 L-4,0Z" className="cm-compass-south" />
            </g>
            <circle r="1.8" className="cm-compass-pin" />
          </g>

          {/* Decorative compass rose */}
          <g className="cm-rose" transform={`translate(${W - 90},${H - 90})`} aria-hidden>
            <circle r="46" />
            <circle r="34" />
            <path d="M0,-58 L7,-7 L58,0 L7,7 L0,58 L-7,7 L-58,0 L-7,-7Z" />
            <text y="-64" textAnchor="middle">N</text>
          </g>

          <rect width={W} height={H} fill="url(#cm-vignette)" pointerEvents="none" />
        </svg>

        <div className="cm-hint" aria-hidden>
          Tap a numbered stop to move the compass · pins open module lessons
        </div>
      </div>

      {/* Phase chooser (also the accessible way to move the compass) */}
      <div className="cm-tabs" role="tablist" aria-label="Phases">
        {ROADMAP_PHASES.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === selected}
            className={`cm-tab${i === selected ? ' cm-tab--on' : ''}`}
            style={{ '--phase-color': p.color } as React.CSSProperties}
            onClick={() => pick(i)}
          >
            <span className="cm-tab-num">{p.phase}</span>
            {p.title}
            {i === currentPhase && <span className="cm-tab-here">you are here</span>}
          </button>
        ))}
      </div>

      {/* Everything you'll learn in the selected phase */}
      <div className="cm-panel" role="tabpanel" style={{ '--phase-color': phase.color } as React.CSSProperties}>
        <div className="cm-panel-head">
          <div>
            <div className="cm-panel-kicker">Phase {phase.phase} · prepares you for {phase.prepares}</div>
            <h2 className="cm-panel-title">{phase.title}</h2>
            <p className="cm-panel-desc">{phase.description}</p>
          </div>
          <Link href={`/playbook/${phase.id}`} className="cm-panel-cta">Get started here →</Link>
        </div>
        <div className="cm-panel-modules">
          {phase.groups.map((g) => (
            <div key={g.id} className="cm-module">
              <Link href={moduleHref(phase.id, g.id)} className="cm-module-title">
                <span aria-hidden>{g.icon}</span> {g.title}
                {g.optional && <span className="optional-tag">optional</span>}
              </Link>
              <ul>
                {g.topics.map((t) => (
                  <li key={topicSlug(t.title)}>
                    <Link href={topicHref(phase.id, g.id, t.title)} className="cm-topic">
                      <TopicCheck topicKey={topicKey(phase.id, g.id, t.title)} />
                      <span>{t.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
