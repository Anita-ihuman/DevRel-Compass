import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { getEntitlement, ACCOUNT_FREE_LIMIT } from '@/lib/usage'
import UpgradeButton from '@/components/billing/UpgradeButton'
import { PLAN } from '@/lib/plan'

const PRICING_DESCRIPTION = `Start with ${ACCOUNT_FREE_LIMIT} free resume analyses. Upgrade to ${PLAN.name} for ${PLAN.price}/${PLAN.interval}: ${PLAN.quota} analyses a month and a saved history of every result.`

export const metadata: Metadata = {
  title: 'Pricing',
  description: PRICING_DESCRIPTION,
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    url: '/pricing',
    title: 'Pricing — DevRel Compass',
    description: PRICING_DESCRIPTION,
  },
}

const FREE_FEATURES = [
  `${ACCOUNT_FREE_LIMIT} resume analyses — the first one without an account`,
  'All 8 DevRel skill dimensions, scored and explained',
  'Job fit against a posting you paste in',
  'Career roadmap, DevRel Playbook, events, and blog',
]

const PRO_FEATURES = [
  `${PLAN.quota} resume analyses every ${PLAN.interval}`,
  'Saved history of every analysis, including your free ones',
  'Revisit and compare results anytime from your profile',
  'Everything in Free',
]

const FAQ = [
  {
    q: 'What counts as an analysis?',
    a: 'Each resume you upload and analyze counts as one, with or without a job description. Re-opening a saved result does not.',
  },
  {
    q: 'What happens to the analysis I ran before signing in?',
    a: "It moves into your account when you sign in and counts as one of your two free analyses. Once you're on Pro, it shows up in your history with the rest.",
  },
  {
    q: 'When does my monthly allowance reset?',
    a: `On your renewal date each ${PLAN.interval}. Unused analyses don't roll over.`,
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes. Cancel from Manage billing on your profile. You keep Pro until the end of the period you've paid for, then your account returns to Free.",
  },
  {
    q: 'Who handles payment?',
    a: 'Payments are processed by Bachs. Your card details go straight to them and never touch DevRel Compass.',
  },
]

export default async function PricingPage() {
  const session = await auth()
  const userId = session?.user?.id
  // Best-effort: the page should still render if the database is unreachable.
  const entitlement = userId ? await getEntitlement(userId).catch(() => null) : null
  const paid = entitlement?.paid ?? false

  let proCta: React.ReactNode
  if (!userId) {
    proCta = (
      <Link href="/signin" className="pr-btn pr-btn--primary">
        Sign in to subscribe →
      </Link>
    )
  } else if (paid) {
    proCta = entitlement?.customerId ? (
      <a href="/api/billing/portal" className="pr-btn">Manage billing →</a>
    ) : (
      <span className="pr-btn pr-btn--static">You&apos;re on {PLAN.name}</span>
    )
  } else {
    proCta = (
      <UpgradeButton
        className="pr-btn pr-btn--primary"
        label={`Upgrade — ${PLAN.price}/${PLAN.interval}`}
      />
    )
  }

  return (
    <div className="pr-wrap">
      <style>{`
        .pr-wrap { max-width: 960px; margin: 0 auto; padding: 3.5rem 1.5rem 5rem; }
        .pr-head { text-align: center; margin-bottom: 3rem; }
        .pr-title { font-family: var(--ff-d); font-size: clamp(2.2rem, 6vw, 3rem); font-weight: 700; line-height: 1.1; margin: 1rem 0 .9rem; }
        .pr-sub { color: var(--text2); font-size: .975rem; line-height: 1.7; max-width: 520px; margin: 0 auto; }

        .pr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; align-items: stretch; }
        .pr-card { position: relative; display: flex; flex-direction: column; gap: 1.25rem; padding: 2rem 1.75rem; border-radius: 16px; background: var(--bg2); border: 1px solid var(--border2); }
        .pr-card--pro { border: 1px solid transparent; background: linear-gradient(var(--bg2), var(--bg2)) padding-box, linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%) border-box; }
        .pr-badge { position: absolute; top: -11px; left: 1.75rem; font-family: var(--ff-m); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px; border-radius: 99px; color: #fff; background: linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%); }
        .pr-name { font-family: var(--ff-d); font-size: 1.15rem; font-weight: 700; }
        .pr-price { display: flex; align-items: baseline; gap: .35rem; }
        .pr-amount { font-family: var(--ff-d); font-size: 2.6rem; font-weight: 700; line-height: 1; }
        .pr-per { font-family: var(--ff-m); font-size: 12px; color: var(--text3); }
        .pr-blurb { font-size: .875rem; color: var(--text2); line-height: 1.6; }
        .pr-list { list-style: none; display: flex; flex-direction: column; gap: .7rem; flex: 1; }
        .pr-list li { display: flex; gap: .6rem; font-size: .875rem; color: var(--text); line-height: 1.5; }
        .pr-check { flex-shrink: 0; color: var(--teal); font-weight: 700; }

        .pr-btn { display: block; width: 100%; text-align: center; padding: .8rem 1rem; border-radius: 10px; font-family: var(--ff-d); font-size: .9rem; font-weight: 600; border: 1px solid var(--border2); background: var(--bg3); color: var(--text); transition: background .2s, transform .2s; }
        .pr-btn:hover { background: var(--bg4); transform: translateY(-1px); }
        .pr-btn--primary { border: none; color: #fff; background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); }
        .pr-btn--primary:hover { background: var(--accent2); }
        .pr-btn--primary:disabled { opacity: .6; cursor: default; transform: none; }
        .pr-btn--static, .pr-btn--static:hover { cursor: default; transform: none; background: var(--bg3); color: var(--text2); }
        .pr-card .profile-plan-note { text-align: center; }

        .pr-faq { margin-top: 4rem; }
        .pr-faq-title { font-family: var(--ff-d); font-size: 1.4rem; font-weight: 700; margin-bottom: 1.25rem; text-align: center; }
        .pr-faq-list { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: .75rem; }
        .pr-faq details { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.25rem; }
        .pr-faq summary { cursor: pointer; font-weight: 600; font-size: .925rem; list-style: none; display: flex; justify-content: space-between; gap: 1rem; }
        .pr-faq summary::-webkit-details-marker { display: none; }
        .pr-faq summary::after { content: '+'; color: var(--accent); font-family: var(--ff-m); }
        .pr-faq details[open] summary::after { content: '–'; }
        .pr-faq p { margin-top: .7rem; font-size: .875rem; color: var(--text2); line-height: 1.7; }
      `}</style>

      <header className="pr-head">
        <div className="hero-badge">Pricing</div>
        <h1 className="pr-title">
          Simple, <span className="hero-accent">honest</span> pricing
        </h1>
        <p className="pr-sub">
          Try the Skills Analyzer free. Upgrade when you want to keep going — and keep
          every result in one place.
        </p>
      </header>

      <div className="pr-grid">
        <section className="pr-card" aria-labelledby="plan-free">
          <h2 id="plan-free" className="pr-name">Free</h2>
          <div className="pr-price">
            <span className="pr-amount">$0</span>
          </div>
          <p className="pr-blurb">See where you stand across the core DevRel skills.</p>
          <ul className="pr-list">
            {FREE_FEATURES.map((f) => (
              <li key={f}><span className="pr-check" aria-hidden="true">✓</span>{f}</li>
            ))}
          </ul>
          {paid ? (
            <span className="pr-btn pr-btn--static">Included in {PLAN.name}</span>
          ) : (
            <Link href="/" className="pr-btn">Start analyzing →</Link>
          )}
        </section>

        <section className="pr-card pr-card--pro" aria-labelledby="plan-pro">
          <span className="pr-badge">For active job seekers</span>
          <h2 id="plan-pro" className="pr-name">{PLAN.name}</h2>
          <div className="pr-price">
            <span className="pr-amount">{PLAN.price}</span>
            <span className="pr-per">/ {PLAN.interval}</span>
          </div>
          <p className="pr-blurb">Track your growth with regular analyses and a full history.</p>
          <ul className="pr-list">
            {PRO_FEATURES.map((f) => (
              <li key={f}><span className="pr-check" aria-hidden="true">✓</span>{f}</li>
            ))}
          </ul>
          {proCta}
        </section>
      </div>

      <section className="pr-faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="pr-faq-title">Questions</h2>
        <div className="pr-faq-list">
          {FAQ.map(({ q, a }) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
