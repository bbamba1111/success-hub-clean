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
