/**
 * Business Blueprint™ — multi-archetype requirement composition
 * ---------------------------------------------------------------------------
 * A founder's `BusinessModelProfile` can detect multiple archetypes at once
 * (e.g. Coach + Consultant + Thought Leader) and its own doc comments state
 * that characteristics "compose across ALL detected archetypes." This
 * module implements the matching rule for capability requirements: union,
 * then deduplicate by `capabilityId` — never archetype precedence. Selecting
 * multiple archetypes means the founder is intentionally designing a hybrid
 * business; no archetype's requirements override another's.
 *
 * The one exception this function guards against: two archetypes that name
 * the same `capabilityId` but scope it to different, non-overlapping
 * `businessModels` sets are not silently merged into a single unscoped
 * requirement (which could invent a broader requirement than either
 * archetype actually specifies) — they're surfaced as a
 * `configurationConflict` for later, explicit resolution. This function
 * does not invent a winner.
 *
 * Deliberately NOT the full Business Blueprint™ aggregator — this is one
 * small, pure helper `deriveBusinessBlueprint()` (not yet built) would call.
 * It knows nothing about Readiness Capabilities, Business Assets, stages, or
 * the Installed Business Asset™ inventory — those are resolved separately.
 */

export interface ArchetypeRequirementSet {
  archetypeId: string
  capabilityIds: string[]
  /** Optional: the `businessModels` scope this archetype's requirements were
   *  read from, when known — used only to detect a `configurationConflict`
   *  below, never to decide a winner. */
  scope?: string[]
}

export interface ComposeRequirementsResult {
  /** Every distinct `capabilityId` required by at least one archetype. */
  capabilityIds: string[]
  /** `capabilityId`s that appeared under two archetypes with different,
   *  non-overlapping `scope`s — flagged for human/business-design review,
   *  never silently resolved. */
  configurationConflicts: string[]
}

/**
 * Unions capability requirement lists from multiple `BusinessModelProfile`
 * archetypes and deduplicates by `capabilityId`, matching the existing
 * "compose across ALL detected archetypes" convention.
 */
export function composeRequirementSets(
  perArchetype: ArchetypeRequirementSet[],
): ComposeRequirementsResult {
  const scopesByCapabilityId = new Map<string, string[] | undefined>()
  const conflictIds = new Set<string>()

  for (const archetype of perArchetype) {
    for (const capabilityId of archetype.capabilityIds) {
      if (!scopesByCapabilityId.has(capabilityId)) {
        scopesByCapabilityId.set(capabilityId, archetype.scope)
        continue
      }

      const existingScope = scopesByCapabilityId.get(capabilityId)
      const scopesDiffer =
        existingScope !== undefined &&
        archetype.scope !== undefined &&
        !scopesOverlap(existingScope, archetype.scope)

      if (scopesDiffer) {
        conflictIds.add(capabilityId)
      }
    }
  }

  return {
    capabilityIds: Array.from(scopesByCapabilityId.keys()),
    configurationConflicts: Array.from(conflictIds),
  }
}

function scopesOverlap(a: string[], b: string[]): boolean {
  return a.some((value) => b.includes(value))
}
