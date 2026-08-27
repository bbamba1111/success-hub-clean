/**
 * Business Blueprint™ — activation rules
 * ---------------------------------------------------------------------------
 * The one rule genuinely missing from the existing architecture: a gate that
 * can actually produce `BlueprintRequirementTiming = "not-applicable"`.
 *
 * Today, `businessModelFitFor()` in `readiness-relevance.ts` checks
 * `capability.businessModels` against only `businessModelProfile.primaryArchetype`
 * and its result (`"strong-fit" | "neutral" | "possible-mismatch"`) is
 * advisory only — attached for display, never removing a capability from the
 * pool or changing its status. And `capability.applicableCharacteristics`
 * (Phase 9B/9C's `customerModel`/`revenueModel`/`deliveryModel`/
 * `acquisitionModel` hook) is declared on the type but read nowhere in the
 * codebase and populated on zero of the seeded capabilities — a schema hook,
 * not a working rule.
 *
 * This module does NOT touch `businessModelFitFor()` or
 * `deriveReadinessRelevance()`. It adds the missing gate as a separate, pure
 * function that `derive-requirements.ts` applies on top of that function's
 * output.
 */

import type { ReadinessCapability } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import type { ReadinessRelevanceStatus } from "@/lib/founder-intelligence/readiness-relevance"
import type { BusinessModelProfile } from "@/lib/business-model-classification/types"
import type { BlueprintRequirementTiming } from "./types"

export interface CapabilityApplicability {
  applicable: boolean
  /** Plain-language reason — always derivable from the fields checked, never invented. */
  reason: string
}

/**
 * Whether a capability applies to the founder's business model(s) at all.
 *
 * Unlike `businessModelFitFor()`, this composes across BOTH
 * `primaryArchetype` AND `secondaryArchetypes` (union) — matching the
 * approved "characteristics compose across ALL detected archetypes" rule,
 * and the one place this function deliberately improves on the existing
 * primary-only check rather than duplicating it.
 *
 * A capability is `not-applicable` only when ALL of the following hold:
 *   1. `capability.businessModels !== "all"`
 *   2. none of the founder's archetypes (primary + secondary) appear in it
 *   3. IF `capability.applicableCharacteristics` is set, none of its listed
 *      characteristic values match the founder's classified
 *      customer/revenue/delivery/acquisition model either.
 *
 * Absence of `applicableCharacteristics` never gates on its own — matches
 * the field's existing doc comment ("absence means the capability applies
 * regardless of operating characteristics"). A missing/unknown
 * `businessModelProfile` never marks anything not-applicable — this gate
 * only ever removes capabilities from the pool on a positive, evidenced
 * mismatch, never from absent data.
 */
export function isCapabilityApplicable(
  capability: ReadinessCapability,
  businessModelProfile: BusinessModelProfile | null | undefined,
): CapabilityApplicability {
  if (capability.businessModels === "all") {
    return { applicable: true, reason: "Applies to all Business Models™." }
  }

  if (!businessModelProfile) {
    return { applicable: true, reason: "No Business Model Profile™ signal yet — never gated on absent data." }
  }

  const founderArchetypes = [
    ...(businessModelProfile.primaryArchetype !== "unknown" ? [businessModelProfile.primaryArchetype] : []),
    ...businessModelProfile.secondaryArchetypes,
  ]

  const archetypeMatches = founderArchetypes.some((id) => capability.businessModels.includes(id))
  if (archetypeMatches) {
    return { applicable: true, reason: "Matches the founder's classified Business Model™ archetype." }
  }

  if (founderArchetypes.length === 0) {
    return { applicable: true, reason: "Business Model™ archetype not yet classified — never gated on absent data." }
  }

  const characteristics = capability.applicableCharacteristics
  if (!characteristics) {
    return {
      applicable: false,
      reason: "None of the founder's Business Model™ archetypes match this capability's declared businessModels.",
    }
  }

  const characteristicMatches = [
    matchesCharacteristic(characteristics.customerModel, businessModelProfile.customerModel),
    matchesCharacteristic(characteristics.revenueModel, businessModelProfile.revenueModel),
    matchesCharacteristic(characteristics.deliveryModel, businessModelProfile.deliveryModel),
    matchesCharacteristic(characteristics.acquisitionModel, businessModelProfile.acquisitionModel),
  ].some(Boolean)

  if (characteristicMatches) {
    return {
      applicable: true,
      reason: "Matches the founder's classified operating characteristics (Business Model Profile™).",
    }
  }

  return {
    applicable: false,
    reason:
      "Neither the founder's Business Model™ archetypes nor their classified operating characteristics match this capability.",
  }
}

/** True when any value in `declared` (if set) appears in `founderValues` (if known). */
function matchesCharacteristic<T extends string>(
  declared: T[] | undefined,
  founderValues: T[] | "unknown",
): boolean {
  if (!declared || declared.length === 0) return false
  if (founderValues === "unknown") return false
  return declared.some((value) => founderValues.includes(value))
}

/**
 * Maps a capability's existing `ReadinessRelevanceStatus` plus the new
 * applicability gate onto `BlueprintRequirementTiming`. Deliberately thin —
 * all real reasoning already happened in `isCapabilityApplicable()` and
 * `deriveReadinessRelevance()`; this is a deterministic lookup, not a new
 * rule.
 */
export function deriveRequirementTiming(
  relevanceStatus: ReadinessRelevanceStatus,
  applicability: CapabilityApplicability,
): BlueprintRequirementTiming {
  if (!applicability.applicable) return "not-applicable"
  if (relevanceStatus === "emerging") return "future"
  return "current"
}
