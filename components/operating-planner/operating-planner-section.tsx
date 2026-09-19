"use client"

/**
 * OperatingPlannerSection — the engine-aware wrapper that places the reusable
 * Operating Planner™ BELOW the Dynamic Hero (Phase 3B.1).
 *
 * The hero is orientation only; this is the full-width workspace for the
 * segment currently in session. It reads the shared Operating Engine snapshot
 * and renders the planner for the current block, so the hero and planner can
 * never disagree about "what am I doing right now?".
 *
 * Must render inside <OperatingEngineProvider>.
 */

import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useHarmonyWeek } from "@/components/harmony-week/harmony-week-provider"
import { OperatingPlanner } from "@/components/operating-planner/operating-planner"
import { segmentHasPlanner } from "@/components/operating-planner/planner-config"

export function OperatingPlannerSection() {
  const experience = useOperatingEngine()
  const harmonyWeek = useHarmonyWeek()

  if (!experience) return null

  const blockId = experience.businessDay.current.id

  // Show Space™ for every segment that has one configured.
  // During Time Freedom™ (Thu 5 PM → Mon 7 AM) the CEO Workday block is
  // hidden from the schedule, so it won't be surfaced here either.
  if (!segmentHasPlanner(blockId)) return null

  return (
    // Airy sage/blush watercolor band behind the planner — its own section
    // color. A soft white veil keeps the ultra-light planner card legible
    // while the watercolor edges show through.
    <div
      id="operating-planner"
      className="relative w-full scroll-mt-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/backgrounds/watercolor-sage.png')" }}
    >
      <div className="absolute inset-0 bg-white/72" aria-hidden />
      <div className="relative">
        <OperatingPlanner blockId={blockId} />
      </div>
    </div>
  )
}

export default OperatingPlannerSection
