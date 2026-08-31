"use client"

/**
 * CEO Workday™ — Category Selector Row
 * ---------------------------------------------------------------------------
 * The 12-category menu: "BUILD ▾ DESIGN ▾ DECIDE ▾ …". This is the MENU —
 * `TodaysWorkQueue` is the basket. Only BUILD has real, selectable options
 * (every Business Asset™, grouped by library category). The other 11
 * categories open a small popover with their one-line definition and a
 * disabled "Coming Next" state — clicking still queues a clearly-labeled
 * placeholder item so it's visible in Today's Work, per spec, but it is
 * never presented as an executable workflow.
 */

import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

import { CEO_WORK_CATEGORIES, type CeoWorkCategoryId } from "@/lib/ceo-workday/categories"
import { getBuildOptionGroups, getDesignOptionGroups, categoryHasComingNextOnly } from "@/lib/ceo-workday/category-options"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import { addWorkItem, hasQueuedAsset } from "@/lib/ceo-workday/todays-work-store"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

export function CategorySelectorRow({ onItemAdded }: { onItemAdded?: () => void }) {
  const [openCategory, setOpenCategory] = useState<CeoWorkCategoryId | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => setOpenCategory(null))

  function handleAddBuildAsset(asset: BusinessAsset) {
    if (!hasQueuedAsset(asset.id)) {
      addWorkItem({
        category: "BUILD",
        selectedOptionLabel: asset.name,
        workflowId: getWorkflowEntry("BUILD").workflowId,
        availability: "available",
        source: "founder",
        sourceDetail: "Selected from Build category menu",
        relatedAssetId: asset.id,
        tangibleOutcome: "Business Asset™",
      })
    }
    setOpenCategory(null)
    onItemAdded?.()
  }

  function handleAddDesignAsset(asset: BusinessAsset) {
    if (!hasQueuedAsset(asset.id)) {
      addWorkItem({
        category: "DESIGN",
        selectedOptionLabel: asset.name,
        workflowId: getWorkflowEntry("DESIGN").workflowId,
        availability: "available",
        source: "founder",
        sourceDetail: "Selected from Design category menu",
        relatedAssetId: asset.id,
        tangibleOutcome: "Business Operating Rule™",
      })
    }
    setOpenCategory(null)
    onItemAdded?.()
  }

  function handleAddComingNext(categoryId: CeoWorkCategoryId) {
    const category = CEO_WORK_CATEGORIES.find((c) => c.id === categoryId)
    const entry = getWorkflowEntry(categoryId)
    addWorkItem({
      category: categoryId,
      selectedOptionLabel: category?.label ?? categoryId,
      workflowId: entry.workflowId,
      availability: "workflow-not-yet-available",
      source: "founder",
      sourceDetail: "Selected from category menu",
      tangibleOutcome: category?.tangibleOutcome,
    })
    setOpenCategory(null)
    onItemAdded?.()
  }

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2">
      {CEO_WORK_CATEGORIES.map((category) => (
        <div key={category.id} className="relative">
          <button
            type="button"
            onClick={() => setOpenCategory((current) => (current === category.id ? null : category.id))}
            className="inline-flex items-center gap-1 rounded-full border border-[#E8DFE2] bg-white px-3.5 py-2 font-montserrat text-xs font-bold uppercase tracking-[0.08em] text-[#3A2E33] hover:border-[#5A7A45]/40 transition-colors"
            aria-expanded={openCategory === category.id}
          >
            {category.label}
            <ChevronDown className="h-3 w-3" aria-hidden />
          </button>

          {openCategory === category.id && (
            <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-[#E8DFE2] bg-white p-3 shadow-lg">
              {category.id === "BUILD" ? (
                <BuildOptionsMenu onSelect={handleAddBuildAsset} />
              ) : category.id === "DESIGN" ? (
                <BuildOptionsMenu onSelect={handleAddDesignAsset} groups={getDesignOptionGroups()} />
              ) : (
                <ComingNextMenu category={category} onAdd={() => handleAddComingNext(category.id)} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function BuildOptionsMenu({
  onSelect,
  groups = getBuildOptionGroups(),
}: {
  onSelect: (asset: BusinessAsset) => void
  groups?: ReturnType<typeof getBuildOptionGroups>
}) {
  return (
    <div className="max-h-80 overflow-y-auto space-y-3">
      {groups.map((group) => (
        <div key={group.groupLabel}>
          <p className="px-1 pb-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
            {group.groupLabel}
          </p>
          <div className="space-y-0.5">
            {group.assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelect(asset)}
                className="w-full rounded-lg px-2 py-1.5 text-left font-sans text-sm text-[#3A2E33] hover:bg-[#F4F7F0] transition-colors"
              >
                {asset.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ComingNextMenu({
  category,
  onAdd,
}: {
  category: (typeof CEO_WORK_CATEGORIES)[number]
  onAdd: () => void
}) {
  const isComingNext = categoryHasComingNextOnly(category.id)
  return (
    <div className="space-y-3 p-1">
      <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{category.definition}</p>
      {isComingNext && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-[#F4F1EC] px-3 py-2">
          <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
            Coming Next
          </span>
          <button
            type="button"
            onClick={onAdd}
            className="font-sans text-xs font-bold text-[#5A7A45] hover:underline"
          >
            Add to Today&apos;s Work
          </button>
        </div>
      )}
    </div>
  )
}
