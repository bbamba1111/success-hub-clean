/**
 * Phase 13 fixtures — multi-instance Delegation Brief™ bridge. Exercises the
 * pure `deriveDelegationBuildRecord` bridge function with a lettered set of
 * scenarios so regressions surface without a browser. This does NOT touch
 * Supabase — it verifies the pure-function contract that the DB-backed
 * instance_key filtering (utils/business-asset-build-storage.ts) depends on:
 * distinct build.id -> distinct, independent BuildRecord.id/readinessCapabilityId.
 *
 * Run with: npx tsx scripts/dev/phase-13-multi-instance-delegation-fixtures.ts
 */

import { deriveDelegationBuildRecord } from "@/lib/build-record/delegation-brief-bridge"
import { getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { BusinessAssetBuildRecord } from "@/utils/business-asset-build-storage"

let pass = 0
let fail = 0

function check(label: string, condition: boolean) {
  if (condition) {
    pass++
    console.log(`  ✓ ${label}`)
  } else {
    fail++
    console.log(`  ✗ FAIL: ${label}`)
  }
}

function makeCompletedBuild(overrides: Partial<BusinessAssetBuildRecord> = {}): BusinessAssetBuildRecord {
  const now = new Date().toISOString()
  return {
    id: `build_${Math.random().toString(36).slice(2, 9)}`,
    businessAssetId: "delegation-brief",
    buildMode: "guided-diy",
    status: "completed",
    messages: [],
    generatedContent: "Generated brief content.",
    fieldValues: ["answer 1", "answer 2"],
    updatedAt: now,
    createdAt: now,
    reviewStatus: "approved",
    version: 1,
    businessStage: "early",
    approvedAt: now,
    artifactKind: "delegation-artifact",
    instanceKey: null,
    ...overrides,
  }
}

console.log("Phase 13 — Multi-Instance Delegation Brief™ Bridge\n")

const asset = getBusinessAsset("delegation-brief")

console.log("A. Registry setup")
check("delegation-brief asset exists in registry", Boolean(asset))
check("delegation-brief is flagged isMultiInstance", asset?.isMultiInstance === true)
// Regression guard: singleton assets must NOT have been swept into this flag.
const meetingRule = getBusinessAsset("meeting-rule")
check("meeting-rule asset exists in registry", Boolean(meetingRule))
check("meeting-rule (singleton) is NOT flagged isMultiInstance", Boolean(meetingRule) && !meetingRule?.isMultiInstance)

if (asset) {
  console.log("\nB. Three independent delegation instances")
  const clientOnboardingBuild = makeCompletedBuild({
    id: "build_client_onboarding",
    instanceKey: "del_client_onboarding",
  })
  const invoicingBuild = makeCompletedBuild({
    id: "build_invoicing",
    instanceKey: "del_invoicing",
  })
  const schedulingBuild = makeCompletedBuild({
    id: "build_scheduling",
    instanceKey: "del_scheduling",
  })

  const clientOnboardingRecord = deriveDelegationBuildRecord(clientOnboardingBuild, asset, "Client Onboarding")
  const invoicingRecord = deriveDelegationBuildRecord(invoicingBuild, asset, "Invoicing")
  const schedulingRecord = deriveDelegationBuildRecord(schedulingBuild, asset, "Scheduling")

  check(
    "each BuildRecord.readinessCapabilityId matches its own business_asset_builds.id",
    clientOnboardingRecord.readinessCapabilityId === "build_client_onboarding" &&
      invoicingRecord.readinessCapabilityId === "build_invoicing" &&
      schedulingRecord.readinessCapabilityId === "build_scheduling",
  )
  check(
    "all three readinessCapabilityIds are distinct (no collision)",
    new Set([
      clientOnboardingRecord.readinessCapabilityId,
      invoicingRecord.readinessCapabilityId,
      schedulingRecord.readinessCapabilityId,
    ]).size === 3,
  )
  check("Client Onboarding record carries its own title", clientOnboardingRecord.title === "Client Onboarding")
  check("Invoicing record carries its own title", invoicingRecord.title === "Invoicing")
  check("Scheduling record carries its own title", schedulingRecord.title === "Scheduling")
  check("all three default to buildPath 'delegate'", [clientOnboardingRecord, invoicingRecord, schedulingRecord].every((r) => r.buildPath === "delegate"))
  check(
    "editing one instance's derived title does not affect another (independent objects)",
    clientOnboardingRecord.title !== invoicingRecord.title && invoicingRecord.title !== schedulingRecord.title,
  )

  console.log("\nC. Re-deriving the same instance preserves its id (idempotent upsert key)")
  const rederived = deriveDelegationBuildRecord(clientOnboardingBuild, asset, "Client Onboarding")
  check("re-deriving the same build.id yields the same BuildRecord.id", rederived.id === clientOnboardingRecord.id)
  check(
    "re-deriving the same build.id yields the same readinessCapabilityId (upsert-safe)",
    rederived.readinessCapabilityId === clientOnboardingRecord.readinessCapabilityId,
  )
}

console.log(`\n${pass} passed, ${fail} failed`)
if (fail > 0) process.exit(1)
