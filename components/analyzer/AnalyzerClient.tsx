'use client'

import { useState, useRef, useEffect } from 'react'
import UploadScreen from './UploadScreen'
import LoadingScreen from './LoadingScreen'
import ResultsScreen from './ResultsScreen'
import CreditsScreen from './CreditsScreen'
import type { AnalysisResult } from '@/types'
import { LOADING_MESSAGES } from '@/lib/constants'

const USES_KEY   = 'devrel_uses_count'
const TOTAL_KEY  = 'devrel_total_credits'
const FREE_LIMIT = 3

type View = 'upload' | 'loading' | 'results' | 'error' | 'credits'

export default function AnalyzerClient() {
  const [view, setView]             = useState<View>('upload')
  const [results, setResults]       = useState<AnalysisResult | null>(null)
  const [hasJD, setHasJD]           = useState(false)
  const [error, setError]           = useState('')
  const [msgIndex, setMsgIndex]     = useState(0)
  const [usesCount, setUsesCount]   = useState(0)
  const [totalCredits, setTotalCredits] = useState(FREE_LIMIT)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const uses  = parseInt(localStorage.getItem(USES_KEY)  ?? '0',              10)
    const total = parseInt(localStorage.getItem(TOTAL_KEY) ?? String(FREE_LIMIT), 10)
    setUsesCount(uses)
    setTotalCredits(total)
    if (uses >= total) setView('credits')
  }, [])

  function startMessages() {
    setMsgIndex(0)
    timerRef.current = setInterval(
      () => setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length),
      2400
    )
  }

  function stopMessages() {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  async function handleAnalyze(file: File, jobDescription: string) {
    if (usesCount >= totalCredits) {
      setView('credits')
      return
    }

    setView('loading')
    startMessages()

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('jobDescription', jobDescription)

      const res = await fetch('/api/analyze', { method: 'POST', body })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? `Request failed (${res.status})`)
      }

      const newCount = usesCount + 1
      setUsesCount(newCount)
      localStorage.setItem(USES_KEY, String(newCount))

      stopMessages()
      setResults(json as AnalysisResult)
      setHasJD(Boolean(jobDescription))
      setView('results')
    } catch (e) {
      stopMessages()
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setView('error')
    }
  }

  function reset() {
    const uses  = parseInt(localStorage.getItem(USES_KEY)  ?? '0',              10)
    const total = parseInt(localStorage.getItem(TOTAL_KEY) ?? String(FREE_LIMIT), 10)
    if (uses >= total) {
      setView('credits')
      return
    }
    setView('upload')
    setResults(null)
    setError('')
    setHasJD(false)
    setMsgIndex(0)
  }

  if (view === 'loading') return <LoadingScreen msgIndex={msgIndex} />

  if (view === 'credits') return <CreditsScreen />

  if (view === 'error') return (
    <div className="error-screen">
      <div className="err-icon">⚠</div>
      <h2 className="err-title">Analysis Failed</h2>
      <pre className="err-msg">{error}</pre>
      <p className="err-hint">
        Common causes: missing or invalid API key in <code>.env.local</code>, file too large, or rate limit hit.
      </p>
      <button className="retry-btn" onClick={reset}>Try Again</button>
    </div>
  )

  if (view === 'results' && results) {
    return <ResultsScreen data={results} hasJD={hasJD} onReset={reset} />
  }

  return <UploadScreen onAnalyze={handleAnalyze} usesLeft={totalCredits - usesCount} />
}
