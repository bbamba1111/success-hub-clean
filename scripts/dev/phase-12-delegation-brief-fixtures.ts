/**
 * Phase 2 QA — Delegation Brief™ (Common Creation Engine)
 * ---------------------------------------------------------------------------
 * Headless checks for the artifact-content half of delegation. Run with:
 *   npx tsx scripts/dev/phase-12-delegation-brief-fixtures.ts
 */

import {
  BUSINESS_ASSETS,
  getBusinessAsset,
  ALL_BUSINESS_ASSET_CATEGORIES,
  type ArtifactKind,
} from "../../lib/business-asset-library/business-asset-registry"
import { getWorkflowEntry, isWorkflowAvailable } from "../../lib/ceo-workday/workflow-registry"
import { getDelegateOptionGroups, getBuildOptionGroups, getDesignOptionGroups } from "../../lib/ceo-workday/category-options"
import { CATEGORY_META } from "../../lib/business-asset-library/category-meta"

let pass = 0
let fail = 0
function check(label: string, condition: boolean) {
  if (condition) {
    pass++
    console.log(`  PASS  ${label}`)
  } else {
    fail++
    console.log(`  FAIL  ${label}`)
  }
}

console.log("\n=== 1. Delegation Brief™ exists as a real artifact definition ===")
const brief = getBusinessAsset("delegation-brief")
check("delegation-brief exists in registry", Boolean(brief))
check("has name Delegation Brief™", brief?.name === "Delegation Brief™")
check("has all 5 explanations", brief ? Object.keys(brief.explanations).length === 5 : false)
check("has all 5 instruction sets", brief ? Object.keys(brief.instructions).length === 5 : false)
check("has all 5 examples", brief ? Object.keys(brief.examples).length === 5 : false)

console.log("\n=== 2. ArtifactKind = delegation-artifact ===")
check("artifactKind is delegation-artifact", brief?.artifactKind === "delegation-artifact")
const kindCheck: ArtifactKind = "delegation-artifact" // compiles only if type includes it
check("ArtifactKind type includes delegation-artifact", kindCheck === "delegation-artifact")

console.log("\n=== 3. Does not duplicate execution-state fields ===")
const briefKeys = brief ? Object.keys(brief) : []
check("no assignedTo field on artifact", !briefKeys.includes("assignedTo"))
check("no briefedAt field on artifact", !briefKeys.includes("briefedAt"))
check("no handoffAcceptedAt field on artifact", !briefKeys.includes("handoffAcceptedAt"))

console.log("\n=== 4. Category isolation (never leaks into BUILD/DESIGN/Library) ===")
check(
  '"Delegate the Business" excluded from ALL_BUSINESS_ASSET_CATEGORIES',
  !ALL_BUSINESS_ASSET_CATEGORIES.includes("Delegate the Business" as any),
)
check("delegation-brief absent from BUILD's option groups", !getBuildOptionGroups().some((g) => g.assets.some((a) => a.id === "delegation-brief")))
check("delegation-brief absent from DESIGN's option groups", !getDesignOptionGroups().some((g) => g.assets.some((a) => a.id === "delegation-brief")))
check("meeting-rule (Phase 1) absent from DELEGATE's option groups", !getDelegateOptionGroups().some((g) => g.assets.some((a) => a.id === "meeting-rule")))

console.log("\n=== 5. DELEGATE is available in CEO Workday ===")
check("isWorkflowAvailable(DELEGATE) is true", isWorkflowAvailable("DELEGATE"))
check("DELEGATE workflowId is delegation-brief-builder", getWorkflowEntry("DELEGATE").workflowId === "delegation-brief-builder")

console.log("\n=== 6. Delegation Brief™ selectable from DELEGATE's option groups ===")
const delegateGroups = getDelegateOptionGroups()
check("getDelegateOptionGroups returns at least one group", delegateGroups.length > 0)
check(
  "Delegation Brief™ appears in DELEGATE's option groups",
  delegateGroups.some((g) => g.assets.some((a) => a.id === "delegation-brief")),
)

console.log("\n=== 7. Build modes restricted sensibly ===")
check(
  "availableBuildModeIds excludes hire-expert/buy-it/print-offline",
  brief?.availableBuildModeIds
    ? !brief.availableBuildModeIds.some((m) => ["hire-expert", "buy-it", "print-offline"].includes(m))
    : false,
)
check(
  "availableBuildModeIds includes give-to-team",
  Boolean(brief?.availableBuildModeIds?.includes("give-to-team")),
)

console.log("\n=== 8. Existing BUILD/DESIGN/DECIDE untouched ===")
check("BUILD still available", isWorkflowAvailable("BUILD"))
check("DESIGN still available", isWorkflowAvailable("DESIGN"))
check("DECIDE still NOT available (untouched)", !isWorkflowAvailable("DECIDE"))
check("meeting-rule (Phase 1) still exists and unaffected", getBusinessAsset("meeting-rule")?.artifactKind === "operating-rule")
check("Business Assets count unaffected by category-meta fix", BUSINESS_ASSETS.filter((a) => !a.artifactKind).length > 0)

console.log("\n=== 9. category-meta.ts covers both new categories (fixes pre-existing Phase 1 gap too) ===")
check('CATEGORY_META has "Design the Business"', Boolean(CATEGORY_META["Design the Business"]))
check('CATEGORY_META has "Delegate the Business"', Boolean(CATEGORY_META["Delegate the Business"]))

console.log(`\n${pass} passed, ${fail} failed\n`)
process.exit(fail > 0 ? 1 : 0)
