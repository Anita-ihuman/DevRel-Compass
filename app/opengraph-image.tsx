import { ImageResponse } from 'next/og'

// Branded social-share card shown when a DevRel Compass link is posted to
// Slack, X/Twitter, LinkedIn, WhatsApp, Discord, iMessage, etc.
export const alt = 'DevRel Compass — career development for Developer Relations'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '96px',
          background: '#0A0A0F',
          color: '#f0f0ff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo lockup: diamond mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 18,
              transform: 'rotate(45deg)',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #2dd4bf 100%)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>
            DevRel Compass
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 36,
            fontSize: 38,
            color: '#9a9ac0',
            maxWidth: 940,
            lineHeight: 1.35,
          }}
        >
          Career development for Developer Relations — skills assessment & career roadmap.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 60,
            height: 12,
            width: 300,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #8b5cf6 0%, #2dd4bf 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
