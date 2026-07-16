import { ImageResponse } from 'next/og'

// 180×180 branded mark. Serves as the iOS home-screen icon AND as the
// Organization logo in structured data (Google requires the logo to be a
// square image of at least 112px).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0F',
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 26,
            transform: 'rotate(45deg)',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #2dd4bf 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
