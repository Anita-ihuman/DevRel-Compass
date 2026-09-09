// Cost of one hosted analysis, in USD.
//
// This exists to answer the one question M3 pricing depends on: what does a
// single /api/analyze call actually cost us in Anthropic tokens? Every
// successful analysis records its real token usage (see lib/metrics.ts), so the
// admin dashboard can show measured cost per analysis instead of a guess.

// Anthropic list prices for the model /api/analyze calls, in USD per million
// tokens. Update these together with the model in app/api/analyze/route.ts.
//
// claude-sonnet-5, as of 2026-09: $3.00 input / $15.00 output per MTok. (The
// $2/$10 introductory rate ended 2026-08-31.) Cache reads bill at ~0.1x input;
// ephemeral cache writes at 1.25x input for the default 5-minute TTL, which is
// what the system-prompt breakpoint in the analyze route uses.
export const PRICE_PER_MTOK = {
  input: 3.0,
  output: 15.0,
  cacheRead: 0.3,
  cacheWrite: 3.75,
} as const

export type TokenUsage = {
  input: number
  output: number
  cacheRead: number
  cacheWrite: number
}

// Anthropic's usage object splits input tokens three ways: fresh input, cache
// reads, and cache writes. They're disjoint — the true prompt size is their sum
// — so each bills at its own rate.
export function tokenUsageFrom(usage: {
  input_tokens?: number | null
  output_tokens?: number | null
  cache_read_input_tokens?: number | null
  cache_creation_input_tokens?: number | null
}): TokenUsage {
  return {
    input: usage.input_tokens ?? 0,
    output: usage.output_tokens ?? 0,
    cacheRead: usage.cache_read_input_tokens ?? 0,
    cacheWrite: usage.cache_creation_input_tokens ?? 0,
  }
}

const PER_TOKEN = 1_000_000

export function analysisCostUsd(u: TokenUsage): number {
  const usd =
    (u.input * PRICE_PER_MTOK.input +
      u.output * PRICE_PER_MTOK.output +
      u.cacheRead * PRICE_PER_MTOK.cacheRead +
      u.cacheWrite * PRICE_PER_MTOK.cacheWrite) /
    PER_TOKEN
  // Six decimals matches the NUMERIC(12,6) column; a single analysis costs
  // fractions of a cent, so rounding to cents here would lose the signal.
  return Number(usd.toFixed(6))
}

// Formats a small USD amount for the admin dashboard. Sub-cent costs are the
// normal case for one analysis, so keep enough precision to be readable.
export function formatUsd(usd: number): string {
  if (usd === 0) return '$0'
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  if (usd < 1) return `$${usd.toFixed(3)}`
  return `$${usd.toFixed(2)}`
}
