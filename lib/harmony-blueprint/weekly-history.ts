/**
 * Weekly Harmony History — combines the Life Balance Score™ (Work-Life
 * Balance Audit™, persisted per-week in Supabase's `reality_checks` table)
 * with the Business Score™ (Entrepreneur Success Assessment™, persisted
 * per-week in localStorage) into one merged, per-week record.
 *
 * This is what the Work-Life Harmony Blueprint™'s monthly calendar reads to
 * show every "Week of…" at a glance, and what splits into the Archive once a
 * week rolls outside the current calendar month.
 */

import { getRealityChecksHistory } from "@/utils/reality-check-storage"
import { getEsaHistory } from "@/lib/entrepreneur-success/esa-storage"

export interface WeeklyHarmonyRecord {
  /** Monday (start) of the week, e.g. "2026-08-10". */
  weekKey: string
  lifeScore: number | null
  bizScore: number | null
  /** Average of life + business when both exist; otherwise whichever is present. */
  harmonyScore: number | null
}

function combine(lifeScore: number | null, bizScore: number | null): number | null {
  if (lifeScore !== null && bizScore !== null) return Math.round((lifeScore + bizScore) / 2)
  return lifeScore ?? bizScore ?? null
}

/**
 * Loads every week the member has a Life and/or Business score for, newest
 * first. Life scores come from Supabase (signed-in members only); Business
 * scores come from the local ESA history. A week appears here as soon as
 * either side has data — no need for both to be complete.
 */
export async function getWeeklyHarmonyHistory(): Promise<WeeklyHarmonyRecord[]> {
  const [lifeHistory, bizHistory] = await Promise.all([
    getRealityChecksHistory(),
    Promise.resolve(getEsaHistory()),
  ])

  const byWeek = new Map<string, WeeklyHarmonyRecord>()

  for (const row of lifeHistory) {
    byWeek.set(row.week_key, {
      weekKey: row.week_key,
      lifeScore: row.overall_score ?? null,
      bizScore: null,
      harmonyScore: null,
    })
  }

  for (const entry of bizHistory) {
    const existing = byWeek.get(entry.weekKey)
    if (existing) {
      existing.bizScore = entry.overallScore
    } else {
      byWeek.set(entry.weekKey, {
        weekKey: entry.weekKey,
        lifeScore: null,
        bizScore: entry.overallScore,
        harmonyScore: null,
      })
    }
  }

  const records = Array.from(byWeek.values()).map((r) => ({
    ...r,
    harmonyScore: combine(r.lifeScore, r.bizScore),
  }))

  return records.sort((a, b) => (a.weekKey < b.weekKey ? 1 : -1))
}
