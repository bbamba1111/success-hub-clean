/**
 * Progress Intelligence™ — Data Model (Phase 8.1 / Part 7)
 * ---------------------------------------------------------------------------
 * Prepares the data model to track founder progress across Life and Business
 * dimensions. This data will power future Founder GPS™, Cherry Blossom™, and
 * executive reporting.
 *
 * SESSION-ONLY this phase. Supabase persistence arrives in a future phase.
 * Cross-device sync, 28-day trends, and GPS pattern adaptation are deferred.
 *
 * Life metrics tracked:
 *   - Daily Non-Negotiables™ completed
 *   - Morning GIV•EN™ consistency
 *   - Workout consistency
 *   - Time Freedom™ protected
 *   - Sleep consistency
 *
 * Business metrics tracked:
 *   - Executive Outcomes™ completed
 *   - Business Operating Rules™ installed
 *   - SOPs created
 *   - Business Assets™ built
 *   - AI automations added
 *   - Delegation completed
 *
 * Architecture guarantee: every field has a meaningful default. The GPS
 * reads this gracefully even when all values are null or zero.
 */

/* ===========================================================================
 * Types
 * ======================================================================== */

/** A single day's Life Progress™ snapshot. */
export interface LifeProgressEntry {
  /** ISO date key (YYYY-MM-DD). */
  date: string
  /** Whether the Daily Non-Negotiable™ was honored (by segment id). */
  nonNegotiablesHonored: Record<string, "yes" | "partial" | "not-yet">
  /** Whether Morning GIV•EN™ was completed. */
  morningGivenCompleted: boolean
  /** Whether the Workout Window™ was honored. */
  workoutCompleted: boolean
  /** Whether Time Freedom™ was protected — no work after 5 PM. */
  timeFreedomProtected: boolean | null
  /** Subjective sleep quality — architecture hook for future. */
  sleepQuality: "great" | "good" | "poor" | null
}

/** A single day's Business Progress™ snapshot. */
export interface BusinessProgressEntry {
  /** ISO date key (YYYY-MM-DD). */
  date: string
  /** Whether the Executive Outcome™ was completed / progressed. */
  executiveOutcomeStatus: "completed" | "progress" | "blocked" | null
  /** The Executive Outcome™ title — free text. */
  executiveOutcomeTitle: string | null
  /**
   * Business Operating Rules™ installed this session
   * (count — exact content tracked via operating-rules storage).
   */
  operatingRulesInstalled: number
  /** SOPs created this session. */
  sopsCreated: number
  /** Business Assets™ identified this session. */
  assetsIdentified: string[] // asset ids or free-text names
  /** AI automation steps added this session. */
  aiAutomationsAdded: number
  /** Delegation decisions made this session. */
  delegationCompleted: number
}

/** The full Progress Intelligence™ store shape. */
export interface ProgressIntelligenceStore {
  /** Life Progress™ entries keyed by ISO date. */
  life: Record<string, LifeProgressEntry>
  /** Business Progress™ entries keyed by ISO date. */
  business: Record<string, BusinessProgressEntry>
  /** ISO timestamp of last write — used for stale detection. */
  lastUpdated: string | null
}

/* ===========================================================================
 * Derived metrics (computed from the store, never stored)
 * ======================================================================== */

/** Computed summary for the GPS to reason over — architecture hook. */
export interface ProgressSummary {
  /**
   * Consecutive days with at least one Non-Negotiable™ honored.
   * The GPS celebrates this streak and adjusts recommendations when it breaks.
   */
  nonNegotiableStreak: number
  /**
   * Consecutive days with a Workout Window™ honored.
   */
  workoutStreak: number
  /**
   * Number of Executive Outcomes™ completed in the current rolling 7 days.
   */
  executiveOutcomesCompletedThisWeek: number
  /**
   * Total Business Assets™ identified across all tracked sessions.
   */
  totalAssetsIdentified: number
  /**
   * Total SOPs created across all tracked sessions.
   */
  totalSopsCreated: number
  /**
   * The last recorded Executive Outcome™ title (for GPS context).
   */
  lastExecutiveOutcome: string | null
  /**
   * Whether today's life progress has been entered.
   */
  todayLifeEntryExists: boolean
  /**
   * Whether today's business progress has been entered.
   */
  todayBusinessEntryExists: boolean
}

/* ===========================================================================
 * Storage
 * ======================================================================== */

const STORAGE_KEY = "harmony:progress-intelligence:v1"

function todayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

function readStore(): ProgressIntelligenceStore {
  if (typeof window === "undefined") return emptyStore()
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressIntelligenceStore) : emptyStore()
  } catch {
    return emptyStore()
  }
}

function writeStore(store: ProgressIntelligenceStore): void {
  if (typeof window === "undefined") return
  try {
    store.lastUpdated = new Date().toISOString()
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* session storage may be unavailable — best effort */
  }
}

function emptyStore(): ProgressIntelligenceStore {
  return { life: {}, business: {}, lastUpdated: null }
}

/* ===========================================================================
 * Public API
 * ======================================================================== */

/** Read the full store (session-only). */
export function getProgressStore(): ProgressIntelligenceStore {
  return readStore()
}

/** Update today's Life Progress™ entry. Merges with any existing data. */
export function updateLifeProgress(
  updates: Partial<Omit<LifeProgressEntry, "date">>
): void {
  const store = readStore()
  const key = todayKey()
  const existing = store.life[key] ?? emptyLifeEntry(key)
  store.life[key] = { ...existing, ...updates, date: key }
  writeStore(store)
}

/** Update today's Business Progress™ entry. Merges with any existing data. */
export function updateBusinessProgress(
  updates: Partial<Omit<BusinessProgressEntry, "date">>
): void {
  const store = readStore()
  const key = todayKey()
  const existing = store.business[key] ?? emptyBusinessEntry(key)
  store.business[key] = { ...existing, ...updates, date: key }
  writeStore(store)
}

/** Derive a computed ProgressSummary™ from the stored data. */
export function deriveProgressSummary(): ProgressSummary {
  const store = readStore()
  const key = todayKey()

  // Non-Negotiable streak — consecutive days with any "yes" response
  let nonNegotiableStreak = 0
  let workoutStreak = 0
  let executiveOutcomesCompletedThisWeek = 0
  let totalAssetsIdentified = 0
  let totalSopsCreated = 0
  let lastExecutiveOutcome: string | null = null

  // Walk backwards through available life entries
  const lifeKeys = Object.keys(store.life).sort().reverse()
  let consecutiveLife = true
  let consecutiveWorkout = true
  for (const k of lifeKeys) {
    const entry = store.life[k]
    const hasHonored = Object.values(entry.nonNegotiablesHonored).some((v) => v === "yes" || v === "partial")
    if (consecutiveLife && hasHonored) {
      nonNegotiableStreak++
    } else {
      consecutiveLife = false
    }
    if (consecutiveWorkout && entry.workoutCompleted) {
      workoutStreak++
    } else {
      consecutiveWorkout = false
    }
    if (!consecutiveLife && !consecutiveWorkout) break
  }

  // Business entries — last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const businessKeys = Object.keys(store.business).sort().reverse()
  for (const k of businessKeys) {
    const entry = store.business[k]
    const entryDate = new Date(k)
    if (entryDate >= sevenDaysAgo && entry.executiveOutcomeStatus === "completed") {
      executiveOutcomesCompletedThisWeek++
    }
    totalAssetsIdentified += (entry.assetsIdentified ?? []).length
    totalSopsCreated += entry.sopsCreated ?? 0
    if (!lastExecutiveOutcome && entry.executiveOutcomeTitle) {
      lastExecutiveOutcome = entry.executiveOutcomeTitle
    }
  }

  return {
    nonNegotiableStreak,
    workoutStreak,
    executiveOutcomesCompletedThisWeek,
    totalAssetsIdentified,
    totalSopsCreated,
    lastExecutiveOutcome,
    todayLifeEntryExists: key in store.life,
    todayBusinessEntryExists: key in store.business,
  }
}

/* ===========================================================================
 * Empty entry factories
 * ======================================================================== */

function emptyLifeEntry(date: string): LifeProgressEntry {
  return {
    date,
    nonNegotiablesHonored: {},
    morningGivenCompleted: false,
    workoutCompleted: false,
    timeFreedomProtected: null,
    sleepQuality: null,
  }
}

function emptyBusinessEntry(date: string): BusinessProgressEntry {
  return {
    date,
    executiveOutcomeStatus: null,
    executiveOutcomeTitle: null,
    operatingRulesInstalled: 0,
    sopsCreated: 0,
    assetsIdentified: [],
    aiAutomationsAdded: 0,
    delegationCompleted: 0,
  }
}
