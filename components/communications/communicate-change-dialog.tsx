"use client"

/**
 * Communicate My Change™ / Communicate My Boundary™
 * ---------------------------------------------------------------------------
 * One lightweight builder, two entry points. Pre-filled from the founder's
 * existing weekly commitment — she never re-enters the rule or life priority.
 *
 *   WHO NEEDS TO KNOW? → WHEN DOES THIS APPLY? → WHAT DO YOU WANT THEM TO UNDERSTAND?
 *   → AI DRAFT (first person) → EDIT → TONE → FORMAT → APPROVE & SAVE → MARK AS USED
 *
 * Not a document platform, not a CRM, not an email system. "Make the change clear."
 */

import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Download, ExternalLink, Mail, Pencil, Printer, RefreshCw, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { loadDailyIdentity } from "@/lib/daily-identity/storage"
import {
  AUDIENCES,
  AUDIENCE_LABEL,
  TIMING_OPTIONS,
  TONES,
  TONE_LABEL,
  type Audience,
  type CommitmentCommunication,
  type CommitmentType,
  type CommunicationFormat,
  type DraftResponse,
  type Tone,
} from "@/lib/communications/types"
import { listCommunications, markCommunicationUsed, saveCommunication } from "@/lib/communications/server"
import { copyText, downloadPdf, emailText, mailtoHref, openInGoogleDocs, printCommunication, type ExportPayload } from "@/lib/communications/export"

export interface CommunicateChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The weekly commitments record id this communication belongs to. */
  weeklyCommitmentId: string | null
  commitmentType: CommitmentType
  /** The founder's chosen rule or life priority, exactly as stored. */
  commitmentText: string
  /** Pre-fill from what's already captured in the commitment. */
  initialAudience?: Audience[]
  initialTiming?: string | null
}

const TITLE: Record<CommitmentType, string> = {
  "operating-rule": "Communicate My Change™",
  life: "Communicate My Boundary™",
}

const WHEN_LABEL: Record<CommitmentType, string> = {
  "operating-rule": "When does this rule apply?",
  life: "When am I protecting this time?",
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
        selected ? "border-[#5A7A45] bg-[#5A7A45] text-white" : "border-[#E8DFE2] bg-white text-[#3A2E33] hover:border-[#8DAE72]"
      }`}
    >
      {children}
    </button>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">{children}</p>
}

export function CommunicateChangeDialog({
  open,
  onOpenChange,
  weeklyCommitmentId,
  commitmentType,
  commitmentText,
  initialAudience = [],
  initialTiming = null,
}: CommunicateChangeDialogProps) {
  const title = TITLE[commitmentType]

  const [audience, setAudience] = useState<Audience[]>(initialAudience)
  const [audienceOther, setAudienceOther] = useState("")
  const [timing, setTiming] = useState<string>(initialTiming ?? "")
  const [timingOther, setTimingOther] = useState("")
  const [desiredOutcome, setDesiredOutcome] = useState("")
  const [tone, setTone] = useState<Tone>("warm")

  const [draft, setDraft] = useState<DraftResponse | null>(null)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [editing, setEditing] = useState(false)
  const [drafting, setDrafting] = useState(false)
  const [draftError, setDraftError] = useState<string | null>(null)

  const [record, setRecord] = useState<CommitmentCommunication | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [previous, setPrevious] = useState<CommitmentCommunication[]>([])

  // Reset to the commitment's stored values each time the dialog opens.
  useEffect(() => {
    if (!open) return
    setAudience(initialAudience)
    setTiming(initialTiming ?? "")
    setTimingOther("")
    setAudienceOther("")
    setDesiredOutcome("")
    setTone("warm")
    setDraft(null)
    setSubject("")
    setBody("")
    setEditing(false)
    setRecord(null)
    setSaveError(null)
    setDraftError(null)
    if (weeklyCommitmentId) {
      void listCommunications(weeklyCommitmentId, commitmentType).then(setPrevious)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const effectiveTiming = timing === "__other" ? timingOther.trim() : timing
  const canDraft = audience.length > 0 && commitmentText.trim().length > 0 && !drafting
  const approved = record?.status === "approved" || record?.status === "used"

  const payload: ExportPayload = useMemo(
    () => ({
      title,
      commitmentType,
      commitmentText,
      audience,
      audienceOther,
      timing: effectiveTiming || null,
      subject,
      body,
    }),
    [title, commitmentType, commitmentText, audience, audienceOther, effectiveTiming, subject, body],
  )

  function toggleAudience(a: Audience) {
    setAudience((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  async function generate() {
    setDrafting(true)
    setDraftError(null)
    try {
      const identity = loadDailyIdentity().identityStatement || null
      const res = await fetch("/api/communications/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitmentType,
          commitmentText,
          audience,
          audienceOther: audienceOther || null,
          timing: effectiveTiming || null,
          desiredOutcome: desiredOutcome || null,
          tone,
          identity,
        }),
      })
      const data = (await res.json()) as DraftResponse & { error?: string }
      if (!res.ok || data.error) throw new Error(data.error ?? "Could not write a draft.")
      setDraft(data)
      setSubject(data.subject)
      setBody(data.body)
      setEditing(false)
      setRecord(null) // a fresh draft is not the approved one
    } catch (e) {
      setDraftError(e instanceof Error ? e.message : "Could not write a draft.")
    } finally {
      setDrafting(false)
    }
  }

  async function approveAndSave() {
    if (!weeklyCommitmentId) {
      setSaveError("Save your week first so this communication has a home.")
      return
    }
    setSaving(true)
    setSaveError(null)
    const res = await saveCommunication({
      id: record?.id ?? null,
      weeklyCommitmentId,
      commitmentType,
      commitmentText,
      audience,
      audienceOther: audienceOther || null,
      timing: effectiveTiming || null,
      desiredOutcome: desiredOutcome || null,
      tone,
      generatedSubject: draft?.subject ?? null,
      generatedBody: draft?.body ?? null,
      finalSubject: subject,
      finalBody: body,
      status: "approved",
    })
    setSaving(false)
    if (!res.ok) {
      setSaveError(res.error)
      return
    }
    setRecord(res.record)
    setEditing(false)
    setPrevious((p) => [res.record, ...p.filter((x) => x.id !== res.record.id)])
  }

  async function useFormat(format: CommunicationFormat) {
    switch (format) {
      case "copy":
        await copyText(`${subject}\n\n${body}`)
        flash("copy")
        break
      case "email":
        await copyText(emailText(payload))
        flash("email")
        window.location.href = mailtoHref(payload)
        break
      case "pdf":
        await downloadPdf(payload)
        break
      case "google-doc":
        await openInGoogleDocs(payload)
        flash("google-doc")
        break
      case "print":
        printCommunication(payload)
        break
    }
    // Remember the founder's chosen format on the approved record (not "used" yet).
    if (record && record.status === "approved" && weeklyCommitmentId) {
      const res = await saveCommunication({ ...toInput(record), id: record.id, finalFormat: format, status: "approved" })
      if (res.ok) setRecord(res.record)
    }
  }

  function flash(key: string) {
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  async function markUsed() {
    if (!record) return
    const res = await markCommunicationUsed(record.id, record.finalFormat)
    if (res.ok) {
      setRecord(res.record)
      setPrevious((p) => p.map((x) => (x.id === res.record.id ? res.record : x)))
    }
  }

  function reuse(prev: CommitmentCommunication) {
    // Edit & Reuse — a new communication from the same commitment; never a duplicate priority.
    setAudience(prev.audience)
    setAudienceOther(prev.audienceOther ?? "")
    setTiming(prev.timing ?? "")
    setDesiredOutcome(prev.desiredOutcome ?? "")
    setTone(prev.tone)
    setDraft(prev.generatedSubject && prev.generatedBody ? { subject: prev.generatedSubject, body: prev.generatedBody } : null)
    setSubject(prev.finalSubject ?? prev.generatedSubject ?? "")
    setBody(prev.finalBody ?? prev.generatedBody ?? "")
    setRecord(null)
    setEditing(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl border border-[#E8DFE2] bg-[#FDFBFA] p-0">
        <div className="px-7 pt-7 pb-6 space-y-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#5A7A45]">{title}</DialogTitle>
            <DialogDescription className="font-serif text-2xl font-semibold leading-snug text-[#2E1F27] text-balance">
              Make your new boundary or operating rule clear to the people who need to know.
            </DialogDescription>
          </DialogHeader>

          {/* WHAT — pre-filled, read only */}
          <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 space-y-1.5">
            <Label>{commitmentType === "operating-rule" ? "Weekly Operating Rule Priority™" : "Weekly Life Priority™"}</Label>
            <p className="font-sans text-base text-[#2E1F27] leading-relaxed">{commitmentText}</p>
          </div>

          {/* WHO */}
          <div className="space-y-3">
            <Label>Who needs to know?</Label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <Chip key={a} selected={audience.includes(a)} onClick={() => toggleAudience(a)}>
                  {AUDIENCE_LABEL[a]}
                </Chip>
              ))}
            </div>
            {audience.includes("other") && (
              <input
                value={audienceOther}
                onChange={(e) => setAudienceOther(e.target.value)}
                placeholder="Who else? (e.g. my assistant, my bookkeeper)"
                aria-label="Other audience"
                className="w-full rounded-xl border border-[#E8DFE2] bg-white px-4 py-2.5 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
              />
            )}
          </div>

          {/* WHEN */}
          <div className="space-y-3">
            <Label>{WHEN_LABEL[commitmentType]}</Label>
            <div className="flex flex-wrap gap-2">
              {TIMING_OPTIONS.map((t) => (
                <Chip key={t} selected={timing === t} onClick={() => setTiming(timing === t ? "" : t)}>
                  {t}
                </Chip>
              ))}
              <Chip selected={timing === "__other"} onClick={() => setTiming(timing === "__other" ? "" : "__other")}>
                Other
              </Chip>
            </div>
            {timing === "__other" && (
              <input
                value={timingOther}
                onChange={(e) => setTimingOther(e.target.value)}
                placeholder="e.g. Tuesdays and Thursdays, 9–11 AM"
                aria-label="Other timing"
                className="w-full rounded-xl border border-[#E8DFE2] bg-white px-4 py-2.5 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
              />
            )}
          </div>

          {/* DESIRED OUTCOME */}
          <div className="space-y-2">
            <Label>What do you want them to understand?</Label>
            <input
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="Optional — e.g. routine questions should not interrupt my protected CEO Workday."
              aria-label="What do you want them to understand"
              className="w-full rounded-xl border border-[#E8DFE2] bg-white px-4 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#9A8A90] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
            />
          </div>

          {/* TONE */}
          <div className="space-y-3">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <Chip key={t} selected={tone === t} onClick={() => setTone(t)}>
                  {TONE_LABEL[t]}
                </Chip>
              ))}
            </div>
          </div>

          {/* DRAFT */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={!canDraft}
              className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {drafting ? <RefreshCw className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
              {draft ? "Write it again" : "Write my message"}
            </button>
            {audience.length === 0 && <p className="font-sans text-xs text-[#6B5860]">Choose who needs to know first.</p>}
            {draftError && <p className="font-sans text-xs text-[#C0545A]">{draftError}</p>}
          </div>

          {(draft || body) && (
            <div className="rounded-2xl border-2 border-[#7FB069]/30 bg-white px-6 py-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label>{approved ? (record?.status === "used" ? "Used" : "Approved") : "Your message"}</Label>
                {!editing && (
                  <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:underline">
                    <Pencil className="h-3 w-3" aria-hidden /> Edit message
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-3">
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    aria-label="Subject"
                    className="w-full rounded-xl border border-[#E8DFE2] px-4 py-2.5 font-sans text-sm font-semibold text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                  />
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={7}
                    aria-label="Message"
                    className="w-full rounded-xl border border-[#E8DFE2] px-4 py-3 font-sans text-sm leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(false)} className="rounded-full bg-[#5A7A45] px-4 py-2 font-sans text-xs font-bold text-white hover:opacity-90">
                      Done editing
                    </button>
                    {draft && (
                      <button
                        type="button"
                        onClick={() => {
                          setSubject(draft.subject)
                          setBody(draft.body)
                        }}
                        className="rounded-full border border-[#E8DFE2] px-4 py-2 font-sans text-xs font-semibold text-[#6B5860] hover:bg-black/[0.03]"
                      >
                        Reset to draft
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-sans text-sm font-semibold text-[#2E1F27]">Subject: {subject}</p>
                  <p className="font-serif text-lg leading-relaxed text-[#2E1F27] whitespace-pre-wrap">{body}</p>
                </div>
              )}

              {/* APPROVE */}
              {!approved && !editing && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={approveAndSave}
                    disabled={saving || !subject.trim() || !body.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" aria-hidden /> {saving ? "Saving…" : "Approve & Save"}
                  </button>
                  {saveError && <p className="font-sans text-xs text-[#C0545A]">{saveError}</p>}
                </div>
              )}

              {/* FORMAT */}
              {approved && (
                <div className="space-y-3 pt-1">
                  <Label>Communication format</Label>
                  <div className="flex flex-wrap gap-2">
                    <FormatButton icon={Copy} label={copied === "copy" ? "Copied" : "Copy"} onClick={() => useFormat("copy")} />
                    <FormatButton icon={Mail} label={copied === "email" ? "Copied for email" : "Use as Email"} onClick={() => useFormat("email")} />
                    <FormatButton icon={Download} label="Download PDF" onClick={() => useFormat("pdf")} />
                    <FormatButton icon={ExternalLink} label={copied === "google-doc" ? "Copied — paste in Doc" : "Open in Google Docs"} onClick={() => useFormat("google-doc")} />
                    <FormatButton icon={Printer} label="Print" onClick={() => useFormat("print")} />
                  </div>
                  <p className="font-sans text-xs text-[#6B5860]">
                    Google Docs opens a fresh document with your message copied — paste it in. Email opens your mail app with the subject and message filled in.
                  </p>

                  {record?.status === "used" ? (
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45]/10 px-3 py-1.5 font-sans text-xs font-bold text-[#5A7A45]">
                      <Check className="h-3 w-3" aria-hidden /> Marked as used
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={markUsed}
                      className="inline-flex items-center gap-2 rounded-full border border-[#5A7A45] px-4 py-2 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden /> Mark as Used
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* EDIT & REUSE — other communications from this same commitment */}
          {previous.filter((p) => p.id !== record?.id).length > 0 && (
            <div className="space-y-2">
              <Label>Already written for this {commitmentType === "operating-rule" ? "rule" : "priority"}</Label>
              <ul className="space-y-2">
                {previous
                  .filter((p) => p.id !== record?.id)
                  .map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E8DFE2] bg-white px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-semibold text-[#2E1F27]">{p.finalSubject ?? p.generatedSubject ?? "Untitled"}</p>
                        <p className="font-sans text-xs text-[#6B5860]">
                          To {p.audience.map((a) => AUDIENCE_LABEL[a]).join(", ")} · {p.status === "used" ? "Used" : p.status === "approved" ? "Approved" : "Draft"}
                        </p>
                      </div>
                      <button type="button" onClick={() => reuse(p)} className="shrink-0 font-sans text-xs font-bold text-[#5A7A45] hover:underline">
                        Edit &amp; Reuse
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FormatButton({ icon: Icon, label, onClick }: { icon: typeof Copy; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-3.5 py-2 font-sans text-xs font-semibold text-[#3A2E33] hover:border-[#8DAE72] hover:bg-[#F4F7F0]"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
    </button>
  )
}

function toInput(r: CommitmentCommunication) {
  return {
    weeklyCommitmentId: r.weeklyCommitmentId,
    commitmentType: r.commitmentType,
    commitmentText: r.commitmentText,
    audience: r.audience,
    audienceOther: r.audienceOther,
    timing: r.timing,
    desiredOutcome: r.desiredOutcome,
    tone: r.tone,
    generatedSubject: r.generatedSubject,
    generatedBody: r.generatedBody,
    finalSubject: r.finalSubject,
    finalBody: r.finalBody,
  }
}
