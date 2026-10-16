/**
 * Adaptive Workspace™ — Type contracts (Phase 10.6)
 *
 * Pure types only. No React, no I/O, no localStorage.
 */

// ── Operating Mode ────────────────────────────────────────────────────────────

export type OperatingMode = "build" | "scale" | "optimize" | "restore" | "strategy"

export interface OperatingModeDefinition {
  id: OperatingMode
  /** Display name, e.g. "Build Mode™" */
  name: string
  tagline: string
  primaryFocus: string[]
  /** Executive ids to weight higher in this mode */
  executivePriority: string[]
  suppressLearning: boolean
  reduceCognitiveLoad: boolean
  /** Describes the operating emphasis: "execution" | "recovery" | "planning" | "optimization" | "leadership" */
  emphasis: string
  /** Hex accent color for UI */
  accentColor: string
  /** Tailwind text class for the mode pill */
  textClass: string
  /** Tailwind bg class for the mode pill */
  bgClass: string
}

// ── Workspace Profile ─────────────────────────────────────────────────────────

export type WorkspaceProfileId =
  | "solo-founder"
  | "growth"
  | "executive-leadership"
  | "scaling-team"
  | "advisory"

export interface WorkspaceProfile {
  id: WorkspaceProfileId
  name: string
  description: string
  /** Ordered section keys visible in this profile */
  visibleSections: string[]
  executiveOfficeProminent: boolean
  learningVisible: boolean
  memoryInsightsVisible: boolean
  predictionsVisible: boolean
  patternVisible: boolean
}

// ── Adaptive Workspace Config ─────────────────────────────────────────────────

export interface AdaptiveWorkspaceConfig {
  recommendedMode: OperatingMode
  modeConfidence: number
  modeRationale: string
  recommendedProfile: WorkspaceProfileId
  profileRationale: string
  /** executiveId → weight multiplier 0.5–2.0 */
  executiveWeights: Record<string, number>
  suppressedFeatures: string[]
  /** Human-readable explanation of any active suppression, Cherry Blossom tone */
  adaptationNote: string | null
}

// ── Adaptation History ────────────────────────────────────────────────────────

export interface AdaptationHistoryEntry {
  id: string
  /** ISO date string */
  date: string
  type: "mode" | "profile" | "weights" | "suppression"
  from: string
  to: string
  reason: string
}

// ── Personalized Ritual ───────────────────────────────────────────────────────

export interface PersonalizedRitual {
  id: string
  /** e.g. "Tuesday Strategy Block™" */
  name: string
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number
  rationale: string
  confidence: number
  /** ISO date */
  firstObserved: string
  confirmedCount: number
}

// ── Mode Derivation Result ────────────────────────────────────────────────────

export interface OperatingModeResult {
  mode: OperatingMode
  confidence: number
  rationale: string
}
