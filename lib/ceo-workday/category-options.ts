/**
 * CEO Workday™ — Category Options
 * ---------------------------------------------------------------------------
 * What the founder sees inside each category's dropdown. BUILD lists real,
 * selectable Business Assets™ (grouped by their existing library category)
 * — nothing invented. The other 11 categories have no real options yet, so
 * they show their one-line definition and a disabled "Coming Next" state
 * instead of a fake option list that looks choosable.
 */

import { ALL_BUSINESS_ASSET_CATEGORIES, BUSINESS_ASSETS, type BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { CEO_WORK_CATEGORIES, type CeoWorkCategoryId } from "./categories"
import { isWorkflowAvailable } from "./workflow-registry"

export interface BuildOptionGroup {
  groupLabel: string
  assets: BusinessAsset[]
}

/** BUILD's real, selectable options — every Business Asset™, grouped by its existing library category. */
export function getBuildOptionGroups(): BuildOptionGroup[] {
  return ALL_BUSINESS_ASSET_CATEGORIES.map((groupLabel) => ({
    groupLabel,
    assets: BUSINESS_ASSETS.filter((asset) => asset.category === groupLabel),
  })).filter((group) => group.assets.length > 0)
}

/**
 * DESIGN's real, selectable options — Operating Rule artifacts (e.g. Meeting
 * Rule™). These live in the same registry as Business Assets but carry
 * `artifactKind: "operating-rule"` and the "Design the Business" category,
 * which is deliberately excluded from ALL_BUSINESS_ASSET_CATEGORIES so they
 * never appear in getBuildOptionGroups() above.
 */
export function getDesignOptionGroups(): BuildOptionGroup[] {
  const designAssets = BUSINESS_ASSETS.filter((asset) => asset.artifactKind === "operating-rule")
  return designAssets.length > 0 ? [{ groupLabel: "Operating Rules", assets: designAssets }] : []
}

/**
 * DELEGATE's real, selectable options — Delegation Artifacts (e.g.
 * Delegation Brief™). Same pattern as getDesignOptionGroups() above: these
 * live in the same registry as Business Assets but carry
 * `artifactKind: "delegation-artifact"` and the "Delegate the Business"
 * category, excluded from ALL_BUSINESS_ASSET_CATEGORIES so they never
 * appear in getBuildOptionGroups(). Selecting one here only produces the
 * artifact CONTENT (what's being handed off) — assigning it to a person and
 * tracking briefed/accepted status happens afterward, on the Build Record's
 * existing DelegateExecution fields, not here.
 */
export function getDelegateOptionGroups(): BuildOptionGroup[] {
  const delegateAssets = BUSINESS_ASSETS.filter((asset) => asset.artifactKind === "delegation-artifact")
  return delegateAssets.length > 0 ? [{ groupLabel: "Delegation Artifacts", assets: delegateAssets }] : []
}

/** True for any category with no real workflow yet — used to render the "Coming Next" popover instead of options. */
export function categoryHasComingNextOnly(categoryId: CeoWorkCategoryId): boolean {
  return !isWorkflowAvailable(categoryId)
}

export function getCategoryDefinition(categoryId: CeoWorkCategoryId): string {
  return CEO_WORK_CATEGORIES.find((c) => c.id === categoryId)?.definition ?? ""
}
