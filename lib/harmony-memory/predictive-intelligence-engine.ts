/**
 * Predictive Intelligence Engine™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Pure function: derives PredictiveInsight[] from patterns + aggregate.
 * Returns at most 3 insights with confidence ≥ 0.4.
 */

import type { PredictiveInsight, PatternSignal } from "@/lib/harmony-memory/types"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"

const MIN_CONFIDENCE = 0.4
const MAX_PREDICTIONS = 3

/* ===========================================================================
 * 1 — Capacity threshold (consecutive completions → hiring signal)
 * ======================================================================== */

function capacityThresholdPrediction(
  agg: HarmonyContextAggregate,
  history: RecommendationHistoryEntry[],
): PredictiveInsight | null {
  const consecutive = agg.consecutiveCompletions
  const completions = history.filter((h) => h.outcome === "completed").length

  // Only fires when founder is highly consistent but has no team
  if (consecutive < 14 || completions < 30) return null
  if (agg.teamSize !== "solo" && agg.teamSize !== null) return null

  return {
    id: "capacity-threshold",
    type: "capacity-threshold",
    headline: "Your consistency signals a capacity ceiling approaching.",
    rationale:
      "Founders who sustain 14+ consecutive GPS completions while operating solo typically hit a capacity ceiling within 4–6 weeks.",
    confidence: Math.min(0.9, 0.5 + consecutive * 0.015),
    actionSuggestion: "Review your People & Culture Executive™ findings on delegation readiness.",
    actionHref: "/my-harmony",
  }
}

/* ===========================================================================
 * 2 — Asset completion forecast
 * ======================================================================== */

function assetCompletionForecast(
  history: RecommendationHistoryEntry[],
): PredictiveInsight | null {
  const withAsset = history.filter((h) => h.businessAssetCreated)
  if (withAsset.length < 3) return null

  // Compute average cadence in days
  const dates = withAsset.map((h) => new Date(h.date).getTime()).sort()
  const intervals: number[] = []
  for (let i = 1; i < dates.length; i++) {
    intervals.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24))
  }
  const avgDays = intervals.reduce((a, b) => a + b, 0) / intervals.length

  if (avgDays > 30) return null

  const nextForecastDate = new Date()
  nextForecastDate.setDate(nextForecastDate.getDate() + Math.round(avgDays))

  return {
    id: "asset-completion-forecast",
    type: "asset-completion-forecast",
    headline: `At your current pace, your next Business Asset™ will be ready within ${Math.round(avgDays)} days.`,
    rationale: `You've been building assets every ${Math.round(avgDays)} days on average — compounding is accelerating.`,
    confidence: 0.7,
    relevantDate: nextForecastDate.toISOString().slice(0, 10),
    actionSuggestion: "Keep your current cadence — the asset chain compounds automatically.",
  }
}

/* ===========================================================================
 * 3 — Seasonal focus risk
 * ======================================================================== */

function seasonalFocusRisk(
  history: RecommendationHistoryEntry[],
): PredictiveInsight | null {
  if (history.length < 30) return null

  const today = new Date()
  const thisMonth = today.getMonth()

  // Check same month last year for skips
  const sameMonthLastYear = history.filter((h) => {
    const d = new Date(h.date)
    return d.getMonth() === thisMonth && d.getFullYear() === today.getFullYear() - 1
  })

  const skipRate =
    sameMonthLastYear.length > 0
      ? sameMonthLastYear.filter((h) => h.outcome === "skipped").length /
        sameMonthLastYear.length
      : 0

  if (skipRate < 0.4 || sameMonthLastYear.length < 3) return null

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  return {
    id: "seasonal-focus-risk",
    type: "seasonal-focus-risk",
    headline: `${MONTH_NAMES[thisMonth]} historically disrupts your GPS focus.`,
    rationale: `Last year in ${MONTH_NAMES[thisMonth]}, your GPS skip rate was ${Math.round(skipRate * 100)}%. Your system is already adapting.`,
    confidence: 0.6 + skipRate * 0.2,
    actionSuggestion: "Design lighter GPS routes for this period to protect Human Sustainability™.",
  }
}

/* ===========================================================================
 * 4 — CEO Workday protection need
 * ======================================================================== */

function ceoWorkdayProtectionPrediction(
  agg: HarmonyContextAggregate,
  patterns: PatternSignal[],
): PredictiveInsight | null {
  if (!agg.inLifeProtectionMode && !agg.hasEventRequiringPreparation) return null

  const lifeImpactPattern = patterns.find((p) => p.category === "life-event-impact")
  if (!lifeImpactPattern) return null

  return {
    id: "ceo-workday-protection",
    type: "ceo-workday-protection",
    headline: "A significant life event is approaching — protect your CEO Workday™ now.",
    rationale:
      "Historical patterns show life events reduce your GPS focus significantly. Pre-protecting your time blocks now prevents disruption.",
    confidence: 0.75,
    actionSuggestion: "Design your next 3 CEO Workdays™ in advance.",
    actionHref: "/live-today",
  }
}

/* ===========================================================================
 * 5 — Business stage transition signal
 * ======================================================================== */

function businessStageTransitionPrediction(
  agg: HarmonyContextAggregate,
  history: RecommendationHistoryEntry[],
): PredictiveInsight | null {
  const assetsCreated = history.filter((h) => h.businessAssetCreated).length
  const completions = history.filter((h) => h.outcome === "completed").length
  const consecutive = agg.consecutiveCompletions

  // Stage: launch → growth
  if (
    agg.businessStage === "launch" &&
    assetsCreated >= 3 &&
    completions >= 20 &&
    consecutive >= 7
  ) {
    return {
      id: "stage-transition-launch-to-growth",
      type: "business-stage-transition",
      headline: "Your signals point toward a Growth Stage™ transition.",
      rationale:
        "The combination of consistent CEO Workday™ completion, assets building, and operating rhythm suggests you're ready to move from Launch to Growth Stage.",
      confidence: 0.65,
      actionSuggestion: "Update your Business Stage™ in Business Context™ to unlock Growth-stage GPS recommendations.",
      actionHref: "/business-context?from=/my-harmony",
    }
  }

  return null
}

/* ===========================================================================
 * Main entry point
 * ======================================================================== */

/**
 * Derives up to 3 high-confidence predictive insights.
 * Pure function — no I/O.
 * agg may be null when called outside a HarmonyContextValue scope (e.g. My Harmony dashboard);
 * predictions that require the aggregate are skipped gracefully.
 */
export function derivePredictions(
  patterns: PatternSignal[],
  agg: HarmonyContextAggregate | null,
  history: RecommendationHistoryEntry[],
): PredictiveInsight[] {
  const candidates: Array<PredictiveInsight | null> = [
    agg ? capacityThresholdPrediction(agg, history) : null,
    assetCompletionForecast(history),
    seasonalFocusRisk(history),
    agg ? ceoWorkdayProtectionPrediction(agg, patterns) : null,
    agg ? businessStageTransitionPrediction(agg, history) : null,
  ]

  return candidates
    .filter((p): p is PredictiveInsight => p !== null && p.confidence >= MIN_CONFIDENCE)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, MAX_PREDICTIONS)
}
