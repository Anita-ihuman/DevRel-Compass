import { LOADING_MESSAGES } from '@/lib/constants'

interface Props {
  msgIndex: number
}

export default function LoadingScreen({ msgIndex }: Props) {
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
      <div className="loading-msgs">
        {LOADING_MESSAGES.map((msg, i) => (
          <div
            key={msg}
            className={`loading-msg ${
              i < msgIndex ? 'lm-done' : i === msgIndex ? 'lm-active' : 'lm-pending'
            }`}
          >
            <span className="lm-dot">{i < msgIndex ? '✓' : i === msgIndex ? '◉' : '○'}</span>
            {msg}
          </div>
        ))}
      </div>
      <p className="loading-note">This may take 10–20 seconds</p>
    </div>
  )
}
