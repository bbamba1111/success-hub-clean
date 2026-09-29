/**
 * Executive Timeline Engine™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Builds a chronological TimelineEntry[] from all stores.
 * Returns at most 60 entries, most recent first.
 * Pure function — no I/O.
 */

import type { TimelineEntry, ExecutiveMilestone } from "@/lib/harmony-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { ExecutiveMemoryEntry } from "@/lib/executive-office/executive-memory-store"
import type { CapabilityProfile } from "@/lib/executive-capability/types"

const MAX_ENTRIES = 60

function uid(prefix: string, val: string): string {
  return `${prefix}-${val.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`
}

/* ===========================================================================
 * GPS completions
 * ======================================================================== */

function gpsCompletionEntries(history: RecommendationHistoryEntry[]): TimelineEntry[] {
  return history
    .filter((h) => h.outcome === "completed")
    .map((h) => ({
      id: uid("gps", h.timestamp),
      date: h.date,
      type: "gps-completion" as const,
      title: h.recommendationTitle,
      summary: h.businessAssetCreated
        ? `Completed · Built ${h.businessAssetCreated}`
        : `GPS recommendation completed`,
      linkedMemoryIds: [h.id],
      badge: h.businessAssetCreated ? "Asset Created" : undefined,
    }))
}

/* ===========================================================================
 * Business assets
 * ======================================================================== */

function assetCreatedEntries(history: RecommendationHistoryEntry[]): TimelineEntry[] {
  return history
    .filter((h) => h.businessAssetCreated)
    .map((h) => ({
      id: uid("asset", h.timestamp + (h.businessAssetCreated ?? "")),
      date: h.date,
      type: "asset-created" as const,
      title: h.businessAssetCreated!,
      summary: `Business Asset™ created via ${h.recommendationTitle}`,
      linkedMemoryIds: [h.id],
      badge: "Business Asset™",
    }))
}

/* ===========================================================================
 * Briefings mastered
 * ======================================================================== */

function briefingMasteredEntries(capability: CapabilityProfile | null): TimelineEntry[] {
  if (!capability || capability.topicsMastered.length === 0) return []
  // We don't have per-topic timestamps, so use lastUpdated as approximate
  const date = capability.lastUpdated.slice(0, 10)
  return capability.topicsMastered.slice(0, 10).map((topicId) => ({
    id: uid("briefing", topicId),
    date,
    type: "briefing-mastered" as const,
    title: topicId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    summary: "Executive briefing completed and mastered",
    linkedMemoryIds: [],
    badge: "Capability Gained",
  }))
}

/* ===========================================================================
 * Executive wins
 * ======================================================================== */

function executiveWinEntries(execMemory: ExecutiveMemoryEntry[]): TimelineEntry[] {
  return execMemory
    .filter((e) => e.outcome === "actioned")
    .map((e) => ({
      id: uid("exec-win", e.timestamp),
      date: e.date,
      type: "executive-win" as const,
      title: e.finding.title,
      summary: `Executive win · ${e.finding.recommendation}`,
      linkedMemoryIds: [],
      badge: "Executive Win™",
    }))
}

/* ===========================================================================
 * Milestones earned
 * ======================================================================== */

function milestoneEntries(milestones: ExecutiveMilestone[]): TimelineEntry[] {
  return milestones
    .filter((m) => m.earned && m.achievedAt)
    .map((m) => ({
      id: uid("milestone", m.id),
      date: m.achievedAt!.slice(0, 10),
      type: "milestone-earned" as const,
      title: m.label,
      summary: m.celebrationNote,
      linkedMemoryIds: [],
      badge: "Milestone™",
    }))
}

/* ===========================================================================
 * Main entry point
 * ======================================================================== */

/**
 * Builds the Executive Timeline™ from all provided stores.
 * Deduplicates by id, sorts chronologically descending, caps at 60 entries.
 * Pure function — no I/O.
 */
export function buildExecutiveTimeline(
  history: RecommendationHistoryEntry[],
  execMemory: ExecutiveMemoryEntry[],
  capability: CapabilityProfile | null,
  milestones: ExecutiveMilestone[],
): TimelineEntry[] {
  const all: TimelineEntry[] = [
    ...gpsCompletionEntries(history),
    ...assetCreatedEntries(history),
    ...briefingMasteredEntries(capability),
    ...executiveWinEntries(execMemory),
    ...milestoneEntries(milestones),
  ]

  // Deduplicate by id
  const seen = new Set<string>()
  const unique = all.filter((e) => {
    if (seen.has(e.id)) return false
    seen.add(e.id)
    return true
  })

  // Sort newest first, cap at MAX_ENTRIES
  return unique
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_ENTRIES)
}
