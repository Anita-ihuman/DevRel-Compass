'use client'

import { useEffect, useState } from 'react'

// Public, shared likes backed by Redis (see /api/blog/[slug]/like). Optimistic
// UI: the count updates instantly on click, then reconciles with the server.
export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number | null>(null)
  const [liked, setLiked] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`/api/blog/${slug}/like`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return
        setLikes(d.likes ?? 0)
        setLiked(Boolean(d.liked))
      })
      .catch(() => active && setLikes(0))
    return () => {
      active = false
    }
  }, [slug])

  async function toggle() {
    if (pending) return
    setPending(true)

    const prevLiked = liked
    const prevLikes = likes ?? 0
    setLiked(!prevLiked)
    setLikes(prevLikes + (prevLiked ? -1 : 1))

    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: 'POST' })
      const d = await res.json()
      setLikes(d.likes ?? 0)
      setLiked(Boolean(d.liked))
    } catch {
      setLiked(prevLiked)
      setLikes(prevLikes)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      className={`bl-like${liked ? ' bl-like--on' : ''}`}
      onClick={toggle}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
    >
      <span className="bl-like-heart">{liked ? '♥' : '♡'}</span>
      <span className="bl-like-count">{likes ?? '·'}</span>
    </button>
  )
}
