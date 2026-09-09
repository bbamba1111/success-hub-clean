/**
 * Delegation Brief™ → Build Record™ bridge (Phase 3).
 * ---------------------------------------------------------------------------
 * Delegation Brief™ became multi-instance in Phase 3: a founder can complete
 * several independent delegations (e.g. "Client Onboarding", "Invoicing",
 * "Scheduling"), each its own `business_asset_builds` row. This bridge turns
 * one completed delegation build into a `BuildRecord` so it shows up as its
 * own independent card in Build Command Center™ — with the assignee/briefed/
 * accepted UI that's already built and wired
 * (`components/build-command-center/build-command-center-client.tsx`,
 * `setDelegateAssignee` / `markDelegateBriefed` / `markHandoffAccepted`).
 *
 * 100% reuse of the existing Phase 10/11 machinery: this only builds a
 * minimal `BuildBlueprint` (mirroring `makeDelegateBlueprint()` in
 * `scripts/dev/phase-11-delegation-fixtures.ts`) and calls the EXISTING
 * `deriveBuildRecord(blueprint)`. No new engine, no new fields.
 *
 * `blueprint.recommendationId` is set to `build.id` — the real, unique
 * `business_asset_builds.id` — which becomes `BuildRecord.readinessCapabilityId`.
 * Since the existing `(user_id, capability_id)` upsert key is used by
 * `upsertBuildRecordToDb`, this guarantees exactly one `BuildRecord` per
 * delegation instance, automatically distinct from every other instance.
 */

import type { BuildBlueprint } from "@/lib/build-strategy/types"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { BusinessAssetBuildRecord } from "@/utils/business-asset-build-storage"
import { deriveBuildRecord } from "@/lib/build-record/build-record-engine"
import type { BuildRecord } from "@/lib/build-record/types"

/**
 * Derives a `BuildRecord` for one completed Delegation Brief™ instance.
 *
 * @param build The completed `business_asset_builds` row for this instance.
 * @param asset The `delegation-brief` registry entry (the template).
 * @param title The founder-given title for this instance (e.g. "Client Onboarding").
 */
export function deriveDelegationBuildRecord(
  build: BusinessAssetBuildRecord,
  asset: BusinessAsset,
  title: string,
): BuildRecord {
  const blueprint: BuildBlueprint = {
    recommendationId: build.id,
    buildPath: "delegate",
    generatedAt: build.updatedAt,
    what: title,
    why: asset.whyItMatters,
    whyNow: "The founder just finished briefing this delegation.",
    desiredOutcome: `${title} is owned by whoever this is handed off to.`,
    currentState: "The founder completed the Delegation Brief™ describing what's being handed off.",
    targetState: "A named owner is briefed and has accepted the handoff.",
    ownerSummary: "Owned by whoever this is delegated to, once briefed and accepted.",
    owner: "team-or-ai",
    businessModelArchetype: "unknown",
    businessModelAdaptationNote: "No Business Model Profile™ signal used for this bridge.",
    prerequisites: [],
    unlocksCapabilities: [],
    budgetEstimate: "not yet determined",
    timelineEstimate: "not yet determined",
    targetCompletionDate: "not yet determined",
    handoffReady: true,
    evidence: [],
    triggeredBy: [],
    stageFraming: "current-stage",
    detail: {
      kind: "delegate",
      suggestedOwnerRole: "not yet determined",
      handoffDefinitionOfDone: "The handoff has been briefed and accepted by its new owner.",
      briefingPoints: [],
    },
  }

  return deriveBuildRecord(blueprint, {}, build.id)
}
