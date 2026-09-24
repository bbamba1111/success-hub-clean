"use client"

/**
 * MY WEEKLY LIFE PRIORITIES™ + ONE WEEKLY BOUNDARY FOCUS™
 * ---------------------------------------------------------------------------
 * The redesigned heart of Decide & Design™. Two distinct concepts:
 *
 *   LIFE PRIORITIES™        — a COLLECTION. What the founder wants to make room
 *                             for this week. No 1–3 limit. Presented one
 *                             category at a time, never as a wall of pills.
 *
 *   BOUNDARY FOCUS™         — EXACTLY ONE boundary to build into the business
 *                             and live this week. Recommended from the Reality
 *                             Check™; the founder accepts it or chooses another.
 *
 * The old three-part model (Life / Delegation / Operating Rule) is gone.
 * Delegation and operating rules become the Boundary Builder™ in a later
 * milestone — nothing here generates business tasks.
 */

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Check, ChevronLeft, Plus, Sparkles } from "lucide-react"
import { useWeeklyLifePriorities } from "@/lib/weekly-life-priorities/use-weekly-life-priorities"
import {
  LIFE_PRIORITY_CATEGORIES,
  suggestLifeCategoriesFromFocus,
  type LifePriorityCategory,
} from "@/lib/weekly-life-priorities/catalog"
import type { LifePrioritySelection } from "@/lib/weekly-life-priorities/types"
import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { BOUNDARY_OPTIONS, recommendBoundary } from "@/lib/weekly-boundary-focus/catalog"
import { getLatestBoundaryReport } from "@/lib/boundary-report/actions"
import type { BoundaryReportData } from "@/lib/boundary-report/types"

/* ── shared visual atoms (match Decide & Design™ language exactly) ─────────── */

function Card({ children, tone = "white" }: { children: ReactNode; tone?: "white" | "green" | "pink" }) {
  const cls =
    tone === "green"
      ? "border-[#7FB069]/30 bg-[#F3F8ED]"
      : tone === "pink"
        ? "border-[#C0545A]/20 bg-[#FDF8F5]"
        : "border-[#E8DFE2] bg-white"
  return <div className={`rounded-3xl border shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-5 ${cls}`}>{children}</div>
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">{children}</p>
  )
}

/* ── Life Priorities™ — guided, one category at a time ────────────────────── */

function LifePrioritiesSection({
  report,
}: {
  report: BoundaryReportData | null
}) {
  const { priorities, save } = useWeeklyLifePriorities()

  // Selection working set (label-keyed), seeded from persisted rows.
  const [selected, setSelected] = useState<LifePrioritySelection[]>([])
  const [seeded, setSeeded] = useState(false)
  useEffect(() => {
    if (!seeded && priorities.length > 0) {
      setSelected(priorities.map((p) => ({ optionId: p.optionId, label: p.label })))
      setSeeded(true)
    }
  }, [priorities, seeded])

  const focusLabels = useMemo(() => (report?.priorityAreas ?? []).map((a) => a.label), [report])
  const suggestedIds = useMemo(
    () => new Set(suggestLifeCategoriesFromFocus(focusLabels).map((c) => c.id)),
    [focusLabels],
  )

  // Order categories so Reality-Check-suggested ones come first.
  const orderedCategories = useMemo(() => {
    const suggested = LIFE_PRIORITY_CATEGORIES.filter((c) => suggestedIds.has(c.id))
    const rest = LIFE_PRIORITY_CATEGORIES.filter((c) => !suggestedIds.has(c.id))
    return [...suggested, ...rest]
  }, [suggestedIds])

  const [step, setStep] = useState(0)
  const [customMode, setCustomMode] = useState(false)
  const [customDraft, setCustomDraft] = useState("")

  const isSelected = (label: string) => selected.some((s) => s.label.toLowerCase() === label.toLowerCase())

  function persist(next: LifePrioritySelection[]) {
    setSelected(next)
    void save(next)
  }

  function toggle(cat: LifePriorityCategory) {
    const next = isSelected(cat.label)
      ? selected.filter((s) => s.label.toLowerCase() !== cat.label.toLowerCase())
      : [...selected, { optionId: cat.id, label: cat.label }]
    persist(next)
  }

  function addCustom() {
    const label = customDraft.trim()
    if (!label || isSelected(label)) {
      setCustomDraft("")
      return
    }
    persist([...selected, { optionId: "custom", label }])
    setCustomDraft("")
  }

  function removeSelected(label: string) {
    persist(selected.filter((s) => s.label.toLowerCase() !== label.toLowerCase()))
  }

  const total = orderedCategories.length
  const atCustomStep = step >= total
  const current = orderedCategories[step]

  return (
    <Card tone="pink">
      <div>
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          My Weekly Life Priorities™
        </p>
        <p className="mt-2 font-serif text-lg text-[#2E1F27] text-pretty">
          What do you want to make more room for this week?
        </p>
        <p className="mt-1 font-sans text-sm text-[#6B5860] leading-relaxed">
          Choose as many as you like — there is no limit. These are the parts of life you want to protect, enjoy, or
          plan for during your Time Freedom™.
        </p>
      </div>

      {/* Running selection summary */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <Eyebrow>Chosen this week ({selected.length})</Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {selected.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => removeSelected(s.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C0545A] bg-[#C0545A] px-3.5 py-1.5 font-sans text-sm text-white hover:opacity-90"
                >
                  {s.label}
                  <span aria-hidden className="text-white/80">
                    ×
                  </span>
                  <span className="sr-only">Remove</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Guided one-at-a-time chooser */}
      <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow>
            {atCustomStep ? "Anything else?" : `Category ${step + 1} of ${total}`}
          </Eyebrow>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCustomMode(false)
                  setStep((s) => Math.max(0, s - 1))
                }}
                className="inline-flex items-center gap-1 rounded-full border border-[#E8DFE2] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
              >
                <ChevronLeft className="h-3 w-3" aria-hidden /> Back
              </button>
            )}
          </div>
        </div>

        {!atCustomStep && current ? (
          <div className="space-y-4">
            <p className="font-serif text-2xl font-semibold text-[#2E1F27]">
              {current.label}
              {suggestedIds.has(current.id) && (
                <span className="ml-2 inline-flex items-center gap-1 align-middle font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C0545A]">
                  <Sparkles className="h-3 w-3" aria-hidden /> From your Reality Check
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  toggle(current)
                  if (step < total) setStep((s) => s + 1)
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-sans text-sm font-semibold transition-colors ${
                  isSelected(current.label)
                    ? "border border-[#C0545A] bg-[#C0545A] text-white"
                    : "border border-[#C0545A]/30 bg-[#FDF8F5] text-[#3A2E33] hover:bg-[#C0545A]/10"
                }`}
              >
                {isSelected(current.label) ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden /> Added to my week
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" aria-hidden /> Make room for this
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center rounded-full border border-[#E8DFE2] bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#6B5860] hover:bg-black/[0.03]"
              >
                {step + 1 < total ? "Not this week →" : "Not this week →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-serif text-xl font-semibold text-[#2E1F27] text-pretty">
              Is there anything else you want to make room for?
            </p>
            {customMode ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={customDraft}
                  onChange={(e) => setCustomDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) addCustom()
                  }}
                  placeholder="In a few words…"
                  aria-label="Create my own life priority"
                  className="flex-1 rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/60 focus:outline-none focus:ring-2 focus:ring-[#C0545A]/25"
                />
                <button
                  type="button"
                  onClick={addCustom}
                  disabled={!customDraft.trim()}
                  className="rounded-full bg-[#C0545A] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C0545A]/30 bg-[#FDF8F5] px-5 py-2.5 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-[#C0545A]/10"
              >
                <Plus className="h-4 w-4" aria-hidden /> Create my own
              </button>
            )}
            <p className="font-sans text-xs text-[#6B5860]">
              {selected.length > 0
                ? "Your life priorities are saved as you choose."
                : "Add at least one thing you want to make room for this week."}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

/* ── Boundary Focus™ — exactly one boundary for the week ──────────────────── */

function BoundaryFocusSection({
  report,
}: {
  report: BoundaryReportData | null
}) {
  const { priorities } = useWeeklyLifePriorities()
  const { focus, save } = useWeeklyBoundaryFocus()

  const selectedLifeLabels = useMemo(() => priorities.map((p) => p.label), [priorities])
  const recommendation = useMemo(
    () => recommendBoundary(report, selectedLifeLabels),
    [report, selectedLifeLabels],
  )

  const [choosingOther, setChoosingOther] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const [customDraft, setCustomDraft] = useState("")

  const chosen = focus.boundaryText

  function chooseBoundary(text: string, optionId: string, sourceContext: string | null) {
    void save({ boundaryText: text, optionId, sourceContext, status: "chosen" })
    setChoosingOther(false)
    setCustomMode(false)
  }

  function addCustom() {
    const text = customDraft.trim()
    if (!text) return
    chooseBoundary(text, "custom", "Created by the founder")
    setCustomDraft("")
  }

  return (
    <Card tone="green">
      <div>
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
          My Weekly Work-Life Balance Boundary Focus™
        </p>
        <p className="mt-1 font-sans text-sm text-[#6B5860] leading-relaxed text-pretty">
          Choose one boundary to build into the business and live this week.
        </p>
      </div>

      {/* Chosen state */}
      {chosen && !choosingOther ? (
        <div className="rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-5 space-y-3">
          <Eyebrow>This week&apos;s boundary</Eyebrow>
          <p className="font-serif text-2xl font-semibold text-[#2E1F27] text-pretty">{chosen}</p>
          <button
            type="button"
            onClick={() => setChoosingOther(true)}
            className="inline-flex items-center rounded-full border border-[#7FB069]/30 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
          >
            Choose a different boundary
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Recommendation */}
          {recommendation && !choosingOther && (
            <div className="rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-5 space-y-3">
              <div>
                <Eyebrow>Recommended boundary</Eyebrow>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#2E1F27] text-pretty">
                  {recommendation.option.label}
                </p>
                <p className="mt-1 font-sans text-xs text-[#6B5860]">{recommendation.option.helper}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    chooseBoundary(recommendation.option.label, recommendation.option.id, recommendation.context)
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-6 py-3 font-sans text-sm font-bold text-white hover:opacity-90"
                >
                  <Check className="h-4 w-4" aria-hidden /> Use this boundary
                </button>
                <button
                  type="button"
                  onClick={() => setChoosingOther(true)}
                  className="inline-flex items-center rounded-full border border-[#7FB069]/30 bg-white px-6 py-3 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
                >
                  Choose a different boundary
                </button>
              </div>
            </div>
          )}

          {/* Structured choices (shown when choosing another, or when no recommendation) */}
          {(choosingOther || !recommendation) && (
            <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-5 space-y-3">
              <Eyebrow>Choose a boundary</Eyebrow>
              <div className="space-y-2">
                {BOUNDARY_OPTIONS.map((o) => {
                  const active = focus.optionId === o.id && focus.boundaryText === o.label
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        chooseBoundary(
                          o.label,
                          o.id,
                          recommendation?.option.id === o.id ? recommendation.context : null,
                        )
                      }
                      className={`flex w-full flex-col items-start rounded-2xl border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-[#5B835F] bg-[#F3F8ED]"
                          : "border-[#E8DFE2] bg-white hover:bg-black/[0.02]"
                      }`}
                    >
                      <span className="font-sans text-sm font-semibold text-[#2E1F27]">{o.label}</span>
                      <span className="font-sans text-xs text-[#6B5860]">{o.helper}</span>
                    </button>
                  )
                })}
              </div>

              {/* Create my own — intentional path */}
              {customMode ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center pt-1">
                  <input
                    type="text"
                    value={customDraft}
                    onChange={(e) => setCustomDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) addCustom()
                    }}
                    placeholder="Name the boundary in your own words…"
                    aria-label="Create my own boundary"
                    className="flex-1 rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/60 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
                  />
                  <button
                    type="button"
                    onClick={addCustom}
                    disabled={!customDraft.trim()}
                    className="rounded-full bg-[#5B835F] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                  >
                    Use this
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomMode(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
                >
                  <Plus className="h-4 w-4" aria-hidden /> Create my own
                </button>
              )}

              {choosingOther && recommendation && (
                <button
                  type="button"
                  onClick={() => setChoosingOther(false)}
                  className="inline-flex items-center gap-1 pt-1 font-sans text-xs font-semibold text-[#6B5860] hover:text-[#3A2E33]"
                >
                  <ChevronLeft className="h-3 w-3" aria-hidden /> Back to the recommendation
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

/* ── report fetch shared by both entry points ─────────────────────────────── */

function useLatestBoundaryReport() {
  const [report, setReport] = useState<BoundaryReportData | null>(null)
  useEffect(() => {
    let active = true
    getLatestBoundaryReport()
      .then((res) => {
        if (active) setReport(res?.data ?? null)
      })
      .catch(() => {
        if (active) setReport(null)
      })
    return () => {
      active = false
    }
  }, [])
  return report
}

/* ── entry points ────────────────────────────────────────────────────────── */

/**
 * My Weekly Life Priorities™ — now lives inside the Time Freedom™ collapsible
 * of Design My Business Day™, since these are the parts of life the founder is
 * protecting, enjoying, or planning for during Time Freedom. Fully editable in
 * place; selections persist the moment they're made.
 */
export function WeeklyLifePrioritiesCard() {
  const report = useLatestBoundaryReport()
  return <LifePrioritiesSection report={report} />
}

export function WeeklyPrioritiesDesigner() {
  const report = useLatestBoundaryReport()

  return (
    <div className="space-y-6">
      <BoundaryFocusSection report={report} />

    </div>
  )
}
