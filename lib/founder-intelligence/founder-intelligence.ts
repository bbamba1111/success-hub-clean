/**
 * Founder Intelligence™ — Operating Brief™ Orchestration (Phase 5.9)
 * ---------------------------------------------------------------------------
 * The intelligence layer of the Harmony Lane™ Operating System. Cherry
 * Blossom™ is the INTERFACE; the intelligence itself lives here — so future
 * interfaces (voice, mobile, team experiences) can all draw on the same layer.
 *
 * This module activates the intelligence already present in the Operating
 * System by ORCHESTRATING the existing registries against live Harmony
 * Context™. It answers a single question: "Given everything we know about this
 * founder and this exact moment, what should today's private Chief of Staff
 * put in front of them?"
 *
 *   Guiding principle: same PRINCIPLES for everyone, adapted COMMUNICATION and
 *   EMPHASIS for the individual. Two founders who ask the same question receive
 *   the same underlying business truth, surfaced differently.
 *
 * IMPORTANT — this is DETERMINISTIC orchestration, NOT generative AI. There is
 * no large language model, no autonomous reasoning, and no network call. Every
 * selection is a pure, explainable function of the registries + context, so the
 * Operating Brief™ is testable today and easy to upgrade to real reasoning
 * later WITHOUT changing this contract.
 *
 * Reasoning order mirrors CHERRY_BLOSSOM_REASONING_HIERARCHY (§8.11):
 *   Context → Knowledge → Concepts → Executives → Advisors → Academy →
 *   Deliverables → AI Augmentation Hour™ → Founder Recommendation.
 */

import type { HarmonyContextValue } from "@/lib/harmony-context/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import { getExecutive, type Executive } from "@/lib/executive-team/executive-registry"
import { getAdvisor, type Advisor } from "@/lib/advisory-network/advisor-registry"
import { EXECUTIVE_INSIGHTS, type AcademyItem } from "@/lib/harmony-academy/academy-registry"
import { DELIVERABLES, type Deliverable } from "@/lib/output-architecture/deliverable-registry"

/* ===========================================================================
 * Operating Brief™ shape
 * ---------------------------------------------------------------------------
 * The single artifact Founder Intelligence™ produces. It reads like a private
 * Chief of Staff's morning brief: who to bring in, what to learn, what to
 * produce, and the one commitment to honor — all tied to the founder's context.
 * ======================================================================== */

/** An executive Cherry Blossom™ would assemble today, with the reason why. */
export interface BriefExecutive {
  id: string
  name: string
  title: string
  /** Plain-language reason this executive is on today's team. */
  reason: string
}

/** An advisor that may become relevant, with the reason why. */
export interface BriefAdvisor {
  id: string
  name: string
  title: string
  reason: string
}

/** A recommended Executive Insight™ from Harmony Business Academy™. */
export interface BriefInsight {
  id: string
  title: string
  description: string
  estimatedDuration: string
  reason: string
}

/** A recommended Deliverable™ the founder could put to work today. */
export interface BriefDeliverable {
  id: string
  name: string
  description: string
  estimatedTime: string
  reason: string
}

/** One traceable step in how the brief was assembled (explainability). */
export interface BriefReasoningStep {
  system: string
  note: string
}

/** The complete Operating Brief™ for the current founder + moment. */
export interface OperatingBrief {
  /** Whether a week has been designed — drives the empty vs full brief. */
  hasDesignedWeek: boolean
  /** Context-aware greeting, e.g. "Good Morning, Barbara." */
  greeting: string
  /** Time-of-day-aware framing line for the brief. */
  headline: string
  /** e.g. "Tuesday". */
  dayName: string
  /** This week's intention, if designed. */
  intention: string | null
  /** The current Operating Segment™ title (or resting state). */
  segmentTitle: string
  /** Today's Operating Rule™ for the current segment, if any. */
  operatingRule: string | null
  /** Today's Daily Non-Negotiable™ for the current segment, if any. */
  dailyNonNegotiable: string | null
  /** The Executive Leadership Team™ assembled for today's priorities. */
  executives: BriefExecutive[]
  /** Professional Advisors™ that may become relevant. */
  advisors: BriefAdvisor[]
  /** One recommended Executive Insight™ (or null if none fits). */
  insight: BriefInsight | null
  /** One or more recommended Deliverables™. */
  deliverables: BriefDeliverable[]
  /** A concise explanation, written at the founder's Comprehension™ level. */
  explanation: string
  /** The Communication Style™ the explanation is written in (brand name). */
  communicationStyleName: string
  /** The Preferred Language™ the brief is delivered in (endonym). */
  languageName: string
  /** True until the chosen language is fully translated (English fallback). */
  isEnglishFallback: boolean
  /** Business Stage™ this brief is tuned to (brand-free id + description). */
  businessStage: BusinessStage
  businessStageDescription: string
  /** How the brief was assembled — a transparent, ordered trace. */
  reasoning: BriefReasoningStep[]
}

/* ===========================================================================
 * Orchestration helpers (pure)
 * ======================================================================== */

const MAX_EXECUTIVES = 3
const MAX_ADVISORS = 2
const MAX_DELIVERABLES = 2

/** Resolve recommended executive ids (from Business Stage™) into a today team. */
function assembleExecutives(ctx: HarmonyContextValue): BriefExecutive[] {
  const stageName = ctx.businessStage
  const ids = ctx.recommendedExecutives.slice(0, MAX_EXECUTIVES)
  const execs: BriefExecutive[] = []
  for (const id of ids) {
    const exec = getExecutive(id)
    if (!exec) continue
    execs.push({
      id: exec.id,
      name: exec.name,
      title: exec.executiveTitle,
      reason: `Emphasized during your ${capitalize(stageName)}™ stage.`,
    })
  }
  return execs
}

/** Resolve recommended advisor ids (from Business Stage™) into relevant advisors. */
function assembleAdvisors(ctx: HarmonyContextValue): BriefAdvisor[] {
  const ids = ctx.recommendedAdvisors.slice(0, MAX_ADVISORS)
  const advisors: BriefAdvisor[] = []
  for (const id of ids) {
    const advisor = getAdvisor(id)
    if (!advisor) continue
    advisors.push({
      id: advisor.id,
      name: advisor.name,
      title: advisor.advisorTitle,
      reason: `May become relevant as you work through this stage.`,
    })
  }
  return advisors
}

/**
 * Choose ONE Executive Insight™ that fits the founder's stage and — when
 * possible — the executives already on today's team or the current segment.
 * Deterministic: given the same context, always the same insight.
 */
function chooseInsight(
  ctx: HarmonyContextValue,
  executives: BriefExecutive[],
): BriefInsight | null {
  const stage = ctx.businessStage
  const execIds = new Set(executives.map((e) => e.id))
  const segmentTitle = ctx.currentSegment?.title ?? ""

  // Candidate pool: insights that serve this Business Stage™.
  const candidates = EXECUTIVE_INSIGHTS.filter((i) => i.businessStages.includes(stage))
  if (candidates.length === 0) return null

  // Preference 1: owned by an executive already on today's team.
  // Preference 2: naturally applies to the current Operating Segment™.
  // Preference 3: first stage-appropriate insight (stable fallback).
  const byExec = candidates.find((i) => execIds.has(i.executiveOwner))
  const bySegment = segmentTitle
    ? candidates.find((i) => i.relatedOperatingSegments.includes(segmentTitle))
    : undefined
  const chosen = byExec ?? bySegment ?? candidates[0]

  const reason = byExec
    ? `Prepares you for the work your ${nameForExec(chosen.executiveOwner)} leads today.`
    : bySegment
      ? `Fits naturally into your ${segmentTitle} segment.`
      : `A strong fit for your ${capitalize(stage)}™ stage.`

  return {
    id: chosen.id,
    title: chosen.title,
    description: chosen.description,
    estimatedDuration: chosen.estimatedDuration,
    reason,
  }
}

/**
 * Choose up to two Deliverables™ for the founder's stage, preferring ones owned
 * by an executive already on today's team so the brief stays coherent.
 */
function chooseDeliverables(
  ctx: HarmonyContextValue,
  executives: BriefExecutive[],
): BriefDeliverable[] {
  const stage = ctx.businessStage
  const execIds = new Set(executives.map((e) => e.id))

  const stageFit = DELIVERABLES.filter((d) => d.recommendedBusinessStages.includes(stage))
  const pool = stageFit.length > 0 ? stageFit : DELIVERABLES

  // Owned-by-today's-team first, then the rest — stable order preserved.
  const ordered = [
    ...pool.filter((d) => execIds.has(d.ownerId)),
    ...pool.filter((d) => !execIds.has(d.ownerId)),
  ]

  return ordered.slice(0, MAX_DELIVERABLES).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    estimatedTime: d.estimatedTime,
    reason: execIds.has(d.ownerId)
      ? `Owned by an executive on today's team.`
      : `A strong fit for your ${capitalize(stage)}™ stage.`,
  }))
}

/**
 * Build a concise explanation ADAPTED to the founder's Communication Style™.
 * Same underlying message (stage + intention + what's assembled), expressed at
 * the founder's preferred level. This is the "adapt HOW, not WHAT" principle,
 * applied deterministically — no generative text.
 */
function buildExplanation(
  ctx: HarmonyContextValue,
  executives: BriefExecutive[],
): string {
  const teamCount = executives.length
  const teamWord = teamCount === 1 ? "executive" : "executives"
  const stage = capitalize(ctx.businessStage)

  const style: CommunicationStyle = ctx.communicationStyle
  switch (style) {
    case "foundation":
      return `Here's your simple plan for today. I've picked ${teamCount} ${teamWord} to help, plus one short lesson and something useful you can make. Everything here fits where your business is right now.`
    case "small_business":
      return `Here's today's game plan. I've lined up ${teamCount} ${teamWord} for your priorities, a quick lesson to prep you, and a practical deliverable you can put to work — all matched to your ${stage}™ stage.`
    case "business_owner":
      return `This is today's operating brief. I've assembled ${teamCount} ${teamWord} around your current priorities, recommended one Executive Insight™ to prepare you, and surfaced deliverables suited to your ${stage}™ stage.`
    case "executive":
      return `Today's brief aligns your ${stage}™ priorities with the right functional leadership. I've convened ${teamCount} ${teamWord}, a targeted Executive Insight™, and stage-appropriate deliverables to move execution forward.`
    case "boardroom":
      return `This brief operationalizes your ${stage}™ posture. I've assembled a ${teamCount}-${teamWord === "executive" ? "member" : "member"} executive team, an execution-prep Executive Insight™, and prioritized deliverables aligned to the current operating horizon.`
    default:
      return `Here's today's operating brief, tuned to your ${stage}™ stage.`
  }
}

/* ===========================================================================
 * Public API
 * ======================================================================== */

/**
 * assembleOperatingBrief — the heart of Founder Intelligence™.
 *
 * Pure function: (Harmony Context™) → Operating Brief™. Deterministic and
 * side-effect-free, so it is trivially testable and safe to call during render.
 */
export function assembleOperatingBrief(ctx: HarmonyContextValue): OperatingBrief {
  const name = ctx.firstName?.trim()
  const greeting = name ? `${ctx.greeting}, ${name}.` : `${ctx.greeting}.`

  const base = {
    hasDesignedWeek: ctx.hasDesignedWeek,
    greeting,
    dayName: ctx.dayName,
    communicationStyleName: ctx.communicationStyleName,
    languageName: ctx.languageName,
    isEnglishFallback: !ctx.isTranslationActive,
    businessStage: ctx.businessStage,
    businessStageDescription: ctx.businessStageDescription,
  }

  // Assemble the team, advisors, insight, and deliverables from live context.
  const executives = assembleExecutives(ctx)
  const advisors = assembleAdvisors(ctx)
  const insight = chooseInsight(ctx, executives)
  const deliverables = chooseDeliverables(ctx, executives)
  const explanation = buildExplanation(ctx, executives)

  const seg = ctx.currentSegment
  const headline = `Your ${ctx.timeOfDay} Brief`

  const reasoning: BriefReasoningStep[] = [
    { system: "Harmony Context Engine™", note: `Read your ${capitalize(ctx.businessStage)}™ stage, ${ctx.communicationStyleName} style, and ${ctx.languageName}.` },
    { system: "Excellence Intelligence Engine™", note: "Grounded the brief in enduring business principles (no duplicated knowledge)." },
    { system: "Business Concepts Registry™", note: "Kept every term in one shared business language." },
    { system: "Executive Leadership Team™", note: `Assembled ${executives.length} executive${executives.length === 1 ? "" : "s"} for today's priorities.` },
    { system: "Professional Advisory Network™", note: advisors.length > 0 ? `Flagged ${advisors.length} advisor${advisors.length === 1 ? "" : "s"} that may become relevant.` : "No specialized advisor needed right now." },
    { system: "Harmony Business Academy™", note: insight ? `Recommended "${insight.title}" to prepare you to execute.` : "No stage-fit Executive Insight™ available yet." },
    { system: "Deliverables™", note: deliverables.length > 0 ? `Surfaced ${deliverables.length} deliverable${deliverables.length === 1 ? "" : "s"} you can put to work.` : "No stage-fit deliverable available yet." },
    { system: "AI Augmentation Hour™", note: "Framed the brief as your Chief of Staff prep before deep work." },
    { system: "Founder Recommendation", note: "Delivered one calm, contextual brief — not a menu to manage." },
  ]

  return {
    ...base,
    headline,
    intention: ctx.weeklyIntention?.trim() || null,
    segmentTitle: seg ? seg.title : ctx.currentBlockTitle || "Resting",
    operatingRule: seg?.rule?.trim() || null,
    dailyNonNegotiable: seg?.nonNegotiable?.trim() || null,
    executives,
    advisors,
    insight,
    deliverables,
    explanation,
    reasoning,
  }
}

/* ===========================================================================
 * Small internal utilities
 * ======================================================================== */

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)
}

/** Friendly name for an executive id, falling back to a readable label. */
function nameForExec(id: string): string {
  const exec = getExecutive(id)
  return exec ? exec.name : "executive"
}

/** Re-exported registry types for consumers of the brief. */
export type { Executive, Advisor, AcademyItem, Deliverable }
