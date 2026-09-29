/**
 * Ritual Intelligence Engine™ — Phase 10.6
 *
 * Pure function. No React, no I/O.
 * Derives PersonalizedRituals from confirmed completion-cadence patterns.
 */

import type { PatternSignal } from "@/lib/harmony-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { PersonalizedRitual } from "./types"

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

type DayName = (typeof DAY_NAMES)[number]

const DAY_INDEX: Record<DayName, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

/** Build a ritual name from a day name, e.g. "Tuesday Strategy Block™" */
function buildRitualName(day: DayName, history: RecommendationHistoryEntry[]): string {
  // Try to detect the dominant segment/focus on this day
  const dayEntries = history.filter((e) => {
    const d = new Date(e.date)
    return d.getDay() === DAY_INDEX[day] && e.outcome === "accepted"
  })

  const segmentCounts: Record<string, number> = {}
  for (const e of dayEntries) {
    if (e.segmentId) {
      segmentCounts[e.segmentId] = (segmentCounts[e.segmentId] ?? 0) + 1
    }
  }

  const topSegment = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

  const SEGMENT_LABELS: Record<string, string> = {
    "ceo-workday": "CEO Workday™ Block",
    "early-entry": "Early Entry Block",
    "morning-given": "Morning GIV•EN™ Block",
    "workout": "Movement Block",
    "healthy-lunch": "Nourishment Block",
    "time-freedom": "Time Freedom™ Block",
    "power-down": "Power Down Block",
  }

  const label = topSegment ? (SEGMENT_LABELS[topSegment] ?? "Operating Block") : "Operating Block"
  return `${day} ${label}™`
}

/**
 * Derives up to 3 PersonalizedRituals from confirmed completion-cadence patterns.
 * Returns an empty array if no confirmed patterns exist.
 */
export function derivePersonalizedRituals(
  patterns: PatternSignal[],
  history: RecommendationHistoryEntry[],
): PersonalizedRitual[] {
  const cadencePatterns = patterns.filter(
    (p) =>
      p.category === "completion-cadence" &&
      (p.strength === "confirmed" || p.strength === "strong") &&
      p.contextHint !== undefined,
  )

  if (cadencePatterns.length === 0) return []

  const rituals: PersonalizedRitual[] = []

  for (const pattern of cadencePatterns) {
    const day = pattern.contextHint as DayName
    if (!DAY_NAMES.includes(day)) continue

    const dayIndex = DAY_INDEX[day]

    // Count how many accepted entries fall on this day
    const confirmedCount = history.filter((e) => {
      const d = new Date(e.date)
      return d.getDay() === dayIndex && e.outcome === "accepted"
    }).length

    // Earliest date seen on this day
    const dayEntries = history
      .filter((e) => new Date(e.date).getDay() === dayIndex)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const firstObserved = dayEntries[0]?.date ?? new Date().toISOString()

    // Derive a synthetic 0–1 confidence from evidenceCount
    // 3 = emerging (~0.55), 5 = strong (~0.72), 7+ = confirmed (~0.85+)
    const derivedConfidence = Math.min(0.5 + pattern.evidenceCount * 0.05, 0.97)

    rituals.push({
      id: `ritual-${day.toLowerCase()}`,
      name: buildRitualName(day, history),
      dayOfWeek: dayIndex,
      rationale: `${day}s consistently show your highest operating output — ${confirmedCount} completions recorded.`,
      confidence: derivedConfidence,
      firstObserved,
      confirmedCount,
    })
  }

  // Return top 3 by confirmedCount descending
  return rituals
    .sort((a, b) => b.confirmedCount - a.confirmedCount)
    .slice(0, 3)
}
