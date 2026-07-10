# DevRel Compass — Roadmap 🧭

Now that a stable version is public, this roadmap turns early feedback into a
sequenced plan. Two ideas anchor everything:

1. **Users cover the token cost.** We pay Anthropic per analysis, so usage has to
   be bounded and, past a small free allowance, paid.
2. **Open-core, not paywalled.** The code stays open and self-hostable; only the
   *hosted* AI analysis (the part that spends real money) is metered. All content
   — roadmap, events, future resources — stays free.

### Target user flow

```
1 free analysis (anonymous)
        │
        ▼
Sign up (email + username)
        │
        ▼
2 more free analyses
        │
        ▼
Pay for more  →  monthly plan / additional analyses
```

### Guiding constraints

- **Cost safety first.** Nothing that increases traffic ships before spend is
  enforced server-side.
- **Merchant of Record.** Lemon Squeezy handles checkout, subscriptions, global
  tax/VAT, and payment PII — we store only what the app needs.
- **Store the minimum.** Email, username, subscription + usage state. Nothing
  more until a feature needs it.

---

## Positioning: open source *and* paid

The tension is real, so we resolve it deliberately (open-core):

- **Free & open:** the source code (MIT, self-hostable with your own API key), the
  career roadmap, events, and all educational content.
- **Metered:** the hosted analysis, because each run costs Anthropic tokens. The
  free tier (1 + 2) is the on-ramp; the moat is hosted convenience, curated
  content, the extension, and brand — not restricting the code.
- **README should say this plainly** so the community understands payment covers
  compute, not the software.

---

# Phase 1 — Revenue & safety core

*The near-term must-haves. Build in order.*

## M1 — Protect the token budget 🔴 *(do first)*

Enforce free usage on the server, independent of payments.

- Move the free-analysis count out of `localStorage` into a server-side store
  keyed by IP + lightweight fingerprint (Upstash Redis / Vercel KV-style,
  counter + TTL, no PII).
- Rate-limit `/api/analyze` (per-IP burst + daily ceiling) against scripted abuse.
- Return a clear limit response the client renders as `LimitReached`.

> ⚠️ The current cap is client-side only (`localStorage: devrel_uses_count`), so
> token spend is **unbounded** today. With only **1** free pre-signup analysis,
> the bypass incentive is higher — this is urgent regardless of the payment
> timeline.

## M2 — Accounts: email + username gate 👤

Gate the flow: 1 free anonymous → sign up → 2 more free.

- Add a database (recommend **Neon Postgres** via Vercel Marketplace; keep Redis
  for hot usage counters).
- Auth collecting **email + username** — recommend **passwordless magic link**
  (Auth.js/NextAuth or Clerk): no passwords to store, lowest friction, and email
  verification raises the cost of throwaway accounts.
- Minimum data model:
  - `users`: id, email, username, created_at
  - `usage`: user_id, period_start, analyses_used
- Anonymous free (1) keyed to IP/fingerprint; post-signup free (2) keyed to the
  account.

## M3 — Payments via Lemon Squeezy 💳

Turn accounts into paying customers once the 3 free analyses are used.

- Product + monthly plan in **Lemon Squeezy**; embed hosted checkout.
- **Webhooks** (`subscription_created/updated/cancelled`,
  `subscription_payment_success/failed`) sync status to `users`: plan, status,
  `current_period_end`, monthly quota.
- Enforce the **monthly quota** server-side in `/api/analyze` (reuse the M1
  layer), reset each billing period.
- Lemon Squeezy **customer portal** for manage/cancel/update-card.
- Edge cases: failed payment → grace then downgrade; cancel → access until
  `current_period_end`.
- **Price against cost:** measure Anthropic cost per analysis × monthly quota so
  the plan clears a healthy margin before locking a number.

---

# Phase 2 — Relevance & reach

*Grows the audience and stickiness. Content work can run in parallel with
Phase 1 (it's community-friendly and doesn't touch billing).*

## M4 — Deeper career roadmap 📚

Make the roadmap the reason people come back — richer, opinionated guidance for
building a DevRel career.

- Expand phases, skills, and topics in `lib/roadmap-data.ts` with concrete
  resources, milestones, and "what good looks like" per level.
- Community-sourced (see `CONTRIBUTING.md`) — low cost to you, high SEO/credibility
  value. **Stays free.**

## M5 — Browser extension 🧩

Let users run the analyzer on any job application page.

- Reads the job posting on-page, calls the **same authed, metered `/api/analyze`**
  → returns fit + skills inline.
- **Depends on M1–M3:** it consumes the same quota, so auth + enforcement must
  exist first. Do not start before the paid loop works.

## M6 — Educational resources hub 📄

DevRel whitepapers, reports, case studies, and ebooks.

- A content section for long-form DevRel education. Great for authority + SEO.
- Free to read (lead-gen / community), with content sourced over time.
- **Deferred:** high ongoing effort, low near-term revenue — build opportunistically
  once Phase 1 is stable. Not a near-term priority.

---

## Priorities at a glance

| Priority | Item | Notes |
| --- | --- | --- |
| 🔴 Now | **M1** cost protection | Unbounded spend today; urgent |
| 🟠 Next | **M2** accounts, **M3** payments | The revenue core |
| 🟡 Parallel | **M4** roadmap content | Community-driven, free, high relevance |
| 🟢 After core | **M5** extension | Reuses authed metered API |
| ⚪ Deferred | **M6** resources hub | Nice-to-have; not significant yet |

## Open decisions

| Decision | Options | Leaning |
| --- | --- | --- |
| Paid model | Monthly subscription vs pay-per-analysis credits | Subscription for predictability; credits are an easy add for occasional users |
| Price point | e.g. $5 / $7 / $9 per month | Set after measuring cost per analysis × quota |
| Auth method | Magic link vs email+password | Magic link (no passwords, verifies email) |
| Database | Neon Postgres vs Supabase | Neon (native Vercel Marketplace) + Upstash Redis |
| Free-tier abuse | IP/fingerprint vs signup-only | Server-side count in M1; tighten if abuse appears |
