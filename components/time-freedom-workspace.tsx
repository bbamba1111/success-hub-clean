"use client"

/**
 * TimeFreedomWorkspace — the full contents of the Time Freedom™ design space,
 * rendered inline. Previously this stack lived only inside the "Time Freedom"
 * collapsible of Decide & Design™ (DebriefSpace). It now belongs to the live
 * Time Freedom™ segment of the Work-Life Balance Business Day™ so the founder
 * protects, plans, and celebrates their freedom in the moment it's happening.
 *
 * Contents (top to bottom):
 *   • My Weekly Life Priorities™         (WeeklyLifePrioritiesCard)
 *   • My Time Freedom Declaration™       (TimeFreedomDeclaration)
 *   • Life Events™ — Coming Up           (UpcomingLifeEvents)
 *   • Time Freedom Moments™ community     (TimeFreedomSocial)
 */

import { WeeklyLifePrioritiesCard } from "@/components/decide-design/weekly-priorities-designer"
import { TimeFreedomDeclaration } from "@/components/decide-design/time-freedom-declaration"
import { UpcomingLifeEvents } from "@/components/cherry-blossom/upcoming-life-events"
import { TimeFreedomSocial } from "@/components/time-freedom-social"

export function TimeFreedomWorkspace({ active = true }: { active?: boolean }) {
  return (
    <div className="space-y-5">
      <WeeklyLifePrioritiesCard />
      <TimeFreedomDeclaration />
      <UpcomingLifeEvents />
      <TimeFreedomSocial active={active} />
    </div>
  )
}

export default TimeFreedomWorkspace
