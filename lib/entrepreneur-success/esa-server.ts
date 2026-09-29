"use server"

/**
 * Entrepreneur Success Assessment™ — Server Read Layer (EGA Foundation Phase 1)
 * ---------------------------------------------------------------------------
 * Server-safe counterpart to esa-storage.ts's localStorage-backed reads,
 * mirroring the pattern in utils/reality-check-server.ts. Reads from the
 * `esa_assessments` table mirrored by esa-storage.ts's saveEsaResults.
 *
 * This is new, additive infrastructure for future phases (EGA trigger
 * detection, Founder Intelligence, GPS). It is NOT wired into any existing
 * consumer yet — none of the 17 current esa-storage.ts callers are touched.
 */

import { createClient } from "@/lib/supabase/server"
import type { EsaResults, PillarScore, PracticeScore } from "./types"

/** Returns the Monday (start) of the given week as YYYY-MM-DD. Mirrors esa-storage.ts's getWeekKey. */
function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export interface EsaAssessmentRecord {
  week_key: string
  overall_score: number | null
  pillar_scores: PillarScore[] | null
  practice_scores: PracticeScore[] | null
  responses: Record<string, number> | null
  scored_at: string | null
  completed_at: string
}

/** True if THIS week's ESA has already been scored for this user (server-safe). */
export async function hasCompletedThisWeeksEsaServer(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("esa_assessments")
      .select("scored_at, overall_score")
      .eq("user_id", userId)
      .eq("week_key", getWeekKey())
      .maybeSingle()

    return Boolean(data && (data.scored_at || data.overall_score !== null))
  } catch (error) {
    console.log("[v0] hasCompletedThisWeeksEsaServer skipped:", (error as Error)?.message)
    return false
  }
}

/** Loads the most recent ESA record for this user (server-safe), or null. */
export async function getLatestEsaResultServer(userId: string): Promise<EsaAssessmentRecord | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("esa_assessments")
      .select("week_key, overall_score, pillar_scores, practice_scores, responses, scored_at, completed_at")
      .eq("user_id", userId)
      .order("week_key", { ascending: false })
      .limit(1)
      .maybeSingle()

    return (data as EsaAssessmentRecord) ?? null
  } catch (error) {
    console.log("[v0] getLatestEsaResultServer skipped:", (error as Error)?.message)
    return null
  }
}

/** Converts a stored EsaAssessmentRecord back into the EsaResults shape used by scoring.ts helpers. */
export function toEsaResults(record: EsaAssessmentRecord): EsaResults {
  return {
    overallScore: record.overall_score ?? 0,
    pillarScores: record.pillar_scores ?? [],
    practiceScores: record.practice_scores ?? [],
    responses: record.responses ?? {},
    completedAt: record.completed_at,
  }
}
