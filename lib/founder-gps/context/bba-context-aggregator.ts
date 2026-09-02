"use server"

/**
 * Founder GPS™ — Business Bottleneck Audit™ (BBA™) Context Aggregator
 * ---------------------------------------------------------------------------
 * Distills the founder's BBA baseline + recent weekly measurements into a
 * flat, GPS-safe `BbaSignalSummary` — the same "assemble once, pattern-match
 * over a flat object" shape as `harmony-context-aggregator.ts`'s
 * `HarmonyContextAggregate` and `progress-intelligence.ts`'s `ProgressSummary`.
 *
 * SCOPE (per approved BBA architecture):
 *   BBA data → structured Supabase data → GPS retrieval → existing GPS
 *   recommendation pipeline. This module does the retrieval + distillation.
 *   It does NOT rank, score, or choose a recommendation itself — that
 *   remains `next-best-move-engine.ts`'s job. Where a signal below has no
 *   consuming rule yet, it is still computed and exposed (never dropped),
 *   with the gap documented at the call site in `deriveActiveGpsSignals()`.
 *
 * Server-only reads under the hood (via bba-server.ts, which requires a
 * Supabase server client) — but this module itself is `"use server"`, so
 * `getBbaSignalSummary()` is a Server Action and may be called directly
 * from client components (e.g. `HarmonyProvider`) as well as other server
 * contexts (route handlers, server actions, server components).
 */

import {
  getCurrentBbaBaselineServer,
  getRecentBbaCheckinsServer,
  getThisWeeksBbaCheckinServer,
} from "@/lib/business-bottleneck-audit/bba-server"
import { BBA_CATEGORIES } from "@/lib/business-bottleneck-audit/bba-registry"
import type { BbaCategoryId } from "@/lib/business-bottleneck-audit/types"

export interface BbaSignalSummary {
  /** True once the founder has any BBA baseline on file. */
  hasBaseline: boolean
  /** ISO timestamp of the current baseline, if any. */
  baselineCompletedAt: string | null

  /**
   * Category ids where the founder's ownership answer was "no-one-owns-it"
   * or "other" with no clear owner — GPS's clearest "who should build this"
   * gap signal. Derived directly from `<categoryId>.ownership` answers.
   */
  unownedCategoryIds: BbaCategoryId[]

  /** True when 3+ categories have no clear owner — a systemic delegation gap, not a one-off. */
  hasWidespreadOwnershipGap: boolean

  /** Whether the founder has completed a weekly check-in for the current week. */
  hasThisWeeksCheckin: boolean
  /** Bottlenecks cleared this week, if measured. */
  bottlenecksClearedThisWeek: number | null
  /** Status of last week's Business Building Assignment, if reported. */
  lastAssignmentStatus: string | null
  /** True when the last 2+ weekly check-ins report a blocked/incomplete assignment — a persistent execution-friction signal. */
  assignmentRepeatedlyBlocked: boolean
  /** True when the founder reported ANY business-asset created/communicated/in-use this week. */
  reportedBusinessAssetActivity: boolean
  /** Stakeholder/investor/reporting deadlines the founder flagged as upcoming, across the current week's check-in. */
  upcomingStakeholderDeadlineCount: number
}

const BLOCKED_ASSIGNMENT_STATUSES = new Set(["not-started", "started-not-completed"])

/**
 * Assembles the BBA signal summary for one founder. Safe to call from any
 * server context (route handlers, server actions, server components).
 * Degrades gracefully — a founder with no BBA data yet gets
 * `hasBaseline: false` and every other field at its safe default, never a
 * thrown error, matching the rest of the GPS context layer's contract.
 */
export async function getBbaSignalSummary(userId: string): Promise<BbaSignalSummary> {
  const baseline = await getCurrentBbaBaselineServer(userId)
  const thisWeek = await getThisWeeksBbaCheckinServer(userId)
  const recentWeeks = await getRecentBbaCheckinsServer(userId, 4)

  const unownedCategoryIds: BbaCategoryId[] = []
  if (baseline) {
    for (const category of BBA_CATEGORIES) {
      if (!category.hasOwnershipQuestion) continue
      const answer = baseline.responses[`${category.id}.ownership`]
      if (answer === "no-one-owns-it" || answer === "other") {
        unownedCategoryIds.push(category.id)
      }
    }
  }

  const recentBlockedCount = recentWeeks.filter(
    (week) => week.assignmentStatus && BLOCKED_ASSIGNMENT_STATUSES.has(week.assignmentStatus),
  ).length

  return {
    hasBaseline: baseline !== null,
    baselineCompletedAt: baseline?.completedAt ?? null,

    unownedCategoryIds,
    hasWidespreadOwnershipGap: unownedCategoryIds.length >= 3,

    hasThisWeeksCheckin: Boolean(thisWeek?.completedAt),
    bottlenecksClearedThisWeek: thisWeek?.bottlenecksClearedCount ?? null,
    lastAssignmentStatus: thisWeek?.assignmentStatus ?? null,
    assignmentRepeatedlyBlocked: recentBlockedCount >= 2,
    reportedBusinessAssetActivity: (thisWeek?.businessAssets.length ?? 0) > 0,
    upcomingStakeholderDeadlineCount:
      thisWeek?.stakeholderDeadlines.filter((d) => d.status === "upcoming").length ?? 0,
  }
}
