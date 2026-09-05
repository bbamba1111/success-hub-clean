/**
 * Stage Benchmark Relevance™ + Assessment Cadence — Phase 2B
 * ---------------------------------------------------------------------------
 * ARCHITECTURAL BOUNDARY (do not violate in later phases):
 *
 * This file operates ONLY on Pool A — the ESA / Stage Benchmark capability
 * pool defined in Phase 2A (`practiceId`s like "offer-clarity",
 * "sop-documentation") — using real per-founder evidence from
 * `EsaResults.practiceScores`, which is keyed by the exact same 20
 * `practiceId`s (confirmed by inspection).
 *
 * It NEVER touches Pool B — the Excellence Intelligence capability pool
 * (`ReadinessCapability` ids like "sop", "delegation",
 * `deriveReadinessRelevance()`, `BuildRecord`). No id crosswalk is invented
 * between the two vocabularies. `sop` is not assumed to mean the same thing
 * as `sop-documentation` anywhere in this file.
 *
 * This file DOES reuse the `ReadinessRelevanceStatus` six-state vocabulary
 * from `lib/founder-intelligence/readiness-relevance.ts` — the concept of
 * "priority / relevant / emerging / already-installed / not-yet-relevant /
 * future" is canonical and shared. Only the derivation logic for Pool A is
 * new; the states themselves are imported, not redeclared.
 *
 * SCORE ≠ RELEVANCE (do not violate in later phases):
 * An ESA `practiceScores` percentage measures capability EVIDENCE, not
 * relevance. A `must-have` practice with a low score is a real, high-priority
 * capability gap — it stays `"priority"`, never something invented like
 * "priority++". A `not-yet-relevant` practice with a low score is still
 * `"not-yet-relevant"` — a founder having no evidence for something the
 * registry says doesn't matter yet is not itself a signal to escalate it.
 * The ONLY thing evidence is allowed to do is DOWNGRADE relevance toward
 * `"already-installed"` when the founder demonstrably already has it — never
 * upgrade urgency beyond what the registry's own `CapabilityPriority`
 * declares at this stage.
 */

import { ALL_BUSINESS_STAGES, type BusinessStage } from "@/lib/business-stage/business-stage"
import type { DesiredTeamSizeOption } from "@/lib/founder-destination/types"
import type { TeamSizeOption } from "@/lib/business-context/types"
import type { EsaResults, PracticeScore } from "@/lib/entrepreneur-success/types"
import type { ReadinessRelevanceStatus } from "@/lib/founder-intelligence/readiness-relevance"
import { getBenchmark, getBenchmarksForStage } from "./registry-helpers"
import type { CapabilityPriority, StageBenchmark } from "./types"

/* ===========================================================================
 * Assessment Cadence™
 * ---------------------------------------------------------------------------
 * The layer this phase actually adds on top of relevance: not "is this
 * relevant" (already answered by `ReadinessRelevanceStatus`), but "how often
 * should ESA actively probe this practice." A pure, inspectable mapping —
 * deliberately NOT folded into relevance derivation, so cadence rules can
 * change independently of what "relevant" means.
 * ======================================================================== */

export type AssessmentCadence = "active" | "periodic" | "watch" | "suppressed"

export const ALL_ASSESSMENT_CADENCES: AssessmentCadence[] = ["active", "periodic", "watch", "suppressed"]

/** The canonical, testable relevance → cadence mapping. Exported so callers/fixtures can inspect it directly. */
export const ASSESSMENT_CADENCE_BY_RELEVANCE: Record<ReadinessRelevanceStatus, AssessmentCadence> = {
  priority: "active",
  relevant: "periodic",
  emerging: "watch",
  "already-installed": "suppressed",
  "not-yet-relevant": "suppressed",
  future: "suppressed",
}

export function deriveAssessmentCadence(relevanceStatus: ReadinessRelevanceStatus): AssessmentCadence {
  return ASSESSMENT_CADENCE_BY_RELEVANCE[relevanceStatus]
}

/* ===========================================================================
 * Context modifiers
 * ---------------------------------------------------------------------------
 * Narrow, explicit, and auditable. This is NOT a general "Founder
 * Destination adjusts every practice" mechanism — that would mean inventing
 * founder-destination logic the codebase has not documented for 18 of the 20
 * practices. Instead: exactly one documented modifier, scoped to exactly two
 * practices, firing only when BOTH signals agree. Every application is
 * recorded in `contextModifiers` on the output row, so "no invented
 * influence" is visible and testable, not silent.
 * ======================================================================== */

export type ContextModifierId = "solo-team-defers-people-capabilities"

/** The only two practices this phase allows a context modifier to touch. */
const SOLO_TEAM_MODIFIER_PRACTICE_IDS: readonly string[] = ["hiring-practice", "leadership-development"]

const RELEVANCE_DOWNGRADE_ONE_LEVEL: Partial<Record<ReadinessRelevanceStatus, ReadinessRelevanceStatus>> = {
  priority: "relevant",
  relevant: "emerging",
  emerging: "not-yet-relevant",
}

export interface AppliedContextModifier {
  id: ContextModifierId
  /** The actual input signal that triggered this modifier — auditable, not asserted. */
  signal: string
  /** Plain-language effect of the modifier. */
  effect: string
  fromRelevanceStatus: ReadinessRelevanceStatus
  toRelevanceStatus: ReadinessRelevanceStatus
}

/* ===========================================================================
 * Input contract
 * ---------------------------------------------------------------------------
 * Mirrors `deriveReadinessRelevance()`'s optional-degradation pattern: every
 * signal beyond `businessStage` is optional and the derivation degrades
 * gracefully (no signal = no modifier, not a crash or an invented default).
 * Only the two narrow fields the modifier above actually consumes are pulled
 * from Business Context™ / Founder Destination™ — no speculative wiring of
 * unused fields from either module.
 * ======================================================================== */

export interface StageBenchmarkRelevanceInput {
  businessStage: BusinessStage
  /** Real per-founder ESA evidence, if the founder has completed an assessment. */
  esaResults?: EsaResults | null
  /** Business Context™ team size signal — only field consumed from that module. */
  teamSize?: TeamSizeOption | null
  /** Founder Destination™ desired team size signal — only field consumed from that module. */
  desiredTeamSize?: DesiredTeamSizeOption | null
}

/** ESA evidence threshold above which a benchmark is considered demonstrably already in place. */
const ALREADY_INSTALLED_SCORE_THRESHOLD = 85

/* ===========================================================================
 * Core derivation
 * ======================================================================== */

export interface StageBenchmarkRelevance {
  practiceId: string
  businessStage: BusinessStage
  /** The registry's own priority at this stage — kept visible, unaltered. */
  benchmarkPriority: CapabilityPriority
  relevanceStatus: ReadinessRelevanceStatus
  /** The matched ESA evidence for this practice, or `null` if the founder has no ESA results yet. */
  esaEvidence: PracticeScore | null
  contextModifiers: AppliedContextModifier[]
  /** Plain-language, always derivable from the fields above. */
  reasons: string[]
}

function findEvidence(esaResults: EsaResults | null | undefined, practiceId: string): PracticeScore | null {
  if (!esaResults) return null
  return esaResults.practiceScores.find((score) => score.practiceId === practiceId) ?? null
}

/**
 * Whether this practice becomes must-have or should-have at some LATER stage
 * than `businessStage`, and if so, how many stages away that is. Used only to
 * classify a `not-yet-relevant` benchmark as `"not-yet-relevant"` (one stage
 * away or evidence is genuinely absent from later stages) vs. `"future"`
 * (more than one stage away) — mirroring Pool B's own distance<=1 rule.
 *
 * NOTE: in the current Stage Benchmark Registry™, every practiceId already
 * has a benchmark row at every stage, and `not-yet-relevant` priorities only
 * ever occur at Legacy™ (the terminal stage, with no later stage to look
 * ahead to). So `"future"` does not currently get triggered by real registry
 * data — this is expected and correct, not a bug. The logic below is still
 * written generally so it stays correct if a future benchmark revision ever
 * omits a stage or reintroduces an early not-yet-relevant priority.
 */
function distanceToNextRelevantStage(practiceId: string, businessStage: BusinessStage): number | null {
  const startIndex = ALL_BUSINESS_STAGES.indexOf(businessStage)
  if (startIndex === -1) return null
  for (let i = startIndex + 1; i < ALL_BUSINESS_STAGES.length; i++) {
    const laterStage = ALL_BUSINESS_STAGES[i]
    const laterBenchmark = getBenchmark(practiceId, laterStage)
    if (laterBenchmark && (laterBenchmark.priority === "must-have" || laterBenchmark.priority === "should-have")) {
      return i - startIndex
    }
  }
  return null
}

function classifyBaseRelevance(
  benchmark: StageBenchmark,
  esaEvidence: PracticeScore | null,
): { status: ReadinessRelevanceStatus; reasons: string[] } {
  const reasons: string[] = []

  if (benchmark.priority === "not-yet-relevant") {
    const distance = distanceToNextRelevantStage(benchmark.practiceId, benchmark.businessStage)
    if (distance !== null && distance > 1) {
      reasons.push(
        `Not benchmarked as must-have/should-have until ${distance} stages from now — surfaced as a future architecture hook, not suppressed outright.`,
      )
      return { status: "future", reasons }
    }
    reasons.push(`The Stage Benchmark Registry marks "${benchmark.capability}" as not-yet-relevant at this stage.`)
    return { status: "not-yet-relevant", reasons }
  }

  if (benchmark.priority === "emerging") {
    reasons.push(`Benchmarked as emerging at this stage — early/optional, becomes more important next stage.`)
    return { status: "emerging", reasons }
  }

  // must-have or should-have from here on.
  const baseStatus: ReadinessRelevanceStatus = benchmark.priority === "must-have" ? "priority" : "relevant"
  reasons.push(
    benchmark.priority === "must-have"
      ? `Benchmarked as must-have at this stage — foundational; absence is a real gap.`
      : `Benchmarked as should-have at this stage — strengthens this stage without being foundational yet.`,
  )

  if (esaEvidence && esaEvidence.percentage >= ALREADY_INSTALLED_SCORE_THRESHOLD) {
    reasons.push(
      `ESA evidence shows ${esaEvidence.percentage}% on "${esaEvidence.practiceName}" — score never raises urgency, but a high score here means it's demonstrably already in place.`,
    )
    return { status: "already-installed", reasons }
  }

  if (esaEvidence) {
    reasons.push(
      `ESA evidence shows ${esaEvidence.percentage}% on "${esaEvidence.practiceName}" — below the already-installed threshold, so the registry's own priority stands.`,
    )
  } else {
    reasons.push(`No ESA evidence yet for this practice — the registry's own priority stands.`)
  }

  return { status: baseStatus, reasons }
}

/**
 * Applies the single documented context modifier, if applicable. Returns the
 * unmodified inputs untouched (empty `contextModifiers`, same status) for
 * every practice other than the two explicitly scoped, and whenever either
 * signal is missing or doesn't match `"solo"` — degrades gracefully rather
 * than guessing.
 */
function applyContextModifiers(
  practiceId: string,
  status: ReadinessRelevanceStatus,
  input: StageBenchmarkRelevanceInput,
): { status: ReadinessRelevanceStatus; modifiers: AppliedContextModifier[] } {
  if (!SOLO_TEAM_MODIFIER_PRACTICE_IDS.includes(practiceId)) {
    return { status, modifiers: [] }
  }
  if (input.teamSize !== "solo" || input.desiredTeamSize !== "solo") {
    return { status, modifiers: [] }
  }

  const downgraded = RELEVANCE_DOWNGRADE_ONE_LEVEL[status]
  if (!downgraded) {
    // already-installed / not-yet-relevant / future are not downgraded further.
    return { status, modifiers: [] }
  }

  const modifier: AppliedContextModifier = {
    id: "solo-team-defers-people-capabilities",
    signal: `Business Context teamSize="solo" and Founder Destination desiredTeamSize="solo"`,
    effect: `People-management practice deferred one relevance level since this founder intends to stay solo.`,
    fromRelevanceStatus: status,
    toRelevanceStatus: downgraded,
  }

  return { status: downgraded, modifiers: [modifier] }
}

/** One row per Stage Benchmark™ practice at the founder's current stage — Pool A only. */
export function deriveStageBenchmarkRelevance(input: StageBenchmarkRelevanceInput): StageBenchmarkRelevance[] {
  const benchmarksAtStage = getBenchmarksForStage(input.businessStage)
  return benchmarksAtStage.map((benchmark) => {
    const esaEvidence = findEvidence(input.esaResults, benchmark.practiceId)
    const base = classifyBaseRelevance(benchmark, esaEvidence)
    const { status, modifiers } = applyContextModifiers(benchmark.practiceId, base.status, input)

    const reasons = [...base.reasons]
    if (modifiers.length > 0) {
      reasons.push(...modifiers.map((m) => m.effect))
    }

    return {
      practiceId: benchmark.practiceId,
      businessStage: benchmark.businessStage,
      benchmarkPriority: benchmark.priority,
      relevanceStatus: status,
      esaEvidence,
      contextModifiers: modifiers,
      reasons,
    }
  })
}

/* ===========================================================================
 * Combined output — this phase's actual deliverable
 * ======================================================================== */

export interface StageBenchmarkAttentionRecord extends StageBenchmarkRelevance {
  assessmentCadence: AssessmentCadence
}

/** One attention record per practice, combining relevance + cadence. The phase's actual output shape. */
export function getStageBenchmarkRelevance(input: StageBenchmarkRelevanceInput): StageBenchmarkAttentionRecord[] {
  return deriveStageBenchmarkRelevance(input).map((relevance) => ({
    ...relevance,
    assessmentCadence: deriveAssessmentCadence(relevance.relevanceStatus),
  }))
}
