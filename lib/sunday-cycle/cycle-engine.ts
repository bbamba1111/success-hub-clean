/**
 * Personal Cycle Engine™ (formerly "Sunday Cycle Engine") — Phase 6.2
 * ---------------------------------------------------------------------------
 * Pure, side-effect-free logic that determines a founder's position within
 * their personal 30-Day Work-Life Balance Experience Cycle™, based entirely
 * on their own installation date stored in Supabase.
 *
 * IMPORTANT — two distinct, non-overlapping concepts live in this codebase:
 *
 *   1. The PERSONAL 30-DAY CYCLE (this module): anchored to each founder's
 *      own `cycle_start_date`. A founder who starts on a Wednesday keeps a
 *      cycle that runs Wed→Wed. It has no relationship to the calendar week
 *      or to Monday. It answers "where is this founder in their 30-day
 *      journey?" (initial baseline, an ordinary week, or their 30-day
 *      review).
 *   2. The MONDAY WEEKLY ANCHOR: a real calendar check (`isMonday`, exposed
 *      on `CycleContext` below) used elsewhere in the app to decide whether
 *      today is the recurring Measure + Design + Begin™ day. It is computed
 *      independently and must never be used to redefine the personal cycle.
 *
 * The canonical decision tree for the personal cycle:
 *
 *   Has cycle_start_date?
 *     NO  → mode: "initial_baseline"     (one-time onboarding ritual)
 *     YES → cycleDay = days since cycle_start_date, 1-based, wraps at 30
 *           cycleDay === 30 → mode: "thirty_day_review"
 *           else            → mode: "weekly_measurement"
 *
 * This module is pure — all I/O lives in cycle-actions.ts.
 */

export type CycleMode = "initial_baseline" | "weekly_measurement" | "thirty_day_review"

export interface CycleContext {
  /** Which experience to render during onboarding/measurement. */
  mode: CycleMode
  /** Day within the current 30-day personal cycle (1–30). 1 for initial_baseline. */
  cycleDay: number
  /** Week within the current 30-day cycle (1–4, informational only). 1 for initial_baseline. */
  cycleWeek: number
  /** How many complete 30-day cycles have finished. 0 for initial_baseline. */
  cycleNumber: number
  /** Founder's first name, from user_profiles.name. */
  firstName: string | null
  /** When they completed their first installation, or null. */
  firstInstalledAt: Date | null
  /** True when "today" (server clock) is a calendar Monday. Independent of the personal cycle. */
  isMonday: boolean
}

/**
 * deriveCycleContext — the heart of the personal cycle engine.
 *
 * @param cycleStartDate  user_profiles.cycle_start_date (null = never installed)
 * @param firstName       user_profiles.name (first word only)
 * @param currentCycle    user_profiles.current_cycle (0 or null = never installed)
 */
export function deriveCycleContext(
  cycleStartDate: string | null | undefined,
  firstName: string | null | undefined,
  currentCycle: number | null | undefined,
): CycleContext {
  const first = extractFirstName(firstName)
  const now = new Date()
  const isMonday = now.getDay() === 1

  // No installation yet → one-time initial baseline onboarding.
  if (!cycleStartDate) {
    return {
      mode: "initial_baseline",
      cycleDay: 1,
      cycleWeek: 1,
      cycleNumber: 0,
      firstName: first,
      firstInstalledAt: null,
      isMonday,
    }
  }

  const installedAt = new Date(cycleStartDate)
  const msPerDay = 1000 * 60 * 60 * 24
  const msPerCycle = msPerDay * 30

  const msSince = Math.max(0, now.getTime() - installedAt.getTime())
  const daysSince = Math.floor(msSince / msPerDay)
  const cycleNumber = Math.floor(msSince / msPerCycle) + 1

  // cycleDay is 1-based within the current 30-day window (1–30).
  const cycleDay = (daysSince % 30) + 1
  // cycleWeek is informational only — an approximate week marker, never used
  // to gate anything. Real weekly behavior is driven by `isMonday`.
  const cycleWeek = Math.min(4, Math.floor((cycleDay - 1) / 7) + 1)

  const mode: CycleMode = cycleDay === 30 ? "thirty_day_review" : "weekly_measurement"

  return {
    mode,
    cycleDay,
    cycleWeek,
    cycleNumber,
    firstName: first,
    firstInstalledAt: installedAt,
    isMonday,
  }
}

/** Cherry Blossom's opening welcome, per cycle mode. */
export function getCherryBlossomWelcome(ctx: CycleContext): string {
  const name = ctx.firstName ? `, ${ctx.firstName}` : ""
  switch (ctx.mode) {
    case "initial_baseline":
      return `Welcome${name}. I'm Cherry Blossom™, your Work-Life Balance Executive Guide. Today we'll begin designing your First Work-Life Balance Business Week™ together. First, let's understand how your life and business have been operating over the past 30 days. From there, I'll guide you through every next step.`
    case "thirty_day_review":
      return `${ctx.firstName ?? "You"}'ve completed another 30-Day Work-Life Balance Experience Cycle™. Today we'll step back, measure your transformation, celebrate your progress, and design your Next Work-Life Balance Business Week™.`
    case "weekly_measurement":
    default:
      return `Welcome back${name}. Before we design your Next Work-Life Balance Business Week™, let's take a pulse on the past 7 days.`
  }
}

/** Reflection framing per cycle mode ("Over the past 7 days..." vs 30). */
export function getReflectionFraming(mode: CycleMode): string {
  return mode === "thirty_day_review"
    ? "Over the past 30 days…"
    : "Over the past 7 days…"
}

/** Cherry Blossom's phase-level guidance override for repeat visits. */
export function getWeeklyGuidance(phaseId: string): string | null {
  const overrides: Record<string, string> = {
    "reality-check":
      "Welcome back. You've done this before — let's tell the honest truth about the week that just ended, and carry only what serves us forward.",
    "download-delegate":
      "What's still in your head from last week? Let's empty it out, sort it, and start this week lighter than you ended the last.",
    "design-tomorrow":
      "You already know how this works. Walk each segment and refine your operating rules for the week ahead.",
    "commit-prepare":
      "You've designed another Work-Life Balance Business Week™. Let's review it, then install it — so the week is already designed before it begins.",
  }
  return overrides[phaseId] ?? null
}

/* -------------------------------------------------------------------------- */

function extractFirstName(fullName: string | null | undefined): string | null {
  if (!fullName?.trim()) return null
  return fullName.trim().split(/\s+/)[0]
}
