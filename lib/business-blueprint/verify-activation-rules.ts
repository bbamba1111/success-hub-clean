/**
 * Business Blueprint™ — activation/composition engine verification
 * ---------------------------------------------------------------------------
 * PROOF-OF-CONCEPT ONLY. Uses hand-built synthetic `ReadinessCapability`-shaped
 * fixtures and synthetic `BusinessModelProfile` fixtures — NOT the production
 * `READINESS_CAPABILITIES` registry. No production capability is scoped to a
 * specific business model by this file or as a result of running it.
 *
 * Why synthetic fixtures: every seeded capability in the real registry today
 * uses `businessModels: "all"`, so the archetype-mismatch and
 * characteristics-fallback branches of `isCapabilityApplicable()` never fire
 * against real content. Scoping a real capability's `businessModels` just to
 * exercise those branches would be a content-library judgment call (deciding
 * a capability "belongs" to one archetype), not an architecture decision —
 * out of scope for this pass. This file proves the mechanism instead.
 *
 * Run with: node lib/business-blueprint/verify-activation-rules.ts
 * (Node's built-in TS type-stripping erases the `import type` lines below at
 * runtime, so no build step or test framework is required.)
 *
 * This file is not imported by any production code path and is not part of
 * `next build` or `next lint`. Safe to delete once reviewed, or keep as a
 * standing regression check for the gating/composition engine.
 */

import { isCapabilityApplicable, deriveRequirementTiming } from "./activation-rules.ts"
import { composeRequirementSets, type ArchetypeRequirementSet } from "./compose-requirements.ts"
import type { ReadinessCapability } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import type { BusinessModelProfile } from "@/lib/business-model-classification/types"

// ---------------------------------------------------------------------------
// Synthetic fixtures — never written to a production registry.
// ---------------------------------------------------------------------------

function fakeCapability(overrides: Partial<ReadinessCapability>): ReadinessCapability {
  return {
    id: "test-capability",
    pillar: "systems",
    title: "Test capability",
    capability: "Test capability description",
    businessStages: ["growth"],
    businessModels: "all",
    ...overrides,
  } as ReadinessCapability
}

function fakeProfile(overrides: Partial<BusinessModelProfile>): BusinessModelProfile {
  return {
    generatedAt: new Date().toISOString(),
    primaryArchetype: "unknown",
    secondaryArchetypes: [],
    customerModel: "unknown",
    revenueModel: "unknown",
    deliveryModel: "unknown",
    acquisitionModel: "unknown",
    scaleMechanism: "unknown",
    founderDependency: "unknown",
    confidence: "high",
    evidence: ["synthetic test fixture"],
    ...overrides,
  } as BusinessModelProfile
}

let passed = 0
let failed = 0

function check(label: string, condition: boolean) {
  if (condition) {
    passed += 1
    console.log(`[v0] PASS — ${label}`)
  } else {
    failed += 1
    console.error(`[v0] FAIL — ${label}`)
  }
}

// ---------------------------------------------------------------------------
// Test 1 — "all" applies to every selected business model
// ---------------------------------------------------------------------------

{
  const capability = fakeCapability({ id: "test-all-models", businessModels: "all" })
  const coachProfile = fakeProfile({ primaryArchetype: "coaching" })
  const consultantProfile = fakeProfile({ primaryArchetype: "consulting" })

  check(
    "Test 1a — businessModels: 'all' is applicable to Coach",
    isCapabilityApplicable(capability, coachProfile).applicable === true,
  )
  check(
    "Test 1b — businessModels: 'all' is applicable to Consultant",
    isCapabilityApplicable(capability, consultantProfile).applicable === true,
  )
}

// ---------------------------------------------------------------------------
// Test 2 — single-archetype scoping applies to that archetype and not others
// ---------------------------------------------------------------------------

{
  const coachOnly = fakeCapability({ id: "test-coach-only", businessModels: ["coaching"] })
  const coachProfile = fakeProfile({ primaryArchetype: "coaching" })
  const consultantProfile = fakeProfile({ primaryArchetype: "consulting" })

  check(
    "Test 2a — capability scoped to ['coaching'] is applicable to a Coaching archetype",
    isCapabilityApplicable(coachOnly, coachProfile).applicable === true,
  )
  check(
    "Test 2b — capability scoped to ['coaching'] is NOT applicable to a Consulting-only profile",
    isCapabilityApplicable(coachOnly, consultantProfile).applicable === false,
  )
}

// ---------------------------------------------------------------------------
// Test 3 — multi-archetype composition (Coach + Consultant + Thought Leader)
// ---------------------------------------------------------------------------

{
  const hybridProfile = fakeProfile({
    primaryArchetype: "coaching",
    secondaryArchetypes: ["consulting", "creator"],
  })

  const coachOnly = fakeCapability({ id: "test-coach-only", businessModels: ["coaching"] })
  const thoughtLeaderOnly = fakeCapability({ id: "test-thought-leader-only", businessModels: ["creator"] })
  const speakerOnly = fakeCapability({ id: "test-speaker-only", businessModels: ["education"] })

  check(
    "Test 3a — Coaching-scoped capability applies to a Coaching+Consulting+Creator profile",
    isCapabilityApplicable(coachOnly, hybridProfile).applicable === true,
  )
  check(
    "Test 3b — Creator-scoped capability applies via the secondary archetype",
    isCapabilityApplicable(thoughtLeaderOnly, hybridProfile).applicable === true,
  )
  check(
    "Test 3c — Education-scoped capability does NOT apply (not in any selected archetype)",
    isCapabilityApplicable(speakerOnly, hybridProfile).applicable === false,
  )
}

// ---------------------------------------------------------------------------
// Test 4 — union + deduplication across archetype requirement sets
// ---------------------------------------------------------------------------

{
  const coachRequirements: ArchetypeRequirementSet = {
    archetypeId: "coach",
    capabilityIds: ["shared-capability", "coach-only-capability"],
  }
  const thoughtLeaderRequirements: ArchetypeRequirementSet = {
    archetypeId: "thought-leader",
    capabilityIds: ["shared-capability", "thought-leader-only-capability"],
  }

  const composed = composeRequirementSets([coachRequirements, thoughtLeaderRequirements])

  check(
    "Test 4a — union includes capabilities unique to each archetype",
    composed.capabilityIds.includes("coach-only-capability") &&
      composed.capabilityIds.includes("thought-leader-only-capability"),
  )
  check(
    "Test 4b — shared capability appears exactly once (deduplicated)",
    composed.capabilityIds.filter((id) => id === "shared-capability").length === 1,
  )
}

// ---------------------------------------------------------------------------
// Test 5 — a conflict is flagged, not silently resolved, when two archetypes
// claim the SAME capabilityId under different, non-overlapping scopes
// ---------------------------------------------------------------------------

{
  const coachScoped: ArchetypeRequirementSet = {
    archetypeId: "coach",
    capabilityIds: ["delivery-model-capability"],
    scope: ["founder-led-delivery"],
  }
  const consultantScoped: ArchetypeRequirementSet = {
    archetypeId: "consultant",
    capabilityIds: ["delivery-model-capability"],
    scope: ["delegated-delivery"],
  }

  const composed = composeRequirementSets([coachScoped, consultantScoped])

  check(
    "Test 5a — same capabilityId claimed under two non-overlapping scopes is flagged as a configuration conflict",
    composed.configurationConflicts.includes("delivery-model-capability"),
  )
  check(
    "Test 5b — a flagged conflict is NOT silently dropped from the union",
    composed.capabilityIds.includes("delivery-model-capability"),
  )

  const overlappingScope: ArchetypeRequirementSet = {
    archetypeId: "thought-leader",
    capabilityIds: ["shared-scoped-capability"],
    scope: ["founder-led-delivery", "delegated-delivery"],
  }
  const matchingScope: ArchetypeRequirementSet = {
    archetypeId: "coach",
    capabilityIds: ["shared-scoped-capability"],
    scope: ["founder-led-delivery"],
  }
  const noConflict = composeRequirementSets([overlappingScope, matchingScope])
  check(
    "Test 5c — overlapping (not fully divergent) scopes are NOT flagged as a conflict",
    !noConflict.configurationConflicts.includes("shared-scoped-capability"),
  )
}

// ---------------------------------------------------------------------------
// Test 6 — regression guard: "all" is never incorrectly filtered out
// ---------------------------------------------------------------------------

{
  const anyProfile = fakeProfile({ primaryArchetype: "agency" })
  const universalCapability = fakeCapability({ id: "test-universal", businessModels: "all" })

  check(
    "Test 6 — a universal ('all') capability is applicable regardless of the founder's archetype",
    isCapabilityApplicable(universalCapability, anyProfile).applicable === true,
  )
}

// ---------------------------------------------------------------------------
// Test 7 — timing: applicability gate + relevance status maps onto current/future/not-applicable
// ---------------------------------------------------------------------------

{
  const coachProfile = fakeProfile({ primaryArchetype: "coaching" })
  const coachOnly = fakeCapability({ id: "test-coach-only", businessModels: ["coaching"] })
  const speakerOnly = fakeCapability({ id: "test-speaker-only", businessModels: ["education"] })

  const notApplicableApplicability = isCapabilityApplicable(speakerOnly, coachProfile)
  check(
    "Test 7a — a capability not applicable to the founder's archetype maps to 'not-applicable' regardless of relevanceStatus",
    deriveRequirementTiming("relevant", notApplicableApplicability) === "not-applicable",
  )

  const applicableToday = isCapabilityApplicable(coachOnly, coachProfile)
  check(
    "Test 7b — applicable + relevanceStatus 'relevant' maps to 'current'",
    deriveRequirementTiming("relevant", applicableToday) === "current",
  )
  check(
    "Test 7c — applicable + relevanceStatus 'emerging' maps to 'future'",
    deriveRequirementTiming("emerging", applicableToday) === "future",
  )
}

// ---------------------------------------------------------------------------

console.log(`[v0] ---`)
console.log(`[v0] ${passed} passed, ${failed} failed`)
if (failed > 0) {
  process.exitCode = 1
}
