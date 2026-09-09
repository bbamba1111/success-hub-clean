/**
 * Proactive Start, Growth & Scale Readiness™ — derivation (Phase 3)
 * ---------------------------------------------------------------------------
 * A small, PURE, deterministic filter over `READINESS_CAPABILITIES`
 * (`excellence-intelligence-registry.ts`). This is intentionally NOT a
 * scoring engine, NOT AI, and NOT a rewrite of Founder GPS™ — it is the
 * simplest possible answer to "what should be installed now, and what should
 * be installed ahead of need?" so the rule stays explainable at every step.
 *
 * Two inputs only:
 *   1. Business Stage™         — what to install DURING the current stage.
 *   2. Founder Destination™    — whether the founder has already signaled
 *      ambition beyond the current stage, in which case the NEXT stage's
 *      capabilities are surfaced proactively ("build ahead of need").
 *
 * No signal ever REMOVES a capability — Founder Destination™ only ever adds
 * to what Business Stage™ already surfaces.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import {
  getReadinessCapabilitiesByDomain,
  getReadinessCapabilitiesForStage,
  type ReadinessCapability,
} from "@/lib/excellence-intelligence/excellence-intelligence-registry"

/**
 * True when the founder has expressed ambition about the BUSINESS itself
 * (size, team, market position, reach, revenue) beyond a bare minimum —
 * the signal that Growth Readiness™ or Scale Readiness™ should be surfaced
 * a stage early.
 *
 * Exported so `lib/founder-intelligence/readiness-relevance.ts` (Phase 4)
 * can reuse the exact same destination-signal logic instead of re-deriving
 * it — same rule, one source of truth.
 */
export function hasBusinessAmbitionSignal(fd: FounderDestinationProfile): boolean {
  const isSet = (v: string | undefined) => !!v && v !== "undecided"
  return (
    isSet(fd.desiredBusinessSize) ||
    isSet(fd.desiredTeamSize) ||
    isSet(fd.desiredGeographicReach) ||
    isSet(fd.desiredMarketPosition) ||
    isSet(fd.revenueAmbition)
  )
}

/**
 * True when the founder has already expressed intent about the WORKPLACE
 * they want to build — the signal that Future Workplace Readiness™ should be
 * surfaced ahead of Legacy™, at Growth™ or Scale™.
 *
 * Exported for the same reason as `hasBusinessAmbitionSignal` above.
 */
export function hasFutureWorkplaceSignal(fd: FounderDestinationProfile): boolean {
  const isSet = (v: string | undefined) => !!v && v !== "undecided"
  return (
    isSet(fd.desiredWorkplaceType) ||
    isSet(fd.desiredEmployeeExperience) ||
    isSet(fd.desiredWorkDesign) ||
    isSet(fd.desiredAiHumanRelationship) ||
    isSet(fd.desiredLeadershipCulture) ||
    isSet(fd.desiredHumanSustainabilityStandard)
  )
}

export interface DeriveRequiredCapabilitiesInput {
  businessStage: BusinessStage
  founderDestination?: FounderDestinationProfile | null
}

/**
 * deriveRequiredCapabilities — the one function this module exposes.
 *
 * Pure: (Business Stage™, Founder Destination™) → ReadinessCapability[].
 * Deterministic and side-effect-free, so it is trivially testable.
 *
 * Rule:
 *   1. Always include every capability installed DURING the current stage.
 *   2. If the founder has signaled business ambition beyond Launch™ or
 *      Growth™, ALSO include the next domain's capabilities — proactively,
 *      before the stage transition actually happens.
 *   3. If the founder has signaled Future Workplace™ intent at Growth™ or
 *      Scale™, ALSO include Future Workplace Readiness™ capabilities early.
 */
export function deriveRequiredCapabilities(input: DeriveRequiredCapabilitiesInput): ReadinessCapability[] {
  const { businessStage, founderDestination } = input

  const result = new Map<string, ReadinessCapability>()
  for (const capability of getReadinessCapabilitiesForStage(businessStage)) {
    result.set(capability.id, capability)
  }

  if (founderDestination) {
    const ambitious = hasBusinessAmbitionSignal(founderDestination)
    const futureWorkplaceMinded = hasFutureWorkplaceSignal(founderDestination)

    if (businessStage === "launch" && ambitious) {
      for (const capability of getReadinessCapabilitiesByDomain("growth-readiness")) {
        result.set(capability.id, capability)
      }
    }

    if (businessStage === "growth" && ambitious) {
      for (const capability of getReadinessCapabilitiesByDomain("scale-readiness")) {
        result.set(capability.id, capability)
      }
    }

    if ((businessStage === "growth" || businessStage === "scale") && futureWorkplaceMinded) {
      for (const capability of getReadinessCapabilitiesByDomain("future-workplace-readiness")) {
        result.set(capability.id, capability)
      }
    }
  }

  return Array.from(result.values())
}
