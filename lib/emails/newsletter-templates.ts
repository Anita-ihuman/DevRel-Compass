import { marked } from 'marked'
import { siteName, siteUrl } from '@/lib/site'
import type { EmailMessage } from '@/lib/email'

// Email HTML, deliberately plain: inline styles only, a single column, no
// external CSS or webfonts. Mail clients strip <style> blocks and anything
// clever, so the safe subset is what actually renders in Gmail and Outlook.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function shell(bodyHtml: string, footerHtml: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f5f4;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917;line-height:1.65;">
    <a href="${siteUrl}" style="font-size:15px;font-weight:700;color:#7c3aed;text-decoration:none;">${escapeHtml(siteName)}</a>
    <div style="margin-top:24px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:28px 24px;">
      ${bodyHtml}
    </div>
    <div style="margin-top:20px;font-size:12px;color:#78716c;text-align:center;">
      ${footerHtml}
    </div>
  </div>
</body></html>`
}

const BUTTON =
  'display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;font-size:14px;'

export function confirmationEmail({
  to,
  confirmUrl,
}: {
  to: string
  confirmUrl: string
}): EmailMessage {
  const body = `
    <h1 style="margin:0 0 12px;font-size:20px;">Confirm your subscription</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#44403c;">
      You asked to receive the ${escapeHtml(siteName)} newsletter — writing on Developer
      Relations and developer experience, plus resources and what's moving in the industry.
      Click below to confirm and you're on the list.
    </p>
    <p style="margin:0 0 20px;"><a href="${confirmUrl}" style="${BUTTON}">Confirm subscription</a></p>
    <p style="margin:0;font-size:13px;color:#78716c;">
      If you didn't sign up, ignore this email — nothing further will be sent, and the
      address is removed automatically.
    </p>`
  // No unsubscribe header here: there is nothing to unsubscribe from until they
  // confirm, and offering it would be confusing.
  return { to, subject: `Confirm your ${siteName} subscription`, html: shell(body, '') }
}

export function issueEmail({
  to,
  title,
  markdown,
  issueUrl,
  unsubscribeUrl,
}: {
  to: string
  title: string
  markdown: string
  issueUrl: string
  unsubscribeUrl: string
}): EmailMessage {
  const rendered = marked.parse(markdown, { async: false }) as string
  const body = `
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;">${escapeHtml(title)}</h1>
    <div style="font-size:15px;color:#292524;">${rendered}</div>`
  const footer = `
    <p style="margin:0 0 6px;">
      <a href="${issueUrl}" style="color:#7c3aed;">Read this issue on the web</a>
    </p>
    <p style="margin:0;">
      You're receiving this because you subscribed at ${escapeHtml(siteName)}.
      <a href="${unsubscribeUrl}" style="color:#78716c;text-decoration:underline;">Unsubscribe</a>
    </p>`
  return {
    to,
    subject: title,
    html: shell(body, footer),
    unsubscribeUrl,
  }
}
