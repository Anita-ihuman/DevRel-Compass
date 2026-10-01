import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['mammoth'],
  devIndicators: false,
  // The Playbook used to live at /library, with its lessons under /roadmap/*.
  // Permanent redirects keep old links, bookmarks, and search results working.
  async redirects() {
    return [
      { source: '/library', destination: '/playbook', permanent: true },
      { source: '/roadmap/:phase', destination: '/playbook/:phase', permanent: true },
      { source: '/roadmap/:phase/:skill', destination: '/playbook/:phase/:skill', permanent: true },
    ]
  },
}

export default nextConfig
