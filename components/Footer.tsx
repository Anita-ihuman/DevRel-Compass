import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="nav-logo-mark">◈</span>
              <span className="nav-logo-name">DevRel Compass</span>
            </div>
            <p className="footer-tagline">
              Open-source career development platform for Developer Relations practitioners.
            </p>
          </div>

          <div className="footer-links-col">
            <div className="footer-col-title">Features</div>
            <Link href="/"        className="footer-link">Skills Analyzer</Link>
            <Link href="/roadmap" className="footer-link">Career Roadmap</Link>
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
            <a
              href="https://github.com/Anita-ihuman/DevRel-Compass/blob/main/CONTRIBUTING.md"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contributing
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} DevRel Compass. MIT License.</span>
          <span className="footer-powered">
            Powered by{' '}
            <a href="https://anthropic.com" className="footer-link-inline" target="_blank" rel="noopener noreferrer">
              Claude
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
