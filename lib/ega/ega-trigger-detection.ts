/**
 * Entrepreneur Gap Assessment™ — Multi-Source Trigger Detection (Phase 4)
 * ---------------------------------------------------------------------------
 * Reads across four existing, independent sources and turns each one's
 * already-defined "something is missing / underperforming / not holding"
 * signal into a candidate EgaEntry:
 *
 *   1. esa                — an Operating Practice™ scored below
 *                            EGA_PRACTICE_THRESHOLD (lib/entrepreneur-success/scoring.ts)
 *   2. business_context    — a Business Reality™ fact that is absent
 *                            (lib/business-context/types.ts)
 *   3. asset_condition     — a Business Asset™ that was started but never
 *                            finished, needs updating, or is blocked
 *                            (lib/business-asset-inventory/types.ts)
 *   4. operating_rule_state — an Operating Rule™ that was replaced shortly
 *                            after it took effect, i.e. it didn't hold
 *                            (lib/operating-rules/storage.ts)
 *
 * Detection is pure and read-only: `detect*` functions never touch
 * `ega_entries`. `persistDetectedEgaSignals` is the only function that
 * writes, and it always checks `findEgaEntryBySourceRef` first so re-running
 * detection (e.g. every time ESA is re-scored) never creates duplicates for
 * a signal that already has an open/tracked EgaEntry.
 *
 * This module does NOT decide severity, obstacle diagnosis, or a solution —
 * those remain nullable on EgaEntry and are progressive enrichment for a
 * later phase (see UpdateEgaEntryInput). It only decides: "is this worth
 * surfacing as a signal at all."
 */

import { OPERATING_PRACTICES } from "@/lib/entrepreneur-success/esa-registry"
import { practicesBelowEgaThreshold, EGA_PRACTICE_THRESHOLD } from "@/lib/entrepreneur-success/scoring"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { InstalledBusinessAsset } from "@/lib/business-asset-inventory/types"
import { getAssetById } from "@/lib/executive-decision-engine/asset-registry"
import type { OperatingRule } from "@/lib/operating-rules/storage"
import { createEgaEntry, findEgaEntryBySourceRef } from "./ega-storage"
import type { CreateEgaEntryInput, EgaEntry } from "./types"

/** A candidate signal, not yet checked for duplicates or written anywhere. */
export type DetectedEgaSignal = Pick<CreateEgaEntryInput, "source" | "sourceRef" | "signal">

/* ===========================================================================
 * 1. ESA — practices below threshold
 * ======================================================================== */

/**
 * One candidate signal per Operating Practice™ scored below
 * EGA_PRACTICE_THRESHOLD, using that practice's own `gapCost` copy (already
 * written to be resonant, never punitive) as the signal text.
 */
export function detectEsaSignals(results: EsaResults, threshold = EGA_PRACTICE_THRESHOLD): DetectedEgaSignal[] {
  return practicesBelowEgaThreshold(results, threshold).map((practice) => {
    const definition = OPERATING_PRACTICES.find((p) => p.id === practice.practiceId)
    const signal = definition
      ? `${definition.name} scored ${practice.percentage}% on the Entrepreneur Success Assessment™: ${definition.gapCost}`
      : `${practice.practiceName} scored ${practice.percentage}% on the Entrepreneur Success Assessment™.`

    return {
      source: "esa",
      sourceRef: practice.practiceId,
      signal,
    }
  })
}

/* ===========================================================================
 * 2. Business Context — Business Reality™ facts that are absent
 * ---------------------------------------------------------------------------
 * Only the boolean/existence-style Business Reality™ fields qualify — per
 * their own doc comments in types.ts, "quality/adequacy is an EGA signal
 * elsewhere, never here." This function only flags outright absence, and
 * only once the field has actually been answered (undefined = not yet
 * asked, not a gap).
 * ======================================================================== */

const BUSINESS_REALITY_ABSENCE_CHECKS: {
  field: "hasOnboarding" | "hasProofTestimonials"
  sourceRef: string
  signal: string
}[] = [
  {
    field: "hasOnboarding",
    sourceRef: "hasOnboarding",
    signal: "No client onboarding process exists yet — new clients start without a structured welcome.",
  },
  {
    field: "hasProofTestimonials",
    sourceRef: "hasProofTestimonials",
    signal: "No proof or testimonials exist yet — the business has no social proof to support its offer.",
  },
]

/** One candidate signal for every Business Reality™ existence-fact the founder answered "no" to. */
export function detectBusinessContextSignals(profile: BusinessContextProfile): DetectedEgaSignal[] {
  const signals: DetectedEgaSignal[] = []

  for (const check of BUSINESS_REALITY_ABSENCE_CHECKS) {
    if (profile[check.field] === false) {
      signals.push({
        source: "business_context",
        sourceRef: check.sourceRef,
        signal: check.signal,
      })
    }
  }

  // Referral mechanism is a free-text field; an explicitly-answered empty
  // string is the "no mechanism exists" signal (undefined means unanswered).
  if (profile.referralMechanism !== undefined && profile.referralMechanism.trim() === "") {
    signals.push({
      source: "business_context",
      sourceRef: "referralMechanism",
      signal: "No referral or repeat-business mechanism exists yet.",
    })
  }

  return signals
}

/* ===========================================================================
 * 3. Asset condition — started but never finished / needs update / blocked
 * ======================================================================== */

type StalledAssetStatus = "in-progress" | "needs-update" | "blocked"

const STALLED_ASSET_STATUSES: readonly StalledAssetStatus[] = ["in-progress", "needs-update", "blocked"]

function isStalledAssetStatus(status: string): status is StalledAssetStatus {
  return (STALLED_ASSET_STATUSES as readonly string[]).includes(status)
}

/**
 * One candidate signal per Business Asset™ that is stalled: started but
 * never finished ("in-progress"), no longer sufficient ("needs-update"), or
 * explicitly stuck ("blocked"). "not-installed" is excluded — an asset that
 * was never started is a build opportunity, not yet a gap signal.
 */
export function detectAssetConditionSignals(assets: InstalledBusinessAsset[]): DetectedEgaSignal[] {
  return assets
    .filter((asset) => isStalledAssetStatus(asset.status))
    .map((asset) => {
      const definition = getAssetById(asset.businessAssetId)
      const name = definition?.name ?? asset.businessAssetId

      const statusPhrase: Record<StalledAssetStatus, string> = {
        "in-progress": "was started but never finished",
        "needs-update": "exists but no longer fits the founder's current Business Destination™",
        blocked: "is blocked and not moving forward",
      }

      return {
        source: "asset_condition",
        sourceRef: asset.businessAssetId,
        signal: `${name} ${statusPhrase[asset.status as StalledAssetStatus]}.`,
      }
    })
}

/* ===========================================================================
 * 4. Operating rule state — a rule that didn't hold
 * ---------------------------------------------------------------------------
 * A rule marked "replaced" very shortly after its effective date signals
 * the founder's stated intention got overridden or conflicted with reality
 * almost immediately — that friction is itself the EGA signal, independent
 * of whatever the replacement rule says.
 * ======================================================================== */

/** A rule that held for fewer days than this before being replaced is a signal. */
export const RULE_CHURN_DAYS_THRESHOLD = 3

function daysBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.POSITIVE_INFINITY
  return Math.abs(end - start) / (1000 * 60 * 60 * 24)
}

/**
 * One candidate signal per replaced Operating Rule™ that held for less than
 * RULE_CHURN_DAYS_THRESHOLD days before being replaced.
 */
export function detectOperatingRuleStateSignals(
  rules: OperatingRule[],
  churnThresholdDays = RULE_CHURN_DAYS_THRESHOLD,
): DetectedEgaSignal[] {
  return rules
    .filter((rule) => rule.status === "replaced")
    .filter((rule) => daysBetween(rule.effectiveDate, rule.updatedAt) < churnThresholdDays)
    .map((rule) => ({
      source: "operating_rule_state",
      sourceRef: rule.id,
      signal: `The Operating Rule™ "${rule.ruleText}" for ${rule.operatingSegment} was replaced within ${churnThresholdDays} days of taking effect — it didn't hold.`,
    }))
}

/* ===========================================================================
 * Orchestration
 * ======================================================================== */

/** Everything detection needs, already fetched by the caller from each source's own storage layer. */
export interface EgaTriggerDetectionInputs {
  esaResults?: EsaResults | null
  businessContextProfile?: BusinessContextProfile | null
  installedAssets?: InstalledBusinessAsset[]
  operatingRules?: OperatingRule[]
}

/** Runs all four detectors and returns every candidate signal found, source by source. */
export function detectAllEgaSignals(inputs: EgaTriggerDetectionInputs): DetectedEgaSignal[] {
  const signals: DetectedEgaSignal[] = []

  if (inputs.esaResults) {
    signals.push(...detectEsaSignals(inputs.esaResults))
  }
  if (inputs.businessContextProfile) {
    signals.push(...detectBusinessContextSignals(inputs.businessContextProfile))
  }
  if (inputs.installedAssets) {
    signals.push(...detectAssetConditionSignals(inputs.installedAssets))
  }
  if (inputs.operatingRules) {
    signals.push(...detectOperatingRuleStateSignals(inputs.operatingRules))
  }

  return signals
}

/**
 * Persists every detected signal that doesn't already have an EgaEntry for
 * the same source + sourceRef. Safe to call repeatedly (e.g. after every
 * ESA re-score, every Business Context save, every asset status change) —
 * re-detecting the same unresolved gap never creates a duplicate row.
 * Returns only the entries actually created this call.
 */
export async function persistDetectedEgaSignals(signals: DetectedEgaSignal[]): Promise<EgaEntry[]> {
  const created: EgaEntry[] = []

  for (const signal of signals) {
    if (signal.sourceRef) {
      const existing = await findEgaEntryBySourceRef(signal.source, signal.sourceRef)
      if (existing) continue
    }

    const entry = await createEgaEntry({
      source: signal.source,
      sourceRef: signal.sourceRef,
      signal: signal.signal,
    })
    if (entry) created.push(entry)
  }

  return created
}

/** Convenience: detect across every provided source, then persist only the new ones. */
export async function runEgaTriggerDetection(inputs: EgaTriggerDetectionInputs): Promise<EgaEntry[]> {
  return persistDetectedEgaSignals(detectAllEgaSignals(inputs))
}
