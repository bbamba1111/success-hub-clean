/**
 * Work-Life Balance Time-Leak Check™ — Client Storage Layer
 * ---------------------------------------------------------------------------
 * Supabase-first, mirroring lib/business-bottleneck-audit/bba-storage.ts.
 * Supabase (wlb_time_leak_checks) is the source of truth; a small local draft
 * keeps in-progress answers across a mid-wizard refresh and is cleared on save.
 * A new completed check inserts a new row and flips is_current, preserving
 * history rather than overwriting.
 */

import type { TimeLeakRecord, TimeLeakResponses } from "./types"

const DRAFT_KEY = "wlbTimeLeakDraft"

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

/* ── Draft UX helpers — local only, never the source of truth ───────────── */

export function saveTimeLeakDraft(responses: TimeLeakResponses, otherText: Record<string, string>): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ responses, otherText }))
  } catch (error) {
    console.log("[v0] saveTimeLeakDraft skipped:", (error as Error)?.message)
  }
}

export function getTimeLeakDraft(): { responses: TimeLeakResponses; otherText: Record<string, string> } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearTimeLeakDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // no-op
  }
}

/* ── Persisted record ───────────────────────────────────────────────────── */

export async function saveTimeLeakCheck(
  responses: TimeLeakResponses,
  otherText: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, error: "not-signed-in" }
  }

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    // Prior checks are preserved as history — only the is_current flag moves.
    await supabase.from("wlb_time_leak_checks").update({ is_current: false }).eq("user_id", userId).eq("is_current", true)

    const { data: latest } = await supabase
      .from("wlb_time_leak_checks")
      .select("version")
      .eq("user_id", userId)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle()

    const nextVersion = (latest?.version ?? 0) + 1

    const { error } = await supabase.from("wlb_time_leak_checks").insert({
      user_id: userId,
      version: nextVersion,
      responses,
      primary_driver: responses["primary-driver"] ?? null,
      other_text: otherText,
      is_current: true,
      completed_at: new Date().toISOString(),
    })

    if (error) {
      console.log("[v0] saveTimeLeakCheck insert error:", error.message)
      return { success: false, error: error.message }
    }

    clearTimeLeakDraft()
    return { success: true }
  } catch (error) {
    console.log("[v0] saveTimeLeakCheck skipped:", (error as Error)?.message)
    return { success: false, error: (error as Error)?.message }
  }
}

export async function getCurrentTimeLeakCheck(): Promise<TimeLeakRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
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
    console.log("[v0] getCurrentTimeLeakCheck skipped:", (error as Error)?.message)
    return null
  }
}

export async function hasCompletedTimeLeakCheck(): Promise<boolean> {
  const record = await getCurrentTimeLeakCheck()
  return Boolean(record?.completedAt)
}
