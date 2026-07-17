/**
 * Executive Office™ — Type Contracts (Phase 10.3)
 * ---------------------------------------------------------------------------
 * Shared interfaces for the Executive Office Intelligence system.
 *
 * Every executive in the Harmony Lane™ operating system evaluates the
 * HarmonyContextAggregate and returns an ExecutiveFinding. The
 * ExecutiveOfficeEngine then selects the highest-priority finding as the
 * winning recommendation and builds an ExecutiveBrief.
 *
 * PURE MODULE — no React, no I/O.
 */

// ─── Status ───────────────────────────────────────────────────────────────────

/**
 * Live status of an Executive at any given moment.
 * Distinct from the registry's ExecutiveStatus ("conductor" | "architecture")
 * which describes the executive's architecture lifecycle.
 */
export type ExecutiveOperatingStatus =
  | "monitoring"        // Actively watching signals, nothing to surface yet
  | "opportunity-found" // Found a high-confidence growth opportunity
  | "stable"            // All signals nominal, no action needed
  | "reviewing"         // Evaluating context, confidence building
  | "alert"             // Requires founder attention

// ─── Finding ─────────────────────────────────────────────────────────────────

/**
 * A single executive's evaluation output. Produced by running the executive's
 * EvaluationFn against the HarmonyContextAggregate.
 */
export interface ExecutiveFinding {
  // Identity
  executiveId: string
  executiveName: string
  executiveTitle: string
  department: string

  // Ranking
  priority: "critical" | "high" | "medium" | "low" | "none"
  confidence: number        // 0–100
  status: ExecutiveOperatingStatus

  // Finding content
  category: string          // e.g. "Revenue Strategy", "Human Sustainability™"
  title: string             // Short headline for this finding
  summary: string           // 1–2 sentences for the status row
  currentFocus: string      // What this executive is focused on right now (1 sentence)
  recommendation: string    // The specific action recommended
  expectedOutcome: string   // What completing this recommendation achieves

  // Supporting detail
  supportingSignals: string[]         // Facts from the aggregate that drove this finding
  estimatedBusinessImpact: "high" | "medium" | "low"
  estimatedFounderEffort: "high" | "medium" | "low"
  businessAssets: string[]            // Business Asset™ ids involved

  // Temporal
  expiresAt: string | null            // ISO date string or null (= always relevant)

  // Ask Why™ — the deeper reasoning behind this finding
  whatINoticed: string                // What signals caught the executive's attention
  whyItMatters: string                // Why this matters to the founder right now
  whySelectedOrDeferred: string | null // Set after brief construction (winner or runner-up reason)
}

// ─── Executive Status Row ─────────────────────────────────────────────────────

/**
 * The condensed status representation shown in the Executive Status Dashboard.
 * Derived from ExecutiveFinding after all executives have been evaluated.
 */
export interface ExecutiveStatusRow {
  executiveId: string
  executiveName: string
  executiveTitle: string
  department: string
  status: ExecutiveOperatingStatus
  currentFocus: string
  lastInsight: string | null    // Most recent finding summary, if any
  priority: "critical" | "high" | "medium" | "low" | "none"
  confidence: number            // 0–100
}

// ─── Executive Brief ─────────────────────────────────────────────────────────

/**
 * The final output of the ExecutiveOfficeEngine — the selected recommendation
 * and the reasoning that won it.
 */
export interface ExecutiveBrief {
  /** The winning recommendation text. */
  recommendation: string
  /** Cherry Blossom™'s one-paragraph rationale for why this was selected. */
  rationale: string
  /** The executive whose finding was selected (id matches EXECUTIVE_TEAM). */
  winningExecutiveId: string
  /** The full winning finding. */
  winningFinding: ExecutiveFinding
  /**
   * Other executives whose findings contributed to or support this recommendation.
   * Priority >= medium and not the winner.
   */
  contributors: ExecutiveFinding[]
  /** Recommendations that were evaluated but not selected, with reasons. */
  deferred: { executiveId: string; title: string; reason: string }[]
  /** Signal keys from the aggregate that informed the selection. */
  signalsUsed: string[]
  /** Overall confidence of the executive brief (average of contributors). */
  overallConfidence: number
}
