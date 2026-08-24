/**
 * Stage Benchmark Registry™ — Deterministic Fixtures (Phase 1)
 * ---------------------------------------------------------------------------
 * Structural checks on `STAGE_BENCHMARKS` itself — NOT founder assessment
 * tests. These verify the registry is internally consistent (every stage
 * covered, every pillar covered, all six dimensions populated, all
 * ownership/dependency references resolve) before any later phase is
 * allowed to build on top of it.
 *
 * Run via: npx tsx lib/capability-maturity/fixtures.ts
 */

import { ALL_BUSINESS_STAGES } from "@/lib/business-stage/business-stage"
import { OPERATING_PILLARS } from "@/lib/entrepreneur-success/esa-registry"
import type { BuildPathId } from "@/lib/build-strategy/types"
import { STAGE_BENCHMARKS } from "./stage-benchmark-registry"
import { ALL_CAPABILITY_DIMENSIONS, ALL_CAPABILITY_PRIORITIES } from "./types"
import { getMustHaveBenchmarks, summarizeStage } from "./registry-helpers"

const VALID_BUILD_PATH_IDS: BuildPathId[] = [
  "founder-build",
  "co-build",
  "ai-build",
  "delegate",
  "hire",
  "outsource",
  "buy",
  "partner",
]

interface FixtureResult {
  name: string
  pass: boolean
  detail: string
}

const results: FixtureResult[] = []

function check(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail })
}

/* 1. All 4 Business Stages are represented. */
for (const stage of ALL_BUSINESS_STAGES) {
  const count = STAGE_BENCHMARKS.filter((b) => b.businessStage === stage).length
  check(`Stage "${stage}" has benchmarks`, count > 0, `${count} benchmark(s) found`)
}

/* 2. All 8 existing ESA Operating Pillars are represented. */
for (const pillar of OPERATING_PILLARS) {
  const count = STAGE_BENCHMARKS.filter((b) => b.businessArea === pillar.id).length
  check(`Pillar "${pillar.id}" has benchmarks`, count > 0, `${count} benchmark(s) found`)
}

/* 3. Every benchmark has non-empty content for all six dimensions. */
const dimensionFieldMap: Record<string, string> = {
  know: "knowCriteria",
  show: "showCriteria",
  build: "buildCriteria",
  own: "ownCriteria",
  prove: "proveCriteria",
  measure: "measureCriteria",
}
let missingDimensionContent = 0
for (const b of STAGE_BENCHMARKS) {
  for (const dimension of ALL_CAPABILITY_DIMENSIONS) {
    const value = (b as any)[dimensionFieldMap[dimension]]
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      missingDimensionContent++
    }
  }
}
check(
  "All benchmarks have non-empty content for all 6 dimensions",
  missingDimensionContent === 0,
  missingDimensionContent === 0 ? "OK" : `${missingDimensionContent} empty dimension field(s) found`,
)

/* 4. Every benchmark declares a valid priority. */
const invalidPriority = STAGE_BENCHMARKS.filter((b) => !ALL_CAPABILITY_PRIORITIES.includes(b.priority))
check(
  "All benchmarks declare a valid CapabilityPriority",
  invalidPriority.length === 0,
  invalidPriority.length === 0 ? "OK" : `${invalidPriority.length} invalid: ${invalidPriority.map((b) => b.id).join(", ")}`,
)

/* 5. typicalOwnershipOptions only reference valid Build Path IDs (all 8 values used somewhere). */
const invalidOwnership = STAGE_BENCHMARKS.filter((b) =>
  b.typicalOwnershipOptions.some((opt) => !VALID_BUILD_PATH_IDS.includes(opt)),
)
check(
  "All typicalOwnershipOptions reference valid Build Path IDs",
  invalidOwnership.length === 0,
  invalidOwnership.length === 0 ? "OK" : `${invalidOwnership.length} invalid: ${invalidOwnership.map((b) => b.id).join(", ")}`,
)

const usedBuildPaths = new Set<BuildPathId>()
for (const b of STAGE_BENCHMARKS) for (const opt of b.typicalOwnershipOptions) usedBuildPaths.add(opt)
const unusedBuildPaths = VALID_BUILD_PATH_IDS.filter((id) => !usedBuildPaths.has(id))
check(
  "All 8 Build Path IDs appear at least once across the registry",
  unusedBuildPaths.length === 0,
  unusedBuildPaths.length === 0 ? "OK" : `Unused: ${unusedBuildPaths.join(", ")}`,
)

/* 6. No duplicate benchmark ids. */
const idCounts = new Map<string, number>()
for (const b of STAGE_BENCHMARKS) idCounts.set(b.id, (idCounts.get(b.id) ?? 0) + 1)
const duplicateIds = Array.from(idCounts.entries()).filter(([, count]) => count > 1)
check(
  "No duplicate benchmark ids",
  duplicateIds.length === 0,
  duplicateIds.length === 0 ? "OK" : `Duplicates: ${duplicateIds.map(([id]) => id).join(", ")}`,
)

/* 7. Every dependency reference resolves to a real practiceId in the registry. */
const knownPracticeIds = new Set(STAGE_BENCHMARKS.map((b) => b.practiceId))
const brokenDependencies: string[] = []
for (const b of STAGE_BENCHMARKS) {
  for (const dep of b.dependencies) {
    if (!knownPracticeIds.has(dep)) brokenDependencies.push(`${b.id} -> ${dep}`)
  }
}
check(
  "All dependency references resolve to known practiceIds",
  brokenDependencies.length === 0,
  brokenDependencies.length === 0 ? "OK" : `Broken: ${brokenDependencies.join(", ")}`,
)

/* 8. Every (practiceId, stage) pair is unique — no accidental duplicate rows per practice. */
const practiceStageKey = new Set<string>()
const duplicatePracticeStage: string[] = []
for (const b of STAGE_BENCHMARKS) {
  const key = `${b.practiceId}::${b.businessStage}`
  if (practiceStageKey.has(key)) duplicatePracticeStage.push(key)
  practiceStageKey.add(key)
}
check(
  "No practice has more than one benchmark row per stage",
  duplicatePracticeStage.length === 0,
  duplicatePracticeStage.length === 0 ? "OK" : `Duplicates: ${duplicatePracticeStage.join(", ")}`,
)

/* 9. Every practice defined in the registry covers all 4 stages (no gaps). */
const practiceStagesMap = new Map<string, Set<string>>()
for (const b of STAGE_BENCHMARKS) {
  if (!practiceStagesMap.has(b.practiceId)) practiceStagesMap.set(b.practiceId, new Set())
  practiceStagesMap.get(b.practiceId)!.add(b.businessStage)
}
const incompletePractices: string[] = []
for (const [practiceId, stages] of Array.from(practiceStagesMap.entries())) {
  if (stages.size !== ALL_BUSINESS_STAGES.length) {
    incompletePractices.push(`${practiceId} (${stages.size}/${ALL_BUSINESS_STAGES.length})`)
  }
}
check(
  "Every practice has a benchmark row for all 4 stages",
  incompletePractices.length === 0,
  incompletePractices.length === 0 ? "OK" : `Incomplete: ${incompletePractices.join(", ")}`,
)

/* 10. Expected total row count: 20 practices x 4 stages = 80. */
const expectedTotal = practiceStagesMap.size * ALL_BUSINESS_STAGES.length
check(
  "Total benchmark row count matches practices x stages",
  STAGE_BENCHMARKS.length === expectedTotal,
  `Found ${STAGE_BENCHMARKS.length}, expected ${expectedTotal} (${practiceStagesMap.size} practices x ${ALL_BUSINESS_STAGES.length} stages)`,
)

/* 11. Helper sanity: getMustHaveBenchmarks/summarizeStage return deterministic, non-crashing output. */
for (const stage of ALL_BUSINESS_STAGES) {
  const mustHaves = getMustHaveBenchmarks(stage)
  const summary = summarizeStage(stage)
  check(
    `summarizeStage("${stage}") counts are internally consistent`,
    summary.mustHaveCount === mustHaves.length && summary.totalBenchmarks === getBenchmarksCountForStage(stage),
    `mustHaveCount=${summary.mustHaveCount}, totalBenchmarks=${summary.totalBenchmarks}`,
  )
}

function getBenchmarksCountForStage(stage: string) {
  return STAGE_BENCHMARKS.filter((b) => b.businessStage === stage).length
}

/* ===========================================================================
 * Report
 * ======================================================================== */

function report() {
  const failed = results.filter((r) => !r.pass)
  console.log("[v0] Stage Benchmark Registry fixtures")
  console.log(`[v0] Total benchmarks: ${STAGE_BENCHMARKS.length}`)
  console.log(`[v0] Distinct practices: ${practiceStagesMap.size}`)
  console.log(`[v0] Checks run: ${results.length}, passed: ${results.length - failed.length}, failed: ${failed.length}`)
  console.log("")
  for (const r of results) {
    console.log(`[v0] ${r.pass ? "PASS" : "FAIL"} — ${r.name} — ${r.detail}`)
  }
  if (failed.length > 0) {
    console.log("")
    console.log(`[v0] FAILURES: ${failed.length}`)
    process.exitCode = 1
  } else {
    console.log("")
    console.log("[v0] All fixtures passed.")
  }
}

report()
