/**
 * Harmony Week™ Engine — Types
 * ---------------------------------------------------------------------------
 * Pure TypeScript. No React, no DOM, no Next.js.
 * The single source of truth for every day-of-week theme in the platform.
 */

/** The 7 canonical Harmony Day identifiers. */
export type HarmonyDay =
  | "synchronize"   // Monday
  | "execute"       // Tuesday
  | "optimize"      // Wednesday
  | "finish-strong" // Thursday
  | "time-freedom"  // Friday
  | "recovery"      // Saturday
  | "prepare"       // Sunday

/** The primary action type a day's CTA triggers. */
export type HarmonyDayCta =
  | "design-week"   // Sunday — open week design
  | "focus-mode"    // Mon/Tue — enter deep work
  | "optimize"      // Wednesday
  | "finish"        // Thursday
  | "celebrate"     // Friday
  | "recharge"      // Saturday
  | "preview"       // Sunday — preview the week

/** Full theme descriptor for one day of the Harmony Week™. */
export interface HarmonyDayTheme {
  /** 0 = Sunday … 6 = Saturday (JS convention). */
  dayOfWeek: number
  harmonyDay: HarmonyDay
  /** Full day name, e.g. "Monday". */
  dayName: string
  /** Branded day name, e.g. "Synchronize™". */
  themeName: string
  /** One-sentence tagline for the day. */
  tagline: string
  /** Two-to-three sentence philosophy paragraph for the day. */
  philosophy: string
  /** Cherry Blossom guidance bullets (5–7 items). */
  cherryBlossomGuidance: string[]
  /** Adaptive Workspace priorities for the day (3–5 labels). */
  workspacePriorities: string[]
  /** Primary CTA for the day. */
  primaryCta: {
    label: string
    action: HarmonyDayCta
    href: string
  }
  /** Subtle brand-consistent accent color for the day. */
  accent: {
    /** Hex color, e.g. "#5D9D61". */
    color: string
    /** Human label, e.g. "Harmony Green". */
    label: string
  }
  /** True Monday–Thursday (productive business days). */
  isBusinessDay: boolean
  /** True Friday–Sunday (Time Freedom™ days). */
  isTimeFreedom: boolean
  /** Reflection prompts — Friday only. */
  reflectionPrompts?: string[]
}
