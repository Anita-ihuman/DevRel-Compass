import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ROADMAP_PHASES } from '@/lib/roadmap-data'
import {
  assertLessonsCoverRoadmap,
  getPhaseLesson,
  getRoadmapPhase,
  moduleHref,
  topicHref,
  topicKey,
} from '@/lib/lessons'
import { Markdown, moduleKeys } from '@/components/learn/Content'
import { ModuleCardProgress, ProgressSummary, TopicCheck } from '@/components/learn/Interactive'

export const dynamicParams = false

export function generateStaticParams() {
  // Fail the build if a roadmap topic has no lesson (or vice versa).
  assertLessonsCoverRoadmap()
  return ROADMAP_PHASES.map((p) => ({ phase: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ phase: string }> }): Promise<Metadata> {
  const { phase: phaseId } = await params
  const phase = getRoadmapPhase(phaseId)
  if (!phase) return { title: 'Lesson not found' }
  const title = `Phase ${phase.phase}: ${phase.title} — DevRel Roadmap`
  return {
    title,
    description: phase.description,
    alternates: { canonical: `/roadmap/${phase.id}` },
    openGraph: { type: 'article', url: `/roadmap/${phase.id}`, title, description: phase.description },
  }
}

const STEPS = ['Learn', 'Resources', 'Challenge']

export default async function PhaseLessonPage({ params }: { params: Promise<{ phase: string }> }) {
  const { phase: phaseId } = await params
  const phase = getRoadmapPhase(phaseId)
  const lesson = getPhaseLesson(phaseId)
  if (!phase || !lesson) notFound()

  const index = ROADMAP_PHASES.findIndex((p) => p.id === phase.id)
  const prev = ROADMAP_PHASES[index - 1]
  const next = ROADMAP_PHASES[index + 1]
  const keys = lesson.modules.map((m) => moduleKeys(phase.id, m))
  const topicCount = phase.groups.reduce((n, g) => n + g.topics.length, 0)

  return (
    <div className="ls-page" style={{ '--phase-color': phase.color } as React.CSSProperties}>
      <div className="ls-wrap">
        <nav className="ls-crumbs" aria-label="Breadcrumb">
          <Link href="/roadmap">Career Roadmap</Link>
          <span aria-hidden>/</span>
          <span>Phase {phase.phase}</span>
        </nav>

        {/* ── Hero ── */}
        <header className="ls-hero">
          <div className="ls-phase-pill">Phase {phase.phase} of {ROADMAP_PHASES.length}</div>
          <h1 className="ls-title">{phase.title}</h1>
          <p className="ls-lede">{phase.description}</p>
          <div className="ls-hero-meta">
            <span><strong>{phase.groups.length}</strong> skill modules</span>
            <span aria-hidden>·</span>
            <span><strong>{topicCount}</strong> topics</span>
            <span aria-hidden>·</span>
            <span>{lesson.duration}</span>
          </div>
          <ProgressSummary modules={keys} color={phase.color} label="Your progress in this phase" />
        </header>

        {/* ── Phase context lesson ── */}
        <section className="ls-section">
          <h2 className="ls-h2">About this phase</h2>
          <Markdown source={lesson.intro} />
          <div className="ls-outcomes">
            <div className="ls-outcomes-title">By the end of this phase you&apos;ll be able to</div>
            <ul>
              {lesson.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Modules ── */}
        <section className="ls-section">
          <h2 className="ls-h2">Skill modules</h2>
          <p className="ls-section-sub">
            Each module follows the same path —{' '}
            {STEPS.map((s, i) => (
              <span key={s}>
                <strong>{s}</strong>
                {i < STEPS.length - 1 ? ' → ' : ''}
              </span>
            ))}
            . Work through them in order, or jump to the one you need.
          </p>

          <div className="ls-modules">
            {lesson.modules.map((m, i) => {
              const group = phase.groups.find((g) => g.id === m.groupId)!
              return (
                <article key={m.groupId} className="ls-module-card">
                  <div className="ls-module-head">
                    <span className="ls-module-icon" aria-hidden>{group.icon}</span>
                    <div>
                      <div className="ls-module-num">
                        Module {i + 1}
                        {group.optional && <span className="optional-tag">optional</span>}
                      </div>
                      <h3 className="ls-module-title">
                        <Link href={moduleHref(phase.id, group.id)}>{group.title}</Link>
                      </h3>
                    </div>
                  </div>
                  <p className="ls-module-question">{m.question}</p>
                  <ModuleCardProgress module={keys[i]} color={phase.color} />

                  <ol className="ls-topic-list">
                    {group.topics.map((t) => (
                      <li key={t.title}>
                        <Link href={topicHref(phase.id, group.id, t.title)} className="ls-topic-link">
                          <TopicCheck topicKey={topicKey(phase.id, group.id, t.title)} />
                          <span>
                            <span className="ls-topic-link-title">{t.title}</span>
                            <span className="ls-topic-link-desc">{t.desc}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>

                  <div className="ls-module-foot">
                    <span className="ls-module-challenge">🧭 Challenge: {m.challenge.title}</span>
                    <Link href={moduleHref(phase.id, group.id)} className="ls-btn">
                      Start module →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── Phase navigation ── */}
        <nav className="ls-pager" aria-label="Phases">
          {prev ? (
            <Link href={`/roadmap/${prev.id}`} className="ls-pager-link">
              <span className="ls-pager-dir">← Previous phase</span>
              <span className="ls-pager-title">{prev.phase} · {prev.title}</span>
            </Link>
          ) : (
            <Link href="/roadmap" className="ls-pager-link">
              <span className="ls-pager-dir">← Back to</span>
              <span className="ls-pager-title">Career Roadmap</span>
            </Link>
          )}
          {next ? (
            <Link href={`/roadmap/${next.id}`} className="ls-pager-link ls-pager-link--next">
              <span className="ls-pager-dir">Next phase →</span>
              <span className="ls-pager-title">{next.phase} · {next.title}</span>
            </Link>
          ) : (
            <Link href="/library" className="ls-pager-link ls-pager-link--next">
              <span className="ls-pager-dir">Keep learning →</span>
              <span className="ls-pager-title">DevRel Playbook</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
