import { createAdminClient } from "@/lib/supabase/admin"

export const MONTHLY_BOUNDARY_ENTITLEMENT = "monthly_boundary_focus"

export type EntitlementStatus = "active" | "past_due" | "canceled" | "refunded" | "expired"

/**
 * The Monthly Cycle Membership Fee and its payment product are not finalized.
 * Until they are, nothing in the payment pipeline calls these helpers, so no
 * participant can gain access. Wire them into the verified payment webhook once
 * the product exists; both helpers are idempotent on (source, sourceRef) so
 * duplicate payment notifications are safe.
 */
export async function grantMonthlyBoundaryEntitlement(input: {
  userId: string
  source: string
  sourceRef: string
  expiresAt?: string | null
}) {
  const admin = createAdminClient()
  const { error } = await admin.from("member_entitlements").upsert(
    {
      user_id: input.userId,
      entitlement: MONTHLY_BOUNDARY_ENTITLEMENT,
      status: "active",
      source: input.source,
      source_ref: input.sourceRef,
      expires_at: input.expiresAt ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,entitlement" },
  )
  if (error) throw new Error(`Failed to grant monthly boundary entitlement: ${error.message}`)
}

export async function setMonthlyBoundaryEntitlementStatus(input: {
  userId: string
  status: Exclude<EntitlementStatus, "active">
}) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("member_entitlements")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("user_id", input.userId)
    .eq("entitlement", MONTHLY_BOUNDARY_ENTITLEMENT)
  if (error) throw new Error(`Failed to update monthly boundary entitlement: ${error.message}`)
}
