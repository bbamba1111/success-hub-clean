/**
 * Explainability™ — Decision Transparency Architecture (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The architecture that ensures every EDE decision is fully explainable.
 *
 * Core guarantee:
 *   Cherry Blossom™ can ALWAYS answer:
 *     "Why are you recommending this?"
 *     "Which principles were applied?"
 *     "What signals influenced this decision?"
 *     "Which operating practices are being strengthened?"
 *     "What long-term outcome is expected?"
 *
 * Architecture rules:
 *   - Every EDE output must carry a `DecisionExplainability` record.
 *   - The `buildExplainability()` builder is the ONLY way to create one.
 *     This ensures structural completeness is enforced at the factory level.
 *   - Explainability records are immutable once built.
 *   - Cherry Blossom™ translates explainability records into natural language.
 *     The EDE NEVER generates language — it generates structured reasoning.
 *
 * Import pattern:
 *   import { buildExplainability, formatExplainabilityForLogging } from
 *     "@/lib/executive-decision-engine/explainability"
 */

import type {
  DecisionExplainability,
  ExplainabilitySignal,
  AppliedPrinciple,
  FiredRule,
  PriorityTierId,
} from "./types"
import type { GpsOutcome } from "@/lib/entrepreneur-success/types"
import { getConstitutionById } from "./constitution"

/* ===========================================================================
 * Builder
 * ---------------------------------------------------------------------------
 * The single factory for creating DecisionExplainability records. Using a
 * builder function (rather than object literals) enforces completeness and
 * allows validation to be added without changing call sites.
 * ======================================================================== */

export interface ExplainabilityInput {
  /** The primary reason this recommendation was made — one sentence. */
  primaryReason: string
  /** The GPS signals that influenced this decision. */
  influencingSignals: ExplainabilitySignal[]
  /** The constitutional principle ids that were applied. */
  appliedPrincipleIds: DecisionExplainability["appliedPrinciples"][number]["principleId"][]
  /** One-sentence notes for each applied principle — parallel array to `appliedPrincipleIds`. */
  principleApplicationNotes: string[]
  /** The reasoning rules that fired. */
  firedRules: FiredRule[]
  /** Operating Practice ids that this decision strengthens. */
  strengthenedPractices: string[]
  /** The long-term outcome expected from following this recommendation. */
  expectedLongTermOutcome: string
  /** The GPS Outcome™ that was prioritized. */
  prioritizedOutcome: GpsOutcome
  /** The priority tier that governed this decision. */
  governingTier: PriorityTierId
}

/**
 * Build a complete, validated `DecisionExplainability` record.
 *
 * Invariants enforced:
 *   - `primaryReason` must be non-empty.
 *   - `appliedPrincipleIds` and `principleApplicationNotes` must have the same length.
 *   - At least one influencing signal OR one applied principle must be present.
 */
export function buildExplainability(
  input: ExplainabilityInput
): DecisionExplainability {
  if (!input.primaryReason.trim()) {
    throw new Error(
      "[EDE] Explainability record requires a non-empty primaryReason."
    )
  }
  if (input.appliedPrincipleIds.length !== input.principleApplicationNotes.length) {
    throw new Error(
      "[EDE] appliedPrincipleIds and principleApplicationNotes must have the same length."
    )
  }
  if (
    input.influencingSignals.length === 0 &&
    input.appliedPrincipleIds.length === 0
  ) {
    throw new Error(
      "[EDE] A decision must have at least one influencing signal or one applied principle."
    )
  }

  const appliedPrinciples: AppliedPrinciple[] = input.appliedPrincipleIds.map(
    (id, i) => {
      const principle = getConstitutionById(id)
      return {
        principleId: id,
        principleNumber: principle?.number ?? 0,
        applicationNote: input.principleApplicationNotes[i],
      }
    }
  )

  return {
    primaryReason: input.primaryReason,
    influencingSignals: input.influencingSignals,
    appliedPrinciples,
    firedRules: input.firedRules,
    strengthenedPractices: input.strengthenedPractices,
    expectedLongTermOutcome: input.expectedLongTermOutcome,
    prioritizedOutcome: input.prioritizedOutcome,
    governingTier: input.governingTier,
  }
}

/* ===========================================================================
 * Signal builders
 * ---------------------------------------------------------------------------
 * Helpers for constructing the typed signal entries in an explainability record.
 * ======================================================================== */

/** Create an ExplainabilitySignal with primary influence. */
export function primarySignal(
  signalId: ExplainabilitySignal["signalId"],
  explanation: string
): ExplainabilitySignal {
  return { signalId, explanation, influence: "primary" }
}

/** Create an ExplainabilitySignal with contributing influence. */
export function contributingSignal(
  signalId: ExplainabilitySignal["signalId"],
  explanation: string
): ExplainabilitySignal {
  return { signalId, explanation, influence: "contributing" }
}

/** Create an ExplainabilitySignal with suppressing influence. */
export function suppressingSignal(
  signalId: ExplainabilitySignal["signalId"],
  explanation: string
): ExplainabilitySignal {
  return { signalId, explanation, influence: "suppressing" }
}

/** Create a FiredRule entry. */
export function firedRule(
  ruleId: FiredRule["ruleId"],
  ruleNote: string
): FiredRule {
  return { ruleId, ruleNote }
}

/* ===========================================================================
 * Formatting helpers
 * ---------------------------------------------------------------------------
 * Used by logging, debugging, and future Cherry Blossom™ context injection.
 * These produce structured text — NOT natural language for the founder.
 * ======================================================================== */

/**
 * Format an explainability record as a structured log string.
 * Useful during development and for server-side debugging.
 */
export function formatExplainabilityForLogging(
  record: DecisionExplainability
): string {
  const lines: string[] = [
    `[EDE Decision]`,
    `  Primary reason:     ${record.primaryReason}`,
    `  Prioritized outcome: ${record.prioritizedOutcome}`,
    `  Governing tier:     ${record.governingTier}`,
    `  Long-term outcome:  ${record.expectedLongTermOutcome}`,
    ``,
    `  Influencing signals (${record.influencingSignals.length}):`,
    ...record.influencingSignals.map(
      (s) => `    [${s.influence.toUpperCase()}] ${s.signalId} — ${s.explanation}`
    ),
    ``,
    `  Applied principles (${record.appliedPrinciples.length}):`,
    ...record.appliedPrinciples.map(
      (p) =>
        `    Principle ${p.principleNumber} (${p.principleId}) — ${p.applicationNote}`
    ),
    ``,
    `  Fired rules (${record.firedRules.length}):`,
    ...record.firedRules.map(
      (r) => `    ${r.ruleId} — ${r.ruleNote}`
    ),
    ``,
    `  Strengthened practices: ${record.strengthenedPractices.join(", ") || "none"}`,
  ]
  return lines.join("\n")
}

/**
 * Produce a minimal summary of an explainability record.
 * Used by Cherry Blossom™ as context when generating explanations.
 * Returns a structured object — NOT a language string.
 */
export function summarizeExplainability(
  record: DecisionExplainability
): {
  primaryReason: string
  topPrinciple: string | null
  topSignal: string | null
  outcome: GpsOutcome
  tier: PriorityTierId
} {
  const topPrinciple = record.appliedPrinciples[0]?.principleId ?? null
  const topSignal =
    record.influencingSignals.find((s) => s.influence === "primary")?.signalId ??
    record.influencingSignals[0]?.signalId ??
    null

  return {
    primaryReason: record.primaryReason,
    topPrinciple,
    topSignal,
    outcome: record.prioritizedOutcome,
    tier: record.governingTier,
  }
}

/* ===========================================================================
 * Empty / fallback explainability
 * ---------------------------------------------------------------------------
 * A type-safe default used when an assignment template is returned without a
 * full reasoning cycle (e.g. direct lookup by id, not via EDE evaluation).
 * ======================================================================== */

export const ARCHITECTURE_EXPLAINABILITY: DecisionExplainability = {
  primaryReason:
    "This recommendation was produced by a direct assignment lookup, not a full EDE reasoning cycle. Full explainability is available after the EDE engine is implemented.",
  influencingSignals: [],
  appliedPrinciples: [
    {
      principleId: "one-highest-leverage-outcome",
      principleNumber: 3,
      applicationNote:
        "Architecture placeholder — the EDE will populate this with real reasoning in a future phase.",
    },
  ],
  firedRules: [],
  strengthenedPractices: [],
  expectedLongTermOutcome:
    "Completing this assignment advances at least one Compounding Business Asset™.",
  prioritizedOutcome: "build-compounding-assets",
  governingTier: "priority-4-strategic-growth",
}
