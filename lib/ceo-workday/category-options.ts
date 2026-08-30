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

/** True for any category with no real workflow yet — used to render the "Coming Next" popover instead of options. */
export function categoryHasComingNextOnly(categoryId: CeoWorkCategoryId): boolean {
  return !isWorkflowAvailable(categoryId)
}

export function getCategoryDefinition(categoryId: CeoWorkCategoryId): string {
  return CEO_WORK_CATEGORIES.find((c) => c.id === categoryId)?.definition ?? ""
}
