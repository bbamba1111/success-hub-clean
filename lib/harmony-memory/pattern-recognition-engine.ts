/**
 * Pattern Recognition Engine™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Pure function: reads GPS history, executive memory, and capability memory
 * then derives PatternSignal[]. No I/O — computation only.
 *
 * Minimum evidence threshold: 3 data points. Returns ranked by evidenceCount.
 */

import type { PatternSignal, PatternStrength } from "@/lib/harmony-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { ExecutiveMemoryEntry } from "@/lib/executive-office/executive-memory-store"
import type { CapabilityProfile } from "@/lib/executive-capability/types"

const MIN_EVIDENCE = 3

function strength(evidenceCount: number): PatternStrength {
  if (evidenceCount >= 10) return "strong"
  if (evidenceCount >= 5) return "confirmed"
  return "emerging"
}

function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

/* ===========================================================================
 * 1 — GPS completion cadence by day of week
 * ======================================================================== */

function completionCadencePatterns(history: RecommendationHistoryEntry[]): PatternSignal[] {
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const completions = history.filter((h) => h.outcome === "completed")
  if (completions.length === 0) return []

  // Count completions by day-of-week
  const byday: Record<number, number> = {}
  for (const entry of completions) {
    const d = new Date(entry.date).getDay()
    byday[d] = (byday[d] ?? 0) + 1
  }

  const signals: PatternSignal[] = []
  for (const [dayStr, count] of Object.entries(byday)) {
    if (count < MIN_EVIDENCE) continue
    const day = Number(dayStr)
    const dayName = DAY_NAMES[day]
    const entries = completions.filter((h) => new Date(h.date).getDay() === day)
    signals.push({
      id: `completion-cadence-${dayName.toLowerCase()}`,
      category: "completion-cadence",
      description: `Your GPS completions are most consistent on ${dayName}s.`,
      evidenceCount: count,
      firstObserved: entries[0].date,
      lastObserved: entries[entries.length - 1].date,
      strength: strength(count),
      contextHint: dayName,
    })
  }
  return signals
}

/* ===========================================================================
 * 2 — Skip reason frequency
 * ======================================================================== */

function skipPatterns(history: RecommendationHistoryEntry[]): PatternSignal[] {
  const skips = history.filter((h) => h.outcome === "skipped" && h.skipReason)
  if (skips.length === 0) return []

  const byReason: Record<string, RecommendationHistoryEntry[]> = {}
  for (const entry of skips) {
    const r = entry.skipReason!
    byReason[r] = [...(byReason[r] ?? []), entry]
  }

  const signals: PatternSignal[] = []
  for (const [reason, entries] of Object.entries(byReason)) {
    if (entries.length < MIN_EVIDENCE) continue
    const labelMap: Record<string, string> = {
      "low-energy": "low energy",
      "not-enough-time": "not enough time",
      "life-happened": "life events",
      "not-relevant": "relevance",
      "unexpected-opportunity": "unexpected opportunities",
      "need-more-support": "needing more support",
      "other": "varied reasons",
    }
    const label = labelMap[reason] ?? reason
    signals.push({
      id: `skip-pattern-${reason}`,
      category: "skip-pattern",
      description: `Your GPS is most often skipped due to ${label}.`,
      evidenceCount: entries.length,
      firstObserved: entries[0].date,
      lastObserved: entries[entries.length - 1].date,
      strength: strength(entries.length),
      contextHint: reason,
    })
  }
  return signals
}

/* ===========================================================================
 * 3 — Executive win patterns
 * ======================================================================== */

function executiveWinPatterns(execMemory: ExecutiveMemoryEntry[]): PatternSignal[] {
  const actioned = execMemory.filter((e) => e.outcome === "actioned")
  if (actioned.length === 0) return []

  // Group by executiveId
  const byExec: Record<string, ExecutiveMemoryEntry[]> = {}
  for (const entry of actioned) {
    byExec[entry.executiveId] = [...(byExec[entry.executiveId] ?? []), entry]
  }

  const signals: PatternSignal[] = []
  for (const [execId, entries] of Object.entries(byExec)) {
    if (entries.length < MIN_EVIDENCE) continue
    const nameMap: Record<string, string> = {
      strategy: "Strategy",
      "marketing-brand": "Marketing & Brand",
      sales: "Sales",
      finance: "Finance",
      operations: "Operations",
      "people-culture": "People & Culture",
      "client-success": "Client Success",
      innovation: "Innovation",
      growth: "Growth",
    }
    const name = nameMap[execId] ?? execId
    signals.push({
      id: `executive-win-${execId}`,
      category: "executive-win",
      description: `Your ${name} Executive™ consistently produces actioned recommendations.`,
      evidenceCount: entries.length,
      firstObserved: entries[0].date,
      lastObserved: entries[entries.length - 1].date,
      strength: strength(entries.length),
      contextHint: execId,
    })
  }
  return signals
}

/* ===========================================================================
 * 4 — Capability growth velocity
 * ======================================================================== */

function capabilityGrowthPatterns(capability: CapabilityProfile | null): PatternSignal[] {
  if (!capability) return []
  const mastered = capability.topicsMastered.length
  if (mastered < MIN_EVIDENCE) return []

  const topDim = Object.entries(capability.dimensions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)[0]

  if (!topDim || topDim[1] === 0) return []

  const dimLabels: Record<string, string> = {
    "strategic-thinking": "Strategic Thinking",
    "financial-capability": "Financial Capability",
    "marketing-capability": "Marketing Capability",
    "operational-excellence": "Operational Excellence",
    leadership: "Leadership",
    "decision-making": "Decision-Making",
    "ai-leverage": "AI Leverage",
    "customer-experience": "Customer Experience",
    "business-asset-thinking": "Business Asset Thinking",
  }

  const label = dimLabels[topDim[0]] ?? topDim[0]

  return [
    {
      id: `capability-growth-${topDim[0]}`,
      category: "capability-growth",
      description: `Your ${label} capability is growing fastest — ${mastered} briefings mastered so far.`,
      evidenceCount: mastered,
      firstObserved: capability.lastUpdated.slice(0, 10),
      lastObserved: isoToday(),
      strength: strength(mastered),
      contextHint: topDim[0],
    },
  ]
}

/* ===========================================================================
 * 5 — Asset creation cadence
 * ======================================================================== */

function assetCreationPatterns(history: RecommendationHistoryEntry[]): PatternSignal[] {
  const withAsset = history.filter((h) => h.businessAssetCreated)
  if (withAsset.length < MIN_EVIDENCE) return []

  return [
    {
      id: "asset-creation-cadence",
      category: "asset-creation",
      description: `You've built ${withAsset.length} Business Assets™ through your GPS recommendations — compounding is underway.`,
      evidenceCount: withAsset.length,
      firstObserved: withAsset[0].date,
      lastObserved: withAsset[withAsset.length - 1].date,
      strength: strength(withAsset.length),
    },
  ]
}

/* ===========================================================================
 * 6 — Life event impact on focus
 * ======================================================================== */

function lifeEventImpactPatterns(history: RecommendationHistoryEntry[]): PatternSignal[] {
  const lifeHappenedSkips = history.filter(
    (h) => h.outcome === "skipped" && h.skipReason === "life-happened",
  )
  if (lifeHappenedSkips.length < MIN_EVIDENCE) return []

  return [
    {
      id: "life-event-focus-impact",
      category: "life-event-impact",
      description: `Life events have interrupted your GPS flow ${lifeHappenedSkips.length} times — your system accounts for this naturally.`,
      evidenceCount: lifeHappenedSkips.length,
      firstObserved: lifeHappenedSkips[0].date,
      lastObserved: lifeHappenedSkips[lifeHappenedSkips.length - 1].date,
      strength: strength(lifeHappenedSkips.length),
    },
  ]
}

/* ===========================================================================
 * Main entry point
 * ======================================================================== */

export interface PatternInputStores {
  gpsHistory: RecommendationHistoryEntry[]
  execMemory: ExecutiveMemoryEntry[]
  capability: CapabilityProfile | null
}

/**
 * Derives all pattern signals from the provided stores.
 * Pure function — no I/O.
 * Returns ranked by evidenceCount descending.
 */
export function analyzePatterns(stores: PatternInputStores): PatternSignal[] {
  const all: PatternSignal[] = [
    ...completionCadencePatterns(stores.gpsHistory),
    ...skipPatterns(stores.gpsHistory),
    ...executiveWinPatterns(stores.execMemory),
    ...capabilityGrowthPatterns(stores.capability),
    ...assetCreationPatterns(stores.gpsHistory),
    ...lifeEventImpactPatterns(stores.gpsHistory),
  ]

  return all.sort((a, b) => b.evidenceCount - a.evidenceCount)
}
