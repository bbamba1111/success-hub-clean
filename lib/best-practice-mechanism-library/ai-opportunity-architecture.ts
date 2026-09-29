/**
 * Best-Practice Mechanism Library™ — AI / Technology Opportunity Architecture
 * ---------------------------------------------------------------------------
 * ARCHITECTURE / DESIGN PASS ONLY. This module adds the SECOND missing layer
 * the founder OS needs: the contextual intelligence that decides WHEN an AI
 * resource, prompt, copilot, or agent is appropriate for a specific piece of
 * business work — and under what Human Sustainability™ rules.
 *
 * The conceptual chain this file scaffolds (the "how technology helps" tail of
 * the mechanism chain in ./types.ts):
 *
 *   Best-Practice Mechanism™            (./types.ts)
 *     → Work to be performed            (WorkUnit — this file)
 *     → Workflow analysis               (WorkflowAnalysis — understand BEFORE tooling)
 *     → Intervention decision           (WorkInterventionType — ./types.ts)
 *     → AI opportunity                  (AiOpportunityProfile — this file)
 *     → AI resource / tool category     (AiResourceCandidate — this file)
 *     → Prompt / instruction            (FounderPromptTemplate — this file)
 *     → Copilot / agent                 (FounderCopilotBlueprint — this file)
 *     → Human Sustainability AI Rules™   (HumanSustainabilityAiRules — this file)
 *     → Operating Rule™ / HROI™           (connection points — ./types.ts)
 *
 * HARD RULES honored here:
 *   - AI is NEVER the default answer. The taxonomy forces ELIMINATE / SIMPLIFY
 *     / DELEGATE / STANDARDIZE before AUTOMATE / AUGMENT / AGENT, and always
 *     allows KEEP HUMAN. See WorkInterventionType in ./types.ts.
 *   - This is NOT a generic AI tool directory. Resources are surfaced as
 *     CATEGORIES resolved from analyzed work, never a browsable catalog of
 *     thousands of tools.
 *   - This does NOT build a second assessment, recommendation engine, prompt
 *     corpus, copilot runtime, or workflow-analysis engine. It defines the
 *     shapes those future capabilities will read and the clean extension
 *     points into the EXISTING systems (BBA, EGA, Business Asset Library™,
 *     EDE leverage/assignment frameworks, Founder GPS™, CEO Workday™).
 *   - It ships NO production data. Every registry here is intentionally empty.
 *
 * The existing personalized CAIO helpers in lib/founder-os/ai-transformation.ts
 * (AIOpportunity / Lever / buildOpportunities) remain the founder-facing
 * "living dashboard" layer. THIS module is the deeper, mechanism-anchored
 * contract those surfaces can eventually be re-expressed on top of — it does
 * not replace or import them.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { LeverageClassId } from "@/lib/executive-decision-engine/types"
import type { WorkInterventionType } from "./types"

/* ===========================================================================
 * 1. WORK UNIT + WORKFLOW ANALYSIS
 * ---------------------------------------------------------------------------
 * "Understand the work before selecting the AI." A WorkflowAnalysis is the
 * future capability that inspects a business process and characterizes it so
 * an intervention can be chosen deliberately. It is NOT a new assessment — it
 * is designed to be populated from EXISTING BBA / EGA / Business Asset data.
 * ======================================================================== */

/** The nature of a slice of work — drives the intervention decision. */
export type WorkCharacteristic =
  | "repetitive"
  | "rules-based"
  | "information-heavy"
  | "communication-heavy"
  | "decision-heavy"
  | "relationship-heavy"
  | "exception-heavy"
  | "founder-dependent"
  | "creative"

/** A single unit of work produced by a mechanism and subject to an intervention decision. */
export interface WorkUnit {
  id: string
  /** What is being performed. */
  description: string
  /** The mechanism this work implements (BestPracticeMechanism id). */
  mechanismId?: string
  /** Who performs it today. */
  currentOwner?: string
  /** Why the work exists — the business outcome it supports. */
  businessPurpose?: string
  /** How the work behaves — the levers for choosing an intervention. */
  characteristics: WorkCharacteristic[]
  /** Whether the founder is currently required for this work. */
  founderDependent?: boolean
}

/** A step within an analyzed workflow. */
export interface WorkflowStep {
  id: string
  title: string
  owner?: string
  inputs?: string[]
  outputs?: string[]
  isDecisionPoint?: boolean
  isBottleneck?: boolean
  isException?: boolean
  isManual?: boolean
  characteristics: WorkCharacteristic[]
  /** The intervention the analysis suggests for THIS step — never assumed to be AI. */
  suggestedIntervention?: WorkInterventionType
}

/**
 * The output shape of the future Workflow Analysis capability. Deliberately a
 * plain data contract so it can be assembled from existing signals rather than
 * a new questionnaire.
 */
export interface WorkflowAnalysis {
  id: string
  /** The mechanism whose work this analysis describes. */
  mechanismId?: string
  /** Business process/workflow name. */
  workflowName: string
  steps: WorkflowStep[]
  /** Steps most worth intervening on, ordered — extension point for the engine. */
  prioritizedStepIds?: string[]
  /** Work identified as needing to remain human. */
  humanOnlyStepIds?: string[]
}

/* ===========================================================================
 * 2. AI OPPORTUNITY PROFILE
 * ---------------------------------------------------------------------------
 * Attached to a mechanism (or a WorkUnit) to describe WHERE technology may
 * help and WHERE it must not. It reuses the canonical EDE LeverageClassId and
 * the mechanism WorkInterventionType — it introduces no competing enum.
 * ======================================================================== */

export interface AiOpportunityProfile {
  /** The interventions this work is a candidate for, most-preferred first. */
  candidateInterventions: WorkInterventionType[]
  /** The canonical leverage class this resolves to (for existing leverage logic). */
  leverageClass?: LeverageClassId
  /** Parts of the work that are strong AI candidates. */
  aiSuitableAspects?: string[]
  /** Parts that must remain human — required so AI is never over-applied. */
  mustRemainHuman?: string[]
  /** Confidence that AI is appropriate at all (kept deliberately conservative). */
  aiAppropriateness?: "not-appropriate" | "assistive-only" | "strong-candidate"
}

/* ===========================================================================
 * 3. AI RESOURCE — CATEGORY, NOT A DIRECTORY
 * ---------------------------------------------------------------------------
 * The founder is never asked to browse thousands of tools. Work is resolved to
 * a RESOURCE CATEGORY first; specific candidates are optional and illustrative.
 * ======================================================================== */

export type AiResourceCategory =
  | "knowledge-grounded-assistant"
  | "content-drafting"
  | "summarization"
  | "workflow-automation"
  | "data-extraction"
  | "scheduling-coordination"
  | "research-synthesis"
  | "communication-drafting"
  | "decision-support"
  | "transcription-notes"

export interface AiResourceCandidate {
  /** The category resolved from the analyzed work. */
  category: AiResourceCategory
  /** Human-readable description of what this category of tool does. */
  description: string
  /** Optional, illustrative named examples — never an exhaustive catalog. */
  exampleToolNames?: string[]
  /** The intervention this resource supports. */
  supportsIntervention: WorkInterventionType
}

/* ===========================================================================
 * 4. FOUNDER PROMPT LIBRARY™ — ARCHITECTURE ONLY
 * ---------------------------------------------------------------------------
 * Prompts are contextual, not generic. A prompt template declares the CONTEXT
 * it needs to inherit (founder profile, business context, mechanism, asset,
 * boundaries) so it can be personalized at use time. No prompts are populated.
 * ======================================================================== */

/** The context signals a prompt can inherit at render time. */
export type PromptContextSource =
  | "founder-profile"
  | "business-context"
  | "business-stage"
  | "business-reality"
  | "current-gap"
  | "selected-mechanism"
  | "business-asset"
  | "operating-rule"
  | "boundary"
  | "human-sustainability-rules"

export interface FounderPromptTemplate {
  id: string
  name: string
  /** Business outcome this prompt serves. */
  businessOutcome?: string
  /** Mechanism this prompt supports (BestPracticeMechanism id). */
  mechanismId?: string
  /** Business function / work type. */
  workType?: string
  stages?: BusinessStage[]
  /** The AI intervention this prompt is for. */
  interventionType?: WorkInterventionType
  /** Which context sources the prompt inherits when personalized. */
  inheritsContext: PromptContextSource[]
  /** Inputs the prompt requires from the founder. */
  requiredInputs?: string[]
  /** Expected output description. */
  expectedOutput?: string
  /** Whether a human must review the output before use. */
  requiresHumanReview: boolean
  /** Boundary this prompt must help protect, if any. */
  boundaryImplication?: string
  /** HROI measure this prompt contributes to. */
  hroiMeasure?: string
  /** The prompt body is intentionally omitted in this architecture pass. */
  status: "architecture"
}

/* ===========================================================================
 * 5. FOUNDER COPILOT / AGENT — ARCHITECTURE ONLY
 * ---------------------------------------------------------------------------
 * The founder should not need to understand agent architecture. The system
 * translates business context into this configuration. This defines the
 * configuration shape only — no runtime, orchestration, or model calls.
 * ======================================================================== */

export interface HumanSustainabilityAiRules {
  /** What AI MAY do. */
  mayDo: string[]
  /** What AI MAY NOT do. */
  mayNotDo: string[]
  /** What MUST remain human. */
  mustRemainHuman: string[]
  /** When AI MUST escalate to a human. */
  escalateWhen: string[]
  /** Who owns the final decision. */
  finalDecisionOwner: string
  /** The boundary this AI must help protect. */
  boundaryToProtect?: string
}

export interface FounderCopilotBlueprint {
  id: string
  name: string
  /** Purpose in the founder's own terms. */
  purpose: string
  /** Scope — what it covers and what it does not. */
  scope?: string
  /** Mechanism this copilot supports (BestPracticeMechanism id). */
  mechanismId?: string
  /** Business Asset Library™ ids this copilot is grounded in. */
  knowledgeSourceAssetIds?: string[]
  /** Clarifying questions the copilot asks the founder. */
  questions?: string[]
  /** Operating guidelines / instructions. */
  guidelines?: string[]
  allowedActions?: string[]
  disallowedActions?: string[]
  /** The Human Sustainability AI Rules™ that govern it — required, not optional metadata. */
  humanSustainabilityRules: HumanSustainabilityAiRules
  /** Success measures (business + human). */
  successMeasures?: string[]
  status: "architecture"
}

/* ===========================================================================
 * 6. EMPTY REGISTRIES + INERT READ-ONLY HELPERS
 * ---------------------------------------------------------------------------
 * Ship no production data. These exist so future population and downstream
 * reads have a stable, typed surface today. Every helper is pure and returns
 * empty results until a corpus is deliberately loaded.
 * ======================================================================== */

export const FOUNDER_PROMPT_TEMPLATES: readonly FounderPromptTemplate[] = []
export const FOUNDER_COPILOT_BLUEPRINTS: readonly FounderCopilotBlueprint[] = []
export const AI_RESOURCE_CATALOG: readonly AiResourceCandidate[] = []

/** Prompt templates that support a given mechanism (empty until populated). */
export function getPromptsForMechanism(mechanismId: string): readonly FounderPromptTemplate[] {
  return FOUNDER_PROMPT_TEMPLATES.filter((p) => p.mechanismId === mechanismId)
}

/** Copilot blueprints that support a given mechanism (empty until populated). */
export function getCopilotsForMechanism(mechanismId: string): readonly FounderCopilotBlueprint[] {
  return FOUNDER_COPILOT_BLUEPRINTS.filter((c) => c.mechanismId === mechanismId)
}

/** Resource candidates for a given intervention (empty until populated). */
export function getResourcesForIntervention(
  intervention: WorkInterventionType,
): readonly AiResourceCandidate[] {
  return AI_RESOURCE_CATALOG.filter((r) => r.supportsIntervention === intervention)
}

/**
 * Extension point: the future ordering of AI intervention preference. Encodes
 * the hard rule that cheaper, more human-preserving interventions are always
 * considered BEFORE automation or agents. Lower number = considered first.
 */
export const INTERVENTION_PREFERENCE_ORDER: Record<WorkInterventionType, number> = {
  eliminated: 0,
  simplified: 1,
  delegated: 2,
  standardized: 3,
  automated: 4,
  "augmented-with-ai": 5,
  "ai-agent-assisted": 6,
  "kept-human": 7,
}
