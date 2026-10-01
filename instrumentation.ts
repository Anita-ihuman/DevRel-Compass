import type { Instrumentation } from 'next'

export function register() {}

// In production, Next.js replaces a server render error with a generic message
// and a digest before it reaches the browser — and the log line for the page
// shows only that. This hook sees the original error, so log it with the digest
// alongside: search Vercel logs for the digest a user reports to find the cause.
// Stays server-side; nothing here is sent to the browser.
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const error = err as Error & { digest?: string }
  console.error(
    `[request-error] digest=${error.digest ?? 'none'} ${request.method} ${request.path} ` +
      `route=${context.routePath} (${context.routeType}, ${context.renderSource ?? 'n/a'}): ` +
      `${error.name}: ${error.message}`,
  )
  if (error.stack) console.error(error.stack.split('\n').slice(0, 6).join('\n'))
}
