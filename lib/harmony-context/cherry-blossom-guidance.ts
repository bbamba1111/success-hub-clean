/**
 * Cherry Blossom™ Operating Guidance — Phase 9.0 (Living Intelligence™)
 *
 * Cherry Blossom™ is no longer a static narrator.
 * She is a proactive Executive Guide who reads real context before speaking.
 *
 * Before producing guidance, she reads:
 *   - HarmonyContextValue (segment, week design, intention, CEO context)
 *   - ProgressSummary™ (streaks, completions, asset counts)
 *   - Upcoming life events from memory (via UpcomingLifeEvent[])
 *
 * Her guidance changes dynamically per Part 1 of Phase 9.0:
 *   - Morning: celebrates previous-day wins, surfaces today's priority
 *   - Time Freedom™: notices upcoming personal moments
 *   - Power Down™: celebrates consistency streaks
 *   - CEO Workday™: surfaces highest-leverage focus from context
 *
 * PURE module: no React, no I/O, no Supabase. Same inputs → same output.
 */

import type { HarmonyContextValue } from "./types"
import type { ProgressSummary } from "@/lib/founder-gps/progress-intelligence"

/** A life event with proximity information — from memory or Whole-Life Context™. */
export interface UpcomingLifeEvent {
  label: string
  daysUntil: number
  requiresProtection: boolean
}

export interface CherryBlossomGuidance {
  /** Personalized greeting line, e.g. "Good Morning, Barbara." */
  greeting: string
  /** One to three calm sentences. Context-aware. Never generic. */
  message: string
  /**
   * Optional secondary observation — progress celebration, upcoming event notice,
   * or gentle pattern observation. Shown beneath the primary message.
   */
  observation: string | null
}

/** Join non-empty clauses into a single spaced string. */
function compose(...parts: (string | false | null | undefined)[]): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(" ")
}

/** Pluralize a word based on count. */
function plural(n: number, singular: string, pluralForm?: string): string {
  return n === 1 ? singular : (pluralForm ?? `${singular}s`)
}

/**
 * Produce Cherry Blossom's greeting + context-aware message for the current
 * operating moment. Progress data and upcoming life events are optional — she
 * degrades gracefully when they are absent.
 */
export function getCherryBlossomGuidance(
  ctx: HarmonyContextValue,
  progress?: ProgressSummary | null,
  upcomingEvents?: UpcomingLifeEvent[],
): CherryBlossomGuidance {
  const name = ctx.firstName?.trim()
  const greeting = name ? `${ctx.greeting}, ${name}.` : `${ctx.greeting}.`
  const events = upcomingEvents ?? []

  // ── No installed week yet ─────────────────────────────────────────────────
  if (!ctx.hasDesignedWeek) {
    return {
      greeting,
      message:
        "Your week hasn't been designed yet. When you're ready, Sunday Design Day™ will install the Operating Rules™ and Daily Non-Negotiables™ that guide each part of your day.",
      observation: null,
    }
  }

  const intentionClause = ctx.weeklyIntention
    ? `This week's intention: "${ctx.weeklyIntention}".`
    : ""

  const seg = ctx.currentSegment

  // ── Between segments (overnight Digital Detox) ───────────────────────────
  if (!seg) {
    const streakObs = buildStreakObservation(progress)
    return {
      greeting,
      message: compose(
        "The day is complete. Tomorrow has already been designed —",
        "let your devices rest, and let your mind do the same.",
      ),
      observation: streakObs,
    }
  }

  // ── Segment-specific context-aware guidance ───────────────────────────────
  switch (seg.id) {
    case "early-entry":
    case "early-access": {
      const message = compose(
        `Welcome to ${ctx.dayName}.`,
        intentionClause,
        seg.nonNegotiable &&
          `Before the day asks anything of you, honor your first commitment: ${seg.nonNegotiable}`,
      )
      const observation = buildEarlyEntryObservation(progress, events)
      return { greeting, message, observation }
    }

    case "morning-given": {
      const message = compose(
        "Before you lead your business, lead yourself.",
        seg.nonNegotiable
          ? `Honor today's Morning Non-Negotiable™: ${seg.nonNegotiable}`
          : "Move through your GIV\u2022EN™ routine with intention.",
      )
      const observation = buildMorningObservation(progress, events)
      return { greeting, message, observation }
    }

    case "movement":
    case "workout": {
      const message = compose(
        "Next, let's protect your energy.",
        seg.nonNegotiable
          ? `Today's Workout Window™ commitment: ${seg.nonNegotiable}`
          : "Give your body the movement it needs to carry your vision.",
      )
      const observation = buildWorkoutObservation(progress)
      return { greeting, message, observation }
    }

    case "lunch":
    case "healthy-lunch": {
      const message = compose(
        "Step fully away and return restored.",
        seg.nonNegotiable && `Today's midday commitment: ${seg.nonNegotiable}`,
      )
      return { greeting, message, observation: null }
    }

    case "ceo-workday": {
      const message = buildCeoWorkdayMessage(ctx, name ?? null)
      const observation = buildCeoWorkdayObservation(ctx, progress)
      return { greeting, message, observation }
    }

    case "time-freedom": {
      const message = compose(
        "You earned this time. Be fully present with the life your business exists to support.",
        seg.nonNegotiable && `Tonight's commitment: ${seg.nonNegotiable}`,
      )
      const observation = buildTimeFreedomObservation(progress, events)
      return { greeting, message, observation }
    }

    case "power-down": {
      const message = compose(
        "You intentionally designed tomorrow on Sunday. Tonight's role is simple: protect it.",
        seg.nonNegotiable
          ? `Honor your Power Down & Unplug™ commitment: ${seg.nonNegotiable}`
          : "Let the day come to a gentle close.",
      )
      const observation = buildPowerDownObservation(progress)
      return { greeting, message, observation }
    }

    default: {
      const message = compose(
        intentionClause,
        seg.rule && `Today's Operating Rule™ for ${seg.title}: "${seg.rule}".`,
        seg.nonNegotiable && `Honor today's Non-Negotiable™: ${seg.nonNegotiable}`,
      )
      return { greeting, message, observation: null }
    }
  }
}

/* ===========================================================================
 * Context-aware CEO Workday message (Part 1 — Phase 9.0)
 * ======================================================================== */

function buildCeoWorkdayMessage(ctx: HarmonyContextValue, name: string | null): string {
  const nameClause = name ? `${name}, ` : ""

  // If a weekly intention is set, anchor to it
  if (ctx.weeklyIntention) {
    return compose(
      `${nameClause}your CEO Workday™ is ready.`,
      `This week's intention — "${ctx.weeklyIntention}" — guides your highest-leverage work today.`,
      ctx.ceo.humanZoneOfGenius &&
        `Your Human Zone of Genius™ focus is "${ctx.ceo.humanZoneOfGenius}".`,
    )
  }

  // Focus area driven
  if (ctx.focusAreas.length > 0) {
    return compose(
      `${nameClause}your CEO Workday™ is ready.`,
      `Today we're advancing your ${ctx.focusAreas[0]} focus.`,
      ctx.ceo.businessOperatingRule &&
        `Today's Business Operating Rule™: "${ctx.ceo.businessOperatingRule}".`,
    )
  }

  // CEO priorities set
  if (ctx.ceo.priorities?.trim()) {
    return compose(
      `${nameClause}your CEO Workday™ is ready.`,
      `Today's executive priorities: ${ctx.ceo.priorities}.`,
    )
  }

  // Default — warm and grounding
  return compose(
    `${nameClause}your CEO Workday™ is ready.`,
    "I have reviewed your week's design. Begin with AI Augmentation Hour™ before entering deep executive work.",
  )
}

/* ===========================================================================
 * Observation builders (Part 1 — Phase 9.0)
 * ======================================================================== */

/**
 * Builds a progress streak observation for morning segments.
 * Celebrates consistency without gamification.
 */
function buildMorningObservation(
  progress: ProgressSummary | null | undefined,
  events: UpcomingLifeEvent[],
): string | null {
  // Check for imminent life events first
  const imminent = events.find((e) => e.daysUntil <= 2 && e.requiresProtection)
  if (imminent) {
    const when = imminent.daysUntil === 0 ? "today" : imminent.daysUntil === 1 ? "tomorrow" : "in two days"
    return `Your ${imminent.label} is ${when}. Cherry Blossom\u2122 will help protect your schedule.`
  }

  if (!progress) return null

  if (progress.nonNegotiableStreak >= 7) {
    return `You have honored a Daily Non-Negotiable™ for ${progress.nonNegotiableStreak} consecutive ${plural(progress.nonNegotiableStreak, "day")}. This is executive consistency.`
  }
  if (progress.nonNegotiableStreak >= 3) {
    return `Three or more consecutive days of honoring your commitments. The compound effect is building.`
  }

  return null
}

/**
 * Builds an early-entry observation — often the first message of the day.
 * Celebrates yesterday's wins if available.
 */
function buildEarlyEntryObservation(
  progress: ProgressSummary | null | undefined,
  events: UpcomingLifeEvent[],
): string | null {
  const imminent = events.find((e) => e.daysUntil <= 1 && e.requiresProtection)
  if (imminent) {
    const when = imminent.daysUntil === 0 ? "today" : "tomorrow"
    return `Important: your ${imminent.label} is ${when}. Consider using Flex Time™ to honor this commitment.`
  }

  if (!progress) return null

  if (progress.lastExecutiveOutcome) {
    return `Yesterday you made progress on: "${progress.lastExecutiveOutcome}". Today is another opportunity to advance it.`
  }

  return null
}

/**
 * Builds a workout-specific observation — celebrates streaks.
 */
function buildWorkoutObservation(progress: ProgressSummary | null | undefined): string | null {
  if (!progress) return null

  if (progress.workoutStreak >= 5) {
    return `Your Workout Window™ streak is ${progress.workoutStreak} ${plural(progress.workoutStreak, "day")}. This is the consistency that creates sustainable energy.`
  }
  if (progress.workoutStreak >= 3) {
    return `${progress.workoutStreak} consecutive Workout Windows™ honored. You are building the habit.`
  }
  if (progress.workoutStreak === 0 && progress.todayLifeEntryExists === false) {
    return "The goal is not athletic performance. The goal is showing up consistently, one day at a time."
  }

  return null
}

/**
 * Builds a CEO Workday observation — surfaces business progress and asset intelligence.
 */
function buildCeoWorkdayObservation(
  ctx: HarmonyContextValue,
  progress: ProgressSummary | null | undefined,
): string | null {
  if (!progress) return null

  // Celebrate asset creation
  if (progress.totalAssetsIdentified > 0) {
    return `You have identified ${progress.totalAssetsIdentified} Business ${plural(progress.totalAssetsIdentified, "Asset™", "Assets™")} across recent sessions. Each one creates compounding value beyond today's work.`
  }

  // Celebrate completed outcomes this week
  if (progress.executiveOutcomesCompletedThisWeek >= 3) {
    return `${progress.executiveOutcomesCompletedThisWeek} Executive Outcomes™ completed this week. You are building real business momentum.`
  }

  // Celebrate SOPs
  if (progress.totalSopsCreated >= 2) {
    return `${progress.totalSopsCreated} SOPs created. Each one reduces execution friction permanently and makes your business more delegatable.`
  }

  return null
}

/**
 * Builds a Time Freedom™ observation — notices upcoming personal moments.
 */
function buildTimeFreedomObservation(
  progress: ProgressSummary | null | undefined,
  events: UpcomingLifeEvent[],
): string | null {
  // Upcoming events take priority in Time Freedom™
  const nearEvent = events.find((e) => e.daysUntil <= 7 && e.requiresProtection)
  if (nearEvent) {
    if (nearEvent.daysUntil === 0) {
      return `Your ${nearEvent.label} is today. This would be a meaningful way to spend your Time Freedom™.`
    }
    if (nearEvent.daysUntil <= 3) {
      return `Your ${nearEvent.label} is in ${nearEvent.daysUntil} ${plural(nearEvent.daysUntil, "day")}. This is a great evening to begin planning something meaningful.`
    }
    return `Your ${nearEvent.label} is approaching in ${nearEvent.daysUntil} days. Consider how to make it special.`
  }

  if (!progress) return null

  // Recognize time freedom protection patterns
  if (progress.nonNegotiableStreak >= 3) {
    return `You have protected your evening ${progress.nonNegotiableStreak} days in a row. Consistency creates sustainable success.`
  }

  return null
}

/**
 * Builds a Power Down™ observation — celebrates closure and protection.
 * This is the "Closed For Business™" moment.
 */
function buildPowerDownObservation(progress: ProgressSummary | null | undefined): string | null {
  if (!progress) return null

  if (progress.nonNegotiableStreak >= 3) {
    return `Today's business is officially Closed For Business™. You have protected your evening ${progress.nonNegotiableStreak} days in a row. Consistency creates sustainable success.`
  }

  // Celebrate any completion today
  if (progress.todayLifeEntryExists) {
    return `Today's business is officially Closed For Business™. Tomorrow deserves a fully restored CEO.`
  }

  return "Today's business is officially Closed For Business™. Tomorrow deserves a fully restored CEO."
}

/**
 * Builds a between-segment streak observation.
 */
function buildStreakObservation(progress: ProgressSummary | null | undefined): string | null {
  if (!progress) return null
  if (progress.nonNegotiableStreak >= 3) {
    return `${progress.nonNegotiableStreak} consecutive days of honoring your commitments. This is real consistency.`
  }
  return null
}
