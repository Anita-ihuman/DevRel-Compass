'use client'

import { useSyncExternalStore } from 'react'

// Learner progress through the roadmap lessons: topics marked complete and
// Compass Challenges finished.
//
// Kept in localStorage for now, so it works signed-out and costs no database
// writes. It's per-browser — syncing it to the account is a natural next step
// once the lessons have usage. Every read/write is guarded because storage can
// be unavailable (private windows, blocked site data).

const STORAGE_KEY = 'devrel-compass:progress:v1'

export type Progress = {
  topics: Record<string, true>
  challenges: Record<string, true>
}

const EMPTY: Progress = { topics: {}, challenges: {} }

let cache: Progress | null = null
const listeners = new Set<() => void>()

function read(): Progress {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : {}
    cache = { ...EMPTY, ...parsed }
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(next: Progress) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable — progress still works for this page view.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

function toggle<K extends 'topics' | 'challenges'>(field: K, key: string, on: boolean) {
  const current = read()
  const bucket: Record<string, true> = { ...current[field] }
  if (on) bucket[key] = true
  else delete bucket[key]
  write({ ...current, [field]: bucket })
}

export const setTopicDone = (key: string, on: boolean) => toggle('topics', key, on)
export const setChallengeDone = (key: string, on: boolean) => toggle('challenges', key, on)
