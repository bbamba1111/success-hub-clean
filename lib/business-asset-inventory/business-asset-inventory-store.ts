/**
 * Installed Business Asset™ — Local Cache Layer
 * ---------------------------------------------------------------------------
 * Client-side localStorage cache following the exact pattern of
 * `lib/build-record/build-record-store.ts`. NEVER authoritative —
 * `utils/business-asset-inventory-storage.ts` (Supabase) is the source of
 * truth; this exists only so the UI can paint instantly on repeat visits and
 * so engines can synchronously check "does the founder already have this
 * Business Asset™" without an await in the render path.
 *
 * Key: "hl:business-asset-inventory:v1" — a map of businessAssetId ->
 * InstalledBusinessAsset.
 */

import type { InstalledBusinessAsset, BusinessAssetInstallationStatus } from "./types"

const STORAGE_KEY = "hl:business-asset-inventory:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const BUSINESS_ASSET_INVENTORY_EVENT = "hl:business-asset-inventory:changed"

type InstalledBusinessAssetMap = Record<string, InstalledBusinessAsset>

function readAll(): InstalledBusinessAssetMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as InstalledBusinessAssetMap
  } catch (error) {
    console.error("[BusinessAssetInventory] Error reading records:", error)
    return {}
  }
}

function writeAll(map: InstalledBusinessAssetMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new CustomEvent(BUSINESS_ASSET_INVENTORY_EVENT))
  } catch (error) {
    console.error("[BusinessAssetInventory] Error saving records:", error)
  }
}

export function saveInstalledBusinessAsset(record: InstalledBusinessAsset): void {
  const all = readAll()
  all[record.businessAssetId] = record
  writeAll(all)
}

export function getInstalledBusinessAsset(businessAssetId: string): InstalledBusinessAsset | null {
  const all = readAll()
  return all[businessAssetId] ?? null
}

export function getAllInstalledBusinessAssets(): InstalledBusinessAsset[] {
  return Object.values(readAll())
}

export function clearInstalledBusinessAsset(businessAssetId: string): void {
  const all = readAll()
  delete all[businessAssetId]
  writeAll(all)
}

/** Replaces the entire local cache — used when reconciling from the database on mount. */
export function replaceAllInstalledBusinessAssets(records: InstalledBusinessAsset[]): void {
  const map: InstalledBusinessAssetMap = {}
  for (const record of records) {
    map[record.businessAssetId] = record
  }
  writeAll(map)
}

/**
 * Business Blueprint™ integration hook — a synchronous
 * `{ businessAssetId: BusinessAssetInstallationStatus }` map for every asset
 * with a recorded status, for engines that can't await. Mirrors
 * `getActiveBuildStatusByCapabilityId()` in `build-record-store.ts`.
 */
export function getInstalledStatusByAssetId(): Record<string, BusinessAssetInstallationStatus> {
  const result: Record<string, BusinessAssetInstallationStatus> = {}
  for (const record of getAllInstalledBusinessAssets()) {
    result[record.businessAssetId] = record.status
  }
  return result
}
