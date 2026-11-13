"use server"

/**
 * Server-safe counterpart to utils/reality-check-storage.ts's
 * `hasCompletedThisWeeksRealityCheck`. That function uses the browser
 * Supabase client and is meant for Client Components; this one uses the
 * cookie-based server client so Server Components (e.g. app/audit/page.tsx)
 * can check the weekly lock during render without a client round-trip.
 */

import { createClient } from "@/lib/supabase/server"

/** Returns the Monday (start) of the given week as YYYY-MM-DD. Mirrors utils/reality-check-storage.ts's getWeekKey. */
function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** True if THIS week's Reality Check has already been scored for this user. */
export async function hasCompletedThisWeeksRealityCheckServer(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("reality_checks")
      .select("scored_at, overall_score")
      .eq("user_id", userId)
      .eq("week_key", getWeekKey())
      .maybeSingle()

    return Boolean(data && (data.scored_at || data.overall_score !== null))
  } catch (error) {
    console.log("[v0] hasCompletedThisWeeksRealityCheckServer skipped:", (error as Error)?.message)
    return false
  }
}

/**
 * The first completed 30-day Reality Check is the one-time baseline.
 * Once it exists, /audit must automatically switch to the recurring 7-day audit,
 * regardless of whether the founder has installed their personal cycle dates yet.
 */
export async function hasCompletedInitialBaselineServer(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("boundary_reports")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "completed")
      .eq("assessment_type", "full_30_day")
      .eq("is_initial_baseline", true)
      .limit(1)
      .maybeSingle()

    return Boolean(data)
  } catch (error) {
    console.error("[v0] hasCompletedInitialBaselineServer failed:", (error as Error)?.message)
    return false
  }
}

