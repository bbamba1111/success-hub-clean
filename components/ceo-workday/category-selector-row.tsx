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
import {
  getBuildOptionGroups,
  getDesignOptionGroups,
  getDelegateOptionGroups,
  categoryHasComingNextOnly,
} from "@/lib/ceo-workday/category-options"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import { addWorkItem, hasQueuedAsset } from "@/lib/ceo-workday/todays-work-store"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

export function CategorySelectorRow({ onItemAdded }: { onItemAdded?: () => void }) {
  const [openCategory, setOpenCategory] = useState<CeoWorkCategoryId | null>(null)
  // Phase 3: when a founder picks a multi-instance asset (e.g. Delegation
  // Brief™) from the DELEGATE menu, the popover swaps from the asset list
  // to a one-field "what are you delegating?" naming step, still inside the
  // same popover container — no new modal component. `null` = showing the
  // list. Non-multi-instance assets never touch this state.
  const [pendingMultiInstanceAsset, setPendingMultiInstanceAsset] = useState<BusinessAsset | null>(null)
  const [instanceTitle, setInstanceTitle] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => {
    setOpenCategory(null)
    setPendingMultiInstanceAsset(null)
    setInstanceTitle("")
  })

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

  function handleAddDelegateAsset(asset: BusinessAsset) {
    // Multi-instance assets (currently only Delegation Brief™) always need a
    // founder-given title to distinguish this instance from any other, so
    // they never queue immediately — they open the inline naming step below.
    // `hasQueuedAsset` only guards the BUILD category, so repeat-adding a
    // DELEGATE asset (to start a second instance) was already unblocked.
    if (asset.isMultiInstance) {
      setPendingMultiInstanceAsset(asset)
      setInstanceTitle("")
      return
    }
    if (!hasQueuedAsset(asset.id)) {
      addWorkItem({
        category: "DELEGATE",
        selectedOptionLabel: asset.name,
        workflowId: getWorkflowEntry("DELEGATE").workflowId,
        availability: "available",
        source: "founder",
        sourceDetail: "Selected from Delegate category menu",
        relatedAssetId: asset.id,
        tangibleOutcome: "Delegation Artifact",
      })
    }
    setOpenCategory(null)
    onItemAdded?.()
  }

  function handleConfirmMultiInstanceDelegate() {
    const asset = pendingMultiInstanceAsset
    const title = instanceTitle.trim()
    if (!asset || !title) return
    const instanceKey = `del_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
    addWorkItem({
      category: "DELEGATE",
      selectedOptionLabel: title,
      workflowId: getWorkflowEntry("DELEGATE").workflowId,
      availability: "available",
      source: "founder",
      sourceDetail: "Selected from Delegate category menu",
      relatedAssetId: asset.id,
      tangibleOutcome: "Delegation Artifact",
      instanceKey,
    })
    setPendingMultiInstanceAsset(null)
    setInstanceTitle("")
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
            onClick={() => {
              setOpenCategory((current) => (current === category.id ? null : category.id))
              setPendingMultiInstanceAsset(null)
              setInstanceTitle("")
            }}
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
              ) : category.id === "DELEGATE" ? (
                pendingMultiInstanceAsset ? (
                  <MultiInstanceNamingStep
                    asset={pendingMultiInstanceAsset}
                    title={instanceTitle}
                    onTitleChange={setInstanceTitle}
                    onCancel={() => {
                      setPendingMultiInstanceAsset(null)
                      setInstanceTitle("")
                    }}
                    onConfirm={handleConfirmMultiInstanceDelegate}
                  />
                ) : (
                  <BuildOptionsMenu onSelect={handleAddDelegateAsset} groups={getDelegateOptionGroups()} />
                )
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

/**
 * Phase 3: the second step of adding a multi-instance asset (currently only
 * Delegation Brief™) from the DELEGATE menu — a founder-given title that
 * becomes both the work-item label and, via `instanceKey`, the durable
 * discriminator that keeps this delegation's persisted content separate
 * from every other one.
 */
function MultiInstanceNamingStep({
  asset,
  title,
  onTitleChange,
  onCancel,
  onConfirm,
}: {
  asset: BusinessAsset
  title: string
  onTitleChange: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="space-y-3 p-1">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
        {asset.name}
      </p>
      <label htmlFor="delegate-instance-title" className="block font-sans text-sm text-[#3A2E33]">
        What are you delegating?
      </label>
      <input
        id="delegate-instance-title"
        type="text"
        autoFocus
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault()
            onConfirm()
          }
        }}
        placeholder="e.g. Client Onboarding"
        className="w-full rounded-lg border border-[#E8DFE2] px-3 py-2 font-sans text-sm text-[#3A2E33] outline-none transition-colors focus:border-[#5A7A45]/60"
      />
      <div className="flex items-center justify-between gap-2 pt-1">
        <button type="button" onClick={onCancel} className="font-sans text-xs font-bold text-[#6B5860] hover:underline">
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!title.trim()}
          className="rounded-lg bg-[#5A7A45] px-3 py-1.5 font-sans text-xs font-bold text-white transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>
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
