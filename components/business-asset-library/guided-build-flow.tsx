"use client"

/**
 * GuidedBuildFlow — Business Asset Library™ (Phase 12.1)
 * ---------------------------------------------------------------------------
 * The shared step-through experience for BOTH digital build modes. The
 * IMPORTANT distinction lives entirely in framing/copy, never in structure:
 *
 *   Build With AI ("ai-drafts")            → "Let's build this together."
 *   Do It Myself ("founder-does-with-coaching") → "You do the work. I'll coach you through it."
 *
 * "Do It Myself" is never a blank worksheet — the owning AI Executive is
 * still presented as the founder's guide on every step, with an "I'm Stuck"
 * affordance that surfaces the worked example.
 *
 * No live LLM calls happen this phase (mirrors the architecture-only status
 * of the real 9-executive roster). The founder's own notes are kept in local
 * component state only — nothing is persisted or sent anywhere.
 */

import { useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, PartyPopper, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { BuildModeDefinition } from "@/lib/business-asset-library/build-modes"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"

export function GuidedBuildFlow({
  asset,
  mode,
  style,
  executiveName,
  onExit,
}: {
  asset: BusinessAsset
  mode: BuildModeDefinition
  style: CommunicationStyle
  executiveName: string
  onExit: () => void
}) {
  const steps = asset.instructions[style]
  const example = asset.examples[style]
  const [stepIndex, setStepIndex] = useState(0)
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [showStuck, setShowStuck] = useState(false)
  const [complete, setComplete] = useState(false)

  const isAi = mode.stepFraming === "ai-drafts" || mode.stepFraming === "ai-autonomous"
  const total = steps.length
  const progressPct = complete ? 100 : Math.round((stepIndex / total) * 100)

  function goNext() {
    setShowStuck(false)
    if (stepIndex >= total - 1) {
      setComplete(true)
      return
    }
    setStepIndex((i) => i + 1)
  }

  function goPrev() {
    setShowStuck(false)
    setStepIndex((i) => Math.max(0, i - 1))
  }

  if (complete) {
    return (
      <div className="harmony-panel p-6 text-center sm:p-8">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
          <PartyPopper className="h-7 w-7 text-brand-green" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-brand-ink">
          You&apos;ve worked through {asset.name}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-brand-ink-soft">
          {isAi
            ? `${executiveName} helped you draft every step. Revisit any step anytime to refine your answers.`
            : `${executiveName} guided you through this from start to finish — the work is yours.`}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setComplete(false)
              setStepIndex(0)
            }}
            className="ds-btn-secondary"
          >
            Revisit Steps
          </button>
          <button type="button" onClick={onExit} className="ds-btn-primary">
            Back to {asset.name}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="harmony-panel p-6 sm:p-8">
      {/* Executive framing */}
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <Sparkles className="h-5 w-5 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">{executiveName}</p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-brand-ink">
            {isAi
              ? "I'll help you build this. Let's work through it together, one step at a time."
              : "You'll do the work yourself — I'll explain each step and check in as you go."}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
          <span>
            Step {stepIndex + 1} of {total}
          </span>
          <span>{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="mt-2 h-2" />
      </div>

      {/* Current step */}
      <div className="mt-6 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-5">
        <p className="font-display text-base font-semibold leading-snug text-brand-ink">{steps[stepIndex]}</p>

        <label htmlFor="step-notes" className="mt-4 block text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
          {isAi ? "Tell me what you know — I'll help shape it" : "Write your answer here"}
        </label>
        <textarea
          id="step-notes"
          value={notes[stepIndex] ?? ""}
          onChange={(e) => setNotes((n) => ({ ...n, [stepIndex]: e.target.value }))}
          rows={4}
          className="mt-2 w-full rounded-lg border border-black/[0.08] bg-card p-3 text-sm text-brand-ink outline-none ds-transition focus:border-brand-green"
          placeholder="Start typing..."
        />

        <button
          type="button"
          onClick={() => setShowStuck((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-coral hover:underline"
        >
          <HelpCircle className="h-3.5 w-3.5" aria-hidden />
          {showStuck ? "Hide example" : "I'm Stuck — Help Me"}
        </button>

        {showStuck && (
          <div className="mt-3 rounded-lg border border-brand-coral/20 bg-brand-coral/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-coral">Example</p>
            <p className="mt-1.5 text-pretty text-sm italic leading-relaxed text-brand-ink">{example}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="ds-btn-ghost disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
        <button type="button" onClick={goNext} className="ds-btn-primary">
          {stepIndex >= total - 1 ? "Finish" : "Next Step"}
          {stepIndex >= total - 1 ? (
            <CheckCircle2 className="h-4 w-4" aria-hidden />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}
