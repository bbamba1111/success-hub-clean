/**
 * Business Operating Fingerprint™ — derivation (Phase 9A)
 * ---------------------------------------------------------------------------
 * Pure function: (Business Context Profile™, Founder Destination™, Business
 * Stage™, optional Business Model Profile™) → BusinessOperatingFingerprint.
 * No storage reads, no side effects. `businessStage` is taken as an input
 * rather than recomputed — the Harmony Context Provider
 * (`components/harmony-context/harmony-context-provider.tsx`) already calls
 * `deriveBusinessStage()` and exposes the canonical value; this module never
 * re-derives it.
 */

import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { BusinessModelProfile } from "@/lib/business-model-classification/types"
import { hasBusinessAmbitionSignal, hasFutureWorkplaceSignal } from "@/lib/excellence-intelligence/readiness"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import type { BusinessOperatingFingerprint } from "./types"

export interface DeriveBusinessOperatingFingerprintInput {
  businessContext: BusinessContextProfile | null
  founderDestination: FounderDestinationProfile | null
  businessStage: BusinessStage
  /** From `classifyBusinessModel()` (Phase 9B) — optional, omitted fields fall back to "unknown". */
  businessModelProfile?: BusinessModelProfile | null
}

function orUnknown<T>(value: T | undefined | null): T | "unknown" {
  return value === undefined || value === null ? "unknown" : value
}

function arrayOrUnknown<T>(value: T[] | undefined | null): T[] | "unknown" {
  return !value || value.length === 0 ? "unknown" : value
}

/**
 * Derives the Business Operating Fingerprint™. `businessContext` and
 * `founderDestination` may be null (a founder who hasn't completed those
 * profiles yet) — every dependent field falls back to `"unknown"` rather
 * than a guess. `businessStage` is always known because
 * `deriveBusinessStage()` already defaults it.
 */
export function deriveBusinessOperatingFingerprint(
  input: DeriveBusinessOperatingFingerprintInput,
): BusinessOperatingFingerprint {
  const { businessContext: bc, founderDestination: fd, businessStage, businessModelProfile: bmp } = input

  return {
    generatedAt: new Date().toISOString(),

    // BUSINESS
    businessStage,
    businessName: orUnknown(bc?.businessName),
    industry: orUnknown(bc?.industry),
    founderRole: orUnknown(bc?.founderRole),
    teamSize: orUnknown(bc?.teamSize),
    revenueStage: orUnknown(bc?.revenueStage),

    // OPERATING MODEL (Phase 9B)
    primaryArchetype: bmp?.primaryArchetype ?? "unknown",
    secondaryArchetypes: bmp?.secondaryArchetypes ?? [],
    customerModel: bmp?.customerModel ?? "unknown",
    revenueModel: bmp?.revenueModel ?? "unknown",
    deliveryModel: bmp?.deliveryModel ?? "unknown",
    acquisitionModel: bmp?.acquisitionModel ?? "unknown",
    scaleMechanism: bmp?.scaleMechanism ?? "unknown",
    founderDependency: bmp?.founderDependency ?? "unknown",

    // GROWTH
    biggestGoals: arrayOrUnknown(bc?.biggestGoals),
    biggestChallenges: arrayOrUnknown(bc?.biggestChallenges),
    capitalStrategy: arrayOrUnknown(bc?.capitalStrategy),
    growthVision: orUnknown(bc?.growthVision),
    exitVision: orUnknown(bc?.exitVision),

    // DESTINATION
    desiredFounderRole: orUnknown(fd?.desiredFounderRole),
    desiredFounderIndependence: orUnknown(fd?.desiredFounderIndependence),
    desiredFounderInvolvement: orUnknown(fd?.desiredFounderInvolvement),
    revenueAmbition: orUnknown(fd?.revenueAmbition),
    desiredTeamSize: orUnknown(fd?.desiredTeamSize),
    hasBusinessAmbitionSignal: fd ? hasBusinessAmbitionSignal(fd) : false,

    // FUTURE WORKPLACE
    desiredWorkplaceType: orUnknown(fd?.desiredWorkplaceType),
    desiredAiHumanRelationship: orUnknown(fd?.desiredAiHumanRelationship),
    desiredHumanSustainabilityStandard: orUnknown(fd?.desiredHumanSustainabilityStandard),
    hasFutureWorkplaceSignal: fd ? hasFutureWorkplaceSignal(fd) : false,
  }
}
