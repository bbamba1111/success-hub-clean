import { createClient } from "@/lib/supabase/client"
import type { BusinessContextProfile } from "@/lib/business-context/types"

/**
 * Business Context Profile™ persistence layer — database-backed.
 * ---------------------------------------------------------------------------
 * ONE living record per member. This is the source of truth.
 * `lib/business-context/business-context-store.ts` (localStorage) remains as
 * a fast local cache so the UI can render instantly on repeat visits — it is
 * never authoritative and is refreshed from here.
 *
 * All writes/reads are best-effort: if the member is not signed in nothing
 * is persisted/loaded and the app continues normally on the local cache alone.
 */

export interface BusinessContextRecord extends BusinessContextProfile {
  updatedAt: string | null
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

function mapRow(row: Record<string, unknown> | null): BusinessContextRecord | null {
  if (!row) return null
  return {
    completedAt: (row.completed_at as string) ?? "",
    businessName: (row.business_name as string) ?? "",
    businessStage: (row.business_stage as BusinessContextProfile["businessStage"]) ?? ("idea" as const),
    businessModel: (row.business_model as BusinessContextProfile["businessModel"]) ?? [],
    industry: (row.industry as string) ?? "",
    founderRole: (row.founder_role as BusinessContextProfile["founderRole"]) ?? ("solopreneur" as const),
    teamSize: (row.team_size as BusinessContextProfile["teamSize"]) ?? ("solo" as const),
    revenueStage: (row.revenue_stage as BusinessContextProfile["revenueStage"]) ?? ("pre-revenue" as const),
    biggestGoals: (row.biggest_goals as BusinessContextProfile["biggestGoals"]) ?? [],
    biggestChallenges: (row.biggest_challenges as BusinessContextProfile["biggestChallenges"]) ?? [],
    biggestGoalText: (row.biggest_goal_text as string) ?? undefined,
    biggestChallengeText: (row.biggest_challenge_text as string) ?? undefined,
    successVision: (row.success_vision as string) ?? undefined,
    operatingEnvironment: (row.operating_environment as BusinessContextProfile["operatingEnvironment"]) ?? undefined,
    supportNetwork: (row.support_network as BusinessContextProfile["supportNetwork"]) ?? undefined,
    biggestOpportunities: (row.biggest_opportunities as BusinessContextProfile["biggestOpportunities"]) ?? undefined,
    longTermVision:
      (row.long_term_vision as BusinessContextProfile["longTermVision"]) ?? {
        oneYear: "",
        threeYear: "",
        fiveYear: "",
        tenYear: "",
        description: "",
      },
    capitalStrategy: (row.capital_strategy as BusinessContextProfile["capitalStrategy"]) ?? [],
    growthVision: (row.growth_vision as BusinessContextProfile["growthVision"]) ?? ("undecided" as const),
    exitVision: (row.exit_vision as BusinessContextProfile["exitVision"]) ?? ("undecided" as const),
    businessCredit: (row.business_credit as BusinessContextProfile["businessCredit"]) ?? ("not-sure" as const),
    businessBanking: (row.business_banking as BusinessContextProfile["businessBanking"]) ?? ("not-sure" as const),
    financialFoundation: (row.financial_foundation as BusinessContextProfile["financialFoundation"]) ?? [],
    wealthBuildingInterests: (row.wealth_building_interests as BusinessContextProfile["wealthBuildingInterests"]) ?? [],
    communicationLevel: (row.communication_level as BusinessContextProfile["communicationLevel"]) ?? ("foundation" as const),
    learningInterests: (row.learning_interests as string[]) ?? [],
    updatedAt: (row.updated_at as string) ?? null,
  }
}

function toColumns(p: BusinessContextProfile): Record<string, unknown> {
  return {
    business_name: p.businessName,
    business_stage: p.businessStage,
    business_model: p.businessModel,
    industry: p.industry,
    founder_role: p.founderRole,
    team_size: p.teamSize,
    revenue_stage: p.revenueStage,
    biggest_goals: p.biggestGoals,
    biggest_challenges: p.biggestChallenges,
    biggest_goal_text: p.biggestGoalText,
    biggest_challenge_text: p.biggestChallengeText,
    success_vision: p.successVision,
    operating_environment: p.operatingEnvironment,
    support_network: p.supportNetwork,
    biggest_opportunities: p.biggestOpportunities,
    long_term_vision: p.longTermVision,
    capital_strategy: p.capitalStrategy,
    growth_vision: p.growthVision,
    exit_vision: p.exitVision,
    business_credit: p.businessCredit,
    business_banking: p.businessBanking,
    financial_foundation: p.financialFoundation,
    wealth_building_interests: p.wealthBuildingInterests,
    communication_level: p.communicationLevel,
    learning_interests: p.learningInterests,
  }
}

/**
 * Saves the Business Context Profile™ for the current member to the
 * database. No-ops silently when signed out (localStorage cache still
 * applies).
 */
export async function saveBusinessContextToDb(profile: BusinessContextProfile): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    const { data: existing } = await supabase
      .from("business_context_profiles")
      .select("completed_at")
      .eq("user_id", userId)
      .maybeSingle()

    await supabase.from("business_context_profiles").upsert(
      {
        user_id: userId,
        ...toColumns(profile),
        completed_at: (existing?.completed_at as string | undefined) ?? profile.completedAt ?? now,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
  } catch (error) {
    console.log("[v0] saveBusinessContextToDb skipped:", (error as Error)?.message)
  }
}

/**
 * Loads the member's Business Context Profile™ record from the database, or
 * null if they have not yet completed it (or are anonymous/offline).
 */
export async function getBusinessContextFromDb(): Promise<BusinessContextRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase.from("business_context_profiles").select("*").eq("user_id", userId).maybeSingle()

    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getBusinessContextFromDb skipped:", (error as Error)?.message)
    return null
  }
}

/** True once the signed-in member has a completed Business Context Profile™ in the database. */
export async function hasCompletedBusinessContextInDb(): Promise<boolean> {
  const record = await getBusinessContextFromDb()
  return Boolean(record?.completedAt)
}
