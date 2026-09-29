"use client"

/**
 * Today's CEO Workday™ card — the simple front door: "What should I work
 * on today?" Founder GPS™'s Next Best Move™ → Build This Today → Start
 * Building (`FounderGpsWorkspace`) is the entire visible surface. The old
 * manual multi-activity checklist (its own status buttons, running 4-hour
 * minute tracker, and "Builds an Asset™" classification), the hourly
 * check-ins, and the 4:55 PM closeout are intentionally no longer shown
 * here — none of that data or logic was deleted (`lib/daily-plan/*`,
 * `CeoWorkdayCheckins`, `CeoWorkdayProof` all still exist and still work),
 * it just isn't part of the CEO Workday's simplified front door anymore.
 */

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { FounderGpsWorkspace } from "@/components/build-strategy/founder-gps-workspace"
import { getWeekKey, loadWeek } from "@/lib/wlbb-week/storage"
import { getEgaEntriesByStatus } from "@/lib/ega/ega-storage"
import type { EgaEntry } from "@/lib/ega/types"

export function TodaysCeoWorkdayCard() {
  const [bottlenecks, setBottlenecks] = useState<EgaEntry[]>([])

  useEffect(() => {
    const week = loadWeek(getWeekKey())
    const ids = week.business.bottleneckEgaEntryIds
    if (ids.length === 0) return
    getEgaEntriesByStatus("open").then((entries) => {
      setBottlenecks(entries.filter((e) => ids.includes(e.id)))
    })
  }, [])

  return (
    <div className="px-7 py-6 space-y-4">
      {bottlenecks.length > 0 && (
        <div className="rounded-3xl border border-[#C0545A]/25 bg-[#FDF8F5] px-6 py-4 sm:px-7">
          <div className="mb-1.5 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#C0545A]" aria-hidden />
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
              This Week&apos;s Bottlenecks
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {bottlenecks.map((entry) => (
              <li
                key={entry.id}
                className="inline-flex items-center rounded-full bg-white px-3 py-1 font-sans text-xs text-[#3A2E33] shadow-sm"
              >
                {entry.gap || entry.signal}
              </li>
            ))}
          </ul>
        </div>
      )}
      <FounderGpsWorkspace />
    </div>
  )
}
