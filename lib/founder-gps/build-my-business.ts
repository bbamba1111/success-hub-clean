/**
 * Build My Business™ — presentation-layer derivations for the 4-Hour
 * Focused CEO Workday™.
 * ---------------------------------------------------------------------------
 * This module introduces NO new recommendation engine, NO new scoring, and
 * NO new data source. It is a thin, pure read of data that already exists:
 *
 *   - Business Destination Summary  ← Founder Destination™ fields already
 *     carried on the Business Operating Fingerprint™ (`lib/business-operating-
 *     fingerprint/types.ts`) — the DESTINATION and FUTURE WORKPLACE sections.
 *   - Business Reality Summary      ← the BUSINESS and OPERATING MODEL
 *     sections of the same Fingerprint.
 *   - Business Gap Map              ← the `currentState` / `targetState`
 *     already computed on the active `GpsRecommendation` (Founder GPS™'s
 *     Next Best Move™) — this is the one gap the founder is closing today,
 *     not a second gap-analysis engine.
 *   - Relevant AI Executive         ← a lookup, not a ranking, into the
 *     existing `EXECUTIVE_TEAM` roster (`lib/executive-team/executive-
 *     registry.ts`) using the `executiveDomain` the EDE already assigned
 *     to the Next Best Move™.
 *
 * Every function here is pure: (existing data) → small display shape.
 */

import type { BusinessOperatingFingerprint } from "@/lib/business-operating-fingerprint/types"
import type { GpsRecommendation } from "./types"
import { EXECUTIVE_TEAM, getExecutive, type Executive } from "@/lib/executive-team/executive-registry"

export interface SummaryItem {
  label: string
  value: string
}

/** Title-cases a kebab-case id for display — same small helper pattern used across the founder-guidance layer. */
function humanize(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function isUnknown(value: unknown): boolean {
  return value === "unknown" || value == null
}

/**
 * Business Destination™ — where the founder said they want the business,
 * their role, and their future workplace to end up. Read straight off the
 * Fingerprint's DESTINATION + FUTURE WORKPLACE fields; nothing recomputed.
 */
export function deriveBusinessDestinationSummary(fingerprint: BusinessOperatingFingerprint): SummaryItem[] {
  const items: SummaryItem[] = []

  if (!isUnknown(fingerprint.desiredFounderRole)) {
    items.push({ label: "Your Role", value: humanize(fingerprint.desiredFounderRole as string) })
  }
  if (!isUnknown(fingerprint.revenueAmbition)) {
    items.push({ label: "Revenue Ambition", value: humanize(fingerprint.revenueAmbition as string) })
  }
  if (!isUnknown(fingerprint.desiredTeamSize)) {
    items.push({ label: "Team Size", value: humanize(fingerprint.desiredTeamSize as string) })
  }
  if (!isUnknown(fingerprint.desiredWorkplaceType)) {
    items.push({ label: "Future Workplace", value: humanize(fingerprint.desiredWorkplaceType as string) })
  }

  return items
}

/**
 * Business Reality™ — where the business actually stands today. Read
 * straight off the Fingerprint's BUSINESS + OPERATING MODEL fields.
 */
export function deriveBusinessRealitySummary(fingerprint: BusinessOperatingFingerprint): SummaryItem[] {
  const items: SummaryItem[] = [{ label: "Business Stage", value: humanize(fingerprint.businessStage) }]

  if (!isUnknown(fingerprint.teamSize)) {
    items.push({ label: "Team Size Today", value: humanize(fingerprint.teamSize as string) })
  }
  if (!isUnknown(fingerprint.revenueStage)) {
    items.push({ label: "Revenue Today", value: humanize(fingerprint.revenueStage as string) })
  }
  if (!isUnknown(fingerprint.primaryArchetype)) {
    items.push({ label: "Business Model", value: humanize(fingerprint.primaryArchetype as string) })
  }
  if (!isUnknown(fingerprint.founderDependency)) {
    items.push({ label: "Founder Dependency", value: humanize(fingerprint.founderDependency as string) })
  }

  return items
}

export interface BusinessGapMapEntry {
  current: string
  target: string
}

/**
 * Business Gap Map™ — the single current → target gap the active Next Best
 * Move™ is closing today. Not a second gap-analysis engine: `currentState`
 * and `targetState` are already computed fields on `GpsRecommendation`.
 */
export function deriveBusinessGapMap(nextBestMove: GpsRecommendation | null): BusinessGapMapEntry | null {
  if (!nextBestMove?.currentState || !nextBestMove?.targetState) return null
  return { current: nextBestMove.currentState, target: nextBestMove.targetState }
}

export interface RelevantExecutives {
  /** The one executive whose domain owns today's Next Best Move™ — a lookup, not a ranking. */
  primary: Executive | null
  /** The rest of the permanent roster, unchanged, for "ask a different executive". */
  others: Executive[]
}

/**
 * Relevant AI Executive™ — a read-only lookup into the existing
 * `EXECUTIVE_TEAM` roster using the `executiveDomain` the Executive Decision
 * Engine™ already assigned to the Next Best Move™. Introduces no new
 * relevance scoring for the remaining executives; they're simply "the rest
 * of your team," available exactly as they always are.
 */
export function deriveRelevantExecutives(nextBestMove: GpsRecommendation | null): RelevantExecutives {
  const primary = nextBestMove?.executiveDomain ? getExecutive(nextBestMove.executiveDomain) ?? null : null
  const others = EXECUTIVE_TEAM.filter((e) => e.id !== primary?.id)
  return { primary, others }
}
