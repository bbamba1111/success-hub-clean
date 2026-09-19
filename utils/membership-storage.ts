import { createClient } from "@/lib/supabase/client"
import type { AccessLevel } from "@/lib/membership/access"

/**
 * Membership persistence layer — the platform's source of truth for ACCESS &
 * EXPERIENCE (billing truth lives in Stripe/SamCart later).
 *
 * Separation of concerns:
 *   • user_profiles.membership_tier -> AUTHORIZATION (middleware / route guard)
 *   • member_memberships            -> EXPERIENCE (what was purchased, billing
 *                                      cadence, status, journey state, cohort)
 *
 * All reads are best-effort: anonymous sessions (public preview) resolve to a
 * safe default so the app always renders.
 */

export type MembershipType = "monday_installation" | "business_week"
export type Experience = "make_time_for_more_mondays" | "work_life_balance_business_week"
export type BillingType = "single_pass" | "monthly"
export type MembershipStatus = "active" | "expired" | "cancelled" | "paused" | "trial"
export type MemberState =
  | "onboarding"
  | "sunday_design_day"
  | "monday_installation"
  | "business_week"
  | "time_freedom"
  | "completed_cycle"
export type PaymentProvider = "stripe" | "samcart" | "manual" | "comp"

export interface MembershipRecord {
  id: string
  membershipType: MembershipType
  experience: Experience
  billingType: BillingType
  status: MembershipStatus
  accessLevel: AccessLevel
  memberState: MemberState
  startedAt: string | null
  expiresAt: string | null
  renewalDate: string | null
  autoRenew: boolean
  paymentProvider: PaymentProvider | null
  paymentReference: string | null
  planVersion: number
  cohort: string | null
}

/** Human-friendly experience name for Cherry Blossom and heroes. */
export const EXPERIENCE_LABEL: Record<Experience, string> = {
  make_time_for_more_mondays: "Make Time For More On Mondays™",
  work_life_balance_business_week: "Work-Life Balance Business Week™",
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

function mapRow(row: Record<string, unknown> | null): MembershipRecord | null {
  if (!row) return null
  return {
    id: row.id as string,
    membershipType: (row.membership_type as MembershipType) ?? "monday_installation",
    experience: (row.experience as Experience) ?? "make_time_for_more_mondays",
    billingType: (row.billing_type as BillingType) ?? "single_pass",
    status: (row.status as MembershipStatus) ?? "active",
    accessLevel: (row.access_level as AccessLevel) ?? "monday",
    memberState: (row.member_state as MemberState) ?? "onboarding",
    startedAt: (row.started_at as string) ?? null,
    expiresAt: (row.expires_at as string) ?? null,
    renewalDate: (row.renewal_date as string) ?? null,
    autoRenew: Boolean(row.auto_renew),
    paymentProvider: (row.payment_provider as PaymentProvider) ?? null,
    paymentReference: (row.payment_reference as string) ?? null,
    planVersion: (row.plan_version as number) ?? 1,
    cohort: (row.cohort as string) ?? null,
  }
}

/**
 * Loads the member's ACTIVE membership record, or null if none exists (or the
 * member is anonymous). This is the experience layer Cherry Blossom reads.
 */
export async function getActiveMembership(): Promise<MembershipRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("member_memberships")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getActiveMembership skipped:", (error as Error)?.message)
    return null
  }
}

/**
 * Maps a legacy user_profiles.membership_tier value onto a coarse access level,
 * used as a backward-compatible fallback when a member has no member_memberships
 * row yet. Broader legacy tiers unlock the full Business Week.
 */
export function accessLevelFromTier(tier: string | null | undefined): AccessLevel {
  if (!tier) return "monday"
  const businessWeekTiers = new Set([
    "business_week",
    "7_day",
    "21_day",
    "monthly",
    "annual",
    "premium",
    "vip",
  ])
  if (businessWeekTiers.has(tier)) return "business_week"
  // 'monday', 'monday_only', 'free', anything unknown → Monday access
  return "monday"
}

/**
 * Resolves the member's effective access level for day-gating. Prefers the
 * active member_memberships record; falls back to the legacy membership_tier so
 * existing members keep working before the memberships table is populated.
 * Anonymous sessions default to the fullest experience for public previews.
 */
export async function resolveAccessLevel(): Promise<AccessLevel> {
  const userId = await getUserId()
  if (!userId) return "business_week" // public preview sees the full journey

  const membership = await getActiveMembership()
  if (membership) return membership.accessLevel

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("user_profiles")
      .select("membership_tier")
      .eq("id", userId)
      .maybeSingle()
    return accessLevelFromTier((data?.membership_tier as string) ?? null)
  } catch (error) {
    console.log("[v0] resolveAccessLevel fallback skipped:", (error as Error)?.message)
    return "monday"
  }
}

/**
 * Updates the member's journey state (member_state) on their active membership.
 * Best-effort; safe to call as the member moves through the weekly rhythm.
 */
export async function setMemberState(state: MemberState): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    await supabase
      .from("member_memberships")
      .update({ member_state: state, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("status", "active")
  } catch (error) {
    console.log("[v0] setMemberState skipped:", (error as Error)?.message)
  }
}
