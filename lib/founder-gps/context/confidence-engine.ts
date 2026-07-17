/**
 * Confidence Engine™ — Phase 10.2
 * ---------------------------------------------------------------------------
 * Computes the GPS Confidence Score™ — how much context the engine has to
 * work with when producing its recommendation.
 *
 * Base: 40% (time + segment are always known)
 * +12% Business Context Profile™ complete
 * +10% Progress Intelligence™ (streaks / outcomes present)
 * +10% Whole-Life Context™ (events / commitments defined)
 * +10% ESA + WLB scores present
 * +8%  CEO Workday context (priorities, HZOG) installed
 * +5%  Recommendation history present (engine knows what worked)
 * +5%  Week designed
 *
 * Max: 100%
 *
 * PURE module — no React, no I/O. Safe to call from any context.
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"

/* ===========================================================================
 * Types
 * ======================================================================== */

export interface ConfidenceSignalUsed {
  /** Category label shown in the UI. */
  category: string
  /** Short description of what data was checked. */
  label: string
  /** Whether data was actually present for this category. */
  populated: boolean
  /** How many percentage points this category contributed to the total. */
  contribution: number
}

export interface RecommendationConfidence {
  /** 0–100 integer percentage. */
  score: number
  /** Human-readable confidence level. */
  level: "low" | "medium" | "high" | "very-high"
  /** Ordered list of signal categories and their contribution. */
  signalsUsed: ConfidenceSignalUsed[]
}

/* ===========================================================================
 * Confidence computation
 * ======================================================================== */

/**
 * Computes the confidence score from the assembled aggregate.
 * Accepts null aggregate and returns a low-confidence baseline safely.
 */
export function computeConfidence(
  agg: HarmonyContextAggregate | null,
): RecommendationConfidence {
  if (!agg) {
    return {
      score: 40,
      level: "low",
      signalsUsed: buildSignals(false, false, false, false, false, false, false),
    }
  }

  const hasBusinessContext =
    !!(agg.businessStage || agg.revenueStage || agg.founderRole || agg.businessModel?.length)
  const hasProgress =
    !!(agg.progress && agg.progress.nonNegotiableStreak > 0) ||
    !!(agg.progress && agg.progress.executiveOutcomesCompletedThisWeek > 0) ||
    !!(agg.progress && agg.progress.totalAssetsIdentified > 0)
  const hasWholeLife =
    agg.upcomingLifeEvents.length > 0 ||
    agg.nonNegotiableCommitmentsCount > 0 ||
    agg.activePersonalGoalsCount > 0
  const hasAssessments =
    agg.entrepreneurSuccessScore !== null || agg.workLifeBalanceScore !== null
  const hasCeoWorkday =
    !!(agg.weeklyIntention || agg.humanZoneOfGenius || agg.ceoWorkdayPriorities)
  const hasHistory = agg.recentRecommendationIds.length > 0
  const hasWeekDesigned = agg.weekDesigned

  let score = 40
  if (hasBusinessContext) score += 12
  if (hasProgress) score += 10
  if (hasWholeLife) score += 10
  if (hasAssessments) score += 10
  if (hasCeoWorkday) score += 8
  if (hasHistory) score += 5
  if (hasWeekDesigned) score += 5

  score = Math.min(100, score)

  return {
    score,
    level: scoreToLevel(score),
    signalsUsed: buildSignals(
      hasBusinessContext,
      hasProgress,
      hasWholeLife,
      hasAssessments,
      hasCeoWorkday,
      hasHistory,
      hasWeekDesigned,
    ),
  }
}

/* ===========================================================================
 * Helpers
 * ======================================================================== */

function scoreToLevel(score: number): RecommendationConfidence["level"] {
  if (score >= 95) return "very-high"
  if (score >= 80) return "high"
  if (score >= 60) return "medium"
  return "low"
}

function buildSignals(
  hasBusinessContext: boolean,
  hasProgress: boolean,
  hasWholeLife: boolean,
  hasAssessments: boolean,
  hasCeoWorkday: boolean,
  hasHistory: boolean,
  hasWeekDesigned: boolean,
): ConfidenceSignalUsed[] {
  return [
    {
      category: "Business Context\u2122",
      label: "Business stage, model, goals & challenges",
      populated: hasBusinessContext,
      contribution: hasBusinessContext ? 12 : 0,
    },
    {
      category: "Progress Intelligence\u2122",
      label: "Streaks, outcomes & daily rhythms",
      populated: hasProgress,
      contribution: hasProgress ? 10 : 0,
    },
    {
      category: "Whole-Life Context\u2122",
      label: "Life events, commitments & personal goals",
      populated: hasWholeLife,
      contribution: hasWholeLife ? 10 : 0,
    },
    {
      category: "Executive Decision Engine\u2122",
      label: "ESA & Work-Life Balance scores",
      populated: hasAssessments,
      contribution: hasAssessments ? 10 : 0,
    },
    {
      category: "CEO Workday\u2122",
      label: "Weekly intention, HZOG & priorities",
      populated: hasCeoWorkday,
      contribution: hasCeoWorkday ? 8 : 0,
    },
    {
      category: "Behavioral Intelligence\u2122",
      label: "Recommendation history & patterns",
      populated: hasHistory,
      contribution: hasHistory ? 5 : 0,
    },
    {
      category: "Week Designed\u2122",
      label: "Work-Life Balance Business Week™ installed",
      populated: hasWeekDesigned,
      contribution: hasWeekDesigned ? 5 : 0,
    },
  ]
}
