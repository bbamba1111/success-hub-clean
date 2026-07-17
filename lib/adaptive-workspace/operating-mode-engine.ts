/**
 * Operating Mode Engine™ — Phase 10.6
 *
 * Pure function. No React, no I/O.
 * Derives the recommended OperatingMode from HarmonyContextAggregate.
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { OperatingMode, OperatingModeDefinition, OperatingModeResult } from "./types"

// ── Mode Definitions ──────────────────────────────────────────────────────────

export const MODE_DEFINITIONS: Record<OperatingMode, OperatingModeDefinition> = {
  restore: {
    id: "restore",
    name: "Restore Mode™",
    tagline: "Sustainability before strategy.",
    primaryFocus: ["Human Sustainability™", "CEO Workday™ protection", "Energy management"],
    executivePriority: ["human-sustainability", "ceo-workday"],
    suppressLearning: true,
    reduceCognitiveLoad: true,
    emphasis: "recovery",
    accentColor: "#C13B6B",
    textClass: "text-rose-700",
    bgClass: "bg-rose-50",
  },
  build: {
    id: "build",
    name: "Build Mode™",
    tagline: "Create before you optimize.",
    primaryFocus: ["Creating offers", "Marketing foundations", "First revenue"],
    executivePriority: ["marketing", "customer-experience", "operations"],
    suppressLearning: false,
    reduceCognitiveLoad: false,
    emphasis: "execution",
    accentColor: "#5B835F",
    textClass: "text-green-700",
    bgClass: "bg-green-50",
  },
  scale: {
    id: "scale",
    name: "Scale Mode™",
    tagline: "Systems, people, and compounding leverage.",
    primaryFocus: ["Team building", "Operations", "Recurring revenue"],
    executivePriority: ["operations", "finance", "technology", "people"],
    suppressLearning: false,
    reduceCognitiveLoad: false,
    emphasis: "leadership",
    accentColor: "#3A5A8C",
    textClass: "text-blue-700",
    bgClass: "bg-blue-50",
  },
  optimize: {
    id: "optimize",
    name: "Optimize Mode™",
    tagline: "Less effort. More compounding.",
    primaryFocus: ["AI leverage", "Recurring revenue", "Systems efficiency"],
    executivePriority: ["technology", "operations", "finance"],
    suppressLearning: false,
    reduceCognitiveLoad: false,
    emphasis: "optimization",
    accentColor: "#B45309",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50",
  },
  strategy: {
    id: "strategy",
    name: "Strategy Mode™",
    tagline: "Long-horizon thinking for legacy-level outcomes.",
    primaryFocus: ["Vision", "Strategic partnerships", "Wealth building"],
    executivePriority: ["strategy", "finance", "wealth"],
    suppressLearning: false,
    reduceCognitiveLoad: false,
    emphasis: "planning",
    accentColor: "#4C1D95",
    textClass: "text-violet-800",
    bgClass: "bg-violet-50",
  },
}

// ── Signal counting helpers ───────────────────────────────────────────────────

function countRestoreSignals(agg: HarmonyContextAggregate): number {
  let score = 0
  if (agg.inLifeProtectionMode) score += 3
  if (agg.consecutiveCompletions === 0 && !agg.hasMomentum) score += 2
  if (agg.upcomingLifeEvents && agg.upcomingLifeEvents.length > 0) score += 1
  return score
}

function countScaleSignals(agg: HarmonyContextAggregate): number {
  let score = 0
  if (agg.businessStage === "scale") score += 3
  if (agg.teamSize === "11-25" || agg.teamSize === "26-50" || agg.teamSize === "50-plus") score += 2
  if (agg.biggestOpportunities?.includes("leadership")) score += 1
  if (agg.biggestOpportunities?.includes("scaling")) score += 1
  return score
}

function countStrategySignals(agg: HarmonyContextAggregate): number {
  let score = 0
  if (agg.businessStage === "legacy") score += 3
  if (agg.biggestGoals?.includes("scale-revenue") || agg.biggestGoals?.includes("build-passive-income")) score += 2
  if (
    agg.upcomingLifeEvents &&
    agg.upcomingLifeEvents.length > 0 &&
    agg.daysUntilNextSignificantEvent !== null &&
    agg.daysUntilNextSignificantEvent <= 30
  ) {
    score += 2
  }
  if (agg.biggestOpportunities?.includes("strategic-partnerships")) score += 1
  return score
}

function countOptimizeSignals(agg: HarmonyContextAggregate): number {
  let score = 0
  const highRevenue =
    agg.revenueStage === "250k-500k" ||
    agg.revenueStage === "500k-1m" ||
    agg.revenueStage === "1m-5m" ||
    agg.revenueStage === "5m-plus"
  if (highRevenue) score += 2
  if (agg.biggestOpportunities?.includes("ai-implementation")) score += 2
  if (agg.biggestOpportunities?.includes("recurring-revenue")) score += 1
  if (agg.businessStage === "growth" && highRevenue) score += 1
  return score
}

// ── Main derivation ───────────────────────────────────────────────────────────

/**
 * Derives the recommended OperatingMode from the given aggregate.
 * Priority order: Restore → Scale → Strategy → Optimize → Build (default).
 * Confidence is proportional to how many signals confirm the selected mode.
 */
export function deriveOperatingMode(agg: HarmonyContextAggregate): OperatingModeResult {
  const restoreScore = countRestoreSignals(agg)
  const scaleScore = countScaleSignals(agg)
  const strategyScore = countStrategySignals(agg)
  const optimizeScore = countOptimizeSignals(agg)

  // Restore has highest priority — always wins when triggered
  if (restoreScore >= 2) {
    const confidence = Math.min(40 + restoreScore * 15, 95)
    const rationale = agg.inLifeProtectionMode
      ? "Life Protection Mode™ is active. Your workspace is prioritizing sustainability over execution."
      : "Your activity signals suggest rest before acceleration. Restore Mode™ protects your capacity."
    return { mode: "restore", confidence, rationale }
  }

  if (scaleScore >= 3 && scaleScore >= strategyScore && scaleScore >= optimizeScore) {
    const confidence = Math.min(40 + scaleScore * 10, 92)
    return {
      mode: "scale",
      confidence,
      rationale:
        "Your business stage and team signals indicate you are in a scaling phase. Operational excellence and leadership development are the priority.",
    }
  }

  if (strategyScore >= 3 && strategyScore >= optimizeScore) {
    const confidence = Math.min(40 + strategyScore * 10, 90)
    return {
      mode: "strategy",
      confidence,
      rationale:
        "Your signals point toward a long-horizon planning cycle. Strategy Mode™ elevates vision, partnerships, and wealth building.",
    }
  }

  if (optimizeScore >= 3) {
    const confidence = Math.min(40 + optimizeScore * 10, 88)
    return {
      mode: "optimize",
      confidence,
      rationale:
        "You are operating at meaningful revenue with leverage opportunities available. Optimize Mode™ focuses on efficiency, AI, and compounding systems.",
    }
  }

  // Default: Build Mode
  const buildConfidence = agg.revenueStage === "pre-revenue" ? 82 : 68
  return {
    mode: "build",
    confidence: buildConfidence,
    rationale:
      "Your workspace is in Build Mode™ — the default posture for founders creating, launching, and acquiring their first or next wave of customers.",
  }
}
