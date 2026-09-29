"use server"

/**
 * Entrepreneur Gap Assessment™ — Server Read Layer (Phase 1 — Data Foundation)
 * ---------------------------------------------------------------------------
 * Server-safe reads over `ega_entries`, mirroring the pattern in
 * lib/entrepreneur-success/esa-server.ts. For use in Server Components and
 * Server Actions where a cookie-based session is available but the
 * browser Supabase client (lib/ega/ega-storage.ts) isn't.
 */

import { createClient } from "@/lib/supabase/server"
import type { EgaEntry, EgaStatus } from "./types"

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

/** Loads every EgaEntry for the given user id (server-safe), newest first. */
export async function getEgaEntriesServer(userId: string): Promise<EgaEntry[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ega_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error || !data) {
      console.log("[v0] getEgaEntriesServer skipped:", error?.message)
      return []
    }

    return (data as EgaEntryRow[]).map(mapRow)
  } catch (error) {
    console.log("[v0] getEgaEntriesServer skipped:", (error as Error)?.message)
    return []
  }
}

/** Count of open EgaEntries for the given user id (server-safe). Used for lightweight badges/gates. */
export async function getOpenEgaEntryCountServer(userId: string): Promise<number> {
  try {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from("ega_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "open")

    if (error) {
      console.log("[v0] getOpenEgaEntryCountServer skipped:", error.message)
      return 0
    }

    return count ?? 0
  } catch (error) {
    console.log("[v0] getOpenEgaEntryCountServer skipped:", (error as Error)?.message)
    return 0
  }
}
