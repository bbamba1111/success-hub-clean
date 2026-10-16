/**
 * Executive Decision Memory™ — Phase 10.2
 * ---------------------------------------------------------------------------
 * Derives a structured memory context from the founder's recommendation
 * history. This lets the GPS build on past wins rather than restart from zero.
 *
 * PURE module — reads from history store, produces a flat context object.
 * No React. No I/O.
 */

import {
  getRecommendationHistory,
  getConsecutiveCompletions,
  getLastCompletedRecommendation,
  getLastSkipReason,
  getRecentRecommendationIds,
  type SkipReason,
} from "@/lib/founder-gps/history/recommendation-history-store"

/* ===========================================================================
 * Types
 * ======================================================================== */

export interface ExecutiveMemoryContext {
  /**
   * A one-sentence acknowledgment of the founder's most recent win.
   * e.g. "You completed: Strengthen Delegation™ — your 4th consecutive day."
   */
  recentWin: string | null
  /**
   * Summary sentence of the last completed recommendation.
   * e.g. "Last completed: Design Your Evergreen Webinar™"
   */
  lastCompletedSummary: string | null
  /**
   * Whether the founder has positive momentum (≥ 2 consecutive completions).
   * When true, the GPS engine should build ON the established pattern.
   */
  hasMomentum: boolean
  /**
   * IDs of rules fired in the last 7 days.
   * Engine uses this to avoid recommending the same rule within the window.
   */
  recentRecommendationIds: string[]
  /**
   * Number of consecutive days with at least one completed recommendation.
   */
  consecutiveCompletions: number
  /**
   * The pending skip reason from the most recent skipped entry.
   * When present, the Adaptive Learning Loop™ adjusts the next recommendation.
   */
  pendingSkipReason: SkipReason | null
  /**
   * Whether the last recorded outcome was a skip (adaptive response trigger).
   */
  lastOutcomeWasSkip: boolean
}

/* ===========================================================================
 * Derivation
 * ======================================================================== */

/**
 * Derives the ExecutiveMemoryContext from the stored recommendation history.
 * Returns safe defaults when history is empty or unavailable.
 */
export function deriveExecutiveMemoryContext(): ExecutiveMemoryContext {
  const history = getRecommendationHistory()
  const consecutiveCompletions = getConsecutiveCompletions()
  const lastCompleted = getLastCompletedRecommendation()
  const pendingSkipReason = getLastSkipReason()
  const recentRecommendationIds = getRecentRecommendationIds(7)

  if (history.length === 0) {
    return {
      recentWin: null,
      lastCompletedSummary: null,
      hasMomentum: false,
      recentRecommendationIds: [],
      consecutiveCompletions: 0,
      pendingSkipReason: null,
      lastOutcomeWasSkip: false,
    }
  }

  const lastEntry = [...history].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
  const lastOutcomeWasSkip = lastEntry?.outcome === "skipped"

  // Build recentWin sentence
  let recentWin: string | null = null
  if (consecutiveCompletions >= 2 && lastCompleted) {
    recentWin =
      consecutiveCompletions >= 7
        ? `You've completed ${consecutiveCompletions} consecutive days — exceptional discipline.`
        : consecutiveCompletions >= 3
        ? `You've completed ${consecutiveCompletions} consecutive days — your momentum is building.`
        : `You completed: ${lastCompleted.recommendationTitle} — keep the momentum going.`
  } else if (lastCompleted) {
    recentWin = `You recently completed: ${lastCompleted.recommendationTitle}.`
  }

  // Build lastCompletedSummary
  const lastCompletedSummary = lastCompleted
    ? `Last completed: ${lastCompleted.recommendationTitle}`
    : null

  return {
    recentWin,
    lastCompletedSummary,
    hasMomentum: consecutiveCompletions >= 2,
    recentRecommendationIds,
    consecutiveCompletions,
    pendingSkipReason,
    lastOutcomeWasSkip,
  }
}
