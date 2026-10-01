// URL and progress-key helpers for lessons. Kept apart from lib/lessons/index.ts
// so client components (the roadmap, progress UI) can use them without pulling
// every lesson's text into the browser bundle.

/** URL-safe slug for a topic title — used as the in-page anchor. */
export function topicSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function moduleHref(phaseId: string, groupId: string): string {
  return `/playbook/${phaseId}/${groupId}`
}

export function topicHref(phaseId: string, groupId: string, topicTitle: string): string {
  return `${moduleHref(phaseId, groupId)}#${topicSlug(topicTitle)}`
}

/** Progress key for a topic — stable across deploys as long as titles don't change. */
export function topicKey(phaseId: string, groupId: string, topicTitle: string): string {
  return `${phaseId}/${groupId}/${topicSlug(topicTitle)}`
}
