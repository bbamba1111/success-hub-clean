/**
 * Best-Practice Mechanism Library™ — Validation AI Artifacts
 * ---------------------------------------------------------------------------
 * The AI / technology tail of the mechanism chain for the TWO validation
 * mechanisms in ./registry.ts. This proves the architecture in
 * ./ai-opportunity-architecture.ts can carry a real example end-to-end:
 *
 *   Mechanism → Workflow analysis → Intervention decision → AI opportunity
 *     → AI resource category → Prompt → Copilot → Human Sustainability AI Rules™
 *
 * These are VALIDATION artifacts, not production data — the production
 * registries in ./ai-opportunity-architecture.ts stay intentionally empty.
 * Everything here is illustrative example data, clearly separated so it can be
 * deleted or promoted deliberately.
 *
 * HARD RULE honored throughout: AI is never the default. Each AI opportunity
 * lists what must remain human, and each copilot carries explicit
 * may / may-not / escalate / final-owner rules. No copilot runtime, prompt
 * body, or model call exists here — configuration shapes only.
 */

import type {
  AiOpportunityProfile,
  AiResourceCandidate,
  FounderCopilotBlueprint,
  FounderPromptTemplate,
  WorkflowAnalysis,
} from "./ai-opportunity-architecture"

/* ===========================================================================
 * 1. WORKFLOW ANALYSES
 * ======================================================================== */

/** Client Delivery Standardization™ — the delivery workflow, characterized. */
const CLIENT_DELIVERY_WORKFLOW: WorkflowAnalysis = {
  id: "wf-client-delivery-standardization",
  mechanismId: "client-delivery-standardization",
  workflowName: "Client delivery (current → standardized)",
  steps: [
    { id: "intake", title: "Client intake & scope", owner: "founder", characteristics: ["information-heavy", "founder-dependent"], isManual: true, suggestedIntervention: "standardized" },
    { id: "kickoff", title: "Kickoff & expectation setting", owner: "founder", characteristics: ["communication-heavy", "relationship-heavy"], suggestedIntervention: "kept-human" },
    { id: "execution", title: "Repeatable delivery steps", owner: "founder", characteristics: ["repetitive", "rules-based"], isBottleneck: true, isManual: true, suggestedIntervention: "delegated" },
    { id: "recurring-questions", title: "Routine recurring client questions", owner: "founder", characteristics: ["communication-heavy", "repetitive", "information-heavy"], isBottleneck: true, suggestedIntervention: "augmented-with-ai" },
    { id: "status", title: "Status updates & handoff reminders", owner: "founder", characteristics: ["repetitive", "rules-based"], suggestedIntervention: "automated" },
    { id: "review", title: "Quality review against the standard", owner: "founder", characteristics: ["decision-heavy"], isDecisionPoint: true, suggestedIntervention: "kept-human" },
    { id: "exceptions", title: "Non-standard client situations", owner: "founder", characteristics: ["exception-heavy", "decision-heavy", "founder-dependent"], isException: true, suggestedIntervention: "kept-human" },
  ],
  prioritizedStepIds: ["execution", "recurring-questions", "status"],
  humanOnlyStepIds: ["kickoff", "review", "exceptions"],
}

/** High-Value Work Focus™ — the executive-attention workflow, characterized. */
const HIGH_VALUE_WORK_WORKFLOW: WorkflowAnalysis = {
  id: "wf-high-value-work-focus",
  mechanismId: "high-value-work-focus",
  workflowName: "Executive attention (objectives → protected window)",
  steps: [
    { id: "objectives", title: "Capture business objectives", owner: "founder", characteristics: ["decision-heavy"], isDecisionPoint: true, suggestedIntervention: "kept-human" },
    { id: "identify-hv", title: "Identify highest-value work", owner: "founder", characteristics: ["decision-heavy", "founder-dependent"], isDecisionPoint: true, suggestedIntervention: "kept-human" },
    { id: "triage", title: "Triage reactive / low-value work", owner: "founder", characteristics: ["repetitive", "exception-heavy"], isBottleneck: true, suggestedIntervention: "delegated" },
    { id: "stop-doing", title: "Decide what to stop doing", owner: "founder", characteristics: ["decision-heavy"], isDecisionPoint: true, suggestedIntervention: "eliminated" },
    { id: "pre-window-prep", title: "Prepare inputs before the window", owner: "assistant/AI", characteristics: ["information-heavy", "creative"], suggestedIntervention: "augmented-with-ai" },
    { id: "protected-window", title: "Protected CEO Workday execution", owner: "founder", characteristics: ["decision-heavy", "relationship-heavy", "creative", "founder-dependent"], suggestedIntervention: "kept-human" },
    { id: "post-window-followup", title: "Bounded follow-up after the window", owner: "team/AI", characteristics: ["rules-based", "communication-heavy"], suggestedIntervention: "delegated" },
  ],
  prioritizedStepIds: ["triage", "stop-doing", "pre-window-prep"],
  humanOnlyStepIds: ["objectives", "identify-hv", "protected-window"],
}

export const VALIDATION_WORKFLOW_ANALYSES: readonly WorkflowAnalysis[] = [
  CLIENT_DELIVERY_WORKFLOW,
  HIGH_VALUE_WORK_WORKFLOW,
]

/* ===========================================================================
 * 2. AI OPPORTUNITY PROFILES (keyed by mechanism)
 * ---------------------------------------------------------------------------
 * Both are deliberately conservative — "assistive-only". Neither mechanism is
 * a candidate for autonomous AI; the human-only aspects are listed explicitly.
 * ======================================================================== */

export const VALIDATION_AI_OPPORTUNITIES: Record<string, AiOpportunityProfile> = {
  "client-delivery-standardization": {
    // Preference order: standardize/delegate the work BEFORE reaching for AI.
    candidateInterventions: ["standardized", "delegated", "augmented-with-ai", "kept-human"],
    leverageClass: "delegate",
    aiSuitableAspects: [
      "Drafting answers to routine recurring client questions from approved, knowledge-grounded sources",
      "Drafting delivery documentation (SOPs) from real delivery examples",
    ],
    mustRemainHuman: [
      "Defining what a 'good' client result is",
      "Quality review against the standard",
      "Any non-standard client situation or exception",
      "Final client-relationship judgment",
    ],
    aiAppropriateness: "assistive-only",
  },
  "high-value-work-focus": {
    // AI works AROUND the founder's window (prepare / follow up), never inside it.
    candidateInterventions: ["eliminated", "simplified", "delegated", "augmented-with-ai", "kept-human"],
    leverageClass: "delegate",
    aiSuitableAspects: [
      "Research, summarization, option-preparation, and drafting done BEFORE the protected window",
      "Organizing and documenting bounded follow-up AFTER the window",
    ],
    mustRemainHuman: [
      "Deciding what is highest-value work",
      "Judgment, decisions, innovation, key relationships, and leadership during the window",
      "Choosing what to stop doing",
    ],
    aiAppropriateness: "assistive-only",
  },
}

/* ===========================================================================
 * 3. AI RESOURCE CANDIDATES (categories, not a directory)
 * ======================================================================== */

export const VALIDATION_AI_RESOURCES: readonly AiResourceCandidate[] = [
  {
    category: "knowledge-grounded-assistant",
    description: "Answers routine recurring client questions strictly from approved delivery documentation, escalating anything outside it.",
    supportsIntervention: "augmented-with-ai",
  },
  {
    category: "content-drafting",
    description: "Drafts SOP / playbook documentation from real delivery examples for human review.",
    supportsIntervention: "augmented-with-ai",
  },
  {
    category: "research-synthesis",
    description: "Gathers and synthesizes background and options before the founder's protected work window.",
    supportsIntervention: "augmented-with-ai",
  },
  {
    category: "summarization",
    description: "Condenses inputs into decision-ready briefs the founder reads at the start of the window.",
    supportsIntervention: "augmented-with-ai",
  },
]

/* ===========================================================================
 * 4. FOUNDER PROMPT TEMPLATES (architecture only — no prompt body)
 * ======================================================================== */

const CLIENT_DELIVERY_PROMPT: FounderPromptTemplate = {
  id: "prompt-client-delivery-recurring-question",
  name: "Routine Client Question Responder",
  businessOutcome: "Consistent, on-standard answers to routine recurring client questions without routing every one to the founder.",
  mechanismId: "client-delivery-standardization",
  workType: "client-delivery",
  interventionType: "augmented-with-ai",
  inheritsContext: ["business-context", "selected-mechanism", "business-asset", "boundary", "human-sustainability-rules"],
  requiredInputs: ["The client's question", "The approved delivery documentation to ground the answer in"],
  expectedOutput: "A drafted answer grounded only in approved sources, flagged for human send when the question is outside the standard.",
  requiresHumanReview: true,
  boundaryImplication: "Protects the founder from being the default answerer of every routine question, without letting AI improvise beyond the standard.",
  hroiMeasure: "Response speed / founder interruptions reduced",
  status: "architecture",
}

const HIGH_VALUE_WORK_PROMPT: FounderPromptTemplate = {
  id: "prompt-high-value-pre-window-brief",
  name: "CEO Workday Pre-Window Brief",
  businessOutcome: "The founder starts the protected window with a decision-ready brief instead of spending it gathering context.",
  mechanismId: "high-value-work-focus",
  workType: "founder-effectiveness",
  interventionType: "augmented-with-ai",
  inheritsContext: ["founder-profile", "business-context", "business-stage", "current-gap", "selected-mechanism", "operating-rule"],
  requiredInputs: ["The high-value decision or work to be done in the window", "Relevant materials to synthesize"],
  expectedOutput: "A concise brief with synthesized context and prepared options — no recommendation presented as a decision.",
  requiresHumanReview: true,
  boundaryImplication: "AI prepares BEFORE the window; it never fills the window with new work or makes the decision.",
  hroiMeasure: "Protected CEO time preserved / high-value work completed",
  status: "architecture",
}

export const VALIDATION_PROMPT_TEMPLATES: readonly FounderPromptTemplate[] = [CLIENT_DELIVERY_PROMPT, HIGH_VALUE_WORK_PROMPT]

/* ===========================================================================
 * 5. FOUNDER COPILOT BLUEPRINTS (architecture only — no runtime)
 * ======================================================================== */

const CLIENT_DELIVERY_COPILOT: FounderCopilotBlueprint = {
  id: "copilot-client-delivery-assistant",
  name: "Client Delivery Assistant",
  purpose: "Handle routine recurring client questions on-standard so the founder is not the default answerer.",
  scope: "Answers grounded only in approved delivery documentation. Does not set scope, make delivery promises, or handle exceptions.",
  mechanismId: "client-delivery-standardization",
  knowledgeSourceAssetIds: ["sop-playbook-template", "client-onboarding-system"],
  questions: ["What did the client ask?", "Which delivery standard covers this?"],
  guidelines: [
    "Answer only from approved documentation.",
    "If the question is outside the documented standard, do not answer — escalate.",
    "Never invent policy, pricing, timelines, or commitments.",
  ],
  allowedActions: ["Draft an on-standard answer", "Cite the relevant standard", "Flag the answer for human send when appropriate"],
  disallowedActions: ["Make delivery or scope promises", "Handle exceptions", "Contact the client autonomously"],
  humanSustainabilityRules: {
    mayDo: ["Draft answers to routine recurring questions from approved sources"],
    mayNotDo: ["Make commitments", "Improvise beyond the documented standard"],
    mustRemainHuman: ["Defining the standard", "Quality review", "Exception handling"],
    escalateWhen: ["The question is outside the standard", "The client expresses dissatisfaction"],
    finalDecisionOwner: "Founder or delivery lead",
    boundaryToProtect: "The founder must not become the permanent quality-control bottleneck for every client question.",
  },
  successMeasures: ["Response speed", "Founder interruptions reduced", "Delivery consistency"],
  status: "architecture",
}

const HIGH_VALUE_WORK_COPILOT: FounderCopilotBlueprint = {
  id: "copilot-ceo-workday-prep",
  name: "CEO Workday Prep Copilot",
  purpose: "Prepare research, summaries, options, and drafts BEFORE the founder's protected work window so the window stays high-value.",
  scope: "Works around the protected window (prepare before, organize follow-up after). Never operates inside the window and never makes decisions.",
  mechanismId: "high-value-work-focus",
  knowledgeSourceAssetIds: ["strategic-plan", "priority-clarity-score", "28-day-focus-plan"],
  questions: ["What is the highest-value work for the upcoming window?", "What context or options should be prepared in advance?"],
  guidelines: [
    "Prepare inputs; do not present a recommendation as a decision.",
    "Do not schedule new work into the protected window.",
    "Surface decisions FOR the window, not around it.",
  ],
  allowedActions: ["Research", "Summarize", "Prepare options", "Draft", "Organize bounded follow-up after the window"],
  disallowedActions: ["Fill the protected window with new tasks", "Make the founder's decisions", "Act on external relationships autonomously"],
  humanSustainabilityRules: {
    mayDo: ["Prepare inputs before the window", "Execute bounded follow-up after the window"],
    mayNotDo: ["Fill the window with more work", "Decide what is highest-value", "Make founder-only decisions"],
    mustRemainHuman: ["Judgment", "Decisions", "Innovation", "Key relationships", "Leadership"],
    escalateWhen: ["A decision or judgment call is required", "Work cannot be bounded without founder input"],
    finalDecisionOwner: "Founder",
    boundaryToProtect: "The protected executive window (4-Hour CEO Workday™) must stay founder-only high-value work and must not be refilled with reactive work.",
  },
  successMeasures: ["Protected CEO time preserved", "High-value work completed", "Interruptions reduced", "Recovery"],
  status: "architecture",
}

export const VALIDATION_COPILOT_BLUEPRINTS: readonly FounderCopilotBlueprint[] = [CLIENT_DELIVERY_COPILOT, HIGH_VALUE_WORK_COPILOT]

/* ===========================================================================
 * 6. READ-ONLY ACCESSOR — bundle a mechanism's full AI tail
 * ======================================================================== */

export interface MechanismAiArtifacts {
  workflow?: WorkflowAnalysis
  aiOpportunity?: AiOpportunityProfile
  prompts: readonly FounderPromptTemplate[]
  copilots: readonly FounderCopilotBlueprint[]
}

/** Everything on the AI tail for one validation mechanism. Pure lookup, no engine. */
export function getValidationAiArtifacts(mechanismId: string): MechanismAiArtifacts {
  return {
    workflow: VALIDATION_WORKFLOW_ANALYSES.find((w) => w.mechanismId === mechanismId),
    aiOpportunity: VALIDATION_AI_OPPORTUNITIES[mechanismId],
    prompts: VALIDATION_PROMPT_TEMPLATES.filter((p) => p.mechanismId === mechanismId),
    copilots: VALIDATION_COPILOT_BLUEPRINTS.filter((c) => c.mechanismId === mechanismId),
  }
}
