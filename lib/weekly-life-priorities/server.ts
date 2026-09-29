"use server"

/**
 * Weekly Life Priorities™ — Server Actions (Supabase source of truth).
 *
 * A COLLECTION per (user, week). RLS scopes every read/write. There is no
 * maximum: the founder may keep as many life priorities as they want.
 *
 *   getWeeklyLifePriorities  ← Decide & Design + weekly visibility
 *   setWeeklyLifePriorities  ← replace this week's selection set (from the designer)
 */

import { createClient } from "@/lib/supabase/server"
import type { LifePrioritySelection, WeeklyLifePriority } from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

type Row = {
  id: string
  week_key: string
  option_id: string | null
  label: string
  sort_order: number
  created_at: string
  updated_at: string
}

function fromRow(r: Row): WeeklyLifePriority {
  return {
    id: r.id,
    weekKey: r.week_key,
    optionId: r.option_id,
    label: r.label,
    sortOrder: r.sort_order ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.trim().slice(0, n) || null)

/** All life priorities the founder holds for a given week (ordered). */
export async function getWeeklyLifePriorities(weekKey: string): Promise<WeeklyLifePriority[]> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return []
    const { data } = await supabase
      .from("weekly_life_priorities")
      .select("id, week_key, option_id, label, sort_order, created_at, updated_at")
      .eq("user_id", userId)
      .eq("week_key", weekKey)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
    return (data ?? []).map((r) => fromRow(r as Row))
  } catch {
    return []
  }
}

/**
 * Replace the founder's life-priority set for a week with exactly `selections`.
 * Rows no longer present are removed; new rows are inserted. Existing rows
 * (matched by trimmed label) are kept so timestamps/history survive.
 */
export async function setWeeklyLifePriorities(
  weekKey: string,
  selections: LifePrioritySelection[],
): Promise<{ ok: boolean; priorities?: WeeklyLifePriority[]; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in to save your life priorities." }

    // Normalize + de-dupe by label (case-insensitive), preserving order.
    const seen = new Set<string>()
    const clean: LifePrioritySelection[] = []
    for (const s of selections) {
      const label = (s.label ?? "").trim().slice(0, 200)
      if (!label) continue
      const key = label.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      clean.push({ optionId: clip(s.optionId, 80), label })
    }

    const { data: existingData } = await supabase
      .from("weekly_life_priorities")
      .select("id, label")
      .eq("user_id", userId)
      .eq("week_key", weekKey)
    const existing = (existingData ?? []) as { id: string; label: string }[]
    const existingByLabel = new Map(existing.map((e) => [e.label.trim().toLowerCase(), e.id]))
    const keepLabels = new Set(clean.map((c) => c.label.toLowerCase()))

    // Delete rows that are no longer selected.
    const toDelete = existing.filter((e) => !keepLabels.has(e.label.trim().toLowerCase())).map((e) => e.id)
    if (toDelete.length > 0) {
      await supabase.from("weekly_life_priorities").delete().eq("user_id", userId).in("id", toDelete)
    }

    // Insert rows that don't exist yet, and keep sort order fresh for all.
    const inserts = clean
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => !existingByLabel.has(c.label.toLowerCase()))
      .map(({ c, i }) => ({
        user_id: userId,
        week_key: weekKey,
        option_id: c.optionId,
        label: c.label,
        sort_order: i,
      }))
    if (inserts.length > 0) {
      const { error } = await supabase.from("weekly_life_priorities").insert(inserts)
      if (error) return { ok: false, error: error.message }
    }

    // Refresh sort_order on rows that already existed to match current order.
    for (let i = 0; i < clean.length; i++) {
      const id = existingByLabel.get(clean[i].label.toLowerCase())
      if (id) {
        await supabase
          .from("weekly_life_priorities")
          .update({ sort_order: i, option_id: clean[i].optionId })
          .eq("user_id", userId)
          .eq("id", id)
      }
    }

    const priorities = await getWeeklyLifePriorities(weekKey)
    return { ok: true, priorities }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save your life priorities." }
  }
}
