/**
 * Executive Decision Engine™ — Shared Type Surface (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The complete type contract for every module in the Executive Decision Engine™.
 *
 * Architecture rules:
 *   - NEVER add logic here. This file is type definitions only.
 *   - All ids are string literals — stable, safe for storage and routing.
 *   - Every object that passes through the EDE MUST carry an `explainability`
 *     field so Cherry Blossom™ can always explain any decision.
 *   - Future AI reasoning reads these types; it does NOT define them.
 *
 * Dependency graph (all imports are type-only):
 *   types.ts  ← constitution.ts
 *             ← priority-framework.ts
 *             ← reasoning-rules.ts
 *             ← leverage-framework.ts
 *             ← asset-registry.ts
 *             ← assignment-framework.ts
 *             ← explainability.ts
 *             ← index.ts
 */

import type { GpsOutcome } from "@/lib/entrepreneur-success/types"
import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { GpsSignalId } from "@/lib/founder-gps/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"

/* ===========================================================================
 * Lifecycle status — shared across all EDE registries
 * ======================================================================== */

/**
 * The lifecycle status of every EDE object.
 *
 *   "active"       — implemented and in use in the decision pipeline.
 *   "architecture" — defined and cross-referenced; logic deferred.
 *   "deferred"     — intentionally deferred to a future named phase.
 */
export type EdeStatus = "active" | "architecture" | "deferred"

/* ===========================================================================
 * Harmony Constitution™ — types
 * ======================================================================== */

/**
 * The stable id for each constitutional principle.
 * Ids are kebab-case, immutable, and never reused even if a principle retires.
 */
export type ConstitutionalPrincipleId =
  | "honor-non-negotiables-first"
  | "protect-zone-of-genius"
  | "one-highest-leverage-outcome"
  | "build-compounding-assets"
  | "reduce-execution-friction-weekly"
  | "protect-important-relationships"
  | "respect-installed-commitments"
  | "prefer-delegate-automate-eliminate"
  | "learning-connects-to-implementation"
  | "time-freedom-is-a-performance-indicator"
  | "long-term-sustainability-over-short-term-busyness"
  | "recommendations-increase-clarity-not-anxiety"

/**
 * The category of a constitutional principle — governs where in the
 * reasoning pipeline it is applied.
 *
 *   "life"        — governs life/business balance decisions.
 *   "business"    — governs business-strategy decisions.
 *   "execution"   — governs how work is assigned and done.
 *   "learning"    — governs when and how learning is recommended.
 *   "wellbeing"   — governs founder health, calm, and sustainability.
 */
export type PrincipleCategory = "life" | "business" | "execution" | "learning" | "wellbeing"

/**
 * Whether a principle can ever be overridden, and under what conditions.
 *
 *   "immutable"     — can NEVER be overridden by any signal or rule.
 *   "conditional"   — can be suspended only under `overrideConditions`.
 *   "configurable"  — the founder may adjust via installed commitments.
 */
export type PrincipleOverridePolicy = "immutable" | "conditional" | "configurable"

/** A single constitutional principle in the Harmony Constitution™. */
export interface ConstitutionalPrinciple {
  /** Stable, immutable id. */
  id: ConstitutionalPrincipleId
  /** The principle number as it appears in the Constitution (1-based). */
  number: number
  /** Short title (e.g. "Honor Life's Non-Negotiables™ First"). */
  title: string
  /**
   * The full constitutional statement — precise, canonical, first-person
   * plural ("We…" / "Harmony Lane…") to convey governance weight.
   */
  statement: string
  /**
   * A brief rationale — why this principle exists in the Operating System.
   * Used by Cherry Blossom™ when explaining a decision.
   */
  rationale: string
  /** The category this principle belongs to. */
  category: PrincipleCategory
  /** GPS Outcomes™ this principle protects. */
  protectedOutcomes: GpsOutcome[]
  /** Whether this principle can ever be overridden. */
  overridePolicy: PrincipleOverridePolicy
  /**
   * Conditions under which this principle may be suspended.
   * Only applies when overridePolicy is "conditional".
   */
  overrideConditions?: string[]
  /** Lifecycle status. */
  status: EdeStatus
}

/* ===========================================================================
 * Decision Priority Framework™ — types
 * ======================================================================== */

/**
 * Stable ids for each priority tier.
 * Tiers are ordered 1 (highest) → N (lowest).
 */
export type PriorityTierId =
  | "priority-1-life-safety"
  | "priority-2-non-negotiables-at-risk"
  | "priority-3-business-survival"
  | "priority-4-strategic-growth"
  | "priority-5-learning-optimization"

/** The concrete items that belong within a priority tier. */
export interface PriorityItem {
  /** Short label (e.g. "Medical Emergency"). */
  label: string
  /**
   * Optional GPS signal ids that trigger elevation to this tier.
   * When any of these signals are active, the tier becomes the active priority.
   */
  triggerSignals?: GpsSignalId[]
  /** Lifecycle status. */
  status: EdeStatus
}

/** A single tier in the Decision Priority Framework™. */
export interface PriorityTier {
  /** Stable id. */
  id: PriorityTierId
  /** Numeric rank — lower number = higher priority. */
  rank: number
  /** Display label (e.g. "Priority 1 — Life Safety"). */
  label: string
  /** What this tier is for. */
  description: string
  /**
   * Constitutional principles that govern decisions at this tier.
   * The EDE will always verify these are honored before routing.
   */
  governingPrinciples: ConstitutionalPrincipleId[]
  /** The concrete items belonging to this tier. */
  items: PriorityItem[]
  /**
   * The GPS Outcomes™ that are primary at this tier.
   * Used by the recommendation engine when multiple outcomes compete.
   */
  primaryOutcomes: GpsOutcome[]
  /** Lifecycle status. */
  status: EdeStatus
}

/* ===========================================================================
 * Executive Reasoning Rules™ — types
 * ======================================================================== */

/**
 * Stable id for each reasoning rule.
 * Pattern: "<condition-summary>--then-<action-summary>"
 */
export type ReasoningRuleId =
  | "burnout-critical--reduce-workload"
  | "anniversary-approaching--protect-evening"
  | "weak-pipeline-validated-offer--favor-relationships"
  | "task-is-delegable--prefer-delegation"
  | "recurring-activity--prefer-systemization"
  | "life-protection-mode--suspend-growth-recommendations"
  | "no-weekly-design--recommend-sunday-ritual"
  | "cash-runway-critical--elevate-revenue-tasks"
  | "no-esa-completed--recommend-assessment"
  | "event-requires-preparation--surface-reminder"
  | "learning-not-connected--add-implementation-cta"

/**
 * The condition side of an IF…THEN reasoning rule.
 * All conditions are typed signals — no natural language matching.
 */
export interface RuleCondition {
  /** Human-readable description of this condition for documentation. */
  description: string
  /**
   * GPS signal ids that must be present for this condition to be true.
   * The EDE evaluates the active GpsContext to check these.
   */
  requiredSignals?: GpsSignalId[]
  /**
   * Constitutional principle ids that this condition relates to.
   * Used for explainability — helps Cherry Blossom™ cite the right principle.
   */
  relatedPrinciples?: ConstitutionalPrincipleId[]
  /**
   * Optional free-text conditions (human-readable, for documentation only).
   * NOT evaluated programmatically — future logic versions handle evaluation.
   */
  additionalContext?: string[]
}

/**
 * The action side of an IF…THEN reasoning rule.
 * Describes the INTENT of the action — not its implementation.
 */
export interface RuleAction {
  /** Human-readable description of what this action does. */
  description: string
  /**
   * The GPS Outcome™ this action primarily serves.
   */
  primaryOutcome: GpsOutcome
  /**
   * The priority tier this action routes to (if it changes routing).
   * Null means the rule adjusts the recommendation but does not change tier.
   */
  targetPriorityTier?: PriorityTierId
  /**
   * Leverage classification of the recommended action.
   * Architecture hook — evaluated in a future execution phase.
   */
  leverageClass?: LeverageClassId
}

/** A single IF…THEN reasoning rule in the Executive Reasoning Rules™ registry. */
export interface ReasoningRule {
  /** Stable, immutable id. */
  id: ReasoningRuleId
  /** Short label for display / logging. */
  label: string
  /**
   * The IF condition that triggers this rule.
   */
  condition: RuleCondition
  /**
   * The THEN action that the EDE takes when the condition is met.
   */
  action: RuleAction
  /**
   * The constitutional principle(s) this rule upholds.
   * Cherry Blossom™ cites these when explaining the recommendation.
   */
  upholdsConstitution: ConstitutionalPrincipleId[]
  /**
   * Priority of this rule when multiple rules fire simultaneously.
   * Lower number = evaluated first.
   */
  evaluationPriority: number
  /** Lifecycle status. */
  status: EdeStatus
}

/* ===========================================================================
 * Business Leverage Framework™ — types
 * ======================================================================== */

/**
 * The four leverage classifications — every task in Harmony Lane™ ultimately
 * receives one of these classifications.
 *
 *   "keep"       — only this founder should perform this work (Zone of Genius™).
 *   "delegate"   — can and should be assigned to a human or AI team member.
 *   "automate"   — technology should perform this work without human involvement.
 *   "eliminate"  — this activity no longer creates sufficient value; remove it.
 */
export type LeverageClassId = "keep" | "delegate" | "automate" | "eliminate"

/** Who the delegation target is when leverageClass is "delegate". */
export type DelegationTargetId =
  | "human-team"
  | "ai-executive"
  | "partner"
  | "contractor"
  | "agency"
  | "virtual-assistant"

/** A single leverage classification entry in the Business Leverage Framework™. */
export interface LeverageClass {
  /** Stable id. */
  id: LeverageClassId
  /** Display label. */
  label: string
  /** Brand tagline. */
  tagline: string
  /** Full description of when to apply this classification. */
  description: string
  /** The constitutional principle(s) this classification upholds. */
  upholdsConstitution: ConstitutionalPrincipleId[]
  /** The GPS Outcome™ this classification primarily serves. */
  primaryOutcome: GpsOutcome
  /**
   * When leverageClass is "delegate": the available delegation targets.
   * Empty for "keep", "automate", "eliminate".
   */
  delegationTargets: DelegationTarget[]
  /**
   * Questions the EDE (and eventually Cherry Blossom™) asks to determine
   * whether a task belongs in this class.
   */
  qualifyingQuestions: string[]
  /** Lifecycle status. */
  status: EdeStatus
}

/** A delegation target with routing metadata. */
export interface DelegationTarget {
  /** Stable id. */
  id: DelegationTargetId
  /** Display label (e.g. "Human Team™"). */
  label: string
  /** When this target is the right choice. */
  bestFor: string
  /** Status — some delegation targets are architecture-only. */
  status: EdeStatus
}

/* ===========================================================================
 * Business Asset Outcome Registry™ — types
 * ======================================================================== */

/**
 * Stable ids for Compounding Business Assets™.
 * Every Operating Practice™ produces at least one of these assets.
 */
export type BusinessAssetId =
  | "signature-talk"
  | "evergreen-webinar"
  | "standard-operating-procedure"
  | "referral-engine"
  | "hiring-process"
  | "marketing-funnel"
  | "ai-workflow"
  | "decision-framework"
  | "client-onboarding-system"
  | "partnership-system"
  | "email-nurture-sequence"
  | "content-library"
  | "offer-suite"
  | "pricing-framework"
  | "team-operating-handbook"
  | "financial-dashboard"
  | "strategic-plan"
  | "brand-positioning-statement"
  | "sales-playbook"
  | "authority-platform"

/** ROI horizon — how long before a Business Asset™ compounds back. */
export type RoiHorizon = "immediate" | "30-days" | "90-days" | "6-months" | "12-months-plus"

/** A single entry in the Business Asset Outcome Registry™. */
export interface BusinessAsset {
  /** Stable id. */
  id: BusinessAssetId
  /** Display name (e.g. "Signature Talk™"). */
  name: string
  /** One-sentence description of what this asset does for the business. */
  description: string
  /** How this asset compounds over time. */
  compoundingMechanism: string
  /** The Operating Pillar(s) this asset primarily strengthens. */
  primaryPillars: OperatingPillarId[]
  /** The leverage class used to build this asset. */
  buildClass: LeverageClassId
  /**
   * How long before the investment in this asset returns value.
   */
  roiHorizon: RoiHorizon
  /**
   * The GPS Outcome™ this asset primarily serves once built.
   */
  primaryOutcome: GpsOutcome
  /**
   * The Business Stages™ where building this asset is highest-leverage.
   */
  primaryStages: BusinessStage[]
  status: EdeStatus
}

/** The connection between an Operating Practice™ → Assignment → Asset. */
export interface PracticeAssetMapping {
  /** Operating Practice™ id (from esa-registry.ts). */
  practiceId: string
  /** The Business Asset™ that is produced when this practice is executed. */
  producedAsset: BusinessAssetId
  /** How directly the practice produces the asset. */
  connectionStrength: "direct" | "contributing" | "foundational"
  status: EdeStatus
}

/* ===========================================================================
 * Executive Assignment Framework™ — types
 * ======================================================================== */

/** Stable ids for Executive Assignment™ templates. */
export type AssignmentTemplateId = string // Free-form kebab-case; validated by registry.

/**
 * The duration classification of an assignment.
 * Used by Sunday Design Day™ to slot assignments into the weekly calendar.
 */
export type AssignmentDuration =
  | "15-minutes"
  | "30-minutes"
  | "1-hour"
  | "2-hours"
  | "half-day"
  | "full-day"
  | "multi-day"

/**
 * The full Executive Assignment™ template.
 * Every future assignment produced by the Founder GPS™ MUST conform to
 * this shape — it is the contractual output of the Executive Decision Engine™.
 */
export interface ExecutiveAssignmentTemplate {
  /** Stable, kebab-case id. */
  id: AssignmentTemplateId
  /** Short display title. */
  title: string
  /** The objective — what will be true when this assignment is complete. */
  objective: string
  /**
   * The Operating Practice™ id this assignment trains/builds.
   * References esa-registry.ts.
   */
  operatingPracticeId: string
  /**
   * The Operating Pillar™ id this assignment strengthens.
   */
  operatingPillarId: OperatingPillarId
  /** Estimated duration. */
  estimatedDuration: AssignmentDuration
  /**
   * The business outcome — what the founder's business will have after
   * this assignment is complete.
   */
  businessOutcome: string
  /**
   * The Compounding Business Asset™ produced by this assignment.
   * References BusinessAssetId.
   */
  producedAsset: BusinessAssetId
  /** The Executive™ id that owns this assignment. References executive-registry.ts. */
  owningExecutiveId: string
  /** Optional Advisor™ id. References advisor-registry.ts. */
  relatedAdvisorId?: string
  /** Optional Academy™ lesson id to pair with this assignment. References academy-registry.ts. */
  academyLessonId?: string
  /** The success metric — how the founder knows this assignment succeeded. */
  successMetric: string
  /** The reflection prompt — what Cherry Blossom™ asks when the assignment is complete. */
  reflectionPrompt: string
  /**
   * The follow-up trigger — what signal or condition causes the GPS to
   * recommend the NEXT assignment in this practice thread.
   */
  followUpTrigger: string
  /** The GPS Outcomes™ this assignment advances. */
  advancesOutcomes: GpsOutcome[]
  /** The Business Stages™ where this assignment is highest-leverage. */
  primaryStages: BusinessStage[]
  /** Leverage classification of this assignment. */
  leverageClass: LeverageClassId
  /** Lifecycle status. */
  status: EdeStatus
}

/* ===========================================================================
 * Explainability™ — types
 * ---------------------------------------------------------------------------
 * Every recommendation, assignment, or decision produced by the EDE MUST
 * carry an Explainability™ record so that Cherry Blossom™ can always answer:
 *   "Why are you recommending this?"
 *   "Which principles were applied?"
 *   "What signals influenced this decision?"
 *   "What outcome will this create?"
 * ======================================================================== */

/** A single signal that influenced an EDE decision. */
export interface ExplainabilitySignal {
  /** The GPS signal id that fired. */
  signalId: GpsSignalId
  /** Human-readable explanation of why this signal mattered. */
  explanation: string
  /** How strongly this signal influenced the decision. */
  influence: "primary" | "contributing" | "suppressing"
}

/** A constitutional principle that was applied in an EDE decision. */
export interface AppliedPrinciple {
  /** The principle id. */
  principleId: ConstitutionalPrincipleId
  /** The principle number (1-based, for display). */
  principleNumber: number
  /** One sentence explaining how this principle shaped the decision. */
  applicationNote: string
}

/** A reasoning rule that fired during EDE evaluation. */
export interface FiredRule {
  /** The reasoning rule id. */
  ruleId: ReasoningRuleId
  /** One sentence explaining how this rule changed the output. */
  ruleNote: string
}

/**
 * The Explainability™ record — attached to every EDE recommendation.
 *
 * This is the "receipt" of the reasoning process. Cherry Blossom™ uses this
 * to explain decisions in natural language. Future AI reasoning reads this to
 * understand the decision context before generating explanations.
 */
export interface DecisionExplainability {
  /**
   * The primary reason this recommendation was made — one sentence,
   * suitable for Cherry Blossom™ to speak directly.
   */
  primaryReason: string
  /**
   * The signals that influenced this decision.
   */
  influencingSignals: ExplainabilitySignal[]
  /**
   * Constitutional principles that were applied.
   */
  appliedPrinciples: AppliedPrinciple[]
  /**
   * Reasoning rules that fired during evaluation.
   */
  firedRules: FiredRule[]
  /**
   * The Operating Practices™ this decision strengthens.
   */
  strengthenedPractices: string[]
  /**
   * The long-term outcome expected from following this recommendation.
   */
  expectedLongTermOutcome: string
  /**
   * The GPS Outcome™ that was prioritized in this decision.
   */
  prioritizedOutcome: GpsOutcome
  /**
   * The priority tier that governed this decision.
   */
  governingTier: PriorityTierId
}

/**
 * The base interface that every EDE output must extend or include.
 * Architecture guarantee: if it came from the EDE, it is explainable.
 */
export interface ExplainableDecision {
  /** The explainability record for this decision. */
  explainability: DecisionExplainability
}

/* ===========================================================================
 * EDE Decision Output™ — the unified output shape
 * ---------------------------------------------------------------------------
 * The final output of the Executive Decision Engine™ — one per reasoning
 * cycle. This is what Founder GPS™ and Cherry Blossom™ consume.
 * ======================================================================== */

/** The complete output of one EDE reasoning cycle. */
export interface EdeDecisionOutput extends ExplainableDecision {
  /**
   * The active priority tier — which tier governed this cycle.
   */
  activeTier: PriorityTierId
  /**
   * The primary GPS Outcome™ to pursue this cycle.
   */
  primaryOutcome: GpsOutcome
  /**
   * The recommended leverage class for the next action.
   */
  recommendedLeverageClass: LeverageClassId
  /**
   * The Executive Assignment Template™ id to instantiate, if applicable.
   * Null when the EDE determines that no assignment is appropriate yet.
   */
  recommendedAssignmentId: AssignmentTemplateId | null
  /**
   * Constitutional principles that are satisfied by the current context.
   * Used by Cherry Blossom™ to celebrate what the founder is already doing well.
   */
  satisfiedPrinciples: ConstitutionalPrincipleId[]
  /**
   * Constitutional principles currently at risk.
   * EDE flags these before the GPS makes a recommendation.
   */
  principlesAtRisk: ConstitutionalPrincipleId[]
  /**
   * Reasoning rules that fired this cycle.
   */
  firedRules: ReasoningRuleId[]
  /**
   * Whether the GPS should suppress growth recommendations this cycle
   * due to life protection mode, burnout signals, or survival priority.
   */
  suppressGrowthRecommendations: boolean
  /**
   * The Business Asset™ that will be produced if the recommendation is followed.
   */
  targetAssetId: BusinessAssetId | null
}
