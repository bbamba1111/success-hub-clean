/**
 * Founder Operating System™ Installation Engine — Types (Phase 12.0)
 * ---------------------------------------------------------------------------
 * Covers all 6 installation steps. Designed to bridge directly into existing
 * BusinessContextProfile and BusinessStage stores on completion.
 */

// ─── Step 1: Current Reality™ ────────────────────────────────────────────────

export interface CurrentRealityAnswers {
  /** How many hours per week are you currently working? (1=<20h, 5=60h+) */
  weeklyHours: number
  /** How often do you work evenings? (1=Never, 5=Always) */
  eveningFrequency: number
  /** How often do you work weekends? (1=Never, 5=Always) */
  weekendFrequency: number
  /** How "always on" do you feel? (1=Never, 5=Always) */
  alwaysOnFeeling: number
  /** Satisfaction with your current work-life balance (1=Very Unsatisfied, 5=Very Satisfied) */
  workLifeSatisfaction: number
  /** How often do personal priorities get disrupted by work? (1=Never, 5=Always) */
  disruptionFrequency: number
}

// ─── Step 2: Desired Outcomes™ ───────────────────────────────────────────────

export type DesiredOutcomeId =
  | "more-time-family"
  | "sustained-energy"
  | "clear-priorities"
  | "fewer-meetings"
  | "reduce-burnout"
  | "better-focus"
  | "predictable-workdays"
  | "business-supports-life"

// ─── Step 3: Founder Profile™ ────────────────────────────────────────────────

export type CalendarPreference = "google" | "outlook" | "apple" | "notion" | "other"

export interface FounderProfileAnswers {
  /** Maps to BusinessStage — "launch" | "growth" | "scale" | "legacy" */
  founderStage: "launch" | "growth" | "scale" | "legacy"
  /** Maps to TeamSizeOption */
  teamSize: "solo" | "1-3" | "4-10" | "11-25" | "26-50" | "50-plus"
  /** Free-text industry e.g. "Health & Wellness" */
  industry: string
  /** One primary business model */
  businessModel:
    | "service"
    | "digital-products"
    | "physical-products"
    | "saas"
    | "agency"
    | "consulting"
    | "coaching"
    | "membership"
    | "marketplace"
    | "other"
  /** IANA time zone string e.g. "America/New_York" */
  timezone: string
  /** Preferred calendar tool */
  calendarPreference: CalendarPreference
  /** First name for personalization */
  firstName: string
}

// ─── Step 4: Operating Rhythm™ Commitments ───────────────────────────────────

export interface OperatingRhythmCommitments {
  /** Agrees to protect CEO Workdays™ Monday–Thursday */
  protectCeoWorkdays: boolean
  /** Agrees to honor the 20-hour Life Time™ boundary */
  honorLifeTime: boolean
  /** Agrees to use Cherry Blossom™ as their operating guide */
  useCherryBlossomAsGuide: boolean
}

// ─── Master Profile ───────────────────────────────────────────────────────────

export interface InstallationProfile {
  /** ISO timestamp of last save */
  lastSavedAt: string
  /** Step the founder was on when they last autosaved (0-indexed) */
  lastStep: number
  /** true only when all 6 steps have been completed */
  completedAt: string | null

  currentReality: Partial<CurrentRealityAnswers>
  desiredOutcomes: DesiredOutcomeId[]
  founderProfile: Partial<FounderProfileAnswers>
  commitments: Partial<OperatingRhythmCommitments>
}

export const EMPTY_INSTALLATION_PROFILE: InstallationProfile = {
  lastSavedAt: "",
  lastStep: 0,
  completedAt: null,
  currentReality: {},
  desiredOutcomes: [],
  founderProfile: {},
  commitments: {},
}
