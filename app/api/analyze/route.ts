import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import mammoth from 'mammoth'
import { SYSTEM_PROMPT } from '@/lib/constants'
import type { AnalysisResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. Add it to your .env.local file.' },
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
    ? `Also analyze fit against this job description — populate jobFit with 5–7 specific requirement areas from the posting, and set fitScore (0–100) and fitLabel ("Strong Fit" | "Good Fit" | "Partial Fit" | "Weak Fit") based on overall match.\n\nJOB DESCRIPTION:\n${jobDescription}`
    : `No job description provided. Return an empty array for jobFit, and set fitScore to null and fitLabel to null.`

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
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: messageContent }],
    })
    raw = (message.content[0] as Anthropic.Messages.TextBlock).text.trim()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Claude API call failed.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  // Strip accidental markdown fences
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')

  let result: AnalysisResult
  try {
    result = JSON.parse(raw) as AnalysisResult
  } catch {
    return NextResponse.json(
      { error: 'Claude returned an unexpected response format. Please try again.' },
      { status: 502 }
    )
  }

  return NextResponse.json(result)
}
