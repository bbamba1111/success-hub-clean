/**
 * Business-Building Guide™ engine (Phase 12)
 * ---------------------------------------------------------------------------
 * Pure, deterministic derivation functions — no React, no I/O, no
 * randomness, mirroring `blueprint-engine.ts`'s discipline. Every function
 * here takes data that ALREADY exists (`ReadinessCapability`,
 * `GpsRecommendation`, `BuildBlueprint`, `BusinessConcept`) and reshapes it
 * into founder-facing guidance. Nothing is invented: a missing real signal
 * produces `status: "unknown"`, never fabricated copy.
 */

import type { GpsRecommendation } from "@/lib/founder-gps/types"
import type { BusinessOperatingFingerprint } from "@/lib/business-operating-fingerprint/types"
import type { ReadinessCapability } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import { getConceptExplanation } from "@/lib/business-concepts/business-concepts-registry"
import { getBuildPathDefinition } from "@/lib/build-strategy/build-path-registry"
import { archetypePhrases } from "@/lib/build-strategy/blueprint-engine"
import { isCommunicationPackageApplicable } from "@/lib/build-record/build-record-engine"
import type { BuildBlueprint, BuildPathId, RecommendedBuildPath, SecondOpinion } from "@/lib/build-strategy/types"
import { levelToCommunicationStyle, type UnderstandingLevelId } from "./understanding-level"
import type {
  AiBuildBoundaries,
  BuildPathEducation,
  BusinessBuildingGuide,
  CoBuildDivision,
  ConceptTeaching,
  DecisionSnapshot,
  FounderConfidenceState,
  FounderOwnershipGuidance,
  GuideSection,
  HandoffEducation,
  KnowledgeStatus,
  PathInstructionStep,
} from "./types"

const NOT_DETERMINED = "Not yet determined"

function known(body: string, items: string[] = []): { body: string; items: string[]; status: KnowledgeStatus } {
  return { body, items, status: "known" }
}
function inferred(body: string, items: string[] = []): { body: string; items: string[]; status: KnowledgeStatus } {
  return { body, items, status: "inferred" }
}
function unknown(): { body: string; items: string[]; status: KnowledgeStatus } {
  return { body: "", items: [], status: "unknown" }
}

/* ===========================================================================
 * derivePathInstructions — Part 17: WHAT/WHY/HOW/RESULT/NEXT sequence, used
 * by both the guide's "How To Build This" section and "Show Me How".
 * ======================================================================== */

export function derivePathInstructions(blueprint: BuildBlueprint): PathInstructionStep[] {
  const detail = blueprint.detail
  if (detail.kind === "build-steps") {
    return detail.steps.map((step) => ({
      what: step.title,
      why: step.why,
      how: step.instructions,
      result: step.expectedOutput,
      next: step.definitionOfDone,
    }))
  }
  if (detail.kind === "ai-build") {
    return [
      {
        what: "AI produces the concrete output",
        why: blueprint.why,
        how: detail.aiProducibleOutputs.join("; ") || NOT_DETERMINED,
        result: "A first draft ready for your review",
        next: detail.remainingHumanActions.join("; ") || "Review and finish the output.",
      },
    ]
  }
  if (detail.kind === "delegate") {
    return [
      {
        what: `Hand this to ${detail.suggestedOwnerRole}`,
        why: blueprint.why,
        how: detail.briefingPoints.join("; ") || NOT_DETERMINED,
        result: "The team member takes ownership of the work",
        next: detail.handoffDefinitionOfDone,
      },
    ]
  }
  if (detail.kind === "hire") {
    return [
      {
        what: `Hire for: ${detail.suggestedRole}`,
        why: blueprint.why,
        how: detail.coreResponsibilities.join("; ") || NOT_DETERMINED,
        result: "A new hire owns this going forward",
        next: `Budget: ${detail.budgetRange}. Timeline: ${detail.timeline}.`,
      },
    ]
  }
  if (detail.kind === "outsource") {
    return [
      {
        what: `Engage a ${detail.suggestedSpecialistType}`,
        why: blueprint.why,
        how: detail.scopeOfWork.join("; ") || NOT_DETERMINED,
        result: "A contractor delivers the scoped work",
        next: `Budget: ${detail.budgetRange}.`,
      },
    ]
  }
  if (detail.kind === "buy") {
    return [
      {
        what: `Buy a ${detail.suggestedCategory}`,
        why: blueprint.why,
        how: detail.evaluationCriteria.join("; ") || NOT_DETERMINED,
        result: "An existing solution replaces building this from scratch",
        next: `Budget: ${detail.budgetRange}.`,
      },
    ]
  }
  // partner
  return [
    {
      what: `Bring in a ${detail.suggestedPartnerType}`,
      why: blueprint.why,
      how: detail.scopeHandedToPartner.join("; ") || NOT_DETERMINED,
      result: "A partner or agency takes on the handed-off scope",
      next: `You retain: ${detail.founderRetains.join("; ") || NOT_DETERMINED}.`,
    },
  ]
}

/* ===========================================================================
 * deriveBusinessBuildingGuide — assembles 17 sections from real fields,
 * then `filterSectionsForLevel` slices a level-appropriate SUBSET of the
 * SAME assembled content. Changing level changes depth only, by
 * construction — the underlying section list is built once.
 * ======================================================================== */

export function deriveBusinessBuildingGuide(input: {
  recommendation: GpsRecommendation
  blueprint: BuildBlueprint
  capability?: ReadinessCapability
}): BusinessBuildingGuide {
  const { blueprint, capability } = input
  const pathDef = getBuildPathDefinition(blueprint.buildPath)
  const instructions = derivePathInstructions(blueprint)

  const sections: GuideSection[] = [
    {
      id: "principle",
      title: "The Principle Behind This",
      ...(capability ? known(capability.principle) : inferred(blueprint.why)),
    },
    {
      id: "capability",
      title: "What You're Building",
      ...(capability ? known(capability.capability) : inferred(blueprint.what)),
    },
    {
      id: "applies-when",
      title: "Why This Applies To You Right Now",
      ...(capability ? known(capability.appliesWhen) : inferred(blueprint.currentState)),
    },
    {
      id: "how-to-build",
      title: `How To Build This — ${pathDef.label}`,
      ...known(
        instructions[0]?.how ?? NOT_DETERMINED,
        instructions.map((s) => `${s.what}: ${s.how}`),
      ),
    },
    {
      id: "ownership",
      title: "Who Owns This",
      ...(capability?.ownership ? known(capability.ownership.founder) : inferred(blueprint.ownerSummary)),
    },
    {
      id: "required-roles",
      title: "Who Needs To Be Involved",
      ...(capability?.requiredRoles ? known("", capability.requiredRoles) : inferred(blueprint.ownerSummary)),
    },
    {
      id: "required-decisions",
      title: "The Real Decisions You'll Need To Make",
      ...(capability?.requiredDecisions ? known("", capability.requiredDecisions) : unknown()),
    },
    {
      id: "required-assets",
      title: "What Should Exist Once This Is Installed",
      ...(capability?.requiredAssets ? known("", capability.requiredAssets) : unknown()),
    },
    {
      id: "leading-indicators",
      title: "Signs This Is (Or Isn't) Working",
      ...(capability?.leadingIndicators ? known("", capability.leadingIndicators) : unknown()),
    },
    {
      id: "success-metrics",
      title: "How You'll Know It's Actually Working",
      ...(capability?.successMetrics ? known("", capability.successMetrics) : unknown()),
    },
    {
      id: "failure-modes",
      title: "Common Ways This Fails",
      ...(capability?.failureModes ? known("", capability.failureModes) : unknown()),
    },
    {
      id: "contraindications",
      title: "When NOT To Do This",
      ...(capability?.contraindications ? known("", capability.contraindications) : unknown()),
    },
    {
      id: "limitations",
      title: "Known Limitations",
      ...(capability?.limitations ? known("", capability.limitations) : unknown()),
    },
    {
      id: "prerequisites",
      title: "Build These First",
      ...known(
        blueprint.prerequisites.length === 0 ? "Nothing else needs to be in place first." : "",
        blueprint.prerequisites.map((p) => p.title),
      ),
    },
    {
      id: "unlocks",
      title: "What This Unlocks Next",
      ...known(
        blueprint.unlocksCapabilities.length === 0 ? "Nothing specific yet identified." : "",
        blueprint.unlocksCapabilities.map((u) => u.title),
      ),
    },
    {
      id: "sequencing",
      title: "The Order This Usually Happens In",
      ...(capability?.sequencing ? known("", capability.sequencing) : known("", instructions.map((s) => s.what))),
    },
    {
      id: "business-model-adaptation",
      title: "How This Was Adapted For Your Business",
      ...known(blueprint.businessModelAdaptationNote),
    },
    {
      id: "capacity",
      title: "How This Fits Your Current Capacity",
      ...(blueprint.capacityConsideration ? known(blueprint.capacityConsideration) : unknown()),
    },
  ]

  return { sections }
}

/** The full assembled section order — the SAME list every level slices from. */
const SECTION_ORDER = [
  "principle",
  "capability",
  "applies-when",
  "how-to-build",
  "ownership",
  "required-roles",
  "prerequisites",
  "required-decisions",
  "required-assets",
  "sequencing",
  "business-model-adaptation",
  "leading-indicators",
  "success-metrics",
  "capacity",
  "failure-modes",
  "contraindications",
  "unlocks",
  "limitations",
]

/** How many of the 18 assembled sections each Understanding Level™ surfaces — a prefix of the SAME ordered list, never a rewrite. */
const LEVEL_SECTION_COUNTS: Record<UnderstandingLevelId, number> = {
  simple: 6,
  practical: 9,
  founder: 12,
  strategic: 15,
  executive: 18,
}

/** filterSectionsForLevel — the founder's Understanding Level™ changes DEPTH only, never the underlying content. */
export function filterSectionsForLevel(guide: BusinessBuildingGuide, level: UnderstandingLevelId): BusinessBuildingGuide {
  const count = LEVEL_SECTION_COUNTS[level]
  const allowedIds = new Set(SECTION_ORDER.slice(0, count))
  return { sections: guide.sections.filter((s) => allowedIds.has(s.id)) }
}

/* ===========================================================================
 * deriveDecisionSnapshot — Part: the 9-field at-a-glance summary.
 * ======================================================================== */

export function deriveDecisionSnapshot(
  recommendation: GpsRecommendation,
  recommendedPath: RecommendedBuildPath,
  founderChosenPath: BuildPathId | null,
  blueprint: BuildBlueprint | null,
  secondOpinion: SecondOpinion | null,
): DecisionSnapshot {
  const what = recommendation.capabilityName ?? recommendation.nextTurn
  const recommendedLabel = recommendedPath.buildPath ? getBuildPathDefinition(recommendedPath.buildPath).label : "No path recommended"

  return {
    what,
    why: recommendation.reason,
    whyNow: recommendation.whyNow ?? "No explicit why-now signal exists yet — timing is not strongly evidenced either way.",
    recommendedPath: { id: recommendedPath.buildPath, label: recommendedLabel, reason: recommendedPath.reason },
    founderChosenPath,
    confidence: recommendation.confidence
      ? { label: recommendation.confidence, status: "known" }
      : { label: "Not yet determined", status: "unknown" },
    riskOfDoingNothing:
      secondOpinion?.riskOfDoingNothing ??
      `If "${what}" isn't built, the expected outcome (${recommendation.expectedOutcome ?? recommendation.definitionOfDone ?? "not yet determined"}) won't happen.`,
    owner: blueprint?.ownerSummary ?? (recommendation.owner === "founder" ? "You" : "Not yet determined"),
    nextAction: founderChosenPath
      ? { label: "Review your Build Blueprint™", description: "Your plan is ready — review it in Build Command Center™." }
      : { label: "Choose how to build it", description: "Pick a Build Path™ below to turn this into a concrete plan." },
  }
}

/* ===========================================================================
 * deriveBuildPathEducation — the 9-field explanation of a Build Path™.
 * ======================================================================== */

const PATH_EDUCATION_COPY: Record<
  BuildPathId,
  Pick<BuildPathEducation, "whenItFitsBest" | "whenToAvoid" | "founderInputNeeded" | "riskLevel" | "howToStart">
> = {
  "founder-build": {
    whenItFitsBest: "You have the time and this is work only you should be trusted with right now.",
    whenToAvoid: "You're already at capacity, or this is repeatable work that doesn't need your personal touch.",
    founderInputNeeded: "All of it — you do the work, step by step.",
    riskLevel: "Low risk to quality, but consumes your own time and attention.",
    howToStart: "Open the step-by-step plan below and start with step one.",
  },
  "co-build": {
    whenItFitsBest: "You want to move faster than solo, but still make every judgment call yourself.",
    whenToAvoid: "You'd rather AI produce a finished draft outright, or you have no time for a guided dialogue.",
    founderInputNeeded: "Your judgment at every decision point — AI drafts, you decide.",
    riskLevel: "Low risk — you review every step as it's built.",
    howToStart: "Work through the guided steps below with AI, one at a time.",
  },
  "ai-build": {
    whenItFitsBest: "The output is concrete enough for AI to produce directly and you can review it critically.",
    whenToAvoid: "The work requires judgment calls only you can make, or nothing AI produces here is verifiable by you.",
    founderInputNeeded: "A careful review of the output before you use it.",
    riskLevel: "Moderate — review carefully; AI cannot make the final judgment calls for you.",
    howToStart: "Generate the AI output below, then review and finish it.",
  },
  delegate: {
    whenItFitsBest: "A team member with real capacity already exists and can be briefed clearly.",
    whenToAvoid: "No one on the team has bandwidth, or the work needs founder-only judgment.",
    founderInputNeeded: "A clear brief and a check on the handoff definition of done.",
    riskLevel: "Depends on the team member's current capacity and how clear the brief is.",
    howToStart: "Share the briefing points below with the team member taking this on.",
  },
  hire: {
    whenItFitsBest: "This work is ongoing and durable capacity is worth the time and cost to build.",
    whenToAvoid: "The work is one-off, or you can't yet commit the budget and timeline hiring requires.",
    founderInputNeeded: "Deciding on the role, budget, and who to bring on.",
    riskLevel: "Higher up-front cost and time before this specific move is underway.",
    howToStart: "Use the role definition below to start recruiting.",
  },
  outsource: {
    whenItFitsBest: "You need specialist execution for this specific piece of work without a long-term commitment.",
    whenToAvoid: "The scope isn't clear yet, or you can't provide ongoing oversight.",
    founderInputNeeded: "A clear scope of work and periodic oversight.",
    riskLevel: "Requires clear scoping and ongoing oversight to stay on track.",
    howToStart: "Brief a contractor using the scope of work below.",
  },
  buy: {
    whenItFitsBest: "An existing tool, template, or service already solves this well enough.",
    whenToAvoid: "Your needs are specific enough that nothing off-the-shelf will fit.",
    founderInputNeeded: "Evaluating options against the criteria below and making the purchase decision.",
    riskLevel: "Usually the fastest path, but may not fit your exact needs as precisely as something built for you.",
    howToStart: "Evaluate options against the criteria below, then purchase.",
  },
  partner: {
    whenItFitsBest: "You need capability you don't have in-house and are comfortable sharing some decision rights.",
    whenToAvoid: "You need to retain full control, or the upside isn't worth sharing.",
    founderInputNeeded: "Deciding what to hand off vs. retain, and negotiating the partnership.",
    riskLevel: "Can unlock capability you lack, but means sharing decision rights and often some upside.",
    howToStart: "Use the scope below to start the conversation with a potential partner.",
  },
}

export function deriveBuildPathEducation(blueprint: BuildBlueprint): BuildPathEducation {
  const pathDef = getBuildPathDefinition(blueprint.buildPath)
  const copy = PATH_EDUCATION_COPY[blueprint.buildPath]
  return {
    buildPath: blueprint.buildPath,
    label: pathDef.label,
    whatItMeans: pathDef.description,
    ...copy,
    timeCommitment:
      blueprint.timelineEstimate !== NOT_DETERMINED
        ? { value: blueprint.timelineEstimate, status: "known" }
        : { value: NOT_DETERMINED, status: "unknown" },
    costImplication:
      blueprint.budgetEstimate !== NOT_DETERMINED
        ? { value: blueprint.budgetEstimate, status: "known" }
        : { value: NOT_DETERMINED, status: "unknown" },
  }
}

/* ===========================================================================
 * deriveCoBuildDivision — Co-Build™ only. Categorizes the EXISTING step
 * text into founder/AI/together roles — invents no new content.
 * ======================================================================== */

const FOUNDER_KEYWORDS = ["clarify", "confirm", "decide", "approve", "choose", "review"]
const AI_KEYWORDS = ["draft", "generate", "produce", "write", "suggest"]

export function deriveCoBuildDivision(blueprint: BuildBlueprint): CoBuildDivision | null {
  if (blueprint.buildPath !== "co-build" || blueprint.detail.kind !== "build-steps") return null
  const division: CoBuildDivision = { founderSteps: [], aiSteps: [], togetherSteps: [] }
  for (const step of blueprint.detail.steps) {
    const text = `${step.title} ${step.objective} ${step.instructions}`.toLowerCase()
    const entry = { title: step.title, detail: step.instructions }
    if (FOUNDER_KEYWORDS.some((k) => text.includes(k))) division.founderSteps.push(entry)
    else if (AI_KEYWORDS.some((k) => text.includes(k))) division.aiSteps.push(entry)
    else division.togetherSteps.push(entry)
  }
  return division
}

/* ===========================================================================
 * deriveAiBuildBoundaries — AI Build™ only.
 * ======================================================================== */

export function deriveAiBuildBoundaries(blueprint: BuildBlueprint): AiBuildBoundaries | null {
  if (blueprint.buildPath !== "ai-build" || blueprint.detail.kind !== "ai-build") return null
  return {
    aiCanDo: blueprint.detail.aiProducibleOutputs,
    founderMustApprove: blueprint.detail.remainingHumanActions,
    aiNeedsAccessTo: { items: [], status: "unknown" },
  }
}

/* ===========================================================================
 * deriveFounderOwnershipGuidance
 * ======================================================================== */

export function deriveFounderOwnershipGuidance(blueprint: BuildBlueprint, capability?: ReadinessCapability): FounderOwnershipGuidance {
  const handOffItems = (() => {
    const detail = blueprint.detail
    if (detail.kind === "delegate") return detail.briefingPoints
    if (detail.kind === "outsource") return detail.scopeOfWork
    if (detail.kind === "hire") return detail.coreResponsibilities
    if (detail.kind === "buy") return detail.evaluationCriteria
    if (detail.kind === "partner") return detail.scopeHandedToPartner
    return []
  })()

  return {
    whatToUnderstand: capability ? { text: capability.principle, status: "known" } : { text: blueprint.why, status: "inferred" },
    whatToOwn: capability?.ownership
      ? { text: capability.ownership.founder, status: "known" }
      : { text: blueprint.ownerSummary, status: "inferred" },
    whatNotToDo: capability?.contraindications
      ? { items: capability.contraindications, status: "known" }
      : { items: [], status: "unknown" },
    whatToHandOff: handOffItems.length > 0 ? { items: handOffItems, status: "known" } : { items: [], status: "unknown" },
  }
}

/* ===========================================================================
 * deriveHandoffEducation — the 5 external/capacity Build Paths™ only.
 * ======================================================================== */

export function deriveHandoffEducation(blueprint: BuildBlueprint): HandoffEducation | null {
  if (!isCommunicationPackageApplicable(blueprint.buildPath)) return null
  const detail = blueprint.detail

  if (detail.kind === "delegate") {
    return {
      buildPath: blueprint.buildPath,
      roleOrType: detail.suggestedOwnerRole,
      scopeItems: detail.briefingPoints,
      budgetEstimate: NOT_DETERMINED,
      timelineEstimate: NOT_DETERMINED,
      handoffDefinitionOfDone: detail.handoffDefinitionOfDone,
      founderRetains: ["The final decision on whether the result meets the target state"],
    }
  }
  if (detail.kind === "hire") {
    return {
      buildPath: blueprint.buildPath,
      roleOrType: detail.suggestedRole,
      scopeItems: detail.coreResponsibilities,
      budgetEstimate: detail.budgetRange,
      timelineEstimate: detail.timeline,
      handoffDefinitionOfDone: blueprint.desiredOutcome,
      founderRetains: ["The final hiring decision"],
    }
  }
  if (detail.kind === "outsource") {
    return {
      buildPath: blueprint.buildPath,
      roleOrType: detail.suggestedSpecialistType,
      scopeItems: detail.scopeOfWork,
      budgetEstimate: detail.budgetRange,
      timelineEstimate: NOT_DETERMINED,
      handoffDefinitionOfDone: blueprint.desiredOutcome,
      founderRetains: ["The final decision on whether the result meets the target state"],
    }
  }
  if (detail.kind === "buy") {
    return {
      buildPath: blueprint.buildPath,
      roleOrType: detail.suggestedCategory,
      scopeItems: detail.evaluationCriteria,
      budgetEstimate: detail.budgetRange,
      timelineEstimate: NOT_DETERMINED,
      handoffDefinitionOfDone: blueprint.desiredOutcome,
      founderRetains: ["The final purchase decision"],
    }
  }
  // partner
  if (detail.kind === "partner") {
    return {
      buildPath: blueprint.buildPath,
      roleOrType: detail.suggestedPartnerType,
      scopeItems: detail.scopeHandedToPartner,
      budgetEstimate: NOT_DETERMINED,
      timelineEstimate: NOT_DETERMINED,
      handoffDefinitionOfDone: blueprint.desiredOutcome,
      founderRetains: detail.founderRetains,
    }
  }
  return null
}

/* ===========================================================================
 * teachMeThis — Part 7: passthrough of the Business Concepts™ registry.
 * ======================================================================== */

export function teachMeThis(capability: ReadinessCapability | undefined, level: UnderstandingLevelId): ConceptTeaching[] {
  if (!capability || capability.businessConcepts.length === 0) return []
  const style = levelToCommunicationStyle(level)
  return capability.businessConcepts.map((conceptId) => {
    const explanation = getConceptExplanation(conceptId, style)
    return {
      conceptId,
      term: conceptId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      explanation: explanation ?? "",
      status: explanation ? "known" : "unknown",
    }
  })
}

/* ===========================================================================
 * showMeAnExample — Part 8.
 * ======================================================================== */

export function showMeAnExample(blueprint: BuildBlueprint): { text: string; status: KnowledgeStatus } {
  if (blueprint.detail.kind === "build-steps" && blueprint.detail.steps[0]?.example) {
    return { text: blueprint.detail.steps[0].example, status: "known" }
  }
  const phrases = archetypePhrases(blueprint.businessModelArchetype)
  if (phrases) return { text: phrases.example, status: "inferred" }
  return { text: "", status: "unknown" }
}

/* ===========================================================================
 * goDeeper — Part 10: strategic/executive-depth addendum, shown on demand.
 * ======================================================================== */

export function goDeeper(
  recommendation: GpsRecommendation,
  blueprint: BuildBlueprint,
  fingerprint?: BusinessOperatingFingerprint,
): { items: string[]; status: KnowledgeStatus } {
  const items: string[] = []
  if (recommendation.explainability?.influencingSignals?.length) {
    items.push(`Traced to ${recommendation.explainability.influencingSignals.length} influencing signal(s) in the Executive Decision Engine™.`)
  }
  if (blueprint.futureWorkplaceAlignment) items.push(blueprint.futureWorkplaceAlignment)
  if (blueprint.unlocksCapabilities.length > 0) {
    items.push(`Dependency chain: completing this unlocks ${blueprint.unlocksCapabilities.map((u) => u.title).join(", ")}.`)
  }
  if (fingerprint && fingerprint.founderDependency !== "unknown") {
    items.push(`Your Business Operating Fingerprint™ shows founder dependency at "${fingerprint.founderDependency}" — a signal for how much this move should reduce reliance on you personally.`)
  }
  if (fingerprint && fingerprint.scaleMechanism !== "unknown" && fingerprint.scaleMechanism.length > 0) {
    items.push(`Your business scales primarily through: ${fingerprint.scaleMechanism.join(", ")} — this move is evaluated against that scale mechanism.`)
  }
  return items.length > 0 ? { items, status: "known" } : { items: [], status: "unknown" }
}

/* ===========================================================================
 * deriveFounderConfidenceState — Part 13: 5 states, each pointing at an
 * EXISTING UI action, never a new recommendation.
 * ======================================================================== */

export function deriveFounderConfidenceState(
  hasRecommendation: boolean,
  buildPath: BuildPathId | null,
  hasInternalTeamCapacity?: boolean,
): FounderConfidenceState {
  if (!hasRecommendation) {
    return {
      id: "no-recommendation-yet",
      message: "There's no active Next Best Move™ yet — complete your assessments so Founder GPS™ can surface one.",
      action: { label: "Go to Founder GPS™", target: "founder-gps" },
    }
  }
  if (!buildPath) {
    return {
      id: "recommendation-not-started",
      message: "You have a recommendation but haven't chosen how to build it yet.",
      action: { label: "Choose a Build Path™", target: "build-path-picker" },
    }
  }
  if (hasInternalTeamCapacity === false && isCommunicationPackageApplicable(buildPath)) {
    return {
      id: "capacity-constrained",
      message: "You've chosen an external path while your team capacity is limited — it's worth double-checking this is the right call.",
      action: { label: "Get a Second Opinion™", target: "second-opinion" },
    }
  }
  if (buildPath) {
    return {
      id: "path-chosen",
      message: "Your Build Path™ is chosen. Review the guide before you start.",
      action: { label: "Review the Business-Building Guide™", target: "business-building-guide" },
    }
  }
  return {
    id: "confident-and-moving",
    message: "You're moving on this — track progress in Build Command Center™.",
    action: { label: "Open Build Command Center™", target: "build-command-center" },
  }
}
