/**
 * Sunday Cycle Engine™ — Phase 6.1
 * ---------------------------------------------------------------------------
 * Pure, side-effect-free logic that determines which Sunday experience to show
 * each founder, based entirely on their personal installation cycle stored in
 * Supabase. No calendar dependency. No global program schedule.
 *
 * The canonical decision tree:
 *
 *   Has cycle_start_date?
 *     NO  → mode: "first-sunday"   (one-time onboarding ritual)
 *     YES → weeksSince = floor(daysSince / 7)
 *           cycleWeek = (weeksSince % 4) + 1
 *           cycleWeek === 4 → mode: "review-28"
 *           else            → mode: "weekly"
 *
 * This module is pure — all I/O lives in cycle-actions.ts.
 */

export type CycleMode = "first-sunday" | "weekly" | "review-28"

export interface CycleContext {
  /** Which experience to render at /begin. */
  mode: CycleMode
  /** Week within the current 28-day cycle (1–4). 1 for first-sunday. */
  cycleWeek: number
  /** How many complete 28-day cycles have finished. 0 for first-sunday. */
  cycleNumber: number
  /** Founder's first name, from user_profiles.name. */
  firstName: string | null
  /** When they completed their first Sunday Design Day™, or null. */
  firstInstalledAt: Date | null
}

/**
 * deriveCycleContext — the heart of the cycle engine.
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

  // No installation yet → First Sunday™ onboarding.
  if (!cycleStartDate) {
    return {
      mode: "first-sunday",
      cycleWeek: 1,
      cycleNumber: 0,
      firstName: first,
      firstInstalledAt: null,
    }
  }

  const installedAt = new Date(cycleStartDate)
  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const msPerWeek = msPerDay * 7
  const msPerCycle = msPerDay * 28

  const msSince = Math.max(0, now.getTime() - installedAt.getTime())
  const weeksSince = Math.floor(msSince / msPerWeek)
  const cycleNumber = Math.floor(msSince / msPerCycle) + 1

  // cycleWeek is 1-based within the current 28-day window.
  const cycleWeek = (weeksSince % 4) + 1

  const mode: CycleMode = cycleWeek === 4 ? "review-28" : "weekly"

  return {
    mode,
    cycleWeek,
    cycleNumber,
    firstName: first,
    firstInstalledAt: installedAt,
  }
}

/** Cherry Blossom's opening welcome, per cycle mode. */
export function getCherryBlossomWelcome(ctx: CycleContext): string {
  const name = ctx.firstName ? `, ${ctx.firstName}` : ""
  switch (ctx.mode) {
    case "first-sunday":
      return `Welcome${name}. I'm Cherry Blossom™, your Work-Life Balance Executive Guide. Today we'll begin designing your First Work-Life Balance Business Week™ together. First, let's understand how your life and business have been operating over the past 30 days. From there, I'll guide you through every next step.`
    case "review-28":
      return `${ctx.firstName ?? "You"}'ve completed another 28-day cycle. Today we'll step back, measure your transformation, celebrate your progress, and design your Next Work-Life Balance Business Week™.`
    case "weekly":
    default:
      return `Welcome back${name}. Before we design your Next Work-Life Balance Business Week™, let's take a pulse on the past 7 days.`
  }
}

/** Reflection framing per cycle mode ("Over the past 7 days..." vs 28). */
export function getReflectionFraming(mode: CycleMode): string {
  return mode === "review-28"
    ? "Over the past 28 days…"
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
