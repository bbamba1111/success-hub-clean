/**
 * Business Resource Intelligence™ — seed registry (Phase 10)
 * ---------------------------------------------------------------------------
 * Only resources this product's own stack already implies — never a vendor
 * catalog. Each entry corresponds to a real, verifiable integration already
 * present in this codebase (`package.json`, `lib/supabase/`, Stripe checkout
 * flows, `resend`, the OpenAI-backed AI features, and the community calendar
 * feature) — not third-party sourcing.
 */

import type { ResourceRecord } from "./types"

export const RESOURCE_REGISTRY: ResourceRecord[] = [
  {
    id: "resource-supabase",
    category: "database-and-backend",
    name: "Supabase (already connected)",
    description:
      "The database and authentication backend this product already runs on. Any build that needs to persist or query founder/business data can extend this rather than standing up a new backend.",
    businessModels: "all",
    businessStages: "all",
    capabilitiesSupported: [
      "start-foundational-operating-rhythm",
      "growth-financial-visibility",
      "scale-org-design",
    ],
    status: "connected",
  },
  {
    id: "resource-stripe",
    category: "payments-and-billing",
    name: "Stripe (already connected)",
    description:
      "The payments/billing provider already wired into this product's checkout flows. Covers pricing changes, new offers, or recurring billing without buying a separate payments tool.",
    businessModels: "all",
    businessStages: "all",
    capabilitiesSupported: ["start-pricing-clarity", "growth-financial-visibility"],
    status: "connected",
  },
  {
    id: "resource-resend",
    category: "transactional-email",
    name: "Resend (already connected)",
    description:
      "The transactional email provider already used by this product. Covers founder-facing notifications or lifecycle emails a build might need, without a new email vendor.",
    businessModels: "all",
    businessStages: "all",
    capabilitiesSupported: ["start-foundational-operating-rhythm", "start-customer-clarity"],
    status: "connected",
  },
  {
    id: "resource-ai-sdk",
    category: "ai-and-automation",
    name: "In-app AI (already connected)",
    description:
      "The AI capability already available in-app (OpenAI-backed). Covers AI-Build™ and Co-Build™ Build Path™ outputs already documented as `aiProducibleOutputs` in the founder's Build Blueprint™ — nothing new to procure.",
    businessModels: "all",
    businessStages: "all",
    capabilitiesSupported: ["growth-ai-workflow-adoption", "future-workplace-ai-human-collaboration"],
    status: "connected",
  },
  {
    id: "resource-community-calendar",
    category: "community-and-scheduling",
    name: "Community calendar/events (already connected)",
    description:
      "This product's own community scheduling feature. Covers coordination or scheduling needs a build surfaces before assuming a new calendar tool is required.",
    businessModels: "all",
    businessStages: "all",
    capabilitiesSupported: ["start-foundational-operating-rhythm", "pattern-operating-rhythm"],
    status: "connected",
  },
]
