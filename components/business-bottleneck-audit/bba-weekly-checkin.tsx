"use client"

/**
 * Monday Weekly Business Measurement™ — Weekly Check-in
 * ---------------------------------------------------------------------------
 * The lightweight layer that runs every Monday AFTER a BBA baseline exists.
 * Deliberately NOT a re-take of the 15-category baseline — this measures
 * only the past 7 days across a handful of quick questions, per the
 * approved spec's "BASELINE VS WEEKLY USE" section.
 */

import { useCallback, useMemo, useState } from "react"
import { ArrowRight, Plus, Trash2 } from "lucide-react"
import {
  ASSIGNMENT_IMPLEMENTATION_OPTIONS,
  ASSIGNMENT_PROBLEM_OPTIONS,
  ASSIGNMENT_STATUS_OPTIONS,
  ASSET_STATE_OPTIONS,
  BUSINESS_IMPROVEMENT_OPTIONS,
  LIFE_IMPROVEMENT_OPTIONS,
} from "@/lib/business-bottleneck-audit/bba-weekly-registry"
import type { BbaStakeholderDeadline, BbaWeeklyAssetEntry } from "@/lib/business-bottleneck-audit/types"
import { saveBbaWeeklyCheckin, saveWeeklyDraft } from "@/lib/business-bottleneck-audit/bba-storage"
import { BUSINESS_ASSETS } from "@/lib/business-asset-library/business-asset-registry"

function ToggleChips({
  options,
  selectedIds,
  onToggle,
}: {
  options: { id: string; label: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(option.id)}
            className={`rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors border ${
              isSelected
                ? "bg-brand-green text-white border-brand-green"
                : "bg-white text-brand-ink-soft border-brand-green/25 hover:border-brand-green/50"
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function StepCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl bg-white border border-brand-green/20 shadow-lg overflow-hidden px-7 py-8 sm:px-9 sm:py-9">
      <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark mb-1">{eyebrow}</p>
      <p className="font-sans text-[17px] font-semibold leading-snug text-brand-ink text-balance mb-5">{title}</p>
      {children}
    </div>
  )
}

const STEPS = ["life", "business", "bottlenecks", "assets", "assignment", "stakeholders"] as const
type Step = (typeof STEPS)[number]

export default function BbaWeeklyCheckin({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const step: Step = STEPS[stepIndex]

  const [lifeSelected, setLifeSelected] = useState<string[]>([])
  const [lifeOther, setLifeOther] = useState("")
  const [businessSelected, setBusinessSelected] = useState<string[]>([])
  const [businessOther, setBusinessOther] = useState("")
  const [bottlenecksCleared, setBottlenecksCleared] = useState<number | "">("")
  const [assets, setAssets] = useState<BbaWeeklyAssetEntry[]>([])
  const [assignmentImplementation, setAssignmentImplementation] = useState<string | null>(null)
  const [assignmentStatus, setAssignmentStatus] = useState<string | null>(null)
  const [assignmentProblems, setAssignmentProblems] = useState<string[]>([])
  const [assignmentProblemsOther, setAssignmentProblemsOther] = useState("")
  const [stakeholders, setStakeholders] = useState<BbaStakeholderDeadline[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const assetGroups = useMemo(() => {
    const byCategory = new Map<string, { id: string; name: string }[]>()
    for (const asset of BUSINESS_ASSETS) {
      const list = byCategory.get(asset.category) ?? []
      list.push({ id: asset.id, name: asset.name })
      byCategory.set(asset.category, list)
    }
    return Array.from(byCategory.entries())
  }, [])

  const hadImplementationProblems = assignmentImplementation === "yes-some-problems" || assignmentImplementation === "unable-to-implement"

  const persistDraft = useCallback(() => {
    saveWeeklyDraft({
      lifeImprovement: { selectedIds: lifeSelected, otherText: lifeOther },
      businessImprovement: { selectedIds: businessSelected, otherText: businessOther },
      bottlenecksClearedCount: bottlenecksCleared === "" ? null : bottlenecksCleared,
      businessAssets: assets,
      assignmentStatus,
      assignmentProblems: { selectedIds: assignmentProblems, otherText: assignmentProblemsOther },
      stakeholderDeadlines: stakeholders,
    })
  }, [
    assets,
    assignmentProblems,
    assignmentProblemsOther,
    assignmentStatus,
    bottlenecksCleared,
    businessOther,
    businessSelected,
    lifeOther,
    lifeSelected,
    stakeholders,
  ])

  const goNext = useCallback(async () => {
    persistDraft()

    if (stepIndex < STEPS.length - 1) {
      // Skip the assignment-problems sub-step of "assignment" when nothing went wrong —
      // handled inline within the assignment step below instead of as a separate STEPS entry.
      setStepIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setSaving(true)
    setSaveError(null)
    const result = await saveBbaWeeklyCheckin({
      lifeImprovement: { selectedIds: lifeSelected, otherText: lifeOther },
      businessImprovement: { selectedIds: businessSelected, otherText: businessOther },
      bottlenecksClearedCount: bottlenecksCleared === "" ? null : bottlenecksCleared,
      businessAssets: assets,
      assignmentStatus,
      assignmentProblems: { selectedIds: assignmentProblems, otherText: assignmentProblemsOther },
      stakeholderDeadlines: stakeholders,
    })
    setSaving(false)

    if (!result.success) {
      setSaveError(
        result.error === "not-signed-in"
          ? "Please sign in to save your Monday Weekly Measurement™."
          : "We couldn't save your check-in — please try again.",
      )
      return
    }

    onComplete()
  }, [
    assets,
    assignmentProblems,
    assignmentProblemsOther,
    assignmentStatus,
    bottlenecksCleared,
    businessOther,
    businessSelected,
    lifeOther,
    lifeSelected,
    onComplete,
    persistDraft,
    stakeholders,
    stepIndex,
  ])

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [stepIndex])

  const globalProgress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-green-dark">
            Monday Weekly Business Measurement™
          </span>
          <span className="font-sans text-xs font-medium text-brand-ink-soft tabular-nums">
            {stepIndex + 1} / {STEPS.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-brand-green/20 overflow-hidden">
          <div className="h-full rounded-full bg-brand-green transition-all duration-300" style={{ width: `${globalProgress}%` }} />
        </div>
      </div>

      {step === "life" && (
        <StepCard eyebrow="Life" title="In the past 7 days, how did your life improve?">
          <ToggleChips
            options={LIFE_IMPROVEMENT_OPTIONS}
            selectedIds={lifeSelected}
            onToggle={(id) => setLifeSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
          />
          {lifeSelected.includes("other") && (
            <input
              type="text"
              value={lifeOther}
              onChange={(e) => setLifeOther(e.target.value)}
              placeholder="Please specify…"
              className="mt-3 w-full rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
            />
          )}
        </StepCard>
      )}

      {step === "business" && (
        <StepCard eyebrow="Business" title="In the past 7 days, how did your business improve?">
          <ToggleChips
            options={BUSINESS_IMPROVEMENT_OPTIONS}
            selectedIds={businessSelected}
            onToggle={(id) => setBusinessSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
          />
          {businessSelected.includes("other") && (
            <input
              type="text"
              value={businessOther}
              onChange={(e) => setBusinessOther(e.target.value)}
              placeholder="Please specify…"
              className="mt-3 w-full rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
            />
          )}
        </StepCard>
      )}

      {step === "bottlenecks" && (
        <StepCard eyebrow="Bottlenecks" title="How many bottlenecks did you clear this week?">
          <input
            type="number"
            min={0}
            value={bottlenecksCleared}
            onChange={(e) => setBottlenecksCleared(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full max-w-[10rem] rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
          />
        </StepCard>
      )}

      {step === "assets" && (
        <StepCard eyebrow="Business Assets" title="Did you create, communicate, or put any business assets into use this week?">
          <div className="max-h-80 overflow-y-auto pr-1 space-y-4">
            {assetGroups.map(([categoryName, categoryAssets]) => (
              <div key={categoryName}>
                <p className="font-sans text-xs font-bold uppercase tracking-wide text-brand-ink-soft mb-2">{categoryName}</p>
                <div className="space-y-2">
                  {categoryAssets.map((asset) => {
                    const entry = assets.find((a) => a.assetId === asset.id)
                    return (
                      <div key={asset.id} className="rounded-xl border border-brand-green/15 px-3 py-2">
                        <p className="font-sans text-sm font-semibold text-brand-ink mb-1.5">{asset.name}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ASSET_STATE_OPTIONS.map((state) => {
                            const isSelected = entry?.states.includes(state.id as "created" | "communicated" | "in-use")
                            return (
                              <button
                                key={state.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => {
                                  setAssets((prev) => {
                                    const existing = prev.find((a) => a.assetId === asset.id)
                                    if (!existing) {
                                      return [...prev, { assetId: asset.id, states: [state.id as "created" | "communicated" | "in-use"] }]
                                    }
                                    const hasState = existing.states.includes(state.id as "created" | "communicated" | "in-use")
                                    const nextStates = hasState
                                      ? existing.states.filter((s) => s !== state.id)
                                      : [...existing.states, state.id as "created" | "communicated" | "in-use"]
                                    if (nextStates.length === 0) {
                                      return prev.filter((a) => a.assetId !== asset.id)
                                    }
                                    return prev.map((a) => (a.assetId === asset.id ? { ...a, states: nextStates } : a))
                                  })
                                }}
                                className={`rounded-full px-3 py-1 font-sans text-xs font-semibold transition-colors border ${
                                  isSelected
                                    ? "bg-brand-green text-white border-brand-green"
                                    : "bg-white text-brand-ink-soft border-brand-green/25 hover:border-brand-green/50"
                                }`}
                              >
                                {state.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </StepCard>
      )}

      {step === "assignment" && (
        <StepCard eyebrow="Business Building Assignment" title="What happened with last week's Business Building Assignment?">
          <p className="font-sans text-sm font-semibold text-brand-ink mb-2">Did you have any problems implementing it?</p>
          <ToggleChips
            options={ASSIGNMENT_IMPLEMENTATION_OPTIONS}
            selectedIds={assignmentImplementation ? [assignmentImplementation] : []}
            onToggle={(id) => setAssignmentImplementation(id)}
          />

          {hadImplementationProblems && (
            <div className="mt-5 pt-5 border-t border-brand-green/10">
              <p className="font-sans text-sm font-semibold text-brand-ink mb-2">What problems did you have?</p>
              <ToggleChips
                options={ASSIGNMENT_PROBLEM_OPTIONS}
                selectedIds={assignmentProblems}
                onToggle={(id) =>
                  setAssignmentProblems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
                }
              />
              {assignmentProblems.includes("other") && (
                <input
                  type="text"
                  value={assignmentProblemsOther}
                  onChange={(e) => setAssignmentProblemsOther(e.target.value)}
                  placeholder="Please specify…"
                  className="mt-3 w-full rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                />
              )}
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-brand-green/10">
            <p className="font-sans text-sm font-semibold text-brand-ink mb-2">Overall status</p>
            <ToggleChips
              options={ASSIGNMENT_STATUS_OPTIONS}
              selectedIds={assignmentStatus ? [assignmentStatus] : []}
              onToggle={(id) => setAssignmentStatus(id)}
            />
          </div>
        </StepCard>
      )}

      {step === "stakeholders" && (
        <StepCard eyebrow="Stakeholders / Investors / Reporting" title="Any stakeholder deadlines or obligations to track this week?">
          <div className="space-y-3">
            {stakeholders.map((s, i) => (
              <div key={s.id} className="rounded-xl border border-brand-green/20 p-3 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2">
                <input
                  type="text"
                  value={s.stakeholderName}
                  onChange={(e) =>
                    setStakeholders((prev) => prev.map((x, xi) => (xi === i ? { ...x, stakeholderName: e.target.value } : x)))
                  }
                  placeholder="Stakeholder name"
                  className="rounded-lg border border-brand-green/25 bg-white px-3 py-2 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                />
                <input
                  type="text"
                  value={s.obligation}
                  onChange={(e) =>
                    setStakeholders((prev) => prev.map((x, xi) => (xi === i ? { ...x, obligation: e.target.value } : x)))
                  }
                  placeholder="Obligation / deliverable"
                  className="rounded-lg border border-brand-green/25 bg-white px-3 py-2 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                />
                <input
                  type="date"
                  value={s.dueDate ?? ""}
                  onChange={(e) => setStakeholders((prev) => prev.map((x, xi) => (xi === i ? { ...x, dueDate: e.target.value } : x)))}
                  className="rounded-lg border border-brand-green/25 bg-white px-3 py-2 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                />
                <button
                  type="button"
                  onClick={() => setStakeholders((prev) => prev.filter((_, xi) => xi !== i))}
                  aria-label="Remove stakeholder deadline"
                  className="flex items-center justify-center rounded-lg border border-brand-green/25 px-3 text-brand-ink-soft hover:text-red-600 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setStakeholders((prev) => [
                  ...prev,
                  { id: `sh-${Date.now()}-${prev.length}`, stakeholderName: "", obligation: "", status: "upcoming" },
                ])
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 px-4 py-2 font-sans text-sm font-semibold text-brand-green-dark hover:border-brand-green/50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add stakeholder deadline
            </button>
          </div>
        </StepCard>
      )}

      {saveError && <p className="mt-3 font-sans text-sm font-medium text-red-600">{saveError}</p>}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="font-sans text-sm font-medium text-brand-ink-soft hover:text-brand-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2 font-sans text-sm font-bold text-white shadow transition-colors hover:bg-brand-green-dark disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        >
          {saving ? "Saving…" : stepIndex < STEPS.length - 1 ? "Next" : "Complete Weekly Check-in"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
