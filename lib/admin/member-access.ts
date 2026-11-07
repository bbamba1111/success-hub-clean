export const GRANTABLE_ENTITLEMENTS = [
  {
    id: "monthly_boundary_focus",
    label: "Monthly Business Boundary Focus™",
    description: "Choose, confirm and save one Business Boundary per 30-day cycle.",
  },
] as const

// Names only — pricing lives in lib/payments/config.ts so offers can be
// repriced without touching tier labels or access logic.
export const MEMBERSHIP_TIERS = [
  { value: "free", label: "Free" },
  { value: "reality_check", label: "Weekly Work-Life Balance Reality Check™" },
  { value: "monday_only", label: "Make Time For More™ On Mondays" },
  { value: "business_week", label: "The Work-Life Balance Business Week™" },
  { value: "monthly_member", label: "Monthly Business Boundary Builder™" },
  { value: "premium_member", label: "Premium Member" },
] as const

// Older values still held by existing members. Kept readable so their records
// are preserved, but not offered as new assignments.
export const LEGACY_MEMBERSHIP_TIERS = ["7_day", "21_day", "monthly", "annual", "premium"] as const

export type EntitlementId = (typeof GRANTABLE_ENTITLEMENTS)[number]["id"]
export type MembershipTierValue = (typeof MEMBERSHIP_TIERS)[number]["value"]

export function membershipTierLabel(value: string | null): string {
  if (!value) return "Not set"
  const tier = MEMBERSHIP_TIERS.find((t) => t.value === value)
  if (tier) return tier.label
  return `Legacy: ${value}`
}

export type MemberAccessRow = {
  id: string
  email: string
  fullName: string | null
  role: string | null
  membershipTier: string | null
  createdAt: string | null
  entitlements: Record<string, { status: string; source: string | null }>
}

export type AdminActionResult = { ok: true } | { ok: false; error: string }

export function isGrantableEntitlement(value: string): value is EntitlementId {
  return GRANTABLE_ENTITLEMENTS.some((e) => e.id === value)
}

export function isMembershipTier(value: string): value is MembershipTierValue {
  return MEMBERSHIP_TIERS.some((t) => t.value === value)
}
