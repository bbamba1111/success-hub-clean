"use server"

/**
 * Personal Cycle™ — server actions (Phase 6.2)
 * ---------------------------------------------------------------------------
 * All Supabase I/O for the personal 30-Day Work-Life Balance Experience
 * Cycle™ engine. Kept separate from the pure cycle-engine.ts so the logic
 * remains testable without a DB. The Monday weekly measurement anchor is a
 * separate, calendar-based concept — see cycle-engine.ts's `isMonday`.
 */

import { createClient } from "@/lib/supabase/server"
import { deriveCycleContext, type CycleContext } from "@/lib/sunday-cycle/cycle-engine"

/* ---- Read ---------------------------------------------------------------- */

/**
 * getCycleContext — called from onboarding/measurement Server Components.
 * Reads user_profiles once and returns the complete CycleContext.
 * Returns an "initial_baseline" context on any error (safe default).
 */
export async function getCycleContext(userId: string): Promise<CycleContext> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_profiles")
      .select("name, cycle_start_date, current_cycle")
      .eq("id", userId)
      .single()

    if (error || !data) {
      return deriveCycleContext(null, null, null)
    }

    return deriveCycleContext(data.cycle_start_date, data.name, data.current_cycle)
  } catch {
    return deriveCycleContext(null, null, null)
  }
}

/* ---- Write --------------------------------------------------------------- */

/**
 * installWeekAction — called when the founder clicks "Install My Week™".
 *
 * Initial baseline: sets cycle_start_date = now, cycle_end_date = now + 30
 *                    days, current_cycle = 1.
 * Subsequent weeks: increments current_cycle. Does not touch cycle_start_date
 *                    — the personal 30-day cycle stays anchored to the
 *                    founder's original installation date.
 *
 * Returns { success: true } or { success: false, error: string }.
 */
export async function installWeekAction(
  userId: string,
  isInitialBaseline: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const now = new Date()
    const cycleEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    if (isInitialBaseline) {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          cycle_start_date: now.toISOString(),
          cycle_end_date: cycleEnd.toISOString(),
          current_cycle: 1,
          updated_at: now.toISOString(),
        })
        .eq("id", userId)

      if (error) return { success: false, error: error.message }
    } else {
      // Increment current_cycle via RPC to avoid a read-modify-write race.
      const { error } = await supabase.rpc("increment_current_cycle", { uid: userId })
      if (error) {
        // Fallback: read current value then update (RPC may not exist yet).
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("current_cycle")
          .eq("id", userId)
          .single()

        const next = (profile?.current_cycle ?? 0) + 1
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({ current_cycle: next, updated_at: now.toISOString() })
          .eq("id", userId)

        if (updateError) return { success: false, error: updateError.message }
      }
    }

    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" }
  }
}
