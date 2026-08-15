/**
 * Entrepreneur Success Assessment™ — Storage Layer (Phase 6.0)
 * ---------------------------------------------------------------------------
 * Client-side storage for ESA results, matching the audit-storage.ts pattern
 * used by the Work-Life Balance Audit™. Future phases replace this with a
 * Supabase server action for authenticated, persisted, historical comparison.
 *
 * Key: "entrepreneurSuccessAssessmentResults"
 */

import type { EsaResults } from "./types"

const STORAGE_KEY = "entrepreneurSuccessAssessmentResults"
const HISTORY_KEY = "entrepreneurSuccessAssessmentHistory"

/** Returns the Monday (start) of the given week as YYYY-MM-DD — matches utils/reality-check-storage.ts's getWeekKey so records line up across Life + Business. */
export function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** One week's ESA snapshot, keyed by the Monday of that week. */
export interface EsaHistoryEntry extends EsaResults {
  weekKey: string
}

/** Reads the full weekly ESA history, newest first. Never throws. */
export function getEsaHistory(): EsaHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as EsaHistoryEntry[]
    return parsed.sort((a, b) => (a.weekKey < b.weekKey ? 1 : -1))
  } catch (error) {
    console.error("[ESA] Error reading history:", error)
    return []
  }
}

/** Upserts this week's ESA snapshot into the history (one entry per week). */
function saveEsaHistoryEntry(results: EsaResults): void {
  try {
    const existing = getEsaHistory()
    const weekKey = getWeekKey()
    const withoutThisWeek = existing.filter((entry) => entry.weekKey !== weekKey)
    const next = [...withoutThisWeek, { ...results, weekKey }]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch (error) {
    console.error("[ESA] Error saving history entry:", error)
  }
}

export function saveEsaResults(results: EsaResults): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
  } catch (error) {
    console.error("[ESA] Error saving results:", error)
  }
  // Also record this week's snapshot in the running history so past weeks'
  // Business Scores™ remain reviewable in the Harmony Blueprint™ calendar.
  saveEsaHistoryEntry(results)
}

export function getEsaResults(): EsaResults | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as EsaResults
  } catch (error) {
    console.error("[ESA] Error reading results:", error)
    return null
  }
}

export function clearEsaResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("[ESA] Error clearing results:", error)
  }
}

/** True if the founder has a completed assessment on this device. */
export function hasCompletedEsa(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}
