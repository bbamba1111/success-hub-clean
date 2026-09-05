/**
 * Build Path Selection™ + Second Opinion™ engine (Phase 11)
 * ---------------------------------------------------------------------------
 * Two pure functions. Neither is a new intelligence engine — both explain
 * signals that Founder GPS™ and the Executive Decision Engine™ already
 * produced (`GpsRecommendation.leverageMode`/`owner`/`explainability`/
 * `confidence`) plus the existing Build Blueprint™ for the path in question.
 *
 *   - `deriveRecommendedBuildPath()`: maps the EDE's existing Leverage
 *     Class™ + owner signal onto one of the 8 canonical Build Path™ ids.
 *   - `deriveSecondOpinion()`: answers the founder's 9 Second Opinion™
 *     questions by restating existing signals in plain language — never
 *     inventing new scoring or new reasoning.
 */

import type { GpsRecommendation } from "@/lib/founder-gps/types"
import { BUILD_PATH_DEFINITIONS } from "./build-path-registry"
import type { BuildBlueprint, BuildPathId, BuildPathSelectionContext, RecommendedBuildPath, SecondOpinion } from "./types"

type RecommendationSignal = Pick<
  GpsRecommendation,
  | "leverageMode"
  | "owner"
  | "reason"
  | "whyNow"
  | "confidence"
  | "evidence"
  | "explainability"
  | "capabilityName"
  | "nextTurn"
  | "currentState"
  | "targetState"
  | "expectedOutcome"
  | "definitionOfDone"
  | "prerequisites"
  | "workLifeBalanceCompatibility"
  | "stageFit"
>

/**
 * deriveRecommendedBuildPath — turns the EDE's existing Leverage Class™
 * (`keep` / `delegate` / `automate` / `eliminate`) plus the GPS-assigned
 * `owner` into a recommended Build Path™ id. `buildPath` is `null` only when
 * the underlying classification is "eliminate" — no Build Path applies to
 * work that shouldn't be built at all.
 */
export function deriveRecommendedBuildPath(
  recommendation: RecommendationSignal,
  context: BuildPathSelectionContext = {},
): RecommendedBuildPath {
  const what = recommendation.capabilityName ?? recommendation.nextTurn

  if (recommendation.leverageMode === "eliminate") {
    return {
      buildPath: null,
      reason: `The Executive Decision Engine™ classified "${what}" as "eliminate" — this may not be worth building at all. ${recommendation.reason}`,
    }
  }

  if (recommendation.leverageMode === "keep" || recommendation.owner === "founder") {
    return {
      buildPath: "founder-build",
      reason: `This is classified as work only you should do (Leverage Class™: "keep"). ${recommendation.reason}`,
    }
  }

  if (recommendation.leverageMode === "automate") {
    return {
      buildPath: "ai-build",
      reason: `The Executive Decision Engine™ classified this as "automate" — AI is best positioned to produce this directly. ${recommendation.reason}`,
    }
  }

  if (recommendation.leverageMode === "delegate" || recommendation.owner === "team-or-ai") {
    if (context.hasInternalTeamCapacity === true) {
      return {
        buildPath: "delegate",
        reason: `This is classified as delegable work, and you have internal team capacity available — hand it to the team member closest to this area. ${recommendation.reason}`,
      }
    }
    if (context.hasInternalTeamCapacity === false) {
      return {
        buildPath: "outsource",
        reason: `This is classified as delegable work, but no internal team capacity is available right now — outsourcing to a contractor is the lowest-commitment way to get it done. Hiring, buying an existing solution, or partnering are also reasonable if you'd rather commit further. ${recommendation.reason}`,
      }
    }
    return {
      buildPath: "delegate",
      reason: `This is best owned by your team or AI, not you personally. Assign it to whichever team member has capacity — if no one does, hiring, outsourcing, buying, or partnering are the alternatives. ${recommendation.reason}`,
    }
  }

  return {
    buildPath: null,
    reason: "Not enough signal yet to recommend a specific Build Path™ for this move — choose based on your own judgment.",
  }
}

/** Per-path tradeoff phrasing — plain data, not a new engine, matching the style of `ownerSummaryFor` in `blueprint-engine.ts`. */
const TRADEOFFS: Record<BuildPathId, string> = {
  "founder-build": "Doing this yourself protects quality and keeps cost at zero, but consumes your own time and attention.",
  "co-build": "Building it with AI is faster than doing it fully solo, but still requires your judgment at every decision point.",
  "ai-build": "Letting AI produce it is fastest, but you must review the output carefully — AI cannot make the final judgment calls for you.",
  delegate: "Delegating frees your time, but requires a clear brief, and quality depends on the team member's current capacity.",
  hire: "Hiring builds durable capacity, but costs time and money before this specific move is even underway.",
  outsource: "Outsourcing gets specialist execution without a long-term commitment, but requires clear scoping and ongoing oversight.",
  buy: "Buying is usually the fastest path to a working result, but may not fit your exact needs as precisely as something built for you.",
  partner: "Partnering can unlock capability you don't have in-house, but means sharing decision rights and often some of the upside.",
}

function alternativesTo(recommended: BuildPathId | null): string[] {
  return BUILD_PATH_DEFINITIONS.filter((p) => p.id !== recommended).map((p) => p.label)
}

/**
 * deriveSecondOpinion — answers the founder's 9 Second Opinion™ questions by
 * restating existing Founder GPS™/EDE/Build Blueprint™ signals. When a
 * signal genuinely doesn't exist, the answer says so honestly rather than
 * inventing one.
 */
export function deriveSecondOpinion(
  recommendation: RecommendationSignal,
  recommendedPath: RecommendedBuildPath,
  founderSelectedPath: BuildPathId | null,
  blueprint: BuildBlueprint | null = null,
): SecondOpinion {
  const what = recommendation.capabilityName ?? recommendation.nextTurn
  const currentState = recommendation.currentState ?? "not yet documented"
  const targetState = recommendation.targetState ?? "not yet documented"
  const outcome = recommendation.expectedOutcome ?? recommendation.definitionOfDone ?? "not yet determined"

  const isRightThingToBuild = recommendation.confidence
    ? `${recommendation.reason} (confidence in this recommendation: ${recommendation.confidence})`
    : recommendation.reason

  const outstandingPrerequisites = recommendation.prerequisites?.length ?? 0
  const isRightTime = recommendation.whyNow
    ? outstandingPrerequisites > 0
      ? `${recommendation.whyNow} Note: ${outstandingPrerequisites} prerequisite(s) should be in place first.`
      : recommendation.whyNow
    : "No explicit why-now signal exists yet for this move — timing is not strongly evidenced either way."

  const isRightBuildPath =
    founderSelectedPath && recommendedPath.buildPath && founderSelectedPath !== recommendedPath.buildPath
      ? `The recommendation was "${recommendedPath.buildPath}" — you're considering "${founderSelectedPath}" instead. ${recommendedPath.reason}`
      : recommendedPath.reason

  const tradeoffs: string[] = []
  if (recommendedPath.buildPath) tradeoffs.push(TRADEOFFS[recommendedPath.buildPath])
  if (founderSelectedPath && founderSelectedPath !== recommendedPath.buildPath) tradeoffs.push(TRADEOFFS[founderSelectedPath])

  const whatWouldChangeThisRecommendation =
    recommendation.explainability?.influencingSignals && recommendation.explainability.influencingSignals.length > 0
      ? recommendation.explainability.influencingSignals.map((s) => `A change in: ${JSON.stringify(s)}`)
      : [
          "A change in your available capacity or team support",
          "A change in budget available for this move",
          "New evidence that this move is more or less urgent than currently understood",
        ]

  let founderShouldRetain: string[] = ["The final decision on whether the result meets the target state"]
  let canBeHandedOff: string[] = []
  if (blueprint?.detail.kind === "partner") {
    founderShouldRetain = blueprint.detail.founderRetains
    canBeHandedOff = blueprint.detail.scopeHandedToPartner
  } else if (blueprint?.detail.kind === "delegate") {
    canBeHandedOff = blueprint.detail.briefingPoints
  } else if (blueprint?.detail.kind === "outsource") {
    canBeHandedOff = blueprint.detail.scopeOfWork
  } else if (blueprint?.detail.kind === "hire") {
    canBeHandedOff = blueprint.detail.coreResponsibilities
  }

  const riskOfDoingNothing = `If "${what}" isn't built, you stay at "${currentState}" instead of reaching "${targetState}" — and the expected outcome ("${outcome}") won't happen.`

  return {
    isRightThingToBuild,
    isRightTime,
    isRightBuildPath,
    alternatives: alternativesTo(recommendedPath.buildPath),
    tradeoffs,
    whatWouldChangeThisRecommendation,
    founderShouldRetain,
    canBeHandedOff,
    riskOfDoingNothing,
  }
}
