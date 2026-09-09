/**
 * Executive Weighting Engine™ — Phase 10.6
 *
 * Pure function. No React, no I/O.
 * Produces a Record<executiveId, multiplier> based on business stage × operating mode.
 * Multipliers: 0.5 (reduced) | 1.0 (neutral) | 1.3 (secondary) | 1.8 (primary)
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { OperatingMode } from "./types"

// All registered executive ids in the platform
const ALL_EXECUTIVE_IDS = [
  "strategy",
  "marketing",
  "sales",
  "finance",
  "operations",
  "technology",
  "customer-experience",
  "people",
  "human-sustainability",
  "ceo-workday",
  "wealth",
  "investment",
]

type WeightMatrix = {
  primary: string[]     // ×1.8
  secondary: string[]   // ×1.3
  reduced: string[]     // ×0.5
}

/** Stage × Mode → weight matrix */
function resolveMatrix(
  stage: string | null,
  mode: OperatingMode,
): WeightMatrix {
  // Restore always wins — sustainability over everything
  if (mode === "restore") {
    return {
      primary: ["human-sustainability", "ceo-workday"],
      secondary: [],
      reduced: ["marketing", "sales", "strategy", "technology", "operations", "finance", "people", "wealth", "investment", "customer-experience"],
    }
  }

  if (mode === "strategy" || stage === "legacy") {
    return {
      primary: ["strategy", "finance", "wealth"],
      secondary: ["investment", "operations"],
      reduced: ["customer-experience"],
    }
  }

  if (mode === "scale" || stage === "scale") {
    return {
      primary: ["operations", "finance", "technology", "people"],
      secondary: ["strategy", "marketing"],
      reduced: ["wealth", "investment"],
    }
  }

  if (mode === "optimize") {
    return {
      primary: ["technology", "operations", "finance"],
      secondary: ["strategy", "marketing"],
      reduced: [],
    }
  }

  // build (default) — launch / growth / pre-revenue
  if (stage === "growth") {
    return {
      primary: ["marketing", "sales", "operations"],
      secondary: ["finance", "customer-experience"],
      reduced: ["wealth", "investment"],
    }
  }

  // launch / pre-revenue default
  return {
    primary: ["marketing", "customer-experience", "operations"],
    secondary: ["finance", "sales"],
    reduced: ["wealth", "investment"],
  }
}

/**
 * Derives per-executive weight multipliers from the aggregate and operating mode.
 * Every executive not in primary/secondary/reduced receives 1.0 (neutral).
 */
export function deriveExecutiveWeights(
  agg: HarmonyContextAggregate,
  mode: OperatingMode,
): Record<string, number> {
  const matrix = resolveMatrix(agg.businessStage, mode)
  const weights: Record<string, number> = {}

  for (const id of ALL_EXECUTIVE_IDS) {
    if (matrix.primary.includes(id)) {
      weights[id] = 1.8
    } else if (matrix.secondary.includes(id)) {
      weights[id] = 1.3
    } else if (matrix.reduced.includes(id)) {
      weights[id] = 0.5
    } else {
      weights[id] = 1.0
    }
  }

  return weights
}
