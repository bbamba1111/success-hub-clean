/**
 * Founder Digital Twin™ — Type Surface (Phase 11.0)
 * ---------------------------------------------------------------------------
 * Complete type definitions for the Decision Intelligence layer.
 * No runtime logic — pure types only.
 */

// ── Founder Twin Profile ─────────────────────────────────────────────────────

export interface PatternSummary {
  category: string
  strength: string
  description: string
  evidenceCount: number
}

export interface FounderTwinProfile {
  // Snapshot metadata
  generatedAt: string
  platformEngagementDays: number
  /** 0–100 percentage of available context fields that are filled. */
  dataCompleteness: number

  // Business identity snapshot
  businessStage: string | null
  teamSize: string | null
  revenueStage: string | null
  founderRole: string | null
  operatingMode: string | null

  // Capability snapshot (from capability-memory-store)
  masteredTopics: string[]
  deferredTopics: string[]
  topCapabilityDomain: string | null

  // Pattern snapshot (from pattern-recognition-engine)
  confirmedPatterns: PatternSummary[]
  strongestOperatingDay: string | null
  dominantSegment: string | null

  // Operating health snapshot. Deliberately excludes the Work-Life Balance
  // Audit™ score — it belongs to the separate Work-Life Balance Operating
  // System™, not the Business Builder™/Founder GPS™ digital twin.
  entrepreneurSuccessScore: number | null
  hasMomentum: boolean
  consecutiveCompletions: number
  recentWin: string | null

  // Behavioral snapshot (derived from GPS history)
  completionRate90d: number // 0–100
  skipRate90d: number       // 0–100
  averageConfidence: number // 0–100

  // Life context snapshot
  inLifeProtectionMode: boolean
  activePersonalGoalsCount: number
  nonNegotiableCommitmentsCount: number
}

// ── Scenario ─────────────────────────────────────────────────────────────────

export type ScenarioTopicId =
  | "hire-now-vs-later"
  | "launch-now-vs-wait"
  | "build-new-offer-vs-improve-existing"
  | "delegate-vs-retain"
  | "invest-in-ai-vs-manual"
  | "protect-ceo-workday-vs-add-meetings"
  | "create-asset-vs-one-time-work"
  | "increase-prices-vs-volume"
  | "expand-team-vs-improve-systems"
  | "custom"

export interface ScenarioOption {
  id: "option-a" | "option-b"
  label: string
  description: string
}

export interface Scenario {
  id: string
  topicId: ScenarioTopicId
  title: string
  question: string
  optionA: ScenarioOption
  optionB: ScenarioOption
  createdAt: string
}

// ── Impact Dimensions ─────────────────────────────────────────────────────────

export type ImpactDimensionId =
  | "strategic-progress"
  | "revenue-growth"
  | "founder-capacity"
  | "time-freedom"
  | "business-asset-growth"
  | "executive-capability"
  | "team-readiness"
  | "financial-health"
  | "whole-life-harmony"

export interface ImpactScore {
  dimensionId: ImpactDimensionId
  label: string
  /** -2 (significant negative) → 0 (neutral) → +2 (significant positive) */
  scoreA: number
  scoreB: number
  rationale: string
}

// ── Executive Perspective ─────────────────────────────────────────────────────

export interface ExecutivePerspective {
  executiveId: string
  executiveName: string
  executiveTitle: string
  department: string
  analysisA: string
  analysisB: string
  recommendation: "option-a" | "option-b" | "context-dependent"
  recommendationRationale: string
  keyConsiderations: string[]
}

// ── Confidence & Evidence ─────────────────────────────────────────────────────

export interface ScenarioEvidence {
  type: "historical-pattern" | "executive-finding" | "harmony-memory" | "business-context" | "capability"
  description: string
  relevance: "primary" | "supporting" | "contextual"
}

export interface ScenarioConfidence {
  overallConfidence: number
  evidenceStrength: "strong" | "moderate" | "limited" | "insufficient"
  supportingEvidence: ScenarioEvidence[]
  keyAssumptions: string[]
  unknownVariables: string[]
  transparencyNote: string
}

// ── Asset Opportunity ─────────────────────────────────────────────────────────

export interface AssetOpportunity {
  assetName: string
  relevantOption: "option-a" | "option-b" | "both"
  description: string
}

// ── Scenario Analysis ─────────────────────────────────────────────────────────

export interface ScenarioAnalysis {
  scenarioId: string
  generatedAt: string
  twinProfile: FounderTwinProfile

  executivePerspectives: ExecutivePerspective[]
  impactScores: ImpactScore[]

  advantagesA: string[]
  advantagesB: string[]
  risksA: string[]
  risksB: string[]
  tradeoffs: string[]

  assetOpportunities: AssetOpportunity[]

  wholeLifeImplicationsA: string
  wholeLifeImplicationsB: string
  capabilityImpactA: string
  capabilityImpactB: string
  estimatedTimeHorizonA: string
  estimatedTimeHorizonB: string

  confidence: ScenarioConfidence
  /** 3–4 sentence Cherry Blossom synthesis. Projections, not guarantees. */
  executiveSummary: string
}

// ── Decision Record ───────────────────────────────────────────────────────────

export type DecisionOutcome = "committed" | "deferred" | "reconsidering" | "abandoned"

export interface DecisionRecord {
  id: string
  scenarioId: string
  scenarioTitle: string
  optionChosen: "option-a" | "option-b" | null
  optionChosenLabel: string | null
  alternativesConsidered: string[]
  expectedOutcome: string
  actualOutcome: string | null
  lessonsLearned: string | null
  unexpectedVariables: string | null
  businessImpact: string | null
  wholeLifeImpact: string | null
  reflection: string | null
  status: DecisionOutcome
  decidedAt: string
  reviewedAt: string | null
}

// ── Foresight Signal ──────────────────────────────────────────────────────────

export interface ForesightSignal {
  id: string
  type: "opportunity" | "readiness-gap" | "timing-window" | "risk-ahead"
  title: string
  description: string
  evidenceBasis: string
  suggestedAction: string
  confidence: number
  expiresAt: string | null
}
