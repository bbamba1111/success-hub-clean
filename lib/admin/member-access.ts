export const GRANTABLE_ENTITLEMENTS = [
  {
    id: "monthly_boundary_focus",
    label: "Monthly Business Boundary Focus™",
    description: "Choose, confirm and save one Business Boundary per 30-day cycle.",
  },
] as const

export const MEMBERSHIP_TIERS = ["free", "monday_only", "essentials", "premium", "vip"] as const

export type EntitlementId = (typeof GRANTABLE_ENTITLEMENTS)[number]["id"]
export type MembershipTierValue = (typeof MEMBERSHIP_TIERS)[number]

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
  return (MEMBERSHIP_TIERS as readonly string[]).includes(value)
}
