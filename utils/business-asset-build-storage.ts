import { createClient } from "@/lib/supabase/client"
import type { BuildModeId } from "@/lib/business-asset-library/build-modes"

/**
 * Live AI Build™ persistence layer (Phase 12.2 proof of concept).
 * ---------------------------------------------------------------------------
 * One row per (founder, Business Asset™, build session) in
 * `business_asset_builds` — stores the live chat transcript with the
 * founder's Executive™ plus the final generated content, so a founder can
 * leave and resume a build in progress. Mirrors the exact pattern of
 * `utils/business-asset-inventory-storage.ts`: client-side, best-effort,
 * silent no-op when signed out.
 */

export interface BusinessAssetBuildMessage {
  role: "user" | "assistant"
  content: string
}

export interface BusinessAssetBuildRecord {
  id: string
  businessAssetId: string
  buildMode: BuildModeId
  status: "in-progress" | "completed"
  messages: BusinessAssetBuildMessage[]
  generatedContent: string | null
  updatedAt: string
}

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

function mapRow(row: Record<string, unknown> | null): BusinessAssetBuildRecord | null {
  if (!row) return null
  return {
    id: row.id as string,
    businessAssetId: row.business_asset_id as string,
    buildMode: row.build_mode as BuildModeId,
    status: row.status as BusinessAssetBuildRecord["status"],
    messages: (row.messages as BusinessAssetBuildMessage[]) ?? [],
    generatedContent: (row.generated_content as string | null) ?? null,
    updatedAt: row.updated_at as string,
  }
}

/**
 * Loads the most recent in-progress (or completed) build session for this
 * founder + asset + mode, or `null` if signed out/none saved yet.
 */
export async function getBusinessAssetBuildFromDb(
  businessAssetId: string,
  buildMode: BuildModeId,
): Promise<BusinessAssetBuildRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("business_asset_builds")
      .select("*")
      .eq("user_id", userId)
      .eq("business_asset_id", businessAssetId)
      .eq("build_mode", buildMode)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getBusinessAssetBuildFromDb skipped:", (error as Error)?.message)
    return null
  }
}

/**
 * Creates a new build session row and returns its id, or `null` if signed
 * out (the chat can still run in-memory for that session).
 */
export async function createBusinessAssetBuildInDb(
  businessAssetId: string,
  buildMode: BuildModeId,
): Promise<string | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("business_asset_builds")
      .insert({
        user_id: userId,
        business_asset_id: businessAssetId,
        build_mode: buildMode,
        status: "in-progress",
        messages: [],
      })
      .select("id")
      .single()

    if (error) throw error
    return (data?.id as string) ?? null
  } catch (error) {
    console.log("[v0] createBusinessAssetBuildInDb skipped:", (error as Error)?.message)
    return null
  }
}

/** Appends the latest exchange and, when provided, saves the final generated content. Best-effort. */
export async function updateBusinessAssetBuildInDb(
  buildId: string,
  messages: BusinessAssetBuildMessage[],
  generatedContent?: string | null,
): Promise<void> {
  try {
    const supabase = createClient()
    const patch: Record<string, unknown> = {
      messages,
      updated_at: new Date().toISOString(),
    }
    if (generatedContent !== undefined) {
      patch.generated_content = generatedContent
      patch.status = generatedContent ? "completed" : "in-progress"
    }
    await supabase.from("business_asset_builds").update(patch).eq("id", buildId)
  } catch (error) {
    console.log("[v0] updateBusinessAssetBuildInDb skipped:", (error as Error)?.message)
  }
}
