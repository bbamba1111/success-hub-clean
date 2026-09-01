"use client"

/**
 * Power Down™ — RELEASE / TOMORROW / WIND DOWN. Static reassurance copy
 * plus the founder's own Decide & Design™ notes — no new planning happens
 * here. Ends in the static UNPLUG™ closure banner.
 */

import { useEffect, useState } from "react"
import { getDateKey, loadTodaysPlan } from "@/lib/daily-plan/storage"
import type { TodaysPlanRecord } from "@/lib/daily-plan/types"

export function PowerDownReleaseCard() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) return null

  const { release, tomorrowNote, windDownActivity } = plan.powerDown
  const hasAnyNotes = release || tomorrowNote || windDownActivity

  return (
    <div className="px-7 py-6 space-y-4">
      {!hasAnyNotes ? (
        <div className="rounded-3xl border border-[#8B8FA3]/25 bg-[#F3F4F7] px-6 py-5 sm:px-7 sm:py-6">
          <p className="font-sans text-sm text-[#3A2E33]">
            You haven&apos;t written tonight&apos;s Power Down™ notes yet.
          </p>
          <a
            href={new Date().getDay() === 1 ? "/?openSpace=monday-debrief" : "/?openSpace=daily-planning-gps"}
            className="mt-3 inline-flex items-center rounded-full border border-[#8B8FA3]/30 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#8B8FA3]/10"
          >
            Decide it in Decide & Design™
          </a>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#8B8FA3]/20 bg-[#F3F4F7] px-5 py-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B6F80]">
              Release
            </p>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#2E1F27]">
              {release || "Nothing named to release tonight — that's okay."}
            </p>
          </div>
          <div className="rounded-2xl border border-[#8B8FA3]/20 bg-[#F3F4F7] px-5 py-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B6F80]">
              Tomorrow
            </p>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#2E1F27]">
              {tomorrowNote || "Tomorrow's priority isn't set yet — it will still be there in the morning."}
            </p>
          </div>
          <div className="rounded-2xl border border-[#8B8FA3]/20 bg-[#F3F4F7] px-5 py-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B6F80]">
              Wind Down
            </p>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#2E1F27]">
              {windDownActivity || "Whatever helps your mind slow down tonight."}
            </p>
          </div>
        </div>
      )}

      {/* Static closure banner — no new planning, just the day's honest end. */}
      <div className="rounded-2xl bg-[#2E2F3A] px-5 py-4 text-center">
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          11:00 PM — UNPLUG™
        </p>
        <p className="mt-1 font-sans text-xs text-white/70">
          Business Closed · Screens Off · Devices Away · Day Released
        </p>
      </div>
    </div>
  )
}
