'use client'

import { useState } from 'react'
import {
  useProgress,
  setTopicDone,
  setChallengeDone,
  type Progress,
} from './progress'

// Everything interactive on the lesson pages lives here, so the pages
// themselves stay server components and the lesson text renders without JS.

// ─── Progress maths ──────────────────────────────────────────────────────────

export type ModuleKeys = {
  /** `${phaseId}/${groupId}` */
  moduleKey: string
  topicKeys: string[]
}

function moduleStats(p: Progress, m: ModuleKeys) {
  const topicsDone = m.topicKeys.filter((k) => p.topics[k]).length
  const challengeDone = Boolean(p.challenges[m.moduleKey])
  // Topics and the challenge are the units of progress.
  const total = m.topicKeys.length + 1
  const done = topicsDone + (challengeDone ? 1 : 0)
  return { topicsDone, challengeDone, total, done }
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="ls-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}>
      <div className="ls-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

/** Progress across all modules of a phase (or the whole roadmap). */
export function ProgressSummary({ modules, color, label }: { modules: ModuleKeys[]; color: string; label: string }) {
  const p = useProgress()
  let done = 0
  let total = 0
  let challenges = 0
  for (const m of modules) {
    const s = moduleStats(p, m)
    done += s.done
    total += s.total
    if (s.challengeDone) challenges++
  }
  const pct = total ? (done / total) * 100 : 0
  return (
    <div className="ls-progress">
      <div className="ls-progress-top">
        <span className="ls-progress-label">{label}</span>
        <span className="ls-progress-num" style={{ color }}>{Math.round(pct)}%</span>
      </div>
      <Bar value={pct} color={color} />
      <div className="ls-progress-meta">
        {done} of {total} steps · {challenges} of {modules.length} Compass Challenges complete
      </div>
    </div>
  )
}

/** Compact progress line for a module card on the phase page. */
export function ModuleCardProgress({ module, color }: { module: ModuleKeys; color: string }) {
  const p = useProgress()
  const s = moduleStats(p, module)
  const pct = (s.done / s.total) * 100
  return (
    <div className="ls-card-progress">
      <Bar value={pct} color={color} />
      <span>
        {s.topicsDone}/{module.topicKeys.length} topics
        {s.challengeDone ? ' · challenge ✓' : ''}
      </span>
    </div>
  )
}

/** A checkmark next to a topic in a list or table of contents. */
export function TopicCheck({ topicKey }: { topicKey: string }) {
  const p = useProgress()
  const done = Boolean(p.topics[topicKey])
  return (
    <span className={`ls-check${done ? ' ls-check--on' : ''}`} aria-label={done ? 'Completed' : 'Not completed'}>
      {done ? '✓' : ''}
    </span>
  )
}

export function TopicDoneButton({ topicKey }: { topicKey: string }) {
  const p = useProgress()
  const done = Boolean(p.topics[topicKey])
  return (
    <button
      type="button"
      className={`ls-done-btn${done ? ' ls-done-btn--on' : ''}`}
      aria-pressed={done}
      onClick={() => setTopicDone(topicKey, !done)}
    >
      {done ? '✓ Completed' : 'Mark as complete'}
    </button>
  )
}

// ─── Compass Challenge ───────────────────────────────────────────────────────

export function ChallengeDoneButton({ moduleKey }: { moduleKey: string }) {
  const p = useProgress()
  const done = Boolean(p.challenges[moduleKey])
  return (
    <button
      type="button"
      className={`ls-challenge-btn${done ? ' ls-challenge-btn--on' : ''}`}
      aria-pressed={done}
      onClick={() => setChallengeDone(moduleKey, !done)}
    >
      {done ? '🧭 Challenge complete' : 'Mark challenge complete'}
    </button>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="ls-copy-btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          // Clipboard blocked — the template is still selectable on the page.
        }
      }}
    >
      {copied ? 'Copied ✓' : 'Copy template'}
    </button>
  )
}
