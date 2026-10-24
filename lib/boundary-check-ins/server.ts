"use server"

/**
 * Boundary Check-In™ — Server Actions (Supabase, RLS-scoped).
 *
 * One record per (user, date, segment), enforced by a unique constraint and an
 * UPSERT, so revisiting or refreshing updates today's answer instead of
 * duplicating it. Earlier days are never touched. The Boundary Check-In™,
 * Business Boundary Builder™, and My Boundary Blueprint™ all read from here.
 */

import { createClient } from "@/lib/supabase/server"
import type { CollisionSource, SelectedCollision } from "./collisions"

export interface BoundaryCheckIn {
  id: string
  checkInDate: string
  segmentId: string
  segmentLabel: string | null
  boundaryOptionId: string | null
  boundaryText: string | null
  boundaryWeekKey: string | null
  collided: boolean
  collisions: SelectedCollision[]
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface SaveBoundaryCheckInInput {
  checkInDate: string
  segmentId: string
  segmentLabel?: string | null
  boundaryOptionId?: string | null
  boundaryText?: string | null
  boundaryWeekKey?: string | null
  collided: boolean
  collisions: SelectedCollision[]
  note?: string | null
}

type Row = {
  id: string
  check_in_date: string
  segment_id: string
  segment_label: string | null
  boundary_option_id: string | null
  boundary_text: string | null
  boundary_week_key: string | null
  collided: boolean
  collisions: unknown
  note: string | null
  created_at: string
  updated_at: string
}

const COLUMNS =
  "id, check_in_date, segment_id, segment_label, boundary_option_id, boundary_text, boundary_week_key, collided, collisions, note, created_at, updated_at"

const SOURCES = new Set<CollisionSource>(["business", "personal", "schedule"])

function sanitizeCollisions(value: unknown): SelectedCollision[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const out: SelectedCollision[] = []
  for (const item of value.slice(0, 60)) {
    if (!item || typeof item !== "object") continue
    const { id, label, source } = item as Record<string, unknown>
    if (typeof id !== "string" || typeof label !== "string" || !SOURCES.has(source as CollisionSource)) continue
    const key = `${source}:${id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ id: id.slice(0, 80), label: label.slice(0, 120), source: source as CollisionSource })
  }
  return out
}

function fromRow(r: Row): BoundaryCheckIn {
  return {
    id: r.id,
    checkInDate: r.check_in_date,
    segmentId: r.segment_id,
    segmentLabel: r.segment_label,
    boundaryOptionId: r.boundary_option_id,
    boundaryText: r.boundary_text,
    boundaryWeekKey: r.boundary_week_key,
    collided: r.collided,
    collisions: sanitizeCollisions(r.collisions),
    note: r.note,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.trim().slice(0, n) || null)

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

export async function listBoundaryCheckIns(limit = 200): Promise<BoundaryCheckIn[]> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return []
    const { data } = await supabase
      .from("boundary_check_ins")
      .select(COLUMNS)
      .eq("user_id", userId)
      .order("check_in_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 500))
    return ((data ?? []) as Row[]).map(fromRow)
  } catch {
    return []
  }
}

export async function saveBoundaryCheckIn(
  input: SaveBoundaryCheckInInput,
): Promise<{ ok: boolean; checkIn?: BoundaryCheckIn; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in to save your check-in." }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.checkInDate)) return { ok: false, error: "Invalid date." }
    const segmentId = clip(input.segmentId, 80)
    if (!segmentId) return { ok: false, error: "Missing segment." }

    const collided = Boolean(input.collided)
    const { data, error } = await supabase
      .from("boundary_check_ins")
      .upsert(
        {
          user_id: userId,
          check_in_date: input.checkInDate,
          segment_id: segmentId,
          segment_label: clip(input.segmentLabel, 160),
          boundary_option_id: clip(input.boundaryOptionId, 80),
          boundary_text: clip(input.boundaryText, 300),
          boundary_week_key: clip(input.boundaryWeekKey, 20),
          collided,
          collisions: collided ? sanitizeCollisions(input.collisions) : [],
          note: collided ? clip(input.note, 1000) : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,check_in_date,segment_id" },
      )
      .select(COLUMNS)
      .single()

    if (error || !data) return { ok: false, error: "We couldn't save your check-in. Please try again." }
    return { ok: true, checkIn: fromRow(data as Row) }
  } catch {
    return { ok: false, error: "We couldn't save your check-in. Please try again." }
  }
}
