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
import type { HarmonyContextSnapshot, OperatingHistorySummary } from "@/lib/harmony-context/engine"

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

/**
 * Phase 6.2 sibling — maps the canonical `HarmonyContextSnapshot` straight
 * to `GpsContext`. The aggregator (`assembleHarmonySnapshot`) already builds
 * a complete, degrades-gracefully `GpsContext` at `intelligence.gpsContext`
 * for exactly this purpose (see `lib/harmony-context/engine.ts`'s "Layer 5 —
 * Intelligence Hooks™" doc comment) — this function is a thin pass-through,
 * not a second implementation. Prefer this over `buildGpsContext()` wherever
 * a `HarmonyContextSnapshot` is already available (e.g. inside
 * `<HarmonyProvider>`); `buildGpsContext()` remains for callers that only
 * have the raw signals.
 */
export function buildGpsContextFromSnapshot(snapshot: HarmonyContextSnapshot): GpsContext {
  return snapshot.intelligence.gpsContext
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
function toEdeCandidate(
  r: RelevantReadinessCapability,
  ctx: Pick<GpsContext, "businessModelProfile" | "businessOperatingFingerprint">,
): EdeCandidateInput {
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
    // Phase 9E — traceability passthrough only (Phase 9D fields on
    // `EdeCandidateInput`). `evaluateCandidate()` does not read these; EDE's
    // ranking logic is untouched.
    businessModelProfile: ctx.businessModelProfile ?? null,
    businessOperatingFingerprint: ctx.businessOperatingFingerprint ?? null,
  }
}

const FOUNDER_DEPENDENT_LEVELS = new Set(["fully-dependent", "mostly-dependent"])

/**
 * Within the top-ranked Priority Tier™, prefer a candidate whose leverage
 * class is NOT "keep" when the founder is capacity-constrained — honoring
 * the Work-Life Balance™ constraint without a second scoring pass.
 *
 * Phase 9E adds one more optional, same-shape tie-break: when the founder's
 * Business Operating Fingerprint™ (falling back to the Business Model
 * Profile™) shows `founderDependency` of `"fully-dependent"` or
 * `"mostly-dependent"`, prefer a top-tier candidate whose ownership
 * `leverageClass` is not `"keep"` — moving the founder toward delegation
 * rather than adding more to what only they can do. Only applied when the
 * capacity tie-break above didn't already pick a candidate.
 */
function pickBestCandidate(
  ranked: RankedEdeCandidate[],
  pool: RelevantReadinessCapability[],
  ctx: Pick<GpsContext, "businessModelProfile" | "businessOperatingFingerprint">,
): { ranked: RankedEdeCandidate; capability: RelevantReadinessCapability } | null {
  if (ranked.length === 0) return null
  const byId = new Map(pool.map((r) => [r.id, r]))
  const topTierRank = tierRankOf(ranked[0].activeTier)
  const topTierGroup = ranked.filter((r) => tierRankOf(r.activeTier) === topTierRank)

  const capacityPick = topTierGroup.find((r) => {
    const capability = byId.get(r.candidateId)
    return capability?.capacityConstrained && r.recommendedLeverageClass !== "keep"
  })

  const founderDependency = ctx.businessOperatingFingerprint?.founderDependency ?? ctx.businessModelProfile?.founderDependency
  const founderDependencyPick =
    !capacityPick && founderDependency && FOUNDER_DEPENDENT_LEVELS.has(founderDependency)
      ? topTierGroup.find((r) => {
          const capability = byId.get(r.candidateId)
          const ownershipLeverageClass = capability?.capability.ownership?.leverageClass
          return ownershipLeverageClass != null && ownershipLeverageClass !== "keep"
        })
      : undefined

  const chosen = capacityPick ?? founderDependencyPick ?? ranked[0]
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
    // Founder GPS™ is read-only intelligence — it never has its own detail
    // page. The CTA hands the founder off to their live 4-Hour CEO Workday™
    // (the "ceo-workday" segment on the home Business Day timeline), where
    // the full Founder GPS™ workspace now lives, using the same
    // `?openSpace=<blockId>` deep-link business-day-schedule.tsx already
    // reads to force-expand and scroll to that segment.
    cta: { label: "View this move", href: "/?openSpace=ceo-workday" },
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

    // Phase 9E — Business Capability Registry™ selection reasoning, all
    // derived from data already computed above; no new copy invented.
    capabilityName: capability.title,
    whyNow: capability.whyNow,
    businessModelFit: capability.businessModelFit,
    stageFit: capability.relevanceStatus === "emerging" ? "build-ahead-of-need" : "current-stage",
    prerequisites: capability.unmetPrerequisites?.length ? capability.unmetPrerequisites : undefined,
    unlocksCapabilities: capability.unlocks?.length ? capability.unlocks : undefined,
    definitionOfDone: capability.capability.expectedOutcome,
    futureWorkplaceAlignment: capability.gap.destination?.includes("future workplace")
      ? capability.gap.destination
      : undefined,
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
    cta: { label: "Get started", href: "/?openSpace=ceo-workday" },
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
  /**
   * Phase 8 — Operating History™ feedback loop. The founder's real, persisted
   * DECIDE→EMBODY→EXECUTE→CHECK-IN execution history (`segment_completions`,
   * already summarized by `getOperatingHistorySummary()` and carried on
   * every `HarmonyContextSnapshot` at `intelligence.operatingHistory`).
   * Purely additive evidence: only ever appends the already-declared
   * `strong-streak-7plus` / `consecutive-completions-3plus` `GpsSignalId`s
   * to `activeSignals` below — it never changes which candidate pool is
   * ranked or how, so a single new completion cannot flip the top-line
   * recommendation on its own.
   */
  operatingHistory?: OperatingHistorySummary | null
  /**
   * Phase 10 — Build Record™ feedback loop. Sourced from
   * `getActiveBuildStatusByCapabilityId()` (`lib/build-record/build-record-store.ts`)
   * and passed straight through to `deriveReadinessRelevance()`, which forces
   * `relevanceStatus = "already-installed"` for any capability with a real,
   * non-terminal build status. Combined with the existing Case G filter
   * below, this is how "GPS does not repeat an in-progress capability" and
   * "an installed capability feeds back into GPS" are satisfied without a
   * second recommendation engine. Absent ⇒ unchanged behavior.
   */
  capabilityBuildStatusById?: Record<string, string> | null
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

  // Phase 8 — Operating History™ feedback loop. Additive only: appends
  // evidence of real execution momentum to `activeSignals` (surfaced in the
  // recommendation's `evidence`/`triggeredBy`) without altering the
  // candidate pool or ranking logic above/below. A single new completion
  // can only ever add a signal here, never remove one or force a different
  // candidate — satisfying "GPS should not blindly change its
  // recommendation every time a segment is completed."
  const history = extra?.operatingHistory
  if (history?.hasHistory) {
    if (history.currentStreak >= 7) activeSignals.push("strong-streak-7plus")
    else if (history.currentStreak >= 3) activeSignals.push("consecutive-completions-3plus")
  }

  const businessStage = ctx.businessStage ?? "launch"

  const relevance = deriveReadinessRelevance({
    businessStage,
    founderDestination: extra?.founderDestination ?? null,
    esaResults: extra?.esaResults ?? null,
    workLifeBalanceScore: ctx.workLifeBalanceScore,
    businessModelProfile: ctx.businessModelProfile ?? null,
    capabilityBuildStatusById: extra?.capabilityBuildStatusById ?? null,
  })

  // Case G: never recommend rebuilding something already installed.
  let pool = relevance.filter((r) => r.relevanceStatus !== "already-installed")

  // Phase 9E — narrow (never empty) the pool toward capabilities that are
  // actually ready to install and that fit the founder's Business Model
  // Profile™. Each filter falls back to the wider pool if it would leave
  // zero candidates — narrowing preference, never a hard requirement.
  const prerequisiteReady = pool.filter((r) => r.prerequisiteSatisfied !== false)
  if (prerequisiteReady.length > 0) pool = prerequisiteReady

  const modelFitPool = pool.filter((r) => r.businessModelFit !== "possible-mismatch")
  if (modelFitPool.length > 0) pool = modelFitPool

  if (pool.length === 0) {
    return fallbackRecommendation(activeSignals)
  }

  const candidates = pool.map((r) => toEdeCandidate(r, ctx))
  const ranked = rankCandidates(candidates, activeSignals)
  const best = pickBestCandidate(ranked, pool, ctx)

  if (!best) {
    return fallbackRecommendation(activeSignals)
  }

  return toRecommendation(best.ranked, best.capability, activeSignals)
}
