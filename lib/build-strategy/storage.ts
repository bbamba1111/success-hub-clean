/**
 * Build Strategy™ — Storage Layer (Phase 9F)
 * ---------------------------------------------------------------------------
 * Client-side localStorage storage following the exact pattern of
 * `lib/founder-destination/founder-destination-store.ts`.
 *
 * Key: "hl:build-strategy:v1"
 *
 * Stores the founder's chosen Build Path™ and resulting Build Blueprint™,
 * keyed by recommendation id, so returning to My Blueprint™ resumes the
 * same plan instead of regenerating it.
 *
 * Known gap (flagged, not silently worked around): this is localStorage
 * only — no Supabase table exists yet for Build Strategy™ selections, so
 * the founder's choice does not sync across devices. Reconciling this to
 * the database is deferred to a future phase.
 */

import type { BuildBlueprint, BuildPathId } from "./types"

const STORAGE_KEY = "hl:build-strategy:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const BUILD_STRATEGY_EVENT = "hl:build-strategy:changed"

interface BuildStrategyRecord {
  buildPath: BuildPathId
  blueprint: BuildBlueprint
}

type BuildStrategyStore = Record<string, BuildStrategyRecord>

function readStore(): BuildStrategyStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as BuildStrategyStore
  } catch (error) {
    console.error("[BuildStrategy] Error reading store:", error)
    return {}
  }
}

function writeStore(store: BuildStrategyStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new CustomEvent(BUILD_STRATEGY_EVENT))
  } catch (error) {
    console.error("[BuildStrategy] Error writing store:", error)
  }
}

/** Save the founder's chosen Build Path™ and its resulting blueprint for a given recommendation. */
export function saveBuildStrategy(recommendationId: string, buildPath: BuildPathId, blueprint: BuildBlueprint): void {
  const store = readStore()
  store[recommendationId] = { buildPath, blueprint }
  writeStore(store)
}

/** Read back the saved Build Path™/blueprint for a given recommendation, if any. */
export function getBuildStrategy(recommendationId: string): BuildStrategyRecord | null {
  const store = readStore()
  return store[recommendationId] ?? null
}

/** Clear the saved Build Path™/blueprint for a given recommendation (e.g. "choose a different path"). */
export function clearBuildStrategy(recommendationId: string): void {
  const store = readStore()
  delete store[recommendationId]
  writeStore(store)
}
