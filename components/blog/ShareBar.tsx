'use client'

import { useState } from 'react'

// Public sharing for a post. Uses window.location at click time so it works
// regardless of the deployed domain.
export default function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  function open(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function shareX() {
    const url = window.location.href
    open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    )
  }

  function shareLinkedIn() {
    open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="bl-share">
      <span className="bl-share-label">Share</span>
      <button className="bl-share-btn" onClick={shareX}>X / Twitter</button>
      <button className="bl-share-btn" onClick={shareLinkedIn}>LinkedIn</button>
      <button className="bl-share-btn" onClick={copyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
    </div>
  )
}
