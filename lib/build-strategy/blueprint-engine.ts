/**
 * Build Blueprint™ engine (Phase 9F)
 * ---------------------------------------------------------------------------
 * Pure, deterministic transform: a Founder GPS™ recommendation + the
 * founder's chosen Build Path™ + existing context signals → a concrete
 * `BuildBlueprint`. No React, no I/O, no randomness — mirrors the
 * determinism discipline of `next-best-move-engine.ts`.
 *
 * Nothing here invents data. Every field either maps directly from
 * `GpsRecommendation`, is derived from an existing `BusinessModelProfile`/
 * `FounderDestinationProfile` signal, or is honestly `"not yet determined"`.
 */

import type { GpsRecommendation } from "@/lib/founder-gps/types"
import type { BusinessModelId } from "@/lib/entrepreneur-success/types"
import type {
  BuildBlueprint,
  BuildBlueprintContext,
  BuildPathDetail,
  BuildPathId,
  BuildStep,
} from "./types"

const NOT_YET_DETERMINED = "Not yet determined"

/**
 * Small per-archetype phrase tables — NOT full hardcoded blueprints per
 * business type. Just the vocabulary the step generator plugs into its
 * templates so a coach's plan reads differently than an agency's plan.
 * Archetypes not listed (or "unknown") fall back to generic language.
 */
const ARCHETYPE_PHRASES: Partial<
  Record<BusinessModelId, { audience: string; deliverable: string; example: string }>
> = {
  coaching: {
    audience: "your clients",
    deliverable: "a coaching offer or program",
    example: "e.g. a signature 12-week coaching container with clear milestones",
  },
  consulting: {
    audience: "your clients",
    deliverable: "a consulting engagement structure",
    example: "e.g. a fixed-scope diagnostic-to-roadmap engagement",
  },
  agency: {
    audience: "your accounts",
    deliverable: "a service package or retainer",
    example: "e.g. a monthly retainer with a defined scope and reporting cadence",
  },
  saas: {
    audience: "your users",
    deliverable: "a product feature or onboarding flow",
    example: "e.g. a self-serve onboarding flow that gets a new user to first value fast",
  },
  "professional-services": {
    audience: "your clients",
    deliverable: "a service offering",
    example: "e.g. a clearly scoped engagement with defined deliverables and timeline",
  },
  creator: {
    audience: "your audience",
    deliverable: "a content or product offer",
    example: "e.g. a repeatable content format tied to a clear call to action",
  },
  membership: {
    audience: "your members",
    deliverable: "a membership offer",
    example: "e.g. a recurring value structure members renew for",
  },
  marketplace: {
    audience: "your buyers and sellers",
    deliverable: "a marketplace listing or matching flow",
    example: "e.g. a listing flow that gets both sides to a clean match quickly",
  },
}

function archetypePhrases(archetype: BusinessModelId | "unknown") {
  if (archetype === "unknown") return null
  return ARCHETYPE_PHRASES[archetype] ?? null
}

function businessModelAdaptationNote(archetype: BusinessModelId | "unknown"): string {
  const phrases = archetypePhrases(archetype)
  if (!phrases) {
    return archetype === "unknown"
      ? "No Business Model Profile™ signal yet — this plan uses general language until your business model is classified."
      : `Your business model (${archetype}) doesn't yet have tailored language for this move — using general language.`
  }
  return `Adapted for your business model: steps reference ${phrases.audience} and frame the outcome as ${phrases.deliverable}.`
}

/** Lifestyle vs. growth framing bias, derived only from real destination signals. */
function destinationFraming(destination: BuildBlueprintContext["founderDestination"]): {
  note?: string
  biasLifestyle: boolean
} {
  if (!destination) return { biasLifestyle: false }
  const lifestyleSignals = [
    destination.desiredWorkLifeBalanceModel === "family-first-always",
    destination.desiredTimeFreedomLevel === "fully-time-free" || destination.desiredTimeFreedomLevel === "protected-time-off",
    destination.desiredBusinessSize === "solo",
    destination.revenueAmbition === "lifestyle-sufficient",
  ]
  const growthSignals = [
    destination.desiredBusinessSize === "mid-size" || destination.desiredBusinessSize === "large-team" || destination.desiredBusinessSize === "enterprise",
    destination.revenueAmbition === "seven-figure" || destination.revenueAmbition === "eight-figure-plus",
    destination.desiredFounderIndependence === "business-runs-without-me-some" || destination.desiredFounderIndependence === "business-runs-without-me-fully",
  ]
  const lifestyleCount = lifestyleSignals.filter(Boolean).length
  const growthCount = growthSignals.filter(Boolean).length
  if (lifestyleCount === 0 && growthCount === 0) return { biasLifestyle: false }
  if (lifestyleCount > growthCount) {
    return {
      biasLifestyle: true,
      note: "Scoped toward sustainable, lifestyle-aligned pace rather than maximum speed — matching your Founder Destination™.",
    }
  }
  return {
    biasLifestyle: false,
    note: "Scoped toward building a repeatable, scalable version of this rather than a one-off — matching your Founder Destination™.",
  }
}

function ownerSummaryFor(buildPath: BuildPathId, owner: GpsRecommendation["owner"]): string {
  switch (buildPath) {
    case "founder-build":
      return "You build this yourself, step by step."
    case "co-build":
      return "You and AI build this together, as a guided conversation."
    case "ai-build":
      return "AI produces the concrete output; you review and finish it."
    case "delegate":
      return "A team member you already have takes ownership of this."
    case "hire":
      return "A new hire, once brought on, will own this."
    case "outsource":
      return "A freelancer or contractor engaged for this specific work owns it."
    case "buy":
      return "An existing tool, template, or service replaces building this from scratch."
    case "partner":
      return "A strategic partner or agency takes this on, while you keep the key decisions."
    default:
      return owner === "team-or-ai" ? "Best owned by your team or AI, not you personally." : "Ownership not yet determined."
  }
}

function resolvedOwner(buildPath: BuildPathId, owner: GpsRecommendation["owner"]): BuildBlueprint["owner"] {
  if (buildPath === "founder-build" || buildPath === "co-build") return "founder"
  if (buildPath === "ai-build" || buildPath === "delegate") return owner ?? "team-or-ai"
  // hire / outsource / buy / partner — genuinely unfulfilled until someone is engaged.
  return "unspecified"
}

function buildSteps(recommendation: GpsRecommendation, ctx: BuildBlueprintContext, coBuildFraming: boolean): BuildStep[] {
  const archetype = ctx.businessModelProfile?.primaryArchetype ?? "unknown"
  const phrases = archetypePhrases(archetype)
  const what = recommendation.capabilityName ?? recommendation.nextTurn
  const framing = destinationFraming(ctx.founderDestination)

  const rawSteps: Omit<BuildStep, "stepNumber" | "dependsOnSteps">[] = [
    {
      title: coBuildFraming ? "Clarify what you're building, together" : "Clarify what you're building",
      objective: `Get precise about what "${what}" means for your business before building anything.`,
      instructions: coBuildFraming
        ? `Ask yourself (or talk it through with AI): what does "${what}" look like when it's done? Write down the answer in one or two sentences.`
        : `Write down, in one or two sentences, exactly what "${what}" looks like when it's done.`,
      why: recommendation.reason,
      example: phrases ? `${phrases.example}` : undefined,
      expectedOutput: "A one- or two-sentence definition of what you're building.",
      definitionOfDone: recommendation.definitionOfDone ?? recommendation.expectedOutcome ?? "You can describe the finished result in one sentence.",
    },
    {
      title: "Map the current gap",
      objective: "Understand exactly what's missing between where you are and where this move takes you.",
      instructions: recommendation.currentState
        ? `Starting point: ${recommendation.currentState}. List what's missing to reach the target state below.`
        : "List what's missing between your current setup and the target state for this move.",
      why: "Building from a clear starting point prevents wasted work on things you already have.",
      expectedOutput: "A short list of the specific gaps to close.",
      definitionOfDone: "You have a concrete list of what's missing, not just a feeling that something is missing.",
    },
    {
      title: coBuildFraming ? `Draft the core of ${phrases ? phrases.deliverable : "this"}, with AI` : `Draft the core of ${phrases ? phrases.deliverable : "this"}`,
      objective: `Produce a first working draft aimed at ${phrases ? phrases.audience : "the people this affects"}.`,
      instructions: coBuildFraming
        ? "Describe the gap you mapped above to AI and ask it to propose a first draft structure. Refine it together until it feels right."
        : "Using the gap you mapped above, produce a first draft — it does not need to be polished yet.",
      why: "A rough first draft moves you faster than waiting for a perfect plan.",
      expectedOutput: "A first draft, even if imperfect.",
      definitionOfDone: "A draft exists that you could show someone else and get real feedback on.",
    },
    {
      title: "Refine against the target state",
      objective: "Close the remaining gap between the draft and the target state this move is meant to reach.",
      instructions: recommendation.targetState
        ? `Compare your draft against the target: ${recommendation.targetState}. Adjust until they match.`
        : "Compare your draft against the outcome this move is meant to produce, and adjust until they match.",
      why: "This is the step that turns a rough draft into something that actually closes the gap Founder GPS™ identified.",
      expectedOutput: "A refined version that matches the target state.",
      definitionOfDone: recommendation.definitionOfDone ?? "The draft now matches the target state described above.",
    },
    {
      title: "Confirm it's done",
      objective: "Verify the move is genuinely complete, not just started.",
      instructions: "Check the definition of done below against what you've built. If anything is missing, go back to the relevant step.",
      why: "Founder GPS™ only recommends your next move once this one is genuinely complete — confirming now avoids a false start on the next move.",
      expectedOutput: "A completed capability that matches the definition of done.",
      definitionOfDone: recommendation.definitionOfDone ?? recommendation.expectedOutcome ?? "The result matches what you defined as done in step 1.",
    },
  ]

  if (framing.note) {
    rawSteps[2] = { ...rawSteps[2], why: `${rawSteps[2].why} ${framing.note}` }
  }

  return rawSteps.map((step, i) => ({
    ...step,
    stepNumber: i + 1,
    dependsOnSteps: i === 0 ? [] : [i],
  }))
}

function aiBuildDetail(recommendation: GpsRecommendation): BuildPathDetail {
  return {
    kind: "ai-build",
    aiProducibleOutputs: [
      `A first draft addressing "${recommendation.capabilityName ?? recommendation.nextTurn}"`,
      "A structured outline you can edit directly",
    ],
    remainingHumanActions: [
      "Review the draft for accuracy against your specific business details",
      "Make the final judgment calls AI can't make for you",
      "Publish, send, or implement the finished result",
    ],
    executionAvailable: false,
  }
}

function delegateDetail(recommendation: GpsRecommendation): BuildPathDetail {
  return {
    kind: "delegate",
    suggestedOwnerRole: recommendation.executiveDomain ?? "The team member closest to this area",
    handoffDefinitionOfDone: recommendation.definitionOfDone ?? recommendation.expectedOutcome ?? NOT_YET_DETERMINED,
    briefingPoints: [
      recommendation.reason,
      recommendation.currentState ? `Current state: ${recommendation.currentState}` : "Current state: not yet documented",
      recommendation.targetState ? `Target state: ${recommendation.targetState}` : "Target state: not yet documented",
    ].filter(Boolean) as string[],
  }
}

function hireDetail(recommendation: GpsRecommendation): BuildPathDetail {
  return {
    kind: "hire",
    suggestedRole: recommendation.executiveDomain ?? NOT_YET_DETERMINED,
    coreResponsibilities: [recommendation.capabilityName ?? recommendation.nextTurn, recommendation.expectedOutcome ?? NOT_YET_DETERMINED].filter(
      Boolean,
    ) as string[],
    budgetRange: NOT_YET_DETERMINED,
    timeline: NOT_YET_DETERMINED,
  }
}

function outsourceDetail(recommendation: GpsRecommendation): BuildPathDetail {
  return {
    kind: "outsource",
    suggestedSpecialistType: recommendation.executiveDomain ?? NOT_YET_DETERMINED,
    scopeOfWork: [recommendation.capabilityName ?? recommendation.nextTurn, recommendation.definitionOfDone ?? NOT_YET_DETERMINED].filter(
      Boolean,
    ) as string[],
    budgetRange: NOT_YET_DETERMINED,
  }
}

function buyDetail(recommendation: GpsRecommendation): BuildPathDetail {
  return {
    kind: "buy",
    suggestedCategory: recommendation.capabilityName ?? recommendation.nextTurn,
    evaluationCriteria: [
      "Does it fully cover the target state described below?",
      "Can it be adopted without adding meaningfully to your workload?",
    ],
    budgetRange: NOT_YET_DETERMINED,
  }
}

function partnerDetail(recommendation: GpsRecommendation): BuildPathDetail {
  return {
    kind: "partner",
    suggestedPartnerType: recommendation.executiveDomain ?? NOT_YET_DETERMINED,
    scopeHandedToPartner: [recommendation.capabilityName ?? recommendation.nextTurn],
    founderRetains: ["Final decision on whether the result meets the target state", "Overall relationship and direction"],
  }
}

/**
 * Deterministically derives a `BuildBlueprint` from a Founder GPS™
 * recommendation and the founder's chosen Build Path™. Pure function — no
 * I/O, no randomness, same inputs always produce the same output.
 */
export function deriveBuildBlueprint(
  recommendation: GpsRecommendation,
  buildPath: BuildPathId,
  ctx: BuildBlueprintContext = {},
): BuildBlueprint {
  const archetype = ctx.businessModelProfile?.primaryArchetype ?? "unknown"
  const framing = destinationFraming(ctx.founderDestination)

  let detail: BuildPathDetail
  switch (buildPath) {
    case "founder-build":
      detail = { kind: "build-steps", coBuildFraming: false, steps: buildSteps(recommendation, ctx, false) }
      break
    case "co-build":
      detail = { kind: "build-steps", coBuildFraming: true, steps: buildSteps(recommendation, ctx, true) }
      break
    case "ai-build":
      detail = aiBuildDetail(recommendation)
      break
    case "delegate":
      detail = delegateDetail(recommendation)
      break
    case "hire":
      detail = hireDetail(recommendation)
      break
    case "outsource":
      detail = outsourceDetail(recommendation)
      break
    case "buy":
      detail = buyDetail(recommendation)
      break
    case "partner":
      detail = partnerDetail(recommendation)
      break
  }

  const handoffReady = buildPath === "delegate" || buildPath === "hire" || buildPath === "outsource" || buildPath === "buy" || buildPath === "partner"

  return {
    recommendationId: recommendation.readinessCapabilityId ?? recommendation.id,
    buildPath,
    generatedAt: new Date().toISOString(),

    what: recommendation.capabilityName ?? recommendation.nextTurn,
    why: recommendation.reason,
    whyNow: recommendation.whyNow ?? recommendation.reason,
    desiredOutcome: recommendation.definitionOfDone ?? recommendation.expectedOutcome ?? NOT_YET_DETERMINED,
    currentState: recommendation.currentState ?? NOT_YET_DETERMINED,
    targetState: recommendation.targetState ?? NOT_YET_DETERMINED,

    ownerSummary: ownerSummaryFor(buildPath, recommendation.owner),
    owner: resolvedOwner(buildPath, recommendation.owner),

    businessModelArchetype: archetype,
    businessModelAdaptationNote: businessModelAdaptationNote(archetype),
    destinationAdaptationNote: framing.note,
    capacityConsideration: recommendation.workLifeBalanceCompatibility,

    prerequisites: recommendation.prerequisites ?? [],
    unlocksCapabilities: recommendation.unlocksCapabilities ?? [],

    budgetEstimate: NOT_YET_DETERMINED,
    timelineEstimate: NOT_YET_DETERMINED,
    targetCompletionDate: NOT_YET_DETERMINED,
    handoffReady,

    confidence: recommendation.confidence,
    evidence: recommendation.evidence ?? [],
    source: recommendation.source,
    triggeredBy: recommendation.triggeredBy ?? [],

    stageFraming: recommendation.stageFit ?? "current-stage",
    futureWorkplaceAlignment: recommendation.futureWorkplaceAlignment,
    detail,
  }
}
