'use client'

import { useState } from 'react'

// Public sharing for a post. Each button appends UTM campaign tracking so GA
// attributes reader-driven traffic to the right channel automatically.
export default function ShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)

  // Clean post URL + campaign params. Built from origin+pathname (not href) so
  // we never double-append query strings.
  function shareUrl(source: string, medium: string): string {
    const base = `${window.location.origin}${window.location.pathname}`
    const params = new URLSearchParams({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: `blog-${slug}`,
    })
    return `${base}?${params.toString()}`
  }

  function open(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function shareX() {
    open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl('twitter', 'social'))}`,
    )
  }

  function shareLinkedIn() {
    open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl('linkedin', 'social'))}`,
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl('copy', 'referral'))
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
