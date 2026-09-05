/**
 * Installed Business Asset™ — canonical founder-asset inventory (types only)
 * ---------------------------------------------------------------------------
 * Prior to this, the only signal for "does the founder already have this
 * Business Asset™" was a PROXY: `deriveReadinessRelevance()`'s
 * "already-installed" status, inferred from ESA pillar scores and Build
 * Record status — never a direct check against a specific Business Asset™
 * (see `lib/founder-intelligence/readiness-relevance.ts`, "already-installed"
 * doc comment). That proxy remains valid evidence and is preserved below as
 * the `"esa-signal"` evidence source, but it is no longer the authoritative
 * answer to "does this asset exist for this founder" — this module is.
 *
 * Scope: this is a direct, per-founder installation-state record for one
 * `BusinessAssetId` from `BUSINESS_ASSET_REGISTRY`
 * (`lib/executive-decision-engine/asset-registry.ts`). It does NOT define a
 * new Business Asset registry, does not duplicate asset definitions, and
 * does not track Deliverables — `DELIVERABLES`
 * (`lib/output-architecture/deliverable-registry.ts`) and
 * `ReadinessCapability.relatedDeliverables` are unchanged and unaffected.
 *
 * Founders are never expected to manually inventory every possible asset.
 * Evidence accumulates from founder confirmation, completed Build Records,
 * and completed Deliverables — see `BusinessAssetEvidenceSource` below.
 */

import type { BusinessAssetId } from "@/lib/executive-decision-engine/types"

/**
 * Canonical installation state for one Business Asset™, for one founder.
 * Distinct from Build Record's capability-level `BuildLifecycleStatus`
 * (`lib/build-record/types.ts`) and from the ESA-score proxy — this is a
 * direct, authoritative answer to "does this asset exist for this founder,"
 * not "is a capability being built."
 */
export type BusinessAssetInstallationStatus =
  | "not-installed"
  | "in-progress"
  | "installed"
  /** Existed once, but is insufficient for the founder's current Business
   *  Destination™ — e.g. an offer document that predates a repositioning. */
  | "needs-update"
  /** Founder intends to continue, but a dependency, decision, or other
   *  condition is preventing completion. */
  | "blocked"
  /** Founder has stopped pursuing this asset, whether intentionally or
   *  unintentionally — distinct from "blocked" (still intended) and from
   *  simple inactivity (which is not, on its own, evidence of abandonment).
   *  This is an explicit, recorded state — never inferred solely from the
   *  passage of time. */
  | "abandoned"

/**
 * Where an installation-status claim comes from. Multiple evidence entries
 * may co-exist for the same asset; `"founder-confirmed"` always takes
 * precedence for display and is never silently overridden by a weaker
 * signal arriving later.
 */
export type BusinessAssetEvidenceSource =
  | "founder-confirmed"
  /** A Build Record™ for a related Readiness Capability™ reached "installed". */
  | "build-record"
  /** A related Deliverable (from `DELIVERABLES`) was marked complete. */
  | "deliverable-completed"
  /** The legacy ESA-pillar-score proxy — weakest evidence, kept only for
   *  backward compatibility with `deriveReadinessRelevance()`'s
   *  "already-installed" status. Never sufficient on its own to mark an
   *  asset "installed" going forward; new code should prefer the other
   *  three sources. */
  | "esa-signal"

export interface BusinessAssetEvidence {
  source: BusinessAssetEvidenceSource
  /** Free-text pointer to the originating record, e.g. a Build Record id or
   *  a Deliverable id — not a foreign key, since evidence sources live in
   *  different tables/registries. */
  reference?: string
  recordedAt: string
}

/** One row of the founder's Installed Business Asset™ inventory. */
export interface InstalledBusinessAsset {
  businessAssetId: BusinessAssetId
  status: BusinessAssetInstallationStatus
  evidence: BusinessAssetEvidence[]
  updatedAt: string
}
