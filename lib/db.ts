import { Pool } from '@neondatabase/serverless'

// Shared Postgres pool (Neon). The Vercel Neon integration injects DATABASE_URL;
// we also accept POSTGRES_URL as a fallback. The pool connects lazily on first
// query, so importing this module is safe even before the DB is provisioned.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED

export const pool = new Pool({ connectionString })

// True once a connection string is present — lets callers degrade gracefully
// (e.g. skip account gating) before Neon is wired up.
export const dbConfigured = Boolean(connectionString)
