/**
 * assessResourceGap — Business Resource Intelligence™ core function.
 * ---------------------------------------------------------------------------
 * Pure, deterministic "use what you have before you buy" check: given a
 * Readiness Capability™ id and the founder's existing resource ids (their
 * own connected stack, defaulting to the full seed registry when the caller
 * has no narrower list), returns what already covers it and a plain-language
 * recommendation — never invented pricing or vendor suggestions.
 */

import { RESOURCE_REGISTRY } from "./registry"
import type { ResourceGapAssessment, ResourceRecord } from "./types"

function recommendationFor(matching: ResourceRecord[], capabilityId: string): string {
  if (matching.length === 0) {
    return "Nothing in your existing stack covers this today — this build is a genuine gap, not a duplication."
  }
  const connected = matching.filter((r) => r.status === "connected")
  if (connected.length > 0) {
    const names = connected.map((r) => r.name).join(", ")
    return `You already have ${names} connected, which can cover this without adding anything new.`
  }
  const names = matching.map((r) => r.name).join(", ")
  return `${names} is available but not yet configured — worth checking before adding a new resource.`
}

/**
 * Assesses whether the founder's existing resources already cover a given
 * Readiness Capability™. `existingResourceIds` lets a caller narrow the
 * check to resources actually confirmed for this founder; omitted, every
 * seed-registry resource is considered (all currently `"connected"` at the
 * product level, since they are this product's own stack, not per-founder
 * opt-in resources).
 */
export function assessResourceGap(capabilityId: string, existingResourceIds?: string[]): ResourceGapAssessment {
  const pool = existingResourceIds
    ? RESOURCE_REGISTRY.filter((r) => existingResourceIds.includes(r.id))
    : RESOURCE_REGISTRY

  const matchingResources = pool.filter((r) => r.capabilitiesSupported.includes(capabilityId))
  const alreadyCoveredByExistingStack = matchingResources.some((r) => r.status === "connected")

  return {
    capabilityId,
    matchingResources,
    alreadyCoveredByExistingStack,
    recommendation: recommendationFor(matchingResources, capabilityId),
  }
}
