import { sessions } from '@/lib/events'
import type { Resource } from './types'

// Turns a DevRel Strategy Room session into a lesson resource, so recordings in
// lib/events.ts show up inside the relevant lessons and library sections
// without duplicating titles or video IDs.
export function webinar(num: string): Resource {
  const s = sessions.find((x) => x.num === num)
  if (!s) throw new Error(`No Strategy Room session numbered ${num} in lib/events.ts`)
  return {
    title: s.title,
    by: s.speaker ? `DevRel Strategy Room · ${s.speaker}` : 'DevRel Strategy Room',
    url: s.videoId ? `https://www.youtube.com/watch?v=${s.videoId}` : '/events',
    kind: 'webinar',
    free: true,
    note: s.description,
  }
}
