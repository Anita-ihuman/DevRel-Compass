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
CREATE TABLE IF NOT EXISTS analysis_events (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  signed_in BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analysis_events_created_idx ON analysis_events (created_at DESC);
