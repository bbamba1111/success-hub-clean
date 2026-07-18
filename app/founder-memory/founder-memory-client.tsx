"use client"

/**
 * FounderMemoryClient — Phase 16.0
 * Single data boundary for /founder-memory. Seeds on first mount,
 * listens for store updates, and passes clean state to all sub-components.
 */

import { useState, useEffect, useCallback } from "react"
import { MemoryConciergeStrip } from "@/components/founder-memory/memory-concierge-strip"
import { FounderInsightsPanel } from "@/components/founder-memory/founder-insights-panel"
import { MemoryTimeline } from "@/components/founder-memory/memory-timeline"
import type { FounderMemory, FounderInsight, ConciergeContext } from "@/lib/founder-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { InstallationProfile } from "@/lib/installation/types"
import { FOUNDER_MEMORY_UPDATED } from "@/lib/founder-memory/founder-memory-store"

// ─── Client state ─────────────────────────────────────────────────────────────

interface PageState {
  memories: FounderMemory[]
  insights: FounderInsight[]
  concierge: ConciergeContext | null
  profile: InstallationProfile | null
}

const EMPTY_STATE: PageState = {
  memories: [],
  insights: [],
  concierge: null,
  profile: null,
}

const DEFAULT_CONCIERGE: ConciergeContext = {
  latestMilestone: null,
  recentWins: [],
  streakInfo: { days: 0, label: "No active streak yet" },
  communityPattern: null,
  scorePattern: null,
  coachingNote: "",
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FounderMemoryClient() {
  const [state, setState] = useState<PageState>(EMPTY_STATE)

  const load = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getMemoryStore } = require("@/lib/founder-memory/founder-memory-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { deriveFounderInsights } = require("@/lib/founder-memory/pattern-recognition-engine")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { buildConciergeContext } = require("@/lib/founder-memory/concierge-context")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getRecommendationHistory } = require("@/lib/founder-gps/history/recommendation-history-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getInstallationProfile } = require("@/lib/installation/installation-store")

      const { memories } = getMemoryStore()
      const gpsHistory: RecommendationHistoryEntry[] = getRecommendationHistory()
      const profile: InstallationProfile | null = getInstallationProfile()

      const insights: FounderInsight[] = deriveFounderInsights(memories, gpsHistory)
      const concierge: ConciergeContext = buildConciergeContext(memories, gpsHistory, profile)

      setState({ memories, insights, concierge, profile })
    } catch {
      // Graceful degradation — render empty state
    }
  }, [])

  useEffect(() => {
    // Seed first, then load
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { seedMemoriesFromExistingData } = require("@/lib/founder-memory/memory-seeder")
      seedMemoriesFromExistingData()
    } catch {
      // Seed not critical
    }
    load()

    const handler = () => load()
    window.addEventListener(FOUNDER_MEMORY_UPDATED, handler)
    return () => window.removeEventListener(FOUNDER_MEMORY_UPDATED, handler)
  }, [load])

  const firstName = state.profile?.founderProfile?.firstName?.trim() || "Founder"

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6">

      {/* Page header */}
      <header className="space-y-2">
        <p className="font-montserrat text-[11px] font-semibold uppercase tracking-widest text-[#C4909A]">
          Founder Memory™
        </p>
        <h1 className="font-playfair text-3xl font-semibold text-[#1C161A] sm:text-4xl">
          {firstName}&apos;s Operating Journey
        </h1>
        <p className="font-montserrat text-[14px] leading-relaxed text-gray-500">
          Every milestone, win, reflection, and decision from your journey — synthesised into
          patterns that keep Cherry Blossom&apos;s coaching grounded in your real story.
        </p>
      </header>

      {/* Cherry Blossom concierge strip */}
      {state.concierge && state.concierge.coachingNote && (
        <MemoryConciergeStrip
          context={state.concierge}
          hideTimelineCta
        />
      )}

      {/* Pattern insights */}
      <FounderInsightsPanel insights={state.insights} />

      {/* Full timeline */}
      <section className="space-y-4">
        <h2 className="font-playfair text-xl font-semibold text-[#1C161A]">
          Memory Timeline™
        </h2>
        <MemoryTimeline memories={state.memories} />
      </section>
    </main>
  )
}
