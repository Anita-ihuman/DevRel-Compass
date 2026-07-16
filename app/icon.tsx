import { ImageResponse } from 'next/og'

// Browser-tab favicon, generated to match the brand mark used in
// opengraph-image.tsx: a purple→teal diamond on the dark app background.
// Next.js auto-wires this as <link rel="icon"> — no files in /public needed.
// 96px (a multiple of 48) follows Google's favicon guidance so it can show
// next to search results, while still rendering crisply in the browser tab.
export const size = { width: 96, height: 96 }
export const contentType = 'image/png'

export default function Icon() {
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
        {/* Diamond mark: a rounded square rotated 45°, purple→teal gradient. */}
        <div
          style={{
            width: 57,
            height: 57,
            borderRadius: 14,
            transform: 'rotate(45deg)',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #2dd4bf 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
