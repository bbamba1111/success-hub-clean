/**
 * Plan catalog + active-provider selection.
 *
 * Phase 1 uses placeholder pricing and copy. The active provider is chosen by
 * the PAYMENT_PROVIDER env var (defaults to "samcart"), so launching on
 * SamCart today and migrating to Stripe later is a config change, not a
 * rewrite.
 */
import type { Plan, PaymentProviderId } from "./types"

/** Which provider is live. Defaults to SamCart for Phase 1. */
export function getActiveProviderId(): PaymentProviderId {
  const raw = (process.env.PAYMENT_PROVIDER ?? process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "samcart").toLowerCase()
  return raw === "stripe" ? "stripe" : "samcart"
}

/** The membership experiences shown on the public marketing site (placeholder copy). */
export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Membership",
    tagline: "Live the Work-Life Balance Business Day™, one month at a time.",
    priceLabel: "$97",
    billingLabel: "per month",
    tier: "essentials",
    features: [
      "Full access to the daily Work-Life Balance Business Day™",
      "Weekly Reality Check™ + Results Dashboard",
      "Cherry Blossom™ AI coaching",
      "Live community rooms & replays",
    ],
  },
  {
    id: "annual",
    name: "Annual Membership",
    tagline: "Commit to a full year of intentional living and save.",
    priceLabel: "$970",
    billingLabel: "per year",
    tier: "premium",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Monthly",
      "Two months free vs. monthly",
      "Seasonal planning intensives",
      "Priority access to new experiences",
    ],
  },
  {
    id: "vip",
    name: "VIP Inner Circle",
    tagline: "White-glove guidance for leaders who want more, faster.",
    priceLabel: "$497",
    billingLabel: "per month",
    tier: "vip",
    badge: "Concierge",
    features: [
      "Everything in Annual",
      "Personalized coaching touchpoints",
      "Concierge onboarding",
      "Corporate & team licensing options",
    ],
  },
]

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId)
}
