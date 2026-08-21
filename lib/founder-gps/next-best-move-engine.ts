/**
 * Founder GPS™ — Next Best Move™ Engine (Phase 5)
 * ---------------------------------------------------------------------------
 * Activates the dormant `GpsContext → GpsRecommendation` contract declared
 * in `./types` (Phase 6.0, "architecture only — no recommendation engine
 * this phase"). This file is intentionally separate from `./engine.ts`,
 * which is a different, already-live segment-based recommendation system
 * for the daily CEO Workday™ flow — the two are not related and this file
 * does not touch it.
 *
 * The reasoning chain, exactly as documented in `./types`'s Founder GPS
 * Reasoning Pipeline™:
 *
 *   Founder Destination™ + Business Stage™ + ESA + Work-Life Balance™
 *     ↓  buildGpsContext()
 *   GpsContext
 *     ↓  deriveActiveGpsSignals()
 *   GpsSignalId[]
 *     ↓  deriveReadinessRelevance()            (Founder Intelligence™, unchanged)
 *   RelevantReadinessCapability[]
 *     ↓  rankCandidates()                       (Executive Decision Engine™, new)
 *   RankedEdeCandidate[]
 *     ↓  deriveNextBestMove()
 *   ONE GpsRecommendation
 *
 * No new intelligence engine is introduced — this module is strictly the
 * two-hop connector between Founder Intelligence™ and the Executive
 * Decision Engine™ that the architecture was always waiting for.
 *
 * Import pattern:
 *   import { buildGpsContext, deriveNextBestMove } from
 *     "@/lib/founder-gps/next-best-move-engine"
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import type { EsaResults, BusinessModelId, OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { GpsContext, GpsRecommendation, GpsSignalId, BusinessPerformanceSnapshot } from "./types"
import {
  deriveReadinessRelevance,
  type RelevantReadinessCapability,
} from "@/lib/founder-intelligence/readiness-relevance"
import {
  rankCandidates,
  evaluateCandidate,
  evaluateFounderPriority,
  type EdeCandidateInput,
  type RankedEdeCandidate,
} from "@/lib/executive-decision-engine/decision-engine"
import { PRIORITY_FRAMEWORK } from "@/lib/executive-decision-engine/priority-framework"
import type { PriorityTierId } from "@/lib/executive-decision-engine/types"

/* ===========================================================================
 * GpsContext™ assembly
 * ======================================================================== */

/** The practically available signals `buildGpsContext` can assemble today. */
export interface NextBestMoveInput {
  firstName?: string | null
  businessStage: BusinessStage
  businessModel?: BusinessModelId | null
  founderDestination?: FounderDestinationProfile | null
  esaResults?: EsaResults | null
  workLifeBalanceScore?: number | null
  weekDesigned?: boolean
  nonNegotiablesCount?: number
  upcomingLifeEventsCount?: number
  hasEventRequiringPreparation?: boolean
  daysUntilNextSignificantEvent?: number | null
  hasPersonalGoals?: boolean
  activePersonalGoalsCount?: number
  hasRelationships?: boolean
  businessPerformance?: Partial<BusinessPerformanceSnapshot> | null
}

function weakestPillar(esa?: EsaResults | null): OperatingPillarId | null {
  if (!esa || esa.pillarScores.length === 0) return null
  return [...esa.pillarScores].sort((a, b) => a.percentage - b.percentage)[0].pillarId as OperatingPillarId
}

function strongestPillar(esa?: EsaResults | null): OperatingPillarId | null {
  if (!esa || esa.pillarScores.length === 0) return null
  return [...esa.pillarScores].sort((a, b) => b.percentage - a.percentage)[0].pillarId as OperatingPillarId
}

/**
 * Assemble the complete `GpsContext` the Founder GPS™ reasons over. Every
 * field `GpsContext` declares is filled — from real input when available,
 * or a graceful default (matching the type's own "degrades gracefully"
 * contract) when not. No new fields are added.
 */
export function buildGpsContext(input: NextBestMoveInput): GpsContext {
  const daysUntil = input.daysUntilNextSignificantEvent ?? null

  return {
    firstName: input.firstName ?? null,
    businessStage: input.businessStage,
    businessModel: input.businessModel ?? null,
    preferredLanguage: null,
    businessPerformance: input.businessPerformance ?? null,
    workLifeBalanceScore: input.workLifeBalanceScore ?? null,
    entrepreneurSuccessScore: input.esaResults?.overallScore ?? null,
    weakestEsaPillar: weakestPillar(input.esaResults),
    strongestEsaPillar: strongestPillar(input.esaResults),
    currentOperatingSegment: null,
    weeklyIntention: null,
    activeFocusAreas: [],
    weekDesigned: input.weekDesigned ?? false,
    memberSince: null,
    assessmentCyclesCompleted: input.esaResults ? 1 : 0,
    lastEsaDate: input.esaResults?.completedAt ?? null,
    esaTrend: null,
    businessComprehension: null,
    nonNegotiablesCount: input.nonNegotiablesCount ?? 0,
    upcomingLifeEventsCount: input.upcomingLifeEventsCount ?? 0,
    hasEventRequiringPreparation: input.hasEventRequiringPreparation ?? false,
    hasPersonalGoals: input.hasPersonalGoals ?? false,
    activePersonalGoalsCount: input.activePersonalGoalsCount ?? 0,
    hasRelationships: input.hasRelationships ?? false,
    daysUntilNextSignificantEvent: daysUntil,
    inLifeProtectionMode: daysUntil != null && daysUntil <= 3,
  }
}

/* ===========================================================================
 * Active signal derivation
 * ---------------------------------------------------------------------------
 * The piece `GPS_SIGNAL_WEIGHTS` (in `./types`) was always waiting for —
 * a deterministic mapping from `GpsContext` fields to the `GpsSignalId`
 * union already declared there. No new signal ids are introduced.
 * ======================================================================== */

export function deriveActiveGpsSignals(ctx: GpsContext): GpsSignalId[] {
  const signals: GpsSignalId[] = []

  if (ctx.entrepreneurSuccessScore == null) signals.push("no-esa-completed")
  if (ctx.workLifeBalanceScore == null) signals.push("no-wlb-audit-completed")
  if (!ctx.weekDesigned) signals.push("week-not-designed")

  if (ctx.entrepreneurSuccessScore != null) {
    if (ctx.entrepreneurSuccessScore < 40) signals.push("esa-score-critical")
    else if (ctx.entrepreneurSuccessScore <= 54) signals.push("esa-score-low")
  }

  if (ctx.workLifeBalanceScore != null && ctx.workLifeBalanceScore < 40) {
    signals.push("wlb-score-critical")
  }

  if (ctx.nonNegotiablesCount === 0) signals.push("no-non-negotiables-defined")
  if (!ctx.hasPersonalGoals) signals.push("no-personal-goals-defined")
  if (!ctx.hasRelationships) signals.push("no-relationships-defined")

  switch (ctx.weakestEsaPillar) {
    case "human-sustainability":
      signals.push("weakest-pillar-human-sustainability")
      break
    case "strategic-foundation":
      signals.push("weakest-pillar-strategic-foundation")
      break
    case "revenue-engine":
      signals.push("weakest-pillar-revenue-engine")
      break
    case "operations-systems":
      signals.push("weakest-pillar-operations-systems")
      break
    case "financial-intelligence":
      signals.push("weakest-pillar-financial-intelligence")
      break
    default:
      break
  }

  if (ctx.businessPerformance?.cashFlow === "critical") signals.push("cash-flow-critical")
  if (ctx.businessPerformance?.capacity === "over") signals.push("capacity-over")
  if (ctx.businessPerformance?.delegationPercentage === 0) signals.push("no-delegation")

  if (ctx.inLifeProtectionMode) {
    signals.push("life-defining-event-imminent")
  } else if (ctx.daysUntilNextSignificantEvent != null && ctx.daysUntilNextSignificantEvent <= 7) {
    signals.push("high-significance-event-soon")
  }

  if (ctx.hasEventRequiringPreparation) signals.push("event-requires-preparation")

  return signals
}

/* ===========================================================================
 * Next Best Move™
 * ======================================================================== */

/** Executive id → Operating Pillar™ id — a small display crosswalk, matching the pattern already used in `readiness-relevance.ts`. */
const EXECUTIVE_TO_PILLAR_DISPLAY: Partial<Record<string, OperatingPillarId>> = {
  strategy: "strategic-foundation",
  sales: "revenue-engine",
  finance: "financial-intelligence",
  operations: "operations-systems",
  "people-culture": "people-leadership",
  innovation: "growth-innovation",
  "client-success": "client-excellence",
  growth: "growth-innovation",
}

function pillarForExecutive(executiveId: string | null): OperatingPillarId | null {
  if (!executiveId) return null
  return EXECUTIVE_TO_PILLAR_DISPLAY[executiveId] ?? null
}

function tierRankOf(tierId: PriorityTierId): number {
  return PRIORITY_FRAMEWORK.find((t) => t.id === tierId)?.rank ?? 99
}

/** Map a Founder Intelligence™ candidate into the EDE's candidate input shape. */
function toEdeCandidate(r: RelevantReadinessCapability): EdeCandidateInput {
  return {
    id: r.id,
    isDelegable: r.suggestedOwner === "team-or-ai",
    primaryReason: r.whyNow,
    expectedLongTermOutcome: r.capability.expectedOutcome,
    // Readiness capabilities don't declare a GPS Outcome™ directly; a
    // capacity-constrained founder is routed to protect Non-Negotiables™
    // first, otherwise the default is building the compounding asset the
    // capability itself describes.
    prioritizedOutcome: r.capacityConstrained ? "honor-non-negotiables" : "build-compounding-assets",
  }
}

/**
 * Within the top-ranked Priority Tier™, prefer a candidate whose leverage
 * class is NOT "keep" when the founder is capacity-constrained — honoring
 * the Work-Life Balance™ constraint without a second scoring pass.
 */
function pickBestCandidate(
  ranked: RankedEdeCandidate[],
  pool: RelevantReadinessCapability[]
): { ranked: RankedEdeCandidate; capability: RelevantReadinessCapability } | null {
  if (ranked.length === 0) return null
  const byId = new Map(pool.map((r) => [r.id, r]))
  const topTierRank = tierRankOf(ranked[0].activeTier)
  const topTierGroup = ranked.filter((r) => tierRankOf(r.activeTier) === topTierRank)

  const capacityPick = topTierGroup.find((r) => {
    const capability = byId.get(r.candidateId)
    return capability?.capacityConstrained && r.recommendedLeverageClass !== "keep"
  })

  const chosen = capacityPick ?? ranked[0]
  const capability = byId.get(chosen.candidateId)
  return capability ? { ranked: chosen, capability } : null
}

function toRecommendation(
  ranked: RankedEdeCandidate,
  capability: RelevantReadinessCapability,
  activeSignals: GpsSignalId[]
): GpsRecommendation {
  return {
    id: capability.id,
    nextTurn: capability.capability.capability,
    reason: ranked.explainability.primaryReason,
    cta: { label: "View this move", href: `/founder-gps/next-best-move/${capability.id}` },
    primaryOutcome: ranked.primaryOutcome,
    secondaryOutcomes: [],
    targetPillar: pillarForExecutive(capability.owningExecutiveId),
    triggeredBy: activeSignals,
    businessModelRelevance: capability.capability.businessModels,
    stageRelevance: capability.capability.businessStages,
    destinationAlignment: capability.gap.destination ?? undefined,
    readinessCapabilityId: capability.id,
    currentState: capability.gap.current,
    targetState: capability.gap.required,
    expectedOutcome: capability.capability.expectedOutcome,
    executiveDomain: capability.owningExecutiveId,
    owner: capability.suggestedOwner,
    leverageMode: ranked.recommendedLeverageClass,
    sequencing: capability.capability.sequencing,
    confidence: capability.confidence,
    evidence: activeSignals,
    source: "executive-decision-engine",
    workLifeBalanceCompatibility: capability.capacityConstrained
      ? "Chosen because it can be delegated or automated rather than added to your plate."
      : undefined,
    explainability: ranked.explainability,
  }
}

/**
 * The default recommendation posture when no readiness candidate exists yet
 * (e.g. the ESA hasn't been completed). Still produced through the EDE's own
 * Priority 5 default tier — never hardcoded copy.
 */
function fallbackRecommendation(activeSignals: GpsSignalId[]): GpsRecommendation {
  const { tier } = evaluateFounderPriority(activeSignals)
  const item =
    tier.items.find((i) => (i.triggerSignals ?? []).some((s) => activeSignals.includes(s))) ?? tier.items[0]

  const candidate: EdeCandidateInput = {
    id: item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    primaryReason: item.label,
    expectedLongTermOutcome: tier.description,
    prioritizedOutcome: tier.primaryOutcomes[0] ?? "build-compounding-assets",
  }

  const decision = evaluateCandidate(candidate, activeSignals)

  return {
    id: candidate.id,
    nextTurn: item.label,
    reason: decision.explainability.primaryReason,
    cta: { label: "Get started", href: "/founder-gps/next-best-move" },
    primaryOutcome: decision.primaryOutcome,
    secondaryOutcomes: tier.primaryOutcomes.slice(1),
    targetPillar: null,
    triggeredBy: activeSignals,
    businessModelRelevance: "all",
    stageRelevance: "all",
    leverageMode: decision.recommendedLeverageClass,
    confidence: "low",
    evidence: activeSignals,
    source: "executive-decision-engine",
    explainability: decision.explainability,
  }
}

export interface NextBestMoveExtra {
  founderDestination?: FounderDestinationProfile | null
  esaResults?: EsaResults | null
}

/**
 * deriveNextBestMove — the ONE new recommendation surface this phase adds.
 *
 * Pure: (GpsContext, Founder Destination™, ESA results) → GpsRecommendation.
 * Never returns a list — exactly one highest-leverage next turn, matching
 * the Founder GPS™'s own "Google Maps" philosophy declared in `./types`.
 */
export function deriveNextBestMove(ctx: GpsContext, extra?: NextBestMoveExtra): GpsRecommendation {
  const activeSignals = deriveActiveGpsSignals(ctx)
  const businessStage = ctx.businessStage ?? "launch"

  const relevance = deriveReadinessRelevance({
    businessStage,
    founderDestination: extra?.founderDestination ?? null,
    esaResults: extra?.esaResults ?? null,
    workLifeBalanceScore: ctx.workLifeBalanceScore,
  })

  // Case G: never recommend rebuilding something already installed.
  const pool = relevance.filter((r) => r.relevanceStatus !== "already-installed")

  if (pool.length === 0) {
    return fallbackRecommendation(activeSignals)
  }

  const candidates = pool.map(toEdeCandidate)
  const ranked = rankCandidates(candidates, activeSignals)
  const best = pickBestCandidate(ranked, pool)

  if (!best) {
    return fallbackRecommendation(activeSignals)
  }

  return toRecommendation(best.ranked, best.capability, activeSignals)
}
