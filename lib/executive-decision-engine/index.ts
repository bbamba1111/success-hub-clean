/**
 * Executive Decision Engine™ — Public API (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The single import point for all EDE consumers.
 *
 * Import everything you need from this barrel:
 *
 *   import {
 *     // Types
 *     type ConstitutionalPrinciple,
 *     type DecisionExplainability,
 *     type EdeDecisionOutput,
 *     type ExecutiveAssignmentTemplate,
 *
 *     // Constitution
 *     HARMONY_CONSTITUTION,
 *     getConstitutionById,
 *
 *     // Priority Framework
 *     PRIORITY_FRAMEWORK,
 *     getActiveTier,
 *
 *     // Reasoning Rules
 *     REASONING_RULES,
 *     getRulesForSignal,
 *
 *     // Leverage Framework
 *     LEVERAGE_FRAMEWORK,
 *     getLeverageClassById,
 *
 *     // Asset Registry
 *     BUSINESS_ASSET_REGISTRY,
 *     getAssetById,
 *
 *     // Assignment Framework
 *     ASSIGNMENT_TEMPLATES,
 *     getAssignmentById,
 *
 *     // Explainability
 *     buildExplainability,
 *   } from "@/lib/executive-decision-engine"
 *
 * Phase 5 note:
 *   The EDE evaluation engine (`evaluateCandidate()` / `rankCandidates()`)
 *   that consumes all registries below and produces `EdeDecisionOutput`
 *   records is implemented in `./decision-engine`. It is the function
 *   Founder GPS™'s Next Best Move™ engine calls.
 */

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------ */
export type {
  // Shared types
  EdeStatus,
  // Constitution types
  ConstitutionalPrincipleId,
  PrincipleCategory,
  PrincipleOverridePolicy,
  ConstitutionalPrinciple,
  // Priority framework types
  PriorityTierId,
  PriorityItem,
  PriorityTier,
  // Reasoning rule types
  ReasoningRuleId,
  RuleCondition,
  RuleAction,
  ReasoningRule,
  // Leverage framework types
  LeverageClassId,
  DelegationTargetId,
  LeverageClass,
  DelegationTarget,
  // Asset registry types
  BusinessAssetId,
  RoiHorizon,
  BusinessAsset,
  PracticeAssetMapping,
  // Assignment framework types
  AssignmentTemplateId,
  AssignmentDuration,
  ExecutiveAssignmentTemplate,
  // Explainability types
  ExplainabilitySignal,
  AppliedPrinciple,
  FiredRule,
  DecisionExplainability,
  ExplainableDecision,
  // EDE output type
  EdeDecisionOutput,
} from "./types"

/* ---------------------------------------------------------------------------
 * Harmony Constitution™
 * ------------------------------------------------------------------------ */
export {
  HARMONY_CONSTITUTION,
  getConstitutionById,
  getConstitutionByCategory,
  getConstitutionByOutcome,
  getImmutablePrinciples,
} from "./constitution"

/* ---------------------------------------------------------------------------
 * Decision Priority Framework™
 * ------------------------------------------------------------------------ */
export {
  PRIORITY_FRAMEWORK,
  getPriorityTierById,
  getPriorityTiersOrdered,
  getDefaultPriorityTier,
} from "./priority-framework"

/* ---------------------------------------------------------------------------
 * Executive Reasoning Rules™
 * ------------------------------------------------------------------------ */
export {
  REASONING_RULES,
  getReasoningRuleById,
  getRulesForSignal,
  getReasoningRulesOrdered,
  getRulesForPrinciple,
} from "./reasoning-rules"

/* ---------------------------------------------------------------------------
 * Business Leverage Framework™
 * ------------------------------------------------------------------------ */
export {
  LEVERAGE_FRAMEWORK,
  LEVERAGE_EVALUATION_ORDER,
  getLeverageClassById,
  getLeverageFrameworkOrdered,
} from "./leverage-framework"

/* ---------------------------------------------------------------------------
 * Business Asset Outcome Registry™
 * ------------------------------------------------------------------------ */
export {
  BUSINESS_ASSET_REGISTRY,
  PRACTICE_ASSET_MAPPINGS,
  getAssetById,
  getAssetsByOutcome,
  getAssetsByStage,
  getAssetsForPractice,
} from "./asset-registry"

/* ---------------------------------------------------------------------------
 * Executive Assignment Framework™
 * ------------------------------------------------------------------------ */
export {
  ASSIGNMENT_TEMPLATES,
  getAssignmentById,
  getAssignmentsByPillar,
  getAssignmentsByAsset,
  getAssignmentsByStage,
  getAssignmentsByOutcome,
} from "./assignment-framework"

/* ---------------------------------------------------------------------------
 * Explainability™
 * ------------------------------------------------------------------------ */
export {
  buildExplainability,
  primarySignal,
  contributingSignal,
  suppressingSignal,
  firedRule,
  formatExplainabilityForLogging,
  summarizeExplainability,
  ARCHITECTURE_EXPLAINABILITY,
} from "./explainability"
export type { ExplainabilityInput } from "./explainability"

/* ---------------------------------------------------------------------------
 * Decision Engine™ — the EDE evaluation engine (Phase 5)
 * ------------------------------------------------------------------------ */
export {
  evaluateFounderPriority,
  classifyLeverage,
  evaluateCandidate,
  rankCandidates,
} from "./decision-engine"
export type {
  LeverageCandidateSignals,
  EdeCandidateInput,
  RankedEdeCandidate,
} from "./decision-engine"
