import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <Image src="/logo-text.svg" alt="DevRel Compass" width={312} height={106} className="footer-logo-img" />
            </div>
            <p className="footer-tagline">
              Open-source career development platform for Developer Relations practitioners.
            </p>
          </div>

          <div className="footer-links-col">
            <div className="footer-col-title">Features</div>
            <Link href="/"        className="footer-link">Skills Analyzer</Link>
            <Link href="/roadmap" className="footer-link">Career Roadmap</Link>
            <Link href="/library" className="footer-link">DevRel Library</Link>
            <Link href="/events"  className="footer-link">Events</Link>
          </div>

          <div className="footer-links-col">
            <div className="footer-col-title">Open Source</div>
            <a
              href="https://github.com/Anita-ihuman/DevRel-Compass"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} DevRel Compass. MIT License.</span>
        </div>
      </div>
    </footer>
  )
}
