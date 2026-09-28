import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  allModuleRefs,
  assertLessonsCoverRoadmap,
  getModuleContext,
  moduleHref,
  topicKey,
  topicSlug,
} from '@/lib/lessons'
import { Markdown, ResourceList, moduleKeys } from '@/components/learn/Content'
import {
  ChallengeDoneButton,
  CopyButton,
  ProgressSummary,
  TopicCheck,
  TopicDoneButton,
} from '@/components/learn/Interactive'

export const dynamicParams = false

export function generateStaticParams() {
  assertLessonsCoverRoadmap()
  return allModuleRefs().map(({ phase, group }) => ({ phase: phase.id, skill: group.id }))
}

type Params = Promise<{ phase: string; skill: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { phase, skill } = await params
  const ctx = getModuleContext(phase, skill)
  if (!ctx) return { title: 'Lesson not found' }
  const title = `${ctx.group.title} — DevRel Roadmap Lesson`
  const description = `${ctx.module.question} Lessons, curated resources and a Compass Challenge.`
  return {
    title,
    description,
    alternates: { canonical: moduleHref(phase, skill) },
    openGraph: { type: 'article', url: moduleHref(phase, skill), title, description },
  }
}

// The template is stored as a fenced block so it renders as code; the copy
// button hands over just the inside.
function unfence(template: string): string {
  return template.trim().replace(/^```\w*\n/, '').replace(/\n```$/, '')
}

const SECTIONS = [
  { id: 'learn', label: 'Learn' },
  { id: 'resources', label: 'Resources' },
  { id: 'challenge', label: 'Challenge' },
]

export default async function SkillModulePage({ params }: { params: Params }) {
  const { phase: phaseId, skill } = await params
  const ctx = getModuleContext(phaseId, skill)
  if (!ctx) notFound()
  const { phase, group, module, prev, next } = ctx
  const keys = moduleKeys(phase.id, module)

  return (
    <div className="ls-page" style={{ '--phase-color': phase.color } as React.CSSProperties}>
      <div className="ls-wrap ls-wrap--wide">
        <nav className="ls-crumbs" aria-label="Breadcrumb">
          <Link href="/roadmap">Career Roadmap</Link>
          <span aria-hidden>/</span>
          <Link href={`/roadmap/${phase.id}`}>Phase {phase.phase}: {phase.title}</Link>
          <span aria-hidden>/</span>
          <span>{group.title}</span>
        </nav>

        <header className="ls-hero">
          <div className="ls-phase-pill">
            <span aria-hidden>{group.icon}</span> {phase.title}
            {group.optional && <span className="optional-tag">optional</span>}
          </div>
          <h1 className="ls-title">{group.title}</h1>
          <p className="ls-lede">{module.question}</p>
          <ProgressSummary modules={[keys]} color={phase.color} label="Your progress in this module" />
        </header>

        <nav className="ls-steps" aria-label="Lesson sections">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="ls-step">
              <span className="ls-step-num">{i + 1}</span>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="ls-layout">
          {/* ── Sidebar TOC ── */}
          <aside className="ls-toc" aria-label="Topics in this module">
            <div className="ls-toc-title">Topics</div>
            <ol>
              {module.topics.map((t) => (
                <li key={t.title}>
                  <a href={`#${topicSlug(t.title)}`}>
                    <TopicCheck topicKey={topicKey(phase.id, group.id, t.title)} />
                    <span>{t.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="ls-toc-title">Then</div>
            <ol>
              {SECTIONS.slice(1).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="ls-check" aria-hidden />
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="ls-main">
            {/* ── 1. Learn ── */}
            <section id="learn" className="ls-block">
              <div className="ls-block-label">Step 1 · Learn</div>
              <h2 className="ls-h2">{module.question}</h2>
              <Markdown source={module.overview} />
            </section>

            {module.topics.map((t, i) => {
              const key = topicKey(phase.id, group.id, t.title)
              return (
                <article key={t.title} id={topicSlug(t.title)} className="ls-topic">
                  <div className="ls-topic-num">
                    Topic {i + 1} of {module.topics.length}
                  </div>
                  <h3 className="ls-topic-title">{t.title}</h3>
                  <Markdown source={t.body} />
                  <div className="ls-takeaways">
                    <div className="ls-takeaways-title">Key takeaways</div>
                    <ul>
                      {t.takeaways.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="ls-topic-resources">
                    <div className="ls-mini-title">Go deeper</div>
                    <ResourceList resources={t.resources} compact />
                  </div>
                  <TopicDoneButton topicKey={key} />
                </article>
              )
            })}

            {/* ── 2. Resources ── */}
            <section id="resources" className="ls-block">
              <div className="ls-block-label">Step 2 · Resources</div>
              <h2 className="ls-h2">The {group.title} shortlist</h2>
              <p className="ls-section-sub">
                If you only read or watch a handful of things on {group.title.toLowerCase()}, make it these.
              </p>
              <ResourceList resources={module.resources} />
            </section>

            {/* ── 3. Compass Challenge ── */}
            <section id="challenge" className="ls-block ls-challenge">
              <div className="ls-block-label">Step 3 · 🧭 Compass Challenge</div>
              <h2 className="ls-h2">{module.challenge.title}</h2>
              <div className="ls-challenge-part">
                <div className="ls-mini-title">The prompt</div>
                <Markdown source={module.challenge.prompt} />
              </div>
              <div className="ls-challenge-part">
                <div className="ls-template-head">
                  <div className="ls-mini-title">The template</div>
                  <CopyButton text={unfence(module.challenge.template)} />
                </div>
                <Markdown source={module.challenge.template} className="ls-prose ls-template" />
              </div>
              <div className="ls-challenge-part">
                <ChallengeDoneButton moduleKey={keys.moduleKey} />
              </div>
            </section>

            <nav className="ls-pager" aria-label="Modules">
              {prev ? (
                <Link href={moduleHref(prev.phase.id, prev.group.id)} className="ls-pager-link">
                  <span className="ls-pager-dir">← Previous module</span>
                  <span className="ls-pager-title">{prev.group.title}</span>
                </Link>
              ) : (
                <Link href={`/roadmap/${phase.id}`} className="ls-pager-link">
                  <span className="ls-pager-dir">← Back to</span>
                  <span className="ls-pager-title">Phase {phase.phase} overview</span>
                </Link>
              )}
              {next ? (
                <Link
                  href={next.phase.id === phase.id ? moduleHref(next.phase.id, next.group.id) : `/roadmap/${next.phase.id}`}
                  className="ls-pager-link ls-pager-link--next"
                >
                  <span className="ls-pager-dir">
                    {next.phase.id === phase.id ? 'Next module →' : `Next: Phase ${next.phase.phase} →`}
                  </span>
                  <span className="ls-pager-title">
                    {next.phase.id === phase.id ? next.group.title : next.phase.title}
                  </span>
                </Link>
              ) : (
                <Link href="/library" className="ls-pager-link ls-pager-link--next">
                  <span className="ls-pager-dir">You finished the roadmap →</span>
                  <span className="ls-pager-title">Back to the DevRel Playbook</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
