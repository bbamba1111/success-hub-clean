/**
 * Entrepreneur Success Assessment™ — Storage Layer (Phase 6.0 → EGA Foundation Phase 1)
 * ---------------------------------------------------------------------------
 * localStorage remains the source of truth for instant UX, exactly like
 * utils/reality-check-storage.ts's pattern for the Work-Life Balance Audit™.
 * As of Phase 1, every save is also best-effort mirrored to the
 * `esa_assessments` table in Supabase (one row per user per week_key) so
 * results survive across devices and are queryable server-side. Mirroring
 * is fire-and-forget: if the member is signed out or the write fails, the
 * localStorage-backed UX is completely unaffected.
 *
 * Key: "entrepreneurSuccessAssessmentResults"
 */

import type { EsaResults } from "./types"

const STORAGE_KEY = "entrepreneurSuccessAssessmentResults"
const HISTORY_KEY = "entrepreneurSuccessAssessmentHistory"

/**
 * Resolves the current signed-in user id, or null if anonymous. Never
 * throws — callers treat null as "skip persistence". Lazily imports the
 * Supabase client so this module still works in contexts without it.
 */
async function getUserId(): Promise<string | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

/**
 * Best-effort mirror of this week's ESA snapshot into Supabase. Fire-and-
 * forget: never awaited by callers of saveEsaResults, never throws upward.
 */
async function mirrorEsaResultsToDb(results: EsaResults, weekKey: string): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const now = new Date().toISOString()

    await supabase.from("esa_assessments").upsert(
      {
        user_id: userId,
        week_key: weekKey,
        overall_score: results.overallScore,
        pillar_scores: results.pillarScores,
        practice_scores: results.practiceScores,
        responses: results.responses,
        scored_at: results.completedAt,
        completed_at: results.completedAt,
        updated_at: now,
      },
      { onConflict: "user_id,week_key" },
    )
  } catch (error) {
    console.log("[v0] mirrorEsaResultsToDb skipped:", (error as Error)?.message)
  }
}

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
  // Best-effort Supabase mirror — fire-and-forget, never blocks or throws.
  void mirrorEsaResultsToDb(results, getWeekKey())
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
