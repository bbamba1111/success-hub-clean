/**
 * Today's Plan™ — plain per-day record (Daily Operating Experience rebuild)
 * ---------------------------------------------------------------------------
 * This is NOT a new planner, task manager, GPS, or recommendation engine.
 * It is a plain local record of what the founder decided during Decide &
 * Design™ so the rest of the day (Movement, Lunch, CEO Workday, Time
 * Freedom, Power Down) can read the same decisions back — Decide once,
 * Populate everywhere, Execute throughout the day.
 *
 * Mirrors the exact shape/pattern of `lib/daily-identity/types.ts`.
 */

export type CeoActivityStatus = "not-started" | "in-progress" | "complete" | "blocked" | "waiting"

/** One CEO Workday™ activity the founder decided to do today, capped at 240 minutes total. */
export interface CeoActivity {
  id: string
  title: string
  minutes: number
  /** The Build Path™ chosen for this activity, if the founder linked it to a Build Blueprint™. */
  buildPathId?: import("@/lib/build-strategy/types").BuildPathId
  /** The Readiness Capability™ this activity is tied to, if any — enables a read-only Build Record™ status link. */
  readinessCapabilityId?: string
  definitionOfDone: string
  status: CeoActivityStatus
}

export type LunchCategory = "nourish" | "connect" | "move" | "reset" | "disconnect"

/** One chosen Healthy Hybrid Lunch™ component. */
export interface LunchSelection {
  category: LunchCategory
  label: string
}

/** One Time Freedom™ allocation — "what will you make time for more of," capped at 300 minutes (Mon–Wed). */
export interface TimeFreedomAllocation {
  id: string
  category: string
  label: string
  minutes: number
}

/** The founder's Power Down™ reflection — reassurance, not planning. */
export interface PowerDownNotes {
  release: string
  tomorrowNote: string
  windDownActivity: string
}

/**
 * One CEO Workday™ hourly check-in — a lightweight prompt, never a new
 * engine. Unlocks at its own fixed hour (see `ceo-workday-checkins.tsx`).
 */
export interface WorkdayCheckIn {
  hour: "1:55" | "2:55" | "3:55" | "4:55"
  answeredAt: string
  response: string
}

/**
 * The founder's end-of-day proof of work for the 4-Hour CEO Workday™.
 * `outcomeType` mirrors `WorkdayOutcomeType` from `workday-outcome.ts`
 * (kept as a plain string here to avoid a circular import).
 */
export interface WorkdayProof {
  outcomeType: string
  whatChanged: string
  assetCreated?: string
  capabilityBuilt?: string
  delegated?: string
  operatingRuleCreated?: string
  nextStep?: string
  recordedAt: string
}

/** The single source of truth for today's decisions, read by every downstream segment. */
export interface TodaysPlanRecord {
  dateKey: string
  movement: { label: string; note?: string } | null
  lunch: LunchSelection[]
  ceoActivities: CeoActivity[]
  timeFreedom: TimeFreedomAllocation[]
  powerDown: PowerDownNotes
  /** Additive — hourly CEO Workday™ check-ins recorded today. */
  ceoWorkdayCheckIns: WorkdayCheckIn[]
  /** Additive — the founder's end-of-day proof of work, once recorded. */
  ceoWorkdayProof: WorkdayProof | null
  updatedAt: string
}

/** Hard cap on the 4-Hour Focused CEO Workday™ — a warning, never a block. */
export const CEO_WORKDAY_CAP_MINUTES = 240

/** Hard cap on Time Freedom™ (Mon–Wed target) — a warning, never a block. */
export const TIME_FREEDOM_CAP_MINUTES = 300
