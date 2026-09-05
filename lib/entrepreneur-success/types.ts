/**
 * Entrepreneur Success Assessment™ — Shared Type Surface
 * ---------------------------------------------------------------------------
 * The canonical type contracts for the Entrepreneur Success Registry™.
 *
 * Architecture rules:
 *   - NEVER hardcode business-model-specific assumptions in these types.
 *   - NEVER add scoring logic here; scoring lives in scoring.ts.
 *   - Every id referenced here MUST exist in its source registry
 *     (executive-team, advisory-network, academy-registry, etc.).
 *   - All ids are stable — safe for routing, storage, and future AI endpoints.
 *
 * Future phases add adapters / recommendation logic WITHOUT touching this file.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import type { LanguageCode } from "@/lib/i18n/language"

/* ===========================================================================
 * Lifecycle status
 * ======================================================================== */

/**
 * Lifecycle of every ESA object in this registry.
 *
 *   "active"       → built, in use in the assessment & scoring pipeline.
 *   "architecture" → defined, cross-referenced; assessment/scoring deferred.
 *   "deferred"     → intentionally deferred to a future phase.
 */
export type EsaStatus = "active" | "architecture" | "deferred"

/* ===========================================================================
 * Operating Pillars™
 * ---------------------------------------------------------------------------
 * The top-level dimensions of founder operating excellence. Every Pillar owns
 * a set of Operating Practices™ and aligns to at least one Executive™.
 * ======================================================================== */

export type OperatingPillarId =
  | "strategic-foundation"
  | "revenue-engine"
  | "operations-systems"
  | "financial-intelligence"
  | "people-leadership"
  | "client-excellence"
  | "growth-innovation"
  | "human-sustainability"

export interface OperatingPillar {
  /** Stable id — safe for routing, storage, and cross-references. */
  id: OperatingPillarId
  /** Brand name (e.g. "Strategic Foundation™"). */
  name: string
  /** A short positioning line. */
  tagline: string
  /** Description of what excellence in this pillar looks like. */
  description: string
  /**
   * The Harmony Lane™ philosophy statement for this pillar — what a founder
   * with mastery here experiences.
   */
  excellenceStatement: string
  /** Executive Leadership Team™ ids that own this pillar. */
  owningExecutives: string[]
  /** Business Stages™ where this pillar is most prominent (all support all). */
  primaryStages: BusinessStage[]
  status: EsaStatus
}

/* ===========================================================================
 * Operating Practices™
 * ---------------------------------------------------------------------------
 * The individual practices that make up each Pillar. Each practice is assessed
 * by one or more Assessment Questions™.
 * ======================================================================== */

export interface OperatingPractice {
  /** Stable id — safe for routing, storage, and cross-references. */
  id: string
  /** Brand name (e.g. "Offer Clarity™"). */
  name: string
  /** The pillar this practice belongs to. */
  pillarId: OperatingPillarId
  /** A short positioning line. */
  tagline: string
  /** What this practice means for a founder's operating excellence. */
  description: string
  /**
   * The ideal state — what a founder DOING this practice consistently
   * experiences in their business.
   */
  idealState: string
  /**
   * The gap cost — what a founder NOT doing this practice consistently
   * experiences. Used to make results resonant, never punitive.
   */
  gapCost: string
  /** Executive ids best positioned to help with this practice. */
  relatedExecutives: string[]
  /** Advisory Network ids relevant to this practice. */
  relatedAdvisors: string[]
  /** Academy item ids that teach this practice. */
  relatedAcademyItems: string[]
  /** Deliverable ids this practice generates. */
  relatedDeliverables: string[]
  /**
   * Founder GPS™ philosophy alignment — which of the three GPS outcomes this
   * practice most contributes to. Architecture hook; no logic reads this yet.
   */
  gpsAlignment: GpsOutcome[]
  /**
   * Harmony Context™ hooks — future phases use these to adapt emphasis by
   * Business Stage™, Communication Style™, and Language™ WITHOUT redesigning
   * the registry.
   */
  primaryStages: BusinessStage[]
  communicationStyles: CommunicationStyle[]
  supportedLanguages: LanguageCode[]
  status: EsaStatus
}

/* ===========================================================================
 * Assessment Questions™
 * ---------------------------------------------------------------------------
 * Each question maps to exactly one Operating Practice™. The same 5-point
 * scale as the Work-Life Balance Audit™ (Always / Often / Sometimes / Rarely
 * / Never) is used throughout — 100 / 75 / 50 / 25 / 0.
 * ======================================================================== */

export interface AssessmentQuestion {
  /** Stable id — safe for routing, storage, and tracking responses over time. */
  id: string
  /** The Operating Practice™ this question measures. */
  practiceId: string
  /** The Operating Pillar™ (denormalized for performance). */
  pillarId: OperatingPillarId
  /**
   * The question text shown to the founder. Always past-tense ("In the past
   * 30 days, how often…") to align with the 30-day assessment cycle.
   */
  question: string
  /**
   * Optional coaching context shown BELOW the question — Cherry Blossom's
   * voice, explaining WHY this matters without editorializing the answer.
   */
  coachingContext?: string
  /** Display order within the pillar. */
  order: number
  status: EsaStatus
}

/* ===========================================================================
 * Founder GPS™ Outcomes
 * ---------------------------------------------------------------------------
 * The three permanent philosophical outcomes every GPS recommendation supports.
 * Architecture constants — recommendation logic deferred.
 * ======================================================================== */

export type GpsOutcome =
  | "honor-non-negotiables" // Honor Life's Non-Negotiables™
  | "build-compounding-assets" // Build Compounding Business Assets™
  | "reduce-execution-friction" // Reduce Execution Friction™

export interface GpsOutcomeDefinition {
  id: GpsOutcome
  name: string
  tagline: string
  description: string
  examples: string[]
}

/* ===========================================================================
 * Business Models™
 * ---------------------------------------------------------------------------
 * Architecture only — no recommendation logic this phase. Every model id is
 * a stable hook future phases reference for contextual adaptation.
 * ======================================================================== */

export type BusinessModelId =
  | "coaching"
  | "consulting"
  | "agency"
  | "saas"
  | "professional-services"
  | "local-business"
  | "healthcare"
  | "restaurant"
  | "retail"
  | "trades"
  | "construction"
  | "manufacturing"
  | "nonprofit"
  | "membership"
  | "creator"
  | "education"
  | "marketplace"
  | "franchise"
  | "custom"

export interface BusinessModel {
  id: BusinessModelId
  name: string
  description: string
  /** Architecture hook for future adaptation logic. */
  status: EsaStatus
}

/* ===========================================================================
 * Business Performance™
 * ---------------------------------------------------------------------------
 * Architecture only — metrics the platform will eventually track and display.
 * No calculations or rendering this phase.
 * ======================================================================== */

export type BusinessPerformanceMetricId =
  | "revenue"
  | "profitability"
  | "margin"
  | "cash-flow"
  | "runway"
  | "roi"
  | "capacity"
  | "delegation-percentage"
  | "ai-adoption"
  | "customer-retention"
  | "customer-lifetime-value"
  | "customer-acquisition-cost"
  | "pipeline-value"
  | "team-capacity"

export interface BusinessPerformanceMetric {
  id: BusinessPerformanceMetricId
  name: string
  description: string
  /** Leading vs. lagging — affects how GPS weighs the metric. */
  indicatorType: "leading" | "lagging" | "both"
  /** Architecture hook. */
  status: EsaStatus
}

/* ===========================================================================
 * CEO Workday Assignment Architecture™
 * ---------------------------------------------------------------------------
 * Architecture only — the learning-to-execution loop every future assignment
 * will follow. No assignment engine this phase.
 * ======================================================================== */

export type AssignmentPhase = "learn" | "create" | "execute" | "leverage" | "measure" | "reflect" | "improve"

export interface AssignmentArchitecture {
  /** The Operating Practice™ this assignment teaches. */
  practiceId: string
  /** Ordered phases of the assignment loop. */
  phases: AssignmentPhase[]
  /** Executive who owns this assignment. */
  owningExecutiveId: string
  /** Academy item that delivers the learning phase. */
  academyItemId: string
  /** Expected deliverable from the create/execute phase. */
  deliverableId: string
  /** Architecture hook. */
  status: EsaStatus
}

/* ===========================================================================
 * Assessment Result types (computed, never stored raw)
 * ======================================================================== */

export interface PillarScore {
  pillarId: OperatingPillarId
  pillarName: string
  percentage: number
  practiceCount: number
}

export interface PracticeScore {
  practiceId: string
  practiceName: string
  pillarId: OperatingPillarId
  percentage: number
}

export interface EsaResults {
  /** Overall Entrepreneur Success Score™ (0–100). */
  overallScore: number
  /** Score per pillar. */
  pillarScores: PillarScore[]
  /** Score per practice. */
  practiceScores: PracticeScore[]
  /** Raw responses: questionId → response value (0 | 25 | 50 | 75 | 100). */
  responses: Record<string, number>
  /** ISO timestamp of assessment completion. */
  completedAt: string
}
