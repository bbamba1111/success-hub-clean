"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  isGrantableEntitlement,
  isMembershipTier,
  type AdminActionResult,
  type MemberAccessRow,
} from "@/lib/admin/member-access"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Every mutation re-verifies the caller server-side; the UI gate alone is never trusted. */
async function requirePlatformAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).maybeSingle()
  return profile?.role === "platform_admin" ? user : null
}

export async function listMembersForAdmin(): Promise<MemberAccessRow[] | null> {
  const adminUser = await requirePlatformAdmin()
  if (!adminUser) return null

  const admin = createAdminClient()
  const emails = new Map<string, { email: string; createdAt: string }>()
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(`Failed to list users: ${error.message}`)
    for (const u of data.users) emails.set(u.id, { email: u.email ?? "", createdAt: u.created_at })
    if (data.users.length < 1000) break
  }

  const [{ data: profiles, error: profileError }, { data: entitlements, error: entitlementError }] = await Promise.all([
    admin.from("user_profiles").select("id, full_name, role, membership_tier"),
    admin.from("member_entitlements").select("user_id, entitlement, status, source"),
  ])
  if (profileError) throw new Error(`Failed to load profiles: ${profileError.message}`)
  if (entitlementError) throw new Error(`Failed to load entitlements: ${entitlementError.message}`)

  const profileById = new Map((profiles ?? []).map((p) => [p.id as string, p]))
  const entitlementsByUser = new Map<string, MemberAccessRow["entitlements"]>()
  for (const e of entitlements ?? []) {
    const bucket = entitlementsByUser.get(e.user_id) ?? {}
    bucket[e.entitlement] = { status: e.status, source: e.source }
    entitlementsByUser.set(e.user_id, bucket)
  }

  return [...emails.entries()]
    .map(([id, auth]) => {
      const profile = profileById.get(id)
      return {
        id,
        email: auth.email,
        fullName: (profile?.full_name as string | null) ?? null,
        role: (profile?.role as string | null) ?? null,
        membershipTier: (profile?.membership_tier as string | null) ?? null,
        createdAt: auth.createdAt,
        entitlements: entitlementsByUser.get(id) ?? {},
      }
    })
    .sort((a, b) => a.email.localeCompare(b.email))
}

export async function setMemberEntitlement(input: {
  userId: string
  entitlement: string
  active: boolean
}): Promise<AdminActionResult> {
  const adminUser = await requirePlatformAdmin()
  if (!adminUser) return { ok: false, error: "Not authorized" }
  if (!UUID_PATTERN.test(input.userId)) return { ok: false, error: "Invalid member" }
  if (!isGrantableEntitlement(input.entitlement)) return { ok: false, error: "Unknown access type" }

  const admin = createAdminClient()
  const now = new Date().toISOString()

  if (input.active) {
    const { data: existing } = await admin
      .from("member_entitlements")
      .select("source")
      .eq("user_id", input.userId)
      .eq("entitlement", input.entitlement)
      .maybeSingle()

    // Re-activating a paid entitlement keeps its payment source; otherwise mark it as an admin grant.
    const keepsPaymentSource = existing?.source && existing.source !== "admin_grant" && existing.source !== "complimentary"
    const { error } = await admin.from("member_entitlements").upsert(
      {
        user_id: input.userId,
        entitlement: input.entitlement,
        status: "active",
        source: keepsPaymentSource ? existing.source : "admin_grant",
        source_ref: keepsPaymentSource ? undefined : `admin:${adminUser.id}:${input.userId}:${input.entitlement}`,
        expires_at: null,
        updated_at: now,
      },
      { onConflict: "user_id,entitlement" },
    )
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await admin
      .from("member_entitlements")
      .update({ status: "canceled", updated_at: now })
      .eq("user_id", input.userId)
      .eq("entitlement", input.entitlement)
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath("/admin/members")
  return { ok: true }
}

export async function setMemberTier(input: { userId: string; tier: string }): Promise<AdminActionResult> {
  const adminUser = await requirePlatformAdmin()
  if (!adminUser) return { ok: false, error: "Not authorized" }
  if (!UUID_PATTERN.test(input.userId)) return { ok: false, error: "Invalid member" }
  if (!isMembershipTier(input.tier)) return { ok: false, error: "Unknown membership tier" }

  const admin = createAdminClient()
  const { error } = await admin
    .from("user_profiles")
    .update({ membership_tier: input.tier, updated_at: new Date().toISOString() })
    .eq("id", input.userId)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/admin/members")
  return { ok: true }
}
