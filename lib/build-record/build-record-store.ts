/**
 * Build Record™ — Local Cache Layer
 * ---------------------------------------------------------------------------
 * Client-side localStorage cache following the exact pattern of
 * lib/founder-destination/founder-destination-store.ts. NEVER authoritative
 * — `utils/build-record-storage.ts` (Supabase) is the source of truth; this
 * exists only so the UI can paint instantly on repeat visits and so Founder
 * GPS™ can synchronously check "is this capability already being built"
 * without an await in the render path.
 *
 * Key: "hl:build-records:v1" — a map of readinessCapabilityId -> BuildRecord.
 */

import type { BuildLifecycleStatus, BuildRecord } from "./types"
import { ACTIVE_BUILD_STATUSES } from "./types"

const STORAGE_KEY = "hl:build-records:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const BUILD_RECORD_EVENT = "hl:build-records:changed"

type BuildRecordMap = Record<string, BuildRecord>

function readAll(): BuildRecordMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as BuildRecordMap
  } catch (error) {
    console.error("[BuildRecord] Error reading records:", error)
    return {}
  }
}

function writeAll(map: BuildRecordMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new CustomEvent(BUILD_RECORD_EVENT))
  } catch (error) {
    console.error("[BuildRecord] Error saving records:", error)
  }
}

export function saveBuildRecord(record: BuildRecord): void {
  const all = readAll()
  all[record.readinessCapabilityId] = record
  writeAll(all)
}

export function getBuildRecord(readinessCapabilityId: string): BuildRecord | null {
  const all = readAll()
  return all[readinessCapabilityId] ?? null
}

export function getAllBuildRecords(): BuildRecord[] {
  return Object.values(readAll())
}

export function clearBuildRecord(readinessCapabilityId: string): void {
  const all = readAll()
  delete all[readinessCapabilityId]
  writeAll(all)
}

/** Replaces the entire local cache — used when reconciling from the database on mount. */
export function replaceAllBuildRecords(records: BuildRecord[]): void {
  const map: BuildRecordMap = {}
  for (const record of records) {
    map[record.readinessCapabilityId] = record
  }
  writeAll(map)
}

/**
 * Founder GPS™ integration hook — a synchronous
 * `{ readinessCapabilityId: BuildLifecycleStatus }` map for every capability
 * with a non-terminal build, used by `getActiveBuildStatusByCapabilityId()`
 * in `next-best-move-engine.ts` so GPS never repeats an in-progress or
 * installed capability. Cancelled/superseded builds are intentionally
 * excluded — those free the capability back up for recommendation.
 */
export function getActiveBuildStatusByCapabilityId(): Record<string, BuildLifecycleStatus> {
  const result: Record<string, BuildLifecycleStatus> = {}
  for (const record of getAllBuildRecords()) {
    if (record.status === "installed" || ACTIVE_BUILD_STATUSES.includes(record.status)) {
      result[record.readinessCapabilityId] = record.status
    }
  }
  return result
}
