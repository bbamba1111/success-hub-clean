"use client"

/**
 * CEO Workday™ hourly check-ins — four short, time-gated prompts (1:55,
 * 2:55, 3:55, 4:55 PM), purpose-built and intentionally tiny. This is NOT
 * the `GuidedMoments` engine — that's coupled to chip-select + borrow/defer
 * review, a different shape than four short free-text prompts — but it
 * reuses the same time-gating convention (`availableAt`-style gate + a
 * periodic re-render tick) established in `guided-moments.tsx` so each
 * check-in unlocks on its own without the founder refreshing.
 */

import { useEffect, useState } from "react"
import { Check, Lock } from "lucide-react"
import { getDateKey, loadTodaysPlan, updateTodaysPlan } from "@/lib/daily-plan/storage"
import type { TodaysPlanRecord, WorkdayCheckIn } from "@/lib/daily-plan/types"

const CHECKIN_DEFINITIONS: { hour: WorkdayCheckIn["hour"]; label: string; question: string }[] = [
  { hour: "1:55", label: "1:55 PM", question: "How's the build going so far?" },
  { hour: "2:55", label: "2:55 PM", question: "Anything blocking you right now?" },
  { hour: "3:55", label: "3:55 PM", question: "Still on track to finish by 5 PM?" },
  { hour: "4:55", label: "4:55 PM", question: "One line before you close out — where does this stand?" },
]

/** True once the local clock has passed the given hour:minute today. */
function isAvailable(now: Date, hourMinute: WorkdayCheckIn["hour"]): boolean {
  const [h, m] = hourMinute.split(":").map(Number)
  const target = new Date(now)
  target.setHours(h + 12, m, 0, 0) // check-ins are all PM hours
  return now.getTime() >= target.getTime()
}

export function CeoWorkdayCheckins() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [, forceTick] = useState(0)

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  // Re-render every 30s so check-ins unlock on their own as the clock passes.
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 30_000)
    return () => clearInterval(interval)
  }, [])

  if (!plan) return null

  const answeredByHour = new Map(plan.ceoWorkdayCheckIns.map((c) => [c.hour, c]))
  const now = new Date()

  function handleSave(hour: WorkdayCheckIn["hour"]) {
    const response = (drafts[hour] ?? "").trim()
    if (!response) return
    const checkIn: WorkdayCheckIn = { hour, answeredAt: new Date().toISOString(), response }
    const next = [...plan!.ceoWorkdayCheckIns.filter((c) => c.hour !== hour), checkIn]
    setPlan(updateTodaysPlan({ ceoWorkdayCheckIns: next }, plan!.dateKey))
    setDrafts((prev) => ({ ...prev, [hour]: "" }))
  }

  return (
    <div className="rounded-3xl border border-[#E8DFE2] bg-white px-6 py-5 sm:px-7 sm:py-6 space-y-3">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]">
        Hourly Check-Ins
      </p>

      <div className="space-y-2.5">
        {CHECKIN_DEFINITIONS.map(({ hour, label, question }) => {
          const answered = answeredByHour.get(hour)
          const available = isAvailable(now, hour)

          if (answered) {
            return (
              <div
                key={hour}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[#8DAE72]/30 bg-[#8DAE72]/[0.06] px-4 py-3"
              >
                <div>
                  <p className="font-sans text-xs font-semibold text-[#5A7A45]">{label}</p>
                  <p className="mt-0.5 font-sans text-sm text-[#2E1F27] text-pretty">{answered.response}</p>
                </div>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5A7A45] text-white">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
              </div>
            )
          }

          if (!available) {
            return (
              <div
                key={hour}
                className="flex items-center gap-2 rounded-2xl border border-dashed border-[#E8DFE2] px-4 py-3 opacity-60"
              >
                <Lock className="h-3.5 w-3.5 shrink-0 text-[#6B5860]" aria-hidden />
                <p className="font-sans text-xs text-[#6B5860]">Opens at {label}</p>
              </div>
            )
          }

          return (
            <div key={hour} className="rounded-2xl border border-[#E8DFE2] px-4 py-3.5 space-y-2">
              <p className="font-sans text-xs font-semibold text-[#2E1F27]">
                {label} — {question}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={drafts[hour] ?? ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [hour]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSave(hour)
                  }}
                  placeholder="Quick answer…"
                  aria-label={question}
                  className="flex-1 rounded-full border border-[#E8DFE2] px-4 py-2 font-sans text-sm text-[#2E1F27] outline-none focus:border-[#C13B6B]/50"
                />
                <button
                  type="button"
                  onClick={() => handleSave(hour)}
                  disabled={!(drafts[hour] ?? "").trim()}
                  className="shrink-0 rounded-full bg-[#C13B6B] px-4 py-2 font-sans text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
