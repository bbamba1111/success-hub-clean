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
    // Wall-to-wall white band behind the planner, so the ultra-light soft sage
    // planner card reads as a calm, distinct surface resting on white.
    <div id="operating-planner" className="w-full scroll-mt-24 bg-white">
      <OperatingPlanner blockId={blockId} />
    </div>
  )
}

export default OperatingPlannerSection
