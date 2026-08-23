"use client"

/**
 * Today's Lunch Reset™ card — a checklist of the Nourish/Connect/Move/
 * Reset/Disconnect items the founder chose in Decide & Design™, plus
 * Start/Complete controls. Empty state deep-links back to Decide & Design™.
 */

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { getDateKey, loadTodaysPlan } from "@/lib/daily-plan/storage"
import type { TodaysPlanRecord } from "@/lib/daily-plan/types"

type LunchStatus = "not-started" | "in-progress" | "complete"

export function TodaysLunchCard() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)
  const [status, setStatus] = useState<LunchStatus>("not-started")
  const [checkedOff, setCheckedOff] = useState<Set<string>>(new Set())

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) return null

  if (plan.lunch.length === 0) {
    return (
      <div className="px-7 py-6">
        <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-6 py-5 sm:px-7 sm:py-6">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
            Today&apos;s Lunch Reset
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33]">
            You haven&apos;t decided today&apos;s lunch yet.
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

  function toggleChecked(category: string) {
    const next = new Set(checkedOff)
    if (next.has(category)) next.delete(category)
    else next.add(category)
    setCheckedOff(next)
  }

  return (
    <div className="px-7 py-6">
      <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
          Today&apos;s Lunch Reset
        </p>
        <ul className="space-y-2">
          {plan.lunch.map((item) => {
            const checked = checkedOff.has(item.category)
            return (
              <li key={item.category}>
                <button
                  type="button"
                  aria-pressed={checked}
                  onClick={() => toggleChecked(item.category)}
                  className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-left shadow-sm hover:bg-white/70"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      checked ? "border-[#7FB069] bg-[#7FB069] text-white" : "border-[#7FB069]/40"
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" aria-hidden />}
                  </span>
                  <span className={`font-sans text-sm ${checked ? "text-[#6B5860] line-through" : "text-[#2E1F27]"}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-wrap gap-2 pt-1">
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
