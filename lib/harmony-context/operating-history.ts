/**
 * Operating History™ — bounded, aggregated reader (Phase 6.2)
 * ---------------------------------------------------------------------------
 * Reads the founder's real DECIDE→EMBODY→EXECUTE execution history from
 * Supabase `segment_completions` and reduces it to a small derived summary
 * (counts + streak) — never raw rows. Mirrors the exact
 * auth-gated/best-effort/RLS pattern used by `utils/reality-check-storage.ts`:
 * anonymous sessions and any query failure resolve to a safe empty summary,
 * never a thrown error.
 *
 * This is the seam `docs/work-life-operating-engine-architecture-report.md`
 * identified as the single highest-leverage, lowest-risk connection: the
 * founder's real persisted execution history is not read by anything today.
 */

import { createClient } from "@/lib/supabase/client"
import type { OperatingHistorySummary } from "./engine"

/** Bounded window — recent completions only, never the full history. */
const HISTORY_WINDOW = 60

interface CompletionRow {
  completion_status: "honored" | "modified" | "not-completed" | string
  segment_date: string
  created_at: string
}

/**
 * Resolves the current signed-in user id, or null if anonymous.
 * Never throws — callers treat null as "skip persistence".
 */
async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

const EMPTY_SUMMARY: OperatingHistorySummary = {
  hasHistory: false,
  totalCompletions: 0,
  honoredCount: 0,
  modifiedCount: 0,
  notCompletedCount: 0,
  currentStreak: 0,
  lastCompletedAt: null,
}

/**
 * Loads a bounded, aggregated summary of the founder's real Operating
 * Segment™ completion history. Client-side, auth-gated, best-effort — safe
 * to call from any client component. Returns `EMPTY_SUMMARY` for anonymous
 * sessions or on any query failure.
 */
export async function getOperatingHistorySummary(): Promise<OperatingHistorySummary> {
  const userId = await getUserId()
  if (!userId) return EMPTY_SUMMARY

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("segment_completions")
      .select("completion_status, segment_date, created_at")
      .eq("user_id", userId)
      .order("segment_date", { ascending: false })
      .limit(HISTORY_WINDOW)

    const rows = (data as CompletionRow[]) ?? []
    if (rows.length === 0) return EMPTY_SUMMARY

    let honoredCount = 0
    let modifiedCount = 0
    let notCompletedCount = 0
    for (const row of rows) {
      if (row.completion_status === "honored") honoredCount += 1
      else if (row.completion_status === "modified") modifiedCount += 1
      else if (row.completion_status === "not-completed") notCompletedCount += 1
    }

    // Streak: consecutive distinct days (most recent first) where every
    // completion recorded that day was honored. Breaks on the first day
    // that has any non-honored completion or is missing entirely.
    const byDate = new Map<string, CompletionRow[]>()
    for (const row of rows) {
      const list = byDate.get(row.segment_date) ?? []
      list.push(row)
      byDate.set(row.segment_date, list)
    }
    const sortedDates = Array.from(byDate.keys()).sort((a, b) => (a < b ? 1 : -1))

    let currentStreak = 0
    for (const date of sortedDates) {
      const dayRows = byDate.get(date) ?? []
      const allHonored = dayRows.every((r) => r.completion_status === "honored")
      if (!allHonored) break
      currentStreak += 1
    }

    return {
      hasHistory: true,
      totalCompletions: rows.length,
      honoredCount,
      modifiedCount,
      notCompletedCount,
      currentStreak,
      lastCompletedAt: rows[0]?.created_at ?? null,
    }
  } catch (error) {
    console.log("[v0] getOperatingHistorySummary skipped:", (error as Error)?.message)
    return EMPTY_SUMMARY
  }
}
