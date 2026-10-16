/**
 * Business Capability Maturity™ — Shared Type Surface (Phase 1)
 * ---------------------------------------------------------------------------
 * The canonical definition of what a business capability should look like at
 * each Business Stage™. This is the intelligence FOUNDATION every later
 * phase (ESA, Business Context™, Founder Destination™, Founder GPS™, Build
 * Blueprint™, 4-Hour Focused CEO Workday™) will consume — it does not itself
 * assess a founder, recommend anything, or render UI.
 *
 * ARCHITECTURE RULES (do not violate in later phases):
 *   - Business Stage™ is reused as-is from `lib/business-stage/business-stage`
 *     (Launch™ / Growth™ / Scale™ / Legacy™). There is NO second stage
 *     taxonomy. "Start/Grow/Scale" does not exist in this codebase.
 *   - Business Area is reused as-is from the existing ESA Operating Pillar™
 *     ids (`lib/entrepreneur-success/types`). No new pillar/section names.
 *   - OWN™ is reused as-is from `BuildPathId`
 *     (`lib/build-strategy/types`) — the same 8 execution models
 *     (I'll Build It™ / Build It With Me™ / AI Builds It™ / Delegate™ /
 *     Hire™ / Outsource™ / Buy™ / Partner™). No new ownership vocabulary.
 *   - Business Stage answers "where is the business." Capability Maturity
 *     answers "what should be true here, and is it missing." These are
 *     deliberately different axes — never collapse them into one field.
 *   - `CapabilityReadinessState` (this file) is NOT the same concept as
 *     `ReadinessRelevanceStatus` in `lib/founder-intelligence/readiness-relevance.ts`.
 *     That type answers "should Founder GPS™ surface this now" (a
 *     recommendation-relevance question). This type answers "how mature is
 *     this capability today" (a capability-maturity question). Both may
 *     coexist and will be reconciled by name, not merged, in a later phase.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { BuildPathId } from "@/lib/build-strategy/types"

/* ===========================================================================
 * The six Business Capability Maturity™ dimensions
 * ======================================================================== */

/**
 * The six dimensions every capability is evaluated through. These are
 * dimensions of maturity, NOT stages, NOT a checklist to "complete."
 */
export type CapabilityDimension = "know" | "show" | "build" | "own" | "prove" | "measure"

/** Every dimension, in the order a founder naturally moves through them. */
export const ALL_CAPABILITY_DIMENSIONS: CapabilityDimension[] = [
  "know",
  "show",
  "build",
  "own",
  "prove",
  "measure",
]

export interface CapabilityDimensionDefinition {
  id: CapabilityDimension
  /** Brand name (e.g. "Know™"). */
  name: string
  /** The question this dimension answers for a founder. */
  question: string
  /** A short description of what this dimension evaluates. */
  description: string
}

export const CAPABILITY_DIMENSIONS: CapabilityDimensionDefinition[] = [
  {
    id: "know",
    name: "Know™",
    question: "What should the founder understand?",
    description:
      "The founder-level understanding required before this capability can be built responsibly — the concepts, trade-offs, and decisions the founder must personally grasp, even if someone else eventually executes the work.",
  },
  {
    id: "show",
    name: "Show™",
    question: "What should the founder be able to demonstrate?",
    description:
      "The founder's ability to explain, evaluate, or walk through the capability out loud — proof of understanding that goes beyond passive awareness, whether or not the founder personally performs the work.",
  },
  {
    id: "build",
    name: "Build™",
    question: "What must be created, installed, or improved?",
    description:
      "The concrete asset, system, process, or decision that must exist in the business for this capability to be real — not aspirational, not just understood, but actually built.",
  },
  {
    id: "own",
    name: "Own™",
    question: "Who is responsible for building and maintaining this capability?",
    description:
      "The execution/ownership model for this capability — who builds it AND who maintains it going forward. Own is not the same as Do: a founder can own an outcome without personally performing the work.",
  },
  {
    id: "prove",
    name: "Prove™",
    question: "What evidence demonstrates that the capability actually works?",
    description:
      "The real-world evidence — not intentions, not plans — that proves this capability functions as intended in the actual business.",
  },
  {
    id: "measure",
    name: "Measure™",
    question: "How do we know it continues working?",
    description:
      "The ongoing signal(s) that tell the founder whether this capability keeps performing over time, so it doesn't quietly decay after the initial build.",
  },
]

/* ===========================================================================
 * Capability readiness states
 * ---------------------------------------------------------------------------
 * Describes how mature a founder's CURRENT capability is relative to a
 * StageBenchmark. Distinct from `mustHave`/`shouldHave`/`emerging`/
 * `notYetRelevant` below, which describe the BENCHMARK's priority at a given
 * stage — not the founder's current state against it. Assessing a founder
 * against these states is explicitly OUT OF SCOPE for this phase; the type
 * is defined now so ESA/Business Context/Founder GPS can consume one
 * canonical vocabulary later instead of inventing their own.
 * ======================================================================== */

export type CapabilityReadinessState =
  | "missing" // Not yet built. No meaningful evidence exists.
  | "emerging" // Attempted inconsistently. Early evidence, not yet reliable.
  | "functional" // Works, but depends heavily on the founder's direct involvement.
  | "repeatable" // Works consistently without the founder re-inventing it each time.
  | "scalable" // Works consistently across increasing volume/team without proportional founder effort.
  | "institutionalized" // Persists independent of any single person, including the founder.

export const ALL_CAPABILITY_READINESS_STATES: CapabilityReadinessState[] = [
  "missing",
  "emerging",
  "functional",
  "repeatable",
  "scalable",
  "institutionalized",
]

/* ===========================================================================
 * Capability priority at a given stage
 * ---------------------------------------------------------------------------
 * Modeled as ONE mutually-exclusive enum rather than four independent
 * booleans (mustHave/shouldHave/emerging/notYetRelevant) so a benchmark can
 * never contradict itself by being flagged both "must have" and "not yet
 * relevant" at the same stage. Every `StageBenchmark` exposes this as
 * `priority`; each boolean the spec named has an equivalent enum value.
 * ======================================================================== */

export type CapabilityPriority =
  | "must-have" // Foundational at this stage — absence is a real gap.
  | "should-have" // Strengthens this stage but isn't foundational yet.
  | "emerging" // Early/optional at this stage — becomes more important at the next stage.
  | "not-yet-relevant" // Not a meaningful expectation at this stage at all.

export const ALL_CAPABILITY_PRIORITIES: CapabilityPriority[] = [
  "must-have",
  "should-have",
  "emerging",
  "not-yet-relevant",
]

/** How dependent this capability is on the founder personally, at this stage. */
export type FounderDependency = "high" | "medium" | "low"

/* ===========================================================================
 * Stage Benchmark Registry™
 * ======================================================================== */

/**
 * One row of the Stage Benchmark Registry™: a single Operating Practice™,
 * evaluated at a single Business Stage™, across all six Capability
 * Maturity™ dimensions.
 */
export interface StageBenchmark {
  /** Stable id — `${practiceId}--${businessStage}`. Safe for storage/lookup. */
  id: string
  /** The Business Stage™ this benchmark applies to. */
  businessStage: BusinessStage
  /** The Operating Pillar™ this benchmark's practice belongs to (denormalized). */
  businessArea: OperatingPillarId
  /** The Operating Practice™ id this benchmark evaluates (`lib/entrepreneur-success/esa-registry`). */
  practiceId: string
  /** Brand name of the capability being evaluated (e.g. "Offer Clarity™"). */
  capability: string
  /** What this capability means in practice, at this specific stage. */
  capabilityDescription: string

  // The six dimensions.
  knowCriteria: string
  showCriteria: string
  buildCriteria: string
  /**
   * What choosing an owner for this capability actually requires deciding at
   * this stage — guidance, not a fixed answer. The founder still picks.
   */
  ownCriteria: string
  proveCriteria: string
  measureCriteria: string

  /** The kinds of real-world evidence that would satisfy `proveCriteria`. */
  evidenceRequirements: string[]

  /** What the founder must personally understand, distinct from who executes. */
  founderUnderstandingRequirement: string
  /** What the founder must personally be able to do, distinct from who executes long-term. */
  founderExecutionRequirement: string
  /** How dependent this capability is on the founder personally, at this stage. */
  founderDependency: FounderDependency

  /** The Build Path™/OWN™ options that realistically fit this capability at this stage. */
  typicalOwnershipOptions: BuildPathId[]

  /** This benchmark's priority at this specific stage. See `CapabilityPriority`. */
  priority: CapabilityPriority

  /**
   * Plain-language note on when this benchmark matters more or less based on
   * the founder's Founder Destination™ — an architecture hook. No Founder
   * Destination redesign happens this phase; this field just prevents a
   * later phase from having to retrofit destination-awareness into the
   * registry's shape.
   */
  destinationRelevance: string

  /** Other Operating Practice™ ids (same or earlier stage) this benchmark assumes are already in place. */
  dependencies: string[]

  /** Plain-language note on how this benchmark relates to moving into or beyond this stage. */
  stageTransitionRelevance: string
}

/* ===========================================================================
 * Stage Exit Criteria™ (Phase 2A)
 * ---------------------------------------------------------------------------
 * Defines what must be SUFFICIENTLY true — a capability threshold, not a
 * revenue number or a fixed checklist — before a stage transition is a
 * reasonable claim. These describe the transition itself; they do not
 * assess any individual founder. Deliberately capability-based per Part 14
 * of the benchmark standard: "These are capability thresholds, not
 * arbitrary universal revenue requirements."
 * ======================================================================== */

/** The three transitions that exist between the four canonical Business Stages™. */
export type StageTransitionId = "launch-to-growth" | "growth-to-scale" | "scale-to-legacy"

export const ALL_STAGE_TRANSITION_IDS: StageTransitionId[] = [
  "launch-to-growth",
  "growth-to-scale",
  "scale-to-legacy",
]

/**
 * One capability-based condition contributing to a stage transition. Always
 * references a real `practiceId` already present in `STAGE_BENCHMARKS` — an
 * exit criterion is never invented independently of the benchmark it reads.
 */
export interface StageExitCriterion {
  /** Stable id — `${transitionId}--${practiceId}`. */
  id: string
  /** The Operating Practice™ id this criterion is based on (must resolve in `STAGE_BENCHMARKS`). */
  practiceId: string
  /** Plain-language statement of what must be sufficiently true. */
  criterion: string
  /** Which dimension(s) of that practice this criterion is really testing. */
  dimensions: CapabilityDimension[]
  /** Why this specific condition — and not a revenue/time threshold — is the real gate. */
  rationale: string
}

/**
 * One stage transition: the capability thresholds between an "exiting" stage
 * and the "entering" stage that follows it. This describes the transition,
 * not an individual founder's readiness for it — that comparison happens in
 * a later phase (Adaptive ESA / Founder GPS™), using these criteria as the
 * yardstick.
 */
export interface StageTransition {
  id: StageTransitionId
  /** The Business Stage™ a founder is leaving. */
  fromStage: BusinessStage
  /** The Business Stage™ a founder is moving toward. */
  toStage: BusinessStage
  /** Plain-language summary of what actually changes at this transition. */
  transitionSummary: string
  /** The capability-based conditions that make this transition a reasonable claim. */
  exitCriteria: StageExitCriterion[]
  /**
   * Explicit guardrail against over-gating: capabilities that are
   * legitimately NOT required to make this transition, even though they may
   * feel adjacent. Prevents a later phase from silently treating every
   * `should-have`/`emerging` benchmark as a blocking requirement.
   */
  notRequiredForTransition: string[]
  /** Plain-language caution against reducing this transition to a single number. */
  transitionCaution: string
}

/* ===========================================================================
 * Gap Categories™ (Phase 2A)
 * ---------------------------------------------------------------------------
 * A gap in ANY of the six dimensions is not the same kind of problem. Naming
 * the category is what lets a later phase (Adaptive ESA / Founder GPS™) map
 * a diagnosis to a genuinely different next action instead of one generic
 * "improve this" recommendation. One category per `CapabilityDimension` —
 * intentionally 1:1, not a separate taxonomy.
 * ======================================================================== */

export type GapCategoryId = "knowledge-gap" | "capability-gap" | "build-gap" | "ownership-gap" | "proof-gap" | "measurement-gap"

export const ALL_GAP_CATEGORY_IDS: GapCategoryId[] = [
  "knowledge-gap",
  "capability-gap",
  "build-gap",
  "ownership-gap",
  "proof-gap",
  "measurement-gap",
]

export interface GapCategoryDefinition {
  id: GapCategoryId
  /** The `CapabilityDimension` this gap category corresponds to (1:1). */
  dimension: CapabilityDimension
  /** Brand-safe display name (e.g. "Knowledge Gap"). */
  name: string
  /** A first-person example statement a founder in this gap might make. */
  founderVoiceExample: string
  /** Plain-language description of what this gap category actually means. */
  description: string
  /** The general shape of what closes this kind of gap (not a specific Build Path™ assignment). */
  typicalResolutionShape: string
}

export const GAP_CATEGORIES: GapCategoryDefinition[] = [
  {
    id: "knowledge-gap",
    dimension: "know",
    name: "Knowledge Gap",
    founderVoiceExample: "I don't know what I don't know.",
    description:
      "The founder lacks the understanding required to make good decisions about this capability — not a missing system, a missing concept.",
    typicalResolutionShape: "Targeted learning or an applied explanation — closed by understanding, not by building or hiring.",
  },
  {
    id: "capability-gap",
    dimension: "show",
    name: "Capability Gap",
    founderVoiceExample: "I understand it but cannot confidently apply it.",
    description:
      "The founder understands the concept but has not yet demonstrated being able to apply it in their own business.",
    typicalResolutionShape: "Guided application or practice — closed by doing it once with support, not by more study.",
  },
  {
    id: "build-gap",
    dimension: "build",
    name: "Build Gap",
    founderVoiceExample: "I know what to do but the capability is not installed.",
    description: "The founder knows what's required, but the actual asset, system, or process does not yet exist in the business.",
    typicalResolutionShape: "An actual build — closed by creating the artifact, not by more understanding.",
  },
  {
    id: "ownership-gap",
    dimension: "own",
    name: "Ownership Gap",
    founderVoiceExample: "Everything still requires my personal approval.",
    description:
      "The capability may exist, but accountability for building and maintaining it is unclear, or it still depends entirely on the founder.",
    typicalResolutionShape: "An intentional ownership decision using the existing Build Path™ options — closed by assigning accountability, not by building more.",
  },
  {
    id: "proof-gap",
    dimension: "prove",
    name: "Proof Gap",
    founderVoiceExample: "We believe it works but lack evidence.",
    description: "The capability exists and may even work, but there is no real-world evidence confirming that it actually does.",
    typicalResolutionShape: "Deliberately gathering evidence from real use — closed by proof, not by additional building.",
  },
  {
    id: "measurement-gap",
    dimension: "measure",
    name: "Measurement Gap",
    founderVoiceExample: "It exists and may work but we aren't tracking it.",
    description: "The capability works today, but nothing tells the founder if it's still working next month — no ongoing signal exists.",
    typicalResolutionShape: "Installing an ongoing metric or review cadence — closed by monitoring, not by rebuilding.",
  },
]
