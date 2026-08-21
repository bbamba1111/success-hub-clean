/**
 * Executive Decision Engine™ — Evaluation Engine (Phase 5)
 * ---------------------------------------------------------------------------
 * The first real EDE reasoning function. Everything below is assembled
 * entirely from the existing registries — no new principle, priority tier,
 * reasoning rule, leverage class, or asset is invented here.
 *
 * Reasoning cycle, per candidate:
 *   1. Walk the Decision Priority Framework™ top-down; the first tier with a
 *      matching active `GpsSignalId` becomes the governing tier (falls back
 *      to the Priority 5 default when nothing urgent is active).
 *   2. Collect every Executive Reasoning Rule™ triggered by an active signal,
 *      ordered by `evaluationPriority`.
 *   3. Resolve the candidate's Leverage Class™ — an explicit override wins,
 *      then a fired rule's own `action.leverageClass`, then the ELIMINATE →
 *      AUTOMATE → DELEGATE → KEEP evaluation order applied to the candidate's
 *      own qualifying booleans.
 *   4. Resolve the Business Asset™ the candidate would produce, if any.
 *   5. Build the `DecisionExplainability` record via `buildExplainability()`.
 *
 * `rankCandidates()` is the "priority ranking" Founder GPS™ calls — there is
 * no separate scoring engine; ranking is the priority tier rank, full stop.
 *
 * Import pattern:
 *   import { evaluateCandidate, rankCandidates } from
 *     "@/lib/executive-decision-engine/decision-engine"
 */

import type { GpsSignalId } from "@/lib/founder-gps/types"
import type { GpsOutcome } from "@/lib/entrepreneur-success/types"
import type {
  PriorityTier,
  ReasoningRule,
  LeverageClassId,
  EdeDecisionOutput,
  BusinessAssetId,
} from "./types"
import { PRIORITY_FRAMEWORK, getDefaultPriorityTier } from "./priority-framework"
import { REASONING_RULES } from "./reasoning-rules"
import { LEVERAGE_EVALUATION_ORDER } from "./leverage-framework"
import { getAssetById, getAssetsForPractice } from "./asset-registry"
import { buildExplainability, primarySignal, firedRule as firedRuleEntry } from "./explainability"

/* ===========================================================================
 * Priority resolution
 * ======================================================================== */

/**
 * Resolve the active Priority Tier™ and every Reasoning Rule™ triggered by
 * the given active signals. Pure and deterministic — reads only the two
 * registries, no candidate-specific state.
 */
export function evaluateFounderPriority(activeSignals: GpsSignalId[]): {
  tier: PriorityTier
  firedRules: ReasoningRule[]
} {
  const signalSet = new Set(activeSignals)
  const orderedTiers = [...PRIORITY_FRAMEWORK].sort((a, b) => a.rank - b.rank)

  const tier =
    orderedTiers.find((t) =>
      t.items.some((item) => (item.triggerSignals ?? []).some((s) => signalSet.has(s)))
    ) ?? getDefaultPriorityTier()

  const firedRules = [...REASONING_RULES]
    .filter(
      (rule) =>
        rule.status === "architecture" &&
        (rule.condition.requiredSignals ?? []).some((s) => signalSet.has(s))
    )
    .sort((a, b) => a.evaluationPriority - b.evaluationPriority)

  return { tier, firedRules }
}

/* ===========================================================================
 * Leverage resolution
 * ======================================================================== */

/** The candidate-specific booleans that answer the Leverage Framework's own qualifying questions. */
export interface LeverageCandidateSignals {
  /** Answers ELIMINATE™'s qualifying question: does this still produce value? */
  hasNoValue?: boolean
  /** Answers AUTOMATE™'s qualifying question: does this follow the same steps every time? */
  isRecurring?: boolean
  /** Answers DELEGATE™'s qualifying question: could someone else do this at 80%+ quality? */
  isDelegable?: boolean
}

/**
 * Apply the Leverage Framework's ELIMINATE → AUTOMATE → DELEGATE → KEEP
 * evaluation order to a candidate's own qualifying booleans. Defaults to
 * "keep" — the framework's own default when nothing else qualifies.
 */
export function classifyLeverage(candidate: LeverageCandidateSignals): LeverageClassId {
  for (const classId of LEVERAGE_EVALUATION_ORDER) {
    if (classId === "eliminate" && candidate.hasNoValue) return "eliminate"
    if (classId === "automate" && candidate.isRecurring) return "automate"
    if (classId === "delegate" && candidate.isDelegable) return "delegate"
    if (classId === "keep") return "keep"
  }
  return "keep"
}

/* ===========================================================================
 * Candidate evaluation
 * ======================================================================== */

/** One candidate "next move" the EDE is asked to evaluate. */
export interface EdeCandidateInput extends LeverageCandidateSignals {
  /** Stable id for this candidate — carried through to the ranked output. */
  id: string
  /** Operating Practice™ id this candidate maps to, for Business Asset™ lookup. */
  operatingPracticeId?: string | null
  /** Direct Business Asset™ id, when already known — takes precedence over the practice lookup. */
  targetAssetId?: BusinessAssetId | null
  /** Explicit Leverage Class™ override — wins over any fired rule or qualifying-question result. */
  leverageClassOverride?: LeverageClassId | null
  /** One sentence explaining why this candidate is the recommended move — becomes `primaryReason`. */
  primaryReason: string
  /** Operating Practices™ this candidate strengthens. */
  strengthenedPractices?: string[]
  /** The long-term outcome expected from following this candidate. */
  expectedLongTermOutcome: string
  /** The GPS Outcome™ this candidate most directly serves. */
  prioritizedOutcome: GpsOutcome
}

/**
 * Evaluate a single candidate against the active signal set and produce a
 * complete, explainable `EdeDecisionOutput`.
 */
export function evaluateCandidate(
  candidate: EdeCandidateInput,
  activeSignals: GpsSignalId[]
): EdeDecisionOutput {
  const { tier, firedRules } = evaluateFounderPriority(activeSignals)

  const ruleLeverageOverride = firedRules.find((r) => r.action.leverageClass)?.action.leverageClass
  const recommendedLeverageClass: LeverageClassId =
    candidate.leverageClassOverride ?? ruleLeverageOverride ?? classifyLeverage(candidate)

  const targetAsset =
    (candidate.targetAssetId ? getAssetById(candidate.targetAssetId) ?? null : null) ??
    (candidate.operatingPracticeId
      ? getAssetsForPractice(candidate.operatingPracticeId)[0] ?? null
      : null)

  const suppressGrowthRecommendations =
    tier.id === "priority-1-life-safety" || tier.id === "priority-2-non-negotiables-at-risk"

  const influencingSignals = activeSignals.map((signalId) =>
    primarySignal(signalId, `This signal was active during the current EDE reasoning cycle.`)
  )

  const explainability = buildExplainability({
    primaryReason: candidate.primaryReason,
    influencingSignals,
    appliedPrincipleIds: tier.governingPrinciples,
    principleApplicationNotes: tier.governingPrinciples.map(
      () => `Applied because ${tier.label} is the governing tier this cycle.`
    ),
    firedRules: firedRules.map((r) => firedRuleEntry(r.id, r.action.description)),
    strengthenedPractices: candidate.strengthenedPractices ?? [],
    expectedLongTermOutcome: candidate.expectedLongTermOutcome,
    prioritizedOutcome: candidate.prioritizedOutcome,
    governingTier: tier.id,
  })

  return {
    explainability,
    activeTier: tier.id,
    primaryOutcome: candidate.prioritizedOutcome,
    recommendedLeverageClass,
    recommendedAssignmentId: null,
    satisfiedPrinciples: tier.governingPrinciples,
    principlesAtRisk: firedRules.flatMap((r) => r.upholdsConstitution),
    firedRules: firedRules.map((r) => r.id),
    suppressGrowthRecommendations,
    targetAssetId: targetAsset?.id ?? null,
  }
}

/* ===========================================================================
 * Candidate ranking
 * ======================================================================== */

/** One ranked candidate — the EDE output plus the id that produced it. */
export interface RankedEdeCandidate extends EdeDecisionOutput {
  candidateId: string
}

/**
 * Evaluate every candidate against the same active signal set and rank the
 * results by governing Priority Tier™ rank (ascending — most urgent first).
 * This IS the priority ranking Founder GPS™ consumes; there is no separate
 * scoring engine.
 */
export function rankCandidates(
  candidates: EdeCandidateInput[],
  activeSignals: GpsSignalId[]
): RankedEdeCandidate[] {
  const tierRankById = new Map(PRIORITY_FRAMEWORK.map((t) => [t.id, t.rank]))

  return candidates
    .map((candidate) => ({
      candidateId: candidate.id,
      ...evaluateCandidate(candidate, activeSignals),
    }))
    .sort((a, b) => (tierRankById.get(a.activeTier) ?? 99) - (tierRankById.get(b.activeTier) ?? 99))
}
