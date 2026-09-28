import { marked } from 'marked'
import type { Resource, ResourceKind } from '@/lib/lessons/types'
import { topicKey } from '@/lib/lessons'
import type { SkillModule } from '@/lib/lessons/types'
import type { ModuleKeys } from './Interactive'

// Server-rendered building blocks for the lesson pages. Lesson text is our own
// markdown (lib/lessons), so it's rendered directly — same as the blog.

export function Markdown({ source, className = 'ls-prose' }: { source: string; className?: string }) {
  const html = marked.parse(source.trim(), { async: false }) as string
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

const KIND_LABEL: Record<ResourceKind, string> = {
  book: 'Book',
  article: 'Article',
  guide: 'Guide',
  video: 'Video',
  course: 'Course',
  tool: 'Tool',
  community: 'Community',
  podcast: 'Podcast',
  newsletter: 'Newsletter',
  webinar: 'Strategy Room',
}

const KIND_ICON: Record<ResourceKind, string> = {
  book: '📘',
  article: '📄',
  guide: '🧭',
  video: '▶',
  course: '🎓',
  tool: '🛠',
  community: '👥',
  podcast: '🎙',
  newsletter: '✉',
  webinar: '◈',
}

export function ResourceList({ resources, compact = false }: { resources: Resource[]; compact?: boolean }) {
  return (
    <ul className={`ls-resources${compact ? ' ls-resources--compact' : ''}`}>
      {resources.map((r) => {
        const external = r.url.startsWith('http')
        return (
          <li key={r.url + r.title}>
            <a
              href={r.url}
              className={`ls-resource ls-resource--${r.kind}`}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="ls-resource-icon" aria-hidden>{KIND_ICON[r.kind]}</span>
              <span className="ls-resource-body">
                <span className="ls-resource-title">{r.title}</span>
                <span className="ls-resource-meta">
                  <span className="ls-resource-kind">{KIND_LABEL[r.kind]}</span>
                  {r.by && <span>{r.by}</span>}
                  {r.free && <span className="ls-resource-free">Free</span>}
                </span>
                {!compact && r.note && <span className="ls-resource-note">{r.note}</span>}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function moduleKeys(phaseId: string, module: SkillModule): ModuleKeys {
  return {
    moduleKey: `${phaseId}/${module.groupId}`,
    topicKeys: module.topics.map((t) => topicKey(phaseId, module.groupId, t.title)),
  }
}
