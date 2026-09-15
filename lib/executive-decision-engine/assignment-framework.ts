/**
 * Executive Assignment Framework™ — Assignment Templates (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The contractual output shape for every future assignment the Founder GPS™
 * will produce. Every recommendation the EDE generates MUST conform to the
 * `ExecutiveAssignmentTemplate` type defined in types.ts.
 *
 * This file contains:
 *   1. A representative set of founding assignment templates that demonstrate
 *      the full shape across multiple pillars and stages.
 *   2. Lookup helpers consumed by Founder GPS™ and Cherry Blossom™.
 *
 * Architecture rules:
 *   - Templates are canonical — they define the SHAPE of a recommendation,
 *     not the specific content for a specific founder. Cherry Blossom™
 *     personalizes the language; the template provides the skeleton.
 *   - Every template MUST include a `reflectionPrompt` and a `followUpTrigger`.
 *     Without these, the GPS cannot close the learning loop.
 *   - `producedAsset` is a required field — every assignment builds something.
 *   - Templates reference ids from other registries; those ids must be stable.
 *
 * Import pattern:
 *   import { ASSIGNMENT_TEMPLATES, getAssignmentsByPillar } from
 *     "@/lib/executive-decision-engine/assignment-framework"
 */

import type { ExecutiveAssignmentTemplate } from "./types"

/* ===========================================================================
 * Executive Assignment Templates™
 * ---------------------------------------------------------------------------
 * Founding set — enough templates to validate the full EDE pipeline across
 * all five priority tiers and the three GPS Outcomes™.
 * Full population of all Operating Practices™ is deferred to Phase 7.
 * ======================================================================== */

export const ASSIGNMENT_TEMPLATES: readonly ExecutiveAssignmentTemplate[] = [
  // -------------------------------------------------------------------------
  // Strategic Foundation™ pillar
  // -------------------------------------------------------------------------
  {
    id: "clarify-business-vision",
    title: "Clarify Your Business Vision™",
    objective:
      "Write a one-paragraph Vision Statement™ that describes what your business will look like at its best in three to five years.",
    operatingPracticeId: "vision-direction",
    operatingPillarId: "strategic-foundation",
    estimatedDuration: "1-hour",
    businessOutcome:
      "A written Vision Statement™ that gives you and your team a clear destination to navigate toward — reducing the number of strategic decisions you need to make from scratch.",
    producedAsset: "strategic-plan",
    owningExecutiveId: "strategic-advisor",
    academyLessonId: "vision-and-mission",
    successMetric:
      "You can share your Vision Statement™ with a team member and they can independently make a decision that aligns with it.",
    reflectionPrompt:
      "Reading your Vision Statement™ — does it energize you? Does it feel true? What would need to change for it to be both inspiring and achievable?",
    followUpTrigger:
      "Vision Statement™ is documented but has not yet been shared with a team member or advisor for feedback.",
    advancesOutcomes: ["build-compounding-assets"],
    primaryStages: ["launch", "growth"],
    leverageClass: "keep",
    status: "architecture",
  },
  {
    id: "define-ideal-client-profile",
    title: "Define Your Ideal Client Profile™",
    objective:
      "Write a one-page Ideal Client Profile™ that describes your highest-value client — their situation, desires, obstacles, and the transformation your business delivers for them.",
    operatingPracticeId: "offer-clarity",
    operatingPillarId: "strategic-foundation",
    estimatedDuration: "1-hour",
    businessOutcome:
      "A documented Ideal Client Profile™ that aligns marketing, sales, and delivery around one clear client archetype — reducing the time spent on poor-fit prospects.",
    producedAsset: "brand-positioning-statement",
    owningExecutiveId: "marketing-director",
    academyLessonId: "ideal-client-clarity",
    successMetric:
      "You can describe your ideal client in three sentences without hesitation, and your team can use the profile to pre-qualify prospects independently.",
    reflectionPrompt:
      "Looking at your current client list — do they match this profile? Where are the gaps, and what would it take to attract more clients who do?",
    followUpTrigger:
      "Ideal Client Profile™ is documented but marketing messaging has not yet been updated to reflect it.",
    advancesOutcomes: ["build-compounding-assets"],
    primaryStages: ["launch", "growth"],
    leverageClass: "keep",
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // Revenue Engine™ pillar
  // -------------------------------------------------------------------------
  {
    id: "document-sales-process",
    title: "Document Your Sales Process™",
    objective:
      "Map your current sales process from first contact to signed agreement, identify the one step with the highest drop-off rate, and create a one-page improvement plan for that step.",
    operatingPracticeId: "sales-process",
    operatingPillarId: "revenue-engine",
    estimatedDuration: "2-hours",
    businessOutcome:
      "A documented Sales Playbook™ — the foundation for delegating sales conversations, training future team members, and improving conversion rates systematically.",
    producedAsset: "sales-playbook",
    owningExecutiveId: "sales-director",
    academyLessonId: "high-conversion-sales",
    successMetric:
      "A team member could follow your Sales Playbook™ and conduct a qualifying sales conversation without asking you how.",
    reflectionPrompt:
      "Where in your sales process do most prospects drop off — and what does that tell you about what they need to see or hear before they say yes?",
    followUpTrigger:
      "Sales Playbook™ is documented but has not yet been tested with a new team member or reviewed by the Sales Director™.",
    advancesOutcomes: ["build-compounding-assets", "reduce-execution-friction"],
    primaryStages: ["launch", "growth"],
    leverageClass: "delegate",
    status: "architecture",
  },
  {
    id: "build-referral-activation-plan",
    title: "Build Your Referral Activation Plan™",
    objective:
      "Identify your top five current or past clients, write a personal message to each asking for one specific type of referral, and create a simple follow-up system to track outcomes.",
    operatingPracticeId: "retention-referral",
    operatingPillarId: "revenue-engine",
    estimatedDuration: "1-hour",
    businessOutcome:
      "An activated referral network that generates qualified leads without advertising spend — the foundation of a Referral Engine™.",
    producedAsset: "referral-engine",
    owningExecutiveId: "sales-director",
    academyLessonId: "referral-system-design",
    successMetric:
      "At least one qualified referral conversation has been initiated within seven days of completing this assignment.",
    reflectionPrompt:
      "Which of your five clients responded? What does their response tell you about the strength of that relationship and the value they perceive you delivered?",
    followUpTrigger:
      "Referral messages sent but no systematic follow-up process is in place to repeat this monthly.",
    advancesOutcomes: ["build-compounding-assets"],
    primaryStages: ["launch", "growth", "scale"],
    leverageClass: "keep",
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // Operations & Systems™ pillar
  // -------------------------------------------------------------------------
  {
    id: "document-first-sop",
    title: "Document Your First Standard Operating Procedure™",
    objective:
      "Choose the one recurring task you perform most often that you wish someone else could handle, and document it step-by-step as a Standard Operating Procedure™.",
    operatingPracticeId: "sop-documentation",
    operatingPillarId: "operations-systems",
    estimatedDuration: "1-hour",
    businessOutcome:
      "One delegatable SOP™ — and the template and habit for building the rest of your Operations Library™ over time.",
    producedAsset: "standard-operating-procedure",
    owningExecutiveId: "operations-director",
    academyLessonId: "building-operating-systems",
    successMetric:
      "A team member or contractor could perform this task using only the SOP™ you created, without asking you a single question.",
    reflectionPrompt:
      "How long have you been performing this task manually? How many hours would you reclaim each month if it were fully delegated?",
    followUpTrigger:
      "First SOP™ documented but not yet tested by a delegation attempt or reviewed by the Operations Director™.",
    advancesOutcomes: ["reduce-execution-friction", "build-compounding-assets"],
    primaryStages: ["launch", "growth", "scale"],
    leverageClass: "delegate",
    status: "architecture",
  },
  {
    id: "design-first-ai-workflow",
    title: "Design Your First AI Workflow™",
    objective:
      "Identify the one communication or content creation task that takes the most time each week, and design an AI Workflow™ that handles the first draft — reducing your active time by at least 50%.",
    operatingPracticeId: "ai-integration",
    operatingPillarId: "operations-systems",
    estimatedDuration: "1-hour",
    businessOutcome:
      "One operational AI Workflow™ that reclaims recurring founder time — and the framework for identifying and building additional workflows.",
    producedAsset: "ai-workflow",
    owningExecutiveId: "operations-director",
    academyLessonId: "ai-leverage-for-founders",
    successMetric:
      "The identified task now takes 50% less of your time, and the workflow is documented well enough for a team member to operate it.",
    reflectionPrompt:
      "What was the quality of the AI first draft? What did you have to adjust — and could those adjustments become part of a better prompt or template?",
    followUpTrigger:
      "First AI Workflow™ built but not yet documented as a reusable template for the team.",
    advancesOutcomes: ["reduce-execution-friction", "build-compounding-assets"],
    primaryStages: ["launch", "growth", "scale"],
    leverageClass: "automate",
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // Financial Intelligence™ pillar
  // -------------------------------------------------------------------------
  {
    id: "create-financial-dashboard",
    title: "Create Your Financial Dashboard™",
    objective:
      "Set up a simple weekly financial tracking view — revenue, expenses, outstanding receivables, and cash on hand — that takes less than five minutes per week to update.",
    operatingPracticeId: "financial-review-rhythm",
    operatingPillarId: "financial-intelligence",
    estimatedDuration: "2-hours",
    businessOutcome:
      "A Financial Dashboard™ that gives you instant visibility into your business's financial health — eliminating the anxiety of not knowing your numbers.",
    producedAsset: "financial-dashboard",
    owningExecutiveId: "financial-advisor",
    academyLessonId: "financial-clarity-for-founders",
    successMetric:
      "You can answer these questions in under two minutes without opening your bank app: What is your current cash balance? What is your monthly revenue so far? What do you expect to collect in the next 30 days?",
    reflectionPrompt:
      "Before this dashboard, how did you make financial decisions? What changed now that you have visibility — and what are you still not seeing clearly?",
    followUpTrigger:
      "Financial Dashboard™ created but not yet reviewed in the Sunday Design Day™ weekly financial check-in.",
    advancesOutcomes: ["reduce-execution-friction", "build-compounding-assets"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    leverageClass: "automate",
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // Growth & Innovation™ pillar
  // -------------------------------------------------------------------------
  {
    id: "develop-signature-talk-outline",
    title: "Develop Your Signature Talk™ Outline",
    objective:
      "Create a one-page outline for a 20-minute presentation that delivers one transformational insight to your ideal client — and ends with a clear, natural invitation to work with you.",
    operatingPracticeId: "thought-leadership",
    operatingPillarId: "growth-innovation",
    estimatedDuration: "2-hours",
    businessOutcome:
      "The first draft outline of a Signature Talk™ — a permanently reusable asset that can be delivered live, recorded as a webinar, repurposed as a keynote, and used as the foundation of a lead generation system.",
    producedAsset: "signature-talk",
    owningExecutiveId: "marketing-director",
    academyLessonId: "signature-talk-framework",
    successMetric:
      "You have a one-page talk outline with a title, three key insights, one story, and a closing invitation — and you could deliver it from this outline without additional preparation.",
    reflectionPrompt:
      "What would it mean for your business if 500 of your ideal clients heard this talk? What is the one thing you want them to remember — and believe — after hearing it?",
    followUpTrigger:
      "Signature Talk™ outline completed but not yet delivered to a live or recorded audience.",
    advancesOutcomes: ["build-compounding-assets"],
    primaryStages: ["launch", "growth"],
    leverageClass: "keep",
    status: "architecture",
  },

  // -------------------------------------------------------------------------
  // Human Sustainability™ pillar (life protection tier)
  // -------------------------------------------------------------------------
  {
    id: "define-life-non-negotiables",
    title: "Define Your Life Non-Negotiables™",
    objective:
      "Write down the three to five commitments to your own life — health, relationships, recovery, joy — that your business will never be allowed to compromise, and install them as Operating Rules™.",
    operatingPracticeId: "daily-non-negotiables",
    operatingPillarId: "human-sustainability",
    estimatedDuration: "30-minutes",
    businessOutcome:
      "Installed Life Non-Negotiables™ that the Founder GPS™ will honor in every future recommendation — ensuring your business grows without costing you the life it's meant to fund.",
    producedAsset: "decision-framework",
    owningExecutiveId: "chief-of-staff",
    academyLessonId: "designing-your-life",
    successMetric:
      "Your Non-Negotiables™ are documented, specific, and would be recognized by someone who knows you well as things you actually mean.",
    reflectionPrompt:
      "Looking at last week — were your Non-Negotiables™ honored? If not, what was the actual cost to you, and what would you need to change to protect them next week?",
    followUpTrigger:
      "Non-Negotiables™ defined but not yet installed as GPS Operating Rules™ for the current week.",
    advancesOutcomes: ["honor-non-negotiables"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    leverageClass: "keep",
    status: "architecture",
  },
] as const

/* ===========================================================================
 * Lookup helpers
 * ======================================================================== */

/** Retrieve an assignment template by its stable id. */
export function getAssignmentById(
  id: string
): ExecutiveAssignmentTemplate | undefined {
  return ASSIGNMENT_TEMPLATES.find((t) => t.id === id)
}

/** Retrieve all templates for a given Operating Pillar™. */
export function getAssignmentsByPillar(
  pillarId: ExecutiveAssignmentTemplate["operatingPillarId"]
): readonly ExecutiveAssignmentTemplate[] {
  return ASSIGNMENT_TEMPLATES.filter(
    (t) => t.operatingPillarId === pillarId && t.status === "architecture"
  )
}

/** Retrieve all templates that produce a given Business Asset™. */
export function getAssignmentsByAsset(
  assetId: ExecutiveAssignmentTemplate["producedAsset"]
): readonly ExecutiveAssignmentTemplate[] {
  return ASSIGNMENT_TEMPLATES.filter(
    (t) => t.producedAsset === assetId && t.status === "architecture"
  )
}

/** Retrieve all templates appropriate for a given Business Stage™. */
export function getAssignmentsByStage(
  stage: ExecutiveAssignmentTemplate["primaryStages"][number]
): readonly ExecutiveAssignmentTemplate[] {
  return ASSIGNMENT_TEMPLATES.filter(
    (t) => t.primaryStages.includes(stage) && t.status === "architecture"
  )
}

/** Retrieve all templates that advance a given GPS Outcome™. */
export function getAssignmentsByOutcome(
  outcome: ExecutiveAssignmentTemplate["advancesOutcomes"][number]
): readonly ExecutiveAssignmentTemplate[] {
  return ASSIGNMENT_TEMPLATES.filter(
    (t) => t.advancesOutcomes.includes(outcome) && t.status === "architecture"
  )
}
