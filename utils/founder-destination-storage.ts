import { createClient } from "@/lib/supabase/client"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"

/**
 * Founder Destination™ persistence layer — database-backed.
 * ---------------------------------------------------------------------------
 * Founder Destination™ captures where the founder wants their business,
 * their own role, their life, and their future workplace to end up —
 * distinct from Business Context™ (the business's current state) and
 * Founder Profile™ (who the founder is today). ONE record per member,
 * created on first save and thereafter updated whenever the founder edits
 * it from My Work-Life Harmony Blueprint™.
 *
 * This is the source of truth. `lib/founder-destination/founder-destination-store.ts`
 * (localStorage) remains as a fast local cache so the UI can render instantly
 * on repeat visits — it is never authoritative and is refreshed from here.
 *
 * All writes/reads are best-effort: if the member is not signed in (e.g. the
 * public preview) nothing is persisted/loaded and the app continues normally
 * on the local cache alone.
 */

export interface FounderDestinationRecord extends FounderDestinationProfile {
  completedAt?: string
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

function toColumns(d: FounderDestinationProfile): Record<string, unknown> {
  return {
    desired_business_size: d.desiredBusinessSize,
    desired_team_size: d.desiredTeamSize,
    desired_geographic_reach: d.desiredGeographicReach,
    desired_market_position: d.desiredMarketPosition,
    revenue_ambition: d.revenueAmbition,
    desired_founder_role: d.desiredFounderRole,
    remain_responsible_for: d.remainResponsibleFor ?? [],
    not_responsible_for: d.notResponsibleFor ?? [],
    desired_working_hours_per_week: d.desiredWorkingHoursPerWeek,
    desired_founder_involvement: d.desiredFounderInvolvement,
    desired_zone_of_genius: d.desiredZoneOfGenius,
    desired_founder_independence: d.desiredFounderIndependence,
    desired_work_life_balance_model: d.desiredWorkLifeBalanceModel,
    desired_time_freedom_level: d.desiredTimeFreedomLevel,
    desired_lifestyle: d.desiredLifestyle,
    non_negotiable_life_boundaries: d.nonNegotiableLifeBoundaries ?? [],
    business_life_purpose: d.businessLifePurpose,
    desired_workplace_type: d.desiredWorkplaceType,
    desired_employee_experience: d.desiredEmployeeExperience,
    desired_work_design: d.desiredWorkDesign,
    desired_ai_human_relationship: d.desiredAiHumanRelationship,
    desired_leadership_culture: d.desiredLeadershipCulture,
    desired_human_sustainability_standard: d.desiredHumanSustainabilityStandard,
  }
}

function mapRow(row: Record<string, unknown> | null): FounderDestinationRecord | null {
  if (!row) return null
  return {
    desiredBusinessSize: row.desired_business_size as FounderDestinationProfile["desiredBusinessSize"],
    desiredTeamSize: row.desired_team_size as FounderDestinationProfile["desiredTeamSize"],
    desiredGeographicReach: row.desired_geographic_reach as FounderDestinationProfile["desiredGeographicReach"],
    desiredMarketPosition: row.desired_market_position as FounderDestinationProfile["desiredMarketPosition"],
    revenueAmbition: row.revenue_ambition as FounderDestinationProfile["revenueAmbition"],
    desiredFounderRole: row.desired_founder_role as FounderDestinationProfile["desiredFounderRole"],
    remainResponsibleFor: (row.remain_responsible_for as FounderDestinationProfile["remainResponsibleFor"]) ?? [],
    notResponsibleFor: (row.not_responsible_for as FounderDestinationProfile["notResponsibleFor"]) ?? [],
    desiredWorkingHoursPerWeek: row.desired_working_hours_per_week as FounderDestinationProfile["desiredWorkingHoursPerWeek"],
    desiredFounderInvolvement: row.desired_founder_involvement as FounderDestinationProfile["desiredFounderInvolvement"],
    desiredZoneOfGenius: row.desired_zone_of_genius as FounderDestinationProfile["desiredZoneOfGenius"],
    desiredFounderIndependence: row.desired_founder_independence as FounderDestinationProfile["desiredFounderIndependence"],
    desiredWorkLifeBalanceModel: row.desired_work_life_balance_model as FounderDestinationProfile["desiredWorkLifeBalanceModel"],
    desiredTimeFreedomLevel: row.desired_time_freedom_level as FounderDestinationProfile["desiredTimeFreedomLevel"],
    desiredLifestyle: row.desired_lifestyle as FounderDestinationProfile["desiredLifestyle"],
    nonNegotiableLifeBoundaries: (row.non_negotiable_life_boundaries as FounderDestinationProfile["nonNegotiableLifeBoundaries"]) ?? [],
    businessLifePurpose: row.business_life_purpose as FounderDestinationProfile["businessLifePurpose"],
    desiredWorkplaceType: row.desired_workplace_type as FounderDestinationProfile["desiredWorkplaceType"],
    desiredEmployeeExperience: row.desired_employee_experience as FounderDestinationProfile["desiredEmployeeExperience"],
    desiredWorkDesign: row.desired_work_design as FounderDestinationProfile["desiredWorkDesign"],
    desiredAiHumanRelationship: row.desired_ai_human_relationship as FounderDestinationProfile["desiredAiHumanRelationship"],
    desiredLeadershipCulture: row.desired_leadership_culture as FounderDestinationProfile["desiredLeadershipCulture"],
    desiredHumanSustainabilityStandard:
      row.desired_human_sustainability_standard as FounderDestinationProfile["desiredHumanSustainabilityStandard"],
    completedAt: row.completed_at as string | undefined,
  }
}

/**
 * Saves the Founder Destination™ for the current member to the database.
 * No-ops silently when signed out (localStorage cache still applies).
 */
export async function saveFounderDestinationToDb(destination: FounderDestinationProfile): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    const { data: existing } = await supabase
      .from("founder_destinations")
      .select("completed_at")
      .eq("user_id", userId)
      .maybeSingle()

    await supabase.from("founder_destinations").upsert(
      {
        user_id: userId,
        ...toColumns(destination),
        completed_at: (existing?.completed_at as string | undefined) ?? now,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
  } catch (error) {
    console.log("[v0] saveFounderDestinationToDb skipped:", (error as Error)?.message)
  }
}

/**
 * Loads the member's Founder Destination™ record from the database, or null
 * if they have not yet saved one (or are anonymous/offline).
 */
export async function getFounderDestinationFromDb(): Promise<FounderDestinationRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase.from("founder_destinations").select("*").eq("user_id", userId).maybeSingle()

    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getFounderDestinationFromDb skipped:", (error as Error)?.message)
    return null
  }
}

/** True once the signed-in member has a saved Founder Destination™ in the database. */
export async function hasCompletedFounderDestinationInDb(): Promise<boolean> {
  const record = await getFounderDestinationFromDb()
  return Boolean(record?.completedAt)
}
