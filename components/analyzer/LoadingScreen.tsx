import { LOADING_MESSAGES } from '@/lib/constants'

interface Props {
  msgIndex: number
}

export default function LoadingScreen({ msgIndex }: Props) {
  const current    = LOADING_MESSAGES[msgIndex % LOADING_MESSAGES.length]
  const passNumber = Math.floor(msgIndex / LOADING_MESSAGES.length)

  return (
    <div className="loading-screen">
      <div className="loading-spinner">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="#1e1e2e" strokeWidth="5" />
          <circle
            cx="36" cy="36" r="28"
            fill="none" stroke="#8b5cf6" strokeWidth="5"
            strokeDasharray="176" strokeDashoffset="44"
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
            className="spin-arc"
          />
        </svg>
      </div>

      <p key={msgIndex} className="loading-current">{current}</p>

      {passNumber > 0 && (
        <p className="loading-deep">Running a deep analysis — this one takes a moment</p>
      )}

      <p className="loading-note">Typically 15–30 seconds</p>
    </div>
  )
}
