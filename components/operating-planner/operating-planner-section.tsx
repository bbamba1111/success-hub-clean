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
import { OperatingPlanner } from "@/components/operating-planner/operating-planner"
import { segmentHasPlanner } from "@/components/operating-planner/planner-config"

export function OperatingPlannerSection() {
  const experience = useOperatingEngine()
  if (!experience) return null

  const blockId = experience.businessDay.current.id
  if (!segmentHasPlanner(blockId)) return null

  return (
    // Wall-to-wall darker leaf-green band behind the planner. The deeper green
    // contrasts with the softer sections below and makes the white planner pop.
    <div id="operating-planner" className="w-full scroll-mt-24 bg-[#4F8B54]">
      <OperatingPlanner blockId={blockId} />
    </div>
  )
}

export default OperatingPlannerSection
