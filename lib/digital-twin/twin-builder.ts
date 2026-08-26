/**
 * Founder Digital Twin™ — Twin Builder (Phase 11.0)
 * ---------------------------------------------------------------------------
 * Pure function. Assembles a FounderTwinProfile from all available stores.
 * No I/O — all inputs are passed in as parameters.
 */

import type { FounderTwinProfile, PatternSummary } from "@/lib/digital-twin/types"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { CapabilityProfile } from "@/lib/executive-capability/types"
import type { PatternSignal } from "@/lib/harmony-memory/types"

/* ===========================================================================
 * Behavioral metrics from history
 * ======================================================================== */

function deriveCompletionRate(history: RecommendationHistoryEntry[]): number {
  const recent = history.filter((h) => {
    const d = new Date(h.date)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 90)
    return d >= cutoff
  })
  if (recent.length === 0) return 0
  const completed = recent.filter((h) => h.outcome === "completed").length
  return Math.round((completed / recent.length) * 100)
}

function deriveSkipRate(history: RecommendationHistoryEntry[]): number {
  const recent = history.filter((h) => {
    const d = new Date(h.date)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 90)
    return d >= cutoff
  })
  if (recent.length === 0) return 0
  const skipped = recent.filter((h) => h.outcome === "skipped").length
  return Math.round((skipped / recent.length) * 100)
}

function deriveAverageConfidence(history: RecommendationHistoryEntry[]): number {
  // Use completion rate as a proxy for confidence since confidence isn't stored per-entry
  // 70+ completion rate → high confidence; <30 → low
  const rate = deriveCompletionRate(history)
  return rate
}

function deriveConsecutiveCompletions(history: RecommendationHistoryEntry[]): number {
  if (history.length === 0) return 0
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  const seen = new Set<string>()
  for (const entry of sorted) {
    if (entry.outcome === "completed" && !seen.has(entry.date)) {
      seen.add(entry.date)
      streak++
    } else if (!seen.has(entry.date) && entry.outcome !== "completed") {
      break
    }
  }
  return streak
}

function deriveRecentWin(history: RecommendationHistoryEntry[]): string | null {
  const last = [...history].reverse().find((h) => h.outcome === "completed")
  return last?.recommendationTitle ?? null
}

/* ===========================================================================
 * Capability metrics
 * ======================================================================== */

function deriveTopCapabilityDomain(capability: CapabilityProfile | null): string | null {
  if (!capability) return null
  const dims = capability.dimensions
  let topKey: string | null = null
  let topVal = 0
  for (const [key, val] of Object.entries(dims)) {
    if (val > topVal) {
      topVal = val
      topKey = key
    }
  }
  return topKey
}

/* ===========================================================================
 * Pattern metrics
 * ======================================================================== */

function toPatternSummaries(signals: PatternSignal[]): PatternSummary[] {
  return signals
    .filter((s) => s.strength === "confirmed" || s.strength === "strong")
    .map((s) => ({
      category: s.category,
      strength: s.strength,
      description: s.description,
      evidenceCount: s.evidenceCount,
    }))
}

function deriveStrongestDay(signals: PatternSignal[]): string | null {
  const cadence = signals.filter((s) => s.category === "completion-cadence")
  if (cadence.length === 0) return null
  const top = cadence.sort((a, b) => b.evidenceCount - a.evidenceCount)[0]
  return top.contextHint ?? null
}

function deriveDominantSegment(signals: PatternSignal[]): string | null {
  // Use "completion-cadence" as proxy for dominant segment — contextHint holds day-of-week or segment name
  const affinity = signals.filter((s) => s.category === "completion-cadence")
  if (affinity.length === 0) return null
  const top = affinity.sort((a, b) => b.evidenceCount - a.evidenceCount)[0]
  return top.contextHint ?? null
}

/* ===========================================================================
 * Data completeness score
 * ======================================================================== */

function dataCompleteness(
  agg: HarmonyContextAggregate,
  capability: CapabilityProfile | null,
  history: RecommendationHistoryEntry[],
): number {
  let filled = 0
  const total = 10
  if (agg.businessStage) filled++
  if (agg.teamSize) filled++
  if (agg.revenueStage) filled++
  if (agg.founderRole) filled++
  if (capability && capability.topicsMastered.length > 0) filled++
  if (history.length >= 5) filled++
  if (history.length >= 15) filled++
  if (agg.platformEngagementDays >= 7) filled++
  if (agg.patternSignals && agg.patternSignals.length > 0) filled++
  if (agg.operatingMode) filled++
  return Math.round((filled / total) * 100)
}

/* ===========================================================================
 * Main builder
 * ======================================================================== */

export function buildFounderTwinProfile(
  agg: HarmonyContextAggregate,
  history: RecommendationHistoryEntry[],
  capability: CapabilityProfile | null,
  patterns: PatternSignal[],
): FounderTwinProfile {
  const confirmedPatterns = toPatternSummaries(patterns)

  return {
    generatedAt: new Date().toISOString(),
    platformEngagementDays: agg.platformEngagementDays,
    dataCompleteness: dataCompleteness(agg, capability, history),

    businessStage: agg.businessStage ?? null,
    teamSize: agg.teamSize ?? null,
    revenueStage: agg.revenueStage ?? null,
    founderRole: agg.founderRole ?? null,
    operatingMode: agg.operatingMode ?? null,

    masteredTopics: capability?.topicsMastered ?? [],
    deferredTopics: capability?.topicsDeferred ?? [],
    topCapabilityDomain: deriveTopCapabilityDomain(capability),

    confirmedPatterns,
    strongestOperatingDay: deriveStrongestDay(patterns),
    dominantSegment: deriveDominantSegment(patterns),

    entrepreneurSuccessScore: agg.entrepreneurSuccessScore ?? null,
    hasMomentum: agg.hasMomentum ?? false,
    consecutiveCompletions: deriveConsecutiveCompletions(history),
    recentWin: deriveRecentWin(history),

    completionRate90d: deriveCompletionRate(history),
    skipRate90d: deriveSkipRate(history),
    averageConfidence: deriveAverageConfidence(history),

    inLifeProtectionMode: agg.inLifeProtectionMode ?? false,
    activePersonalGoalsCount: agg.activePersonalGoalsCount ?? 0,
    nonNegotiableCommitmentsCount: agg.nonNegotiableCommitmentsCount ?? 0,
  }
}
