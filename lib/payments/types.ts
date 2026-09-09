/**
 * Provider-agnostic payment + entitlements contracts.
 *
 * The application NEVER imports a specific payment SDK. It only speaks this
 * vocabulary: "start a checkout for a plan" and "what is this member entitled
 * to?". Concrete providers (SamCart today, Stripe later) implement
 * `PaymentProvider` behind `getActiveProvider()`. Swapping providers is a
 * server-side change only — the Success Hub, marketing site, and member
 * experience never change.
 */

/** Membership levels. Kept intentionally simple for Phase 1. */
export type MembershipTier = "free" | "essentials" | "premium" | "vip"

/** Subscription lifecycle, normalized across providers. */
export type SubscriptionStatus = "none" | "active" | "trialing" | "past_due" | "canceled"

/** A purchasable plan / experience shown on the marketing site. */
export interface Plan {
  id: string
  name: string
  tagline: string
  /** Placeholder price copy for Phase 1 (e.g. "$97"). */
  priceLabel: string
  /** e.g. "per month", "per year". */
  billingLabel: string
  tier: Exclude<MembershipTier, "free">
  features: string[]
  highlighted?: boolean
  badge?: string
}

/** What the app asks a provider to do. */
export interface CheckoutRequest {
  planId: string
  email?: string
  successUrl?: string
  cancelUrl?: string
}

/** Providers always resolve to a redirect URL the browser sends the buyer to. */
export interface CheckoutResult {
  url: string
  provider: PaymentProviderId
}

export type PaymentProviderId = "samcart" | "stripe"

/** The single interface every payment provider must implement. */
export interface PaymentProvider {
  id: PaymentProviderId
  createCheckout(plan: Plan, request: CheckoutRequest): Promise<CheckoutResult> | CheckoutResult
}

/**
 * The only payment facts the rest of the app cares about. Derived from the
 * member's profile, independent of which provider created the subscription.
 */
export interface Entitlements {
  active: boolean
  tier: MembershipTier
  status: SubscriptionStatus
  provider: PaymentProviderId | null
}
