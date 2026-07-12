/**
 * Founder GPS™ — Architecture & Type Surface (Phase 6.0)
 * ---------------------------------------------------------------------------
 * Founder GPS™ is the INTELLIGENCE LAYER of the Harmony Lane™ Operating System.
 *
 * It continuously answers ONE question:
 *   "Based on everything known about this founder, what is the
 *    highest-leverage next step?"
 *
 * Philosophy: Founder GPS™ behaves like Google Maps.
 *   - Never shows every possible route.
 *   - Always says: "This is your next turn."
 *
 * Every recommendation must support at least one of the three GPS Outcomes™:
 *   1. Honor Life's Non-Negotiables™
 *   2. Build Compounding Business Assets™
 *   3. Reduce Execution Friction™
 *
 * ARCHITECTURE ONLY — no recommendation engine this phase.
 *
 * What IS declared here:
 *   - The GpsContext™ type — every signal the GPS will eventually consider.
 *   - The GpsRecommendation™ type — the shape of every future recommendation.
 *   - The GpsInput™ signal registry — what feeds the engine.
 *   - The GpsSignalWeight™ type — how much each signal influences routing.
 *
 * What is NOT implemented this phase:
 *   - Recommendation logic / reasoning
 *   - Dynamic adaptation by Business Model™
 *   - Weekly implementation integration
 *   - AI inference
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { BusinessModelId } from "@/lib/entrepreneur-success/types"
import type { GpsOutcome } from "@/lib/entrepreneur-success/types"
import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"

/* ===========================================================================
 * GPS Context™
 * ---------------------------------------------------------------------------
 * The complete signal set the GPS engine will reason over. All fields are
 * optional — the GPS degrades gracefully when signals are absent, providing
 * the best recommendation available from what is known.
 * ======================================================================== */

export interface GpsContext {
  /**
   * IDENTITY SIGNALS
   * What we know about this founder as a person and operator.
   */
  firstName: string | null
  /** Business Stage™ — lifecycle position. */
  businessStage: BusinessStage | null
  /** Business Model™ — the category of business. */
  businessModel: BusinessModelId | null
  /** Preferred Language™ code. */
  preferredLanguage: string | null

  /**
   * PERFORMANCE SIGNALS
   * How the business is currently performing.
   * Architecture only — no calculations this phase.
   */
  businessPerformance: Partial<BusinessPerformanceSnapshot> | null

  /**
   * ASSESSMENT SIGNALS
   * What assessments tell us about the founder's operating health.
   */
  /** Work-Life Balance Audit™ — overall score (0–100). */
  workLifeBalanceScore: number | null
  /** Entrepreneur Success Score™ — overall score (0–100). */
  entrepreneurSuccessScore: number | null
  /** Weakest pillar from the ESA, by id. */
  weakestEsaPillar: OperatingPillarId | null
  /** Strongest pillar from the ESA, by id. */
  strongestEsaPillar: OperatingPillarId | null

  /**
   * OPERATING SIGNALS
   * How the founder is currently operating day-to-day.
   */
  /** Current Operating Segment™ from the Sunday Design Day™. */
  currentOperatingSegment: string | null
  /** Weekly Intention Declaration™ from Sunday Design Day™. */
  weeklyIntention: string | null
  /** Active Focus Areas from Sunday Design Day™. */
  activeFocusAreas: string[]
  /** Whether Sunday Design Day™ has been installed this week. */
  weekDesigned: boolean

  /**
   * HISTORY SIGNALS
   * What we know from the founder's history on the platform.
   * Architecture only — no tracking this phase.
   */
  /** ISO date of first platform use. */
  memberSince: string | null
  /** Total number of completed assessment cycles. */
  assessmentCyclesCompleted: number
  /** ISO date of last completed ESA. */
  lastEsaDate: string | null
  /** Trend direction since last ESA. */
  esaTrend: "improving" | "declining" | "stable" | null

  /**
   * COMPREHENSION SIGNALS
   * How the founder prefers to receive guidance.
   */
  businessComprehension: string | null
}

/** A point-in-time snapshot of Business Performance™ signals. */
export interface BusinessPerformanceSnapshot {
  revenue: number | null
  profitability: number | null
  cashFlow: "healthy" | "tight" | "critical" | null
  capacity: "available" | "full" | "over" | null
  delegationPercentage: number | null
  customerRetention: number | null
}

/* ===========================================================================
 * GPS Recommendation™
 * ---------------------------------------------------------------------------
 * The shape of every recommendation the GPS engine will produce.
 * One recommendation at a time — never a list of options.
 * ======================================================================== */

export interface GpsRecommendation {
  /** Stable id of the rule that fired. */
  id: string
  /**
   * The single highest-leverage next step, phrased in Cherry Blossom's voice.
   * Example: "Complete your Entrepreneur Success Assessment™"
   */
  nextTurn: string
  /**
   * ONE sentence explaining WHY this is the next turn — traceable to the
   * founder's signals, never invented.
   */
  reason: string
  /** The one action the founder takes. */
  cta: { label: string; href: string }
  /** Which of the three GPS Outcomes™ this recommendation primarily serves. */
  primaryOutcome: GpsOutcome
  /** Secondary outcomes this recommendation supports. */
  secondaryOutcomes: GpsOutcome[]
  /** The Operating Pillar™ this recommendation most directly addresses. */
  targetPillar: OperatingPillarId | null
  /** The founder signals that triggered this recommendation (for traceability). */
  triggeredBy: string[]
  /** Optional: estimated time investment. */
  estimatedTime?: string
  /** Architecture hook for future Business Model™ adaptation. */
  businessModelRelevance: BusinessModelId[] | "all"
  /** Architecture hook for future Business Stage™ adaptation. */
  stageRelevance: BusinessStage[] | "all"
}

/* ===========================================================================
 * GPS Signal Weights™
 * ---------------------------------------------------------------------------
 * When multiple signals are present, the GPS engine weights them to determine
 * the single highest-leverage recommendation. Architecture only — no weighting
 * logic implemented this phase.
 * ======================================================================== */

export type GpsSignalId =
  | "no-esa-completed"
  | "no-wlb-audit-completed"
  | "week-not-designed"
  | "esa-score-critical" // < 40
  | "esa-score-low" // 40–54
  | "wlb-score-critical" // < 40
  | "non-negotiables-at-risk"
  | "weakest-pillar-human-sustainability"
  | "weakest-pillar-strategic-foundation"
  | "weakest-pillar-revenue-engine"
  | "weakest-pillar-operations-systems"
  | "weakest-pillar-financial-intelligence"
  | "cash-flow-critical"
  | "capacity-over"
  | "no-delegation"
  | "launch-stage-no-offer-clarity"
  | "growth-stage-no-systems"

export interface GpsSignalWeight {
  signalId: GpsSignalId
  /** Priority when this signal is active — lower number fires first. */
  priority: number
  /** The outcome this signal most urgently protects. */
  urgentOutcome: GpsOutcome
  /** Human description for documentation and debugging. */
  description: string
  /** Architecture only — no logic reads this yet. */
  status: "architecture"
}

export const GPS_SIGNAL_WEIGHTS: GpsSignalWeight[] = [
  {
    signalId: "non-negotiables-at-risk",
    priority: 1,
    urgentOutcome: "honor-non-negotiables",
    description: "Human Sustainability™ pillar score is critically low — protect the founder first.",
    status: "architecture",
  },
  {
    signalId: "no-esa-completed",
    priority: 2,
    urgentOutcome: "build-compounding-assets",
    description: "No ESA completed — GPS cannot route without a baseline.",
    status: "architecture",
  },
  {
    signalId: "no-wlb-audit-completed",
    priority: 3,
    urgentOutcome: "honor-non-negotiables",
    description: "No Work-Life Balance Audit — human operating baseline unknown.",
    status: "architecture",
  },
  {
    signalId: "week-not-designed",
    priority: 4,
    urgentOutcome: "reduce-execution-friction",
    description: "Sunday Design Day™ not completed — weekly direction unknown.",
    status: "architecture",
  },
  {
    signalId: "cash-flow-critical",
    priority: 5,
    urgentOutcome: "build-compounding-assets",
    description: "Cash flow is critical — revenue engine needs immediate attention.",
    status: "architecture",
  },
  {
    signalId: "capacity-over",
    priority: 6,
    urgentOutcome: "honor-non-negotiables",
    description: "Founder capacity is over limit — delegation or reduction needed.",
    status: "architecture",
  },
  {
    signalId: "weakest-pillar-human-sustainability",
    priority: 7,
    urgentOutcome: "honor-non-negotiables",
    description: "Human Sustainability™ is the weakest ESA pillar.",
    status: "architecture",
  },
  {
    signalId: "weakest-pillar-strategic-foundation",
    priority: 8,
    urgentOutcome: "build-compounding-assets",
    description: "Strategic Foundation™ is the weakest ESA pillar.",
    status: "architecture",
  },
  {
    signalId: "weakest-pillar-revenue-engine",
    priority: 9,
    urgentOutcome: "build-compounding-assets",
    description: "Revenue Engine™ is the weakest ESA pillar.",
    status: "architecture",
  },
  {
    signalId: "weakest-pillar-operations-systems",
    priority: 10,
    urgentOutcome: "reduce-execution-friction",
    description: "Operations & Systems™ is the weakest ESA pillar.",
    status: "architecture",
  },
  {
    signalId: "weakest-pillar-financial-intelligence",
    priority: 11,
    urgentOutcome: "build-compounding-assets",
    description: "Financial Intelligence™ is the weakest ESA pillar.",
    status: "architecture",
  },
]

/* ===========================================================================
 * CEO Workday Assignment Architecture™
 * ---------------------------------------------------------------------------
 * The learning-to-execution loop every future assignment follows.
 * Architecture only — no assignment engine this phase.
 * ======================================================================== */

/**
 * The seven phases of the CEO Workday Assignment Loop™.
 * Every assignment begins with Learn and ends with Improve — creating a
 * compounding spiral rather than a one-time task.
 */
export const CEO_WORKDAY_ASSIGNMENT_PHASES = [
  {
    id: "learn" as const,
    name: "Learn",
    description: "Understand the principle or practice through a Harmony Business Academy™ lesson.",
    ownerSystem: "harmony-business-academy",
  },
  {
    id: "create" as const,
    name: "Create",
    description: "Create the deliverable or asset with the appropriate Executive™.",
    ownerSystem: "executive-leadership-team",
  },
  {
    id: "execute" as const,
    name: "Execute",
    description: "Implement the created asset or practice in the actual business.",
    ownerSystem: "founder",
  },
  {
    id: "leverage" as const,
    name: "Leverage",
    description: "Identify how to multiply the impact of this asset — delegate, automate, or distribute.",
    ownerSystem: "founder-gps",
  },
  {
    id: "measure" as const,
    name: "Measure",
    description: "Track whether the practice is producing the expected outcome.",
    ownerSystem: "business-performance",
  },
  {
    id: "reflect" as const,
    name: "Reflect",
    description: "Cherry Blossom reviews what worked, what didn't, and what to improve.",
    ownerSystem: "cherry-blossom",
  },
  {
    id: "improve" as const,
    name: "Improve",
    description: "Apply the reflection to the next iteration — starting the loop again.",
    ownerSystem: "founder",
  },
] as const
