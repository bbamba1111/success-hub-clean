import "server-only"
import { Resend } from "resend"
import {
  SESSION_DURATION_LABEL,
  SESSION_TIME_LABEL,
  formatSessionDate,
} from "@/lib/reality-check/session"

const FROM = "Make Time For More <noreply@hub.maketimeformore.com>"

type Recipient = { id: string; fullName: string; email: string; sessionDate: string }
type SendResult = { ok: true } | { ok: false; error: string }

const DEFAULT_ZOOM_URL = "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1"

/**
 * Server-only: the Zoom room is only placed in emails, never rendered into
 * page HTML or returned from an action. REALITY_CHECK_ZOOM_URL overrides it.
 */
function zoomUrl(): string | null {
  const raw = process.env.REALITY_CHECK_ZOOM_URL?.trim() || DEFAULT_ZOOM_URL
  try {
    const url = new URL(raw)
    return url.protocol === "https:" && url.hostname.endsWith("zoom.us") ? url.toString() : null
  } catch {
    return null
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}

function firstName(fullName: string) {
  return fullName.split(/\s+/)[0] || "there"
}

function renderEmail({
  heading,
  intro,
  recipient,
  link,
}: {
  heading: string
  intro: string
  recipient: Recipient
  link: string
}) {
  const date = formatSessionDate(recipient.sessionDate)
  const name = escapeHtml(firstName(recipient.fullName))
  const safeLink = escapeHtml(link)
  const details = `${date} · ${SESSION_TIME_LABEL} (Eastern Time) · ${SESSION_DURATION_LABEL}`

  const html = `<!doctype html><html><body style="margin:0;background:#FFF8F4;font-family:Helvetica,Arial,sans-serif;color:#4A3A42">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDFB;border-radius:16px;padding:32px">
<tr><td>
<p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#5A7F46;font-weight:bold">Weekly Work-Life Balance Reality Check™</p>
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;line-height:1.25;color:#4A3A42">${heading}</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6">Hi ${name},</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.6">${intro}</p>
<p style="margin:0 0 20px;padding:16px;border-radius:12px;background:#EEF3E8;font-size:16px;line-height:1.6;font-weight:bold">${escapeHtml(details)}</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6">Your private Zoom room link is below. Please join a few minutes before the session begins so we can get started on time.</p>
<p style="margin:0 0 24px"><a href="${safeLink}" style="display:inline-block;background:#C13B6B;color:#FFF8F4;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:999px;font-size:15px">Join the Reality Check on Zoom</a></p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5A4A52;word-break:break-all">Or copy this link: ${safeLink}</p>
<p style="margin:0;font-size:15px;line-height:1.6;font-style:italic">We Don't Hustle — We Harmonize Work &amp; Life.™<br>Barbara Bamba, Make Time For More™</p>
</td></tr></table></td></tr></table></body></html>`

  const text = [
    `Hi ${firstName(recipient.fullName)},`,
    "",
    intro,
    "",
    details,
    "",
    "Your private Zoom room link is below. Please join a few minutes before the session begins so we can get started on time.",
    link,
    "",
    "Barbara Bamba, Make Time For More™",
  ].join("\n")

  return { html, text }
}

async function send(
  recipient: Recipient,
  kind: "confirm" | "reminder",
  subject: string,
  heading: string,
  intro: string,
): Promise<SendResult> {
  const link = zoomUrl()
  if (!link) return { ok: false, error: "REALITY_CHECK_ZOOM_URL is not configured" }
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY is not configured" }

  const { html, text } = renderEmail({ heading, intro, recipient, link })
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send(
      { from: FROM, to: recipient.email, subject, html, text },
      { idempotencyKey: `reality-check-${kind}-${recipient.id}` },
    )
    if (error) return { ok: false, error: error.message ?? "Email provider error" }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Email provider error" }
  }
}

export function sendConfirmationEmail(recipient: Recipient) {
  const date = formatSessionDate(recipient.sessionDate)
  return send(
    recipient,
    "confirm",
    `You're registered: Reality Check™ on ${date} at ${SESSION_TIME_LABEL}`,
    "Your seat is saved.",
    "Your registration for the free Weekly Work-Life Balance Reality Check™ was received. Here are your session details.",
  )
}

export function sendReminderEmail(recipient: Recipient) {
  return send(
    recipient,
    "reminder",
    `Today at ${SESSION_TIME_LABEL}: your Reality Check™`,
    "See you today.",
    "A quick reminder that your free Weekly Work-Life Balance Reality Check™ is coming up today.",
  )
}
