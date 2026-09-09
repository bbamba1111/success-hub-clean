"use client"

/**
 * Work-Life Balance Time-Leak Check™ — Wizard
 * ---------------------------------------------------------------------------
 * Seven screens that identify what is causing the founder to overwork. Fully
 * driven by lib/wlb-time-leak/registry.ts. Visual language mirrors the BBA
 * baseline wizard (brand tokens, chip buttons, progress header) so the two
 * onboarding diagnostics feel like one system.
 *
 *   Q1 spillover        — multi
 *   Q2 overwork-shape   — multi
 *   Q3 pull-back        — multi
 *   Q4 primary-driver   — single, drawn from the Q3 selections
 *   Q5 hat-load         — multi, grouped by the 8 business categories
 *   Q6 life-impact      — multi, mirrors the WBA 15 Core Life Value Areas
 *   Q7 solution-match   — multi, max 3, grouped
 */

import { useCallback, useMemo, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import {
  FOUNDER_DEPENDENCY_OPTION,
  HAT_LOAD_GROUPS,
  LIFE_IMPACT_OPTIONS,
  OVERWORK_SHAPE_OPTIONS,
  PULL_BACK_OPTIONS,
  SOLUTION_MATCH_GROUPS,
  SOLUTION_MATCH_MAX,
  SPILLOVER_OPTIONS,
  pullBackLabel,
} from "@/lib/wlb-time-leak/registry"
import type { TimeLeakQuestionId, TimeLeakResponses } from "@/lib/wlb-time-leak/types"
import { saveTimeLeakCheck, saveTimeLeakDraft } from "@/lib/wlb-time-leak/storage"

const STEP_ORDER: TimeLeakQuestionId[] = [
  "spillover",
  "overwork-shape",
  "pull-back",
  "primary-driver",
  "hat-load",
  "life-impact",
  "solution-match",
]

function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled && !selected}
      onClick={onClick}
      className={`rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors border text-left ${
        selected
          ? "bg-brand-green text-white border-brand-green"
          : disabled
            ? "bg-white text-brand-ink-soft/40 border-brand-green/15 cursor-not-allowed"
            : "bg-white text-brand-ink-soft border-brand-green/25 hover:border-brand-green/50"
      }`}
    >
      {label}
    </button>
  )
}

export default function TimeLeakWizard({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [responses, setResponses] = useState<TimeLeakResponses>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const step = STEP_ORDER[stepIndex]
  const isLast = stepIndex === STEP_ORDER.length - 1

  // Scroll to the top of the wizard (NOT the page top — that is the 70vh
  // Cherry Blossom hero scene, which is jarring to jump back to on every
  // answer). Aligning the wizard's own top to just below the viewport top
  // keeps the progress header and the next question in view.
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollToWizardTop = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: "smooth" })
  }, [])

  const persist = useCallback((next: TimeLeakResponses) => {
    setResponses(next)
    saveTimeLeakDraft(next, {})
  }, [])

  const getMulti = (id: TimeLeakQuestionId): string[] => (responses[id] as string[] | undefined) ?? []

  const toggleMulti = useCallback(
    (id: TimeLeakQuestionId, optionId: string, max?: number) => {
      const current = (responses[id] as string[] | undefined) ?? []
      const has = current.includes(optionId)
      if (!has && max && current.length >= max) return
      const nextList = has ? current.filter((x) => x !== optionId) : [...current, optionId]
      persist({ ...responses, [id]: nextList })
    },
    [responses, persist],
  )

  // Q4's single-select is drawn from the founder's Q3 selections. If they
  // selected nothing in Q3, fall back to the full list so they can still name a driver.
  const primaryDriverOptions = useMemo(() => {
    const selected = getMulti("pull-back")
    const pool = selected.length > 0 ? PULL_BACK_OPTIONS.filter((o) => selected.includes(o.id)) : PULL_BACK_OPTIONS
    return pool
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses])

  const canAdvance = useMemo(() => {
    switch (step) {
      case "primary-driver":
        return Boolean(responses["primary-driver"])
      case "spillover":
      case "overwork-shape":
      case "pull-back":
      case "hat-load":
      case "life-impact":
      case "solution-match":
        return getMulti(step).length > 0
      default:
        return true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, responses])

  const handleNext = useCallback(async () => {
    if (!isLast) {
      setStepIndex((i) => i + 1)
      scrollToWizardTop()
      return
    }
    setSaving(true)
    setSaveError(null)
    const result = await saveTimeLeakCheck(responses, {})
    setSaving(false)
    if (!result.success) {
      setSaveError(
        result.error === "not-signed-in"
          ? "Please sign in to save your Work-Life Balance Time-Leak Check™."
          : "We couldn't save your check — please try again.",
      )
      return
    }
    onComplete()
  }, [isLast, onComplete, responses])

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
      scrollToWizardTop()
    }
  }, [stepIndex, scrollToWizardTop])

  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100

  return (
    <div ref={rootRef} className="w-full max-w-4xl mx-auto px-4 py-10 scroll-mt-4">
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-green-dark">
            Work-Life Balance Time-Leak Check™
          </span>
          <span className="font-sans text-xs font-medium text-brand-ink-soft tabular-nums">
            Question {stepIndex + 1} / {STEP_ORDER.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-brand-green/20 overflow-hidden">
          <div className="h-full rounded-full bg-brand-green transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-brand-green/20 shadow-lg overflow-hidden">
        <div className="px-7 pt-8 pb-4 sm:px-9 sm:pt-9">
          {step === "spillover" && (
            <Question prompt="Where does work currently spill into your life?" hint="Select all that apply.">
              <ChipGrid>
                {SPILLOVER_OPTIONS.map((o) => (
                  <Chip key={o.id} label={o.label} selected={getMulti("spillover").includes(o.id)} onClick={() => toggleMulti("spillover", o.id)} />
                ))}
              </ChipGrid>
            </Question>
          )}

          {step === "overwork-shape" && (
            <Question prompt="What does overworking look like for you right now?" hint="Select all that apply.">
              <ChipGrid>
                {OVERWORK_SHAPE_OPTIONS.map((o) => (
                  <Chip key={o.id} label={o.label} selected={getMulti("overwork-shape").includes(o.id)} onClick={() => toggleMulti("overwork-shape", o.id)} />
                ))}
              </ChipGrid>
            </Question>
          )}

          {step === "pull-back" && (
            <Question prompt="What keeps pulling you back into work?" hint="Select all that apply.">
              <ChipGrid>
                {PULL_BACK_OPTIONS.map((o) => (
                  <Chip key={o.id} label={o.label} selected={getMulti("pull-back").includes(o.id)} onClick={() => toggleMulti("pull-back", o.id)} />
                ))}
              </ChipGrid>
            </Question>
          )}

          {step === "primary-driver" && (
            <Question
              prompt="Which ONE is your biggest source of overwork right now?"
              hint="This becomes your Primary Time-Leak Driver™."
            >
              <ChipGrid>
                {primaryDriverOptions.map((o) => (
                  <Chip
                    key={o.id}
                    label={o.label}
                    selected={responses["primary-driver"] === o.id}
                    onClick={() => persist({ ...responses, "primary-driver": o.id })}
                  />
                ))}
              </ChipGrid>
            </Question>
          )}

          {step === "hat-load" && (
            <Question
              prompt="Which roles are you currently responsible for in your business?"
              hint="Select all that apply. This reveals where the business depends on you personally."
            >
              <div className="mt-3 rounded-2xl border border-brand-coral/30 bg-brand-blush/20 px-4 py-3">
                <Chip
                  label={FOUNDER_DEPENDENCY_OPTION.label}
                  selected={getMulti("hat-load").includes(FOUNDER_DEPENDENCY_OPTION.id)}
                  onClick={() => toggleMulti("hat-load", FOUNDER_DEPENDENCY_OPTION.id)}
                />
                <p className="mt-2 font-sans text-xs font-medium text-brand-ink-soft">
                  Not a judgment — a way to reveal how much of the business currently depends on you.
                </p>
              </div>
              <div className="mt-5 space-y-5">
                {HAT_LOAD_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark mb-2">
                      {group.label}
                    </p>
                    <ChipGrid>
                      {group.options.map((o) => (
                        <Chip key={o.id} label={o.label} selected={getMulti("hat-load").includes(o.id)} onClick={() => toggleMulti("hat-load", o.id)} />
                      ))}
                    </ChipGrid>
                  </div>
                ))}
              </div>
            </Question>
          )}

          {step === "life-impact" && (
            <Question
              prompt="What areas of your life are being crowded out by work?"
              hint="Select all that apply. These become your Time-Leak Impact Map™ — not WBA scores."
            >
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {LIFE_IMPACT_OPTIONS.map((o) => {
                  const selected = getMulti("life-impact").includes(o.id)
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleMulti("life-impact", o.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                        selected
                          ? "bg-brand-green/10 border-brand-green"
                          : "bg-white border-brand-green/25 hover:border-brand-green/50"
                      }`}
                    >
                      <p className="font-sans text-sm font-semibold text-brand-ink">{o.label}</p>
                      <p className="mt-0.5 font-sans text-xs leading-relaxed text-brand-ink-soft text-pretty">{o.description}</p>
                    </button>
                  )
                })}
              </div>
            </Question>
          )}

          {step === "solution-match" && (
            <Question
              prompt="What would help you contain your work and create more room for life?"
              hint={`Select up to ${SOLUTION_MATCH_MAX}. You're connecting the problem to the solution.`}
            >
              <p className="mt-1 font-sans text-xs font-semibold text-brand-green-dark">
                {getMulti("solution-match").length} / {SOLUTION_MATCH_MAX} selected
              </p>
              <div className="mt-4 space-y-5">
                {SOLUTION_MATCH_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-green-dark mb-2">
                      {group.label}
                    </p>
                    <ChipGrid>
                      {group.options.map((o) => (
                        <Chip
                          key={o.id}
                          label={o.label}
                          selected={getMulti("solution-match").includes(o.id)}
                          disabled={getMulti("solution-match").length >= SOLUTION_MATCH_MAX}
                          onClick={() => toggleMulti("solution-match", o.id, SOLUTION_MATCH_MAX)}
                        />
                      ))}
                    </ChipGrid>
                  </div>
                ))}
              </div>
            </Question>
          )}
        </div>

        {saveError && (
          <div className="px-7 sm:px-9 pb-2">
            <p className="font-sans text-sm font-medium text-red-600">{saveError}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-brand-green/20 px-7 py-4 sm:px-9">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="font-sans text-sm font-medium text-brand-ink-soft hover:text-brand-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving || !canAdvance}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2 font-sans text-sm font-bold text-white shadow transition-colors hover:bg-brand-green-dark disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            {saving ? "Saving…" : isLast ? "See My Time-Leak Profile" : "Next"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Primary driver echo — quiet reassurance once chosen */}
      {responses["primary-driver"] && stepIndex > STEP_ORDER.indexOf("primary-driver") && (
        <p className="mt-4 font-sans text-xs font-medium text-brand-ink-soft">
          Primary Time-Leak Driver™: <span className="text-brand-green-dark font-semibold">{pullBackLabel(responses["primary-driver"])}</span>
        </p>
      )}
    </div>
  )
}

function Question({ prompt, hint, children }: { prompt: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-sans text-lg font-bold leading-snug text-brand-ink text-balance">{prompt}</p>
      {hint && <p className="mt-1 font-sans text-sm font-medium text-brand-ink-soft">{hint}</p>}
      {children}
    </div>
  )
}

function ChipGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group">
      {children}
    </div>
  )
}
