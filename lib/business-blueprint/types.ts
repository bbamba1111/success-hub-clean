/**
 * Business Blueprint™ — requirement schema (types only, no engine yet)
 * ---------------------------------------------------------------------------
 * This is deliberately NOT a new rules engine. Stage-gating, business-model
 * fit, destination-signal surfacing, and prerequisite/unlock chains already
 * live in `deriveReadinessRelevance()`
 * (`lib/founder-intelligence/readiness-relevance.ts`) and are reused as-is —
 * a `BusinessBlueprintRequirement` carries that function's
 * `ReadinessRelevanceStatus` through, it does not re-derive it.
 *
 * What this module adds, and what `deriveReadinessRelevance()` cannot answer
 * today:
 *
 * 1. `BlueprintRequirementTiming` — `ReadinessRelevanceStatus` declares both
 *    `"future"` and `"not-yet-relevant"` but only ever produces
 *    `"not-yet-relevant"` in practice, conflating "this business model
 *    doesn't need it" with "this destination needs it, just not yet."
 *    `BlueprintRequirementTiming` makes that distinction real.
 * 2. `assetStatuses` / `satisfied` — resolved from the Installed Business
 *    Asset™ inventory (`lib/business-asset-inventory/`), a direct check,
 *    never the ESA/Build-Record proxy `deriveReadinessRelevance()` uses for
 *    its own "already-installed" status.
 *
 * No `deriveBusinessBlueprint()` aggregator exists yet — that is explicitly
 * out of scope for this pass. This file defines only the shape such a
 * function would eventually produce, so downstream consumers (Founder GPS™,
 * UI) have a stable contract to build against later.
 */

import type { ReadinessRelevanceStatus } from "@/lib/founder-intelligence/readiness-relevance"
import type { BusinessAssetId } from "@/lib/executive-decision-engine/types"
import type { BusinessAssetInstallationStatus } from "@/lib/business-asset-inventory/types"

/**
 * When this requirement becomes relevant relative to the founder's current
 * Business Stage™ — distinct from `ReadinessRelevanceStatus`, which
 * conflates "not applicable to this business model" and "applicable, but at
 * a later stage" under a single `"not-yet-relevant"` value.
 */
export type BlueprintRequirementTiming =
  /** Required now, at the founder's current Business Stage™. */
  | "current"
  /** The founder's selected Business Destination™ will require this at a
   *  later stage — an intentional part of the business they're building,
   *  just not yet. */
  | "future"
  /** Outside the founder's selected business model(s) entirely — does not
   *  apply to this business, at any stage. */
  | "not-applicable"

/** Per-asset installation state for one requirement, resolved from the
 *  Installed Business Asset™ inventory. */
export interface BlueprintAssetStatus {
  businessAssetId: BusinessAssetId
  status: BusinessAssetInstallationStatus
}

/**
 * One row of the Business Blueprint™: a single Readiness Capability™,
 * resolved against the founder's actual Business Asset™ inventory. When a
 * founder selects multiple business-model archetypes, requirements are
 * composed via union-with-dedup across all of them — see
 * `composeRequirementSets()` in `compose-requirements.ts` — never by
 * archetype precedence.
 */
export interface BusinessBlueprintRequirement {
  capabilityId: string
  timing: BlueprintRequirementTiming
  /** Carried through from `deriveReadinessRelevance()` — not re-derived. */
  relevanceStatus: ReadinessRelevanceStatus
  relatedBusinessAssetIds: BusinessAssetId[]
  /** Resolved from the Installed Business Asset™ inventory — never from
   *  ESA/Build Record directly. Empty when `relatedBusinessAssetIds` is
   *  empty. */
  assetStatuses: BlueprintAssetStatus[]
  relatedDeliverableIds: string[]
  /** True only when every entry in `assetStatuses` is `"installed"`. False
   *  (never undefined) when `relatedBusinessAssetIds` is empty — a
   *  requirement with no mapped assets is never considered satisfied by
   *  omission. */
  satisfied: boolean
}
