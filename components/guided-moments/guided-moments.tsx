"use client"

/**
 * Guided Moments™ — reusable one-Moment-at-a-time interaction engine.
 *
 * Replaces the old "planner" model (chip examples → commitment sentence →
 * Intention Declaration™) with a lighter, conversational pattern:
 *
 *   One Moment → answer → Cherry Blossom™ micro-confirmation → complete →
 *   collapse → next Moment
 *
 * Only one Moment is ever open at a time. Completed Moments collapse to a
 * single-line summary with a green checkmark, and can be reopened via
 * "Previous" to edit an earlier answer. After the final Moment, a Summary
 * is shown with a fuller Cherry Blossom™ confirmation and an optional
 * "Copy" action for community sharing.
 *
 * This is the shared architecture for the other Work-Life Balance Business
 * Day™ segments — only the `moments` config (questions, options, copy)
 * changes per segment.
 */

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronLeft, Clipboard, ClipboardCheck } from "lucide-react"

export interface MomentOption {
  id: string
  label: string
}

export interface MomentConfig {
  id: string
  /** The single question shown at the top of this Moment. */
  question: string
  /** Optional helper line under the question, e.g. "Select all that apply." */
  helperText?: string
  options: MomentOption[]
  /** Allow more than one option to be selected. Defaults to true. */
  multiSelect?: boolean
  /** Show an "Other" option that reveals a free-text field. Defaults to true. */
  allowOther?: boolean
  /** Placeholder question shown above the "Other" text field. */
  otherPrompt?: string
  /** Short label used in the collapsed summary row, e.g. "What I'm Making Time For". */
  summaryLabel: string
  /** Cherry Blossom™ micro-confirmation (1–2 sentences) shown after Continue. */
  confirmation: string
}

export interface GuidedMomentsProps {
  moments: MomentConfig[]
  /** Heading for the final summary card, e.g. "Today's Flex Time™". */
  summaryTitle: string
  /** Lead-in line above the final selections list, e.g. "You're making time for:". */
  summaryLeadIn: string
  /** Fuller Cherry Blossom™ confirmation (1–2 sentences) shown in the summary. */
  summaryConfirmation: string
  /** When set, shows a "Copy My Morning Plan"-style share action in the summary. */
  copy?: {
    label: string
    buildText: (selectionsByMoment: Record<string, string[]>) => string
  }
}

type MomentStatus = "upcoming" | "open" | "confirming" | "completed"

const CONFIRMATION_MS = 1800

export function GuidedMoments({ moments, summaryTitle, summaryLeadIn, summaryConfirmation, copy }: GuidedMomentsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedThrough, setCompletedThrough] = useState(-1)
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [otherDraft, setOtherDraft] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    }
  }, [])

  const isSummary = completedThrough >= moments.length - 1 && confirmingIndex === null

  function statusFor(index: number): MomentStatus {
    if (confirmingIndex === index) return "confirming"
    if (index <= completedThrough) return "completed"
    if (index === activeIndex) return "open"
    return "upcoming"
  }

  function toggleOption(momentId: string, optionLabel: string, multiSelect: boolean) {
    // "Other" may be stored as the literal chip ("Other") or, once the member
    // types something, as "Other: <their text>" — treat either form as "selected".
    const isOtherChip = optionLabel === "Other"
    const matches = (v: string) => (isOtherChip ? v === "Other" || v.startsWith("Other:") : v === optionLabel)

    setSelections((prev) => {
      const current = prev[momentId] ?? []
      const isSelected = current.some(matches)
      if (multiSelect) {
        const next = isSelected ? current.filter((v) => !matches(v)) : [...current, optionLabel]
        return { ...prev, [momentId]: next }
      }
      return { ...prev, [momentId]: isSelected ? [] : [optionLabel] }
    })

    if (isOtherChip) {
      setOtherDraft((prev) => {
        const current = selections[momentId] ?? []
        const wasSelected = current.some(matches)
        return wasSelected ? { ...prev, [momentId]: "" } : prev
      })
    }
  }

  function handleContinue(index: number) {
    const moment = moments[index]
    const chosen = selections[moment.id] ?? []
    if (chosen.length === 0) return

    setConfirmingIndex(index)
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    confirmTimerRef.current = setTimeout(() => {
      setConfirmingIndex(null)
      setCompletedThrough((prev) => Math.max(prev, index))
      setActiveIndex(index + 1)
    }, CONFIRMATION_MS)
  }

  function handlePrevious(index: number) {
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    setConfirmingIndex(null)
    setCompletedThrough(index - 1)
    setActiveIndex(index)
  }

  async function handleCopy() {
    if (!copy) return
    const text = copy.buildText(selections)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard permission denied or unavailable — fail silently, no error state needed.
    }
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Progress — one row, current Moment highlighted, completed ones checked */}
      <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Guided Moments progress">
        {moments.map((moment, index) => {
          const status = statusFor(index)
          const isDone = status === "completed"
          const isCurrent = status === "open" || status === "confirming"
          return (
            <div key={moment.id} className="flex items-center gap-2" role="listitem">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-brand-green text-white"
                    : isCurrent
                      ? "bg-brand-green/15 text-brand-green-dark ring-2 ring-brand-green/40"
                      : "bg-black/[0.05] text-brand-ink-soft/50"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
              </span>
              {index < moments.length - 1 && (
                <span className={`h-px w-6 ${isDone ? "bg-brand-green/50" : "bg-black/10"}`} aria-hidden />
              )}
            </div>
          )
        })}
        <span className="ml-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/60">
          Moment {Math.min(activeIndex + 1, moments.length)} of {moments.length}
        </span>
      </div>

      {/* Each Moment — only one open at a time */}
      <div className="space-y-3">
        {moments.map((moment, index) => {
          const status = statusFor(index)
          if (status === "upcoming") return null

          const chosen = selections[moment.id] ?? []
          const hasOther = chosen.some((v) => v === "Other" || v.startsWith("Other:"))

          if (status === "completed") {
            const displayItems = chosen.map((v) => (v.startsWith("Other:") ? v.slice("Other:".length).trim() : v))
            return (
              <div
                key={moment.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-brand-green/20 bg-brand-green/[0.05] px-5 py-4"
              >
                <div>
                  <p className="font-sans text-sm font-bold text-brand-ink">{moment.summaryLabel}</p>
                  <p className="mt-1 font-sans text-sm text-brand-ink-soft">{displayItems.join(" · ")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePrevious(index)}
                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-brand-green-dark/70 transition-colors hover:text-brand-green-dark"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                    Previous
                  </button>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </div>
            )
          }

          // open or confirming
          return (
            <div key={moment.id} className="rounded-2xl border border-brand-blush bg-white px-5 py-6 sm:px-7">
              <AnimatePresence mode="wait">
                {status === "confirming" ? (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-xl leading-none" aria-hidden>
                      🌸
                    </span>
                    <p className="font-sans text-[15px] leading-relaxed text-brand-ink">{moment.confirmation}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-playfair text-xl font-semibold text-brand-ink text-balance">{moment.question}</h4>
                    {moment.helperText && (
                      <p className="mt-1 font-sans text-sm text-brand-ink-soft">{moment.helperText}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {moment.options.map((opt) => {
                        const selected = chosen.includes(opt.label)
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleOption(moment.id, opt.label, moment.multiSelect ?? true)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm font-medium transition-colors ${
                              selected
                                ? "border-brand-green bg-brand-green/10 text-brand-green-dark"
                                : "border-brand-blush bg-white text-brand-ink-soft hover:border-brand-green/40 hover:text-brand-green-dark"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>

                    {(moment.allowOther ?? true) && hasOther && (
                      <div className="mt-4">
                        <label
                          htmlFor={`other-${moment.id}`}
                          className="mb-1.5 block font-sans text-sm font-semibold text-brand-ink"
                        >
                          {moment.otherPrompt ?? "Tell us more"}
                        </label>
                        <input
                          id={`other-${moment.id}`}
                          type="text"
                          value={otherDraft[moment.id] ?? ""}
                          onChange={(e) => {
                            const text = e.target.value
                            setOtherDraft((prev) => ({ ...prev, [moment.id]: text }))
                            setSelections((prev) => {
                              const withoutOther = (prev[moment.id] ?? []).filter(
                                (v) => v !== "Other" && !v.startsWith("Other:"),
                              )
                              return {
                                ...prev,
                                [moment.id]: text.trim()
                                  ? [...withoutOther, `Other: ${text.trim()}`]
                                  : [...withoutOther, "Other"],
                              }
                            })
                          }}
                          placeholder="Type your own..."
                          className="w-full rounded-xl border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                        />
                      </div>
                    )}

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleContinue(index)}
                        disabled={chosen.length === 0}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handlePrevious(index)}
                          className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden />
                          Previous
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Summary — shown once every Moment is complete */}
      {isSummary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-brand-green/20 bg-brand-green/[0.06] px-5 py-6 sm:px-7"
        >
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark/70">
            {summaryTitle}
          </p>
          <p className="mt-2 font-sans text-sm font-semibold text-brand-ink">{summaryLeadIn}</p>
          <ul className="mt-2 space-y-1.5">
            {moments.flatMap((m) => selections[m.id] ?? []).map((item, i) => (
              <li key={i} className="flex items-center gap-2 font-sans text-[15px] text-brand-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                {item.startsWith("Other:") ? item.slice("Other:".length).trim() : item}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-brand-coral/15 bg-white/60 px-4 py-3">
            <span className="text-lg leading-none" aria-hidden>
              🌸
            </span>
            <p className="font-sans text-sm leading-relaxed text-brand-ink">{summaryConfirmation}</p>
          </div>

          {copy && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-brand-green-dark transition-colors hover:bg-brand-green/5"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="h-4 w-4" aria-hidden />
                  Copied ✓
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" aria-hidden />
                  {copy.label}
                </>
              )}
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default GuidedMoments
