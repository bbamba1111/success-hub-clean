"use client"

/**
 * Today's Work™ — Execution Queue
 * ---------------------------------------------------------------------------
 * The founder's current execution queue for the protected 4-Hour Focused
 * CEO Workday™. The category row above is the MENU; this is the BASKET —
 * everything the founder intends to work on today, across every category,
 * accumulates here. No arbitrary item cap. Persists across refresh via
 * `todays-work-store` (localStorage, date-keyed).
 *
 * Each item is its own collapsible panel. For an available BUILD item,
 * expanding it renders the real, unmodified `AssetDetailView` builder
 * INLINE — the founder never leaves the workspace, no <iframe>, no
 * navigation. For a not-yet-available category, expanding it shows the
 * "Coming Next" explanation only; there is no dead-end action button.
 */

import { useEffect, useState } from "react"
import { ChevronDown, Mic, Send, Sparkles, User } from "lucide-react"

import {
  getTodaysWork,
  removeWorkItem,
  updateWorkItemStatus,
  TODAYS_WORK_EVENT,
} from "@/lib/ceo-workday/todays-work-store"
import type { CeoWorkItem, CeoWorkItemStatus } from "@/lib/ceo-workday/types"
import { getCeoWorkCategory } from "@/lib/ceo-workday/categories"
import { getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { AssetDetailView } from "@/components/business-asset-library/asset-detail-view"
import { deriveDelegationBuildRecord } from "@/lib/build-record/delegation-brief-bridge"
import { upsertBuildRecordToDb } from "@/utils/build-record-storage"
import type { BusinessAssetBuildRecord } from "@/utils/business-asset-build-storage"
import {
  ArticulationPracticeDialog,
  type ArticulationSourceContext,
} from "@/components/articulation/articulation-practice-dialog"
import { ARTICULATION_PURPOSE } from "@/lib/articulation/purpose"
import { CommunicateDelegateDialog } from "@/components/communications/communicate-delegate-dialog"

const STATUS_LABEL: Record<CeoWorkItemStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
  blocked: "Blocked",
  deferred: "Deferred",
}

const STATUS_STYLE: Record<CeoWorkItemStatus, string> = {
  "not-started": "bg-[#F4F1EC] text-[#6B5860]",
  "in-progress": "bg-[#8DAE72]/15 text-[#5A7A45]",
  completed: "bg-[#5A7A45] text-white",
  blocked: "bg-[#C4707B]/15 text-[#C4707B]",
  deferred: "bg-[#E8DFE2] text-[#6B5860]",
}

const SOURCE_LABEL: Record<CeoWorkItem["source"], string> = {
  gps: "Founder GPS™",
  barbara: "Barbara",
  founder: "You",
}

export function TodaysWorkQueue() {
  const [items, setItems] = useState<CeoWorkItem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    function refresh() {
      setItems(getTodaysWork())
    }
    refresh()
    window.addEventListener(TODAYS_WORK_EVENT, refresh)
    return () => window.removeEventListener(TODAYS_WORK_EVENT, refresh)
  }, [])

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E8DFE2] px-5 py-6 text-center">
        <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
          Nothing queued yet. Choose from a category above, or accept Founder GPS&apos;s recommendation, to start
          filling today&apos;s CEO Workday™.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <TodaysWorkItemRow
          key={item.id}
          item={item}
          index={index}
          expanded={expandedId === item.id}
          onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
          onRemove={() => {
            removeWorkItem(item.id)
            setExpandedId((current) => (current === item.id ? null : current))
          }}
        />
      ))}
      <p className="pt-1 font-sans text-xs text-[#6B5860] text-pretty">
        More work can be added — there&apos;s no limit on how many meaningful outcomes fit in your CEO Workday™.
      </p>
    </div>
  )
}

function TodaysWorkItemRow({
  item,
  index,
  expanded,
  onToggle,
  onRemove,
}: {
  item: CeoWorkItem
  index: number
  expanded: boolean
  onToggle: () => void
  onRemove: () => void
}) {
  const category = getCeoWorkCategory(item.category)
  const isAvailable = item.availability === "available"
  const asset = item.relatedAssetId ? getBusinessAsset(item.relatedAssetId) : null
  const [ownedBuild, setOwnedBuild] = useState<BusinessAssetBuildRecord | null>(null)
  const [showArticulation, setShowArticulation] = useState(false)
  const [showCommunicate, setShowCommunicate] = useState(false)

  // Business Articulation Training™ (Phase 4 MVP): the real content the
  // founder is currently working on — prefers what they've actually built;
  // falls back to the asset's own "what is this / why does it matter" so
  // the CTA is useful even before a build is finished.
  const articulationSource: ArticulationSourceContext | null = asset
    ? {
        sourceTitle: item.selectedOptionLabel,
        sourceKind: asset.category,
        sourceContent: ownedBuild?.generatedContent?.trim() || `${asset.whatIsThis} ${asset.whyItMatters}`,
        purpose: ARTICULATION_PURPOSE[item.category],
      }
    : null

  return (
    <div className="rounded-2xl border border-[#E8DFE2] bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span className="shrink-0 font-montserrat text-xs font-bold text-[#B7A6AE]">{index + 1}</span>

        <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-3 min-w-0 text-left">
          <span className="shrink-0 inline-flex items-center rounded-full bg-[#5A7A45]/10 px-2.5 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.08em] text-[#5A7A45]">
            {category.label}
          </span>
          <span className="min-w-0 truncate font-sans text-sm font-bold text-[#2E1F27]">
            {item.selectedOptionLabel}
          </span>
        </button>

        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.08em] ${STATUS_STYLE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>

        <span className="hidden sm:inline-flex shrink-0 items-center gap-1 font-sans text-[11px] text-[#B7A6AE]">
          {item.source === "gps" ? (
            <Sparkles className="h-3 w-3" aria-hidden />
          ) : (
            <User className="h-3 w-3" aria-hidden />
          )}
          {SOURCE_LABEL[item.source]}
        </span>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse" : "Expand"}
          className="shrink-0 rounded-full p-1.5 hover:bg-[#F4F1EC] transition-colors"
        >
          <ChevronDown className={`h-4 w-4 text-[#6B5860] transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#E8DFE2] bg-[#FAF8F5] px-4 py-5 sm:px-6">
          {isAvailable && asset ? (
            <div className="space-y-4">
              {/* Status here is driven by the REAL, saved Business Asset™ build record
                  (onOwnedBuildChange -> updateWorkItemStatus), never a manual toggle — a founder
                  can't mark a queue item "Completed" without actually finishing the build. */}
              <AssetDetailView
                asset={asset}
                instanceKey={item.instanceKey}
                instanceLabel={item.instanceKey ? item.selectedOptionLabel : undefined}
                onOwnedBuildChange={(build) => {
                  setOwnedBuild(build)
                  updateWorkItemStatus(item.id, build ? "completed" : "not-started", build?.id)
                  // Phase 3: bridge a completed Delegation Brief™ instance into its own
                  // independent Build Record™, same pattern as the existing Phase 1/2
                  // wiring above — one more line, no new engine.
                  if (item.category === "DELEGATE" && build) {
                    const record = deriveDelegationBuildRecord(build, asset, item.selectedOptionLabel)
                    void upsertBuildRecordToDb(record)
                  }
                }}
              />
              <div className="flex items-center justify-between gap-3 pt-2">
                {/* Business Articulation Training™ (Phase 4 MVP) — practice saying THIS
                    real work out loud, using its actual content. Available as soon as the
                    asset exists, regardless of build completion, so the founder never has
                    to re-enter anything they've already created. */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowArticulation(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45]/10 px-3 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/15 transition-colors"
                  >
                    <Mic className="h-3.5 w-3.5" aria-hidden />
                    Practice Communicating This
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCommunicate(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45]/10 px-3 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/15 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Communicate + Delegate™
                  </button>
                </div>
                {item.source === "barbara" ? (
                  <p className="font-sans text-xs text-[#B7A6AE]">Assigned by Barbara</p>
                ) : (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="font-sans text-xs font-bold text-[#B7A6AE] hover:text-[#C4707B] transition-colors"
                  >
                    Remove from Today&apos;s Work
                  </button>
                )}
              </div>
            </div>
          ) : (
            <ComingNextPanel item={item} onRemove={onRemove} onCommunicate={() => setShowCommunicate(true)} />
          )}
        </div>
      )}

      {articulationSource && (
        <ArticulationPracticeDialog
          open={showArticulation}
          onClose={() => setShowArticulation(false)}
          source={articulationSource}
        />
      )}

      <CommunicateDelegateDialog
        open={showCommunicate}
        onOpenChange={setShowCommunicate}
        sourceContext="ceo-workday"
        contextLabel="Working on"
        commitmentText={item.selectedOptionLabel}
        workItemId={item.planItemId ?? null}
      />
    </div>
  )
}

function ComingNextPanel({
  item,
  onRemove,
  onCommunicate,
}: {
  item: CeoWorkItem
  onRemove: () => void
  onCommunicate: () => void
}) {
  const category = getCeoWorkCategory(item.category)
  return (
    <div className="space-y-4">
      <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{category.definition}</p>
      <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
        This category&apos;s guided builder isn&apos;t available yet — it&apos;s part of the CEO Workday™
        architecture, and a real, step-by-step workflow for {category.label.toLowerCase()} work is coming next.
        {item.tangibleOutcome && <> The outcome it will produce: {item.tangibleOutcome}.</>}
      </p>
      <button
        type="button"
        onClick={onCommunicate}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45]/10 px-3 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/15 transition-colors"
      >
        <Send className="h-3.5 w-3.5" aria-hidden />
        Communicate + Delegate™
      </button>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-[#F4F1EC] px-3 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
          Coming Next
        </span>
        {item.source === "barbara" ? (
          <p className="font-sans text-xs text-[#B7A6AE]">Assigned by Barbara</p>
        ) : (
          <button
            type="button"
            onClick={onRemove}
            className="font-sans text-xs font-bold text-[#B7A6AE] hover:text-[#C4707B] transition-colors"
          >
            Remove from Today&apos;s Work
          </button>
        )}
      </div>
    </div>
  )
}
