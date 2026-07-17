/**
 * Founder GPS™ Engine — Phase 8.1
 * ---------------------------------------------------------------------------
 * The deterministic recommendation layer of Harmony Lane™.
 *
 * Given the same HarmonyContextValue and the same moment in time, this engine
 * ALWAYS produces the same explainable output. No randomness. No invented copy.
 *
 * Reasoning pipeline:
 *   HarmonyContext™ → Signal Evaluation → Priority Framework™ →
 *   Constitutional Principle™ → Reasoning Rule™ → Recommendation™ →
 *   Executive Assignment™ → Business Asset™
 *
 * PURE module: no React, no I/O, no Supabase. Safe to call from any context.
 */

import type { HarmonyContextValue } from "@/lib/harmony-context/types"
import { EXECUTIVE_TEAM } from "@/lib/executive-team/executive-registry"
import {
  BUSINESS_ASSET_REGISTRY,
  type BusinessAssetId,
} from "@/lib/executive-decision-engine"
import type { ProgressSummary } from "@/lib/founder-gps/progress-intelligence"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { RecommendationConfidence } from "@/lib/founder-gps/context/confidence-engine"
import type { BusinessAssetChain } from "@/lib/founder-gps/context/business-asset-chain-engine"
import type { ExecutiveBrief } from "@/lib/executive-office/types"
import { computeConfidence } from "@/lib/founder-gps/context/confidence-engine"
import { deriveAssetChain } from "@/lib/founder-gps/context/business-asset-chain-engine"
import {
  deriveExecutiveFindings,
  buildExecutiveBrief,
} from "@/lib/executive-office/executive-office-engine"

/* ===========================================================================
 * Output types
 * ======================================================================== */

export type GpsOutcomeId =
  | "honor-non-negotiables"
  | "build-compounding-assets"
  | "reduce-execution-friction"

export interface GpsExecutiveAssignment {
  executiveId: string
  executiveName: string
  executiveTitle: string
  mission: string
  deliverable: string
}

export interface GpsBusinessAsset {
  id: BusinessAssetId | string
  name: string
  compoundingMechanism: string
}

export interface GpsExplainability {
  constitutionalPrinciple: string
  reasoningRule: string
  supportingContext: string
  expectedOutcome: string
}

export interface GpsRecommendationCard {
  /**
   * Stable id for this recommendation — the rule that fired.
   */
  id: string
  /**
   * The single question this recommendation answers.
   */
  question: string
  /**
   * Cherry Blossom's one-sentence framing for this segment.
   */
  cbFraming: string
  /**
   * The single highest-leverage next step. One sentence, first-person framing.
   */
  recommendation: string
  /**
   * The signal(s) that triggered this recommendation (for transparency).
   */
  triggeredBy: string[]
  /**
   * The GPS Outcome™ this recommendation primarily serves.
   */
  primaryOutcome: GpsOutcomeId
  /**
   * Cherry Blossom's explanation of why this matters right now.
   */
  why: string
  /**
   * The Executive™ assigned to support this recommendation.
   */
  executive: GpsExecutiveAssignment | null
  /**
   * The Business Asset™ this recommendation builds, if applicable.
   */
  businessAsset: GpsBusinessAsset | null
  /**
   * Full explainability record — expandable "Why This Recommendation™".
   */
  explainability: GpsExplainability
  /**
   * Optional CTA for the recommendation.
   */
  cta: { label: string; href: string } | null

  // ── Phase 10.2 — Executive Intelligence Engine™ ──────────────────────────

  /**
   * Confidence score for this recommendation — how much context the engine
   * had to work with. Optional with a safe default for backward compatibility.
   */
  confidence?: RecommendationConfidence
  /**
   * Whether this recommendation builds on a documented recent win.
   */
  buildingOnMomentum?: boolean
  /**
   * One-sentence description of what this recommendation builds on.
   * Only set when buildingOnMomentum === true.
   */
  momentumContext?: string | null
  /**
   * The Business Asset Chain™ for this recommendation's asset, if applicable.
   * Shows the downstream compounding opportunities unlocked.
   */
  assetChain?: BusinessAssetChain | null
  /**
   * Adaptive learning prompt shown when the founder skips this recommendation.
   */
  adaptiveLearningPrompt?: string

  // ── Phase 10.3 — Executive Office™ Intelligence ──────────────────────────

  /**
   * The Executive Brief™ produced by the Executive Office Engine™.
   * Shows which executives evaluated this recommendation, why it won,
   * and which were deferred. Optional for full backward compatibility.
   */
  executiveBrief?: ExecutiveBrief

  // ── Phase 10.4 — Executive Capability Intelligence™ ──────────────────────

  /**
   * The Executive Briefing topic most relevant to this recommendation.
   * When present, ExecutiveBriefingTrigger will surface it inline.
   * Optional — undefined when no gap is detected or the topic is already mastered.
   */
  capabilityBriefing?: import("@/lib/executive-capability/types").ExecutiveBriefingTopicId
}

/* ===========================================================================
 * Segment-specific recommendation contexts
 * ======================================================================== */

export type SegmentId =
  | "early-entry"
  | "morning-given"
  | "workout"
  | "healthy-lunch"
  | "ceo-workday"
  | "time-freedom"
  | "power-down"
  // CEO Workday sub-phases
  | "executive-intelligence"
  | "human-zone-of-genius"
  | "business-optimization"

/* ===========================================================================
 * Helpers: resolve executive by id
 * ======================================================================== */

function getExecutiveById(id: string): GpsExecutiveAssignment | null {
  const exec = EXECUTIVE_TEAM.find((e) => e.id === id)
  if (!exec) return null
  return {
    executiveId: exec.id,
    executiveName: exec.name,
    executiveTitle: exec.executiveTitle,
    mission: exec.mission,
    deliverable: exec.availableDeliverables[0] ?? "Strategic guidance",
  }
}

function getAsset(id: BusinessAssetId | string): GpsBusinessAsset | null {
  const asset = BUSINESS_ASSET_REGISTRY.find((a) => a.id === id)
  if (!asset) return null
  return { id: asset.id, name: asset.name, compoundingMechanism: asset.compoundingMechanism }
}

/* ===========================================================================
 * Signal evaluation helpers
 * ======================================================================== */

/** Extracts a clean first name or "you" fallback. */
function firstName(ctx: HarmonyContextValue): string {
  return ctx.firstName ?? "you"
}

/** True when the member has a whole-life event approaching. */
function hasUpcomingEvent(ctx: HarmonyContextValue): boolean {
  // Architecture hook — Whole-Life Context lives in HarmonyContextValue.ceo
  // for now; we read upcomingLifeEventsCount from GPS context when available.
  return false // Will be populated once WholeLife data flows into HarmonyContext
}

/** True when the member has designed their week. */
function weekDesigned(ctx: HarmonyContextValue): boolean {
  return ctx.hasDesignedWeek
}

/** True when it is currently CEO Workday™. */
function isCeoWorkday(ctx: HarmonyContextValue): boolean {
  return ctx.currentSegment?.id === "ceo-workday"
}

/* ===========================================================================
 * Whole-Life Context™ signal helpers (Phase 8.1 / Part 5)
 * ---------------------------------------------------------------------------
 * These helpers read Whole-Life Context™ signals from the HarmonyContextValue
 * to enable life-aware GPS recommendations.
 * ======================================================================== */

/**
 * Returns the nearest upcoming significant life event within the awareness
 * window, if any. Uses the HarmonyContextValue's segment-level data.
 *
 * Architecture note: in a future phase, this will read from
 * HarmonyContextSnapshot.intelligence.upcomingLifeEvents when the snapshot
 * is threaded through to this component layer. For now it returns null —
 * the hook is declared and ready for connection.
 */
function nearestSignificantEvent(_ctx: HarmonyContextValue): {
  title: string
  daysUntil: number
  requiresPreparation: boolean
} | null {
  // Architecture hook — Whole-Life Context™ flows through HarmonyContextSnapshot
  // which is built server-side. The client-side HarmonyContextValue does not
  // yet carry the full WholeLifeContext. This hook will be wired up once the
  // snapshot is made available to the HarmonyProvider. Returns null for now.
  return null
}

/** Returns the active personal goals count from the context, or 0. */
function activePersonalGoalsCount(_ctx: HarmonyContextValue): number {
  // Architecture hook — same as above.
  return 0
}

/* ===========================================================================
 * Segment-specific recommendation engines
 * ======================================================================== */

// ─── Early Entry / Flex Time™ ───────────────────────────────────────────────

export function gpsForEarlyEntry(ctx: HarmonyContextValue): GpsRecommendationCard {
  // Whole-Life Context™ hook — protect Flex Time™ when a life event requires it
  const upcomingEvent = nearestSignificantEvent(ctx)
  if (upcomingEvent && upcomingEvent.daysUntil <= 1 && upcomingEvent.requiresPreparation) {
    return {
      id: "early-entry--protect-life-event",
      question: "What deserves flexibility today?",
      cbFraming:
        "Cherry Blossom\u2122 has noticed an important life moment approaching. Flex Time\u2122 is the right space to protect it.",
      recommendation: `Use your Flex Time\u2122 today to handle preparation for "${upcomingEvent.title}". Protecting this moment is your highest-leverage morning investment.`,
      triggeredBy: ["whole-life-event-imminent", "flex-time-active"],
      primaryOutcome: "honor-non-negotiables",
      why: "An upcoming life commitment that requires preparation is always the highest-priority use of Flex Time\u2122. Your CEO Workday\u2122 is protected when life commitments are honored first.",
      executive: getExecutiveById("people-culture"),
      businessAsset: null,
      explainability: {
        constitutionalPrinciple: "Honor Life\u2019s Non-Negotiables\u2122 first — life events always take priority over business execution in the Flex Time\u2122 window.",
        reasoningRule: "When a life event requiring preparation is within 24 hours, Flex Time\u2122 is redirected to life preparation rather than business buffering.",
        supportingContext: `"${upcomingEvent.title}" is ${upcomingEvent.daysUntil === 0 ? "today" : "tomorrow"} and requires preparation.`,
        expectedOutcome: "A life moment honored without sacrificing the CEO Workday\u2122 — the Operating System\u2122 working exactly as designed.",
      },
      cta: null,
    }
  }

  // Rule: week is designed → protect flex for today's executive preparation
  if (weekDesigned(ctx)) {
    return {
      id: "early-entry--protect-ceo-prep",
      question: "What deserves flexibility today?",
      cbFraming:
        "Flex Time\u2122 exists to protect your CEO Workday\u2122, not replace it. Use this buffer to clear commitments before 1:00 PM.",
      recommendation:
        "Use your Flex Time\u2122 to handle any appointments, calls, or personal commitments before your CEO Workday\u2122 begins. Protect 1:00 PM completely.",
      triggeredBy: ["week-designed", "ceo-workday-protected"],
      primaryOutcome: "honor-non-negotiables",
      why: "A cleared morning means a CEO Workday\u2122 free from interruption. Every appointment handled now becomes execution capacity this afternoon.",
      executive: getExecutiveById("people-culture"),
      businessAsset: null,
      explainability: {
        constitutionalPrinciple: "Protect the founder\u2019s Time Freedom\u2122 and CEO capacity above all competing demands.",
        reasoningRule: "When the week is designed, Flex Time\u2122 functions as a protection buffer for the CEO Workday\u2122 \u2014 not as additional work time.",
        supportingContext: "Your week is installed. Your CEO Workday\u2122 begins at 1:00 PM.",
        expectedOutcome: "Full CEO Workday\u2122 capacity \u2014 no morning friction carrying into execution time.",
      },
      cta: null,
    }
  }

  // Rule: week not designed → recommend Design My Week™ immediately
  return {
    id: "early-entry--design-week-first",
    question: "What deserves flexibility today?",
    cbFraming:
      "Before your Flex Time\u2122 can serve you, your week needs to be designed. A designed week tells Cherry Blossom\u2122 exactly what to protect.",
    recommendation:
      "Design your week first. It takes about 20 minutes and installs the operating framework that makes every segment intelligent.",
    triggeredBy: ["week-not-designed"],
    primaryOutcome: "reduce-execution-friction",
    why: "Without a designed week, Flex Time\u2122 becomes reactive time \u2014 no different from a day without structure. Design My Week\u2122 installs the operating context that makes every hour intentional.",
    executive: getExecutiveById("strategy"),
    businessAsset: getAsset("decision-framework"),
    explainability: {
      constitutionalPrinciple: "Reduce execution friction by installing operating frameworks before the week begins.",
      reasoningRule: "When no weekly design is detected, the highest-leverage action is always completing Sunday Design Day\u2122 first.",
      supportingContext: "No installed week was found for this week.",
      expectedOutcome: "An installed week that gives every operating segment intelligent context.",
    },
    cta: { label: "Design My Week\u2122", href: "/design-my-week" },
  }
}

// ─── Morning GIV•EN™ ─────────────────────────────────────────────────────────

export function gpsForMorningGiven(ctx: HarmonyContextValue): GpsRecommendationCard {
  const intention = ctx.weeklyIntention || ctx.weeklyDeclaration || ""
  const hasIntention = intention.trim().length > 0

  // Rule: intention is set → align morning practice to the week's intention
  if (hasIntention) {
    return {
      id: "morning-given--align-to-intention",
      question: "What mindset or intention will have the greatest impact today?",
      cbFraming:
        "Your morning practice sets the tone for everything that follows. Align your GIV\u2022EN\u2122 to the intention you installed on Sunday.",
      recommendation:
        "Begin with Visualization today. Spend 5 minutes seeing your Weekly Intention Declaration\u2122 fully realized. Let your morning practice connect your mindset to your mission.",
      triggeredBy: ["weekly-intention-installed", "morning-given-segment-active"],
      primaryOutcome: "honor-non-negotiables",
      why: "When your morning practice is anchored to a clear intention, it becomes a compounding mindset investment — not a routine. Visualization activates the neural alignment between your vision and your execution.",
      executive: getExecutiveById("growth"),
      businessAsset: null,
      explainability: {
        constitutionalPrinciple: "Honor Life\u2019s Non-Negotiables\u2122 first — the founder\u2019s mental and spiritual preparation is a business investment.",
        reasoningRule: "When a Weekly Intention Declaration\u2122 is installed, morning practices that directly reinforce the intention create the strongest alignment.",
        supportingContext: `Your weekly intention is installed: "${intention.slice(0, 80)}${intention.length > 80 ? "…" : ""}"`,
        expectedOutcome: "A CEO Workday\u2122 entered from clarity and intention rather than momentum by default.",
      },
      cta: null,
    }
  }

  // Rule: no intention → recommend gratitude as the highest-leverage default
  return {
    id: "morning-given--gratitude-default",
    question: "What mindset or intention will have the greatest impact today?",
    cbFraming:
      "Every morning practice is a compounding investment. Begin with Gratitude — it resets the operating mindset and creates a foundation for every decision that follows.",
    recommendation:
      "Begin with Gratitude today. Write three specific things you are grateful for — grounded in real evidence, not generalities. This practice takes 3 minutes and resets your operating context.",
    triggeredBy: ["no-weekly-intention", "morning-given-segment-active"],
    primaryOutcome: "honor-non-negotiables",
    why: "Gratitude is the highest-leverage GIV\u2022EN\u2122 practice for days without a strong forward intention. It redirects attention from what is missing to what is already working — a direct performance signal.",
    executive: getExecutiveById("growth"),
    businessAsset: null,
    explainability: {
      constitutionalPrinciple: "Honor Life\u2019s Non-Negotiables\u2122 first — morning mental preparation is a non-negotiable performance investment.",
      reasoningRule: "When no weekly intention is installed, Gratitude is the highest-signal morning practice because it builds psychological capital without requiring a forward anchor.",
      supportingContext: "No weekly intention declaration was found for this week.",
      expectedOutcome: "A reset operating mindset that enters the CEO Workday\u2122 from a grounded, performance-ready state.",
    },
    cta: null,
  }
}

// ─── Workout Window™ ─────────────────────────────────────────────────────────

export function gpsForWorkout(
  ctx: HarmonyContextValue,
  progress?: ProgressSummary | null,
): GpsRecommendationCard {
  // Rule: streak ≥ 5 → celebrate and reinforce the habit
  if (progress && progress.workoutStreak >= 5) {
    return {
      id: "workout--celebrate-streak",
      question: "How can you best prepare your mind and body for your CEO Workday\u2122 today?",
      cbFraming:
        `You have honored your Workout Window\u2122 ${progress.workoutStreak} days in a row. This is the consistency that creates sustainable executive energy.`,
      recommendation:
        "Today's Workout Window\u2122: honor the movement that is already working. Whatever you have been doing for ${progress.workoutStreak} consecutive days — do it again. Consistency beats intensity every time.",
      triggeredBy: ["workout-streak-5plus", "workout-segment-active"],
      primaryOutcome: "honor-non-negotiables",
      why: `A ${progress.workoutStreak}-day workout streak is real executive discipline. Your body is adapting. Your CEO Workday\u2122 readiness is compounding with each session.`,
      executive: getExecutiveById("people-culture"),
      businessAsset: null,
      explainability: {
        constitutionalPrinciple: "Long-term sustainability over short-term busyness. Physical consistency compounds into leadership capacity.",
        reasoningRule: "When a workout streak of 5+ days is detected, the GPS celebrates consistency and reinforces the existing habit rather than introducing variation.",
        supportingContext: `Workout streak: ${progress.workoutStreak} consecutive days.`,
        expectedOutcome: "A maintained streak that reinforces the Workout Window\u2122 as a permanent Sustainable Operating Practice\u2122.",
      },
      cta: null,
    }
  }

  // Rule: streak broken recently → encourage re-entry without judgment
  if (progress && progress.workoutStreak === 0 && progress.todayLifeEntryExists) {
    return {
      id: "workout--gentle-reentry",
      question: "How can you best prepare your mind and body for your CEO Workday\u2122 today?",
      cbFraming:
        "The goal is not athletic performance. The goal is showing up. Today is a new opportunity to honor your Workout Window\u2122.",
      recommendation:
        "Start with 10 minutes. A short walk, a stretch, or any physical movement that breaks your sedentary pattern counts fully. Consistency begins with showing up, not with intensity.",
      triggeredBy: ["workout-streak-reset", "workout-segment-active"],
      primaryOutcome: "honor-non-negotiables",
      why: "A 10-minute movement practice done consistently every day compounds more value than an intense workout done occasionally. Today\u2019s goal is simply showing up.",
      executive: getExecutiveById("people-culture"),
      businessAsset: null,
      explainability: {
        constitutionalPrinciple: "Long-term sustainability over short-term busyness. Re-entry without judgment is more valuable than a perfect streak.",
        reasoningRule: "When a streak has been broken, the GPS prescribes the lowest barrier to re-entry — reducing the activation energy required to restart the habit.",
        supportingContext: "No consecutive workout days currently tracked.",
        expectedOutcome: "One Workout Window\u2122 honored today — beginning the next streak.",
      },
      cta: null,
    }
  }

  // Default: standard performance-readiness recommendation
  return {
    id: "workout--optimize-ceo-readiness",
    question: "How can you best prepare your mind and body for your CEO Workday\u2122 today?",
    cbFraming:
      "Your Workout Window\u2122 is not optional self-care. It is a performance investment. A founder who enters their CEO Workday\u2122 having moved their body makes better decisions.",
    recommendation:
      "30-minute outdoor walk. Move at a comfortable pace. No phone calls. Allow your mind to defragment before your execution window begins.",
    triggeredBy: ["workout-segment-active", "ceo-workday-approaching"],
    primaryOutcome: "honor-non-negotiables",
    why: "Research consistently confirms that moderate movement before deep work increases focus duration, decision quality, and stress resilience. You are not exercising \u2014 you are upgrading your operating system before the day\u2019s most important work.",
    executive: getExecutiveById("people-culture"),
    businessAsset: null,
    explainability: {
      constitutionalPrinciple: "Long-term sustainability over short-term busyness. A founder who protects recovery and movement compounds their leadership capacity.",
      reasoningRule: "The Workout Window\u2122 optimizes for CEO Workday\u2122 readiness \u2014 prescribe movement that builds readiness without depleting energy.",
      supportingContext: "Your CEO Workday\u2122 begins at 1:00 PM. Physical movement before execution increases cognitive capacity.",
      expectedOutcome: "A CEO Workday\u2122 entered from physical readiness \u2014 more focus, better decisions, lower decision fatigue.",
    },
    cta: null,
  }
}

// ─── Healthy Hybrid Lunch™ ───────────────────────────────────────────────────

export function gpsForHealthyLunch(ctx: HarmonyContextValue): GpsRecommendationCard {
  return {
    id: "healthy-lunch--create-energy",
    question: "How can this break create more energy for the afternoon?",
    cbFraming:
      "This break is not passive recovery. It is an active investment in your afternoon execution capacity. How you spend the next 60 minutes determines the quality of your CEO Workday\u2122.",
    recommendation:
      "Step away from your workspace completely. Eat somewhere other than your desk. If possible, walk outside for 10 minutes after eating. This is recovery time, not productivity time.",
    triggeredBy: ["healthy-lunch-segment-active", "ceo-workday-approaching"],
    primaryOutcome: "honor-non-negotiables",
    why: "Desk lunches reduce afternoon cognitive capacity by 20–30% in most productivity research. A complete break — especially one with physical movement — resets your executive focus before your highest-leverage work begins.",
    executive: getExecutiveById("people-culture"),
    businessAsset: null,
    explainability: {
      constitutionalPrinciple: "Honor Life\u2019s Non-Negotiables\u2122 first — rest and nourishment protect the founder\u2019s sustainable operating capacity.",
      reasoningRule: "The midday break before the CEO Workday\u2122 is the last recovery opportunity before 4 hours of high-leverage execution.",
      supportingContext: "Your CEO Workday\u2122 begins at 1:00 PM. A full break now protects your deepest execution capacity.",
      expectedOutcome: "Restored focus entering the CEO Workday\u2122 — the difference between 3-hour momentum and 4-hour momentum.",
    },
    cta: null,
  }
}

// ─── Time Freedom™ ───────────────────────────────────────────────────────────

export function gpsForTimeFreedom(ctx: HarmonyContextValue): GpsRecommendationCard {
  const focusAreas = ctx.focusAreas ?? []
  const hasPersonalFocus = focusAreas.length > 0

  return {
    id: "time-freedom--invest-intentionally",
    question: "How should you intentionally invest your reclaimed time today?",
    cbFraming:
      "This is not time off from your business. This is the life your business was built to protect. Be fully present for it.",
    recommendation: hasPersonalFocus
      ? `Invest your Time Freedom\u2122 in what matters most outside the business today. Your priority areas include ${focusAreas.slice(0, 2).join(" and ")} — choose what will be most meaningful tonight.`
      : "Invest your Time Freedom\u2122 in family, rest, creativity, or adventure. The business has been closed for the day. Be fully present for the life you have built.",
    triggeredBy: ["time-freedom-segment-active", "ceo-workday-complete"],
    primaryOutcome: "honor-non-negotiables",
    why: "Time Freedom\u2122 is a performance indicator, not a reward. Founders who protect genuine recovery time build the sustained capacity that powers exceptional business performance. Spending this time intentionally reinforces the reason the business exists.",
    executive: null,
    businessAsset: null,
    explainability: {
      constitutionalPrinciple: "Time Freedom\u2122 is a performance indicator. Protecting it is protecting the engine that powers the business.",
      reasoningRule: "During Time Freedom\u2122, no business recommendations are made. The only recommendation is to be fully present for the life the business is building.",
      supportingContext: "Your CEO Workday\u2122 is complete. The business is officially Closed For Business\u2122.",
      expectedOutcome: "A fully recovered founder who brings sustained energy and perspective to the next CEO Workday\u2122.",
    },
    cta: null,
  }
}

// ─── Power Down & Unplug™ ────────────────────────────────────────────────────

export function gpsForPowerDown(ctx: HarmonyContextValue): GpsRecommendationCard {
  return {
    id: "power-down--close-with-intention",
    question: "What can you release before tomorrow begins?",
    cbFraming:
      "How you close today shapes how you open tomorrow. A deliberate Power Down\u2122 is the final operating act of your business day.",
    recommendation:
      "Take 5 minutes to write down the single most important thing you will do in tomorrow\u2019s CEO Workday\u2122. Then close every open tab, notification, and unfinished thought. The business is officially Closed For Business\u2122 tonight.",
    triggeredBy: ["power-down-segment-active"],
    primaryOutcome: "honor-non-negotiables",
    why: "The mind continues processing unresolved loops — known as the Zeigarnik effect. Writing tomorrow\u2019s priority closes the most important cognitive loop, allowing true rest tonight and a decisive entry into tomorrow\u2019s CEO Workday\u2122.",
    executive: null,
    businessAsset: null,
    explainability: {
      constitutionalPrinciple: "Long-term sustainability over short-term busyness. The Power Down\u2122 is the ritual that separates the founder from the business at the end of each day.",
      reasoningRule: "Deliberate day closure reduces cognitive load during recovery time and improves next-day execution readiness.",
      supportingContext: "Your operating day is complete. Tomorrow deserves a fully restored CEO.",
      expectedOutcome:
        "A clean mental close — no open loops during recovery time, and a clear entry point for tomorrow\u2019s highest-leverage work.",
    },
    cta: null,
  }
}

// ─── CEO Workday™ — Executive Intelligence Hour™ ────────────────────────────

export function gpsForExecutiveIntelligence(ctx: HarmonyContextValue): GpsRecommendationCard {
  const ceo = ctx.ceo
  const hasOperatingRule = Boolean(ceo?.businessOperatingRule?.trim())
  const hasPriorities = Boolean(ceo?.priorities?.trim())

  if (hasOperatingRule && hasPriorities) {
    return {
      id: "exec-intel--align-priorities",
      question: "What is today's highest-leverage opportunity?",
      cbFraming:
        "Your Executive Intelligence Hour\u2122 is your strategic review before execution. Evaluate your priorities against your installed Operating Rules\u2122 before committing to your Executive Outcome\u2122.",
      recommendation:
        "Review your installed CEO Workday\u2122 priorities. Identify the single opportunity from your priority list that creates the most lasting business value today. This becomes your Executive Outcome\u2122.",
      triggeredBy: ["ceo-priorities-installed", "operating-rule-installed"],
      primaryOutcome: "build-compounding-assets",
      why: "Starting with your installed priorities prevents reactive execution — the most common source of wasted CEO time. Your priorities were chosen from a calm, strategic perspective. Honor that decision today.",
      executive: getExecutiveById("strategy"),
      businessAsset: getAsset("strategic-plan"),
      explainability: {
        constitutionalPrinciple: "One highest-leverage outcome — the CEO Workday\u2122 succeeds by protecting one meaningful outcome rather than pursuing many adequate ones.",
        reasoningRule: "When CEO priorities are installed, the Executive Intelligence Hour\u2122 focuses on selecting the highest-leverage item from the installed list rather than generating new tasks.",
        supportingContext: "Your CEO Workday\u2122 priorities are installed. Your Business Operating Rule\u2122 is active.",
        expectedOutcome: "A deliberate Executive Outcome\u2122 that advances the business\u2019s compounding trajectory.",
      },
      cta: null,
    }
  }

  return {
    id: "exec-intel--install-operating-context",
    question: "What is today's highest-leverage opportunity?",
    cbFraming:
      "Before the Executive Intelligence Hour\u2122 can guide you, your CEO context needs to be installed. Design My Week\u2122 unlocks this intelligence.",
    recommendation:
      "Complete Design My Week\u2122 to install your CEO priorities, Business Operating Rules\u2122, and Human Zone of Genius\u2122 focus. Once installed, your Executive Intelligence Hour\u2122 becomes a true strategic operating environment.",
    triggeredBy: ["ceo-context-not-installed"],
    primaryOutcome: "reduce-execution-friction",
    why: "A CEO Workday\u2122 without installed context defaults to reactive execution. Design My Week\u2122 takes 20 minutes and transforms your CEO Workday\u2122 from a time block into an intelligent operating environment.",
    executive: getExecutiveById("operations"),
    businessAsset: getAsset("decision-framework"),
    explainability: {
      constitutionalPrinciple: "Reduce execution friction weekly — installing operating context before the week begins removes reactive decision-making from execution time.",
      reasoningRule: "When CEO context is absent, the highest-leverage action is always installing it before attempting execution.",
      supportingContext: "CEO Workday\u2122 priorities and operating rules were not found for this week.",
      expectedOutcome: "A CEO Workday\u2122 with clear strategic context — priorities, rules, and Human Zone of Genius\u2122 focus all installed.",
    },
    cta: { label: "Design My Week™", href: "/design-my-week" },
  }
}

// ─── CEO Workday™ — Human Zone of Genius™ ───────────────────────────────────

export function gpsForHumanZoneOfGenius(ctx: HarmonyContextValue): GpsRecommendationCard {
  const ceo = ctx.ceo
  const hzog = ceo?.humanZoneOfGenius?.trim() ?? ""
  const hasHzog = hzog.length > 0

  if (hasHzog) {
    return {
      id: "hzog--deliver-installed-genius",
      question: "What is the one meaningful outcome only I can create today?",
      cbFraming:
        "This is your Human Zone of Genius\u2122. No AI, no team member, no shortcut replaces what you uniquely create here. Protect this time with everything you have installed.",
      recommendation: `Your Human Zone of Genius\u2122 is: "${hzog.slice(0, 100)}${hzog.length > 100 ? "…" : ""}". Let this guide your Executive Outcome\u2122 today. Create the one thing only you can create.`,
      triggeredBy: ["human-zone-of-genius-installed"],
      primaryOutcome: "build-compounding-assets",
      why: "Every hour spent in your Human Zone of Genius\u2122 is irreplaceable. Everything outside it can be delegated, automated, or eliminated. The business grows fastest when you protect this space completely.",
      executive: getExecutiveById("strategy"),
      businessAsset: getAsset("signature-talk"),
      explainability: {
        constitutionalPrinciple: "Protect the founder\u2019s Zone of Genius\u2122 — only work that is uniquely human and specifically yours belongs in the Human Zone of Genius\u2122 time block.",
        reasoningRule: "When Human Zone of Genius\u2122 is installed, all Executive Outcome\u2122 recommendations align to that definition rather than introducing new task categories.",
        supportingContext: `Your installed Human Zone of Genius\u2122: "${hzog.slice(0, 60)}${hzog.length > 60 ? "…" : ""}"`,
        expectedOutcome: "An Executive Outcome\u2122 that is impossible to outsource and creates compounding business value.",
      },
      cta: null,
    }
  }

  return {
    id: "hzog--identify-genius-first",
    question: "What is the one meaningful outcome only I can create today?",
    cbFraming:
      "Before you can protect your Human Zone of Genius\u2122, you need to define it. This is the most important strategic decision you will make in Design My Week\u2122.",
    recommendation:
      "Ask yourself: what is the one thing I do that no AI, no team member, and no system can replicate? That is your Human Zone of Genius\u2122. Install it in Design My Week\u2122 so Cherry Blossom\u2122 can protect it every week.",
    triggeredBy: ["human-zone-of-genius-not-installed"],
    primaryOutcome: "reduce-execution-friction",
    why: "Founders who do not define their Human Zone of Genius\u2122 spend their highest-value hours on work that could be delegated. Defining it transforms the CEO Workday\u2122 from a general work block into a protected creative and strategic environment.",
    executive: getExecutiveById("strategy"),
    businessAsset: getAsset("decision-framework"),
    explainability: {
      constitutionalPrinciple: "Protect the founder\u2019s Zone of Genius\u2122 — defining it is the prerequisite to protecting it.",
      reasoningRule: "When Human Zone of Genius\u2122 is absent, recommend installation before recommending an Executive Outcome\u2122.",
      supportingContext: "Human Zone of Genius\u2122 was not found in your installed week.",
      expectedOutcome: "A defined Human Zone of Genius\u2122 that makes every future CEO Workday\u2122 more intentional and irreplaceable.",
    },
    cta: { label: "Design My Week™", href: "/design-my-week" },
  }
}

// ─── CEO Workday™ — Business Optimization Hour™ ─────────────────────────────

export function gpsForBusinessOptimization(ctx: HarmonyContextValue): GpsRecommendationCard {
  const friction = ctx.ceo?.executionFriction?.trim() ?? ""
  const hasFriction = friction.length > 0

  if (hasFriction) {
    return {
      id: "biz-opt--address-installed-friction",
      question: "What can I improve today so tomorrow becomes easier?",
      cbFraming:
        "Your Business Optimization Hour\u2122 exists to reduce the friction you identified when you designed your week. Small improvements compound into permanent operating efficiency.",
      recommendation: `You identified this execution friction: "${friction.slice(0, 100)}${friction.length > 100 ? "…" : ""}". Use today\u2019s Business Optimization Hour\u2122 to install one improvement — an SOP, a delegation, an automation, or an Operating Rule\u2122 — that eliminates or reduces this friction permanently.`,
      triggeredBy: ["execution-friction-installed"],
      primaryOutcome: "reduce-execution-friction",
      why: "Every hour spent optimizing a process that repeats weekly saves time compounding into the future. Eliminating your identified friction today prevents its cost from recurring every week indefinitely.",
      executive: getExecutiveById("operations"),
      businessAsset: getAsset("standard-operating-procedure"),
      explainability: {
        constitutionalPrinciple: "Reduce execution friction weekly — the Business Optimization Hour\u2122 is the dedicated investment in operating efficiency.",
        reasoningRule: "When execution friction is installed, the Business Optimization Hour\u2122 directly targets that friction rather than generating generic improvement suggestions.",
        supportingContext: `Your installed execution friction: "${friction.slice(0, 60)}${friction.length > 60 ? "…" : ""}"`,
        expectedOutcome: "One piece of execution friction removed permanently — an SOP, delegation, automation, or Operating Rule\u2122 installed.",
      },
      cta: null,
    }
  }

  return {
    id: "biz-opt--identify-friction",
    question: "What can I improve today so tomorrow becomes easier?",
    cbFraming:
      "The most powerful question in the Business Optimization Hour\u2122 is: what is costing me the most repeated time each week? The answer becomes your next SOP, delegation, or automation.",
    recommendation:
      "Identify the single most repetitive task in your business that you have performed at least three times. Document its steps today. Tomorrow, either delegate it, automate it, or install it as a Business Operating Rule\u2122.",
    triggeredBy: ["execution-friction-not-installed", "business-optimization-active"],
    primaryOutcome: "reduce-execution-friction",
    why: "The third repetition of any task is the signal to systemize it. One SOP installed today eliminates the decision overhead of that task permanently — a compounding return on a one-hour investment.",
    executive: getExecutiveById("operations"),
    businessAsset: getAsset("standard-operating-procedure"),
    explainability: {
      constitutionalPrinciple: "Prefer delegate, automate, eliminate — the Business Optimization Hour\u2122 is the operational investment that compounds time freedom.",
      reasoningRule: "The third-repetition rule: any task performed three or more times is a candidate for systemization during the Business Optimization Hour\u2122.",
      supportingContext: "No specific execution friction was identified in your installed week. Defaulting to the third-repetition rule.",
      expectedOutcome: "One documented SOP, delegation, or automation — a compounding business asset installed from today\u2019s work.",
    },
    cta: null,
  }
}

/* ===========================================================================
 * Primary dispatch function
 * ======================================================================== */

/**
 * deriveGpsRecommendation — the single entry point for all segment recommendations.
 *
 * Given a segment id and the current HarmonyContextValue, returns the
 * highest-leverage recommendation for that segment. Always deterministic.
 *
 * Phase 9.0: accepts an optional ProgressSummary so behavior-aware rules
 * (streak celebrations, pattern-based interventions) can fire when progress
 * data is available. Passing null degrades gracefully to context-only rules.
 */
export function deriveGpsRecommendation(
  segmentId: SegmentId,
  ctx: HarmonyContextValue,
  progress?: ProgressSummary | null,
  aggregate?: HarmonyContextAggregate | null,
): GpsRecommendationCard {
  // Base recommendation (unchanged logic)
  let card: GpsRecommendationCard
  switch (segmentId) {
    case "early-entry":       card = gpsForEarlyEntry(ctx); break
    case "morning-given":     card = gpsForMorningGiven(ctx); break
    case "workout":           card = gpsForWorkout(ctx, progress); break
    case "healthy-lunch":     card = gpsForHealthyLunch(ctx); break
    case "time-freedom":      card = gpsForTimeFreedom(ctx); break
    case "power-down":        card = gpsForPowerDown(ctx); break
    case "executive-intelligence": card = gpsForExecutiveIntelligence(ctx); break
    case "human-zone-of-genius":   card = gpsForHumanZoneOfGenius(ctx); break
    case "business-optimization":  card = gpsForBusinessOptimization(ctx); break
    case "ceo-workday":
      card = gpsForExecutiveIntelligence(ctx); break
    default:
      card = gpsForEarlyEntry(ctx)
  }

  // ── Phase 10.2 enrichment — only when aggregate is provided ──────────────
  if (aggregate) {
    // Confidence
    const confidence = computeConfidence(aggregate)

    // Momentum
    const buildingOnMomentum = aggregate.hasMomentum
    const momentumContext = aggregate.hasMomentum ? (aggregate.recentWin ?? null) : null

    // Asset chain
    const assetChain = card.businessAsset
      ? deriveAssetChain(card.businessAsset.id)
      : null

    // Adaptive learning prompt (context-aware)
    let adaptiveLearningPrompt =
      "What got in the way today? Your answer helps your GPS route better tomorrow."
    if (aggregate.pendingSkipReason === "low-energy") {
      adaptiveLearningPrompt =
        "Your GPS noticed you skipped yesterday due to low energy. Would you like a lighter path today?"
    } else if (aggregate.pendingSkipReason === "not-enough-time") {
      adaptiveLearningPrompt =
        "Your GPS noticed time was limited yesterday. What\u2019s available for you today?"
    } else if (aggregate.pendingSkipReason === "not-relevant") {
      adaptiveLearningPrompt =
        "Your GPS is adjusting based on your feedback. What would feel more aligned today?"
    }

    // ── Phase 10.3 — Executive Office™ brief ────────────────────────────────
    let executiveBrief: ExecutiveBrief | undefined
    try {
      const allFindings = deriveExecutiveFindings(aggregate)
      executiveBrief = buildExecutiveBrief(allFindings, aggregate)
    } catch {
      // Engine unavailable — degrade gracefully
      executiveBrief = undefined
    }

    // ── Phase 10.4 — Executive Capability Intelligence™ ─────────────────────
    let capabilityBriefing:
      | import("@/lib/executive-capability/types").ExecutiveBriefingTopicId
      | undefined
    try {
      const { getBriefingForRecommendation } = await import(
        "@/lib/executive-capability/capability-engine"
      )
      const result = getBriefingForRecommendation(card, aggregate)
      capabilityBriefing = result ?? undefined
    } catch {
      capabilityBriefing = undefined
    }

    return {
      ...card,
      confidence,
      buildingOnMomentum,
      momentumContext,
      assetChain,
      adaptiveLearningPrompt,
      executiveBrief,
      capabilityBriefing,
    }
  }

  return card
}

/* ===========================================================================
 * Executive AI Team™ architecture cards (Part 6)
 * ======================================================================== */

export interface ExecutiveTeamCard {
  executiveId: string
  executiveName: string
  executiveTitle: string
  architectureStatus: string
  preparing: string
}

/**
 * Returns the nine Executive AI Team™ architecture cards.
 * When an aggregate is provided, preparing messages are context-aware.
 * Falls back to generic messages when no aggregate is available (zero regressions).
 */
export function getExecutiveTeamCards(
  aggregate?: HarmonyContextAggregate | null,
): ExecutiveTeamCard[] {
  const agg = aggregate ?? null

  // ── Context-aware preparing messages ──────────────────────────────────────
  const marketingPreparing = agg?.biggestOpportunities?.includes("marketing")
    ? "Preparing marketing recommendations aligned to your declared Growth Intelligence™ priority: Marketing."
    : agg?.biggestGoals?.includes("visibility") || agg?.biggestOpportunities?.includes("finding-ideal-customer")
    ? "Preparing visibility and ideal customer acquisition strategies for your current stage."
    : "Preparing campaign and visibility recommendations aligned to your current business stage."

  const financePreparing =
    agg?.businessCredit === "no-credit"
      ? "Business credit not yet established — preparing a foundation-first credit strategy for you."
      : agg?.businessCredit === "building"
      ? "Your business credit is building — reviewing next steps to accelerate your profile."
      : agg?.biggestOpportunities?.includes("business-credit")
      ? "Business credit is on your radar — reviewing the fastest path to a strong business credit profile."
      : "Reviewing opportunities to improve margins, pricing, and cash flow clarity."

  const operationsPreparing = agg?.executionFriction
    ? `Reviewing your declared execution friction: "${agg.executionFriction}" — identifying the fastest SOP or delegation path.`
    : agg?.biggestOpportunities?.includes("systems-sops")
    ? "Systems & SOPs are your declared opportunity — identifying the highest-leverage SOP to install next."
    : "Identifying repetitive work patterns suitable for SOPs, delegation, or automation."

  const salesPreparing =
    agg?.biggestOpportunities?.includes("increasing-sales") || agg?.biggestOpportunities?.includes("pricing")
      ? "Revenue optimization is your declared priority — reviewing pricing, conversion, and pipeline signals."
      : agg?.revenueStage === "pre-revenue"
      ? "Pre-revenue stage detected — preparing your first offer clarification and revenue strategy."
      : "Reviewing pipeline signals and identifying your next highest-leverage revenue action."

  const strategyPreparing = agg?.growthVision
    ? `Evaluating today\u2019s highest-leverage opportunity against your Growth Vision\u2122: ${agg.growthVision.replace(/-/g, " ")}.`
    : agg?.longTermVision
    ? `Aligning today\u2019s priorities against your declared Long-Term Vision\u2122: ${String(agg.longTermVision).replace(/-/g, " ")}.`
    : "Evaluating today\u2019s highest-leverage opportunity against your Business Stage\u2122 and installed priorities."

  const innovationPreparing =
    agg?.biggestOpportunities?.includes("ai-implementation")
      ? "AI Implementation is your declared opportunity — preparing the highest-ROI AI workflow for your business model."
      : "Evaluating AI adoption opportunities aligned to your current operating model."

  const growthPreparing =
    agg?.biggestOpportunities?.includes("scaling") || agg?.biggestOpportunities?.includes("leadership")
      ? "Scaling and leadership are your declared priorities — preparing thought leadership and team development strategies."
      : agg?.biggestOpportunities?.includes("strategic-partnerships")
      ? "Strategic partnerships are your declared opportunity — evaluating partnership and alliance strategies."
      : "Identifying thought leadership and founder development opportunities."

  const peoplePreparing = agg?.biggestOpportunities?.includes("hiring")
    ? "Hiring is your declared opportunity — preparing a role clarity and hiring process strategy."
    : agg?.biggestOpportunities?.includes("delegation")
    ? "Delegation is your declared priority — reviewing your delegation readiness and the first roles to delegate."
    : "Monitoring founder capacity and Human Sustainability\u2122 signals across your operating rhythm."

  const clientPreparing =
    agg?.biggestOpportunities?.includes("recurring-revenue")
      ? "Recurring revenue is your declared opportunity — identifying retention and subscription model opportunities."
      : "Identifying client journey improvements and retention opportunities."

  return [
    {
      executiveId: "strategy",
      executiveName: "Strategy Executive\u2122",
      executiveTitle: "Chief Strategy Officer (CSO)",
      architectureStatus: "architecture",
      preparing: strategyPreparing,
    },
    {
      executiveId: "marketing-brand",
      executiveName: "Marketing & Brand Executive\u2122",
      executiveTitle: "Chief Marketing Officer (CMO)",
      architectureStatus: "architecture",
      preparing: marketingPreparing,
    },
    {
      executiveId: "sales",
      executiveName: "Sales Executive\u2122",
      executiveTitle: "Chief Revenue Officer (CRO)",
      architectureStatus: "architecture",
      preparing: salesPreparing,
    },
    {
      executiveId: "operations",
      executiveName: "Operations Executive\u2122",
      executiveTitle: "Chief Operating Officer (COO)",
      architectureStatus: "architecture",
      preparing: operationsPreparing,
    },
    {
      executiveId: "finance",
      executiveName: "Finance Executive\u2122",
      executiveTitle: "Chief Financial Officer (CFO)",
      architectureStatus: "architecture",
      preparing: financePreparing,
    },
    {
      executiveId: "people-culture",
      executiveName: "People & Culture Executive\u2122",
      executiveTitle: "Chief People & Culture Officer",
      architectureStatus: "architecture",
      preparing: peoplePreparing,
    },
    {
      executiveId: "client-success",
      executiveName: "Client Success Executive\u2122",
      executiveTitle: "Chief Experience Officer (CXO)",
      architectureStatus: "architecture",
      preparing: clientPreparing,
    },
    {
      executiveId: "innovation",
      executiveName: "Innovation Executive\u2122",
      executiveTitle: "Chief Innovation & AI Officer",
      architectureStatus: "architecture",
      preparing: innovationPreparing,
    },
    {
      executiveId: "growth",
      executiveName: "Growth Executive\u2122",
      executiveTitle: "Chief Growth & Leadership Officer",
      architectureStatus: "architecture",
      preparing: growthPreparing,
    },
  ]
}
