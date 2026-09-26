"use server"

/**
 * Work-Life Balance Boundary Library™ — Server Actions.
 *
 * The library content itself is static (see ./catalog). The only user data is
 * CUSTOM boundaries, persisted in public.custom_boundaries under RLS. These
 * reuse the same downstream Builder process as the seeded patterns.
 *
 *   listCustomBoundaries   ← founder's custom boundaries
 *   saveCustomBoundary     ← create or update a custom boundary
 *   deleteCustomBoundary   ← remove a custom boundary
 */

import { createClient } from "@/lib/supabase/server"
import type {
  BusinessRequirementId,
  BoundaryFamilyId,
  CustomBoundary,
  CustomBoundaryInput,
  CustomBoundaryStatus,
} from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

type Row = {
  id: string
  week_key: string | null
  boundary_focus: string | null
  boundary_statement: string
  life_priority_id: string | null
  business_requirement_ids: string[] | null
  family_id: string | null
  status: CustomBoundaryStatus
  created_at: string
  updated_at: string
}

function fromRow(r: Row): CustomBoundary {
  return {
    id: r.id,
    weekKey: r.week_key,
    boundaryFocus: r.boundary_focus,
    boundaryStatement: r.boundary_statement,
    lifePriorityId: r.life_priority_id,
    businessRequirementIds: (r.business_requirement_ids ?? []) as BusinessRequirementId[],
    familyId: (r.family_id as BoundaryFamilyId | null) ?? null,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const COLS =
  "id, week_key, boundary_focus, boundary_statement, life_priority_id, business_requirement_ids, family_id, status, created_at, updated_at"

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.trim().slice(0, n) || null)

export async function listCustomBoundaries(weekKey?: string): Promise<CustomBoundary[]> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return []
    let query = supabase.from("custom_boundaries").select(COLS).eq("user_id", userId)
    if (weekKey) query = query.eq("week_key", weekKey)
    const { data } = await query.order("created_at", { ascending: false })
    return (data as Row[] | null)?.map(fromRow) ?? []
  } catch {
    return []
  }
}

export async function saveCustomBoundary(
  input: CustomBoundaryInput & { id?: string },
): Promise<{ ok: boolean; boundary?: CustomBoundary; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in to save your boundary." }
    const boundaryStatement = clip(input.boundaryStatement, 300)
    if (!boundaryStatement) return { ok: false, error: "Write your boundary first." }

    const requirementIds = (input.businessRequirementIds ?? []).slice(0, 20)
    const payload = {
      user_id: userId,
      week_key: clip(input.weekKey, 40),
      boundary_focus: clip(input.boundaryFocus, 300),
      boundary_statement: boundaryStatement,
      life_priority_id: clip(input.lifePriorityId, 80),
      business_requirement_ids: requirementIds,
      family_id: clip(input.familyId, 80),
      status: input.status ?? "draft",
      updated_at: new Date().toISOString(),
    }

    const builder = input.id
      ? supabase.from("custom_boundaries").update(payload).eq("id", input.id).eq("user_id", userId)
      : supabase.from("custom_boundaries").insert(payload)

    const { data, error } = await builder.select(COLS).single()
    if (error) return { ok: false, error: error.message }
    return { ok: true, boundary: fromRow(data as Row) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save your boundary." }
  }
}

export async function deleteCustomBoundary(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in." }
    const { error } = await supabase.from("custom_boundaries").delete().eq("id", id).eq("user_id", userId)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not delete your boundary." }
  }
}
