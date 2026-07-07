/**
 * Founder Intelligence Engine™ — the deterministic decision layer of the
 * Founder Operating System™.
 *
 * Per the platform philosophy, recommendations are DETERMINISTIC before they
 * are ever generative: given the same member data and the same moment, the
 * engine always produces the same, explainable result. A generative wording
 * layer (Cherry Blossom) can later polish copy ONLY when several steps are
 * equally valid — but it may never invent a step the data can't justify.
 *
 * Pure module: no I/O, no React, no Supabase. Everything is derived from the
 * FounderIntelligenceContext the caller assembles, which makes it trivial to
 * unit-test and safe to run on the client.
 */
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import type {
  BriefCard,
  ExecutiveBrief,
  FounderIntelligenceContext,
  NextBestStep,
  TimeFreedomTimeState,
} from "./types"

/** Minutes-since-midnight when Time Freedom™ begins on a business day (5:00 PM). */
const TIME_FREEDOM_START_MINUTES = 17 * 60

/** Format a minute count as a warm "Xh Ym" / "Ym" label. */
function formatRemaining(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h <= 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** True when the member is a Monday Installation member (not full Business Week). */
function isMondayMember(ctx: FounderIntelligenceContext): boolean {
  return ctx.accessLevel === "monday"
}

/** This week's Weekly Reality Check™ completion, defaulting to false when unknown. */
function realityCheckDoneThisWeek(ctx: FounderIntelligenceContext): boolean {
  return Boolean(ctx.realityCheck?.currentIsThisWeek)
}

/** Business Foundation™ completion, defaulting to false when unknown. */
function foundationComplete(ctx: FounderIntelligenceContext): boolean {
  return Boolean(ctx.foundation?.completedAt)
}

/** The lowest-scoring life value category, if any Reality Check data exists. */
function lowestLifeValue(ctx: FounderIntelligenceContext): { label: string; percentage: number } | null {
  const scores = ctx.realityCheck?.current?.life_value_scores
  if (!scores || scores.length === 0) return null
  return scores.reduce((min, row) => (row.percentage < min.percentage ? row : min), scores[0])
}

// ---------------------------------------------------------------------------
// Today's Next Best Step™
// ---------------------------------------------------------------------------

/**
 * Resolves the single highest-leverage action for this member, right now.
 *
 * The ladder is ordered most- to least-urgent. The FIRST rule that matches
 * wins, which keeps the recommendation predictable and explainable. Because
 * per-block completion isn't tracked yet, the daily rules follow the member's
 * live position in the Operating Engine schedule — an honest, traceable signal.
 */
export function deriveNextBestStep(ctx: FounderIntelligenceContext): NextBestStep {
  const { experience, today } = ctx
  const { time, businessDay } = experience
  const currentBlockId = businessDay.current.id
  const dayType = today.day.dayType

  // 1. Digital Detox hours — the community is closed. Protect recovery.
  if (currentBlockId === "digital-detox") {
    return {
      id: "rest",
      title: "Protect Tonight's Rest",
      reason: "Your operating day is complete and the community is resting — tomorrow's success begins with sleep tonight.",
      cta: { label: "Enjoy Time Freedom™", href: "/" },
      traceableTo: ["Current Operating Experience™: Unplug Digital Detox™"],
    }
  }

  // 2. Monday Installation member on a locked business day → continue the week.
  if (today.locked && isMondayMember(ctx)) {
    return {
      id: "upgrade_locked_day",
      title: "Continue Your Work-Life Balance Business Week™",
      reason: `${today.day.weekday}'s experience continues the installation you began on Monday — unlock it whenever you're ready.`,
      cta: { label: "Continue Your Business Week™", href: "/pricing" },
      traceableTo: [`Membership access: Monday Installation`, `Today: ${today.day.title}`],
    }
  }

  // 3. Weekly Reality Check™ not done this week → it anchors the whole week.
  if (!realityCheckDoneThisWeek(ctx)) {
    const sunday = dayType === "sunday_design"
    return {
      id: "weekly_reality_check",
      title: "Begin Your Weekly Reality Check™",
      reason: sunday
        ? "It's Sunday Design Day™ — a short, guided Reality Check sets your intention before the week begins."
        : "Your week isn't yet anchored — a quick Reality Check tells Cherry Blossom how to support you.",
      cta: { label: "Start the Reality Check™", href: "/begin" },
      estimatedTime: "5–10 minutes",
      traceableTo: ["Weekly Reality Check™: not completed this week"],
    }
  }

  // 4. Business Foundation™ not done → the one-time context that powers everything.
  if (!foundationComplete(ctx)) {
    return {
      id: "business_foundation",
      title: "Complete Your Business Foundation™",
      reason: "This one-time assessment lets Cherry Blossom tailor every recommendation to your business stage and goals.",
      cta: { label: "Build Your Foundation™", href: "/business-foundation" },
      estimatedTime: "8–12 minutes",
      traceableTo: ["Business Foundation Assessment™: not completed"],
    }
  }

  // 5. Sunday, Design Day complete → enjoy the rest of Time Freedom.
  if (dayType === "sunday_design") {
    return {
      id: "sunday_enjoy",
      title: "Enjoy the Rest of Your Time Freedom™",
      reason: "Your week is designed and your intention is set — Sunday is still yours to enjoy.",
      cta: { label: "Capture a Time Freedom Moment™", href: "/#time-freedom-moments" },
      traceableTo: ["Sunday Design Day™: complete", "Weekly Reality Check™: complete"],
    }
  }

  // 6. Time Freedom day (Fri/Sat) → live it fully.
  if (dayType === "time_freedom") {
    return {
      id: "time_freedom_day",
      title: "Live Your Time Freedom™",
      reason: "Business workspaces rest today — this is the life your intentional week was built to protect.",
      cta: { label: "Capture a Time Freedom Moment™", href: "/#time-freedom-moments" },
      traceableTo: [`Today: ${today.day.weekday} · Time Freedom™`],
    }
  }

  // 7. Business day, after 5:00 PM → the workday is done; step into Time Freedom.
  if (time.minutesSinceMidnight >= TIME_FREEDOM_START_MINUTES) {
    return {
      id: "evening_time_freedom",
      title: "Step Into Time Freedom™",
      reason: "Your protected CEO Workday™ is complete — the evening is already protected for your life.",
      cta: { label: "Capture a Time Freedom Moment™", href: "/#time-freedom-moments" },
      traceableTo: ["Current Operating Experience™: after 5:00 PM", "Today: business day complete"],
    }
  }

  // 8. Business day, during the day → the current Operating Experience™ block.
  const block = SCHEDULE_BY_ID[currentBlockId]
  return {
    id: `block_${currentBlockId}`,
    title: block?.cta ?? `Enter ${block?.shortTitle ?? "Your Next Block"}`,
    reason: `Based on your operating rhythm, your next high-leverage step is your ${block?.shortTitle ?? "current block"}.`,
    cta: {
      label: block?.cta ?? "Open Your CEO Dashboard",
      href: block?.href ?? "/human-zone-of-genius-team",
    },
    traceableTo: [`Current Operating Experience™: ${block?.shortTitle ?? currentBlockId}`],
  }
}

// ---------------------------------------------------------------------------
// Cherry Blossom Executive Brief™
// ---------------------------------------------------------------------------

/**
 * Builds the concise executive brief — think executive assistant, not
 * motivational speech. Each card is one or two sentences and only appears when
 * the member data justifies it. Focus and Insight always render; the rest are
 * conditional so the brief never pads itself with empty encouragement.
 */
export function deriveExecutiveBrief(ctx: FounderIntelligenceContext): ExecutiveBrief {
  const { experience, today, realityCheck, foundation } = ctx
  const first = ctx.firstName?.trim()
  const cards: BriefCard[] = []

  // Today's Focus — from the member's chosen weekly priorities, else the day.
  const priorities = realityCheck?.current?.selected_priority_areas
  if (priorities && priorities.length > 0) {
    cards.push({
      kind: "focus",
      title: "Today's Focus",
      body: `Keep your energy on ${formatList(priorities.slice(0, 3))} — the priority ${
        priorities.length > 1 ? "areas" : "area"
      } you chose this week.`,
      traceableTo: ["Weekly Reality Check™: selected priority areas"],
    })
  } else {
    cards.push({
      kind: "focus",
      title: "Today's Focus",
      body: `${today.day.title} — ${today.day.tagline}`,
      traceableTo: [`Operating rhythm: ${today.day.weekday}`],
    })
  }

  // Today's Opportunity — grounded in the founder's own vision or challenges.
  const vision = foundation?.founderSuccessVision?.trim()
  const challenges = foundation?.businessChallenges
  if (vision) {
    cards.push({
      kind: "opportunity",
      title: "Today's Opportunity",
      body: `Every focused block today moves you toward the success you defined: "${truncate(vision, 120)}"`,
      traceableTo: ["Business Foundation™: founder success vision"],
    })
  } else if (challenges && challenges.length > 0) {
    cards.push({
      kind: "opportunity",
      title: "Today's Opportunity",
      body: `A small, deliberate move on ${formatList(challenges.slice(0, 2))} today compounds over the week.`,
      traceableTo: ["Business Foundation™: business challenges"],
    })
  }

  // Founder Risk™ — the lowest life value, framed as protection not alarm.
  const low = lowestLifeValue(ctx)
  if (low && low.percentage < 60) {
    cards.push({
      kind: "risk",
      title: "Founder Risk™",
      body: `${low.label} scored ${low.percentage}% in your last Reality Check — protect a little time for it before it costs you momentum.`,
      traceableTo: ["Weekly Reality Check™: lowest life value score"],
    })
  }

  // Celebration — real, measurable progress only.
  const delta = realityCheck?.scoreDelta
  if (typeof delta === "number" && delta > 0) {
    cards.push({
      kind: "celebration",
      title: "Celebration",
      body: `Your overall Reality Check score rose ${delta} point${delta === 1 ? "" : "s"} from last week — momentum you built on purpose.`,
      traceableTo: ["Weekly Reality Check™: week-over-week score delta"],
    })
  } else if (experience.member.streak >= 3) {
    cards.push({
      kind: "celebration",
      title: "Celebration",
      body: `You're on a ${experience.member.streak}-day streak of showing up for your operating rhythm.`,
      traceableTo: ["Member streak"],
    })
  }

  // Reminder — the single most useful nudge, and only one.
  const reminder = deriveReminder(ctx)
  if (reminder) cards.push(reminder)

  // Insight — the Operating Engine's daily coaching line (stable per day).
  cards.push({
    kind: "insight",
    title: "Insight",
    body: experience.motivation.coachingMessage,
    traceableTo: ["Operating rhythm: daily coaching"],
  })

  const greeting = `${experience.member.greetingEmoji} ${experience.member.greeting}${
    first ? `, ${first}` : ""
  }`

  return { greeting, cards }
}

/** Chooses the single most relevant reminder card, or none. */
function deriveReminder(ctx: FounderIntelligenceContext): BriefCard | null {
  // Upcoming time-anchored memory (birthday / anniversary / trip) wins first.
  const upcoming = nextUpcomingMemory(ctx)
  if (upcoming) {
    return {
      kind: "reminder",
      title: "Reminder",
      body: upcoming,
      traceableTo: ["Progressive memory: upcoming important date"],
    }
  }
  if (!foundationComplete(ctx)) {
    return {
      kind: "reminder",
      title: "Reminder",
      body: "Your Business Foundation™ is still open — completing it sharpens every future recommendation.",
      traceableTo: ["Business Foundation™: not completed"],
    }
  }
  return null
}

/** Finds the soonest important date within ~14 days from memory, if any. */
function nextUpcomingMemory(ctx: FounderIntelligenceContext, windowDays = 14, now = new Date()): string | null {
  const dated = ctx.memories.filter((m) => m.date)
  if (dated.length === 0) return null

  let best: { days: number; content: string } | null = null
  for (const m of dated) {
    const when = new Date(m.date as string)
    if (Number.isNaN(when.getTime())) continue
    // Compare on month/day so recurring dates (birthdays) still surface.
    const next = new Date(now.getFullYear(), when.getMonth(), when.getDate())
    if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      next.setFullYear(now.getFullYear() + 1)
    }
    const days = Math.round((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (days >= 0 && days <= windowDays && (!best || days < best.days)) {
      best = { days, content: m.content }
    }
  }
  if (!best) return null
  const when = best.days === 0 ? "today" : best.days === 1 ? "tomorrow" : `in ${best.days} days`
  return `${best.content} is coming up ${when} — a moment worth protecting.`
}

// ---------------------------------------------------------------------------
// Time Freedom Time™
// ---------------------------------------------------------------------------

const CAPTURE_CTA = { label: "Capture a Time Freedom Moment™", href: "/#time-freedom-moments" }

/**
 * Derives the living Time Freedom Time™ card. Rather than counting down to the
 * end of work, it counts down to — and then celebrates — the member's life.
 */
export function deriveTimeFreedomTime(ctx: FounderIntelligenceContext): TimeFreedomTimeState {
  const { experience, today } = ctx
  const { time, businessDay } = experience
  const dayType = today.day.dayType
  const planned = plannedActivitiesFromMemory(ctx)
  const suggestions = ["Nature", "Family", "Self-care", "Adventure", "Learning"]

  // Digital Detox hours — rest, regardless of weekday.
  if (businessDay.current.id === "digital-detox") {
    return {
      phase: "night",
      emoji: "🌙",
      headline: "Rest Is Part of the Rhythm™",
      subline: "The community is resting. Let your mind and body do the same — tomorrow begins tonight.",
      beginsAtLabel: null,
      remainingLabel: null,
      plannedActivities: [],
      suggestions: [],
      cta: { label: "Enjoy Time Freedom™", href: "/" },
    }
  }

  // Sunday — Design Day ritual, then celebrate the rest of the weekend.
  if (dayType === "sunday_design") {
    const designed = Boolean(ctx.realityCheck?.currentIsThisWeek)
    if (!designed) {
      return {
        phase: "sunday_design",
        emoji: "🌸",
        headline: "Sunday Design Day™",
        subline: "Still your Time Freedom™ — take about 20 intentional minutes to design the week ahead, then get back to your Sunday.",
        beginsAtLabel: null,
        remainingLabel: "~20 minutes",
        plannedActivities: [],
        suggestions: [],
        cta: { label: "Begin Sunday Design Day™", href: "/sunday-shift" },
      }
    }
    return {
      phase: "sunday_after",
      emoji: "🌿",
      headline: "Enjoy the Rest of Your Time Freedom™",
      subline: "Your week is designed. Tomorrow, Make Time For More On Mondays™ begins — for now, enjoy your Sunday.",
      beginsAtLabel: null,
      remainingLabel: null,
      plannedActivities: planned,
      suggestions: planned.length === 0 ? suggestions : [],
      cta: CAPTURE_CTA,
    }
  }

  // Friday & Saturday — living the 3-day Time Freedom Weekend™.
  if (dayType === "time_freedom") {
    return {
      phase: "living_weekend",
      emoji: "🌿",
      headline: "You're Living Time Freedom™",
      subline: "Reconnect, recharge, and enjoy your life. This is what your intentional week was built to protect.",
      beginsAtLabel: null,
      remainingLabel: null,
      plannedActivities: planned,
      suggestions: planned.length === 0 ? suggestions : [],
      cta: CAPTURE_CTA,
    }
  }

  // Business day — before or after the 5:00 PM transition.
  if (time.minutesSinceMidnight >= TIME_FREEDOM_START_MINUTES) {
    return {
      phase: "living_evening",
      emoji: "🌿",
      headline: "You're Living Time Freedom™",
      subline: "Your CEO Workday™ is complete and your evening is protected. Be fully present with what matters most.",
      beginsAtLabel: null,
      remainingLabel: null,
      plannedActivities: planned,
      suggestions: planned.length === 0 ? suggestions : [],
      cta: CAPTURE_CTA,
    }
  }

  const remaining = TIME_FREEDOM_START_MINUTES - time.minutesSinceMidnight
  return {
    phase: "before",
    emoji: "🌿",
    headline: "Today's Time Freedom Begins",
    subline: "Finish intentionally. Your evening has already been protected.",
    beginsAtLabel: "5:00 PM",
    remainingLabel: `${formatRemaining(remaining)} remaining`,
    plannedActivities: planned,
    suggestions: planned.length === 0 ? suggestions : [],
    cta: { label: "Enter Your CEO Workday™", href: "/human-zone-of-genius-team" },
  }
}

/** Pulls Time Freedom-flavored plans Cherry Blossom remembers, if any. */
function plannedActivitiesFromMemory(ctx: FounderIntelligenceContext): string[] {
  const LIFE_TYPES = ["lifestyle_preference", "work_life_preference", "relationship"]
  return ctx.memories
    .filter((m) => LIFE_TYPES.includes(m.type))
    .map((m) => m.content)
    .slice(0, 4)
}

// ---------------------------------------------------------------------------
// small text helpers
// ---------------------------------------------------------------------------

function formatList(items: string[]): string {
  const clean = items.filter(Boolean)
  if (clean.length === 0) return ""
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}
