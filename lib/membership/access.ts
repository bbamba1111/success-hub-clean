/**
 * Membership access logic — the EXPERIENCE / authorization boundary for the
 * weekly operating rhythm. Pure functions only (no I/O) so it is trivially
 * testable and safe to run on both server and client.
 *
 * Design principle (per product direction):
 *   • Tuesday–Thursday are never *hidden* from Monday Installation members —
 *     they are "inspirationally locked": visible previews with an upgrade path.
 *   • Time Freedom™ (Friday, Saturday) and Sunday Design Day™ are ALWAYS open
 *     to everyone. Time Freedom is part of the philosophy, not a paid feature.
 */

/** 0 = Sunday … 6 = Saturday (matches JS Date.getDay()). */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Coarse access level resolved from member_memberships.access_level. */
export type AccessLevel = "monday" | "business_week"

/** What kind of day this is within the weekly operating rhythm. */
export type DayType = "sunday_design" | "business" | "time_freedom"

export interface DayDefinition {
  index: DayIndex
  key: string
  /** Short weekday label, e.g. "Tuesday". */
  weekday: string
  /** The experience name shown in the hero. */
  title: string
  /** Supporting tagline beneath the title. */
  tagline: string
  /** One-line description of the day's purpose (used in locked previews too). */
  description: string
  dayType: DayType
}

/**
 * The seven days of the Work-Life Balance Business Week™. Copy is intentionally
 * transformation-focused so locked previews read as aspiration, never a paywall.
 */
export const WEEK: Record<DayIndex, DayDefinition> = {
  0: {
    index: 0,
    key: "sunday",
    weekday: "Sunday",
    title: "Sunday Design Day™",
    tagline: "Design the week before the week designs you.™",
    description:
      "Reflect, reset, and set your weekly intention with a guided Reality Check, Human Intention, and Business Focus.",
    dayType: "sunday_design",
  },
  1: {
    index: 1,
    key: "monday",
    weekday: "Monday",
    title: "Make Time For More On Mondays™",
    tagline: "Install your week with intention.™",
    description:
      "Begin your Work-Life Balance Business Week™ by installing focus, priorities, and momentum for the days ahead.",
    dayType: "business",
  },
  2: {
    index: 2,
    key: "tuesday",
    weekday: "Tuesday",
    title: "Continue Your Work-Life Balance Business Week™",
    tagline: "Build Momentum Through Intentional Execution.™",
    description:
      "Maintain consistency, protect focus, and continue building sustainable momentum throughout the week.",
    dayType: "business",
  },
  3: {
    index: 3,
    key: "wednesday",
    weekday: "Wednesday",
    title: "Protect Your Momentum™",
    tagline: "Protect Your Focus. Create Meaningful Progress.™",
    description: "Guard your energy and attention so the week's most important work keeps moving forward.",
    dayType: "business",
  },
  4: {
    index: 4,
    key: "thursday",
    weekday: "Thursday",
    title: "Finish Strong™",
    tagline: "Complete Your Workweek. Prepare for Three Days of Time Freedom.™",
    description: "Close the loops that matter and set yourself up to step away with a clear mind.",
    dayType: "business",
  },
  5: {
    index: 5,
    key: "friday",
    weekday: "Friday",
    title: "Time Freedom™",
    tagline: "You've earned your time back.™",
    description: "Business workspaces rest today. Enjoy the freedom your intentional week created.",
    dayType: "time_freedom",
  },
  6: {
    index: 6,
    key: "saturday",
    weekday: "Saturday",
    title: "Time Freedom™",
    tagline: "Rest is part of the rhythm.™",
    description: "Business workspaces rest today. Recharge, reconnect, and enjoy life outside the business.",
    dayType: "time_freedom",
  },
}

/** Ordered week starting on Sunday, for progress indicators and navigation. */
export const WEEK_ORDER: DayIndex[] = [0, 1, 2, 3, 4, 5, 6]

/** Business days that Monday Installation members must upgrade to reach. */
const MONDAY_LOCKED_DAYS: DayIndex[] = [2, 3, 4]

export interface DayAccess {
  day: DayDefinition
  /** True if the member can enter the interactive workspaces for this day. */
  unlocked: boolean
  /**
   * True only when the day is a *business* day that is locked for this member.
   * Time Freedom and Sunday are never "locked" — they are simply open or
   * resting, so this stays false for them.
   */
  locked: boolean
  /** True when business workspaces intentionally rest (Time Freedom days). */
  resting: boolean
}

/**
 * Resolves whether a given day is unlocked for a member's access level.
 *
 * Rules:
 *   • business_week → every business day unlocked.
 *   • monday        → Monday unlocked; Tuesday–Thursday inspirationally locked.
 *   • Sunday Design Day™ → always open to everyone.
 *   • Time Freedom™ (Fri/Sat) → always open (resting) to everyone.
 */
export function resolveDayAccess(accessLevel: AccessLevel, day: DayIndex): DayAccess {
  const def = WEEK[day]

  if (def.dayType === "sunday_design") {
    return { day: def, unlocked: true, locked: false, resting: false }
  }

  if (def.dayType === "time_freedom") {
    return { day: def, unlocked: true, locked: false, resting: true }
  }

  // Business day
  if (accessLevel === "business_week") {
    return { day: def, unlocked: true, locked: false, resting: false }
  }

  // Monday Installation member
  const locked = MONDAY_LOCKED_DAYS.includes(day)
  return { day: def, unlocked: !locked, locked, resting: false }
}

/** Convenience: is the member allowed into TODAY's interactive workspaces? */
export function canAccessToday(accessLevel: AccessLevel, now = new Date()): boolean {
  return resolveDayAccess(accessLevel, now.getDay() as DayIndex).unlocked
}

export interface WeekProgressStep {
  weekday: string
  title: string
  /** "open" (accessible), "locked" (upgrade to reach), or "freedom" (rest day). */
  state: "open" | "locked" | "freedom"
  /** True if this step is the current day. */
  isToday: boolean
}

/**
 * Builds the "Your Current Experience" progress indicator shown atop locked
 * days. It reinforces that the member is already making progress and shows how
 * Monday Installation fits inside the full Work-Life Balance Business Week™.
 */
export function buildWeekProgress(accessLevel: AccessLevel, now = new Date()): WeekProgressStep[] {
  const today = now.getDay() as DayIndex
  return WEEK_ORDER.map((day) => {
    const access = resolveDayAccess(accessLevel, day)
    const state: WeekProgressStep["state"] = access.resting
      ? "freedom"
      : access.locked
        ? "locked"
        : "open"
    return {
      weekday: WEEK[day].weekday,
      title: WEEK[day].title,
      state,
      isToday: day === today,
    }
  })
}

/** The interactive workspaces revealed on unlocked business days (blurred when locked). */
export const BUSINESS_WORKSPACES = [
  "Executive Briefing",
  "AI Augmentation Hour™",
  "Human Zone of Genius™",
  "AI Executive Leadership Team™",
  "Execution Center™",
] as const
