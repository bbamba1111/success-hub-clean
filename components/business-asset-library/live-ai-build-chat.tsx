"use client"

/**
 * LiveAiBuildChat — Business Asset Library™ (Phase 12.2 → Phase 12.3)
 * ---------------------------------------------------------------------------
 * A REAL, live AI conversation for building a Business Asset™ — enabled for
 * a small allowlist of assets (see lib/business-asset-library/live-build.ts)
 * to prove the full chain end to end: Founder → Business Stage™ → Business
 * Asset™ → owning Executive™ → live AI conversation → structured fields →
 * save. Every other asset keeps the fully static GuidedBuildFlow untouched.
 *
 * Phase 12.3 adds the structured Template™ panel: the founder's guided
 * steps (the SAME `asset.instructions[style]` content GuidedBuildFlow uses)
 * render as real, directly-editable fields — the PRIMARY workspace — with
 * the live chat alongside as the BUILDING METHOD. The AI can fill or refine
 * a field by wrapping its text in [FIELD:n]...[/FIELD] (n = field index);
 * the founder can just as easily type into a field directly. Either way,
 * "Compile & Save" turns the current fields into the one structured output,
 * without requiring the model to ever produce a [FINAL_DRAFT_START] block.
 *
 * Talks to app/api/business-asset-build/route.ts (its own endpoint — Cherry
 * Blossom's engine is never touched) and persists the transcript + final
 * draft via utils/business-asset-build-storage.ts.
 */

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, CheckCircle2, Loader2, Send, Sparkles } from "lucide-react"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { BuildModeDefinition } from "@/lib/business-asset-library/build-modes"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import { getBusinessStage } from "@/lib/business-stage/business-stage-store"
import {
  createBusinessAssetBuildInDb,
  getBusinessAssetBuildFromDb,
  updateBusinessAssetBuildInDb,
  type BusinessAssetBuildMessage,
} from "@/utils/business-asset-build-storage"

/** Joins the founder's current field values into the one structured, saved output — the same shape GuidedBuildFlow's Do It Myself save uses. */
function compileFields(steps: string[], values: string[]): string {
  return steps
    .map((step, i) => (values[i]?.trim() ? `${step}\n${values[i]!.trim()}` : null))
    .filter(Boolean)
    .join("\n\n")
}

export function LiveAiBuildChat({
  asset,
  mode,
  style,
  executiveName,
  onExit,
  onAssetSaved,
}: {
  asset: BusinessAsset
  mode: BuildModeDefinition
  style: CommunicationStyle
  executiveName: string
  onExit: () => void
  /** Fired once a final draft has been saved, so the parent can refresh the ownership card. */
  onAssetSaved?: () => void
}) {
  const [messages, setMessages] = useState<BusinessAssetBuildMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [buildId, setBuildId] = useState<string | null>(null)
  const [finalDraft, setFinalDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // The structured Template™ panel — the same guided-step content
  // GuidedBuildFlow uses, now rendered as real, directly-editable fields
  // that sit alongside the chat instead of hiding inside it.
  const guidedSteps = asset.instructions[style] ?? asset.instructions.business_owner
  const [fieldValues, setFieldValues] = useState<string[]>(() => guidedSteps.map(() => ""))
  const [isSaving, setIsSaving] = useState(false)
  // True once this build has been completed at least once — reopening a
  // finished build via "Edit / Revise" starts this as `true` so the next
  // save bumps `version` instead of quietly overwriting the original.
  const [wasAlreadyCompleted, setWasAlreadyCompleted] = useState(false)
  const hasAnyFieldValue = fieldValues.some((v) => v.trim())

  const isAutonomous = mode.id === "let-ai-do-it"
  const isGuidedDiy = mode.id === "guided-diy"
  const isAi = mode.stepFraming === "ai-drafts" || isAutonomous
  const modeLabel = isAutonomous ? "Let AI Do It" : isAi ? "Build With AI" : "Do It Myself, guided"

  async function saveCompiledFields(nextFieldValues: string[]) {
    const compiled = compileFields(guidedSteps, nextFieldValues)
    if (!compiled.trim()) return
    setIsSaving(true)
    try {
      if (buildId) {
        await updateBusinessAssetBuildInDb(buildId, messages, compiled, nextFieldValues, wasAlreadyCompleted)
      } else {
        const newId = await createBusinessAssetBuildInDb(asset.id, mode.id, getBusinessStage())
        if (newId) {
          setBuildId(newId)
          await updateBusinessAssetBuildInDb(newId, messages, compiled, nextFieldValues, false)
        }
      }
      setFinalDraft(compiled)
      setWasAlreadyCompleted(true)
      onAssetSaved?.()
    } finally {
      setIsSaving(false)
    }
  }

  // Resume ANY existing session for this asset + mode — in-progress OR
  // already completed (reopened via "Edit / Revise") — so revisiting a
  // finished build edits that same row instead of quietly starting a
  // parallel one. Falls back to a fresh row only when nothing exists yet.
  useEffect(() => {
    let active = true
    function opener(): BusinessAssetBuildMessage {
      return {
        role: "assistant",
        content: isAutonomous
          ? `Hi, I'm ${executiveName}. Tell me anything important about your business, and I'll go ahead and draft a complete ${asset.name} for you — making reasonable assumptions where I need to. You'll be able to edit anything that's off. Ready?`
          : isAi
            ? `Hi, I'm ${executiveName}. Let's build your ${asset.name} together — I'll ask a few questions and draft the language as we go. Ready to start?`
            : `Hi, I'm ${executiveName}. I'll coach you through building your ${asset.name} step by step — you do the writing, I'll guide you. Ready to start?`,
      }
    }
    async function boot() {
      const existing = await getBusinessAssetBuildFromDb(asset.id, mode.id)
      if (!active) return
      if (existing) {
        setBuildId(existing.id)
        setWasAlreadyCompleted(existing.status === "completed")
        if (existing.fieldValues.length > 0) {
          setFieldValues(guidedSteps.map((_, i) => existing.fieldValues[i] ?? ""))
        }
        setMessages(existing.messages.length > 0 ? existing.messages : [opener()])
      } else {
        const newId = await createBusinessAssetBuildInDb(asset.id, mode.id, getBusinessStage())
        if (!active) return
        setBuildId(newId)
        setMessages([opener()])
      }
      setIsBooting(false)
    }
    boot()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.id, mode.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isLoading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    const nextMessages: BusinessAssetBuildMessage[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/business-asset-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          buildMode: mode.id,
          message: text,
          messages,
          communicationStyle: style,
          fieldValues,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setIsLoading(false)
        return
      }

      const updated: BusinessAssetBuildMessage[] = [
        ...nextMessages,
        { role: "assistant", content: data.message },
      ]
      setMessages(updated)

      // Merge any [FIELD:n] updates the AI wrote this turn into the live
      // Template™ panel — the founder sees their fields fill in in real time.
      let mergedFieldValues = fieldValues
      const updates: { index: number; value: string }[] = Array.isArray(data.fieldUpdates) ? data.fieldUpdates : []
      if (updates.length > 0) {
        mergedFieldValues = [...fieldValues]
        for (const { index, value } of updates) {
          if (index >= 0 && index < mergedFieldValues.length) {
            mergedFieldValues[index] = value
          }
        }
        setFieldValues(mergedFieldValues)
      }

      if (data.finalDraft) {
        setFinalDraft(data.finalDraft)
      }

      if (buildId) {
        await updateBusinessAssetBuildInDb(buildId, updated, data.finalDraft ?? undefined, mergedFieldValues, wasAlreadyCompleted)
        if (data.finalDraft) {
          setWasAlreadyCompleted(true)
          onAssetSaved?.()
        }
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function onFieldChange(index: number, value: string) {
    setFieldValues((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage()
  }

  if (finalDraft) {
    return (
      <div className="harmony-panel p-6 text-center sm:p-8">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
          <CheckCircle2 className="h-7 w-7 text-brand-green" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-brand-ink">
          Your {asset.name} is ready
        </h3>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-brand-ink-soft">
          {executiveName} drafted this with you, live. It has been saved — you can come back and refine it anytime.
        </p>
        <div className="mt-5 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-5 text-left">
          <p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed text-brand-ink">{finalDraft}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFinalDraft(null)
            }}
            className="ds-btn-secondary"
          >
            Keep Refining
          </button>
          <button type="button" onClick={onExit} className="ds-btn-primary">
            Back to {asset.name}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
      {/* Template™ panel — the PRIMARY workspace: the actual Business Asset™ taking shape. */}
      <div className="harmony-panel p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ds-eyebrow">{asset.name} — Template</p>
            <p className="mt-1 text-xs text-brand-ink-soft">
              {isGuidedDiy
                ? "Write your own answers below. Chat with " + executiveName + " for coaching along the way."
                : `Watch this fill in as you talk with ${executiveName} — or type directly into any field yourself.`}
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-brand-ink-soft">
            {fieldValues.filter((v) => v.trim()).length}/{guidedSteps.length}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {guidedSteps.map((step, i) => (
            <div key={i}>
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-brand-green">
                Builder Step {i + 1}
              </p>
              <label htmlFor={`field-${i}`} className="mt-0.5 block text-xs font-semibold leading-snug text-brand-ink">
                {step}
              </label>
              <textarea
                id={`field-${i}`}
                value={fieldValues[i] ?? ""}
                onChange={(e) => onFieldChange(i, e.target.value)}
                rows={3}
                placeholder={isGuidedDiy ? "Write your answer here..." : "Fills in as you chat, or type your own..."}
                className="mt-1.5 w-full rounded-lg border border-black/[0.08] bg-card p-3 text-sm text-brand-ink outline-none ds-transition focus:border-brand-green"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => saveCompiledFields(fieldValues)}
          disabled={!hasAnyFieldValue || isSaving}
          className="ds-btn-primary mt-5 w-full disabled:opacity-40"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CheckCircle2 className="h-4 w-4" aria-hidden />}
          Compile &amp; Save
        </button>
      </div>

      {/* Chat — the BUILDING METHOD. */}
      <div className="harmony-panel flex h-[560px] flex-col overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
              <Sparkles className="h-4 w-4 text-brand-green" aria-hidden />
            </span>
            <div>
              <p className="ds-eyebrow">{executiveName} — Live</p>
              <p className="text-xs text-brand-ink-soft">
                {modeLabel} · {asset.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-ink-soft ds-transition hover:text-brand-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Exit
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {isBooting ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-green" aria-hidden />
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-green text-white"
                      : "border border-black/[0.06] bg-brand-cream/60 text-brand-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl border border-black/[0.06] bg-brand-cream/60 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-brand-green" aria-hidden />
              </div>
            </div>
          )}
          {error && (
            <p className="text-center text-xs font-medium text-destructive">{error}</p>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-black/[0.06] px-5 py-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${executiveName}...`}
            disabled={isBooting || isLoading}
            className="flex-1 rounded-lg border border-black/[0.08] bg-card px-3 py-2 text-sm text-brand-ink outline-none ds-transition focus:border-brand-green disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isBooting || isLoading || !input.trim()}
            className="ds-btn-primary shrink-0 disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          </button>
        </form>
      </div>
    </div>
  )
}
