import type { Metadata } from 'next'
import Link from 'next/link'
import { ROADMAP_PHASES } from '@/lib/roadmap-data'
import { getPhaseLesson, moduleHref, topicHref, topicKey } from '@/lib/lessons'
import { Markdown, moduleKeys } from '@/components/learn/Content'
import { ModuleCardProgress, ProgressSummary, TopicCheck } from '@/components/learn/Interactive'
import PhaseNav from '@/components/learn/PhaseNav'

const DESCRIPTION =
  'How do I get into DevRel? Every lesson in the DevRel career roadmap in one place — five phases, from what DevRel is to leading a DevRel team.'

export const metadata: Metadata = {
  title: 'DevRel Playbook — How do I get into DevRel?',
  description: DESCRIPTION,
  alternates: { canonical: '/playbook' },
  openGraph: { type: 'website', url: '/playbook', title: 'DevRel Playbook — How do I get into DevRel?', description: DESCRIPTION },
}

// Every roadmap phase with its lesson, in order. The build already guarantees
// each phase has one (assertLessonsCoverRoadmap in the lesson routes).
const PHASES = ROADMAP_PHASES.map((phase) => ({ phase, lesson: getPhaseLesson(phase.id)! }))

export default function DevRelLibraryPage() {
  const allKeys = PHASES.flatMap(({ phase, lesson }) => lesson.modules.map((m) => moduleKeys(phase.id, m)))
  const totalTopics = ROADMAP_PHASES.reduce((n, p) => n + p.groups.reduce((m, g) => m + g.topics.length, 0), 0)

  return (
    <div className="ls-page">
      <div className="ls-wrap ls-wrap--wide">
        <header className="ls-hero">
          <div className="hero-badge">DevRel Playbook</div>
          <h1 className="ls-title">
            How do I get <span className="hero-accent">into DevRel?</span>
          </h1>
          <p className="ls-lede">
            Work through five phases, in order. Start by understanding what Developer Relations is
            and building a technical baseline. Then learn the four core skills, build visibility,
            get involved in open source and grow into strategy and leadership. Every topic has a
            lesson, and every skill module follows <strong>Learn → Resources → Challenge</strong>.
          </p>
          <div className="ls-hero-meta">
            <span><strong>{ROADMAP_PHASES.length}</strong> phases</span>
            <span aria-hidden>·</span>
            <span><strong>{allKeys.length}</strong> skill modules</span>
            <span aria-hidden>·</span>
            <span><strong>{totalTopics}</strong> lessons</span>
            <span aria-hidden>·</span>
            <Link href="/roadmap">See it on the career map →</Link>
          </div>
          <ProgressSummary modules={allKeys} color="var(--accent)" label="Your progress through the library" />
        </header>

        <div className="lib-layout">
          <PhaseNav
            items={ROADMAP_PHASES.map((p) => ({
              id: p.id,
              phase: p.phase,
              title: p.title,
              color: p.color,
              modules: p.groups.map((g) => ({ id: g.id, title: g.title })),
            }))}
          />

          <div className="lib-main">
            {PHASES.map(({ phase, lesson }) => (
              <section
                key={phase.id}
                id={phase.id}
                className="lib-phase"
                style={{ '--phase-color': phase.color } as React.CSSProperties}
              >
                <div className="ls-phase-pill">Phase {phase.phase} of {ROADMAP_PHASES.length}</div>
                <h2 className="lib-phase-title">{phase.title}</h2>
                <p className="lib-phase-prepares">
                  Prepares you for: <strong>{phase.prepares}</strong> · {lesson.duration}
                </p>
                <p className="ls-lede">{phase.description}</p>

                <details className="lib-context">
                  <summary>Read the context for this phase</summary>
                  <Markdown source={lesson.intro} />
                </details>

                <div className="ls-outcomes">
                  <div className="ls-outcomes-title">By the end of this phase you&apos;ll be able to</div>
                  <ul>
                    {lesson.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>

                <div className="lib-modules">
                  {lesson.modules.map((m, i) => {
                    const group = phase.groups.find((g) => g.id === m.groupId)!
                    return (
                      <article key={m.groupId} id={`${phase.id}-${group.id}`} className="ls-module-card lib-module">
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
                        <ModuleCardProgress module={moduleKeys(phase.id, m)} color={phase.color} />

                        <ol className="ls-topic-list lib-topic-grid">
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

                <Link href={`/playbook/${phase.id}`} className="lib-phase-link">
                  Open the Phase {phase.phase} overview →
                </Link>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
