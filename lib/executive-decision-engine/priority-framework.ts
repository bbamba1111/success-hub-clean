/**
 * Decision Priority Framework™ — Deterministic Priority Hierarchy (Phase 6.2)
 * ---------------------------------------------------------------------------
 * A configurable, registry-driven priority hierarchy.
 *
 * Architecture rules:
 *   - No hardcoded conditionals. Priority evaluation is driven entirely by
 *     this registry and the GPS signal weights in lib/founder-gps/types.ts.
 *   - Tiers are ordered 1 (highest urgency) → 5 (lowest urgency).
 *   - The EDE evaluates tiers top-down. The first tier with at least one
 *     active trigger signal becomes the `activeTier` for that cycle.
 *   - Tier 5 is the default — if no trigger signals fire, the EDE routes to
 *     "learning and optimization" as the baseline recommendation posture.
 *
 * Import pattern:
 *   import { PRIORITY_FRAMEWORK, getActiveTier } from
 *     "@/lib/executive-decision-engine/priority-framework"
 */

import type { PriorityTier, PriorityTierId } from "./types"

/* ===========================================================================
 * The Decision Priority Framework™
 * ======================================================================== */

export const PRIORITY_FRAMEWORK: readonly PriorityTier[] = [
  {
    id: "priority-1-life-safety",
    rank: 1,
    label: "Priority 1 — Life Safety",
    description:
      "Immediate threats to the founder's physical safety, a family member's health, or a life-defining emergency. The operating system suspends all business recommendations and focuses entirely on the founder's human needs.",
    governingPrinciples: [
      "honor-non-negotiables-first",
      "long-term-sustainability-over-short-term-busyness",
      "recommendations-increase-clarity-not-anxiety",
    ],
    items: [
      {
        label: "Medical emergency — founder or immediate family",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Critical family event requiring immediate presence",
        triggerSignals: ["life-defining-event-imminent"],
        status: "architecture",
      },
      {
        label: "Personal safety event",
        triggerSignals: [],
        status: "architecture",
      },
    ],
    primaryOutcomes: ["honor-non-negotiables"],
    status: "architecture",
  },
  {
    id: "priority-2-non-negotiables-at-risk",
    rank: 2,
    label: "Priority 2 — Life Non-Negotiables™ at Risk",
    description:
      "The founder's installed Life Non-Negotiables™ — sleep, health, key relationships, recovery, or Time Freedom™ — are currently being compromised. The EDE elevates non-negotiable protection above all business growth recommendations.",
    governingPrinciples: [
      "honor-non-negotiables-first",
      "protect-zone-of-genius",
      "time-freedom-is-a-performance-indicator",
      "long-term-sustainability-over-short-term-busyness",
    ],
    items: [
      {
        label: "Work-Life Balance™ score critically low (< 40)",
        triggerSignals: ["wlb-score-critical"],
        status: "architecture",
      },
      {
        label: "Human Sustainability™ pillar score critical",
        triggerSignals: ["weakest-pillar-human-sustainability"],
        status: "architecture",
      },
      {
        label: "Life-defining event within 3 days",
        triggerSignals: ["life-defining-event-imminent"],
        status: "architecture",
      },
      {
        label: "No Life Non-Negotiables™ defined",
        triggerSignals: ["no-non-negotiables-defined"],
        status: "architecture",
      },
    ],
    primaryOutcomes: ["honor-non-negotiables"],
    status: "architecture",
  },
  {
    id: "priority-3-business-survival",
    rank: 3,
    label: "Priority 3 — Business Survival",
    description:
      "Immediate threats to business continuity — cash runway, payroll, legal compliance, or critical client relationships at imminent risk. The EDE temporarily suspends growth recommendations and routes entirely to survival stabilization.",
    governingPrinciples: [
      "honor-non-negotiables-first",
      "one-highest-leverage-outcome",
      "prefer-delegate-automate-eliminate",
    ],
    items: [
      {
        label: "Cash runway critically low",
        triggerSignals: ["cash-runway-critical"],
        status: "architecture",
      },
      {
        label: "Payroll at risk",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Legal compliance deadline imminent",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Critical client at immediate risk of loss",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Revenue pipeline critically weak",
        triggerSignals: ["weak-pipeline-validated-offer"],
        status: "architecture",
      },
    ],
    primaryOutcomes: ["build-compounding-assets", "reduce-execution-friction"],
    status: "architecture",
  },
  {
    id: "priority-4-strategic-growth",
    rank: 4,
    label: "Priority 4 — Strategic Business Growth",
    description:
      "The normal operating state for a founder whose non-negotiables are protected and business is stable. The EDE routes toward building Compounding Business Assets™, reducing execution friction, and strengthening the weakest ESA pillar.",
    governingPrinciples: [
      "one-highest-leverage-outcome",
      "build-compounding-assets",
      "reduce-execution-friction-weekly",
      "protect-zone-of-genius",
      "prefer-delegate-automate-eliminate",
    ],
    items: [
      {
        label: "Strengthen weakest Operating Pillar™",
        triggerSignals: [
          "weakest-pillar-strategic-foundation",
          "weakest-pillar-revenue-engine",
          "weakest-pillar-operations-systems",
          "weakest-pillar-financial-intelligence",
          "weakest-pillar-people-leadership",
          "weakest-pillar-client-excellence",
          "weakest-pillar-growth-innovation",
        ],
        status: "architecture",
      },
      {
        label: "Build next Compounding Business Asset™",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Reduce one source of execution friction",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Advance active business growth objective",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Prepare for high-significance life event",
        triggerSignals: ["high-significance-event-soon", "event-requires-preparation"],
        status: "architecture",
      },
    ],
    primaryOutcomes: ["build-compounding-assets", "reduce-execution-friction"],
    status: "architecture",
  },
  {
    id: "priority-5-learning-optimization",
    rank: 5,
    label: "Priority 5 — Learning and Optimization",
    description:
      "The default recommendation posture when no urgent signals are active. The EDE routes toward Academy™ learning connected to implementation, ESA completion, and continuous operating improvement.",
    governingPrinciples: [
      "learning-connects-to-implementation",
      "build-compounding-assets",
      "reduce-execution-friction-weekly",
    ],
    items: [
      {
        label: "Entrepreneur Success Assessment™ not completed",
        triggerSignals: ["no-esa-completed"],
        status: "architecture",
      },
      {
        label: "Academy™ lesson connected to active practice",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "Operating Rules™ review and refinement",
        triggerSignals: [],
        status: "architecture",
      },
      {
        label: "No weekly design completed",
        triggerSignals: ["no-weekly-design"],
        status: "architecture",
      },
      {
        label: "Personal Goals™ not defined",
        triggerSignals: ["no-personal-goals-defined"],
        status: "architecture",
      },
    ],
    primaryOutcomes: ["build-compounding-assets"],
    status: "architecture",
  },
] as const

/* ===========================================================================
 * Lookup helpers
 * ======================================================================== */

/** Retrieve a priority tier by its stable id. */
export function getPriorityTierById(
  id: PriorityTierId
): PriorityTier | undefined {
  return PRIORITY_FRAMEWORK.find((t) => t.id === id)
}

/** Retrieve all tiers ordered by rank (ascending — most urgent first). */
export function getPriorityTiersOrdered(): readonly PriorityTier[] {
  return [...PRIORITY_FRAMEWORK].sort((a, b) => a.rank - b.rank)
}

/**
 * Retrieve the default priority tier — the one the EDE falls back to when
 * no urgent signals are present.
 */
export function getDefaultPriorityTier(): PriorityTier {
  return PRIORITY_FRAMEWORK.find(
    (t) => t.id === "priority-5-learning-optimization"
  )!
}
