"use client"

/**
 * Write / Research with AI Studio™
 * ---------------------------------------------------------------------------
 * Launched from the business function builder inside a CEO Workday™ hour. The
 * founder picks (or describes) what they need to create; the assigned AI
 * Executive™ supplies a template from the Business Template Library™ —
 * generating and code-stamping a new one when the library doesn't have it —
 * and then writes or researches the piece with the founder, Step by Step,
 * with each Step filling in live and a polished final draft at the end.
 *
 * Flow:
 *   1. choose   — pick a built-in format or describe a custom one (+ context).
 *   2. confirm  — assigned executive + Template Code™ + Steps preview. The
 *                 build Steps only open AFTER the founder okays this step.
 *   3. build    — editable Steps + live chat; Steps fill in as the AI works.
 *   4. done     — polished draft (bold, italic, bullets, spacing) + Copy.
 *
 * Everything is saved to lib/thought-leadership/template-store.ts as it
 * changes, so returning to a piece restores exactly where the founder was.
 */

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, CheckCircle2, Copy, Loader2, Send, Sparkles, Wand2, X } from "lucide-react"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import {
  THOUGHT_LEADERSHIP_FORMATS,
  matchBuiltInFormat,
  type ThoughtLeadershipFormat,
  type ThoughtLeadershipMode,
} from "@/lib/thought-leadership/format-registry"
import {
  clearDraft,
  getDraft,
  mintTemplateCode,
  saveDraft,
  saveStoredTemplate,
  type ThoughtLeadershipMessage,
} from "@/lib/thought-leadership/template-store"
import { PolishedDraft } from "@/components/thought-leadership/polished-draft"

type Phase = "choose" | "confirm" | "build" | "done"

function joinFields(steps: string[], values: string[]): string {
  return steps
    .map((step, i) => (values[i]?.trim() ? `**${step}**\n${values[i]!.trim()}` : null))
    .filter(Boolean)
    .join("\n\n")
}

export function WriteWithAiStudio({
  mode,
  open,
  onClose,
  hourLabel,
}: {
  mode: ThoughtLeadershipMode
  open: boolean
  onClose: () => void
  hourLabel?: string
}) {
  const isResearch = mode === "research-with-ai"
  const verb = isResearch ? "Research" : "Write"

  const [phase, setPhase] = useState<Phase>("choose")
  const [customRequest, setCustomRequest] = useState("")
  const [seed, setSeed] = useState("")
  const [generating, setGenerating] = useState(false)
  const [template, setTemplate] = useState<ThoughtLeadershipFormat | null>(null)

  const [fieldValues, setFieldValues] = useState<string[]>([])
  const [messages, setMessages] = useState<ThoughtLeadershipMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [finalDraft, setFinalDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const exec = template ? getExecutive(template.executiveId) : undefined
  const executiveName = exec?.name ?? "Your Executive Team™"
  const executiveTitle = exec?.executiveTitle ?? ""

  // Reset everything when the studio is closed so the next launch starts fresh.
  useEffect(() => {
    if (!open) {
      setPhase("choose")
      setCustomRequest("")
      setSeed("")
      setTemplate(null)
      setFieldValues([])
      setMessages([])
      setInput("")
      setFinalDraft(null)
      setError(null)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  function persist(next: {
    fieldValues?: string[]
    messages?: ThoughtLeadershipMessage[]
    finalDraft?: string | null
    buildConfirmed?: boolean
  }) {
    if (!template) return
    saveDraft({
      templateCode: template.code,
      fieldValues: next.fieldValues ?? fieldValues,
      messages: next.messages ?? messages,
      finalDraft: next.finalDraft !== undefined ? next.finalDraft : finalDraft,
      buildConfirmed: next.buildConfirmed ?? true,
    })
  }

  function selectBuiltIn(fmt: ThoughtLeadershipFormat) {
    setTemplate(fmt)
    setError(null)
    setPhase("confirm")
  }

  async function generateCustom() {
    const request = customRequest.trim()
    if (!request) return
    // Reuse the library first — never regenerate something we already have.
    const existing = matchBuiltInFormat(request)
    if (existing) {
      setTemplate(existing)
      setPhase("confirm")
      return
    }
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/thought-leadership/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? "Could not create a template. Please try again.")
        return
      }
      const created: ThoughtLeadershipFormat = {
        code: mintTemplateCode(),
        name: data.name,
        category: data.category,
        executiveId: data.executiveId,
        whatIsThis: data.whatIsThis,
        whyItMatters: data.whyItMatters,
        steps: data.steps,
        builtIn: false,
      }
      saveStoredTemplate(created)
      setTemplate(created)
      setPhase("confirm")
    } catch {
      setError("Could not create a template. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  /** The "okay the build step" gate — Steps only open after this. */
  function confirmBuild() {
    if (!template) return
    const saved = getDraft(template.code)
    const seededValues =
      saved && saved.fieldValues.length > 0
        ? template.steps.map((_, i) => saved.fieldValues[i] ?? "")
        : template.steps.map(() => "")
    setFieldValues(seededValues)
    setFinalDraft(saved?.finalDraft ?? null)
    setPhase(saved?.finalDraft ? "done" : "build")

    const opener: ThoughtLeadershipMessage = {
      role: "assistant",
      content: isResearch
        ? `I'm ${executiveName}. I'll research your ${template.name} with you and organize everything into the Steps on the left. Tell me the topic and any angle you have in mind, and I'll get started.`
        : `I'm ${executiveName}. I'll write your ${template.name} with you — each Step will fill in as we go. Give me the key details and I'll draft the first version right away.`,
    }
    const startMessages = saved && saved.messages.length > 0 ? saved.messages : [opener]
    setMessages(startMessages)
    persist({ fieldValues: seededValues, messages: startMessages, buildConfirmed: true })

    // If the founder gave context up front, kick off the draft immediately so
    // the Steps begin filling in the moment they okay the build.
    if (seed.trim() && !(saved && saved.messages.length > 0)) {
      void send(seed.trim(), startMessages, seededValues)
    }
  }

  async function send(text: string, baseMessages?: ThoughtLeadershipMessage[], baseValues?: string[]) {
    if (!template || loading) return
    const history = baseMessages ?? messages
    const values = baseValues ?? fieldValues
    const nextMessages: ThoughtLeadershipMessage[] = [...history, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/thought-leadership/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          formatName: template.name,
          whatIsThis: template.whatIsThis,
          whyItMatters: template.whyItMatters,
          steps: template.steps,
          executiveName,
          executiveTitle,
          message: text,
          messages: history,
          fieldValues: values,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      const updated: ThoughtLeadershipMessage[] = [...nextMessages, { role: "assistant", content: data.message }]
      setMessages(updated)

      let merged = values
      const updates: { index: number; value: string }[] = Array.isArray(data.fieldUpdates) ? data.fieldUpdates : []
      if (updates.length > 0) {
        merged = [...values]
        for (const { index, value } of updates) {
          if (index >= 0 && index < merged.length) merged[index] = value
        }
        setFieldValues(merged)
      }
      const draft = data.finalDraft ?? null
      if (draft) setFinalDraft(draft)
      persist({ messages: updated, fieldValues: merged, finalDraft: draft ?? finalDraft })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function onFieldChange(index: number, value: string) {
    setFieldValues((prev) => {
      const next = [...prev]
      next[index] = value
      persist({ fieldValues: next })
      return next
    })
  }

  function compileFromSteps() {
    if (!template) return
    const compiled = joinFields(template.steps, fieldValues)
    if (!compiled.trim()) return
    setFinalDraft(compiled)
    setPhase("done")
    persist({ finalDraft: compiled })
  }

  async function copyDraft() {
    if (!finalDraft) return
    try {
      await navigator.clipboard.writeText(finalDraft.replace(/\*\*/g, "").replace(/[*_`~>#]/g, ""))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; fail quietly.
    }
  }

  if (!open) return null

  const filledCount = fieldValues.filter((v) => v.trim()).length

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-6 sm:px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-[#7FB069]/30 bg-[#F7FBF2] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#7FB069]/25 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
              {verb} with AI{hourLabel ? ` · ${hourLabel}` : ""}
            </p>
            <p className="mt-1 font-sans text-sm text-[#3A2E33]">
              {phase === "choose"
                ? `Choose what you need to ${verb.toLowerCase()} — the right executive will build it with you.`
                : template
                  ? `${template.name} · ${executiveName}`
                  : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-[#6B5860] transition-colors hover:bg-black/5 hover:text-[#2E1F27]"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {/* ── choose ─────────────────────────────────────────────── */}
          {phase === "choose" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                  From your Business Template Library™
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {THOUGHT_LEADERSHIP_FORMATS.map((fmt) => (
                    <button
                      key={fmt.code}
                      type="button"
                      onClick={() => selectBuiltIn(fmt)}
                      className="rounded-full border border-[#7FB069]/50 bg-white px-4 py-2 font-sans text-sm font-semibold text-[#2E1F27] transition-colors hover:border-[#5F8F47] hover:bg-[#EEF6E6]"
                    >
                      {fmt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#CBB7BE]/50 bg-white px-4 py-4">
                <label className="font-sans text-sm font-semibold text-[#2E1F27]">
                  Need something else? Describe it.
                </label>
                <p className="mt-0.5 font-sans text-xs text-[#6B5860]">
                  If it&apos;s not in the library, the right executive will create a template for it and save it with its
                  own code.
                </p>
                <input
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  placeholder="e.g. A commencement speech, a grant narrative, an award acceptance…"
                  className="mt-3 w-full rounded-xl border border-[#CBB7BE]/60 bg-[#FBF9FA] px-4 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                />
                <label className="mt-4 block font-sans text-sm font-semibold text-[#2E1F27]">
                  What&apos;s it about? <span className="font-normal text-[#6B5860]">(optional — a few details)</span>
                </label>
                <textarea
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  rows={2}
                  placeholder="Topic, audience, key message, deadline…"
                  className="mt-2 w-full resize-y rounded-xl border border-[#CBB7BE]/60 bg-[#FBF9FA] px-4 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                />
                <button
                  type="button"
                  onClick={generateCustom}
                  disabled={!customRequest.trim() || generating}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#5F8F47] px-5 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-[#548039] disabled:opacity-50"
                >
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Wand2 className="h-4 w-4" aria-hidden />}
                  {generating ? "Creating your template…" : "Create My Template"}
                </button>
              </div>
              {error && <p className="font-sans text-xs text-[#C0545A]">{error}</p>}
            </div>
          )}

          {/* ── confirm (okay the build step) ──────────────────────── */}
          {phase === "confirm" && template && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                    Assigned Executive
                  </p>
                  <span className="rounded-full bg-[#EEF6E6] px-3 py-1 font-mono text-[11px] font-semibold text-[#3A6B2E]">
                    {template.code}
                  </span>
                </div>
                <p className="mt-2 font-sans text-base font-bold text-[#2E1F27]">{executiveName}</p>
                {executiveTitle && <p className="font-sans text-xs text-[#6B5860]">{executiveTitle}</p>}
                <p className="mt-3 font-sans text-sm leading-relaxed text-[#3A2E33]">{template.whatIsThis}</p>
                {template.whyItMatters && (
                  <p className="mt-1 font-sans text-xs italic leading-relaxed text-[#6B5860]">{template.whyItMatters}</p>
                )}
                {!template.builtIn && (
                  <p className="mt-2 font-sans text-xs font-semibold text-[#5B835F]">
                    New template created and saved to your library.
                  </p>
                )}
              </div>

              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                  The Steps we&apos;ll build
                </p>
                <ol className="mt-3 space-y-2">
                  {template.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF6E6] font-sans text-[11px] font-bold text-[#3A6B2E]">
                        {i + 1}
                      </span>
                      <span className="font-sans text-sm leading-snug text-[#3A2E33]">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={confirmBuild}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5F8F47] px-6 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-[#548039]"
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Okay, build it
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTemplate(null)
                    setPhase("choose")
                  }}
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#6B5860] transition-colors hover:text-[#2E1F27]"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Choose something else
                </button>
              </div>
            </div>
          )}

          {/* ── build ──────────────────────────────────────────────── */}
          {phase === "build" && template && (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
              {/* Steps workspace */}
              <div className="rounded-2xl border border-[#7FB069]/30 bg-white px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                    {template.name} — Steps
                  </p>
                  <span className="font-sans text-xs font-semibold text-[#6B5860]">
                    {filledCount}/{template.steps.length}
                  </span>
                </div>
                <div className="mt-3 space-y-4">
                  {template.steps.map((step, i) => (
                    <div key={i}>
                      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#5B835F]">
                        Step {i + 1}
                      </p>
                      <label htmlFor={`tl-step-${i}`} className="mt-0.5 block font-sans text-xs font-semibold leading-snug text-[#2E1F27]">
                        {step}
                      </label>
                      <textarea
                        id={`tl-step-${i}`}
                        value={fieldValues[i] ?? ""}
                        onChange={(e) => onFieldChange(i, e.target.value)}
                        rows={3}
                        placeholder="Fills in as you work with your executive, or type your own…"
                        className="mt-1.5 w-full resize-y rounded-lg border border-[#CBB7BE]/60 bg-[#FBF9FA] p-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={compileFromSteps}
                  disabled={filledCount === 0}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5F8F47] px-5 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-[#548039] disabled:opacity-40"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Compile &amp; Polish
                </button>
              </div>

              {/* Chat */}
              <div className="flex h-[460px] flex-col overflow-hidden rounded-2xl border border-[#7FB069]/30 bg-white">
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-sans text-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-[#5F8F47] text-white"
                            : "border border-[#7FB069]/25 bg-[#F3F8ED] text-[#2E1F27]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-[#7FB069]/25 bg-[#F3F8ED] px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-[#5F8F47]" aria-hidden />
                      </div>
                    </div>
                  )}
                  {error && <p className="text-center font-sans text-xs text-[#C0545A]">{error}</p>}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const t = input.trim()
                    if (t) void send(t)
                  }}
                  className="flex items-center gap-2 border-t border-[#7FB069]/20 px-3 py-3"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message ${executiveName}…`}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-[#CBB7BE]/60 bg-[#FBF9FA] px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#5F8F47] px-3.5 py-2 text-white transition-colors hover:bg-[#548039] disabled:opacity-40"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── done ───────────────────────────────────────────────── */}
          {phase === "done" && template && finalDraft && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#5F8F47]" aria-hidden />
                <p className="font-sans text-base font-bold text-[#2E1F27]">Your {template.name} is ready</p>
              </div>
              <div className="rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-5">
                <PolishedDraft text={finalDraft} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyDraft}
                  className="inline-flex items-center gap-2 rounded-full border border-[#7FB069]/50 bg-[#F3F8ED] px-4 py-2 font-sans text-sm font-semibold text-[#3A6B2E] transition-colors hover:bg-[#E7F1DD]"
                >
                  {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                  {copied ? "Copied." : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("build")}
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#6B5860] transition-colors hover:text-[#2E1F27]"
                >
                  Keep refining
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (template) clearDraft(template.code)
                    onClose()
                  }}
                  className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#5F8F47] px-5 py-2 font-sans text-sm font-bold text-white transition-colors hover:bg-[#548039]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
