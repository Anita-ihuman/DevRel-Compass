'use client'

import { useState, useRef } from 'react'

const ACCEPTED_EXTS = ['.pdf', '.docx', '.doc', '.txt']
const MAX_BYTES = 5 * 1024 * 1024

interface Props {
  onAnalyze: (file: File, jobDescription: string) => void
}

export default function UploadScreen({ onAnalyze }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function validate(f: File): boolean {
    const ext = ('.' + f.name.split('.').pop()?.toLowerCase()) as string
    if (f.size > MAX_BYTES) {
      setFileError('File exceeds 5 MB — please upload a smaller file.')
      return false
    }
    if (!ACCEPTED_EXTS.includes(ext)) {
      setFileError(`Unsupported type. Accepted: ${ACCEPTED_EXTS.join(', ')}`)
      return false
    }
    setFileError('')
    return true
  }

  function pick(f: File | null | undefined) {
    if (f && validate(f)) setFile(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    pick(e.dataTransfer.files[0])
  }

  return (
    <div className="upload-screen">
      <div className="upload-hero">
        <div className="hero-badge">DevRel Compass</div>
        <h1 className="hero-title">
          DevRel Skills<br />
          <span className="hero-accent">Analyzer</span>
        </h1>
        <p className="hero-sub">
          Upload your resume and receive a precision assessment of all 8 DevRel skill
          dimensions — benchmarked against global standards from CNCF, Google, AWS,
          Stripe, Twilio, and HashiCorp.
        </p>
      </div>

      <div className="upload-form">
        {/* File Upload */}
        <div className="form-field">
          <label className="form-label">Your Resume</label>
          <div
            className={`dropzone${dragOver ? ' dz-over' : ''}${file ? ' dz-filled' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTS.join(',')}
              onChange={e => pick(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            {file ? (
              <div className="dz-file">
                <div className="dz-file-icon">
                  {file.name.endsWith('.pdf') ? '📄' : file.name.endsWith('.txt') ? '📝' : '📃'}
                </div>
                <div className="dz-file-info">
                  <div className="dz-file-name">{file.name}</div>
                  <div className="dz-file-size">{(file.size / 1024).toFixed(0)} KB</div>
                </div>
                <button
                  className="dz-remove"
                  onClick={e => { e.stopPropagation(); setFile(null); setFileError('') }}
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="dz-empty">
                <div className="dz-up-icon">↑</div>
                <div className="dz-text">
                  Drop your resume here or <span className="dz-browse">browse files</span>
                </div>
                <div className="dz-formats">PDF · DOCX · DOC · TXT &nbsp;·&nbsp; Max 5 MB</div>
              </div>
            )}
          </div>
          {fileError && <p className="field-error">{fileError}</p>}
        </div>

        {/* Job Description */}
        <div className="form-field">
          <div className="form-label-row">
            <label className="form-label">Job Description</label>
            <span className="label-opt">optional — enables role-specific fit scoring</span>
          </div>
          <textarea
            className="text-input jd-area"
            placeholder="Paste the full job posting here to get a fit score, requirement breakdown, and role-specific gap analysis..."
            value={jd}
            onChange={e => setJd(e.target.value)}
            rows={6}
          />
          {jd && <p className="jd-hint">✓ Job description added — Job Fit Analysis tab will be enabled</p>}
        </div>

        <button
          className={`analyze-btn${!file ? ' analyze-btn--disabled' : ''}`}
          onClick={() => file && onAnalyze(file, jd.trim())}
          disabled={!file}
        >
          <span>Analyze My DevRel Profile</span>
          <span className="btn-arrow">→</span>
        </button>

        {!file && (
          <p className="submit-hint">Upload your resume to get started</p>
        )}
      </div>
    </div>
  )
}
