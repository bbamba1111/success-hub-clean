/**
 * Executive Review Engine™ — Types (Phase 14.0)
 * ---------------------------------------------------------------------------
 * Pure TypeScript. No React, no DOM, no Next.js.
 * Used by weekly, monthly, and quarterly review engines.
 */

// ─── Harmony Score™ ──────────────────────────────────────────────────────────

export type HarmonyScoreTrend = "up" | "down" | "flat"

export interface HarmonyScore {
  /** 0–100 composite score. */
  value: number
  /** Trend vs previous period. */
  trend: HarmonyScoreTrend
  /** Delta from previous period (+/- integer). */
  delta: number
  /** Human label for the score band. */
  band: "critical" | "developing" | "stable" | "thriving" | "flourishing"
  /** One-sentence explanation of the score. */
  rationale: string
}

// ─── Review Metric ────────────────────────────────────────────────────────────

export interface ReviewMetric {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: HarmonyScoreTrend
  delta?: number
  /** Optional Lucide icon name. */
  icon?: string
}

// ─── Review Period ────────────────────────────────────────────────────────────

export interface ReviewPeriod {
  /** "weekly" | "monthly" | "quarterly" */
  type: "weekly" | "monthly" | "quarterly"
  /** ISO date — first day of the period. */
  startDate: string
  /** ISO date — last day of the period. */
  endDate: string
  /** Human label, e.g. "Week of Jul 14, 2026". */
  label: string
  /** ISO timestamp the review was generated. */
  generatedAt: string
}

// ─── Weekly Review ────────────────────────────────────────────────────────────

export interface WeeklyReview {
  id: string
  period: ReviewPeriod
  harmonyScore: HarmonyScore
  /** Top 3 wins this week. */
  wins: string[]
  /** Key insights from GPS + adaptation patterns. */
  insights: string[]
  /** The #1 opportunity to pursue next week. */
  topOpportunity: string
  /** The #1 risk to protect against next week. */
  topRisk: string
  /** Cherry Blossom's narrative for the week. */
  cherryBlossomLetter: string
  /** Quantitative metrics. */
  metrics: ReviewMetric[]
  /** Time Freedom™ quality score (0–100). */
  timeFreedomScore: number
  /** CEO Workday™ adherence score (0–100). */
  ceoWorkdayScore: number
}

// ─── Monthly Review ───────────────────────────────────────────────────────────

export interface MonthlyReview {
  id: string
  period: ReviewPeriod
  harmonyScore: HarmonyScore
  /** Business growth narrative. */
  businessGrowthSummary: string
  /** Personal growth narrative. */
  personalGrowthSummary: string
  /** Operating rhythm consistency score (0–100). */
  rhythmConsistencyScore: number
  /** Top 3 milestones this month. */
  milestones: string[]
  /** Top 3 patterns identified. */
  patterns: string[]
  /** Cherry Blossom's monthly letter. */
  cherryBlossomLetter: string
  /** Quantitative metrics. */
  metrics: ReviewMetric[]
  /** Component weekly reviews (up to 5). */
  weeklyReviewIds: string[]
}

// ─── Quarterly Review ─────────────────────────────────────────────────────────

export interface QuarterlyReview {
  id: string
  period: ReviewPeriod
  harmonyScore: HarmonyScore
  /** Long-form strategic narrative. */
  strategicNarrative: string
  /** 3 defining moments of the quarter. */
  definingMoments: string[]
  /** 3 executive-level recommendations for next quarter. */
  executiveRecommendations: string[]
  /** Cherry Blossom's quarterly letter. */
  cherryBlossomLetter: string
  /** Quantitative metrics. */
  metrics: ReviewMetric[]
  /** Component monthly reviews. */
  monthlyReviewIds: string[]
}

// ─── Stored Reviews ───────────────────────────────────────────────────────────

export interface ExecutiveReviewsStore {
  weekly: WeeklyReview[]
  monthly: MonthlyReview[]
  quarterly: QuarterlyReview[]
  lastGeneratedAt: string | null
}
