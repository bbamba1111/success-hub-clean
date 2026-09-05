"use client"

/**
 * Communicate + Delegate™
 * ---------------------------------------------------------------------------
 * One lightweight tool the founder opens while she is working — or from a
 * weekly commitment. She picks WHAT she needs to do; the system carries the
 * context she already decided; Harmony writes a concise first-person message
 * she edits and uses.
 *
 *   WHAT DO YOU NEED TO DO? → WHO NEEDS TO KNOW? → WHEN? → THE TOPIC →
 *   (delegation / rule details) → WHAT THEY SHOULD KNOW → AI DRAFT → EDIT →
 *   TONE → APPROVE & SAVE → COPY / EMAIL / PDF / DOC / PRINT → MARK AS USED
 *
 * The saved record is the SOURCE message — one approved communication that can
 * gain multiple delivery channels later. Not a planner, not a CRM, not email
 * infrastructure. It never creates a weekly priority or a task.
 */

import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Download, ExternalLink, Mail, Pencil, Printer, RefreshCw, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { loadDailyIdentity } from "@/lib/daily-identity/storage"
import {
  AUDIENCES,
  AUDIENCE_LABEL,
  COMMUNICATION_TYPES,
  COMMUNICATION_TYPE_LABEL,
  TIMING_OPTIONS,
  TONES,
  TONE_LABEL,
  type Audience,
  type CommitmentType,
  type CommunicationDetails,
  type CommunicationFormat,
  type CommunicationRecord,
  type CommunicationType,
  type DraftResponse,
  type SourceContext,
  type Tone,
} from "@/lib/communications/types"
import { listCommunications, markCommunicationUsed, saveCommunication, type SaveCommunicationInput } from "@/lib/communications/server"
import { copyText, downloadPdf, emailText, mailtoHref, openInGoogleDocs, printCommunication, type ExportPayload } from "@/lib/communications/export"

export interface CommunicateDelegateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where the tool was opened from — sets defaults and how the record is tagged. */
  sourceContext: SourceContext
  /** Which weekly decision (if any) this executes. */
  commitmentId?: string | null
  commitmentType?: CommitmentType
  /** The commitment / work context text, shown as a reminder and stored for the footer. */
  commitmentText?: string
  contextLabel?: string
  /** Live CEO Workday linkage. */
  workItemId?: string | null
  planId?: string | null
  /** Pre-select the action; when omitted the founder chooses it first. */
  initialType?: CommunicationType
  initialAudience?: Audience[]
  initialTiming?: string | null
  /** Prefill the topic (the rule text, the hand-off, the current work item …). */
  initialSubjectText?: string | null
}

// The "WHAT IS IT?" question adapts to the action.
const TOPIC_LABEL: Record<CommunicationType, string> = {
  communicate: "What do you need to communicate?",
  notify: "What are you notifying them about?",
  inform: "What do they need to be informed of?",
  delegate: "What are you handing off?",
  boundary: "What boundary are you setting?",
  ask: "What are you asking for?",
  "operating-rule": "What rule are you putting in place?",
  other: "What is this about?",
}

const INTENT_LABEL: Record<CommunicationType, string> = {
  communicate: "What do you want them to know?",
  notify: "What do you want them to know?",
  inform: "What do you want them to know?",
  delegate: "What do they need to know to own it?",
  boundary: "What do you want them to understand?",
  ask: "What context should they have?",
  "operating-rule": "What do you want them to understand?",
  other: "What do you want them to know?",
}

function commitmentTypeFor(type: CommunicationType, fallback: CommitmentType): CommitmentType {
  if (type === "operating-rule") return "operating-rule"
  if (type === "delegate") return "delegation"
  if (type === "boundary") return "life"
  return fallback
}

function contextLabelFor(commitmentType: CommitmentType): string {
  if (commitmentType === "operating-rule") return "Weekly Operating Rule Priority™"
  if (commitmentType === "life") return "Weekly Life Priority™"
  if (commitmentType === "delegation") return "Weekly Delegation Priority™"
  return "Working on"
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

function Field({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  label: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="w-full rounded-xl border border-[#E8DFE2] bg-white px-4 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#9A8A90] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
    />
  )
}

export function CommunicateDelegateDialog({
  open,
  onOpenChange,
  sourceContext,
  commitmentId = null,
  commitmentType: commitmentTypeProp = "none",
  commitmentText = "",
  contextLabel,
  workItemId = null,
  planId = null,
  initialType,
  initialAudience = [],
  initialTiming = null,
  initialSubjectText = null,
}: CommunicateDelegateDialogProps) {
  const [type, setType] = useState<CommunicationType | null>(initialType ?? null)
  const [audience, setAudience] = useState<Audience[]>(initialAudience)
  const [audienceOther, setAudienceOther] = useState("")
  const [timing, setTiming] = useState<string>(initialTiming ?? "")
  const [timingOther, setTimingOther] = useState("")
  const [subjectText, setSubjectText] = useState(initialSubjectText ?? "")
  const [messageIntent, setMessageIntent] = useState("")
  const [desiredOutcome, setDesiredOutcome] = useState("")
  const [tone, setTone] = useState<Tone>("warm")

  // Delegation + operating-rule extras.
  const [owner, setOwner] = useState("")
  const [doneLooksLike, setDoneLooksLike] = useState("")
  const [authority, setAuthority] = useState("")
  const [appliesTo, setAppliesTo] = useState("")
  const [whenTriggered, setWhenTriggered] = useState("")

  const [draft, setDraft] = useState<DraftResponse | null>(null)
  const [subject, setSubject] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [editing, setEditing] = useState(false)
  const [drafting, setDrafting] = useState(false)
  const [draftError, setDraftError] = useState<string | null>(null)

  const [record, setRecord] = useState<CommunicationRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [previous, setPrevious] = useState<CommunicationRecord[]>([])

  useEffect(() => {
    if (!open) return
    setType(initialType ?? null)
    setAudience(initialAudience)
    setAudienceOther("")
    setTiming(initialTiming ?? "")
    setTimingOther("")
    setSubjectText(initialSubjectText ?? "")
    setMessageIntent("")
    setDesiredOutcome("")
    setTone("warm")
    setOwner("")
    setDoneLooksLike("")
    setAuthority("")
    setAppliesTo("")
    setWhenTriggered("")
    setDraft(null)
    setSubject("")
    setMessageBody("")
    setEditing(false)
    setRecord(null)
    setSaveError(null)
    setDraftError(null)
    if (commitmentId || workItemId) {
      void listCommunications({ commitmentId, workItemId }).then(setPrevious)
    } else {
      setPrevious([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const effectiveTiming = timing === "__other" ? timingOther.trim() : timing
  const commitmentType = type ? commitmentTypeFor(type, commitmentTypeProp) : commitmentTypeProp
  const footerLabel = contextLabel ?? contextLabelFor(commitmentType)
  const details: CommunicationDetails = useMemo(() => {
    const d: CommunicationDetails = {}
    if (type === "delegate") d.delegation = { owner, doneLooksLike, authority }
    if (type === "operating-rule") d.rule = { appliesTo, whenTriggered }
    return d
  }, [type, owner, doneLooksLike, authority, appliesTo, whenTriggered])

  const canDraft = !!type && audience.length > 0 && subjectText.trim().length > 0 && !drafting
  const approved = record?.status === "approved" || record?.status === "used"

  const payload: ExportPayload = useMemo(
    () => ({
      title: "Communicate + Delegate™",
      commitmentType,
      commitmentText,
      contextLabel: footerLabel,
      audience,
      audienceOther,
      timing: effectiveTiming || null,
      subject,
      body: messageBody,
    }),
    [commitmentType, commitmentText, footerLabel, audience, audienceOther, effectiveTiming, subject, messageBody],
  )

  function toggleAudience(a: Audience) {
    setAudience((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  async function generate() {
    if (!type) return
    setDrafting(true)
    setDraftError(null)
    try {
      const identity = loadDailyIdentity().identityStatement || null
      const res = await fetch("/api/communications/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communicationType: type,
          commitmentType,
          subjectText,
          audience,
          audienceOther: audienceOther || null,
          timing: effectiveTiming || null,
          messageIntent: messageIntent || null,
          desiredOutcome: desiredOutcome || null,
          tone,
          details,
          identity,
        }),
      })
      const data = (await res.json()) as DraftResponse & { error?: string }
      if (!res.ok || data.error) throw new Error(data.error ?? "Could not write a draft.")
      setDraft(data)
      setSubject(data.subject)
      setMessageBody(data.body)
      setEditing(false)
      setRecord(null)
    } catch (e) {
      setDraftError(e instanceof Error ? e.message : "Could not write a draft.")
    } finally {
      setDrafting(false)
    }
  }

  function buildInput(status: "draft" | "approved", finalFormat?: CommunicationFormat | null): SaveCommunicationInput {
    return {
      id: record?.id ?? null,
      commitmentId,
      commitmentType,
      commitmentText,
      communicationType: type ?? "communicate",
      sourceContext,
      workItemId,
      planId,
      audience,
      audienceOther: audienceOther || null,
      timing: effectiveTiming || null,
      subjectText: subjectText || null,
      messageIntent: messageIntent || null,
      desiredOutcome: desiredOutcome || null,
      tone,
      details,
      sourceSubject: draft?.subject ?? null,
      sourceBody: draft?.body ?? null,
      approvedSubject: subject,
      approvedBody: messageBody,
      finalFormat: finalFormat ?? record?.finalFormat ?? null,
      status,
    }
  }

  async function approveAndSave() {
    setSaving(true)
    setSaveError(null)
    const res = await saveCommunication(buildInput("approved"))
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
        await copyText(`${subject}\n\n${messageBody}`)
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
    if (record && record.status === "approved") {
      const res = await saveCommunication(buildInput("approved", format))
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

  function reuse(prev: CommunicationRecord) {
    setType(prev.communicationType)
    setAudience(prev.audience)
    setAudienceOther(prev.audienceOther ?? "")
    setTiming(prev.timing ?? "")
    setSubjectText(prev.subjectText ?? "")
    setMessageIntent(prev.messageIntent ?? "")
    setDesiredOutcome(prev.desiredOutcome ?? "")
    setTone(prev.tone)
    setOwner(prev.details?.delegation?.owner ?? "")
    setDoneLooksLike(prev.details?.delegation?.doneLooksLike ?? "")
    setAuthority(prev.details?.delegation?.authority ?? "")
    setAppliesTo(prev.details?.rule?.appliesTo ?? "")
    setWhenTriggered(prev.details?.rule?.whenTriggered ?? "")
    setDraft(prev.sourceSubject && prev.sourceBody ? { subject: prev.sourceSubject, body: prev.sourceBody } : null)
    setSubject(prev.approvedSubject ?? prev.sourceSubject ?? "")
    setMessageBody(prev.approvedBody ?? prev.sourceBody ?? "")
    setRecord(null)
    setEditing(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl border border-[#E8DFE2] bg-[#FDFBFA] p-0">
        <div className="px-7 pt-7 pb-6 space-y-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#5A7A45]">
              Communicate + Delegate™
            </DialogTitle>
            <DialogDescription className="font-serif text-2xl font-semibold leading-snug text-[#2E1F27] text-balance">
              Handle it right here — without leaving the work you&apos;re doing.
            </DialogDescription>
          </DialogHeader>

          {/* CONTEXT — what she's working on / the commitment this executes */}
          {commitmentText.trim() && (
            <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 space-y-1.5">
              <Label>{footerLabel}</Label>
              <p className="font-sans text-base text-[#2E1F27] leading-relaxed">{commitmentText}</p>
            </div>
          )}

          {/* WHAT DO YOU NEED TO DO? */}
          <div className="space-y-3">
            <Label>What do you need to do?</Label>
            <div className="flex flex-wrap gap-2">
              {COMMUNICATION_TYPES.map((t) => (
                <Chip
                  key={t}
                  selected={type === t}
                  onClick={() => {
                    setType(t)
                    setRecord(null)
                    setDraft(null)
                  }}
                >
                  {COMMUNICATION_TYPE_LABEL[t]}
                </Chip>
              ))}
            </div>
          </div>

          {type && (
            <>
              {/* THE TOPIC */}
              <div className="space-y-2">
                <Label>{TOPIC_LABEL[type]}</Label>
                <Field value={subjectText} onChange={setSubjectText} label={TOPIC_LABEL[type]} placeholder="In your own words…" />
              </div>

              {/* DELEGATION EXTRAS */}
              {type === "delegate" && (
                <div className="space-y-3 rounded-2xl border border-[#E8DFE2] bg-white/60 px-5 py-4">
                  <Label>The hand-off</Label>
                  <Field value={owner} onChange={setOwner} label="Who will own it" placeholder="Who will own it?" />
                  <Field value={doneLooksLike} onChange={setDoneLooksLike} label="What done looks like" placeholder="What does done look like?" />
                  <Field value={authority} onChange={setAuthority} label="Authority they have" placeholder="Optional — what authority should they have?" />
                </div>
              )}

              {/* OPERATING RULE EXTRAS */}
              {type === "operating-rule" && (
                <div className="space-y-3 rounded-2xl border border-[#E8DFE2] bg-white/60 px-5 py-4">
                  <Label>The rule</Label>
                  <Field value={appliesTo} onChange={setAppliesTo} label="Who it applies to" placeholder="Who does it apply to?" />
                  <Field value={whenTriggered} onChange={setWhenTriggered} label="What happens when triggered" placeholder="What should happen when the rule is triggered?" />
                </div>
              )}

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
                  <Field value={audienceOther} onChange={setAudienceOther} label="Other audience" placeholder="Who else? (e.g. my assistant, my bookkeeper)" />
                )}
              </div>

              {/* WHEN */}
              <div className="space-y-3">
                <Label>When does this apply?</Label>
                <div className="flex flex-wrap gap-2">
                  {TIMING_OPTIONS.map((t) => (
                    <Chip key={t} selected={timing === t} onClick={() => setTiming(timing === t ? "" : t)}>
                      {t}
                    </Chip>
                  ))}
                  <Chip selected={timing === "__other"} onClick={() => setTiming(timing === "__other" ? "" : "__other")}>
                    Specific date / Other
                  </Chip>
                </div>
                {timing === "__other" && (
                  <Field value={timingOther} onChange={setTimingOther} label="Other timing" placeholder="e.g. Tuesdays and Thursdays, 9–11 AM" />
                )}
              </div>

              {/* WHAT THEY SHOULD KNOW */}
              <div className="space-y-2">
                <Label>{INTENT_LABEL[type]}</Label>
                <Field value={messageIntent} onChange={setMessageIntent} label={INTENT_LABEL[type]} placeholder="A short explanation." />
              </div>

              {/* WHAT DO YOU WANT TO HAPPEN */}
              <div className="space-y-2">
                <Label>What do you want to happen?</Label>
                <Field value={desiredOutcome} onChange={setDesiredOutcome} label="What do you want to happen" placeholder="Optional — the outcome you're after." />
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
            </>
          )}

          {(draft || messageBody) && (
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
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
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
                          setMessageBody(draft.body)
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
                  <p className="font-serif text-lg leading-relaxed text-[#2E1F27] whitespace-pre-wrap">{messageBody}</p>
                </div>
              )}

              {!approved && !editing && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={approveAndSave}
                    disabled={saving || !subject.trim() || !messageBody.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" aria-hidden /> {saving ? "Saving…" : "Approve & Save"}
                  </button>
                  {saveError && <p className="font-sans text-xs text-[#C0545A]">{saveError}</p>}
                </div>
              )}

              {approved && (
                <div className="space-y-3 pt-1">
                  <Label>Use this message</Label>
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

          {/* EDIT & REUSE — other communications from this same context */}
          {previous.filter((p) => p.id !== record?.id).length > 0 && (
            <div className="space-y-2">
              <Label>Already written here</Label>
              <ul className="space-y-2">
                {previous
                  .filter((p) => p.id !== record?.id)
                  .map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E8DFE2] bg-white px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-semibold text-[#2E1F27]">
                          {p.approvedSubject ?? p.sourceSubject ?? "Untitled"}
                        </p>
                        <p className="font-sans text-xs text-[#6B5860]">
                          {COMMUNICATION_TYPE_LABEL[p.communicationType]} · To {p.audience.map((a) => AUDIENCE_LABEL[a]).join(", ")} ·{" "}
                          {p.status === "used" ? "Used" : p.status === "approved" ? "Approved" : "Draft"}
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
