"use server"

/**
 * Work-Life Balance Time-Leak Check™ — Server Read Layer
 * ---------------------------------------------------------------------------
 * Server-safe reads of wlb_time_leak_checks, mirroring bba-server.ts. Used by
 * onboarding progress/gating to confirm the founder has completed the check.
 */

import { createClient } from "@/lib/supabase/server"
import type { TimeLeakRecord, TimeLeakResponses } from "./types"

/** Loads the founder's current Time-Leak Check (server-safe), or null if none. */
export async function getCurrentTimeLeakCheckServer(userId: string): Promise<TimeLeakRecord | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("wlb_time_leak_checks")
      .select("version, responses, primary_driver, other_text, completed_at")
      .eq("user_id", userId)
      .eq("is_current", true)
      .maybeSingle()

    if (!data) return null

    return {
      version: data.version,
      responses: (data.responses ?? {}) as TimeLeakResponses,
      primaryDriver: data.primary_driver ?? null,
      otherText: (data.other_text ?? {}) as Record<string, string>,
      completedAt: data.completed_at,
    }
  } catch (error) {
    console.log("[v0] getCurrentTimeLeakCheckServer skipped:", (error as Error)?.message)
    return null
  }
}

/** True if the founder has completed a Time-Leak Check (server-safe). */
export async function hasCompletedTimeLeakCheckServer(userId: string): Promise<boolean> {
  const record = await getCurrentTimeLeakCheckServer(userId)
  return Boolean(record?.completedAt)
}
