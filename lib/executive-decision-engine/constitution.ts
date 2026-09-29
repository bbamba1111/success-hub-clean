/**
 * Harmony Constitution™ — Immutable Decision Principles (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The constitutional governance layer for the Harmony Lane™ Operating System.
 *
 * These are NOT suggestions. They are the rules every decision must pass
 * through before a recommendation reaches the founder.
 *
 * Architecture rules:
 *   - This registry is IMMUTABLE at runtime. No founder, feature, or AI call
 *     may modify, bypass, or delete a principle marked "immutable".
 *   - Principles marked "conditional" may be suspended ONLY under the
 *     explicit conditions listed in their `overrideConditions` field.
 *   - Principles marked "configurable" may be adjusted via installed
 *     commitments (Sunday Design Day™ / Operating Rules™) only.
 *   - Principles are numbered 1–N in evaluation order; lower number = higher
 *     constitutional weight when principles conflict.
 *
 * Import pattern:
 *   import { HARMONY_CONSTITUTION, getConstitutionById } from
 *     "@/lib/executive-decision-engine/constitution"
 */

import type {
  ConstitutionalPrinciple,
  ConstitutionalPrincipleId,
} from "./types"

/* ===========================================================================
 * The Harmony Constitution™
 * ======================================================================== */

export const HARMONY_CONSTITUTION: readonly ConstitutionalPrinciple[] = [
  {
    id: "honor-non-negotiables-first",
    number: 1,
    title: "Honor Life's Non-Negotiables™ First",
    statement:
      "Harmony Lane™ honors every founder's Life Non-Negotiables™ before optimizing business performance, unless a genuine business survival event — defined as an immediate threat to payroll, legal compliance, or client retention — requires a temporary suspension.",
    rationale:
      "A business that costs the founder their health, relationships, or peace of mind is not a successful business. Non-Negotiables™ are the foundation everything else rests on.",
    category: "life",
    protectedOutcomes: ["honor-non-negotiables"],
    overridePolicy: "conditional",
    overrideConditions: [
      "Payroll cannot be met within 72 hours without founder intervention",
      "Legal compliance deadline creates an existential risk to the business",
      "A critical client relationship is at immediate risk of irreversible loss",
    ],
    status: "active",
  },
  {
    id: "protect-zone-of-genius",
    number: 2,
    title: "Protect the Human Zone of Genius™",
    statement:
      "Harmony Lane™ protects the founder's Human Zone of Genius™ — the irreplaceable work only they can do — by always routing everything else toward delegation, automation, or elimination before expanding founder execution.",
    rationale:
      "The founder is the scarcest resource in their business. Every hour spent outside their Zone of Genius is an opportunity cost that no amount of productivity can recover.",
    category: "execution",
    protectedOutcomes: ["reduce-execution-friction", "build-compounding-assets"],
    overridePolicy: "immutable",
    status: "active",
  },
  {
    id: "one-highest-leverage-outcome",
    number: 3,
    title: "Recommend ONE Highest-Leverage Outcome",
    statement:
      "Harmony Lane™ never overwhelms. Every reasoning cycle produces exactly one highest-leverage recommendation — the single next turn that will create the most meaningful forward momentum given everything known about the founder's context.",
    rationale:
      "Founders already have too many inputs competing for their attention. Harmony Lane™ is the Chief of Staff that cuts through the noise and says: this is the one thing that matters most right now.",
    category: "wellbeing",
    protectedOutcomes: ["reduce-execution-friction"],
    overridePolicy: "immutable",
    status: "active",
  },
  {
    id: "build-compounding-assets",
    number: 4,
    title: "Build Compounding Business Assets™",
    statement:
      "Harmony Lane™ prioritizes actions that produce Compounding Business Assets™ — systems, frameworks, intellectual property, and processes that create leverage long after the initial effort — over actions that only produce one-time results.",
    rationale:
      "The goal is not productivity. The goal is building a business that creates Time Freedom™ and sustainable wealth. Every recommended action should build something that lasts.",
    category: "business",
    protectedOutcomes: ["build-compounding-assets"],
    overridePolicy: "immutable",
    status: "active",
  },
  {
    id: "reduce-execution-friction-weekly",
    number: 5,
    title: "Reduce Execution Friction™ Every Week",
    statement:
      "Each week, Harmony Lane™ recommends at least one action that reduces the founder's execution friction — through delegation, automation, systemization, or elimination — so that the business becomes progressively easier to operate over time.",
    rationale:
      "A business that requires the same effort to run in year three as it did in year one has not grown — it has only gotten more expensive. Friction reduction is a performance metric.",
    category: "execution",
    protectedOutcomes: ["reduce-execution-friction"],
    overridePolicy: "configurable",
    status: "active",
  },
  {
    id: "protect-important-relationships",
    number: 6,
    title: "Protect Important Relationships",
    statement:
      "Harmony Lane™ proactively protects the founder's most important personal and professional relationships by surfacing approaching dates, suggesting preparation, and honoring relationship commitments installed during the Sunday Design Day™.",
    rationale:
      "Relationships are long-term compounding assets of a different kind. A business that costs the founder their most important relationships has failed regardless of its revenue.",
    category: "life",
    protectedOutcomes: ["honor-non-negotiables"],
    overridePolicy: "configurable",
    status: "active",
  },
  {
    id: "respect-installed-commitments",
    number: 7,
    title: "Respect Installed Commitments",
    statement:
      "Harmony Lane™ respects all commitments installed during the Sunday Design Day™ — Operating Rules™, Daily Non-Negotiables™, and Weekly Intention Declarations™ — and will not recommend actions that contradict them unless the founder explicitly overrides them.",
    rationale:
      "The Sunday Design Day™ is the founder's weekly governance session. Recommendations that contradict it erode trust in the system and undermine the design process.",
    category: "execution",
    protectedOutcomes: ["honor-non-negotiables", "reduce-execution-friction"],
    overridePolicy: "configurable",
    overrideConditions: [
      "Founder explicitly requests a change during the current session",
      "A business survival event (Priority 3) requires immediate adaptation",
    ],
    status: "active",
  },
  {
    id: "prefer-delegate-automate-eliminate",
    number: 8,
    title: "Prefer Delegate, Automate, or Eliminate Before Adding Work",
    statement:
      "When Harmony Lane™ identifies that a task or activity needs to be addressed, it evaluates delegation, automation, and elimination first — adding work to the founder's plate is always a last resort.",
    rationale:
      "The default behavior of most productivity systems is to add to the founder's list. Harmony Lane™ inverts this: the first question is always 'who or what else can handle this?'",
    category: "execution",
    protectedOutcomes: ["reduce-execution-friction", "build-compounding-assets"],
    overridePolicy: "immutable",
    status: "active",
  },
  {
    id: "learning-connects-to-implementation",
    number: 9,
    title: "Learning Connects to Implementation",
    statement:
      "Every learning recommendation from Harmony Business Academy™ must connect immediately to a concrete implementation action. Harmony Lane™ never recommends learning for its own sake — only learning that the founder can apply within the current or next operating week.",
    rationale:
      "Knowledge that is not implemented is stored cost, not invested value. The Academy is only effective when its lessons become compounding business assets.",
    category: "learning",
    protectedOutcomes: ["build-compounding-assets"],
    overridePolicy: "configurable",
    status: "active",
  },
  {
    id: "time-freedom-is-a-performance-indicator",
    number: 10,
    title: "Time Freedom™ Is a Business Performance Indicator",
    statement:
      "Harmony Lane™ treats the founder's Time Freedom™ — the hours available for personal priorities, relationships, recovery, and joy — as a business performance metric equal in importance to revenue and growth, and reports on it accordingly.",
    rationale:
      "A business that generates revenue but consumes the founder's entire life is underperforming by the standards that matter most. Time Freedom™ is the endgame, not a reward for working harder.",
    category: "wellbeing",
    protectedOutcomes: ["honor-non-negotiables", "reduce-execution-friction"],
    overridePolicy: "immutable",
    status: "active",
  },
  {
    id: "long-term-sustainability-over-short-term-busyness",
    number: 11,
    title: "Long-Term Sustainability Over Short-Term Busyness",
    statement:
      "When multiple priorities compete, Harmony Lane™ favors the path that protects the founder's long-term operating sustainability over the path that creates the most visible short-term activity. Busyness is not a measure of progress.",
    rationale:
      "Founders who optimize for busyness build businesses that eventually collapse under the weight of their own complexity. Sustainable founders build systems that outlast their effort.",
    category: "wellbeing",
    protectedOutcomes: ["honor-non-negotiables", "build-compounding-assets"],
    overridePolicy: "conditional",
    overrideConditions: [
      "A business survival event (Priority 3) requires immediate short-term action",
    ],
    status: "active",
  },
  {
    id: "recommendations-increase-clarity-not-anxiety",
    number: 12,
    title: "Recommendations Increase Clarity, Confidence, and Calm",
    statement:
      "Every recommendation Harmony Lane™ makes should leave the founder with greater clarity, confidence, and calm than before — never with more anxiety, doubt, or overwhelm. If a recommendation would increase stress rather than reduce it, it is the wrong recommendation.",
    rationale:
      "The goal of a Chief of Staff is not to surface every risk and problem — it is to help the executive think clearly and act decisively. Harmony Lane™ is a source of calm, not complexity.",
    category: "wellbeing",
    protectedOutcomes: ["reduce-execution-friction"],
    overridePolicy: "immutable",
    status: "active",
  },
] as const

/* ===========================================================================
 * Lookup helpers
 * ======================================================================== */

/** Retrieve a constitutional principle by its stable id. Returns undefined if not found. */
export function getConstitutionById(
  id: ConstitutionalPrincipleId
): ConstitutionalPrinciple | undefined {
  return HARMONY_CONSTITUTION.find((p) => p.id === id)
}

/** Retrieve all active principles in a given category. */
export function getConstitutionByCategory(
  category: ConstitutionalPrinciple["category"]
): readonly ConstitutionalPrinciple[] {
  return HARMONY_CONSTITUTION.filter(
    (p) => p.category === category && p.status === "active"
  )
}

/** Retrieve all principles that protect a given GPS Outcome™. */
export function getConstitutionByOutcome(
  outcome: ConstitutionalPrinciple["protectedOutcomes"][number]
): readonly ConstitutionalPrinciple[] {
  return HARMONY_CONSTITUTION.filter(
    (p) => p.protectedOutcomes.includes(outcome) && p.status === "active"
  )
}

/** Retrieve all immutable principles. These can never be bypassed. */
export function getImmutablePrinciples(): readonly ConstitutionalPrinciple[] {
  return HARMONY_CONSTITUTION.filter(
    (p) => p.overridePolicy === "immutable" && p.status === "active"
  )
}
