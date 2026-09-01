"use client"

/**
 * Decide & Design Additions™ — Decide → Populate → Execute (Daily Operating
 * Experience rebuild)
 * ---------------------------------------------------------------------------
 * Renders below the existing Decide & Design™ content (identity picker).
 * This is the ONE place the founder decides CEO Workday activities for
 * today — the CEO Workday™ segment reads this same `TodaysPlanRecord` back.
 * No re-entry required later.
 *
 * Plain record-keeping only — no new planner, GPS, or recommendation engine.
 */

import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import {
  getDateKey,
  loadTodaysPlan,
  updateTodaysPlan,
} from "@/lib/daily-plan/storage"
import type { CeoActivity, TodaysPlanRecord } from "@/lib/daily-plan/types"
import { CEO_WORKDAY_CAP_MINUTES } from "@/lib/daily-plan/types"
import { BUILD_PATH_DEFINITIONS } from "@/lib/build-strategy/build-path-registry"
import type { BuildPathId } from "@/lib/build-strategy/types"

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function DecideDesignAdditions() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) {
    return <div className="px-1 py-2 font-sans text-sm text-[#6B5860]">Loading…</div>
  }

  // Narrowed, stable reference — `plan` (useState) isn't narrowed inside the
  // nested function declarations below, but this `const` is.
  const data = plan

  function patch(update: Partial<Omit<TodaysPlanRecord, "dateKey">>) {
    setPlan(updateTodaysPlan(update, data.dateKey))
  }

  // ── CEO Workday activities ───────────────────────────────────────────
  const ceoTotalMinutes = data.ceoActivities.reduce((sum, a) => sum + a.minutes, 0)
  const ceoOverCap = ceoTotalMinutes > CEO_WORKDAY_CAP_MINUTES

  function addCeoActivity() {
    const activity: CeoActivity = {
      id: newId(),
      title: "",
      minutes: 30,
      definitionOfDone: "",
      status: "not-started",
    }
    patch({ ceoActivities: [...data.ceoActivities, activity] })
  }

  function updateCeoActivity(id: string, updates: Partial<CeoActivity>) {
    patch({ ceoActivities: data.ceoActivities.map((a) => (a.id === id ? { ...a, ...updates } : a)) })
  }

  function removeCeoActivity(id: string) {
    patch({ ceoActivities: data.ceoActivities.filter((a) => a.id !== id) })
  }

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          Decide → Populate → Execute
        </p>
        <p className="mt-1 font-sans text-sm text-[#6B5860]">
          Decide your CEO Workday™ activities right here — they&apos;ll be ready and waiting for you when you get
          there.
        </p>
      </div>

      {/* ── CEO Workday activities ───────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Decide Today&apos;s CEO Workday™ Activities
          </p>
          <span
            className={`font-sans text-xs font-semibold ${ceoOverCap ? "text-[#C13B6B]" : "text-[#6B5860]"}`}
          >
            {ceoTotalMinutes} / {CEO_WORKDAY_CAP_MINUTES} min
          </span>
        </div>
        {ceoOverCap && (
          <p className="font-sans text-xs text-[#C13B6B]">
            That&apos;s over your 4-hour CEO Workday™ window — consider trimming, delegating, or deferring something.
          </p>
        )}
        <div className="space-y-3">
          {plan.ceoActivities.map((activity) => (
            <div key={activity.id} className="rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activity.title}
                  onChange={(e) => updateCeoActivity(activity.id, { title: e.target.value })}
                  placeholder="What are you building or doing today?"
                  className="flex-1 rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                />
                <input
                  type="number"
                  min={0}
                  value={activity.minutes}
                  onChange={(e) => updateCeoActivity(activity.id, { minutes: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-20 rounded-lg border border-[#E8DFE2] bg-white px-2 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                  aria-label="Minutes"
                />
                <button
                  type="button"
                  onClick={() => removeCeoActivity(activity.id)}
                  aria-label="Remove activity"
                  className="rounded-full p-1.5 text-[#6B5860]/50 hover:bg-black/[0.04]"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <input
                type="text"
                value={activity.definitionOfDone}
                onChange={(e) => updateCeoActivity(activity.id, { definitionOfDone: e.target.value })}
                placeholder="What does 'done' look like for this?"
                className="w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
              />
              <div className="flex flex-wrap gap-1.5">
                {BUILD_PATH_DEFINITIONS.map((path) => {
                  const selected = activity.buildPathId === path.id
                  return (
                    <button
                      key={path.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        updateCeoActivity(activity.id, {
                          buildPathId: selected ? undefined : (path.id as BuildPathId),
                        })
                      }
                      className={`rounded-full border px-3 py-1 font-sans text-xs transition-colors ${
                        selected
                          ? "border-[#3A2E33] bg-[#3A2E33] text-white"
                          : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                      }`}
                    >
                      {path.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCeoActivity}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#8DAE72]/50 bg-white px-4 py-2 font-sans text-sm text-[#5F7F49] hover:bg-[#F4F7F0]"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add an activity
        </button>
      </div>
    </div>
  )
}
