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

import { FounderGpsWorkspace } from "@/components/build-strategy/founder-gps-workspace"

export function TodaysCeoWorkdayCard() {
  return (
    <div className="px-7 py-6">
      <FounderGpsWorkspace />
    </div>
  )
}
