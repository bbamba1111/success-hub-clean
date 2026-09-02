/**
 * Operating Signal Weighting™ — Phase 10.2
 * ---------------------------------------------------------------------------
 * Evaluates every active signal against the assembled HarmonyContextAggregate
 * and returns a weighted list of active signals for the confidence engine and
 * GPS reasoning pipeline.
 *
 * PURE module — no React, no I/O.
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { GpsOutcomeId } from "@/lib/founder-gps/engine"

/* ===========================================================================
 * Types
 * ======================================================================== */

export type SignalCategory =
  | "human-sustainability"
  | "business-context"
  | "ceo-workday"
  | "progress"
  | "whole-life"
  | "behavior"

export interface ActiveSignal {
  /** Stable id matching the GpsSignalId union (see types.ts). */
  id: string
  category: SignalCategory
  /** 0–100 — higher = more urgency. */
  weight: number
  influence: "primary" | "contributing" | "suppressing"
  /** The GPS Outcome™ this signal most urgently protects. */
  outcome: GpsOutcomeId
  /** Human-readable label for display in the confidence panel. */
  label: string
}

/* ===========================================================================
 * Signal evaluator
 * ======================================================================== */

/**
 * Evaluates which signals are active given the current aggregate context.
 * Returns all active signals, ordered by weight descending.
 */
export function evaluateOperatingSignals(
  agg: HarmonyContextAggregate,
): ActiveSignal[] {
  const signals: ActiveSignal[] = []

  // ── Human Sustainability™ ───────────────────────────────────────────────

  const morningStreak = agg.progress?.nonNegotiableStreak ?? 0
  const workoutStreak = agg.progress?.workoutStreak ?? 0

  if (morningStreak === 0) {
    signals.push({
      id: "morning-given-streak-broken",
      category: "human-sustainability",
      weight: 75,
      influence: "primary",
      outcome: "honor-non-negotiables",
      label: "Morning GIV\u2022EN\u2122 streak needs reset",
    })
  }

  if (workoutStreak === 0) {
    signals.push({
      id: "workout-streak-broken",
      category: "human-sustainability",
      weight: 65,
      influence: "primary",
      outcome: "honor-non-negotiables",
      label: "Movement Window\u2122 streak needs reset",
    })
  }

  if (agg.inLifeProtectionMode) {
    signals.push({
      id: "time-freedom-not-protected",
      category: "human-sustainability",
      weight: 90,
      influence: "primary",
      outcome: "honor-non-negotiables",
      label: "Life Protection Mode\u2122 active",
    })
  }

  // ── Business Context™ signals ────────────────────────────────────────────

  if (!agg.businessStage && !agg.revenueStage && !agg.founderRole) {
    signals.push({
      id: "no-business-context-completed",
      category: "business-context",
      weight: 80,
      influence: "primary",
      outcome: "build-compounding-assets",
      label: "Business Context Profile\u2122 not completed",
    })
  }

  if (
    agg.businessStage === "pre-launch" &&
    !agg.biggestGoals.includes("clarifying-offer" as never) &&
    agg.biggestChallenges.includes("no-offer-clarity" as never)
  ) {
    signals.push({
      id: "pre-revenue-no-offer",
      category: "business-context",
      weight: 70,
      influence: "primary",
      outcome: "build-compounding-assets",
      label: "Pre-revenue: offer clarity needed",
    })
  }

  if (
    agg.businessCredit === "no-credit" ||
    agg.businessCredit === "building"
  ) {
    signals.push({
      id: "business-credit-not-established",
      category: "business-context",
      weight: 50,
      influence: "contributing",
      outcome: "build-compounding-assets",
      label: "Business credit not yet established",
    })
  }

  if (!agg.capitalStrategy?.length) {
    signals.push({
      id: "capital-strategy-not-defined",
      category: "business-context",
      weight: 45,
      influence: "contributing",
      outcome: "build-compounding-assets",
      label: "Capital strategy not defined",
    })
  }

  // ── Progress Intelligence™ ───────────────────────────────────────────────

  const morningStreakVal = agg.progress?.nonNegotiableStreak ?? 0
  if (morningStreakVal >= 7) {
    signals.push({
      id: "strong-streak-7plus",
      category: "progress",
      weight: 60,
      influence: "contributing",
      outcome: "honor-non-negotiables",
      label: `${morningStreakVal}-day Morning GIV\u2022EN\u2122 streak active`,
    })
  }

  if (agg.consecutiveCompletions >= 3) {
    signals.push({
      id: "consecutive-completions-3plus",
      category: "progress",
      weight: 55,
      influence: "contributing",
      outcome: "build-compounding-assets",
      label: `${agg.consecutiveCompletions} consecutive GPS completions`,
    })
  }

  const assetsBuilt = agg.progress?.totalAssetsIdentified ?? 0
  if (assetsBuilt > 0) {
    signals.push({
      id: "assets-building-momentum",
      category: "progress",
      weight: 50,
      influence: "contributing",
      outcome: "build-compounding-assets",
      label: `${assetsBuilt} Business Asset${assetsBuilt > 1 ? "s" : ""}\u2122 built`,
    })
  }

  // ── Behavior / Adaptive Learning™ ───────────────────────────────────────

  if (agg.lastRecommendationOutcome === "skipped") {
    signals.push({
      id: "last-recommendation-skipped",
      category: "behavior",
      weight: 55,
      influence: "primary",
      outcome: "reduce-execution-friction",
      label: "Last recommendation was skipped",
    })
  }

  if (agg.lastRecommendationOutcome === "deferred") {
    signals.push({
      id: "last-recommendation-deferred",
      category: "behavior",
      weight: 40,
      influence: "contributing",
      outcome: "reduce-execution-friction",
      label: "Last recommendation was deferred",
    })
  }

  // ── Whole-Life™ ──────────────────────────────────────────────────────────

  if (agg.hasEventRequiringPreparation) {
    signals.push({
      id: "event-requires-preparation",
      category: "whole-life",
      weight: 70,
      influence: "primary",
      outcome: "honor-non-negotiables",
      label: "Upcoming event requires preparation",
    })
  }

  if (agg.daysUntilNextSignificantEvent !== null && agg.daysUntilNextSignificantEvent <= 7) {
    signals.push({
      id: "significant-event-soon",
      category: "whole-life",
      weight: 85,
      influence: "primary",
      outcome: "honor-non-negotiables",
      label: `Significant life event in ${agg.daysUntilNextSignificantEvent} day${agg.daysUntilNextSignificantEvent === 1 ? "" : "s"}`,
    })
  }

  // ── CEO Workday™ ─────────────────────────────────────────────────────────

  if (!agg.weekDesigned) {
    signals.push({
      id: "week-not-designed",
      category: "ceo-workday",
      weight: 75,
      influence: "primary",
      outcome: "reduce-execution-friction",
      label: "Work-Life Balance Business Week\u2122 not yet designed",
    })
  }

  // ── Business Bottleneck Audit™ (BBA™) ───────────────────────────────────
  // Additive signals derived from bba-context-aggregator.ts. Does not touch
  // or replace any ESA-era business-context signal above.
  //
  // INTEGRATION GAP: bbaSignalSummary is only populated when the caller runs
  // server-side and passes it into assembleHarmonyContext() (BBA lives in
  // Supabase, so it can't be read synchronously here the way localStorage
  // signals are). When it's undefined we cannot distinguish "no baseline
  // yet" from "caller didn't fetch it" — so we deliberately stay silent
  // rather than guess, and only evaluate once bba is present.

  const bba = agg.bbaSignalSummary

  if (bba && !bba.hasBaseline) {
    signals.push({
      id: "no-bba-completed",
      category: "business-context",
      weight: 78,
      influence: "primary",
      outcome: "build-compounding-assets",
      label: "Business Bottleneck Audit\u2122 baseline not completed",
    })
  } else if (bba) {
    if (bba.hasWidespreadOwnershipGap) {
      signals.push({
        id: "bba-ownership-gap-widespread",
        category: "business-context",
        weight: 60,
        influence: "contributing",
        outcome: "build-compounding-assets",
        label: `${bba.unownedCategoryIds.length} business areas have no clear owner`,
      })
    }

    if (bba.assignmentRepeatedlyBlocked) {
      signals.push({
        id: "bba-assignment-repeatedly-blocked",
        category: "behavior",
        weight: 65,
        influence: "primary",
        outcome: "reduce-execution-friction",
        label: "Business Building Assignment\u2122 blocked again this week",
      })
    }
  }

  return signals.sort((a, b) => b.weight - a.weight)
}
