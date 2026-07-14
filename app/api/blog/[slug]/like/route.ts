import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getRedis } from '@/lib/redis'
import { getClientIp } from '@/lib/ip'
import { getPostBySlug } from '@/lib/blog'

// Likes are stored as a Redis set of hashed visitor IPs per post. The like count
// is the set's cardinality, so each visitor counts once and can toggle their
// like off. IPs are hashed (never stored raw) to avoid keeping PII.
function likesKey(slug: string): string {
  return `likes:${slug}`
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

function normalize(slug: string): string {
  return String(slug ?? '').trim().toLowerCase()
}

const DISABLED = { likes: 0, liked: false, enabled: false }

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = normalize((await params).slug)
  if (!getPostBySlug(slug)) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json(DISABLED)

  const key = likesKey(slug)
  const id = hashIp(getClientIp(req))
  const [likes, liked] = await Promise.all([redis.scard(key), redis.sismember(key, id)])
  return NextResponse.json({ likes: likes ?? 0, liked: Boolean(liked), enabled: true })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = normalize((await params).slug)
  if (!getPostBySlug(slug)) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json(DISABLED)

  const key = likesKey(slug)
  const id = hashIp(getClientIp(req))

  // Toggle: remove the like if this visitor already liked, otherwise add it.
  const already = await redis.sismember(key, id)
  if (already) {
    await redis.srem(key, id)
  } else {
    await redis.sadd(key, id)
  }
  const likes = await redis.scard(key)
  return NextResponse.json({ likes: likes ?? 0, liked: !already, enabled: true })
}
