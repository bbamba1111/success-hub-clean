import { createClient } from "@/lib/supabase/client"

/**
 * Business Foundation Assessment™ / Business Blueprint™ persistence layer.
 *
 * Unlike the Reality Check (a weekly snapshot), the Business Foundation is a
 * *living* document: ONE record per member, versioned over time. It is created
 * once — on the member's first AI Augmentation Hour™ — and thereafter only
 * updated when the founder chooses to refresh their Business Blueprint™ as the
 * business evolves.
 *
 * All writes are best-effort: if the member is not signed in (e.g. the public
 * preview) nothing is persisted and the app continues normally.
 */

/** The full Business Foundation as captured by the assessment. */
export interface BusinessFoundation {
  businessIdentity?: string
  businessStage?: string
  growthModel?: string
  funding?: string
  revenueStage?: string
  revenueModel?: string
  businessSize?: string
  businessChallenges?: string[]
  businessKnowledgeInterests?: string[]
  founderBottlenecks?: string[]
  aiReadiness?: string
  founderSuccessVision?: string
  preferredLanguage?: string
  preferredCurrency?: string
  country?: string
  timeZone?: string
}

/** Full record as returned from Supabase, including versioning metadata. */
export interface BusinessFoundationRecord extends BusinessFoundation {
  version: number
  completedAt: string | null
  lastReviewedAt: string | null
  updatedAt: string | null
}

/**
 * Resolves the current signed-in user id, or null if anonymous.
 * Never throws — callers treat null as "skip persistence".
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

/** Maps a DB row (snake_case) into the camelCase record used across the app. */
function mapRow(row: Record<string, unknown> | null): BusinessFoundationRecord | null {
  if (!row) return null
  return {
    businessIdentity: (row.business_identity as string) ?? undefined,
    businessStage: (row.business_stage as string) ?? undefined,
    growthModel: (row.growth_model as string) ?? undefined,
    funding: (row.funding as string) ?? undefined,
    revenueStage: (row.revenue_stage as string) ?? undefined,
    revenueModel: (row.revenue_model as string) ?? undefined,
    businessSize: (row.business_size as string) ?? undefined,
    businessChallenges: (row.business_challenges as string[]) ?? [],
    businessKnowledgeInterests: (row.business_knowledge_interests as string[]) ?? [],
    founderBottlenecks: (row.founder_bottlenecks as string[]) ?? [],
    aiReadiness: (row.ai_readiness as string) ?? undefined,
    founderSuccessVision: (row.founder_success_vision as string) ?? undefined,
    preferredLanguage: (row.preferred_language as string) ?? undefined,
    preferredCurrency: (row.preferred_currency as string) ?? undefined,
    country: (row.country as string) ?? undefined,
    timeZone: (row.time_zone as string) ?? undefined,
    version: (row.version as number) ?? 1,
    completedAt: (row.completed_at as string) ?? null,
    lastReviewedAt: (row.last_reviewed_at as string) ?? null,
    updatedAt: (row.updated_at as string) ?? null,
  }
}

/** Translates a camelCase foundation into the DB column patch (snake_case). */
function toColumns(f: BusinessFoundation): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  if (f.businessIdentity !== undefined) patch.business_identity = f.businessIdentity
  if (f.businessStage !== undefined) patch.business_stage = f.businessStage
  if (f.growthModel !== undefined) patch.growth_model = f.growthModel
  if (f.funding !== undefined) patch.funding = f.funding
  if (f.revenueStage !== undefined) patch.revenue_stage = f.revenueStage
  if (f.revenueModel !== undefined) patch.revenue_model = f.revenueModel
  if (f.businessSize !== undefined) patch.business_size = f.businessSize
  if (f.businessChallenges !== undefined) patch.business_challenges = f.businessChallenges
  if (f.businessKnowledgeInterests !== undefined) patch.business_knowledge_interests = f.businessKnowledgeInterests
  if (f.founderBottlenecks !== undefined) patch.founder_bottlenecks = f.founderBottlenecks
  if (f.aiReadiness !== undefined) patch.ai_readiness = f.aiReadiness
  if (f.founderSuccessVision !== undefined) patch.founder_success_vision = f.founderSuccessVision
  if (f.preferredLanguage !== undefined) patch.preferred_language = f.preferredLanguage
  if (f.preferredCurrency !== undefined) patch.preferred_currency = f.preferredCurrency
  if (f.country !== undefined) patch.country = f.country
  if (f.timeZone !== undefined) patch.time_zone = f.timeZone
  return patch
}

/**
 * Saves the Business Foundation Assessment™ for the current member.
 *
 * First completion creates the single record (version 1). A subsequent save
 * (member updating their Blueprint™) bumps the version and refreshes the
 * review timestamp so Cherry Blossom can narrate how the business has evolved.
 */
export async function saveBusinessFoundation(foundation: BusinessFoundation): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    // Read the existing record (if any) so we can version correctly.
    const { data: existing } = await supabase
      .from("business_foundations")
      .select("version")
      .eq("user_id", userId)
      .maybeSingle()

    const nextVersion = existing ? ((existing.version as number) ?? 1) + 1 : 1

    await supabase.from("business_foundations").upsert(
      {
        user_id: userId,
        ...toColumns(foundation),
        version: nextVersion,
        completed_at: existing ? undefined : now,
        last_reviewed_at: now,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
  } catch (error) {
    console.log("[v0] saveBusinessFoundation skipped:", (error as Error)?.message)
  }
}

/**
 * Loads the member's Business Foundation record, or null if they have not yet
 * completed the assessment (or are anonymous). Used to decide whether the
 * first-visit assessment should be shown inside the AI Augmentation Hour™.
 */
export async function getBusinessFoundation(): Promise<BusinessFoundationRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("business_foundations")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getBusinessFoundation skipped:", (error as Error)?.message)
    return null
  }
}

/** True once the member has completed the Business Foundation Assessment™. */
export async function hasCompletedBusinessFoundation(): Promise<boolean> {
  const record = await getBusinessFoundation()
  return Boolean(record?.completedAt)
}
