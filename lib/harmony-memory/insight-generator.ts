/**
 * Executive Insight Generator™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Pure function: synthesizes an ExecutiveInsight for a given time window.
 * Identity-narrative tone — no metrics dump, no gamification.
 * No I/O.
 */

import type {
  ExecutiveInsight,
  ExecutiveInsightPeriod,
  PatternSignal,
  PredictiveInsight,
} from "@/lib/harmony-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { CapabilityProfile } from "@/lib/executive-capability/types"

/* ===========================================================================
 * Window helpers
 * ======================================================================== */

function windowStart(period: ExecutiveInsightPeriod): string {
  const d = new Date()
  if (period === "weekly") {
    d.setDate(d.getDate() - 7)
  } else if (period === "monthly") {
    d.setDate(d.getDate() - 30)
  } else {
    d.setDate(d.getDate() - 90)
  }
  return d.toISOString().slice(0, 10)
}

function inWindow(date: string, from: string): boolean {
  return date >= from
}

/* ===========================================================================
 * Wins — from completed GPS + mastered briefings
 * ======================================================================== */

function deriveWins(
  history: RecommendationHistoryEntry[],
  capability: CapabilityProfile | null,
  from: string,
): string[] {
  const wins: string[] = []

  const completions = history.filter(
    (h) => h.outcome === "completed" && inWindow(h.date, from),
  )
  if (completions.length > 0) {
    wins.push(
      `${completions.length} GPS recommendation${completions.length === 1 ? "" : "s"} completed`,
    )
  }

  const assetsCreated = completions.filter((h) => h.businessAssetCreated)
  if (assetsCreated.length > 0) {
    wins.push(
      `${assetsCreated.length} Business Asset${assetsCreated.length === 1 ? "" : "s"}™ created`,
    )
  }

  const mastered = capability?.topicsMastered.length ?? 0
  if (mastered > 0) {
    wins.push(`Mastery progressed across ${mastered} executive briefing${mastered === 1 ? "" : "s"}`)
  }

  return wins.slice(0, 4)
}

/* ===========================================================================
 * Trends — from patterns
 * ======================================================================== */

function deriveTrends(patterns: PatternSignal[]): string[] {
  return patterns
    .filter((p) => p.strength === "confirmed" || p.strength === "strong")
    .slice(0, 3)
    .map((p) => p.description)
}

/* ===========================================================================
 * Risks — from skip patterns + broken streaks
 * ======================================================================== */

function deriveRisks(
  history: RecommendationHistoryEntry[],
  from: string,
  patterns: PatternSignal[],
): string[] {
  const risks: string[] = []

  const skips = history.filter(
    (h) => h.outcome === "skipped" && inWindow(h.date, from),
  )
  if (skips.length >= 3) {
    const topReason = (() => {
      const freq: Record<string, number> = {}
      skips.forEach((s) => { if (s.skipReason) freq[s.skipReason] = (freq[s.skipReason] ?? 0) + 1 })
      return Object.entries(freq).sort(([, a], [, b]) => b - a)[0]?.[0]
    })()
    if (topReason) {
      const labelMap: Record<string, string> = {
        "low-energy": "low energy",
        "not-enough-time": "not enough time",
        "life-happened": "life events",
        "not-relevant": "relevance gaps",
        "unexpected-opportunity": "unexpected opportunities",
        "need-more-support": "needing more support",
      }
      risks.push(`GPS flow disrupted most often by ${labelMap[topReason] ?? topReason}`)
    }
  }

  const skipPattern = patterns.find((p) => p.category === "skip-pattern" && p.strength !== "emerging")
  if (skipPattern && !risks.some((r) => r.includes("disrupted"))) {
    risks.push(skipPattern.description)
  }

  return risks.slice(0, 2)
}

/* ===========================================================================
 * Opportunities — from high-confidence predictions
 * ======================================================================== */

function deriveOpportunities(predictions: PredictiveInsight[]): string[] {
  return predictions
    .filter((p) => p.confidence >= 0.6)
    .map((p) => p.actionSuggestion ?? p.headline)
    .filter(Boolean)
    .slice(0, 2)
}

/* ===========================================================================
 * Narrative — identity-shift framing
 * ======================================================================== */

function buildNarrative(
  period: ExecutiveInsightPeriod,
  wins: string[],
  risks: string[],
  predictions: PredictiveInsight[],
  history: RecommendationHistoryEntry[],
  from: string,
): string {
  const completions = history.filter(
    (h) => h.outcome === "completed" && inWindow(h.date, from),
  ).length

  const hasTransitionSignal = predictions.some(
    (p) => p.type === "business-stage-transition",
  )
  const hasCapacitySignal = predictions.some(
    (p) => p.type === "capacity-threshold",
  )

  const periodLabel =
    period === "weekly" ? "week" : period === "monthly" ? "month" : "quarter"

  if (completions === 0) {
    return `Your Executive Operating System™ is ready when you are. The next action you take — however small — continues the compound effect.`
  }

  if (hasTransitionSignal) {
    return `This ${periodLabel} carried the signals of a founder in transition — moving from operator to architect. The work you are doing now is not just for today; it is building the infrastructure of the next stage of your business.`
  }

  if (hasCapacitySignal) {
    return `Your ${periodLabel} reveals a founder operating at high capacity — the system is running well, and the next level of leverage will come from what you choose to delegate. You are no longer just running a business; you are designing one.`
  }

  if (wins.length > 0 && risks.length === 0) {
    return `A strong ${periodLabel}. Your operating rhythm is intact, your capacity is compounding, and the foundation you are building is beginning to show its structure. Stay the course.`
  }

  if (risks.length > 0) {
    return `This ${periodLabel} held both momentum and friction — which is what building something real looks like. The interruptions are not failures; they are data. Your GPS adapts with you.`
  }

  return `Your Executive Operating System™ ran ${completions} intentional cycle${completions === 1 ? "" : "s"} this ${periodLabel}. Each one is a compounding decision in the architecture of your business.`
}

/* ===========================================================================
 * Main entry point
 * ======================================================================== */

/**
 * Generates an ExecutiveInsight for the given period.
 * Pure function — no I/O.
 */
export function generateInsight(
  period: ExecutiveInsightPeriod,
  history: RecommendationHistoryEntry[],
  patterns: PatternSignal[],
  predictions: PredictiveInsight[],
  capability: CapabilityProfile | null,
): ExecutiveInsight {
  const from = windowStart(period)

  const wins = deriveWins(history, capability, from)
  const trends = deriveTrends(patterns)
  const risks = deriveRisks(history, from, patterns)
  const opportunities = deriveOpportunities(predictions)
  const narrative = buildNarrative(period, wins, risks, predictions, history, from)

  return {
    period,
    generatedAt: new Date().toISOString(),
    wins,
    trends,
    risks,
    opportunities,
    narrative,
  }
}
