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

/**
 * Server-only: the Zoom room is only placed in emails, never rendered into
 * page HTML or returned from an action. It must never be committed to source.
 */
function zoomUrl(): string | null {
  const raw = process.env.REALITY_CHECK_ZOOM_URL?.trim()
  if (!raw) return null
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
  kind: "confirm" | "reminder-saturday" | "reminder-sunday-1pm" | "reminder-sunday-final",
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

export type ReminderStage = "saturday" | "sunday-1pm" | "sunday-final"

const REMINDER_COPY: Record<ReminderStage, { kind: "reminder-saturday" | "reminder-sunday-1pm" | "reminder-sunday-final"; subject: string; heading: string; intro: string }> = {
  saturday: {
    kind: "reminder-saturday",
    subject: "Tomorrow at 3 PM ET: plan ahead for your Reality Check™",
    heading: "Your Reality Check is tomorrow.",
    intro: "Your Weekly Work-Life Balance Reality Check™ is tomorrow at 3:00 PM Eastern. Set aside this time now and come ready to look honestly at how your business and life are working together.",
  },
  "sunday-1pm": {
    kind: "reminder-sunday-1pm",
    subject: "Today at 3 PM ET: get ready for your Reality Check™",
    heading: "We're meeting today.",
    intro: "Your Weekly Work-Life Balance Reality Check™ begins at 3:00 PM Eastern. Take a moment to get comfortable, gather your thoughts, and get ready to join us.",
  },
  "sunday-final": {
    kind: "reminder-sunday-final",
    subject: "Starting in 20 minutes: your Reality Check™",
    heading: "We're starting in 20 minutes.",
    intro: "Your Weekly Work-Life Balance Reality Check™ begins in 20 minutes at 3:00 PM Eastern. Use the Zoom link below to join the room now.",
  },
}

/**
 * Renders a reminder for a fictional recipient without sending it. The private
 * Zoom link is verified to be present, then redacted from the returned text.
 */
export function previewReminderEmail(stage: ReminderStage, sessionDate: string) {
  const copy = REMINDER_COPY[stage]
  const link = zoomUrl()
  const recipient: Recipient = { id: "dry-run", fullName: "Test Participant", email: "dry-run@example.invalid", sessionDate }
  const { html, text } = renderEmail({ heading: copy.heading, intro: copy.intro, recipient, link: link ?? "" })
  return {
    subject: copy.subject,
    sessionDateLabel: formatSessionDate(sessionDate),
    startTimeInEmail: text.includes(`${SESSION_TIME_LABEL} (Eastern Time)`),
    zoomConfigured: Boolean(link),
    zoomLinkInHtml: Boolean(link) && html.includes(`href="${escapeHtml(link!)}"`),
    zoomLinkInText: Boolean(link) && text.includes(link!),
    idempotencyKey: `reality-check-${copy.kind}-<registration id>`,
    textPreview: link ? text.split(link).join("[PRIVATE ZOOM LINK REDACTED]") : text,
  }
}

export function sendReminderEmail(recipient: Recipient, stage: ReminderStage) {
  const copy = REMINDER_COPY[stage]
  return send(recipient, copy.kind, copy.subject, copy.heading, copy.intro)
}
