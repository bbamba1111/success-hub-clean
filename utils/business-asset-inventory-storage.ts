import { createClient } from "@/lib/supabase/client"
import type { InstalledBusinessAsset } from "@/lib/business-asset-inventory/types"

/**
 * Installed Business Asset™ persistence layer — database-backed.
 * ---------------------------------------------------------------------------
 * One row per (founder, Business Asset™), created the moment the first
 * evidence arrives (founder confirmation, a completed Build Record, or a
 * completed Deliverable) and upserted thereafter. This is the source of
 * truth. `lib/business-asset-inventory/business-asset-inventory-store.ts`
 * (localStorage) is a fast local cache only — never authoritative, refreshed
 * from here.
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

function toColumns(r: InstalledBusinessAsset): Record<string, unknown> {
  return {
    business_asset_id: r.businessAssetId,
    status: r.status,
    evidence: r.evidence,
  }
}

function mapRow(row: Record<string, unknown> | null): InstalledBusinessAsset | null {
  if (!row) return null
  return {
    businessAssetId: row.business_asset_id as InstalledBusinessAsset["businessAssetId"],
    status: row.status as InstalledBusinessAsset["status"],
    evidence: (row.evidence as InstalledBusinessAsset["evidence"]) ?? [],
    updatedAt: row.updated_at as string,
  }
}

/**
 * Upserts an Installed Business Asset™ record for the current member, keyed
 * by (user_id, business_asset_id) — one status per asset. No-ops silently
 * when signed out (localStorage cache still applies).
 */
export async function upsertInstalledBusinessAssetToDb(record: InstalledBusinessAsset): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    await supabase.from("installed_business_assets").upsert(
      {
        user_id: userId,
        ...toColumns(record),
        updated_at: now,
      },
      { onConflict: "user_id,business_asset_id" },
    )
  } catch (error) {
    console.log("[v0] upsertInstalledBusinessAssetToDb skipped:", (error as Error)?.message)
  }
}

/** Loads every Installed Business Asset™ record for the current member, or `[]` if signed out/none saved. */
export async function getInstalledBusinessAssetsFromDb(): Promise<InstalledBusinessAsset[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const supabase = createClient()
    const { data } = await supabase.from("installed_business_assets").select("*").eq("user_id", userId)
    return ((data as Record<string, unknown>[] | null) ?? [])
      .map(mapRow)
      .filter((r): r is InstalledBusinessAsset => r !== null)
  } catch (error) {
    console.log("[v0] getInstalledBusinessAssetsFromDb skipped:", (error as Error)?.message)
    return []
  }
}

/** Loads a single Installed Business Asset™ record by asset id, or `null` if signed out/none saved. */
export async function getInstalledBusinessAssetFromDb(
  businessAssetId: string,
): Promise<InstalledBusinessAsset | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("installed_business_assets")
      .select("*")
      .eq("user_id", userId)
      .eq("business_asset_id", businessAssetId)
      .maybeSingle()
    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getInstalledBusinessAssetFromDb skipped:", (error as Error)?.message)
    return null
  }
}

/** Deletes an Installed Business Asset™ record (e.g. founder retracts confirmation) — best-effort. */
export async function deleteInstalledBusinessAssetFromDb(businessAssetId: string): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    await supabase
      .from("installed_business_assets")
      .delete()
      .eq("user_id", userId)
      .eq("business_asset_id", businessAssetId)
  } catch (error) {
    console.log("[v0] deleteInstalledBusinessAssetFromDb skipped:", (error as Error)?.message)
  }
}
