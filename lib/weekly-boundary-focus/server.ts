"use server"

/**
 * Weekly Work-Life Balance Boundary Focus™ — Server Actions (Supabase).
 *
 * EXACTLY ONE record per (user, week), enforced by a unique constraint and an
 * UPSERT on (user_id, week_key). RLS scopes every read/write.
 *
 *   getWeeklyBoundaryFocus  ← Decide & Design + weekly visibility
 *   saveWeeklyBoundaryFocus ← choose / replace the one boundary for the week
 */

import { createClient } from "@/lib/supabase/server"
import { emptyBoundaryFocus, type BoundaryFocusStatus, type WeeklyBoundaryFocus } from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

type Row = {
  id: string
  week_key: string
  boundary_text: string
  option_id: string | null
  source_context: string | null
  status: BoundaryFocusStatus
  created_at: string
  updated_at: string
}

function fromRow(r: Row): WeeklyBoundaryFocus {
  return {
    id: r.id,
    weekKey: r.week_key,
    boundaryText: r.boundary_text,
    optionId: r.option_id,
    sourceContext: r.source_context,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.trim().slice(0, n) || null)

export async function getWeeklyBoundaryFocus(weekKey: string): Promise<WeeklyBoundaryFocus> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return emptyBoundaryFocus(weekKey)
    const { data } = await supabase
      .from("weekly_boundary_focus")
      .select("id, week_key, boundary_text, option_id, source_context, status, created_at, updated_at")
      .eq("user_id", userId)
      .eq("week_key", weekKey)
      .maybeSingle()
    return data ? fromRow(data as Row) : emptyBoundaryFocus(weekKey)
  } catch {
    return emptyBoundaryFocus(weekKey)
  }
}

export async function saveWeeklyBoundaryFocus(
  focus: WeeklyBoundaryFocus,
): Promise<{ ok: boolean; focus?: WeeklyBoundaryFocus; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in to save your boundary." }
    const boundaryText = clip(focus.boundaryText, 300)
    if (!boundaryText) return { ok: false, error: "Choose a boundary first." }
    const { data, error } = await supabase
      .from("weekly_boundary_focus")
      .upsert(
        {
          user_id: userId,
          week_key: focus.weekKey,
          boundary_text: boundaryText,
          option_id: clip(focus.optionId, 80),
          source_context: clip(focus.sourceContext, 800),
          status: focus.status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,week_key" },
      )
      .select("id, week_key, boundary_text, option_id, source_context, status, created_at, updated_at")
      .single()
    if (error) return { ok: false, error: error.message }
    return { ok: true, focus: fromRow(data as Row) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save your boundary." }
  }
}
