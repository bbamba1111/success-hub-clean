/**
 * Recommendation History Store™ — Phase 10.2
 * ---------------------------------------------------------------------------
 * localStorage persistence layer for every GPS recommendation outcome.
 * Powers the Adaptive Learning Loop™ — what worked, what was skipped and why,
 * consecutive completions, and deduplication within a 7-day window.
 *
 * Storage key: harmony:gps-history:v1
 */

import type { GpsOutcomeId } from "@/lib/founder-gps/engine"

/* ===========================================================================
 * Types
 * ======================================================================== */

export type RecommendationOutcome =
  | "accepted"   // founder acknowledged / started the recommendation
  | "deferred"   // postponed to later today / tomorrow
  | "skipped"    // explicitly skipped with a reason
  | "completed"  // fully executed the recommendation

export type SkipReason =
  | "life-happened"
  | "low-energy"
  | "not-enough-time"
  | "not-relevant"
  | "unexpected-opportunity"
  | "need-more-support"
  | "other"

export const SKIP_REASON_LABELS: Record<SkipReason, string> = {
  "life-happened": "Life happened",
  "low-energy": "Low energy",
  "not-enough-time": "Not enough time",
  "not-relevant": "Not relevant to me right now",
  "unexpected-opportunity": "Unexpected opportunity came up",
  "need-more-support": "I need more support with this",
  "other": "Something else",
}

export interface RecommendationHistoryEntry {
  /** Same stable id as GpsRecommendationCard.id — the rule that fired. */
  id: string
  recommendationTitle: string
  segmentId: string
  primaryOutcome: GpsOutcomeId
  /** ISO YYYY-MM-DD */
  date: string
  /** ISO timestamp — for ordering and deduplication. */
  timestamp: string
  outcome: RecommendationOutcome
  /** Populated when outcome === "skipped". */
  skipReason?: SkipReason
  /** Optional founder reflection (free text). */
  reflection?: string
  /** Asset name if a compounding asset was created. */
  businessAssetCreated?: string
}

/* ===========================================================================
 * Storage key + guard
 * ======================================================================== */

const STORAGE_KEY = "harmony:gps-history:v1"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/* ===========================================================================
 * Public API
 * ======================================================================== */

/**
 * Returns the full history array, oldest → newest.
 * Returns [] if nothing stored or on SSR.
 */
export function getRecommendationHistory(): RecommendationHistoryEntry[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Records a new recommendation outcome.
 * Entries for the same recommendation id on the same date are upserted
 * (the latest outcome overwrites) to avoid duplicate rows from rapid taps.
 */
export function recordRecommendationOutcome(
  entry: Omit<RecommendationHistoryEntry, "date" | "timestamp">,
): void {
  if (!isBrowser()) return
  try {
    const history = getRecommendationHistory()
    const today = todayIso()
    const timestamp = new Date().toISOString()
    const full: RecommendationHistoryEntry = { ...entry, date: today, timestamp }

    // Upsert: replace same id + same date if already exists
    const idx = history.findIndex((h) => h.id === entry.id && h.date === today)
    if (idx >= 0) {
      history[idx] = full
    } else {
      history.push(full)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    window.dispatchEvent(new CustomEvent("harmony:gps-history-changed"))
  } catch {
    // Silent fail — history is non-critical
  }
}

/**
 * Returns entries from the last N calendar days (inclusive of today).
 */
export function getRecentRecommendations(days: number): RecommendationHistoryEntry[] {
  const history = getRecommendationHistory()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffIso = cutoff.toISOString().slice(0, 10)
  return history.filter((h) => h.date >= cutoffIso)
}

/**
 * Returns the number of consecutive days with a "completed" outcome.
 * Resets to 0 on the first day without a completion.
 */
export function getConsecutiveCompletions(): number {
  const history = getRecommendationHistory()
  if (history.length === 0) return 0

  // Group by date descending
  const byDate = new Map<string, RecommendationHistoryEntry[]>()
  for (const entry of history) {
    const arr = byDate.get(entry.date) ?? []
    arr.push(entry)
    byDate.set(entry.date, arr)
  }

  const sortedDates = Array.from(byDate.keys()).sort().reverse()
  let streak = 0
  let expectedDate = new Date()

  for (const date of sortedDates) {
    const expectedIso = expectedDate.toISOString().slice(0, 10)
    if (date !== expectedIso) break
    const dayEntries = byDate.get(date) ?? []
    const hasCompletion = dayEntries.some((e) => e.outcome === "completed")
    if (!hasCompletion) break
    streak++
    expectedDate.setDate(expectedDate.getDate() - 1)
  }

  return streak
}

/**
 * Returns the most recently completed recommendation entry, or null.
 */
export function getLastCompletedRecommendation(): RecommendationHistoryEntry | null {
  const history = getRecommendationHistory()
  return (
    [...history].reverse().find((h) => h.outcome === "completed") ?? null
  )
}

/**
 * Returns the most recent skip reason across all skipped entries, or null.
 * Used by the Adaptive Learning Loop™ to adjust next-day recommendations.
 */
export function getLastSkipReason(): SkipReason | null {
  const history = getRecommendationHistory()
  const last = [...history].reverse().find((h) => h.outcome === "skipped" && h.skipReason)
  return last?.skipReason ?? null
}

/**
 * Returns all recommendation ids from the last N days.
 * Used by the engine to avoid repeating the same rule within the window.
 */
export function getRecentRecommendationIds(days = 7): string[] {
  return getRecentRecommendations(days).map((h) => h.id)
}

/**
 * Clears all recommendation history from localStorage.
 */
export function clearRecommendationHistory(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent("harmony:gps-history-changed"))
  } catch {
    // Silent
  }
}
