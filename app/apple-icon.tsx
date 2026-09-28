import { ImageResponse } from 'next/og'
import { logoMark, iconBackground } from '@/lib/brand'

// 180×180 branded mark. Serves as the iOS home-screen icon AND as the
// Organization logo in structured data (Google requires the logo to be a
// square image of at least 112px).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const w = 132
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: iconBackground,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoMark.src} width={w} height={Math.round((w * logoMark.height) / logoMark.width)} alt="" />
      </div>
    ),
    { ...size },
  )
}
