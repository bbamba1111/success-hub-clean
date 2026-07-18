"use client"

/**
 * ExecutiveHeadquartersClient — Phase 15.2
 * ---------------------------------------------------------------------------
 * Top-level client orchestrator for /headquarters.
 * Reads all providers + localStorage stores in one place and passes
 * derived state as props to every pure sub-component.
 * No hooks live inside sub-components — this is the single data boundary.
 */

import { useState, useEffect } from "react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useHarmonyWeek } from "@/components/harmony-week/harmony-week-provider"
import { HQWelcomeBanner } from "./hq-welcome-banner"
import { HQSnapshotGrid } from "./hq-snapshot-grid"
import { HQExecutiveFocus } from "./hq-executive-focus"
import { HQOperatingRhythm } from "./hq-operating-rhythm"
import { HQUpcomingEvents } from "./hq-upcoming-events"
import { HQExecutiveReview } from "./hq-executive-review"
import { HQFounderJourney } from "./hq-founder-journey"
import { HQCelebrate } from "./hq-celebrate"
import { HQQuickActions } from "./hq-quick-actions"
import { HQTimeFreedomMode } from "./hq-time-freedom-mode"
import type { WeeklyReview } from "@/lib/executive-reviews/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { InstallationProfile } from "@/lib/installation/types"

// ─── Derived state loaded from localStorage stores ───────────────────────────

interface ClientState {
  latestReview: WeeklyReview | null
  harmonyScore: number | null
  scoreTrend: "up" | "down" | "flat" | null
  latestFocus: RecommendationHistoryEntry | null
  gpsCount: number
  adaptationCount: number
  reviewCount: number
  profile: InstallationProfile | null
}

const EMPTY: ClientState = {
  latestReview: null,
  harmonyScore: null,
  scoreTrend: null,
  latestFocus: null,
  gpsCount: 0,
  adaptationCount: 0,
  reviewCount: 0,
  profile: null,
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ExecutiveHeadquartersClient() {
  const experience = useOperatingEngine()
  const harmonyWeek = useHarmonyWeek()
  const [state, setState] = useState<ClientState>(EMPTY)

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getLatestWeeklyReview, getExecutiveReviews } = require("@/lib/executive-reviews/executive-reviews-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getRecommendationHistory } = require("@/lib/founder-gps/history/recommendation-history-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getAdaptationHistory } = require("@/lib/adaptive-workspace/adaptation-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getInstallationProfile } = require("@/lib/installation/installation-store")

      const latestReview: WeeklyReview | null = getLatestWeeklyReview()
      const reviews = getExecutiveReviews()
      const gpsHistory: RecommendationHistoryEntry[] = getRecommendationHistory()
      const adaptHistory = getAdaptationHistory()
      const profile: InstallationProfile | null = getInstallationProfile()

      // Score trend: compare latest two weekly reviews
      let scoreTrend: "up" | "down" | "flat" | null = null
      if (reviews.weekly.length >= 2) {
        const diff = reviews.weekly[0].harmonyScore.overall - reviews.weekly[1].harmonyScore.overall
        scoreTrend = diff > 0 ? "up" : diff < 0 ? "down" : "flat"
      } else if (reviews.weekly.length === 1) {
        scoreTrend = "flat"
      }

      // Latest focus: most recent completed or accepted GPS entry
      const latestFocus =
        [...gpsHistory].reverse().find((h) => h.outcome === "completed" || h.outcome === "accepted") ?? null

      setState({
        latestReview,
        harmonyScore: latestReview?.harmonyScore.overall ?? null,
        scoreTrend,
        latestFocus,
        gpsCount: gpsHistory.filter((h) => h.outcome === "completed").length,
        adaptationCount: adaptHistory.length,
        reviewCount: reviews.weekly.length + reviews.monthly.length + reviews.quarterly.length,
        profile,
      })
    } catch {
      // localStorage unavailable — render with empty state
    }
  }, [])

  const accentColor = harmonyWeek?.accent.color ?? "#5D9D61"
  const isTimeFreedom = harmonyWeek?.isTimeFreedomNow ?? false
  const streak = experience?.member.streak ?? 0

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">

      {/* Welcome banner — always visible */}
      <HQWelcomeBanner
        experience={experience}
        harmonyWeek={harmonyWeek}
        harmonyScore={state.harmonyScore}
        scoreTrend={state.scoreTrend}
      />

      {isTimeFreedom ? (
        /* ── TIME FREEDOM™ LAYOUT ───────────────────────────────────────── */
        <>
          <HQTimeFreedomMode harmonyWeek={harmonyWeek} />
          <HQCelebrate
            completions={state.gpsCount}
            adaptations={state.adaptationCount}
            reviews={state.reviewCount}
            streak={streak}
            accentColor={accentColor}
          />
          <HQQuickActions />
        </>
      ) : (
        /* ── BUSINESS DAY LAYOUT ────────────────────────────────────────── */
        <>
          {/* Row 1: Snapshot grid */}
          <HQSnapshotGrid
            experience={experience}
            harmonyWeek={harmonyWeek}
            harmonyScore={state.harmonyScore}
            latestReview={state.latestReview}
          />

          {/* Row 2: Executive Focus + Operating Rhythm */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <HQExecutiveFocus latestFocus={state.latestFocus} accentColor={accentColor} />
            <HQOperatingRhythm harmonyWeek={harmonyWeek} />
          </div>

          {/* Row 3: Upcoming Events */}
          <HQUpcomingEvents />

          {/* Row 4: Executive Review + Founder Journey */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <HQExecutiveReview latestReview={state.latestReview} accentColor={accentColor} />
            <HQFounderJourney
              profile={state.profile}
              hasGpsHistory={state.gpsCount > 0}
              hasReview={state.reviewCount > 0}
              accentColor={accentColor}
            />
          </div>

          {/* Row 5: Celebrate */}
          <HQCelebrate
            completions={state.gpsCount}
            adaptations={state.adaptationCount}
            reviews={state.reviewCount}
            streak={streak}
            accentColor={accentColor}
          />

          {/* Row 6: Quick Actions */}
          <HQQuickActions />
        </>
      )}
    </main>
  )
}
