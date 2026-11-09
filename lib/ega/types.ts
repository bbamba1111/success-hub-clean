/**
 * Entrepreneur Gap Assessment™ — Shared Type Surface (Phase 1 — Data Foundation)
 * ---------------------------------------------------------------------------
 * EGA is the canonical diagnostic layer: "What is getting in the way?"
 * It records structured Signal → Gap → Solution entries, sourced from
 * multiple places across the platform (ESA, Business Context™, direct EGA
 * questions, asset/rule state, and future GPS context).
 *
 * IMPORTANT — this is a NEW, additive layer. It does not replace, rename,
 * or read from the legacy `biggestChallenges` / `biggestOpportunities`
 * fields on BusinessContextProfile. Those remain the compatibility surface
 * for the 19+ existing GPS/Executive Office/Founder Intelligence/Capability
 * Engine consumers until a future phase migrates them one at a time behind
 * an adapter.
 */

/** Where an EgaEntry originated from — the multi-source trigger model. */
export type EgaSource =
  | "esa" // ESA practice scored below the EGA gap-signal threshold
  | "business_context" // top challenge / growth opportunity flagged
  | "direct_ega" // founder answered a direct EGA question (one-time onboarding baseline)
  | "weekly_reality_check" // founder re-selected what's getting in their way during the Monday Reality Check (recurring)
  | "asset_condition" // asset started but never finished / no operating rule exists
  | "operating_rule_state" // existing rule overridden or conflicted
  | "gps_context" // founder previously flagged as a bottleneck (future GPS use)

export type EgaStatus = "open" | "in_progress" | "resolved" | "dismissed"

export type EgaObstacleType =
  | "knowledge"
  | "time"
  | "priority"
  | "confidence"
  | "system"
  | "delegation"
  | "decision"
  | "capacity"

export type EgaBusinessStage = "launch" | "growth" | "scale" | "legacy" | "all"

export type EgaTimeHorizon = "today" | "this_week" | "this_month" | "this_quarter"

export type EgaActionType =
  | "build"
  | "design"
  | "delegate"
  | "augment"
  | "execute"
  | "practice"
  | "restructure"
  | "protect_non_negotiables"

/**
 * A single Signal → Gap → Solution record. `gap`, `solution`, and the
 * classification fields are nullable — Phase 1 only guarantees a `signal`
 * is captured; diagnosis and solution-mapping are progressive enrichment
 * that later phases (and eventually AI) fill in.
 */
export interface EgaEntry {
  id: string
  userId: string

  source: EgaSource
  /** e.g. an ESA practice id, a Business Context field key, an asset id, a rule id. */
  sourceRef?: string

  /** The raw trigger/observation, in the founder's or system's words. */
  signal: string

  /** The diagnosed gap/obstacle, once identified. */
  gap?: string
  obstacleType?: EgaObstacleType

  /** The recommended solution, once mapped (Phase 2+: BAL asset or EDE template). */
  solution?: string
  solutionRef?: string

  status: EgaStatus
  businessStage?: EgaBusinessStage
  timeHorizon?: EgaTimeHorizon
  actionType?: EgaActionType
  successIndicator?: string

  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

/** Fields required to create a new EgaEntry. Everything else defaults or is filled in later. */
export interface CreateEgaEntryInput {
  source: EgaSource
  sourceRef?: string
  signal: string
  gap?: string
  obstacleType?: EgaObstacleType
  solution?: string
  solutionRef?: string
  status?: EgaStatus
  businessStage?: EgaBusinessStage
  timeHorizon?: EgaTimeHorizon
  actionType?: EgaActionType
  successIndicator?: string
}

/** Partial patch for progressive enrichment of an existing EgaEntry. */
export interface UpdateEgaEntryInput {
  gap?: string
  obstacleType?: EgaObstacleType
  solution?: string
  solutionRef?: string
  status?: EgaStatus
  businessStage?: EgaBusinessStage
  timeHorizon?: EgaTimeHorizon
  actionType?: EgaActionType
  successIndicator?: string
}
