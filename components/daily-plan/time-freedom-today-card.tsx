"use client"

/**
 * Time Freedom™ ledger — "5 Hours Of Time Freedom™": the allocations the
 * founder decided in Decide & Design™, editable in place, framed as "what
 * will you make time for more of" — no scores, no productivity language.
 */

import { useEffect, useState } from "react"
import { getDateKey, loadTodaysPlan, updateTodaysPlan } from "@/lib/daily-plan/storage"
import type { TimeFreedomAllocation, TodaysPlanRecord } from "@/lib/daily-plan/types"
import { TIME_FREEDOM_CAP_MINUTES } from "@/lib/daily-plan/types"

export function TimeFreedomTodayCard() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) return null

  function updateAllocation(id: string, updates: Partial<TimeFreedomAllocation>) {
    const next = plan!.timeFreedom.map((a) => (a.id === id ? { ...a, ...updates } : a))
    setPlan(updateTodaysPlan({ timeFreedom: next }, plan!.dateKey))
  }

  const totalMinutes = plan.timeFreedom.reduce((sum, a) => sum + a.minutes, 0)
  const remaining = TIME_FREEDOM_CAP_MINUTES - totalMinutes

  return (
    <div className="px-7 py-6">
      <div className="rounded-3xl border border-[#E8A24C]/25 bg-[#FBF3E6] px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#B47A2E]">
            5 Hours Of Time Freedom™
          </p>
          <span className="font-sans text-xs font-semibold text-[#6B5860]">
            {remaining >= 0 ? `${remaining} min remaining` : `${Math.abs(remaining)} min over`}
          </span>
        </div>
        <p className="font-sans text-sm text-[#3A2E33]">What will you make time for more of, tonight?</p>

        {plan.timeFreedom.length === 0 ? (
          <div>
            <p className="font-sans text-sm text-[#6B5860]">
              You haven&apos;t decided what to make time for yet.
            </p>
            <a
              href={new Date().getDay() === 1 ? "/?openSpace=monday-debrief" : "/?openSpace=daily-planning-gps"}
              className="mt-3 inline-flex items-center rounded-full border border-[#E8A24C]/40 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#E8A24C]/10"
            >
              Decide it in Decide & Design™
            </a>
          </div>
        ) : (
          <ul className="space-y-2">
            {plan.timeFreedom.map((allocation) => (
              <li key={allocation.id} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <span className="rounded-full bg-[#E8A24C]/15 px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.12em] text-[#B47A2E]">
                  {allocation.category}
                </span>
                <input
                  type="text"
                  value={allocation.label}
                  onChange={(e) => updateAllocation(allocation.id, { label: e.target.value })}
                  className="flex-1 rounded-lg border-none bg-transparent font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#E8A24C]/30"
                />
                <input
                  type="number"
                  min={0}
                  value={allocation.minutes}
                  onChange={(e) =>
                    updateAllocation(allocation.id, { minutes: Math.max(0, Number(e.target.value) || 0) })
                  }
                  aria-label="Minutes"
                  className="w-16 rounded-lg border border-[#E8DFE2] bg-white px-2 py-1 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#E8A24C]/30"
                />
                <span className="font-sans text-xs text-[#6B5860]">min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
