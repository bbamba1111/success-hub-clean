/**
 * Entrepreneur Gap Assessment™ — Storage Layer (Phase 1 — Data Foundation)
 * ---------------------------------------------------------------------------
 * CRUD over the `ega_entries` table. Unlike ESA/Business Context, EGA has no
 * localStorage layer — it is a signed-in-only diagnostic record from day
 * one, matching how `ega_entries` RLS policies scope every row to
 * auth.uid(). All functions are best-effort: if the member is signed out or
 * a write fails, they resolve to safe empty values and never throw upward,
 * matching the utils/reality-check-storage.ts / utils/business-context-storage.ts
 * pattern used elsewhere in the app.
 *
 * This module only reads/writes `ega_entries`. It does NOT read from or
 * write to the legacy `biggestChallenges` / `biggestOpportunities` fields —
 * that compatibility adapter is future work, not part of this data layer.
 */

import { createClient } from "@/lib/supabase/client"
import type {
  CreateEgaEntryInput,
  EgaEntry,
  EgaStatus,
  UpdateEgaEntryInput,
} from "./types"

interface EgaEntryRow {
  id: string
  user_id: string
  source: string
  source_ref: string | null
  signal: string
  gap: string | null
  obstacle_type: string | null
  solution: string | null
  solution_ref: string | null
  status: string
  business_stage: string | null
  time_horizon: string | null
  action_type: string | null
  success_indicator: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

function mapRow(row: EgaEntryRow): EgaEntry {
  return {
    id: row.id,
    userId: row.user_id,
    source: row.source as EgaEntry["source"],
    sourceRef: row.source_ref ?? undefined,
    signal: row.signal,
    gap: row.gap ?? undefined,
    obstacleType: (row.obstacle_type as EgaEntry["obstacleType"]) ?? undefined,
    solution: row.solution ?? undefined,
    solutionRef: row.solution_ref ?? undefined,
    status: row.status as EgaStatus,
    businessStage: (row.business_stage as EgaEntry["businessStage"]) ?? undefined,
    timeHorizon: (row.time_horizon as EgaEntry["timeHorizon"]) ?? undefined,
    actionType: (row.action_type as EgaEntry["actionType"]) ?? undefined,
    successIndicator: row.success_indicator ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at ?? undefined,
  }
}

/**
 * Resolves the current signed-in user id, or null if anonymous. Never
 * throws — callers treat null as "skip persistence".
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

/**
 * Creates a new EgaEntry (a Signal, optionally with a Gap/Solution already
 * known). Returns null if the member is signed out or the write fails.
 */
export async function createEgaEntry(input: CreateEgaEntryInput): Promise<EgaEntry | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("ega_entries")
      .insert({
        user_id: userId,
        source: input.source,
        source_ref: input.sourceRef,
        signal: input.signal,
        gap: input.gap,
        obstacle_type: input.obstacleType,
        solution: input.solution,
        solution_ref: input.solutionRef,
        status: input.status ?? "open",
        business_stage: input.businessStage,
        time_horizon: input.timeHorizon,
        action_type: input.actionType,
        success_indicator: input.successIndicator,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error || !data) {
      console.log("[v0] createEgaEntry skipped:", error?.message)
      return null
    }

    return mapRow(data as EgaEntryRow)
  } catch (error) {
    console.log("[v0] createEgaEntry skipped:", (error as Error)?.message)
    return null
  }
}

/**
 * Progressively enriches an existing EgaEntry (e.g. attaching a diagnosed
 * gap, a mapped solution, or moving it through the workflow status). Sets
 * `resolved_at` automatically when the status transitions to "resolved".
 */
export async function updateEgaEntry(id: string, patch: UpdateEgaEntryInput): Promise<EgaEntry | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    const columns: Record<string, unknown> = { updated_at: now }
    if (patch.gap !== undefined) columns.gap = patch.gap
    if (patch.obstacleType !== undefined) columns.obstacle_type = patch.obstacleType
    if (patch.solution !== undefined) columns.solution = patch.solution
    if (patch.solutionRef !== undefined) columns.solution_ref = patch.solutionRef
    if (patch.businessStage !== undefined) columns.business_stage = patch.businessStage
    if (patch.timeHorizon !== undefined) columns.time_horizon = patch.timeHorizon
    if (patch.actionType !== undefined) columns.action_type = patch.actionType
    if (patch.successIndicator !== undefined) columns.success_indicator = patch.successIndicator
    if (patch.status !== undefined) {
      columns.status = patch.status
      columns.resolved_at = patch.status === "resolved" ? now : null
    }

    const { data, error } = await supabase
      .from("ega_entries")
      .update(columns)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error || !data) {
      console.log("[v0] updateEgaEntry skipped:", error?.message)
      return null
    }

    return mapRow(data as EgaEntryRow)
  } catch (error) {
    console.log("[v0] updateEgaEntry skipped:", (error as Error)?.message)
    return null
  }
}

/** Deletes an EgaEntry outright (e.g. a duplicate or mis-detected signal). */
export async function deleteEgaEntry(id: string): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  try {
    const supabase = createClient()
    const { error } = await supabase.from("ega_entries").delete().eq("id", id).eq("user_id", userId)
    return !error
  } catch (error) {
    console.log("[v0] deleteEgaEntry skipped:", (error as Error)?.message)
    return false
  }
}

/** Loads every EgaEntry for the current member, newest first. Returns [] for anonymous sessions. */
export async function getEgaEntries(): Promise<EgaEntry[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("ega_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error || !data) {
      console.log("[v0] getEgaEntries skipped:", error?.message)
      return []
    }

    return (data as EgaEntryRow[]).map(mapRow)
  } catch (error) {
    console.log("[v0] getEgaEntries skipped:", (error as Error)?.message)
    return []
  }
}

/** Loads only the EgaEntries with the given status (e.g. "open"), newest first. */
export async function getEgaEntriesByStatus(status: EgaStatus): Promise<EgaEntry[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("ega_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error || !data) {
      console.log("[v0] getEgaEntriesByStatus skipped:", error?.message)
      return []
    }

    return (data as EgaEntryRow[]).map(mapRow)
  } catch (error) {
    console.log("[v0] getEgaEntriesByStatus skipped:", (error as Error)?.message)
    return []
  }
}

/**
 * Finds an existing EgaEntry for the given source + sourceRef, if one
 * already exists. Used by future trigger-detection logic to avoid creating
 * duplicate entries every time the same signal re-fires (e.g. re-scoring
 * the same ESA practice below threshold).
 */
export async function findEgaEntryBySourceRef(
  source: EgaEntry["source"],
  sourceRef: string,
): Promise<EgaEntry | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("ega_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("source", source)
      .eq("source_ref", sourceRef)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) return null
    return mapRow(data as EgaEntryRow)
  } catch (error) {
    console.log("[v0] findEgaEntryBySourceRef skipped:", (error as Error)?.message)
    return null
  }
}
