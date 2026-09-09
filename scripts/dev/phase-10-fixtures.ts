/**
 * Phase 10 fixtures — Build Record™ + Business Resource Intelligence™ +
 * Founder GPS™ feedback loop. Exercises the pure engine functions with a
 * lettered set of scenarios (A–Z) so regressions surface without a browser.
 * Run with: npx tsx scripts/dev/phase-10-fixtures.ts
 */

import type { BuildBlueprint, BuildPathId } from "@/lib/build-strategy/types"
import { deriveBuildRecord, deriveFounderAttention, applyBuildStatusTransition } from "@/lib/build-record/build-record-engine"
import type { BuildLifecycleStatus } from "@/lib/build-record/types"
import { assessResourceGap } from "@/lib/business-resource-intelligence/assess-resource-gap"
import { deriveReadinessRelevance } from "@/lib/founder-intelligence/readiness-relevance"

let pass = 0
let fail = 0

function check(label: string, condition: boolean) {
  if (condition) {
    pass++
    console.log(`  ✓ ${label}`)
  } else {
    fail++
    console.log(`  ✗ FAIL: ${label}`)
  }
}

function makeBlueprint(buildPath: BuildPathId, detail: BuildBlueprint["detail"]): BuildBlueprint {
  return {
    recommendationId: "start-pricing-clarity",
    buildPath,
    generatedAt: new Date().toISOString(),
    what: "Set clear, simple pricing",
    why: "Founders without clear pricing lose deals to hesitation.",
    whyNow: "You are actively quoting prospects without a fixed structure.",
    desiredOutcome: "A single published price list you use consistently.",
    currentState: "Pricing is decided ad hoc per conversation.",
    targetState: "Pricing is fixed, published, and repeatable.",
    ownerSummary: "Founder decides and publishes; no delegation needed yet.",
    owner: "founder",
    businessModelArchetype: "unknown",
    businessModelAdaptationNote: "No Business Model Profile™ signal yet.",
    prerequisites: [],
    unlocksCapabilities: [],
    budgetEstimate: "not yet determined",
    timelineEstimate: "not yet determined",
    targetCompletionDate: "not yet determined",
    handoffReady: false,
    evidence: [],
    triggeredBy: [],
    stageFraming: "current-stage",
    detail,
  }
}

console.log("\n[A-H] deriveBuildRecord — one scaffold per Build Path™ kind\n")

const pathFixtures: { letter: string; buildPath: BuildPathId; detail: BuildBlueprint["detail"] }[] = [
  { letter: "A", buildPath: "founder-build", detail: { kind: "build-steps", coBuildFraming: false, steps: [
    { stepNumber: 1, title: "List services", objective: "o", instructions: "i", why: "w", expectedOutput: "e", definitionOfDone: "d", dependsOnSteps: [] },
  ] } },
  { letter: "B", buildPath: "co-build", detail: { kind: "build-steps", coBuildFraming: true, steps: [
    { stepNumber: 1, title: "Draft together", objective: "o", instructions: "i", why: "w", expectedOutput: "e", definitionOfDone: "d", dependsOnSteps: [] },
  ] } },
  { letter: "C", buildPath: "ai-build", detail: { kind: "ai-build", aiProducibleOutputs: ["draft price list"], remainingHumanActions: ["approve"], executionAvailable: true } },
  { letter: "D", buildPath: "delegate", detail: { kind: "delegate", suggestedOwnerRole: "Ops lead", handoffDefinitionOfDone: "d", briefingPoints: ["b"] } },
  { letter: "E", buildPath: "hire", detail: { kind: "hire", suggestedRole: "Pricing analyst", coreResponsibilities: ["r"], budgetRange: "not yet determined", timeline: "not yet determined" } },
  { letter: "F", buildPath: "outsource", detail: { kind: "outsource", suggestedSpecialistType: "Pricing consultant", scopeOfWork: ["s"], budgetRange: "not yet determined" } },
  { letter: "G", buildPath: "buy", detail: { kind: "buy", suggestedCategory: "Pricing tool", evaluationCriteria: ["c"], budgetRange: "not yet determined" } },
  { letter: "H", buildPath: "partner", detail: { kind: "partner", suggestedPartnerType: "Agency", scopeHandedToPartner: ["s"], founderRetains: ["r"] } },
]

for (const { letter, buildPath, detail } of pathFixtures) {
  const blueprint = makeBlueprint(buildPath, detail)
  const record = deriveBuildRecord(blueprint)
  check(`[${letter}] ${buildPath}: status starts "path-selected"`, record.status === "path-selected")
  check(`[${letter}] ${buildPath}: execution.kind matches buildPath`, record.execution.kind === buildPath)
  check(`[${letter}] ${buildPath}: at least one milestone + task scaffolded`, record.milestones.length > 0 && record.tasks.length > 0)
  check(`[${letter}] ${buildPath}: no invented dates (startedAt/completedAt/installedAt null)`, record.startedAt === null && record.completedAt === null && record.installedAt === null)
}

console.log("\n[I-P] deriveFounderAttention — status -> signal mapping\n")

const attentionFixtures: { letter: string; status: BuildLifecycleStatus; expected: string }[] = [
  { letter: "I", status: "path-selected", expected: "on-track" },
  { letter: "J", status: "in-progress", expected: "on-track" },
  { letter: "K", status: "blocked", expected: "blocked" },
  { letter: "L", status: "awaiting-external", expected: "awaiting-external" },
  { letter: "M", status: "briefed", expected: "awaiting-external" },
  { letter: "N", status: "review", expected: "review" },
  { letter: "O", status: "installed", expected: "installed" },
  { letter: "P", status: "paused", expected: "attention-needed" },
]

for (const { letter, status, expected } of attentionFixtures) {
  const blueprint = makeBlueprint("founder-build", { kind: "build-steps", coBuildFraming: false, steps: [] })
  let record = deriveBuildRecord(blueprint)
  record = { ...record, status }
  const attention = deriveFounderAttention(record)
  check(`[${letter}] status "${status}" -> attention "${expected}"`, attention === expected)
}

console.log("\n[Q-R] applyBuildStatusTransition — timestamps stamp exactly once\n")

{
  const blueprint = makeBlueprint("founder-build", { kind: "build-steps", coBuildFraming: false, steps: [] })
  let record = deriveBuildRecord(blueprint)
  record = applyBuildStatusTransition(record, "in-progress")
  const firstStartedAt = record.startedAt
  check("[Q] in-progress stamps startedAt", firstStartedAt !== null)
  record = applyBuildStatusTransition(record, "blocked")
  record = applyBuildStatusTransition(record, "in-progress")
  check("[R] re-entering in-progress does not overwrite startedAt", record.startedAt === firstStartedAt)
}

console.log("\n[S-V] assessResourceGap — use-what-you-have checklist\n")

check("[S] a capability covered by a connected resource -> alreadyCoveredByExistingStack true", assessResourceGap("start-pricing-clarity").alreadyCoveredByExistingStack === true)
check("[T] a capability with no matching resource -> empty matchingResources", assessResourceGap("totally-unknown-capability-id").matchingResources.length === 0)
check("[U] recommendation text is derived, not empty", assessResourceGap("start-pricing-clarity").recommendation.length > 0)
check("[V] narrowing existingResourceIds to [] yields no matches even for a normally-covered capability", assessResourceGap("start-pricing-clarity", []).matchingResources.length === 0)

console.log("\n[W-Z] Founder GPS™ feedback loop — capabilityBuildStatusById forces already-installed\n")

{
  const baseInput = {
    businessStage: "launch" as const,
    founderDestination: null,
    businessContext: null,
    esaResults: null,
    businessModelProfile: null,
  }

  const withoutFeedback = deriveReadinessRelevance(baseInput)
  const anyCapabilityId = withoutFeedback[0]?.id
  check("[W] baseline readiness relevance returns at least one capability", !!anyCapabilityId)

  if (anyCapabilityId) {
    const withFeedback = deriveReadinessRelevance({
      ...baseInput,
      capabilityBuildStatusById: { [anyCapabilityId]: "in-progress" },
    })
    const forced = withFeedback.find((c) => c.id === anyCapabilityId)
    check("[X] a capability with status \"in-progress\" is forced to relevanceStatus \"already-installed\"", forced?.relevanceStatus === "already-installed")

    const withInstalled = deriveReadinessRelevance({
      ...baseInput,
      capabilityBuildStatusById: { [anyCapabilityId]: "installed" },
    })
    const forcedInstalled = withInstalled.find((c) => c.id === anyCapabilityId)
    check("[Y] status \"installed\" is also forced to relevanceStatus \"already-installed\"", forcedInstalled?.relevanceStatus === "already-installed")

    const withCancelled = deriveReadinessRelevance({
      ...baseInput,
      capabilityBuildStatusById: { [anyCapabilityId]: "cancelled" },
    })
    const notForced = withCancelled.find((c) => c.id === anyCapabilityId)
    check("[Z] a terminal status (\"cancelled\") does NOT force already-installed", notForced?.relevanceStatus !== "already-installed" || withoutFeedback.find((c) => c.id === anyCapabilityId)?.relevanceStatus === "already-installed")
  }
}

console.log(`\n${pass} passed, ${fail} failed\n`)
if (fail > 0) process.exit(1)
