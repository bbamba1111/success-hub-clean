/**
 * Business Resource Intelligence™ — types (Phase 10)
 * ---------------------------------------------------------------------------
 * Before a founder chooses hire/outsource/buy/partner for a Build Path™,
 * this module answers one honest question: "of what you ALREADY have, does
 * anything already cover this — even partially?" It is a "use what you have
 * before you buy" checklist, not a vendor marketplace.
 *
 * Still explicitly NOT:
 *   - A vendor/agency/candidate marketplace (no sourcing, no directory of
 *     third parties beyond the founder's own connected stack).
 *   - Autonomous procurement/hiring/contracting.
 *   - Invented pricing — every `ResourceRecord` here describes a resource
 *     this product ITSELF already integrates (Supabase, Stripe, Resend,
 *     OpenAI via the AI SDK) or a category the founder is expected to
 *     already have (a calendar, an inbox) — never a fabricated third-party
 *     vendor or price.
 *
 * Email/Slack/Calendar are documented as typed architecture stubs only
 * (`ExternalChannelStub`) — interfaces + comments, never fake integrations
 * or fabricated monitoring.
 */

import type { BusinessModelId } from "@/lib/entrepreneur-success/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"

/** The category of resource — mirrors how a founder would actually think about "what I already have". */
export type ResourceCategory =
  | "database-and-backend" // Supabase.
  | "payments-and-billing" // Stripe.
  | "transactional-email" // Resend.
  | "ai-and-automation" // OpenAI / AI SDK, used in-app today.
  | "community-and-scheduling" // The product's own community calendar/events feature.
  | "external-channel" // Architecture stub only — email inbox, Slack, calendar (see ExternalChannelStub).

/**
 * One resource the founder may already have access to. Deliberately small —
 * seeded only from this product's own connected stack, not a vendor catalog.
 */
export interface ResourceRecord {
  id: string
  category: ResourceCategory
  name: string
  /** Plain-language description of what this resource actually does today. */
  description: string
  /** Business Model archetypes this resource is relevant for, or `"all"`. */
  businessModels: BusinessModelId[] | "all"
  /** Business Stages this resource is relevant for, or `"all"`. */
  businessStages: BusinessStage[] | "all"
  /** Readiness Capability™ ids (from the Excellence Intelligence registry) this resource can help fulfill. */
  capabilitiesSupported: string[]
  /** Whether this is a real, connected/integrated resource today, or an architecture stub not yet wired up. */
  status: "connected" | "available-not-configured" | "architecture-stub"
}

/**
 * Architecture stub for a future external-channel integration (email inbox,
 * Slack, calendar). No monitoring, polling, or automation exists yet — this
 * type exists purely to document the shape a real integration would take,
 * per the phase's explicit instruction not to fabricate one.
 */
export interface ExternalChannelStub {
  channel: "email" | "slack" | "calendar"
  /** Always false in this phase — never claim a live connection that doesn't exist. */
  connected: false
  /** What this channel WOULD provide once wired up — documentation, not a promise of current behavior. */
  plannedCapability: string
}

export const EXTERNAL_CHANNEL_STUBS: ExternalChannelStub[] = [
  {
    channel: "email",
    connected: false,
    plannedCapability: "Detect founder-attention-needed replies related to an active Build Record™ (not implemented).",
  },
  {
    channel: "slack",
    connected: false,
    plannedCapability: "Post Build Record™ status changes to a founder-chosen channel (not implemented).",
  },
  {
    channel: "calendar",
    connected: false,
    plannedCapability: "Surface Build Record™ milestone target dates on the founder's calendar (not implemented).",
  },
]

/** The result of checking one capability's build against the founder's existing resources. */
export interface ResourceGapAssessment {
  capabilityId: string
  /** Existing resources that already cover this capability, fully or partially. */
  matchingResources: ResourceRecord[]
  /** True when at least one connected (not just available) resource already covers this. */
  alreadyCoveredByExistingStack: boolean
  /** Plain-language recommendation — always derived from `matchingResources`, never invented. */
  recommendation: string
}
