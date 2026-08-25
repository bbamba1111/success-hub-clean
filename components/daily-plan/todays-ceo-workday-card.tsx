"use client"

/**
 * Today's CEO Workday™ card — replaces the old static `ceoBlocks` (AI
 * Augmentation Hour™, etc.) entirely. Shows the founder's own CEO Workday™
 * activities decided in Decide & Design™, with per-activity status
 * controls, an "Builds an Asset™" badge (static keyword classification —
 * NOT a new engine), a running 4-hour total, and "What Else Can This
 * Become?" derivative suggestions once an activity is complete. The full
 * Founder GPS™ Next Best Move™ → Build Path™ → Build Blueprint™ experience
 * (`FounderGpsWorkspace`) is shown at the top — the SAME canonical engine
 * `DecideIdentitySpace` and My Blueprint use, never a second recommendation
 * engine; this is simply where the founder now acts on it. If an activity
 * is tied to a Readiness Capability™, a read-only Build Record™ status link
 * is shown.
 */

import { useEffect, useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { getDateKey, loadTodaysPlan, updateTodaysPlan } from "@/lib/daily-plan/storage"
import type { CeoActivity, CeoActivityStatus, TodaysPlanRecord } from "@/lib/daily-plan/types"
import { CEO_WORKDAY_CAP_MINUTES } from "@/lib/daily-plan/types"
import { classifyAssetBuilding, suggestDerivatives } from "@/lib/daily-plan/asset-classification"
import { getBuildRecord } from "@/lib/build-record/build-record-store"
import { FounderGpsWorkspace } from "@/components/build-strategy/founder-gps-workspace"
import { CeoWorkdayCheckins } from "@/components/daily-plan/ceo-workday-checkins"
import { CeoWorkdayProof } from "@/components/daily-plan/ceo-workday-proof"

const STATUS_OPTIONS: { value: CeoActivityStatus; label: string }[] = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
  { value: "blocked", label: "Blocked" },
  { value: "waiting", label: "Waiting" },
]

const STATUS_COLOR: Record<CeoActivityStatus, string> = {
  "not-started": "border-[#E8DFE2] bg-white text-[#6B5860]",
  "in-progress": "border-[#8DAE72] bg-[#8DAE72] text-white",
  complete: "border-[#5A7A45] bg-[#5A7A45] text-white",
  blocked: "border-[#C13B6B] bg-[#C13B6B] text-white",
  waiting: "border-[#E8A24C] bg-[#E8A24C] text-white",
}

export function TodaysCeoWorkdayCard() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)
  const [expandedDerivatives, setExpandedDerivatives] = useState<Set<string>>(new Set())

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) return null

  function updateActivity(id: string, updates: Partial<CeoActivity>) {
    const next = plan!.ceoActivities.map((a) => (a.id === id ? { ...a, ...updates } : a))
    setPlan(updateTodaysPlan({ ceoActivities: next }, plan!.dateKey))
  }

  function toggleDerivatives(id: string) {
    const next = new Set(expandedDerivatives)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedDerivatives(next)
  }

  const totalMinutes = plan.ceoActivities.reduce((sum, a) => sum + a.minutes, 0)

  return (
    <div className="px-7 py-6 space-y-4">
      {/* Founder GPS™ — the full Next Best Move™ → Build Path™ → Build
          Blueprint™ workspace, moved here from My Blueprint so the founder
          acts on it inside the live CEO Workday™ segment. */}
      <FounderGpsWorkspace />

      <div className="rounded-3xl border border-[#E8DFE2] bg-white px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
            Today&apos;s CEO Workday™ Activities
          </p>
          <span
            className={`font-sans text-xs font-semibold ${
              totalMinutes > CEO_WORKDAY_CAP_MINUTES ? "text-[#C13B6B]" : "text-[#6B5860]"
            }`}
          >
            {totalMinutes} / {CEO_WORKDAY_CAP_MINUTES} min
          </span>
        </div>

        {plan.ceoActivities.length === 0 ? (
          <div>
            <p className="font-sans text-sm text-[#3A2E33]">
              You haven&apos;t decided today&apos;s CEO Workday™ activities yet.
            </p>
            <a
              href="/?openSpace=daily-planning-gps"
              className="mt-3 inline-flex items-center rounded-full border border-[#8DAE72]/40 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#F4F7F0]"
            >
              Decide it in Decide & Design™
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {plan.ceoActivities.map((activity) => {
              const classification = classifyAssetBuilding(activity.title)
              const derivatives = activity.status === "complete" ? suggestDerivatives(activity.title) : []
              const buildRecord = activity.readinessCapabilityId ? getBuildRecord(activity.readinessCapabilityId) : null
              const showDerivatives = expandedDerivatives.has(activity.id)

              return (
                <div key={activity.id} className="rounded-2xl bg-white p-4 shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-sm font-semibold text-[#2E1F27]">
                        {activity.title || "Untitled activity"}
                      </p>
                      {activity.definitionOfDone && (
                        <p className="mt-0.5 font-sans text-xs text-[#6B5860]">{activity.definitionOfDone}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-sans text-xs text-[#6B5860]">{activity.minutes} min</span>
                  </div>

                  {classification.buildsAsset ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#8DAE72]/15 px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.12em] text-[#5A7A45]">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Builds an Asset™
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-black/[0.04] px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.12em] text-[#6B5860]/70">
                      {classification.reason}
                    </span>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((opt) => {
                      const selected = activity.status === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => updateActivity(activity.id, { status: opt.value })}
                          className={`rounded-full border px-3 py-1 font-sans text-xs transition-colors ${
                            selected ? STATUS_COLOR[opt.value] : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>

                  {buildRecord && (
                    <p className="font-sans text-xs text-[#6B5860]">
                      Build Record™ status: <span className="font-semibold">{buildRecord.status}</span>
                    </p>
                  )}

                  {derivatives.length > 0 && (
                    <div>
                      <button
                        type="button"
                        aria-expanded={showDerivatives}
                        onClick={() => toggleDerivatives(activity.id)}
                        className="flex items-center gap-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#5A7A45]/80 hover:text-[#5A7A45]"
                      >
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-200 ${showDerivatives ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                        What Else Can This Become?
                      </button>
                      {showDerivatives && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {derivatives.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center rounded-full border border-[#E5E5E5] bg-white px-3 py-1 font-sans text-xs text-[#3A2E33]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <CeoWorkdayCheckins />
      <CeoWorkdayProof />
    </div>
  )
}
