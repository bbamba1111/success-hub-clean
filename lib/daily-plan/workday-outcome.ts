/**
 * Today's Workday Outcome™ — a deterministic classifier over the SAME
 * Founder GPS™ recommendation fields (`leverageMode`, `primaryOutcome`,
 * `readinessCapabilityId`, `owner`, `executiveDomain`), following the exact
 * pattern of `classifyAssetBuilding` in `asset-classification.ts`. This is
 * NOT a new recommendation engine — it never invents a move, it only labels
 * the ONE move the Founder GPS™ already produced with one of 9 plain
 * outcome-type labels, so the founder can see at a glance what kind of work
 * today's Build actually is.
 *
 * It also extracts the founder's 1–5 PM Build into four progressive-
 * disclosure steps (Clarify → Build → Validate → Finalize) directly from
 * fields the Build Blueprint™ already has — no new copy generation.
 */

import type { GpsRecommendation } from "@/lib/founder-gps/types"
import type { BuildBlueprint } from "@/lib/build-strategy/types"

export type WorkdayOutcomeType =
  | "build-a-capability"
  | "remove-a-bottleneck"
  | "create-an-asset"
  | "delegate-ownership"
  | "create-an-operating-rule"
  | "automate-work"
  | "improve-customer-experience"
  | "improve-workplace"
  | "advance-founder-destination"

const WORKDAY_OUTCOME_LABEL: Record<WorkdayOutcomeType, string> = {
  "build-a-capability": "Build a Capability",
  "remove-a-bottleneck": "Remove a Bottleneck",
  "create-an-asset": "Create an Asset",
  "delegate-ownership": "Delegate Ownership",
  "create-an-operating-rule": "Create an Operating Rule",
  "automate-work": "Automate Work",
  "improve-customer-experience": "Improve Customer Experience",
  "improve-workplace": "Improve Workplace",
  "advance-founder-destination": "Advance Founder Destination",
}

/**
 * Deterministic, priority-ordered mapping from existing GPS recommendation
 * signals to ONE outcome-type label. Only ever returns a single type — the
 * same "one recommendation, one label" philosophy as Founder GPS™ itself.
 */
export function deriveWorkdayOutcomeType(move: GpsRecommendation): { type: WorkdayOutcomeType; label: string } {
  let type: WorkdayOutcomeType

  if (move.destinationAlignment) {
    type = "advance-founder-destination"
  } else if (move.leverageMode === "automate") {
    type = "automate-work"
  } else if (move.leverageMode === "delegate" || move.owner === "team-or-ai") {
    type = "delegate-ownership"
  } else if (move.primaryOutcome === "honor-non-negotiables") {
    type = "improve-workplace"
  } else if (move.executiveDomain?.toLowerCase().includes("customer")) {
    type = "improve-customer-experience"
  } else if (move.readinessCapabilityId && move.leverageMode === "keep") {
    type = "build-a-capability"
  } else if (move.leverageMode === "eliminate") {
    type = "remove-a-bottleneck"
  } else if (move.primaryOutcome === "build-compounding-assets") {
    type = "create-an-asset"
  } else {
    type = "create-an-operating-rule"
  }

  return { type, label: WORKDAY_OUTCOME_LABEL[type] }
}

export type WorkdayBuildStepKind = "clarify" | "build" | "validate" | "finalize"

export interface WorkdayBuildStep {
  kind: WorkdayBuildStepKind
  title: string
  /** Plain-language content for this step — extracted, never generated. */
  items: string[]
}

/**
 * Extracts today's 1–5 PM Build into four expandable steps from fields the
 * Build Blueprint™ / GpsRecommendation already carry. No new content.
 */
export function deriveWorkdayBuildSteps(blueprint: BuildBlueprint, move: GpsRecommendation): WorkdayBuildStep[] {
  const steps: WorkdayBuildStep[] = []

  steps.push({
    kind: "clarify",
    title: "Clarify",
    items: [blueprint.what, blueprint.why, blueprint.currentState].filter(Boolean),
  })

  steps.push({
    kind: "build",
    title: "Build",
    items:
      Array.isArray(move.sequencing) && move.sequencing.length > 0
        ? move.sequencing
        : ["Follow the Build Blueprint™ below for the full plan."],
  })

  steps.push({
    kind: "validate",
    title: "Validate",
    items: [blueprint.targetState, blueprint.desiredOutcome].filter(Boolean),
  })

  steps.push({
    kind: "finalize",
    title: "Finalize",
    items: [
      blueprint.handoffReady ? "Ready to hand off." : "Not yet ready to hand off — keep this with you for now.",
    ],
  })

  return steps
}
