/**
 * The single source of truth for the product ladder.
 *
 * There are exactly three public levels a member can buy, plus one internal
 * (by-application) step:
 *
 *   1. The Redesign™               — $497    (redesign)
 *   2. Work-Life Balance Business Day™  — $1,997  (business-day)   ← start here
 *   3. Work-Life Balance Business Week™ — $3,997  (business-week)
 *   —  30/60/90 Installation™       — by application (installation, internal)
 *
 * Checkout runs on Paperbell. Each level carries its own spec-locked Paperbell
 * checkout URL — these links must never be replaced or regenerated. The
 * Business Day (package 234456) and Business Week (package 234458) links are
 * live today; the Redesign link is not configured yet (empty string).
 */
import type { Plan, PaymentProviderId } from "./types"

/**
 * Which provider is live. Paperbell is the confirmed checkout path (buyers are
 * redirected to per-level Paperbell URLs). The SamCart/Stripe abstraction is
 * retained only for the webhook/entitlement layer.
 */
export function getActiveProviderId(): PaymentProviderId {
  const raw = (process.env.PAYMENT_PROVIDER ?? process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "samcart").toLowerCase()
  return raw === "stripe" ? "stripe" : "samcart"
}

/** Spec-locked Paperbell checkout links. Never replace or regenerate these. */
const PAPERBELL_BUSINESS_DAY = "https://app.paperbell.com/checkout/packages/234456"
const PAPERBELL_BUSINESS_WEEK = "https://app.paperbell.com/checkout/packages/234458"

/** The full product ladder, ordered from entry point to deepest immersion. */
export const PLANS: Plan[] = [
  {
    id: "redesign",
    level: "redesign",
    name: "The Redesign™",
    tagline: "See your real day clearly, then redesign it — your entry into Harmony Lane™.",
    priceLabel: "$497",
    billingLabel: "one-time",
    tier: "essentials",
    features: [
      "The Work-Life Balance Reality Check™",
      "Your personalized Reality Check Report",
      "The Sunday Guided Tour of Harmony Lane™",
      "Your redesigned Work-Life Balance Business Day™ blueprint",
    ],
    // TODO: add the live Paperbell checkout URL for the $497 Redesign level.
    checkoutUrl: "",
  },
  {
    id: "business-day",
    level: "business-day",
    name: "Work-Life Balance Business Day™",
    tagline: "Live one fully guided, redesigned business day — in real time.",
    priceLabel: "$1,997",
    billingLabel: "one-time",
    tier: "premium",
    highlighted: true,
    badge: "Start Here",
    features: [
      "Everything in The Redesign™",
      "The full Work-Life Balance Business Day™, lived in real time",
      "Cherry Blossom™ AI coaching throughout the day",
      "Your Results Dashboard + end-of-day debrief",
    ],
    checkoutUrl: PAPERBELL_BUSINESS_DAY,
  },
  {
    id: "business-week",
    level: "business-week",
    name: "Work-Life Balance Business Week™",
    tagline: "Extend the immersion beyond one day into a full weekly rhythm.",
    priceLabel: "$3,997",
    billingLabel: "one-time",
    tier: "vip",
    badge: "Go Deeper",
    features: [
      "Everything in the Business Day™",
      "Four guided Work-Life Balance days + three Time Freedom™ days",
      "The full weekly operating loop and boundary rhythm",
      "Priority access to seasonal planning intensives",
    ],
    checkoutUrl: PAPERBELL_BUSINESS_WEEK,
  },
  {
    id: "installation",
    level: "installation",
    name: "30 / 60 / 90 Installation™",
    tagline: "Install the model into your business over a full quarter.",
    priceLabel: "By application",
    billingLabel: "",
    tier: "vip",
    badge: "By Application",
    internal: true,
    features: [
      "Everything in the Business Week™",
      "A 30/60/90-day guided installation of the operating model",
      "Direct, high-touch guidance across the quarter",
      "Team & corporate licensing options",
    ],
  },
]

/** Only the levels shown on the public marketing site (excludes internal steps). */
export const PUBLIC_PLANS: Plan[] = PLANS.filter((p) => !p.internal)

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId)
}

export function getPlanByLevel(level: Plan["level"]): Plan | undefined {
  return PLANS.find((p) => p.level === level)
}
