/**
 * Founder Opportunity Signals™ — Phase 1 normalization layer
 * ---------------------------------------------------------------------------
 * Normalizes the three existing, independently-stored score sources into ONE
 * interface so the Decide experience never has to know where a score lives:
 *
 *   - Weekly Reality Check™  → Supabase `reality_checks.life_value_scores`   (life)
 *   - Work-Life Balance Audit™ → localStorage (utils/audit-storage.ts)        (life)
 *   - Entrepreneur Success Assessment™ → localStorage (lib/entrepreneur-success/esa-storage.ts) (business)
 *
 * Phase 1 scope: read-only, additive. Does NOT migrate Audit/ESA to Supabase.
 * Callers do the ≤60 filtering themselves — this module returns everything it
 * finds so "no data yet" and "no low areas right now" can be told apart.
 */

import { getLatestRealityCheck } from "@/utils/reality-check-storage"
import { getAuditResults } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"

export type OpportunitySource = "reality_check" | "audit" | "esa"
export type OpportunityDomain = "life" | "business"

export interface OpportunitySignal {
  source: OpportunitySource
  /** Stable-ish key for de-duping across sources (e.g. "physical-wellbeing"). */
  area: string
  /** Founder-facing label (e.g. "Physical Wellbeing"). */
  label: string
  score: number
  domain: OpportunityDomain
}

/** Per-source availability, so the UI can distinguish "no data" from "no low areas". */
export interface OpportunitySignalsResult {
  signals: OpportunitySignal[]
  availability: {
    reality_check: boolean
    audit: boolean
    esa: boolean
  }
}

function slugifyArea(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Loads every available score from all three sources and normalizes them into
 * one flat list. Prefers the Reality Check™ version of a life area over the
 * Audit™ version when both exist for the same category (Reality Check is the
 * more current, Supabase-backed weekly snapshot).
 */
export async function getFounderOpportunitySignals(): Promise<OpportunitySignalsResult> {
  const [realityCheck, auditResults] = await Promise.all([
    getLatestRealityCheck().catch(() => null),
    Promise.resolve(getAuditResults()),
  ])
  const esaResults = getEsaResults()

  const signals: OpportunitySignal[] = []
  const realityCheckAreas = new Set<string>()

  if (realityCheck?.life_value_scores?.length) {
    for (const row of realityCheck.life_value_scores) {
      const area = slugifyArea(row.category)
      realityCheckAreas.add(area)
      signals.push({
        source: "reality_check",
        area,
        label: row.label ?? row.category,
        score: row.percentage,
        domain: "life",
      })
    }
  }

  if (auditResults?.results?.length) {
    for (const row of auditResults.results) {
      const area = slugifyArea(row.category)
      // Reality Check already covers this life area more recently — skip.
      if (realityCheckAreas.has(area)) continue
      signals.push({
        source: "audit",
        area,
        label: row.label ?? row.category,
        score: row.percentage,
        domain: "life",
      })
    }
  }

  if (esaResults?.pillarScores?.length) {
    for (const pillar of esaResults.pillarScores) {
      signals.push({
        source: "esa",
        area: slugifyArea(pillar.pillarId),
        label: pillar.pillarName,
        score: pillar.percentage,
        domain: "business",
      })
    }
  }

  return {
    signals,
    availability: {
      reality_check: Boolean(realityCheck?.life_value_scores?.length),
      audit: Boolean(auditResults?.results?.length),
      esa: Boolean(esaResults?.pillarScores?.length),
    },
  }
}

/** Convenience helper: signals at or below the given threshold (default 60), sorted ascending. */
export function filterOpportunities(
  signals: OpportunitySignal[],
  maxScore = 60,
): OpportunitySignal[] {
  return signals.filter((s) => s.score <= maxScore).sort((a, b) => a.score - b.score)
}
