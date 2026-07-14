import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Blog posts are plain markdown files with YAML frontmatter, read at build time.
// Adding an article = dropping a new .md file in content/blog (great for the
// open-source contribution flow — no CMS, no database).
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type PostMeta = {
  slug: string
  title: string
  date: string
  tag: string
  author: string
  description: string
  thumbnail?: string
}

export type Post = { meta: PostMeta; content: string }

function readPost(fileName: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  const filenameSlug = fileName.replace(/\.md$/, '')
  return {
    meta: {
      // Prefer the frontmatter slug; fall back to the filename.
      slug: String(data.slug ?? filenameSlug).trim().toLowerCase(),
      title: data.title ?? filenameSlug,
      date: data.date ?? '',
      tag: data.tag ?? '',
      author: data.author ?? '',
      description: data.description ?? '',
      thumbnail: data.thumbnail,
    },
    content,
  }
}

// Newest first (frontmatter dates are ISO YYYY-MM-DD, so string compare works).
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readPost)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}

export function getPostBySlug(slug: string): Post | null {
  const norm = String(slug ?? '').trim().toLowerCase()
  return getAllPosts().find((p) => p.meta.slug === norm) ?? null
}
