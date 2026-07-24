/**
 * Assessment Cadence Engine™ — Phase 7.3
 * ---------------------------------------------------------------------------
 * Determines which assessment window to present to each founder based solely
 * on their personal cycle state. No manual switching. No user settings.
 *
 * Cadence table:
 *   First Login (no cycle_start_date)   → baseline_30_day  (30 days)
 *   Any week of any cycle               → monthly_30_day   (30 days)
 *
 * The Work-Life Balance Audit™ is always a 30-day look-back. It is taken
 * once on joining (baseline) and then once every 30 days thereafter as long
 * as the founder remains a paid member.
 *
 * Assessment types persist as metadata with every submission so Founder
 * GPS™, Cherry Blossom™, trend analysis, and future analytics can read them.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AssessmentType = "baseline_30_day" | "monthly_30_day"
export type AssessmentWindow = "30-day"

export interface AssessmentCadence {
  /** The persisted metadata label stored with every submission. */
  type: AssessmentType
  /** The window string passed to the audit component for question phrasing. */
  window: AssessmentWindow
  /** Human-readable label shown to the founder if needed. */
  label: string
  /** The phrase prepended to every assessment question. */
  timePhrase: string
}

export interface SavedAssessmentMeta {
  assessmentType: AssessmentType
  assessmentWindow: AssessmentWindow
  submittedAt: number
}

// ---------------------------------------------------------------------------
// Engine — pure, no side effects
// ---------------------------------------------------------------------------

/**
 * Derives the correct assessment cadence from the founder's cycle context.
 * Accepts the same inputs as `deriveCycleContext` so no extra DB call needed.
 *
 * @param cycleStartDate  user_profiles.cycle_start_date (null = never installed)
 * @param cycleWeek       1-based week within the current 28-day cycle (1–4)
 */
export function deriveAssessmentCadence(
  cycleStartDate: string | null | undefined,
  cycleWeek: number = 1,
): AssessmentCadence {
  // First-time founder — no installation yet. Always full baseline.
  if (!cycleStartDate) {
    return CADENCES.baseline_30_day
  }

  // All cycles: 30-day Work-Life Balance Audit™ once per month.
  return CADENCES.monthly_30_day
}

// ---------------------------------------------------------------------------
// Cadence definitions — single source of truth
// ---------------------------------------------------------------------------

export const CADENCES: Record<AssessmentType, AssessmentCadence> = {
  baseline_30_day: {
    type: "baseline_30_day",
    window: "30-day",
    label: "Work-Life Balance Audit™",
    timePhrase: "Over the past 30 days",
  },
  monthly_30_day: {
    type: "monthly_30_day",
    window: "30-day",
    label: "Work-Life Balance Audit™",
    timePhrase: "Over the past 30 days",
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the time phrase for a given window — used by audit components to
 * prefix every question without importing the full cadence object.
 */
export function getTimePhrase(window: AssessmentWindow): string {
  return "Over the past 30 days"
}

/**
 * Returns the short label for display in results metadata.
 */
export function getAssessmentTypeLabel(type: AssessmentType): string {
  return CADENCES[type]?.label ?? "Assessment"
}

// ---------------------------------------------------------------------------
// localStorage persistence helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "harmony.assessment.lastCadence"

/** Persists the cadence metadata alongside an assessment submission. */
export function saveAssessmentMeta(meta: SavedAssessmentMeta): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta))
  } catch {
    // localStorage unavailable (SSR or private mode) — silently skip
  }
}

/** Reads the most recently persisted assessment cadence metadata. */
export function getLastAssessmentMeta(): SavedAssessmentMeta | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedAssessmentMeta
  } catch {
    return null
  }
}

/** Determines the assessment window for the current session from persisted state. */
export function getStoredAssessmentWindow(): AssessmentWindow {
  return getLastAssessmentMeta()?.assessmentWindow ?? "30-day"
}
