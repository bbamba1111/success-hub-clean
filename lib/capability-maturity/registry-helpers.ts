/**
 * Stage Benchmark Registry™ — Query & Gap-Analysis Helpers (Phase 1)
 * ---------------------------------------------------------------------------
 * A clean, read-only interface over `STAGE_BENCHMARKS` for later phases
 * (ESA, Business Context™, Founder Destination™, Founder GPS™, Build
 * Blueprint™, 4-Hour Focused CEO Workday™) to consume.
 *
 * This file does NOT assess a founder, does NOT recommend anything, and
 * does NOT render UI. It only answers structural questions about the
 * registry itself: "what does Launch require for Offer Clarity™?", "which
 * benchmarks are must-have at Growth?", "what's missing between these two
 * dimensions?" Founder-specific reasoning (e.g. "is this founder ready to
 * move from Growth to Scale") is explicitly deferred to Founder GPS™ in a
 * later phase — this module only exposes the primitives that reasoning
 * will need.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { BuildPathId } from "@/lib/build-strategy/types"
import { STAGE_BENCHMARKS } from "./stage-benchmark-registry"
import type { CapabilityDimension, CapabilityPriority, StageBenchmark } from "./types"

/* ===========================================================================
 * Basic lookups
 * ======================================================================== */

/** All benchmarks for a given Business Stage™, across every pillar. */
export function getBenchmarksForStage(businessStage: BusinessStage): StageBenchmark[] {
  return STAGE_BENCHMARKS.filter((b) => b.businessStage === businessStage)
}

/** All benchmarks for a given Operating Pillar™, across every stage. */
export function getBenchmarksForPillar(businessArea: OperatingPillarId): StageBenchmark[] {
  return STAGE_BENCHMARKS.filter((b) => b.businessArea === businessArea)
}

/** All benchmarks for a given Operating Pillar™ at a given Business Stage™. */
export function getBenchmarksForStageAndPillar(
  businessStage: BusinessStage,
  businessArea: OperatingPillarId,
): StageBenchmark[] {
  return STAGE_BENCHMARKS.filter((b) => b.businessStage === businessStage && b.businessArea === businessArea)
}

/** Every stage benchmark row for a single Operating Practice™, one per stage. */
export function getBenchmarksForPractice(practiceId: string): StageBenchmark[] {
  return STAGE_BENCHMARKS.filter((b) => b.practiceId === practiceId)
}

/** The single benchmark for one Operating Practice™ at one Business Stage™, if defined. */
export function getBenchmark(practiceId: string, businessStage: BusinessStage): StageBenchmark | undefined {
  return STAGE_BENCHMARKS.find((b) => b.practiceId === practiceId && b.businessStage === businessStage)
}

/** Look up a single benchmark by its stable registry id (`${practiceId}--${businessStage}`). */
export function getBenchmarkById(id: string): StageBenchmark | undefined {
  return STAGE_BENCHMARKS.find((b) => b.id === id)
}

/* ===========================================================================
 * Priority-based queries
 * ======================================================================== */

/** Benchmarks at a stage matching a specific priority (e.g. all "must-have" at Launch). */
export function getBenchmarksByPriority(businessStage: BusinessStage, priority: CapabilityPriority): StageBenchmark[] {
  return getBenchmarksForStage(businessStage).filter((b) => b.priority === priority)
}

/** The must-have benchmarks at a stage — the foundational expectations for that stage. */
export function getMustHaveBenchmarks(businessStage: BusinessStage): StageBenchmark[] {
  return getBenchmarksByPriority(businessStage, "must-have")
}

/** The should-have benchmarks at a stage — strengthen the stage but aren't foundational. */
export function getShouldHaveBenchmarks(businessStage: BusinessStage): StageBenchmark[] {
  return getBenchmarksByPriority(businessStage, "should-have")
}

/* ===========================================================================
 * Ownership (OWN™ / Build Path™) queries
 * ======================================================================== */

/** Benchmarks at a stage whose typical ownership options include a given Build Path™. */
export function getBenchmarksByOwnershipOption(businessStage: BusinessStage, buildPathId: BuildPathId): StageBenchmark[] {
  return getBenchmarksForStage(businessStage).filter((b) => b.typicalOwnershipOptions.includes(buildPathId))
}

/** The distinct set of Build Path™ options that appear anywhere in the registry for a stage. */
export function getDistinctOwnershipOptionsForStage(businessStage: BusinessStage): BuildPathId[] {
  const seen = new Set<BuildPathId>()
  for (const b of getBenchmarksForStage(businessStage)) {
    for (const option of b.typicalOwnershipOptions) seen.add(option)
  }
  return Array.from(seen)
}

/* ===========================================================================
 * Dependency queries
 * ======================================================================== */

/** The other Operating Practice™ ids this benchmark's practice depends on (same registry row's stage). */
export function getDependencies(practiceId: string, businessStage: BusinessStage): StageBenchmark[] {
  const benchmark = getBenchmark(practiceId, businessStage)
  if (!benchmark) return []
  return benchmark.dependencies
    .map((depPracticeId) => getBenchmark(depPracticeId, businessStage))
    .filter((b): b is StageBenchmark => Boolean(b))
}

/** Every benchmark (at any stage) that lists the given practice as a dependency. */
export function getDependents(practiceId: string): StageBenchmark[] {
  return STAGE_BENCHMARKS.filter((b) => b.dependencies.includes(practiceId))
}

/* ===========================================================================
 * Gap description
 * ---------------------------------------------------------------------------
 * These helpers describe what a single dimension of a single benchmark
 * expects — they do not compare it against any founder's actual state.
 * Founder-specific gap detection (i.e. "this founder is missing X") is
 * Founder GPS™'s responsibility in a later phase.
 * ======================================================================== */

export interface CapabilityGapDescription {
  benchmark: StageBenchmark
  dimension: CapabilityDimension
  /** The benchmark's expectation for this dimension (its `*Criteria` field). */
  expectation: string
}

const DIMENSION_CRITERIA_FIELD: Record<CapabilityDimension, keyof StageBenchmark> = {
  know: "knowCriteria",
  show: "showCriteria",
  build: "buildCriteria",
  own: "ownCriteria",
  prove: "proveCriteria",
  measure: "measureCriteria",
}

/** Describe what a benchmark expects for one specific dimension (e.g. "what does Build™ require here?"). */
export function describeCapabilityGap(
  practiceId: string,
  businessStage: BusinessStage,
  dimension: CapabilityDimension,
): CapabilityGapDescription | undefined {
  const benchmark = getBenchmark(practiceId, businessStage)
  if (!benchmark) return undefined
  const expectation = benchmark[DIMENSION_CRITERIA_FIELD[dimension]] as string
  return { benchmark, dimension, expectation }
}

/** Describe what a benchmark expects across all six dimensions at once. */
export function describeAllCapabilityGaps(practiceId: string, businessStage: BusinessStage): CapabilityGapDescription[] {
  const benchmark = getBenchmark(practiceId, businessStage)
  if (!benchmark) return []
  return (Object.keys(DIMENSION_CRITERIA_FIELD) as CapabilityDimension[]).map((dimension) => ({
    benchmark,
    dimension,
    expectation: benchmark[DIMENSION_CRITERIA_FIELD[dimension]] as string,
  }))
}

/* ===========================================================================
 * Stage summary
 * ======================================================================== */

export interface StageBenchmarkSummary {
  businessStage: BusinessStage
  totalBenchmarks: number
  mustHaveCount: number
  shouldHaveCount: number
  emergingCount: number
  notYetRelevantCount: number
  pillars: OperatingPillarId[]
}

/** A structural summary of what a stage's benchmarks look like — counts only, no founder data involved. */
export function summarizeStage(businessStage: BusinessStage): StageBenchmarkSummary {
  const benchmarks = getBenchmarksForStage(businessStage)
  const pillars = Array.from(new Set(benchmarks.map((b) => b.businessArea)))
  return {
    businessStage,
    totalBenchmarks: benchmarks.length,
    mustHaveCount: benchmarks.filter((b) => b.priority === "must-have").length,
    shouldHaveCount: benchmarks.filter((b) => b.priority === "should-have").length,
    emergingCount: benchmarks.filter((b) => b.priority === "emerging").length,
    notYetRelevantCount: benchmarks.filter((b) => b.priority === "not-yet-relevant").length,
    pillars,
  }
}
