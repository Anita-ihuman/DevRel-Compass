// Admin access is controlled by an allowlist of emails in ADMIN_EMAILS
// (comma-separated). Keeps the metrics dashboard private without a DB flag.
export function isAdmin(email?: string | null): boolean {
  if (!email) return false
  const list = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return list.includes(email.toLowerCase())
}
