// One approved communication → Copy / Email / PDF / Google Docs / Print.
// No per-format editors: the founder edits one message, then chooses how to use it.

import { AUDIENCE_LABEL, type Audience, type CommitmentType } from "./types"

export interface ExportPayload {
  title: string // e.g. "Communicate + Delegate™" or the action label
  commitmentType: CommitmentType
  commitmentText: string
  /** Footer label for the context block, e.g. "Weekly Operating Rule Priority™". */
  contextLabel?: string
  audience: Audience[]
  audienceOther?: string | null
  timing?: string | null
  subject: string
  body: string
  date?: Date
}

export function audienceText(audience: Audience[], other?: string | null) {
  return audience.map((a) => (a === "other" && other?.trim() ? other.trim() : AUDIENCE_LABEL[a])).join(", ")
}

export function emailText(p: ExportPayload) {
  return `Subject: ${p.subject}\n\n${p.body}`
}

export function mailtoHref(p: ExportPayload) {
  return `mailto:?subject=${encodeURIComponent(p.subject)}&body=${encodeURIComponent(p.body)}`
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}

function fileStem(p: ExportPayload) {
  return p.subject.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "communication"
}

/** Simple, professional single-page PDF (multi-page only if the body needs it). */
export async function downloadPdf(p: ExportPayload) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "letter" })
  const margin = 64
  const width = doc.internal.pageSize.getWidth() - margin * 2
  let y = margin
  const date = (p.date ?? new Date()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })

  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(90, 122, 69)
  doc.text(p.title.toUpperCase(), margin, y)
  y += 22

  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(46, 31, 39)
  const subj = doc.splitTextToSize(p.subject, width)
  doc.text(subj, margin, y)
  y += subj.length * 22 + 6

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(107, 88, 96)
  const meta = [
    `To: ${audienceText(p.audience, p.audienceOther)}`,
    p.timing ? `When: ${p.timing}` : null,
    `Date: ${date}`,
  ].filter(Boolean) as string[]
  meta.forEach((m) => {
    doc.text(m, margin, y)
    y += 14
  })
  y += 12
  doc.setDrawColor(232, 223, 226).line(margin, y, margin + width, y)
  y += 24

  doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(46, 31, 39)
  const lines = doc.splitTextToSize(p.body, width) as string[]
  const lineH = 18
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(line, margin, y)
    y += lineH
  }

  y += 24
  if (y > doc.internal.pageSize.getHeight() - margin - 40) {
    doc.addPage()
    y = margin
  }
  doc.setDrawColor(232, 223, 226).line(margin, y, margin + width, y)
  y += 18
  if (p.commitmentText?.trim()) {
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(90, 122, 69)
    doc.text((p.contextLabel ?? "Context").toUpperCase(), margin, y)
    y += 14
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(107, 88, 96)
    doc.text(doc.splitTextToSize(p.commitmentText, width), margin, y)
  }

  doc.save(`${fileStem(p)}.pdf`)
}

/** Print via a clean, minimal window — same content as the PDF. */
export function printCommunication(p: ExportPayload) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=760,height=900")
  if (!w) return
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string)
  const date = (p.date ?? new Date()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
  w.document.write(`<!doctype html><html><head><title>${esc(p.subject)}</title>
<style>
body{font-family:Georgia,serif;color:#2E1F27;max-width:640px;margin:64px auto;padding:0 24px;line-height:1.55}
.k{font:700 10px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#5A7A45}
h1{font-size:24px;margin:10px 0 14px}
.meta{font:13px Helvetica,Arial,sans-serif;color:#6B5860}
hr{border:0;border-top:1px solid #E8DFE2;margin:20px 0}
p{font-size:16px;white-space:pre-wrap}
.c{font:13px Helvetica,Arial,sans-serif;color:#6B5860}
</style></head><body>
<div class="k">${esc(p.title)}</div>
<h1>${esc(p.subject)}</h1>
<div class="meta">To: ${esc(audienceText(p.audience, p.audienceOther))}${p.timing ? `<br>When: ${esc(p.timing)}` : ""}<br>Date: ${esc(date)}</div>
<hr><p>${esc(p.body)}</p>
${p.commitmentText?.trim() ? `<hr><div class="k">${esc(p.contextLabel ?? "Context")}</div><div class="c">${esc(p.commitmentText)}</div>` : ""}
<script>window.onload=function(){window.print()}</script>
</body></html>`)
  w.document.close()
}

/**
 * Google Docs — no Google integration exists in this project, so we use the
 * clean path: copy the text and open a fresh Google Doc for the founder to paste into.
 */
export async function openInGoogleDocs(p: ExportPayload) {
  await copyText(`${p.subject}\n\n${p.body}`)
  window.open("https://docs.google.com/document/create", "_blank", "noopener,noreferrer")
}
