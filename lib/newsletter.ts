import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Newsletter issues are markdown files with YAML frontmatter, same as the blog —
// writing an issue means dropping a .md file in content/newsletter. The archive
// renders from these, and the send endpoint mails the same content, so the web
// version and the emailed version can never drift apart.
const NEWSLETTER_DIR = path.join(process.cwd(), 'content', 'newsletter')

export type IssueMeta = {
  slug: string
  /** Issue number, shown as "Issue 01". */
  issue: number
  title: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  description: string
  author: string
  tags: string[]
  /**
   * Issues dated in the future are drafts: they don't appear in the archive and
   * can't be sent. This is the safety catch on an unfinished issue.
   */
  draft: boolean
}

export type Issue = { meta: IssueMeta; content: string }

function readIssue(fileName: string): Issue {
  const raw = fs.readFileSync(path.join(NEWSLETTER_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  const filenameSlug = fileName.replace(/\.md$/, '')
  const date = String(data.date ?? '')
  return {
    meta: {
      slug: String(data.slug ?? filenameSlug).trim().toLowerCase(),
      issue: Number(data.issue ?? 0),
      title: data.title ?? filenameSlug,
      date,
      description: data.description ?? '',
      author: data.author ?? 'DevRel Compass',
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      // An explicit `draft: true` wins; otherwise a future date means draft.
      draft: data.draft === true || date > new Date().toISOString().slice(0, 10),
    },
    content,
  }
}

function readAll(): Issue[] {
  if (!fs.existsSync(NEWSLETTER_DIR)) return []
  return fs
    .readdirSync(NEWSLETTER_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readIssue)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}

/** Published issues, newest first. */
export function getAllIssues(): Issue[] {
  return readAll().filter((i) => !i.meta.draft)
}

/** Everything including drafts — for the admin send screen. */
export function getAllIssuesIncludingDrafts(): Issue[] {
  return readAll()
}

export function getIssueBySlug(slug: string): Issue | null {
  const norm = String(slug ?? '').trim().toLowerCase()
  return readAll().find((i) => i.meta.slug === norm) ?? null
}

export function formatIssueDate(iso: string): string {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
