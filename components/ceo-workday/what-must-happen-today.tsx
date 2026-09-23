"use client"

/**
 * WHAT MUST HAPPEN TODAY™ — the founder's own four-hour work plan for the
 * protected CEO Workday™.
 *
 * Each hour is a collapsible container (reusing CollapsibleSubSection). Inside
 * an hour the founder sees, top to bottom:
 *   My Work Affirmation™ (auto-created from the hour's work, shown at the top)
 *   → the executable CEO assignments designed for that hour (editable /
 *     deferrable / delegable / removable) → the What Must Happen Today Business
 *     Function Builder™ that creates a new executable CEO assignment right in
 *     the hour → Write / Research with AI.
 *
 * Adding or adjusting a piece of work in an hour automatically (re)creates that
 * hour's Work Affirmation™. Each hour maps to its existing 5-Minute Check-In™,
 * which reads the same statement from the shared hourly-work store.
 */

import { useState, type ReactNode } from "react"
import { Check, Copy, PenLine, Plus, Search, Sparkles } from "lucide-react"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { HOUR_BLOCKS, type HourBlockIndex } from "@/lib/ceo-workday/hour-blocks"
import { useHourlyWork } from "@/lib/ceo-workday/use-hourly-work"
import { CEO_FUNCTION_LABEL, type CeoBusinessFunction, type CeoPlanItem } from "@/lib/ceo-workday/plan-types"
import { WriteWithAiStudio } from "@/components/thought-leadership/write-with-ai-studio"
import type { ThoughtLeadershipMode } from "@/lib/thought-leadership/format-registry"

type PerHour<T> = Record<HourBlockIndex, T>

/** The executable-assignment input the Business Function Builder™ produces. */
export type HourWorkInput = {
  businessFunction: CeoBusinessFunction
  work: string
  outcome: string
  minutes: number
}

const FUNCTION_ORDER: CeoBusinessFunction[] = [
  "build",
  "decide",
  "own",
  "delegate",
  "systemize",
  "augment-automate-ai",
  "connect",
  "communicate",
  "sell",
  "market",
  "deliver",
  "solve",
]

function emptyBools(): PerHour<boolean> {
  return { 1: false, 2: false, 3: false, 4: false }
}

type BuilderState = {
  fn: CeoBusinessFunction | null
  work: string
  outcome: string
  minutes: number
}

function emptyBuilder(): BuilderState {
  return { fn: null, work: "", outcome: "", minutes: 30 }
}

export function WhatMustHappenToday({
  itemsByHour,
  renderItem,
  plannedMinutes,
  onAddWork,
}: {
  /** Designed CEO work grouped into each protected hour. */
  itemsByHour?: Partial<Record<HourBlockIndex, CeoPlanItem[]>>
  /** Renders a single work piece with its execution controls (owned by the live plan). */
  renderItem?: (item: CeoPlanItem) => ReactNode
  plannedMinutes?: number
  /** Creates a new executable CEO assignment inside a specific hour. Returns success. */
  onAddWork?: (hour: HourBlockIndex, input: HourWorkInput) => Promise<boolean>
} = {}) {
  const { hours, setWork, setAffirmation } = useHourlyWork()

  const [busy, setBusy] = useState<PerHour<boolean>>(emptyBools)
  const [errors, setErrors] = useState<PerHour<string | null>>({ 1: null, 2: null, 3: null, 4: null })
  const [copied, setCopied] = useState<HourBlockIndex | null>(null)
  // The Business Function Builder™ is open for at most one hour at a time.
  const [builderHour, setBuilderHour] = useState<HourBlockIndex | null>(null)
  const [builder, setBuilder] = useState<BuilderState>(emptyBuilder)
  // The Write / Research with AI Studio™, launched from a specific hour's builder.
  const [studio, setStudio] = useState<{ mode: ThoughtLeadershipMode; hour: HourBlockIndex } | null>(null)

  /** Turn a piece of work into that hour's Work Affirmation™ and persist it. */
  async function generateAffirmation(index: HourBlockIndex, workText: string) {
    const work = workText.trim()
    if (!work) return
    setBusy((b) => ({ ...b, [index]: true }))
    setWork(index, work)
    try {
      const res = await fetch("/api/ceo-workday/work-affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work }),
      })
      const data = (await res.json()) as { affirmation?: string; error?: string }
      if (res.ok && data.affirmation) setAffirmation(index, data.affirmation)
    } catch {
      // Fail quietly — the assignment is still saved; the affirmation can be recreated.
    } finally {
      setBusy((b) => ({ ...b, [index]: false }))
    }
  }

  function openBuilder(index: HourBlockIndex) {
    setBuilderHour(index)
    setBuilder({ ...emptyBuilder(), fn: "build" })
    setErrors((e) => ({ ...e, [index]: null }))
  }

  function closeBuilder() {
    setBuilderHour(null)
    setBuilder(emptyBuilder())
  }

  async function submitBuilder(index: HourBlockIndex) {
    if (!onAddWork) return
    if (!builder.fn || !builder.work.trim() || !builder.outcome.trim()) {
      setErrors((e) => ({ ...e, [index]: "Choose a function, then say what must happen and its outcome." }))
      return
    }
    setErrors((e) => ({ ...e, [index]: null }))
    setBusy((b) => ({ ...b, [index]: true }))
    const ok = await onAddWork(index, {
      businessFunction: builder.fn,
      work: builder.work.trim(),
      outcome: builder.outcome.trim(),
      minutes: Math.max(5, builder.minutes),
    })
    if (ok) {
      const workText = builder.work.trim()
      closeBuilder()
      await generateAffirmation(index, workText)
    } else {
      setErrors((e) => ({ ...e, [index]: "That work could not be saved. Please try again." }))
      setBusy((b) => ({ ...b, [index]: false }))
    }
  }

  async function copyAffirmation(index: HourBlockIndex) {
    const text = hours[index].affirmation
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied((c) => (c === index ? null : c)), 2000)
    } catch {
      // Clipboard can be blocked; fail quietly rather than interrupting the founder.
    }
  }

  return (
    <section className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] px-6 py-6 shadow-sm sm:px-8 sm:py-7">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            What Must Happen Today™
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#3A2E33]">
            Each protected hour holds the executable CEO work you designed. Open an hour to edit, defer, delegate or
            remove that work — or use the Business Function Builder™ to add a new piece of work right here. The work you
            choose automatically writes the hour&apos;s Work Affirmation™ at the top, ready to copy into the live session
            chat.
          </p>
        </div>
        {typeof plannedMinutes === "number" && (
          <span className="shrink-0 rounded-full bg-white px-3 py-1 font-sans text-xs font-semibold text-[#5B835F]">
            {plannedMinutes} / 240 min planned
          </span>
        )}
      </header>

      <div className="flex flex-col gap-3">
        {HOUR_BLOCKS.map((block) => {
          const index = block.index
          const entry = hours[index]
          const affirmation = entry.affirmation
          const hourItems = itemsByHour?.[index] ?? []
          const builderOpen = builderHour === index
          return (
            <CollapsibleSubSection key={index} title={`Hour ${index} · ${block.label}`}>
              <div className="flex flex-col gap-4">
                {/* My Work Affirmation™ — always at the top of the hour block. */}
                {affirmation && (
                  <div className="rounded-2xl border border-[#7FB069]/40 bg-white px-5 py-4">
                    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      My Work Affirmation™
                    </p>
                    <p className="mt-2 font-serif text-base italic leading-relaxed text-[#2E1F27] text-pretty">
                      {affirmation}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyAffirmation(index)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/50 bg-[#F3F8ED] px-3.5 py-1.5 font-sans text-xs font-semibold text-[#3A6B2E] transition-colors hover:bg-[#E7F1DD]"
                      >
                        {copied === index ? (
                          <>
                            <Check className="h-3.5 w-3.5" aria-hidden /> Copied.
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden /> Copy
                          </>
                        )}
                      </button>
                      <span className="font-sans text-xs text-[#6B5860]">Paste it into the live session chat.</span>
                    </div>
                  </div>
                )}

                {/* The executable CEO assignments designed for this hour. */}
                {renderItem && hourItems.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      Your CEO work this hour
                    </p>
                    <ol className="space-y-2">
                      {hourItems.map((item) => (
                        <li key={item.id}>{renderItem(item)}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* What Must Happen Today Business Function Builder™ — creates an
                    executable CEO assignment inside this hour. */}
                {onAddWork && (
                  <div className="rounded-2xl border border-dashed border-[#7FB069]/45 bg-white/70 px-4 py-4">
                    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      What must happen this hour?
                    </p>
                    {!builderOpen ? (
                      <>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-[#6B5860]">
                          Add or adjust a piece of work for this hour. Choosing it creates an executable CEO assignment
                          and writes this hour&apos;s Work Affirmation™.
                        </p>
                        <button
                          type="button"
                          onClick={() => openBuilder(index)}
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#5F8F47] px-4 py-2 font-sans text-xs font-bold text-white transition-colors hover:bg-[#548039]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden />
                          Add a piece of work
                        </button>
                      </>
                    ) : (
                      <div className="mt-3 flex flex-col gap-3">
                        <div>
                          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70">
                            Business Function
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {FUNCTION_ORDER.map((fn) => (
                              <button
                                key={fn}
                                type="button"
                                aria-pressed={builder.fn === fn}
                                onClick={() => setBuilder((b) => ({ ...b, fn }))}
                                className={`rounded-full border px-2.5 py-1 font-montserrat text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  builder.fn === fn
                                    ? "border-[#3A2E33] bg-[#3A2E33] text-white"
                                    : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                                }`}
                              >
                                {CEO_FUNCTION_LABEL[fn]}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor={`wmht-work-${index}`}
                            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70"
                          >
                            What needs to happen?
                          </label>
                          <textarea
                            id={`wmht-work-${index}`}
                            value={builder.work}
                            onChange={(e) => setBuilder((b) => ({ ...b, work: e.target.value }))}
                            rows={2}
                            placeholder="e.g. Finish and send the client proposal."
                            className="mt-1 w-full resize-y rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm leading-relaxed text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`wmht-outcome-${index}`}
                            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70"
                          >
                            Expected outcome
                          </label>
                          <textarea
                            id={`wmht-outcome-${index}`}
                            value={builder.outcome}
                            onChange={(e) => setBuilder((b) => ({ ...b, outcome: e.target.value }))}
                            rows={2}
                            placeholder="e.g. The proposal is in the client's inbox awaiting a decision."
                            className="mt-1 w-full resize-y rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm leading-relaxed text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="font-sans text-xs text-[#6B5860]" htmlFor={`wmht-min-${index}`}>
                              Estimated time
                            </label>
                            <input
                              id={`wmht-min-${index}`}
                              type="number"
                              min={5}
                              max={240}
                              value={builder.minutes}
                              onChange={(e) =>
                                setBuilder((b) => ({ ...b, minutes: Math.max(5, Number(e.target.value) || 0) }))
                              }
                              className="w-20 rounded-lg border border-[#E8DFE2] bg-white px-2 py-1.5 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                            />
                            <span className="font-sans text-xs text-[#6B5860]">min</span>
                          </div>
                          <div className="ml-auto flex items-center gap-3">
                            <button
                              type="button"
                              onClick={closeBuilder}
                              className="font-sans text-sm text-[#6B5860] hover:text-[#2E1F27]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => submitBuilder(index)}
                              disabled={busy[index]}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#5F8F47] px-4 py-2 font-sans text-sm font-bold text-white transition-colors hover:bg-[#548039] disabled:opacity-50"
                            >
                              <Sparkles className="h-4 w-4" aria-hidden />
                              {busy[index] ? "Creating…" : "Add work + create affirmation"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {errors[index] && <p className="mt-2 font-sans text-xs text-[#C0545A]">{errors[index]}</p>}
                  </div>
                )}

                {/* Write / Research with AI — for keynotes, press releases, Op-Eds, PSAs, etc. */}
                <div className="rounded-2xl border border-dashed border-[#7FB069]/45 bg-white/70 px-4 py-3">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                    Write or research with AI
                  </p>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-[#6B5860]">
                    Need to write or research something this hour — a keynote, press release, Op-Ed, PSA, or any thought
                    leadership piece? The right AI executive will build it with you from a template.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setStudio({ mode: "write-with-ai", hour: index })}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#5F8F47] px-4 py-2 font-sans text-xs font-bold text-white transition-colors hover:bg-[#548039]"
                    >
                      <PenLine className="h-3.5 w-3.5" aria-hidden />
                      Write with AI
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudio({ mode: "research-with-ai", hour: index })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/50 bg-[#F3F8ED] px-4 py-2 font-sans text-xs font-bold text-[#3A6B2E] transition-colors hover:bg-[#E7F1DD]"
                    >
                      <Search className="h-3.5 w-3.5" aria-hidden />
                      Research with AI
                    </button>
                  </div>
                </div>
              </div>
            </CollapsibleSubSection>
          )
        })}
      </div>

      <p className="mt-4 font-sans text-xs italic leading-relaxed text-[#6B5860]">
        Each hour connects to its own 5-Minute Check-In™ below, where you&apos;ll capture what actually happened.
      </p>

      {studio && (
        <WriteWithAiStudio
          mode={studio.mode}
          open
          onClose={() => setStudio(null)}
          hourLabel={`Hour ${studio.hour}`}
        />
      )}
    </section>
  )
}
