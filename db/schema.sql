-- DevRel Compass — M2 accounts schema (Auth.js / NextAuth v5 + Postgres).
-- Run this once against your Neon database (Neon SQL Editor, or psql).
-- Safe to re-run: every statement is IF NOT EXISTS.

-- ── Auth.js core tables (from @auth/pg-adapter) ─────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  -- App-specific: chosen at onboarding, unique across the site.
  username VARCHAR(50) UNIQUE,
  -- Billing plan. 'free' by default; M3 (Lemon Squeezy) flips this to a paid
  -- tier via webhooks. Saved history is unlocked for non-free plans.
  plan TEXT NOT NULL DEFAULT 'free',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ── App: per-account free-analysis usage ────────────────────────────────────
-- M2 grants a small number of free analyses per account. period_start lets M3
-- reset the count each billing cycle once subscriptions exist.
CREATE TABLE IF NOT EXISTS usage (
  "userId" INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  analyses_used INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── App: saved analysis history (per account) ───────────────────────────────
-- Summary columns power the fast history list; the full result JSON powers the
-- detail view.
CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  candidate_name TEXT,
  overall_score INTEGER,
  career_level TEXT,
  has_job_fit BOOLEAN NOT NULL DEFAULT false,
  result JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analyses_user_idx ON analyses ("userId", "createdAt" DESC);

-- Backfill for installs created before the plan column existed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';

-- ── Admin metrics: one row per successful analysis (anonymous + signed-in) ───
-- The token columns record what each analysis cost in Anthropic tokens, so the
-- monthly quota and price can be set from measured spend rather than a guess.
-- They are nullable: rows written before instrumentation have none, and the
-- admin dashboard averages only over rows that do.
CREATE TABLE IF NOT EXISTS analysis_events (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  signed_in BOOLEAN NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cache_read_tokens INTEGER,
  cache_write_tokens INTEGER,
  cost_usd NUMERIC(12, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analysis_events_created_idx ON analysis_events (created_at DESC);

-- Backfill for installs created before cost instrumentation.
ALTER TABLE analysis_events ADD COLUMN IF NOT EXISTS input_tokens INTEGER;
ALTER TABLE analysis_events ADD COLUMN IF NOT EXISTS output_tokens INTEGER;
ALTER TABLE analysis_events ADD COLUMN IF NOT EXISTS cache_read_tokens INTEGER;
ALTER TABLE analysis_events ADD COLUMN IF NOT EXISTS cache_write_tokens INTEGER;
ALTER TABLE analysis_events ADD COLUMN IF NOT EXISTS cost_usd NUMERIC(12, 6);

-- ── Newsletter subscribers ──────────────────────────────────────────────────
-- Double opt-in: a row starts 'pending' and only becomes 'confirmed' when the
-- person clicks the link we email them. Sending only ever goes to 'confirmed',
-- which keeps deliverability sane and means a typo'd or hostile signup never
-- results in mail to someone who didn't ask for it.
--
-- `token` is that subscriber's secret, used for both the confirm link and the
-- one-click unsubscribe link, so unsubscribing never requires signing in.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  token TEXT NOT NULL UNIQUE,
  -- Where the signup came from (e.g. 'newsletter-page', 'footer'), so we can
  -- tell which surfaces actually convert.
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);
-- Case-insensitive uniqueness: Foo@x.com and foo@x.com are the same inbox, and
-- signing up twice should update the existing row, not create a duplicate.
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_idx
  ON newsletter_subscribers (lower(email));
CREATE INDEX IF NOT EXISTS newsletter_status_idx ON newsletter_subscribers (status);

-- One row per issue actually sent, so a re-run can't mail the same issue twice.
CREATE TABLE IF NOT EXISTS newsletter_sends (
  slug TEXT PRIMARY KEY,
  recipients INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Subscriptions (M3): Lemon Squeezy is the merchant of record ─────────────
-- We store only what gating needs — no card data, no billing address. Webhooks
-- keep these in sync; `current_period_end` is the single field access is judged
-- against, so a cancelled subscription keeps working until the period runs out.
ALTER TABLE users ADD COLUMN IF NOT EXISTS ls_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ls_subscription_id TEXT;
-- Recorded for reference only. Do NOT link to it: Lemon Squeezy signs portal
-- URLs with a few hours' expiry, so a stored one is dead by the next time most
-- customers click it. /api/billing/portal mints a fresh URL per request.
ALTER TABLE users ADD COLUMN IF NOT EXISTS ls_portal_url TEXT;
-- Lemon Squeezy subscription status: active, on_trial, past_due, cancelled,
-- unpaid, expired. NULL for accounts that never subscribed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_status TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_quota INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS users_ls_subscription_idx
  ON users (ls_subscription_id) WHERE ls_subscription_id IS NOT NULL;
