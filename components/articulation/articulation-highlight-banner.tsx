"use client"

/**
 * Business Articulation Training™ — Highlight Banner (Phase 4 MVP)
 * ---------------------------------------------------------------------------
 * "Think it. Build it. Say it brilliantly." A minimal, always-visible entry
 * point into articulation practice from the top of the CEO Workday™ —
 * `PRACTICE WHAT I'M WORKING ON` uses the founder's most recent real
 * Today's Work™ item (the same source-derivation the per-item CTA in
 * `todays-work-queue.tsx` uses) so the founder never has to pick a source
 * or re-enter anything.
 *
 * Per the approved MVP scope, this is deliberately small — a real, working
 * capability surfaced honestly, NOT a redesigned workspace. A full visual
 * treatment is a later phase.
 */

import { useEffect, useState } from "react"
import { Mic, Sparkles } from "lucide-react"

import { getTodaysWork, TODAYS_WORK_EVENT } from "@/lib/ceo-workday/todays-work-store"
import type { CeoWorkItem } from "@/lib/ceo-workday/types"
import { getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { getLatestCompletedBuildForAsset } from "@/utils/business-asset-build-storage"
import { ARTICULATION_PURPOSE } from "@/lib/articulation/purpose"
import {
  ArticulationPracticeDialog,
  type ArticulationSourceContext,
} from "@/components/articulation/articulation-practice-dialog"

/** The most recently updated Today's Work™ item that has real, communicable content — an available item backed by a Business Asset™. */
function findMostRecentArticulatableItem(items: CeoWorkItem[]): CeoWorkItem | null {
  const candidates = items.filter((item) => item.availability === "available" && item.relatedAssetId)
  if (candidates.length === 0) return null
  return [...candidates].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0]
}

export function ArticulationHighlightBanner() {
  const [item, setItem] = useState<CeoWorkItem | null>(null)
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<ArticulationSourceContext | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function refresh() {
      setItem(findMostRecentArticulatableItem(getTodaysWork()))
    }
    refresh()
    window.addEventListener(TODAYS_WORK_EVENT, refresh)
    return () => window.removeEventListener(TODAYS_WORK_EVENT, refresh)
  }, [])

  async function openPractice() {
    if (!item?.relatedAssetId) return
    const asset = getBusinessAsset(item.relatedAssetId)
    if (!asset) return

    setLoading(true)
    const build = await getLatestCompletedBuildForAsset(item.relatedAssetId, item.instanceKey)
    setLoading(false)

    setSource({
      sourceTitle: item.selectedOptionLabel,
      sourceKind: asset.category,
      sourceContent: build?.generatedContent?.trim() || `${asset.whatIsThis} ${asset.whyItMatters}`,
      purpose: ARTICULATION_PURPOSE[item.category],
    })
    setOpen(true)
  }

  return (
    <div className="rounded-2xl border border-[#5A7A45]/20 bg-[#5A7A45]/[0.06] px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5A7A45]/15">
            <Sparkles className="h-4 w-4 text-[#5A7A45]" aria-hidden />
          </span>
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
              Business Articulation Training™
            </p>
            <p className="mt-0.5 font-sans text-sm text-[#3A2E33] text-pretty">
              Think it. Build it. Say it brilliantly.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openPractice}
          disabled={!item || loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#5A7A45] px-4 py-2.5 font-montserrat text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#4A6A38] disabled:cursor-not-allowed disabled:bg-[#B7A6AE]"
        >
          <Mic className="h-3.5 w-3.5" aria-hidden />
          {loading ? "Loading…" : "Practice What I'm Working On"}
        </button>
      </div>
      {!item && (
        <p className="mt-3 font-sans text-xs text-[#6B5860] text-pretty">
          Queue something in Today&apos;s Work below, and you&apos;ll be able to practice communicating it here.
        </p>
      )}

      {source && (
        <ArticulationPracticeDialog open={open} onClose={() => setOpen(false)} source={source} />
      )}
    </div>
  )
}
