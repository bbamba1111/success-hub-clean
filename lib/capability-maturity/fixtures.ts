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
import { STAGE_TRANSITIONS } from "./stage-transitions"
import {
  ALL_CAPABILITY_DIMENSIONS,
  ALL_CAPABILITY_PRIORITIES,
  ALL_GAP_CATEGORY_IDS,
  ALL_STAGE_TRANSITION_IDS,
  GAP_CATEGORIES,
} from "./types"
import {
  getBenchmark,
  getBenchmarksForTransitionCriteria,
  getExitCriteriaForStage,
  getGapCategoryForDimension,
  getMustHaveBenchmarks,
  getStageTransition,
  getTransitionFromStage,
  getTransitionToStage,
  summarizeStage,
} from "./registry-helpers"

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
 * Phase 2A — Stage Transitions™ fixtures
 * ======================================================================== */

/* 12. Exactly the 3 expected transitions exist, no more, no less. */
check(
  "Exactly 3 stage transitions exist (launch-to-growth, growth-to-scale, scale-to-legacy)",
  STAGE_TRANSITIONS.length === 3 && ALL_STAGE_TRANSITION_IDS.every((id) => Boolean(getStageTransition(id))),
  `Found ${STAGE_TRANSITIONS.length} transition(s): ${STAGE_TRANSITIONS.map((t) => t.id).join(", ")}`,
)

/* 13. Each transition's fromStage/toStage are adjacent canonical stages, in order. */
const expectedAdjacency: Record<string, [string, string]> = {
  "launch-to-growth": ["launch", "growth"],
  "growth-to-scale": ["growth", "scale"],
  "scale-to-legacy": ["scale", "legacy"],
}
const badAdjacency = STAGE_TRANSITIONS.filter((t) => {
  const expected = expectedAdjacency[t.id]
  return !expected || t.fromStage !== expected[0] || t.toStage !== expected[1]
})
check(
  "Every transition connects the correct adjacent stages",
  badAdjacency.length === 0,
  badAdjacency.length === 0 ? "OK" : `Bad adjacency: ${badAdjacency.map((t) => t.id).join(", ")}`,
)

/* 14. Every exit criterion's practiceId resolves to a real StageBenchmark at the transition's fromStage. */
const brokenExitCriteria: string[] = []
for (const t of STAGE_TRANSITIONS) {
  for (const c of t.exitCriteria) {
    if (!getBenchmark(c.practiceId, t.fromStage)) {
      brokenExitCriteria.push(`${t.id} -> ${c.practiceId} @ ${t.fromStage}`)
    }
  }
}
check(
  "Every stage exit criterion resolves to a real StageBenchmark at its fromStage",
  brokenExitCriteria.length === 0,
  brokenExitCriteria.length === 0 ? "OK" : `Broken: ${brokenExitCriteria.join(", ")}`,
)

/* 15. Every transition has at least one exit criterion, and every criterion has at least one dimension. */
const emptyExitCriteria = STAGE_TRANSITIONS.filter((t) => t.exitCriteria.length === 0)
check(
  "Every transition declares at least one exit criterion",
  emptyExitCriteria.length === 0,
  emptyExitCriteria.length === 0 ? "OK" : `Empty: ${emptyExitCriteria.map((t) => t.id).join(", ")}`,
)
const criteriaMissingDimensions = STAGE_TRANSITIONS.flatMap((t) => t.exitCriteria).filter((c) => c.dimensions.length === 0)
check(
  "Every exit criterion declares at least one CapabilityDimension",
  criteriaMissingDimensions.length === 0,
  criteriaMissingDimensions.length === 0 ? "OK" : `Missing: ${criteriaMissingDimensions.map((c) => c.id).join(", ")}`,
)

/* 16. No duplicate exit criterion ids across the whole registry. */
const criterionIdCounts = new Map<string, number>()
for (const t of STAGE_TRANSITIONS) for (const c of t.exitCriteria) criterionIdCounts.set(c.id, (criterionIdCounts.get(c.id) ?? 0) + 1)
const duplicateCriterionIds = Array.from(criterionIdCounts.entries()).filter(([, count]) => count > 1)
check(
  "No duplicate stage exit criterion ids",
  duplicateCriterionIds.length === 0,
  duplicateCriterionIds.length === 0 ? "OK" : `Duplicates: ${duplicateCriterionIds.map(([id]) => id).join(", ")}`,
)

/* 17. notRequiredForTransition guardrail: none of those practiceIds appear as exit criteria on the same transition
       (a capability cannot simultaneously be required and explicitly not-required for the same transition). */
const contradictoryGuardrails: string[] = []
for (const t of STAGE_TRANSITIONS) {
  const requiredIds = new Set(t.exitCriteria.map((c) => c.practiceId))
  for (const notRequiredId of t.notRequiredForTransition) {
    if (requiredIds.has(notRequiredId)) contradictoryGuardrails.push(`${t.id}: ${notRequiredId}`)
  }
}
check(
  "notRequiredForTransition never contradicts a transition's own exit criteria",
  contradictoryGuardrails.length === 0,
  contradictoryGuardrails.length === 0 ? "OK" : `Contradictions: ${contradictoryGuardrails.join(", ")}`,
)

/* 18. notRequiredForTransition entries reference real practiceIds in the registry (no invented practices). */
const invalidGuardrailPracticeIds: string[] = []
for (const t of STAGE_TRANSITIONS) {
  for (const notRequiredId of t.notRequiredForTransition) {
    if (!knownPracticeIds.has(notRequiredId)) invalidGuardrailPracticeIds.push(`${t.id}: ${notRequiredId}`)
  }
}
check(
  "notRequiredForTransition entries reference real practiceIds",
  invalidGuardrailPracticeIds.length === 0,
  invalidGuardrailPracticeIds.length === 0 ? "OK" : `Invalid: ${invalidGuardrailPracticeIds.join(", ")}`,
)

/* 19. Every transitionSummary and transitionCaution is non-empty (no placeholder/incomplete transitions). */
const incompleteTransitionText = STAGE_TRANSITIONS.filter(
  (t) => !t.transitionSummary.trim() || !t.transitionCaution.trim(),
)
check(
  "Every transition has a non-empty summary and caution",
  incompleteTransitionText.length === 0,
  incompleteTransitionText.length === 0 ? "OK" : `Incomplete: ${incompleteTransitionText.map((t) => t.id).join(", ")}`,
)

/* 20. Legacy has no outgoing transition (it's terminal); Launch has no incoming transition (it's first). */
check(
  "Legacy™ has no outgoing transition (terminal stage)",
  getTransitionFromStage("legacy") === undefined,
  getTransitionFromStage("legacy") === undefined ? "OK" : "Unexpected outgoing transition found from legacy",
)
check(
  "Launch™ has no incoming transition (first stage)",
  getTransitionToStage("launch") === undefined,
  getTransitionToStage("launch") === undefined ? "OK" : "Unexpected incoming transition found to launch",
)

/* 21. Helper sanity: getExitCriteriaForStage/getBenchmarksForTransitionCriteria don't crash and stay consistent. */
let helperMismatch = false
for (const t of STAGE_TRANSITIONS) {
  const criteriaViaStage = getExitCriteriaForStage(t.fromStage)
  const benchmarksViaHelper = getBenchmarksForTransitionCriteria(t.id)
  if (criteriaViaStage.length !== t.exitCriteria.length || benchmarksViaHelper.length !== t.exitCriteria.length) {
    helperMismatch = true
  }
}
check(
  "Stage transition helper functions return consistent, non-crashing results",
  !helperMismatch,
  helperMismatch ? "Mismatch detected between helpers and raw transition data" : "OK",
)

/* ===========================================================================
 * Phase 2A — Gap Categories™ fixtures
 * ======================================================================== */

/* 22. Exactly 6 gap categories exist, one per CapabilityDimension, 1:1. */
check(
  "Exactly 6 Gap Categories exist, one per CapabilityDimension",
  GAP_CATEGORIES.length === 6 && ALL_GAP_CATEGORY_IDS.length === 6,
  `Found ${GAP_CATEGORIES.length} gap categor(ies)`,
)
const dimensionsCoveredByGapCategories = new Set(GAP_CATEGORIES.map((c) => c.dimension))
check(
  "Every CapabilityDimension has exactly one corresponding Gap Category",
  ALL_CAPABILITY_DIMENSIONS.every((d) => dimensionsCoveredByGapCategories.has(d)) &&
    dimensionsCoveredByGapCategories.size === ALL_CAPABILITY_DIMENSIONS.length,
  `Dimensions covered: ${Array.from(dimensionsCoveredByGapCategories).join(", ")}`,
)

/* 23. No duplicate gap category ids or dimensions. */
const gapCategoryIdCounts = new Map<string, number>()
for (const c of GAP_CATEGORIES) gapCategoryIdCounts.set(c.id, (gapCategoryIdCounts.get(c.id) ?? 0) + 1)
const duplicateGapCategoryIds = Array.from(gapCategoryIdCounts.entries()).filter(([, count]) => count > 1)
check(
  "No duplicate Gap Category ids",
  duplicateGapCategoryIds.length === 0,
  duplicateGapCategoryIds.length === 0 ? "OK" : `Duplicates: ${duplicateGapCategoryIds.map(([id]) => id).join(", ")}`,
)

/* 24. Every gap category has non-empty content in all descriptive fields. */
const incompleteGapCategories = GAP_CATEGORIES.filter(
  (c) => !c.name.trim() || !c.founderVoiceExample.trim() || !c.description.trim() || !c.typicalResolutionShape.trim(),
)
check(
  "Every Gap Category has non-empty name/example/description/resolution",
  incompleteGapCategories.length === 0,
  incompleteGapCategories.length === 0 ? "OK" : `Incomplete: ${incompleteGapCategories.map((c) => c.id).join(", ")}`,
)

/* 25. Helper sanity: getGapCategoryForDimension resolves for all 6 dimensions and matches GAP_CATEGORIES directly. */
const gapHelperMismatches = ALL_CAPABILITY_DIMENSIONS.filter((d) => {
  const viaHelper = getGapCategoryForDimension(d)
  const viaDirect = GAP_CATEGORIES.find((c) => c.dimension === d)
  return !viaHelper || !viaDirect || viaHelper.id !== viaDirect.id
})
check(
  "getGapCategoryForDimension resolves correctly for all 6 dimensions",
  gapHelperMismatches.length === 0,
  gapHelperMismatches.length === 0 ? "OK" : `Mismatched: ${gapHelperMismatches.join(", ")}`,
)

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
