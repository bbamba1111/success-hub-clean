/**
 * Founder GPS™ → Business Asset Library™ recommendation link (Decision 1).
 *
 * Deliberately NOT a new recommendation engine. This is a small, hand-authored
 * map from a handful of Readiness Capability™ ids (the existing Founder
 * Intelligence™ / Excellence Intelligence™ registry — see
 * `lib/excellence-intelligence/excellence-intelligence-registry.ts`) to the
 * one Business Asset™ that most directly builds that capability, where a
 * real match exists. Most capabilities have no asset — that's expected and
 * handled gracefully by the caller.
 */

import { getBusinessAsset, type BusinessAsset } from "./business-asset-registry"
import type { GpsRecommendation } from "@/lib/founder-gps/types"

/**
 * readinessCapabilityId → Business Asset id. Only capabilities with a real,
 * honest match are listed here.
 */
const CAPABILITY_TO_ASSET_ID: Record<string, string> = {
  "start-customer-clarity": "ideal-client-compass",
  "start-offer-clarity": "offer-design-canvas",
  "start-pricing-clarity": "revenue-model",
  "start-foundational-operating-rhythm": "sop-playbook-template",
  "growth-sop-before-hiring": "sop-playbook-template",
  "growth-delegation-capacity": "accountability-map",
  "growth-financial-visibility": "business-scorecard",
  "scale-org-design": "hiring-plan",
  "scale-leadership-depth": "role-scorecard",
}

/**
 * Given the founder's current Next Best Move™ (or null if the GPS hasn't
 * produced one yet), returns the Business Asset™ that best builds the
 * capability behind it — or null if this recommendation has no asset match,
 * in which case the caller should point the founder back to Founder GPS™
 * instead.
 */
export function getRecommendedBusinessAsset(rec: GpsRecommendation | null | undefined): BusinessAsset | null {
  if (!rec?.readinessCapabilityId) return null
  const assetId = CAPABILITY_TO_ASSET_ID[rec.readinessCapabilityId]
  if (!assetId) return null
  return getBusinessAsset(assetId) ?? null
}
