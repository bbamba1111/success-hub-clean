"use client"

/**
 * ExecutiveReviewsClient™ — Phase 14.0
 * Orchestrates tab navigation, on-demand review generation, and display.
 * Reads / writes localStorage via the executive-reviews-store.
 */

import { useState, useCallback } from "react"
import useSWR from "swr"
import { RefreshCw, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewNav, type ReviewTab } from "@/components/executive-reviews/review-nav"
import { WeeklyReviewPanel } from "@/components/executive-reviews/weekly-review-panel"
import { MonthlyReviewPanel } from "@/components/executive-reviews/monthly-review-panel"
import { QuarterlyReviewPanel } from "@/components/executive-reviews/quarterly-review-panel"
import { ReviewArchive } from "@/components/executive-reviews/review-archive"
import {
  getExecutiveReviews,
  saveWeeklyReview,
  saveMonthlyReview,
  saveQuarterlyReview,
  EXECUTIVE_REVIEWS_UPDATED,
} from "@/lib/executive-reviews/executive-reviews-store"
import { generateWeeklyReview } from "@/lib/executive-reviews/weekly-review-engine"
import { generateMonthlyReview } from "@/lib/executive-reviews/monthly-review-engine"
import { generateQuarterlyReview } from "@/lib/executive-reviews/quarterly-review-engine"
import type { WeeklyReview, MonthlyReview, QuarterlyReview } from "@/lib/executive-reviews/types"

type ArchiveItem =
  | { kind: "weekly"; review: WeeklyReview }
  | { kind: "monthly"; review: MonthlyReview }
  | { kind: "quarterly"; review: QuarterlyReview }

export function ExecutiveReviewsClient() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("weekly")
  const [isGenerating, setIsGenerating] = useState(false)
  const [archivedItem, setArchivedItem] = useState<ArchiveItem | null>(null)

  const { data: store, mutate } = useSWR(
    "executive-reviews",
    getExecutiveReviews,
    { refreshInterval: 0 },
  )

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return
    setIsGenerating(true)
    try {
      if (activeTab === "weekly") {
        const prevScore = store?.weekly[0]?.harmonyScore.value ?? 65
        const review = generateWeeklyReview(prevScore)
        saveWeeklyReview(review)
      } else if (activeTab === "monthly") {
        const weekly = store?.weekly ?? []
        const review = generateMonthlyReview(weekly)
        saveMonthlyReview(review)
      } else if (activeTab === "quarterly") {
        const monthly = store?.monthly ?? []
        const review = generateQuarterlyReview(monthly)
        saveQuarterlyReview(review)
      }
      await mutate()
      window.dispatchEvent(new CustomEvent(EXECUTIVE_REVIEWS_UPDATED))
    } finally {
      setIsGenerating(false)
    }
  }, [activeTab, isGenerating, store, mutate])

  // Resolve the current review to display
  const weeklyReview = store?.weekly[0] ?? null
  const monthlyReview = store?.monthly[0] ?? null
  const quarterlyReview = store?.quarterly[0] ?? null

  function renderContent() {
    // Archive tab — show archive + optionally a selected review
    if (activeTab === "archive") {
      if (archivedItem) {
        return (
          <div className="space-y-4">
            <button
              onClick={() => setArchivedItem(null)}
              className="font-montserrat text-xs font-semibold text-brand-green underline-offset-2 hover:underline"
            >
              ← Back to Archive
            </button>
            {archivedItem.kind === "weekly" && <WeeklyReviewPanel review={archivedItem.review} />}
            {archivedItem.kind === "monthly" && <MonthlyReviewPanel review={archivedItem.review} />}
            {archivedItem.kind === "quarterly" && <QuarterlyReviewPanel review={archivedItem.review} />}
          </div>
        )
      }
      return (
        <ReviewArchive
          weekly={store?.weekly ?? []}
          monthly={store?.monthly ?? []}
          quarterly={store?.quarterly ?? []}
          onSelect={setArchivedItem}
        />
      )
    }

    // Empty state
    const hasReview =
      (activeTab === "weekly" && weeklyReview) ||
      (activeTab === "monthly" && monthlyReview) ||
      (activeTab === "quarterly" && quarterlyReview)

    if (!hasReview) {
      return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-black/[0.07] bg-card py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
            <ClipboardList className="h-7 w-7 text-brand-green" />
          </span>
          <div>
            <p className="font-playfair text-xl font-semibold text-brand-ink">
              No {activeTab} review yet
            </p>
            <p className="mt-1 font-montserrat text-sm text-brand-ink-soft">
              Generate your first {activeTab} Executive Review™ now.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="bg-brand-green hover:bg-brand-green/90">
            {isGenerating ? "Generating..." : `Generate ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Review`}
          </Button>
        </div>
      )
    }

    if (activeTab === "weekly" && weeklyReview) return <WeeklyReviewPanel review={weeklyReview} />
    if (activeTab === "monthly" && monthlyReview) return <MonthlyReviewPanel review={monthlyReview} />
    if (activeTab === "quarterly" && quarterlyReview) return <QuarterlyReviewPanel review={quarterlyReview} />
    return null
  }

  const canGenerate = activeTab !== "archive"
  const hasCurrentReview =
    (activeTab === "weekly" && weeklyReview) ||
    (activeTab === "monthly" && monthlyReview) ||
    (activeTab === "quarterly" && quarterlyReview)

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
          Work-Life Balance Operating System™
        </p>
        <h1 className="font-playfair text-3xl font-semibold text-brand-ink sm:text-4xl">
          Executive Review Engine™
        </h1>
        <p className="font-montserrat text-sm text-brand-ink-soft">
          Synthesised from your operating data — no manual input required.
        </p>
      </div>

      {/* Tab nav + generate button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ReviewNav active={activeTab} onChange={(tab) => { setActiveTab(tab); setArchivedItem(null) }} />
        {canGenerate && (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant={hasCurrentReview ? "outline" : "default"}
            size="sm"
            className={hasCurrentReview ? "" : "bg-brand-green hover:bg-brand-green/90 text-white"}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Generating..." : hasCurrentReview ? "Regenerate" : "Generate"}
          </Button>
        )}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
