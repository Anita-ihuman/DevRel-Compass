import { ImageResponse } from 'next/og'
import { logoLockup } from '@/lib/brand'

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
        {/* Logo lockup: public/logo-text.svg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoLockup.src} width={520} height={Math.round((520 * logoLockup.height) / logoLockup.width)} alt="" />

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
