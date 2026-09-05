/**
 * Milestone Engine™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Pure function: reads all stores → ExecutiveMilestone[].
 * Returns the full milestone list with earned status.
 * No I/O — pure computation.
 */

import type { ExecutiveMilestone } from "@/lib/harmony-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { ExecutiveMemoryEntry } from "@/lib/executive-office/executive-memory-store"
import type { CapabilityProfile } from "@/lib/executive-capability/types"

/* ===========================================================================
 * Milestone definitions
 * ======================================================================== */

const MILESTONE_DEFINITIONS: Omit<ExecutiveMilestone, "achievedAt" | "earned">[] = [
  // First actions
  {
    id: "first-gps-completion",
    category: "first-action",
    label: "First GPS Completion",
    celebrationNote: "You took the first step. The Harmony Lane™ operating system is now running.",
  },
  {
    id: "first-business-asset",
    category: "first-action",
    label: "First Business Asset™ Created",
    celebrationNote: "Your first compounding asset is in the world. This is how businesses outlast their founders.",
  },
  {
    id: "first-briefing-mastered",
    category: "learning",
    label: "First Executive Briefing Mastered",
    celebrationNote: "Capability grows through action. You just proved that.",
  },
  {
    id: "first-deferred-to-completed",
    category: "recovery",
    label: "First Deferred Recovery",
    celebrationNote: "You deferred — then came back and completed. That is what executive resilience looks like.",
  },
  // Streaks
  {
    id: "gps-streak-7",
    category: "streak",
    label: "7-Day GPS Streak",
    celebrationNote: "Seven consecutive days of intentional operating. The rhythm is yours now.",
  },
  {
    id: "gps-streak-30",
    category: "streak",
    label: "30-Day GPS Streak",
    celebrationNote: "A full month of Executive Operating Rhythm™. You are building something real.",
  },
  {
    id: "ceo-workday-10",
    category: "executive-workday",
    label: "10 Consecutive CEO Workdays™",
    celebrationNote: "Ten protected CEO Workdays™ in a row. The business is getting your best thinking consistently.",
  },
  // Volume
  {
    id: "gps-completions-25",
    category: "volume",
    label: "25 GPS Completions",
    celebrationNote: "Twenty-five intentional operating decisions. The compound effect is building.",
  },
  {
    id: "gps-completions-100",
    category: "volume",
    label: "100 GPS Completions",
    celebrationNote: "One hundred. You have built an executive operating practice.",
  },
  // Learning volume
  {
    id: "briefings-mastered-10",
    category: "learning",
    label: "10 Briefings Mastered",
    celebrationNote: "Ten capability domains strengthened. Your Executive IQ is compounding.",
  },
  {
    id: "briefings-mastered-25",
    category: "learning",
    label: "25 Briefings Mastered",
    celebrationNote: "Twenty-five briefings. You are operating with the knowledge of a full executive team.",
  },
  // Executive wins
  {
    id: "first-executive-win",
    category: "first-action",
    label: "First Executive Win™",
    celebrationNote: "Your Executive Office™ produced a finding you acted on. That is the system working.",
  },
]

/* ===========================================================================
 * Earning logic — pure predicates
 * ======================================================================== */

function isMilestoneEarned(
  id: string,
  gpsHistory: RecommendationHistoryEntry[],
  execMemory: ExecutiveMemoryEntry[],
  capability: CapabilityProfile | null,
): { earned: boolean; achievedAt: string | null } {

  const completions = gpsHistory.filter((h) => h.outcome === "completed")
  const completionCount = completions.length

  switch (id) {
    case "first-gps-completion": {
      if (completionCount === 0) return { earned: false, achievedAt: null }
      return { earned: true, achievedAt: completions[0].timestamp }
    }

    case "first-business-asset": {
      const first = gpsHistory.find((h) => h.businessAssetCreated)
      return { earned: !!first, achievedAt: first?.timestamp ?? null }
    }

    case "first-briefing-mastered": {
      const mastered = capability?.topicsMastered ?? []
      if (mastered.length === 0) return { earned: false, achievedAt: null }
      return { earned: true, achievedAt: capability?.lastUpdated ?? new Date().toISOString() }
    }

    case "first-deferred-to-completed": {
      const deferredIds = new Set(
        gpsHistory.filter((h) => h.outcome === "deferred").map((h) => h.id),
      )
      const recovered = gpsHistory.find(
        (h) => h.outcome === "completed" && deferredIds.has(h.id),
      )
      return { earned: !!recovered, achievedAt: recovered?.timestamp ?? null }
    }

    case "gps-streak-7": {
      if (completionCount < 7) return { earned: false, achievedAt: null }
      // Check if any 7 consecutive days of completions exist
      const dateSet = new Set(completions.map((h) => h.date))
      const sorted = Array.from(dateSet).sort()
      for (let i = 6; i < sorted.length; i++) {
        const seventhDate = new Date(sorted[i])
        const firstDate = new Date(sorted[i - 6])
        const diff = (seventhDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        if (diff === 6) {
          const achievedEntry = completions.find((h) => h.date === sorted[i])
          return { earned: true, achievedAt: achievedEntry?.timestamp ?? null }
        }
      }
      return { earned: false, achievedAt: null }
    }

    case "gps-streak-30": {
      if (completionCount < 30) return { earned: false, achievedAt: null }
      const dateSet = new Set(completions.map((h) => h.date))
      const sorted = Array.from(dateSet).sort()
      for (let i = 29; i < sorted.length; i++) {
        const thirtiethDate = new Date(sorted[i])
        const firstDate = new Date(sorted[i - 29])
        const diff = (thirtiethDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        if (diff === 29) {
          const achievedEntry = completions.find((h) => h.date === sorted[i])
          return { earned: true, achievedAt: achievedEntry?.timestamp ?? null }
        }
      }
      return { earned: false, achievedAt: null }
    }

    case "ceo-workday-10": {
      const ceoCompletions = completions.filter((h) => h.segmentId === "ceo-workday")
      if (ceoCompletions.length < 10) return { earned: false, achievedAt: null }
      const dateSet = new Set(ceoCompletions.map((h) => h.date))
      const sorted = Array.from(dateSet).sort()
      for (let i = 9; i < sorted.length; i++) {
        const tenth = new Date(sorted[i])
        const first = new Date(sorted[i - 9])
        const diff = (tenth.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
        if (diff === 9) {
          const achievedEntry = ceoCompletions.find((h) => h.date === sorted[i])
          return { earned: true, achievedAt: achievedEntry?.timestamp ?? null }
        }
      }
      return { earned: false, achievedAt: null }
    }

    case "gps-completions-25":
      if (completionCount < 25) return { earned: false, achievedAt: null }
      return { earned: true, achievedAt: completions[24].timestamp }

    case "gps-completions-100":
      if (completionCount < 100) return { earned: false, achievedAt: null }
      return { earned: true, achievedAt: completions[99].timestamp }

    case "briefings-mastered-10": {
      const count = capability?.topicsMastered.length ?? 0
      if (count < 10) return { earned: false, achievedAt: null }
      return { earned: true, achievedAt: capability?.lastUpdated ?? null }
    }

    case "briefings-mastered-25": {
      const count = capability?.topicsMastered.length ?? 0
      if (count < 25) return { earned: false, achievedAt: null }
      return { earned: true, achievedAt: capability?.lastUpdated ?? null }
    }

    case "first-executive-win": {
      const actioned = execMemory.find((e) => e.outcome === "actioned")
      return { earned: !!actioned, achievedAt: actioned?.timestamp ?? null }
    }

    default:
      return { earned: false, achievedAt: null }
  }
}

/* ===========================================================================
 * Main entry point
 * ======================================================================== */

/**
 * Returns the full milestone list with earned status computed from stores.
 * Pure function — no I/O.
 */
export function deriveEarnedMilestones(
  gpsHistory: RecommendationHistoryEntry[],
  execMemory: ExecutiveMemoryEntry[],
  capability: CapabilityProfile | null,
): ExecutiveMilestone[] {
  return MILESTONE_DEFINITIONS.map((def) => {
    const { earned, achievedAt } = isMilestoneEarned(
      def.id,
      gpsHistory,
      execMemory,
      capability,
    )
    return { ...def, earned, achievedAt }
  })
}
