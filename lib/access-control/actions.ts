"use server"

/**
 * Work-Life Balance Access Control™ — server actions backing Barbara's manual
 * unlock panel. All mutations are hard-gated to Platform Administrators and
 * write an invisible audit row for every action. Members never call these.
 *
 * The override model is deliberately minimal: `segment_access_overrides` holds
 * one row per segment that is currently force-unlocked ahead of its scheduled
 * time. No row = follow the clock (automatic). Re-locking a segment or
 * returning to automatic simply deletes rows.
 */

import { createClient } from "@/lib/supabase/server"
import { GATED_SEGMENT_IDS } from "@/lib/access-control/segment-access"

type AuditAction = "unlock" | "lock" | "unlock_all" | "return_to_automatic" | "tour" | "tour_all" | "end_tour"

/** Persisted override state for a segment. */
export type OverrideState = "tour" | "unlocked"

/** Resolve the caller and confirm they are a Platform Administrator. */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null as null, isAdmin: false as const }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  return { supabase, user, isAdmin: profile?.role === "platform_admin" }
}

/** Append one audit row. Best-effort — a failed audit never blocks the action. */
async function writeAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorId: string,
  action: AuditAction,
  segmentId: string | null,
  detail?: Record<string, unknown>,
) {
  try {
    await supabase.from("segment_access_audit").insert({
      actor_id: actorId,
      action,
      segment_id: segmentId,
      detail: detail ?? null,
    })
  } catch {
    // Audit is defense-in-depth; swallow so the control action still succeeds.
  }
}

/**
 * The set of segment ids currently force-unlocked. Readable by any member so
 * the in-dashboard gate knows what Barbara has opened early. Returns [] on any
 * error so the UI fails safe (locked = follow the clock).
 */
export async function getUnlockedSegmentIds(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("segment_access_overrides").select("segment_id")
    if (error || !data) return []
    return data.map((r) => r.segment_id as string)
  } catch {
    return []
  }
}

/**
 * The full override map — segment id → its persisted state (`"tour"` |
 * `"unlocked"`). This is what the gate needs to tell a read-only Tour preview
 * apart from a legacy full unlock. Rows written before the `state` column was
 * meaningful default to `"unlocked"` so behaviour is unchanged. Fails safe to
 * an empty map (everything follows the clock).
 */
export async function getSegmentOverrideMap(): Promise<Record<string, OverrideState>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("segment_access_overrides").select("segment_id, state")
    if (error || !data) return {}
    const map: Record<string, OverrideState> = {}
    for (const row of data) {
      const state = row.state === "tour" ? "tour" : "unlocked"
      map[row.segment_id as string] = state
    }
    return map
  } catch {
    return {}
  }
}

export interface AccessControlResult {
  ok: boolean
  error?: string
  unlocked: string[]
}

/** Force a single segment open ahead of its scheduled time. */
export async function unlockSegment(segmentId: string): Promise<AccessControlResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user || !isAdmin) return { ok: false, error: "Not authorized", unlocked: await getUnlockedSegmentIds() }
  if (!GATED_SEGMENT_IDS.has(segmentId))
    return { ok: false, error: "Segment is not time-gated", unlocked: await getUnlockedSegmentIds() }

  const { error } = await supabase
    .from("segment_access_overrides")
    .upsert({ segment_id: segmentId, state: "unlocked", set_by: user.id, updated_at: new Date().toISOString() })
  if (error) return { ok: false, error: error.message, unlocked: await getUnlockedSegmentIds() }

  await writeAudit(supabase, user.id, "unlock", segmentId)
  return { ok: true, unlocked: await getUnlockedSegmentIds() }
}

/**
 * Open a single segment as a READ-ONLY Tour preview for the founder. This is
 * Barbara's demo lever: the founder can view the segment (About + "what
 * happens here") but the live workspace stays withheld. It never grants live
 * execution — only the automatic schedule can do that.
 */
export async function tourSegment(segmentId: string): Promise<AccessControlResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user || !isAdmin) return { ok: false, error: "Not authorized", unlocked: await getUnlockedSegmentIds() }
  if (!GATED_SEGMENT_IDS.has(segmentId))
    return { ok: false, error: "Segment is not time-gated", unlocked: await getUnlockedSegmentIds() }

  const { error } = await supabase
    .from("segment_access_overrides")
    .upsert({ segment_id: segmentId, state: "tour", set_by: user.id, updated_at: new Date().toISOString() })
  if (error) return { ok: false, error: error.message, unlocked: await getUnlockedSegmentIds() }

  await writeAudit(supabase, user.id, "tour", segmentId)
  return { ok: true, unlocked: await getUnlockedSegmentIds() }
}

/** Open every time-gated segment as a read-only Tour preview at once. */
export async function tourAllSegments(): Promise<AccessControlResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user || !isAdmin) return { ok: false, error: "Not authorized", unlocked: await getUnlockedSegmentIds() }

  const now = new Date().toISOString()
  const rows = Array.from(GATED_SEGMENT_IDS).map((segment_id) => ({
    segment_id,
    state: "tour" as const,
    set_by: user.id,
    updated_at: now,
  }))
  const { error } = await supabase.from("segment_access_overrides").upsert(rows)
  if (error) return { ok: false, error: error.message, unlocked: await getUnlockedSegmentIds() }

  await writeAudit(supabase, user.id, "tour_all", null, { count: rows.length })
  return { ok: true, unlocked: await getUnlockedSegmentIds() }
}

/** Return a single segment to automatic (clock-governed) access. */
export async function lockSegment(segmentId: string): Promise<AccessControlResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user || !isAdmin) return { ok: false, error: "Not authorized", unlocked: await getUnlockedSegmentIds() }

  const { error } = await supabase.from("segment_access_overrides").delete().eq("segment_id", segmentId)
  if (error) return { ok: false, error: error.message, unlocked: await getUnlockedSegmentIds() }

  await writeAudit(supabase, user.id, "lock", segmentId)
  return { ok: true, unlocked: await getUnlockedSegmentIds() }
}

/** Force every time-gated segment open at once. */
export async function unlockAllSegments(): Promise<AccessControlResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user || !isAdmin) return { ok: false, error: "Not authorized", unlocked: await getUnlockedSegmentIds() }

  const now = new Date().toISOString()
  const rows = Array.from(GATED_SEGMENT_IDS).map((segment_id) => ({
    segment_id,
    state: "unlocked" as const,
    set_by: user.id,
    updated_at: now,
  }))
  const { error } = await supabase.from("segment_access_overrides").upsert(rows)
  if (error) return { ok: false, error: error.message, unlocked: await getUnlockedSegmentIds() }

  await writeAudit(supabase, user.id, "unlock_all", null, { count: rows.length })
  return { ok: true, unlocked: await getUnlockedSegmentIds() }
}

/** Clear all overrides — every segment returns to clock-governed access. */
export async function returnToAutomatic(): Promise<AccessControlResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user || !isAdmin) return { ok: false, error: "Not authorized", unlocked: await getUnlockedSegmentIds() }

  // Delete every row. `.neq` on the PK with an impossible value matches all.
  const { error } = await supabase.from("segment_access_overrides").delete().neq("segment_id", "__none__")
  if (error) return { ok: false, error: error.message, unlocked: await getUnlockedSegmentIds() }

  await writeAudit(supabase, user.id, "return_to_automatic", null)
  return { ok: true, unlocked: [] }
}
