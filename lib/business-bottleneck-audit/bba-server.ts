"use server"

/**
 * Business Bottleneck Audit™ (BBA™) — Server Read Layer
 * ---------------------------------------------------------------------------
 * Server-safe reads of bba_baseline_assessments / bba_weekly_checkins,
 * mirroring lib/entrepreneur-success/esa-server.ts's pattern. This is the
 * layer GPS's context aggregator calls to pull BBA signals — see
 * lib/founder-gps/context/bba-context-aggregator.ts.
 */

import { createClient } from "@/lib/supabase/server"
import type { BbaBaselineResponses, BbaWeeklyCheckinRecord } from "./types"

/** Returns the Monday (start) of the given week as YYYY-MM-DD. Mirrors bba-storage.ts's getWeekKey. */
function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export interface BbaBaselineRecordServer {
  version: number
  responses: BbaBaselineResponses
  otherText: Record<string, string>
  completedAt: string
}

/** Loads the founder's current BBA baseline (server-safe), or null if none exists yet. */
export async function getCurrentBbaBaselineServer(userId: string): Promise<BbaBaselineRecordServer | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("bba_baseline_assessments")
      .select("version, responses, other_text, completed_at")
      .eq("user_id", userId)
      .eq("is_current", true)
      .maybeSingle()

    if (!data) return null

    return {
      version: data.version,
      responses: (data.responses ?? {}) as BbaBaselineResponses,
      otherText: (data.other_text ?? {}) as Record<string, string>,
      completedAt: data.completed_at,
    }
  } catch (error) {
    console.log("[v0] getCurrentBbaBaselineServer skipped:", (error as Error)?.message)
    return null
  }
}

/** True if the founder has any BBA baseline on file (server-safe). */
export async function hasCompletedBbaBaselineServer(userId: string): Promise<boolean> {
  const record = await getCurrentBbaBaselineServer(userId)
  return record !== null
}

/** Loads this week's BBA weekly check-in (server-safe), or null if not yet completed. */
export async function getThisWeeksBbaCheckinServer(userId: string): Promise<BbaWeeklyCheckinRecord | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("bba_weekly_checkins")
      .select(
        "week_key, life_improvement, business_improvement, bottlenecks_cleared_count, business_assets, assignment_status, assignment_problems, stakeholder_deadlines, completed_at",
      )
      .eq("user_id", userId)
      .eq("week_key", getWeekKey())
      .maybeSingle()

    if (!data) return null

    return {
      weekKey: data.week_key,
      lifeImprovement: data.life_improvement ?? { selectedIds: [] },
      businessImprovement: data.business_improvement ?? { selectedIds: [] },
      bottlenecksClearedCount: data.bottlenecks_cleared_count,
      businessAssets: data.business_assets ?? [],
      assignmentStatus: data.assignment_status,
      assignmentProblems: data.assignment_problems ?? { selectedIds: [] },
      stakeholderDeadlines: data.stakeholder_deadlines ?? [],
      completedAt: data.completed_at,
    }
  } catch (error) {
    console.log("[v0] getThisWeeksBbaCheckinServer skipped:", (error as Error)?.message)
    return null
  }
}

/** Loads the most recent N weekly check-ins (server-safe), newest first — used for GPS trend signals. */
export async function getRecentBbaCheckinsServer(userId: string, limit = 6): Promise<BbaWeeklyCheckinRecord[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("bba_weekly_checkins")
      .select(
        "week_key, life_improvement, business_improvement, bottlenecks_cleared_count, business_assets, assignment_status, assignment_problems, stakeholder_deadlines, completed_at",
      )
      .eq("user_id", userId)
      .order("week_key", { ascending: false })
      .limit(limit)

    return (data ?? []).map((row) => ({
      weekKey: row.week_key,
      lifeImprovement: row.life_improvement ?? { selectedIds: [] },
      businessImprovement: row.business_improvement ?? { selectedIds: [] },
      bottlenecksClearedCount: row.bottlenecks_cleared_count,
      businessAssets: row.business_assets ?? [],
      assignmentStatus: row.assignment_status,
      assignmentProblems: row.assignment_problems ?? { selectedIds: [] },
      stakeholderDeadlines: row.stakeholder_deadlines ?? [],
      completedAt: row.completed_at,
    }))
  } catch (error) {
    console.log("[v0] getRecentBbaCheckinsServer skipped:", (error as Error)?.message)
    return []
  }
}
