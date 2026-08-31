import { createClient } from "@/lib/supabase/client"
import type { BuildModeId } from "@/lib/business-asset-library/build-modes"
import type { ArtifactKind } from "@/lib/business-asset-library/business-asset-registry"

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

/** Founder-approval lifecycle for a completed Business Asset™ — distinct from `status`, which tracks the build session itself. */
export type BusinessAssetReviewStatus = "draft" | "in-review" | "approved"

export interface BusinessAssetBuildRecord {
  id: string
  businessAssetId: string
  buildMode: BuildModeId
  status: "in-progress" | "completed"
  messages: BusinessAssetBuildMessage[]
  generatedContent: string | null
  /** The founder's per-Builder-Step™ answers, in guided-step order — lets a reopened build restore exactly what was there before. */
  fieldValues: string[]
  updatedAt: string
  createdAt: string
  reviewStatus: BusinessAssetReviewStatus
  version: number
  businessStage: string | null
  approvedAt: string | null
  /** Phase 1 Common Creation Engine discriminant. Defaults to "business-asset" for every existing row. */
  artifactKind: ArtifactKind
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
    fieldValues: Array.isArray(row.field_values) ? (row.field_values as string[]) : [],
    updatedAt: row.updated_at as string,
    createdAt: (row.created_at as string) ?? (row.updated_at as string),
    reviewStatus: (row.review_status as BusinessAssetReviewStatus) ?? "draft",
    version: (row.version as number) ?? 1,
    businessStage: (row.business_stage as string | null) ?? null,
    approvedAt: (row.approved_at as string | null) ?? null,
    artifactKind: (row.artifact_kind as ArtifactKind) ?? "business-asset",
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
  businessStage?: string | null,
  artifactKind: ArtifactKind = "business-asset",
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
        business_stage: businessStage ?? null,
        artifact_kind: artifactKind,
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

/**
 * Appends the latest exchange and, when provided, saves the final generated
 * content and the founder's current Builder Step™ field values. Best-effort.
 *
 * `isRevision` should be `true` when this save is completing a build that
 * was ALREADY completed once before (i.e. the founder reopened a finished
 * asset via "Edit / Revise") — it bumps `version` so the row's history is
 * distinguishable from the original finish.
 */
export async function updateBusinessAssetBuildInDb(
  buildId: string,
  messages: BusinessAssetBuildMessage[],
  generatedContent?: string | null,
  fieldValues?: string[],
  isRevision?: boolean,
): Promise<void> {
  try {
    const supabase = createClient()
    const patch: Record<string, unknown> = {
      messages,
      updated_at: new Date().toISOString(),
    }
    if (fieldValues) {
      patch.field_values = fieldValues
    }
    if (generatedContent !== undefined) {
      patch.generated_content = generatedContent
      patch.status = generatedContent ? "completed" : "in-progress"
      if (generatedContent && isRevision) {
        const { data: current } = await supabase
          .from("business_asset_builds")
          .select("version")
          .eq("id", buildId)
          .maybeSingle()
        patch.version = ((current?.version as number) ?? 1) + 1
      }
    }
    await supabase.from("business_asset_builds").update(patch).eq("id", buildId)
  } catch (error) {
    console.log("[v0] updateBusinessAssetBuildInDb skipped:", (error as Error)?.message)
  }
}

/**
 * Loads the founder's most recently completed build for this asset, across
 * every build mode — used by the ownership card to show "what you actually
 * finished" regardless of whether it came from Build With AI, Let AI Do It,
 * or Do It Myself. Returns `null` if signed out or nothing completed yet.
 */
export async function getLatestCompletedBuildForAsset(
  businessAssetId: string,
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
      .eq("status", "completed")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getLatestCompletedBuildForAsset skipped:", (error as Error)?.message)
    return null
  }
}

/**
 * Loads EVERY completed Business Asset™ build for the signed-in founder,
 * across every asset and build mode — the durable source for "My Blueprint
 * History™" on /my-blueprint. Most-recently-completed first. Returns an
 * empty array if signed out or nothing completed yet (never `null`, so
 * callers don't need a fallback).
 */
export async function getAllCompletedBusinessAssetBuilds(): Promise<BusinessAssetBuildRecord[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("business_asset_builds")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("updated_at", { ascending: false })
    return ((data as Record<string, unknown>[] | null) ?? [])
      .map(mapRow)
      .filter((r): r is BusinessAssetBuildRecord => r !== null)
  } catch (error) {
    console.log("[v0] getAllCompletedBusinessAssetBuilds skipped:", (error as Error)?.message)
    return []
  }
}

/**
 * Moves a completed build through the founder-approval lifecycle
 * (draft → in-review → approved). Setting "approved" also stamps
 * `approved_at`; moving off "approved" clears it. Best-effort, silent no-op
 * when signed out or the update fails.
 */
export async function setBusinessAssetBuildReviewStatus(
  buildId: string,
  reviewStatus: BusinessAssetReviewStatus,
): Promise<void> {
  try {
    const supabase = createClient()
    await supabase
      .from("business_asset_builds")
      .update({
        review_status: reviewStatus,
        approved_at: reviewStatus === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", buildId)
  } catch (error) {
    console.log("[v0] setBusinessAssetBuildReviewStatus skipped:", (error as Error)?.message)
  }
}

/**
 * Saves a Do It Myself (guided-diy) completion. That flow never talks to
 * the live-AI API route, so it manages its own row here — this UPSERTS
 * rather than always inserting: pass `existingBuildId` when the founder is
 * revising a build reopened via "Edit / Revise" so this updates that SAME
 * row instead of creating a duplicate. Even without `existingBuildId`, this
 * re-checks the database for an existing guided-diy build on this asset
 * before inserting, so a stale/missing id in the caller's state can never
 * produce a second row. Revising an already-completed build bumps
 * `version`. Best-effort, silent no-op when signed out.
 */
export async function saveGuidedDiyCompletionToDb(
  businessAssetId: string,
  fieldValues: string[],
  generatedContent: string,
  businessStage?: string | null,
  existingBuildId?: string | null,
  artifactKind: ArtifactKind = "business-asset",
): Promise<string | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()

    let buildId = existingBuildId ?? null
    let priorVersion = 1
    let priorStatus: string | null = null

    if (buildId) {
      const { data: current } = await supabase
        .from("business_asset_builds")
        .select("version, status")
        .eq("id", buildId)
        .maybeSingle()
      priorVersion = (current?.version as number) ?? 1
      priorStatus = (current?.status as string) ?? null
    } else {
      // Defensive re-check: never insert a second row for a build that
      // already exists, even if the caller's local state lost track of it.
      const { data: existing } = await supabase
        .from("business_asset_builds")
        .select("id, version, status")
        .eq("user_id", userId)
        .eq("business_asset_id", businessAssetId)
        .eq("build_mode", "guided-diy")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (existing) {
        buildId = existing.id as string
        priorVersion = (existing.version as number) ?? 1
        priorStatus = (existing.status as string) ?? null
      }
    }

    if (buildId) {
      const patch: Record<string, unknown> = {
        field_values: fieldValues,
        generated_content: generatedContent,
        status: "completed",
        updated_at: new Date().toISOString(),
      }
      if (priorStatus === "completed") {
        patch.version = priorVersion + 1
      }
      const { error } = await supabase.from("business_asset_builds").update(patch).eq("id", buildId)
      if (error) throw error
      return buildId
    }

    const { data, error } = await supabase
      .from("business_asset_builds")
      .insert({
        user_id: userId,
        business_asset_id: businessAssetId,
        build_mode: "guided-diy",
        status: "completed",
        messages: [],
        field_values: fieldValues,
        generated_content: generatedContent,
        business_stage: businessStage ?? null,
        artifact_kind: artifactKind,
      })
      .select("id")
      .single()

    if (error) throw error
    return (data?.id as string) ?? null
  } catch (error) {
    console.log("[v0] saveGuidedDiyCompletionToDb skipped:", (error as Error)?.message)
    return null
  }
}
