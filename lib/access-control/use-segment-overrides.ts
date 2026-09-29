"use client"

/**
 * Delivers Barbara's live manual-unlock overrides to the in-dashboard segment
 * gate. Backed by SWR so every `BusinessDayBlock` on the page shares a single
 * fetch (deduped by key), and admin panel mutations can refresh all gates at
 * once via `mutate(OVERRIDES_KEY)`.
 */

import useSWR, { mutate } from "swr"
import { getSegmentOverrideMap, type OverrideState } from "@/lib/access-control/actions"
import type { SegmentOverride } from "@/lib/access-control/segment-access"

export const OVERRIDES_KEY = "segment-access-overrides"

export function useSegmentOverrides() {
  const { data } = useSWR(OVERRIDES_KEY, () => getSegmentOverrideMap(), {
    revalidateOnFocus: true,
    // Overrides are rare admin actions; a gentle poll keeps members' gates in
    // sync without hammering the DB.
    refreshInterval: 60_000,
    fallbackData: {} as Record<string, OverrideState>,
  })

  const overrides = data ?? {}
  /** Ids with ANY override (tour or unlocked) — kept for callers that only
      need "is this segment overridden at all". */
  const overriddenIds = new Set(Object.keys(overrides))
  const tourIds = new Set(Object.keys(overrides).filter((id) => overrides[id] === "tour"))
  const unlockedIds = new Set(Object.keys(overrides).filter((id) => overrides[id] === "unlocked"))

  /** The override value for a single segment, ready for `resolveSegmentAccess`. */
  const overrideFor = (segmentId: string): SegmentOverride => overrides[segmentId] ?? null

  return { overrides, overriddenIds, tourIds, unlockedIds, overrideFor }
}

/** Refresh every subscribed gate after an admin mutation. */
export function refreshSegmentOverrides() {
  return mutate(OVERRIDES_KEY)
}
