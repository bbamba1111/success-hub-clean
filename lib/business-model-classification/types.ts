/**
 * Business Model Classification™ — types (Phase 9B)
 * ---------------------------------------------------------------------------
 * Business Model Classification™ takes the archetype(s) a founder already
 * selected in their Business Context Profile™ (the 12 loose
 * `BusinessModelOption` strings in `lib/business-context/types.ts`) and
 * resolves them onto the canonical `BusinessModelId` vocabulary already
 * defined in `lib/entrepreneur-success/types.ts` — the SAME vocabulary
 * `ReadinessCapability.businessModels` already references. No new archetype
 * list is invented here.
 *
 * On top of the archetype, this module derives the OPERATING CHARACTERISTICS
 * that actually determine which capabilities and guidance matter — because
 * two founders who both selected "coaching" can have very different
 * customer, revenue, delivery, acquisition, and scale realities. Every
 * characteristic is a plain, explicit registry (never a magic number), and
 * every profile is honest about its own `confidence` and `evidence` — a
 * characteristic with no supporting signal is always `"unknown"`, never
 * guessed.
 */

import type { BusinessModelId } from "@/lib/entrepreneur-success/types"

export type ConfidenceLevel = "low" | "medium" | "high"

/** Who the business primarily transacts with. */
export type CustomerModelId = "b2b" | "b2c" | "b2b2c" | "marketplace-two-sided"

/** How the business is paid. */
export type RevenueModelId =
  | "one-time"
  | "recurring-subscription"
  | "recurring-retainer"
  | "usage-based"
  | "commission-take-rate"
  | "hybrid"

/** How the offer actually reaches the customer. */
export type DeliveryModelId =
  | "high-touch-custom"
  | "productized-service"
  | "self-serve-software"
  | "done-for-you"
  | "hybrid-touch"

/** How new customers are primarily found. */
export type AcquisitionModelId =
  | "outbound-sales"
  | "inbound-content"
  | "referral-network"
  | "paid-acquisition"
  | "marketplace-discovery"
  | "partnership-channel"

/** What the business scales BY — the dominant lever that lets output grow faster than founder hours. */
export type ScaleMechanismId = "people-leverage" | "systems-leverage" | "product-leverage" | "capital-leverage"

/** How dependent day-to-day operation still is on the founder personally. */
export type FounderDependencyLevel =
  | "fully-dependent"
  | "mostly-dependent"
  | "partially-independent"
  | "largely-independent"

/**
 * The derived Business Model Profile™. `secondaryArchetypes` supports
 * businesses that are genuinely a blend (e.g. B2B consulting + education) —
 * characteristics compose across ALL detected archetypes, not just the
 * primary one, so an unusual or hybrid business still gets a useful partial
 * classification instead of being forced into a single ill-fitting bucket.
 */
export interface BusinessModelProfile {
  generatedAt: string
  primaryArchetype: BusinessModelId | "unknown"
  secondaryArchetypes: BusinessModelId[]
  customerModel: CustomerModelId[] | "unknown"
  revenueModel: RevenueModelId[] | "unknown"
  deliveryModel: DeliveryModelId[] | "unknown"
  acquisitionModel: AcquisitionModelId[] | "unknown"
  scaleMechanism: ScaleMechanismId[] | "unknown"
  founderDependency: FounderDependencyLevel | "unknown"
  confidence: ConfidenceLevel
  /** Plain-language reasons for the classification above — no source-worship, no hidden scoring. */
  evidence: string[]
}
