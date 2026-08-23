"use client"

/**
 * Today's Movement™ card — reads the founder's Decide & Design™ choice
 * (`TodaysPlanRecord.movement`) and lets her mark it started/complete.
 * Empty state deep-links back to Decide & Design™, matching the exact
 * pattern `TodaysMoveCard` already uses.
 */

import { useEffect, useState } from "react"
import { getDateKey, loadTodaysPlan } from "@/lib/daily-plan/storage"
import type { TodaysPlanRecord } from "@/lib/daily-plan/types"

type MovementStatus = "not-started" | "in-progress" | "complete"

export function TodaysMovementCard() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)
  const [status, setStatus] = useState<MovementStatus>("not-started")

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) return null

  if (!plan.movement) {
    return (
      <div className="px-7 py-6">
        <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-6 py-5 sm:px-7 sm:py-6">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
            Today&apos;s Movement
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33]">
            You haven&apos;t decided today&apos;s movement yet.
          </p>
          <a
            href="/?openSpace=daily-planning-gps"
            className="mt-3 inline-flex items-center rounded-full border border-[#7FB069]/30 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#7FB069]/10"
          >
            Decide it in Decide & Design™
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="px-7 py-6">
      <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
          Today&apos;s Movement
        </p>
        <p className="font-sans text-lg font-semibold text-[#2E1F27]">{plan.movement.label}</p>
        {plan.movement.note && (
          <p className="font-sans text-sm leading-relaxed text-[#6B5860]">{plan.movement.note}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatus("in-progress")}
            className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              status === "in-progress"
                ? "border-[#7FB069] bg-[#7FB069] text-white"
                : "border-[#7FB069]/30 bg-white text-[#3A2E33] hover:bg-[#7FB069]/10"
            }`}
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => setStatus("complete")}
            className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              status === "complete"
                ? "border-[#5A7A45] bg-[#5A7A45] text-white"
                : "border-[#7FB069]/30 bg-white text-[#3A2E33] hover:bg-[#7FB069]/10"
            }`}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  )
}
