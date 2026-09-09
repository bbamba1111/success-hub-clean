/**
 * Executive Reasoning Rules™ — Deterministic IF…THEN Registry (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The registry of deterministic reasoning rules that govern how the Executive
 * Decision Engine™ modifies or overrides its default priority routing.
 *
 * Architecture rules:
 *   - These rules are evaluated AFTER the Decision Priority Framework™ selects
 *     the active tier. Rules may ELEVATE priority (change the active tier) or
 *     MODIFY the recommendation within the active tier — never both.
 *   - Rules are evaluated in `evaluationPriority` order (ascending).
 *   - When multiple rules fire, all actions are collected. If two actions
 *     conflict, the rule with the lower `evaluationPriority` wins.
 *   - No natural language matching. Conditions reference GPS signal ids only.
 *   - Do NOT create hundreds of rules here. Each rule represents a meaningful,
 *     repeated pattern in founder decision-making — not an edge case.
 *
 * Import pattern:
 *   import { REASONING_RULES, getRulesForSignal } from
 *     "@/lib/executive-decision-engine/reasoning-rules"
 */

import type { ReasoningRule, ReasoningRuleId } from "./types"
import type { GpsSignalId } from "@/lib/founder-gps/types"

/* ===========================================================================
 * Executive Reasoning Rules™
 * ======================================================================== */

export const REASONING_RULES: readonly ReasoningRule[] = [
  // -------------------------------------------------------------------------
  // LIFE PROTECTION RULES (evaluate first — life context governs everything)
  // -------------------------------------------------------------------------
  {
    id: "burnout-critical--reduce-workload",
    label: "Burnout Critical → Reduce Workload",
    condition: {
      description:
        "The founder's Human Sustainability™ pillar score (Entrepreneur Success Assessment™) indicates critical burnout risk. Deliberately keyed on the ESA only — never the Work-Life Balance Audit™, which belongs to the separate Work-Life Balance Operating System™ and is not an Executive Decision Engine™ input.",
      requiredSignals: ["weakest-pillar-human-sustainability"],
      relatedPrinciples: [
        "honor-non-negotiables-first",
        "long-term-sustainability-over-short-term-busyness",
      ],
      additionalContext: [
        "Human Sustainability™ pillar score < 40",
        "Human Sustainability™ is the weakest ESA pillar",
      ],
    },
    action: {
      description:
        "Reduce the complexity and volume of business growth recommendations. Surface one restorative action (rest, delegation, or elimination) before any growth task.",
      primaryOutcome: "honor-non-negotiables",
      targetPriorityTier: "priority-2-non-negotiables-at-risk",
      leverageClass: "eliminate",
    },
    upholdsConstitution: [
      "honor-non-negotiables-first",
      "long-term-sustainability-over-short-term-busyness",
      "recommendations-increase-clarity-not-anxiety",
    ],
    evaluationPriority: 1,
    status: "architecture",
  },
  {
    id: "life-protection-mode--suspend-growth-recommendations",
    label: "Life Protection Mode → Suspend Growth Recommendations",
    condition: {
      description:
        "A life-defining event is within 3 days and the founder is in Life Protection Mode™.",
      requiredSignals: ["life-defining-event-imminent"],
      relatedPrinciples: ["honor-non-negotiables-first", "protect-important-relationships"],
    },
    action: {
      description:
        "Suspend all strategic growth and optimization recommendations. Focus exclusively on protecting the founder's time and presence for the upcoming life event.",
      primaryOutcome: "honor-non-negotiables",
      targetPriorityTier: "priority-2-non-negotiables-at-risk",
    },
    upholdsConstitution: [
      "honor-non-negotiables-first",
      "protect-important-relationships",
      "respect-installed-commitments",
    ],
    evaluationPriority: 2,
    status: "architecture",
  },
  {
    id: "anniversary-approaching--protect-evening",
    label: "Anniversary Approaching → Protect Evening Schedule",
    condition: {
      description:
        "A significant relationship date (anniversary, birthday of close family member) is within 7 days and the founder has available Time Freedom™.",
      requiredSignals: ["high-significance-event-soon"],
      relatedPrinciples: ["protect-important-relationships"],
      additionalContext: [
        "Event is tagged as high or life-defining significance",
        "Event involves a key relationship person",
      ],
    },
    action: {
      description:
        "Surface the upcoming event and suggest one preparation action (reservation, gift, plan). Protect any evening Time Freedom™ hours near the date from business task assignment.",
      primaryOutcome: "honor-non-negotiables",
      leverageClass: "keep",
    },
    upholdsConstitution: [
      "protect-important-relationships",
      "honor-non-negotiables-first",
    ],
    evaluationPriority: 3,
    status: "architecture",
  },
  {
    id: "event-requires-preparation--surface-reminder",
    label: "Event Requires Preparation → Surface Reminder",
    condition: {
      description:
        "An upcoming life event is flagged as requiring preparation (gift, booking, planning) and preparation has not been confirmed.",
      requiredSignals: ["event-requires-preparation"],
      relatedPrinciples: ["protect-important-relationships"],
    },
    action: {
      description:
        "Surface a preparation reminder in the Install My Week™ brief before business assignments are presented.",
      primaryOutcome: "honor-non-negotiables",
    },
    upholdsConstitution: [
      "protect-important-relationships",
      "recommendations-increase-clarity-not-anxiety",
    ],
    evaluationPriority: 4,
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // BUSINESS SURVIVAL RULES
  // -------------------------------------------------------------------------
  {
    id: "cash-runway-critical--elevate-revenue-tasks",
    label: "Cash Runway Critical → Elevate Revenue Tasks",
    condition: {
      description:
        "Cash runway is critically low — the business has fewer than 30 days of operating expenses covered.",
      requiredSignals: ["cash-runway-critical"],
      relatedPrinciples: ["one-highest-leverage-outcome"],
      additionalContext: [
        "BusinessPerformance.cashRunwayDays < 30",
        "Does not override Priority 1 or 2",
      ],
    },
    action: {
      description:
        "Elevate revenue-generating activities to Priority 3 and suppress optimization, learning, and asset-building recommendations until runway is stabilized.",
      primaryOutcome: "build-compounding-assets",
      targetPriorityTier: "priority-3-business-survival",
    },
    upholdsConstitution: [
      "one-highest-leverage-outcome",
      "honor-non-negotiables-first",
    ],
    evaluationPriority: 5,
    status: "architecture",
  },
  {
    id: "weak-pipeline-validated-offer--favor-relationships",
    label: "Weak Pipeline + Validated Offer → Favor Relationships",
    condition: {
      description:
        "The founder's revenue pipeline is weak but their offer is already validated. Creating another product is not the highest-leverage move — relationship-building and opportunity creation is.",
      requiredSignals: ["weak-pipeline-validated-offer"],
      relatedPrinciples: ["one-highest-leverage-outcome", "build-compounding-assets"],
      additionalContext: [
        "Offer has been sold at least once",
        "Pipeline shows fewer than 3 active prospects",
        "Revenue is below target",
      ],
    },
    action: {
      description:
        "Recommend relationship-building and referral-activation activities over new product creation. Route toward the Revenue Engine™ pillar's relationship-based practices.",
      primaryOutcome: "build-compounding-assets",
      targetPriorityTier: "priority-3-business-survival",
      leverageClass: "keep",
    },
    upholdsConstitution: [
      "one-highest-leverage-outcome",
      "build-compounding-assets",
      "prefer-delegate-automate-eliminate",
    ],
    evaluationPriority: 6,
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // EXECUTION OPTIMIZATION RULES
  // -------------------------------------------------------------------------
  {
    id: "task-is-delegable--prefer-delegation",
    label: "Task Is Delegable → Prefer Delegation",
    condition: {
      description:
        "The recommended task or activity can be performed by someone other than the founder without loss of quality or relationship trust.",
      requiredSignals: [],
      relatedPrinciples: [
        "protect-zone-of-genius",
        "prefer-delegate-automate-eliminate",
      ],
      additionalContext: [
        "Task does not require founder's Zone of Genius",
        "Delegation target is available (human team, AI executive, contractor)",
        "Task is not relationship-critical",
      ],
    },
    action: {
      description:
        "Modify the recommendation to present the task as a delegation opportunity rather than a founder execution item. Suggest the appropriate delegation target.",
      primaryOutcome: "reduce-execution-friction",
      leverageClass: "delegate",
    },
    upholdsConstitution: [
      "protect-zone-of-genius",
      "prefer-delegate-automate-eliminate",
      "reduce-execution-friction-weekly",
    ],
    evaluationPriority: 7,
    status: "architecture",
  },
  {
    id: "recurring-activity--prefer-systemization",
    label: "Recurring Activity → Prefer Systemization",
    condition: {
      description:
        "The recommended activity is recurring (happens weekly, monthly, or per client) and has not yet been systemized or automated.",
      requiredSignals: [],
      relatedPrinciples: [
        "reduce-execution-friction-weekly",
        "build-compounding-assets",
      ],
      additionalContext: [
        "Activity appears in more than one operating week",
        "No SOP, template, or automation exists for this activity",
      ],
    },
    action: {
      description:
        "Recommend building a system, SOP, or automation for this activity before simply executing it again. Route toward the Operations & Systems™ pillar.",
      primaryOutcome: "reduce-execution-friction",
      leverageClass: "automate",
    },
    upholdsConstitution: [
      "reduce-execution-friction-weekly",
      "build-compounding-assets",
      "prefer-delegate-automate-eliminate",
    ],
    evaluationPriority: 8,
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // OPERATING HEALTH RULES
  // -------------------------------------------------------------------------
  {
    id: "no-weekly-design--recommend-sunday-ritual",
    label: "No Weekly Design → Recommend Sunday Ritual",
    condition: {
      description:
        "The founder has not completed a Sunday Design Day™ this week and no weekly design is in place.",
      requiredSignals: ["no-weekly-design"],
      relatedPrinciples: [
        "respect-installed-commitments",
        "one-highest-leverage-outcome",
      ],
    },
    action: {
      description:
        "Surface the Sunday Design Day™ as the single highest-leverage recommendation — no other assignment should be presented until the week is designed.",
      primaryOutcome: "reduce-execution-friction",
      targetPriorityTier: "priority-5-learning-optimization",
    },
    upholdsConstitution: [
      "respect-installed-commitments",
      "one-highest-leverage-outcome",
      "recommendations-increase-clarity-not-anxiety",
    ],
    evaluationPriority: 9,
    status: "architecture",
  },
  // Note: the former "wlb-score-critical--flag-sustainability" rule has been
  // removed. It was keyed on the Work-Life Balance Audit™ overall score,
  // which is a Work-Life Balance Operating System™ signal and must never be
  // an Executive Decision Engine™ / Founder GPS™ input. The equivalent
  // business-sustainability concern is already covered by
  // "burnout-critical--reduce-workload" above, keyed on the ESA's Human
  // Sustainability™ pillar.
  {
    id: "no-esa-completed--recommend-assessment",
    label: "No ESA Completed → Recommend Assessment",
    condition: {
      description:
        "The founder has not yet completed the Entrepreneur Success Assessment™, so the EDE is missing critical pillar data.",
      requiredSignals: ["no-esa-completed"],
      relatedPrinciples: ["one-highest-leverage-outcome"],
    },
    action: {
      description:
        "Recommend completing the ESA as the single highest-leverage next step — the GPS cannot determine the optimal pillar-level recommendation without it.",
      primaryOutcome: "build-compounding-assets",
      targetPriorityTier: "priority-5-learning-optimization",
    },
    upholdsConstitution: [
      "one-highest-leverage-outcome",
      "recommendations-increase-clarity-not-anxiety",
    ],
    evaluationPriority: 11,
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // LEARNING RULES
  // -------------------------------------------------------------------------
  {
    id: "learning-not-connected--add-implementation-cta",
    label: "Learning Not Connected → Add Implementation CTA",
    condition: {
      description:
        "A learning recommendation has been surfaced but no connected implementation action has been assigned.",
      requiredSignals: [],
      relatedPrinciples: ["learning-connects-to-implementation"],
      additionalContext: [
        "An Academy™ lesson was recommended without a follow-up assignment",
      ],
    },
    action: {
      description:
        "Always pair any Academy™ learning recommendation with a concrete implementation CTA. Never surface learning in isolation.",
      primaryOutcome: "build-compounding-assets",
      leverageClass: "keep",
    },
    upholdsConstitution: [
      "learning-connects-to-implementation",
      "build-compounding-assets",
    ],
    evaluationPriority: 12,
    status: "architecture",
  },
] as const

/* ===========================================================================
 * Lookup helpers
 * ======================================================================== */

/** Retrieve a reasoning rule by its stable id. */
export function getReasoningRuleById(
  id: ReasoningRuleId
): ReasoningRule | undefined {
  return REASONING_RULES.find((r) => r.id === id)
}

/** Retrieve all rules that are triggered by a given GPS signal. */
export function getRulesForSignal(
  signalId: GpsSignalId
): readonly ReasoningRule[] {
  return REASONING_RULES.filter(
    (r) =>
      r.condition.requiredSignals?.includes(signalId) &&
      r.status === "architecture"
  )
}

/** Retrieve all rules ordered by evaluation priority (ascending). */
export function getReasoningRulesOrdered(): readonly ReasoningRule[] {
  return [...REASONING_RULES].sort(
    (a, b) => a.evaluationPriority - b.evaluationPriority
  )
}

/** Retrieve all rules that uphold a given constitutional principle. */
export function getRulesForPrinciple(
  principleId: ReasoningRule["upholdsConstitution"][number]
): readonly ReasoningRule[] {
  return REASONING_RULES.filter(
    (r) =>
      r.upholdsConstitution.includes(principleId) && r.status === "architecture"
  )
}
