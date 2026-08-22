import { createClient } from "@/lib/supabase/client"
import type { BuildRecord } from "@/lib/build-record/types"

/**
 * Build Record™ persistence layer — database-backed.
 * ---------------------------------------------------------------------------
 * One row per (founder, Readiness Capability™), created the moment a Build
 * Path™ is chosen and upserted thereafter as the build progresses. This is
 * the source of truth. `lib/build-record/build-record-store.ts` (localStorage)
 * is a fast local cache only — never authoritative, refreshed from here.
 *
 * All writes/reads are best-effort: if the member is not signed in (e.g. the
 * public preview) nothing is persisted/loaded and the app continues normally
 * on the local cache alone.
 */

async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

function toColumns(r: BuildRecord): Record<string, unknown> {
  return {
    capability_id: r.readinessCapabilityId,
    build_path: r.buildPath,
    status: r.status,
    title: r.title,
    summary: r.summary,
    blueprint: r.blueprint,
    execution: r.execution,
    milestones: r.milestones,
    tasks: r.tasks,
    prerequisite_capability_ids: r.prerequisiteCapabilityIds,
    blocked_by_capability_ids: r.blockedByCapabilityIds,
    blocker_note: r.blockerNote,
    owner_summary: r.ownerSummary,
    executor: r.executor,
    started_at: r.startedAt,
    completed_at: r.completedAt,
    installed_at: r.installedAt,
  }
}

function mapRow(row: Record<string, unknown> | null): BuildRecord | null {
  if (!row) return null
  return {
    id: row.id as string,
    readinessCapabilityId: row.capability_id as string,
    title: (row.title as string) ?? "",
    summary: (row.summary as string) ?? "",
    buildPath: row.build_path as BuildRecord["buildPath"],
    blueprint: row.blueprint as BuildRecord["blueprint"],
    execution: row.execution as BuildRecord["execution"],
    status: row.status as BuildRecord["status"],
    milestones: (row.milestones as BuildRecord["milestones"]) ?? [],
    tasks: (row.tasks as BuildRecord["tasks"]) ?? [],
    prerequisiteCapabilityIds: (row.prerequisite_capability_ids as string[]) ?? [],
    blockedByCapabilityIds: (row.blocked_by_capability_ids as string[]) ?? [],
    blockerNote: (row.blocker_note as string | null) ?? null,
    ownerSummary: (row.owner_summary as string) ?? "",
    executor: (row.executor as string | null) ?? null,
    createdAt: row.created_at as string,
    startedAt: (row.started_at as string | null) ?? null,
    completedAt: (row.completed_at as string | null) ?? null,
    installedAt: (row.installed_at as string | null) ?? null,
    updatedAt: row.updated_at as string,
  }
}

/**
 * Upserts a Build Record™ for the current member, keyed by
 * (user_id, capability_id) — one active build per capability. No-ops
 * silently when signed out (localStorage cache still applies).
 */
export async function upsertBuildRecordToDb(record: BuildRecord): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    await supabase.from("build_records").upsert(
      {
        user_id: userId,
        ...toColumns(record),
        updated_at: now,
      },
      { onConflict: "user_id,capability_id" },
    )
  } catch (error) {
    console.log("[v0] upsertBuildRecordToDb skipped:", (error as Error)?.message)
  }
}

/** Loads every Build Record™ for the current member, or `[]` if signed out/none saved. */
export async function getBuildRecordsFromDb(): Promise<BuildRecord[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const supabase = createClient()
    const { data } = await supabase.from("build_records").select("*").eq("user_id", userId)
    return ((data as Record<string, unknown>[] | null) ?? [])
      .map(mapRow)
      .filter((r): r is BuildRecord => r !== null)
  } catch (error) {
    console.log("[v0] getBuildRecordsFromDb skipped:", (error as Error)?.message)
    return []
  }
}

/** Loads a single Build Record™ by capability id, or `null` if signed out/none saved. */
export async function getBuildRecordFromDb(readinessCapabilityId: string): Promise<BuildRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("build_records")
      .select("*")
      .eq("user_id", userId)
      .eq("capability_id", readinessCapabilityId)
      .maybeSingle()
    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getBuildRecordFromDb skipped:", (error as Error)?.message)
    return null
  }
}

/** Deletes a Build Record™ (e.g. founder cancels a build) — best-effort. */
export async function deleteBuildRecordFromDb(readinessCapabilityId: string): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    await supabase.from("build_records").delete().eq("user_id", userId).eq("capability_id", readinessCapabilityId)
  } catch (error) {
    console.log("[v0] deleteBuildRecordFromDb skipped:", (error as Error)?.message)
  }
}
