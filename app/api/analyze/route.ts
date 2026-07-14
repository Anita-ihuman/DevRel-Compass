import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import mammoth from 'mammoth'
import { SYSTEM_PROMPT } from '@/lib/constants'
import { consumeAnalysisLimit } from '@/lib/ratelimit'
import { getClientIp } from '@/lib/ip'
import type { AnalysisResult } from '@/types'

// Resume analysis is a single long Claude call (up to 4096 tokens, longer for
// PDFs). Without this, the function can hit Vercel's shorter default timeout and
// return a 504 mid-analysis. 60s works on all plans (Pro/Enterprise allow more).
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const GENERIC_ERROR = "We couldn't analyze your resume right now. Please try again in a moment."

// Never leak upstream/internal error detail (billing, API keys, model names,
// rate limits) to users in production. The real error is always logged
// server-side; only local dev sees the detail in the response.
function safeError(detail: string): string {
  return process.env.NODE_ENV === 'production' ? GENERIC_ERROR : detail
}

async function fileToBase64(buffer: Buffer): Promise<string> {
  return buffer.toString('base64')
}

async function extractText(file: File): Promise<{ type: 'pdf'; base64: string } | { type: 'text'; content: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const buffer = Buffer.from(await file.arrayBuffer())

  if (ext === 'pdf') {
    return { type: 'pdf', base64: await fileToBase64(buffer) }
  }

  if (ext === 'docx' || ext === 'doc') {
    const result = await mammoth.extractRawText({ buffer })
    return { type: 'text', content: result.value }
  }

  if (ext === 'txt') {
    return { type: 'text', content: buffer.toString('utf-8') }
  }

  throw new Error(`Unsupported file type: .${ext}`)
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Analyze: ANTHROPIC_API_KEY is not configured')
    return NextResponse.json(
      { error: safeError('ANTHROPIC_API_KEY is not configured (.env.local).') },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const jobDescription = (formData.get('jobDescription') as string | null) ?? ''

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File exceeds the 5 MB limit.' }, { status: 400 })
  }

  let resumeData: Awaited<ReturnType<typeof extractText>>
  try {
    resumeData = await extractText(file)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to read file.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const jobNote = jobDescription
    ? `Also analyze fit against this job description — populate jobFit with 5–7 specific requirement areas from the posting, and set fitScore (0–100) and fitLabel ("Strong Fit" | "Good Fit" | "Partial Fit" | "Weak Fit" | "Poor Fit") based on overall match.\n\nJOB DESCRIPTION:\n${jobDescription}`
    : `No job description provided. Return an empty array for jobFit, and set fitScore to null and fitLabel to null.`

  // Gate on the per-IP ceiling here — after the upload is validated but before
  // the paid Claude call — so bad uploads never consume a user's allowance, and
  // token spend is bounded even when the client-side counter is bypassed.
  const limit = await consumeAnalysisLimit(getClientIp(req))
  if (limit.enabled && !limit.success) {
    const msLeft = Math.max(0, limit.reset - Date.now())
    return NextResponse.json(
      {
        error:
          "You've reached the free analysis limit. Paid plans with higher limits are coming soon.",
        limit: true,
      },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(msLeft / 1000)) } },
    )
  }

  const userText = `Please analyze this resume for DevRel skills assessment.\n\n${jobNote}`

  type MessageParam = Anthropic.Messages.MessageParam
  const messageContent: MessageParam['content'] =
    resumeData.type === 'pdf'
      ? [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: resumeData.base64 },
          } as Anthropic.Messages.DocumentBlockParam,
          { type: 'text', text: userText },
        ]
      : `RESUME:\n\n${resumeData.content}\n\n${userText}`

  let raw: string
  try {
    const message = await client.messages.create({
      // Sonnet 5: stable, reliable, and markedly faster than Opus for this
      // JSON-extraction workload (Opus ran ~27s on a 1-page PDF — too slow here).
      model: 'claude-sonnet-5',
      max_tokens: 8192,
      // Keep thinking off: this is a fast JSON-extraction call and we don't want
      // the added latency or a thinking block landing ahead of the JSON output.
      thinking: { type: 'disabled' },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: messageContent }],
    })
    const textBlock = message.content.find(
      (b): b is Anthropic.Messages.TextBlock => b.type === 'text',
    )
    if (!textBlock) {
      throw new Error('Claude returned no text content.')
    }
    raw = textBlock.text.trim()
  } catch (e) {
    const detail = e instanceof Error ? e.message : 'Claude API call failed.'
    console.error('Analyze: Claude API call failed:', detail)
    return NextResponse.json({ error: safeError(detail) }, { status: 502 })
  }

  // Strip accidental markdown fences, then isolate the JSON object in case the
  // model wrapped it in any explanatory prose.
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  const firstBrace = raw.indexOf('{')
  const lastBrace = raw.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    raw = raw.slice(firstBrace, lastBrace + 1)
  }

  let result: AnalysisResult
  try {
    result = JSON.parse(raw) as AnalysisResult
  } catch {
    console.error('Analyze: failed to parse Claude response as JSON')
    return NextResponse.json(
      { error: safeError('Claude returned an unexpected response format.') },
      { status: 502 }
    )
  }

  return NextResponse.json(result)
}
