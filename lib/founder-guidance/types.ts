/**
 * Founder Business-Building Guidance™ — types (Phase 12)
 * ---------------------------------------------------------------------------
 * A guidance/literacy LAYER over existing architecture — no new GPS,
 * recommendation engine, Build Strategy™/Blueprint™/Record™/Command Center.
 * Every field below is derived from data that already exists
 * (`ReadinessCapability`, `GpsRecommendation`, `BuildBlueprint`, `BuildRecord`,
 * `BusinessConcept`). Nothing here is fabricated: when a real signal doesn't
 * exist, `status` says so honestly instead of inventing content.
 */

import type { BuildPathId } from "@/lib/build-strategy/types"

/** Whether a piece of guidance content traces to a real signal, a reasonable derivation, or nothing yet. */
export type KnowledgeStatus = "known" | "inferred" | "unknown"

/** One section of the Business-Building Guide™ — a single topic, tagged for honesty. */
export interface GuideSection {
  id: string
  title: string
  /** Plain-language body. Empty when `status` is `"unknown"` — the section still renders so the founder knows the gap exists. */
  body: string
  /** Multi-line content (e.g. a list of decisions/assets/roles) — empty when not applicable. */
  items: string[]
  status: KnowledgeStatus
}

/** The full Business-Building Guide™ for one recommendation + chosen Build Path™. */
export interface BusinessBuildingGuide {
  sections: GuideSection[]
}

/** The 9-field Decision Snapshot™ — an at-a-glance summary of an existing recommendation, never a new one. */
export interface DecisionSnapshot {
  what: string
  why: string
  whyNow: string
  recommendedPath: { id: BuildPathId | null; label: string; reason: string }
  founderChosenPath: BuildPathId | null
  confidence: { label: string; status: KnowledgeStatus }
  riskOfDoingNothing: string
  owner: string
  nextAction: { label: string; description: string }
}

/** The 9-field explanation of what a given Build Path™ means in practice. */
export interface BuildPathEducation {
  buildPath: BuildPathId
  label: string
  whatItMeans: string
  whenItFitsBest: string
  whenToAvoid: string
  founderInputNeeded: string
  timeCommitment: { value: string; status: KnowledgeStatus }
  costImplication: { value: string; status: KnowledgeStatus }
  riskLevel: string
  howToStart: string
}

/** Co-Build™ (Build It With Me) division of labor — a categorization of the existing step text, never new content. */
export interface CoBuildDivision {
  founderSteps: { title: string; detail: string }[]
  aiSteps: { title: string; detail: string }[]
  togetherSteps: { title: string; detail: string }[]
}

/** AI Build™ boundaries — what AI can honestly produce vs. what stays a human action. */
export interface AiBuildBoundaries {
  aiCanDo: string[]
  founderMustApprove: string[]
  aiNeedsAccessTo: { items: string[]; status: KnowledgeStatus }
}

/** Founder Ownership Guidance™ — what the founder should understand, own, avoid, and hand off, for the chosen path. */
export interface FounderOwnershipGuidance {
  whatToUnderstand: { text: string; status: KnowledgeStatus }
  whatToOwn: { text: string; status: KnowledgeStatus }
  whatNotToDo: { items: string[]; status: KnowledgeStatus }
  whatToHandOff: { items: string[]; status: KnowledgeStatus }
}

/** Handoff Education™ — only applicable to the 5 external/capacity Build Paths™ (delegate, hire, outsource, buy, partner). */
export interface HandoffEducation {
  buildPath: BuildPathId
  roleOrType: string
  scopeItems: string[]
  budgetEstimate: string
  timelineEstimate: string
  handoffDefinitionOfDone: string
  founderRetains: string[]
}

/** One step in "Show Me How" — reused for both the Business-Building Guide and the standalone walkthrough. */
export interface PathInstructionStep {
  what: string
  why: string
  how: string
  result: string
  next: string
}

/** One concept explained via "Teach Me This" — a passthrough of the existing Business Concepts™ registry. */
export interface ConceptTeaching {
  conceptId: string
  term: string
  explanation: string
  status: KnowledgeStatus
}

/** The 5 Founder Confidence States™ — each maps to an action on an EXISTING UI surface, never a new recommendation. */
export type FounderConfidenceStateId =
  | "no-recommendation-yet"
  | "recommendation-not-started"
  | "path-chosen"
  | "capacity-constrained"
  | "confident-and-moving"

export interface FounderConfidenceState {
  id: FounderConfidenceStateId
  message: string
  action: { label: string; target: string }
}
