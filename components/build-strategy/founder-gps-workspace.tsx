"use client"

/**
 * CEO Workday™ Workspace — the ONE canonical 4-Hour Focused CEO Workday™.
 *
 * Everything shown here is decided by the founder in Decide & Design™ and
 * populates from that single source of truth:
 *
 *   1. This Week's Three Priorities™ — Weekly Life / Delegation / Operating
 *      Rule Priority™ (Supabase `weekly_commitments`, live via SWR).
 *   2. Today's CEO Workday™ plan — the Day Declaration™ built by "Save My
 *      Day" from What Must Happen Today™, its work items, hour blocks and the
 *      hourly 5-Minute Check-In™ (`CeoWorkdayLivePlan`).
 *
 * Founder GPS™ (`deriveNextBestMove`), Business Articulation Training™, the
 * 12-category selector and the Today's Work™ queue are UNCHANGED as engines
 * and remain reachable from their own surfaces (Build Command Center™,
 * Business Asset Library™). They are intentionally no longer rendered inside
 * the CEO Workday™: the workday shows what the founder decided, not what the
 * system recommends.
 *
 * Mounted by `TodaysCeoWorkdayCard`.
 */

import { WeeklyPrioritiesPanel } from "@/components/ceo-workday/weekly-priorities-panel"
import { CeoWorkdayLivePlan } from "@/components/ceo-workday/ceo-workday-live-plan"

export function FounderGpsWorkspace() {
  return (
    <div className="space-y-6">
      <WeeklyPrioritiesPanel />
      <CeoWorkdayLivePlan />
    </div>
  )
}
