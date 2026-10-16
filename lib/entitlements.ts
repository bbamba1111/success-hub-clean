/**
 * Provider-agnostic entitlements.
 *
 * The Success Hub asks ONE question — "what is this member entitled to?" — and
 * never asks "how did they pay?". Entitlements are derived from the member's
 * profile, so the answer is identical whether the subscription was created by
 * SamCart or Stripe.
 */
import { createClient } from "@/lib/supabase/server"
import type { Entitlements, MembershipTier, SubscriptionStatus } from "@/lib/payments/types"

const KNOWN_TIERS: MembershipTier[] = ["free", "essentials", "premium", "vip"]

function normalizeTier(raw: unknown): MembershipTier {
  if (typeof raw === "string") {
    const lower = raw.toLowerCase()
    const match = KNOWN_TIERS.find((t) => lower.includes(t))
    if (match) return match
    // A non-empty, non-free product name means they bought *something*.
    if (lower.trim().length > 0) return "essentials"
  }
  return "free"
}

/** Reads the signed-in member's entitlements. Returns a free/none default when anonymous. */
export async function getEntitlements(): Promise<Entitlements> {
  const fallback: Entitlements = { active: false, tier: "free", status: "none", provider: null }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return fallback

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("membership_tier")
      .eq("id", user.id)
      .maybeSingle()

    const tier = normalizeTier(profile?.membership_tier)
    const active = tier !== "free"
    const status: SubscriptionStatus = active ? "active" : "none"

    // Provider is not persisted per-user in Phase 1; entitlements stay
    // provider-agnostic by design.
    return { active, tier, status, provider: null }
  } catch (error) {
    console.error("[v0] getEntitlements failed:", error)
    return fallback
  }
}
