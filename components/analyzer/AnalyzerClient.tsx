'use client'

import { useState, useEffect } from 'react'
import UploadScreen from './UploadScreen'
import LoadingScreen from './LoadingScreen'
import ResultsScreen from './ResultsScreen'
import LimitReached from './LimitReached'
import SignInGate from './SignInGate'
import type { AnalysisResult } from '@/types'

// The server is the source of truth for the free-analysis allowance (see
// /api/usage and /api/analyze). Anonymous visitors get 1 free, accounts get a
// few more, then the paywall (M3).
type View = 'init' | 'upload' | 'loading' | 'results' | 'error' | 'limit' | 'signin'

export default function AnalyzerClient() {
  const [view, setView]       = useState<View>('init')
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [hasJD, setHasJD]     = useState(false)
  const [error, setError]     = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    let active = true
    fetch('/api/usage')
      .then((r) => r.json())
      .then((d) => {
        if (!active) return
        setSignedIn(Boolean(d.signedIn))
        setRemaining(d.remaining ?? 0)
        setView((d.remaining ?? 0) <= 0 ? (d.signedIn ? 'limit' : 'signin') : 'upload')
      })
      .catch(() => active && setView('upload'))
    return () => {
      active = false
    }
  }, [])

  async function handleAnalyze(file: File, jobDescription: string) {
    setView('loading')

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('jobDescription', jobDescription)

      const res = await fetch('/api/analyze', { method: 'POST', body })

      if (!res.ok) {
        // Gate responses: anon used their free analysis, or account is out.
        if (res.status === 401) { setView('signin'); return }
        if (res.status === 402 || res.status === 429) { setView('limit'); return }
        // A gateway timeout (504/408) returns HTML, not JSON — give a clear message.
        if (res.status === 504 || res.status === 408) {
          throw new Error('The analysis timed out. Larger PDFs take longer — please try again.')
        }
        let message = `Request failed (${res.status})`
        try {
          const errJson = await res.json()
          message = errJson.error ?? message
        } catch {
          /* non-JSON error body — keep the status-based message */
        }
        throw new Error(message)
      }

      const json = await res.json()
      setRemaining((r) => Math.max(0, r - 1))
      setResults(json as AnalysisResult)
      setHasJD(Boolean(jobDescription))
      setView('results')
    } catch (e) {
      const message =
        e instanceof TypeError
          ? "Couldn't reach the server. Please check your connection and try again."
          : e instanceof Error && e.message
            ? e.message
            : 'Something went wrong. Please try again.'
      setError(message)
      setView('error')
    }
  }

  function reset() {
    if (remaining <= 0) {
      setView(signedIn ? 'limit' : 'signin')
      return
    }
    setView('upload')
    setResults(null)
    setError('')
    setHasJD(false)
  }

  // Brief neutral state while we fetch the allowance (avoids a wrong-screen flash).
  if (view === 'init') return <div style={{ minHeight: '60vh' }} />

  if (view === 'loading') return <LoadingScreen />

  if (view === 'signin') return <SignInGate />

  if (view === 'limit') return <LimitReached />

  if (view === 'error') return (
    <div className="error-screen">
      <div className="err-icon">⚠</div>
      <h2 className="err-title">Analysis Failed</h2>
      <p className="err-msg">{error}</p>
      <p className="err-hint">
        Please try again in a moment. If it keeps happening, try a different file or check back shortly.
      </p>
      <button className="retry-btn" onClick={reset}>Try Again</button>
    </div>
  )

  if (view === 'results' && results) {
    return <ResultsScreen data={results} hasJD={hasJD} onReset={reset} />
  }

  return <UploadScreen onAnalyze={handleAnalyze} usesLeft={remaining} />
}
