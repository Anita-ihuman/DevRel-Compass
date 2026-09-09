// The paid plan, in one place.
//
// Price and quota are decided values, not configuration — the checkout price
// lives in the Lemon Squeezy variant, and these have to agree with it. Keeping
// them here (rather than in env vars) means the marketing copy, the quota the
// server enforces, and the admin cost projection can never drift apart.
//
// Changing the price means changing it in BOTH places: the Lemon Squeezy
// variant is what actually charges the customer.
export const PLAN = {
  /** Label stored in users.plan. Anything other than 'free' counts as paid. */
  id: 'pro',
  name: 'Pro',
  /** Display price, formatted. */
  price: '$5',
  interval: 'month',
  /** Analyses included per billing month, enforced server-side. */
  quota: 25,
} as const

// One line of copy, used on every upgrade surface so they stay consistent.
export const PLAN_SUMMARY = `${PLAN.price}/${PLAN.interval} · ${PLAN.quota} analyses`
