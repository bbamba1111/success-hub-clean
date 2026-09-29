/**
 * Business Blueprint™ — requirement list (first real, read-only aggregator)
 * ---------------------------------------------------------------------------
 * Deliberately NOT `deriveBusinessBlueprint()` — there is no top-level
 * Blueprint object yet (that would also need destination → archetype
 * resolution this module takes as an already-resolved input). This is the
 * one list `deriveBusinessBlueprint()` would eventually assemble from.
 *
 * Composition, not duplication:
 *   - `deriveReadinessRelevance()` is called as-is — stage gating,
 *     destination-signal surfacing, prerequisite/unlock chains, and
 *     ESA/Build-Record "already-installed" proxy are all untouched.
 *   - `isCapabilityApplicable()` / `deriveRequirementTiming()`
 *     (`activation-rules.ts`) add the one genuinely missing rule: whether a
 *     capability applies to this founder's business model(s) at all.
 *   - `getInstalledStatusByAssetId()` (Installed Business Asset™ inventory)
 *     resolves `satisfied` from a DIRECT check, never the ESA/Build-Record
 *     proxy `deriveReadinessRelevance()` uses for its own status.
 *   - `composeRequirementSets()` runs only to surface
 *     `configurationConflicts` for the caller to display — it never filters
 *     or reorders the requirement list itself.
 */

import { deriveReadinessRelevance, type FounderReadinessContextInput } from "@/lib/founder-intelligence/readiness-relevance"
import { isCapabilityApplicable, deriveRequirementTiming } from "./activation-rules"
import { composeRequirementSets, type ArchetypeRequirementSet } from "./compose-requirements"
import { getInstalledStatusByAssetId } from "@/lib/business-asset-inventory/business-asset-inventory-store"
import type { BusinessAssetId } from "@/lib/executive-decision-engine/types"
import type { BusinessModelProfile } from "@/lib/business-model-classification/types"
import type { BusinessBlueprintRequirement, BlueprintAssetStatus } from "./types"

export interface DeriveBusinessBlueprintRequirementsInput extends FounderReadinessContextInput {
  businessModelProfile?: BusinessModelProfile | null
}

export interface BusinessBlueprintRequirementsResult {
  requirements: BusinessBlueprintRequirement[]
  /** Same-`capabilityId`, non-overlapping-scope conflicts across the
   *  founder's archetypes — surfaced, never auto-resolved. See
   *  `composeRequirementSets()`. */
  configurationConflicts: string[]
}

/**
 * Resolves the founder's actual readiness pool into Business Blueprint™
 * requirement rows: each capability's timing (current/future/not-applicable)
 * and asset-satisfaction state, resolved against the Installed Business
 * Asset™ inventory.
 */
export function deriveBusinessBlueprintRequirements(
  input: DeriveBusinessBlueprintRequirementsInput,
): BusinessBlueprintRequirementsResult {
  const relevantCapabilities = deriveReadinessRelevance(input)
  const installedStatusByAssetId = getInstalledStatusByAssetId()

  const requirements: BusinessBlueprintRequirement[] = relevantCapabilities.map((relevant) => {
    const { capability } = relevant
    const applicability = isCapabilityApplicable(capability, input.businessModelProfile)
    const timing = deriveRequirementTiming(relevant.relevanceStatus, applicability)

    const relatedBusinessAssetIds = (capability.relatedBusinessAssetIds ?? []) as BusinessAssetId[]
    const assetStatuses: BlueprintAssetStatus[] = relatedBusinessAssetIds.map((businessAssetId) => ({
      businessAssetId,
      status: installedStatusByAssetId[businessAssetId] ?? "not-installed",
    }))

    const satisfied =
      relatedBusinessAssetIds.length > 0 && assetStatuses.every((asset) => asset.status === "installed")

    return {
      capabilityId: capability.id,
      timing,
      relevanceStatus: relevant.relevanceStatus,
      relatedBusinessAssetIds,
      assetStatuses,
      relatedDeliverableIds: capability.relatedDeliverables,
      satisfied,
    }
  })

  const configurationConflicts = deriveConfigurationConflicts(input.businessModelProfile, relevantCapabilities)

  return { requirements, configurationConflicts }
}

/**
 * Surfaces `composeRequirementSets()`'s conflict output across the
 * founder's primary + secondary archetypes. Each archetype's
 * `capabilityIds` is read from the SAME already-computed relevant-capability
 * pool (grouped by which archetype's `businessModels` scope matched it) —
 * never re-derived from the registry directly.
 */
function deriveConfigurationConflicts(
  businessModelProfile: BusinessModelProfile | null | undefined,
  relevantCapabilities: ReturnType<typeof deriveReadinessRelevance>,
): string[] {
  if (!businessModelProfile) return []

  const archetypeIds = [
    ...(businessModelProfile.primaryArchetype !== "unknown" ? [businessModelProfile.primaryArchetype] : []),
    ...businessModelProfile.secondaryArchetypes,
  ]
  if (archetypeIds.length < 2) return []

  const perArchetype: ArchetypeRequirementSet[] = archetypeIds.map((archetypeId) => {
    const capabilityIds = relevantCapabilities
      .filter((relevant) => relevant.capability.businessModels !== "all" && relevant.capability.businessModels.includes(archetypeId))
      .map((relevant) => relevant.capability.id)

    return { archetypeId, capabilityIds, scope: undefined }
  })

  return composeRequirementSets(perArchetype).configurationConflicts
}
