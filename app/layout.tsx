import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

// Absolute base for OG/Twitter image URLs. Prefer an explicit domain, else the
// Vercel-provided production/deployment URL, else localhost for dev.
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'DevRel Compass',
    template: '%s | DevRel Compass',
  },
  description:
    'Open-source career development platform for Developer Relations practitioners. Skills assessment, career roadmap, and resources.',
  openGraph: {
    type: 'website',
    siteName: 'DevRel Compass',
    url: appUrl,
    title: 'DevRel Compass',
    description: 'Skills assessment and career roadmap for Developer Relations practitioners.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevRel Compass',
    description: 'Skills assessment and career roadmap for Developer Relations practitioners.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
