'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { href: '/',           label: 'Skills Analyzer' },
  { href: '/roadmap',    label: 'Career Roadmap'  },
  { href: '/library',    label: 'DevRel Playbook' },
  { href: '/events',     label: 'Events'          },
  { href: '/blog',       label: 'Blog'            },
  { href: '/newsletter', label: 'Newsletter'      },
]

// Lesson pages live under /roadmap/*, so match sections by prefix (except home).
function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

function AccountControls({ onNavigate }: { onNavigate?: () => void }) {
  const { data: session, status } = useSession()
  if (status === 'loading') return null

  if (!session?.user) {
    return (
      <Link href="/signin" className="nav-signin" onClick={onNavigate}>
        Sign in
      </Link>
    )
  }

  return (
    <div className="nav-account">
      {session.user.isAdmin && (
        <Link href="/admin" className="nav-link" onClick={onNavigate}>
          Admin
        </Link>
      )}
      {session.user.username ? (
        <Link href="/profile" className="nav-user" onClick={onNavigate}>
          @{session.user.username}
        </Link>
      ) : (
        <Link href="/onboarding" className="nav-signin" onClick={onNavigate}>
          Finish setup
        </Link>
      )}
      <button className="nav-signout" onClick={() => signOut({ redirectTo: '/' })}>
        Sign out
      </button>
    </div>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" aria-label="DevRel Compass home">
          <Image src="/logo-text.svg" alt="DevRel Compass" width={312} height={106} priority className="nav-logo-img" />
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(pathname, link.href) ? ' nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <AccountControls />
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`ham-bar${open ? ' ham-bar--top-open' : ''}`} />
          <span className={`ham-bar${open ? ' ham-bar--mid-open' : ''}`} />
          <span className={`ham-bar${open ? ' ham-bar--bot-open' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="nav-mobile-account">
            <AccountControls onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}
