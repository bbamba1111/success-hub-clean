/**
 * Best-Practice Mechanism Library™ — Registry (Architecture Foundation)
 * ---------------------------------------------------------------------------
 * The eventual single source of truth for Best-Practice Mechanisms™. In THIS
 * architecture pass the production corpus is intentionally EMPTY. The only
 * entry is a single schema-demonstration record (status "schema-example")
 * that proves the type surface compiles and shows how a mechanism REFERENCES
 * existing Business Asset™ ids rather than duplicating them. It must never be
 * treated as production data — `getProductionMechanisms()` excludes it.
 *
 * No practitioner content (Chet Holmes, Tony Robbins, Drucker, Gerber,
 * Harnish, EOS, etc.) is encoded here. Populating the corpus for
 * Start / Grow / Scale is a deliberate later pass.
 */

import type { BestPracticeMechanism, MechanismStage } from "./types"

/* ===========================================================================
 * Schema-demonstration entry (NOT production)
 * ---------------------------------------------------------------------------
 * "Client Delivery Standardization Mechanism™" is used purely to demonstrate
 * the schema and the reference pattern:
 *   - it REFERENCES the existing "standard-operating-procedure" and
 *     "client-onboarding-system" EDE assets and the "sop-documentation" BAL
 *     lineage, rather than creating new asset records;
 *   - it maps to real EGA obstacle/action vocabulary;
 *   - it shows the Human Sustainability™ and HROI™ connection fields populated.
 * ======================================================================== */

const SCHEMA_EXAMPLE_MECHANISM: BestPracticeMechanism = {
  id: "client-delivery-standardization",
  name: "Client Delivery Standardization Mechanism™",
  shortDescription:
    "Deliver a consistent client result without the founder personally performing every repeatable step.",
  description:
    "A repeatable way to define the standard client result, capture the steps that produce it, and move those steps off the founder — so delivery quality no longer depends on the founder being personally involved in each one.",
  businessOutcome:
    "Consistent client outcomes that do not require the founder to personally execute every repeatable delivery step.",
  businessCondition:
    "Delivery quality currently depends on the founder; results vary when the founder is unavailable or stretched.",
  stages: ["grow", "scale"] as MechanismStage[],
  stageMapping: ["growth", "scale"],
  businessDomain: "client-delivery",
  requiredCompetencies: [
    { capability: "Document how a repeatable delivery step is actually performed", obstacleType: "system", mode: "systemize" },
    { capability: "Hand a documented step to a team member or tool", obstacleType: "delegation", mode: "delegate" },
  ],
  prerequisiteMechanismIds: [],
  enablesMechanismIds: [],
  // References to EXISTING asset registries — never new asset records.
  edeAssetIds: ["standard-operating-procedure", "client-onboarding-system"],
  businessAssetLibraryIds: [],
  relevantEgaGapRefs: [],
  relevantObstacleTypes: ["system", "delegation"],
  applicableActionTypes: ["build", "delegate", "restructure"],
  suggestedBuildPaths: ["founder-build", "co-build", "delegate"],
  founderRoleImplication:
    "The founder shifts from performing delivery to defining the standard and owning exceptions.",
  operatingRuleImplication:
    "New delivery work follows the documented standard; deviations are logged, not improvised silently.",
  timeHorizon: "30-days",
  workInterventionTypes: ["standardized", "delegated", "augmented-with-ai"],
  humanJudgmentRequirements: [
    "Deciding what a 'good' client result actually is",
    "Handling non-standard client situations the standard does not cover",
  ],
  humanSustainability: {
    humanValueAffected: "Founder time and attention reclaimed from repeatable delivery",
    boundaryAtRisk: "Founder becomes the permanent quality-control bottleneck",
    requiredByBoundary: "A documented standard others can meet without the founder present",
    operatingRuleImplication: "Delivery follows the standard; the founder reviews exceptions, not every task",
    capacityToProtect: "Founder focus for high-judgment work",
    keepHuman: ["Defining the standard", "Exception handling"],
    mayDelegate: ["Executing documented delivery steps"],
    mayAutomate: ["Status updates", "Checklist enforcement"],
    mayAugment: ["Drafting delivery documentation from examples"],
    humanEscalation: ["Client dissatisfaction that the standard did not anticipate"],
  },
  hroi: {
    businessMeasures: ["Delivery consistency", "Founder-dependency reduction", "Client experience", "Scalability"],
    humanMeasures: ["Founder time reclaimed", "Reduced interruptions", "Protected focus"],
  },
  provenance: {
    sourceType: "harmony-lane-native",
    isHarmonyLaneNative: true,
    evidenceStrength: "harmony-lane-native",
    evidenceNotes:
      "Schema-demonstration record only. Not derived from any third-party framework and not production data.",
  },
  status: "schema-example",
}

/**
 * The full library. Contains ONLY the schema-demonstration entry in this
 * architecture pass. Populate with real Start / Grow / Scale mechanisms in a
 * later pass.
 */
export const BEST_PRACTICE_MECHANISMS: readonly BestPracticeMechanism[] = [SCHEMA_EXAMPLE_MECHANISM] as const

/* ===========================================================================
 * Read-only helpers (no engine, no scoring, no recommendation logic)
 * ======================================================================== */

/** All production mechanisms — excludes the schema-example record. Empty in this pass. */
export function getProductionMechanisms(): readonly BestPracticeMechanism[] {
  return BEST_PRACTICE_MECHANISMS.filter((m) => m.status !== "schema-example")
}

/** Look up a mechanism by id (includes the schema-example record). */
export function getMechanismById(id: string): BestPracticeMechanism | undefined {
  return BEST_PRACTICE_MECHANISMS.find((m) => m.id === id)
}

/** Production mechanisms that serve a given Start / Grow / Scale stage. */
export function getMechanismsByStage(stage: MechanismStage): readonly BestPracticeMechanism[] {
  return getProductionMechanisms().filter((m) => m.stages.includes(stage))
}

/** Production mechanisms that reference a given EDE outcome-asset id. */
export function getMechanismsForEdeAsset(edeAssetId: string): readonly BestPracticeMechanism[] {
  return getProductionMechanisms().filter((m) => m.edeAssetIds?.includes(edeAssetId))
}

/** Production mechanisms that reference a given Business Asset Library™ id. */
export function getMechanismsForBusinessAsset(assetId: string): readonly BestPracticeMechanism[] {
  return getProductionMechanisms().filter((m) => m.businessAssetLibraryIds?.includes(assetId))
}

/**
 * EXTENSION POINT — Gap → Mechanism.
 * Production mechanisms whose obstacle vocabulary matches a given EGA obstacle
 * type. This is a read-only convenience, NOT a second gap or recommendation
 * engine; the existing EGA `resolveKnownGapAndSolution` remains authoritative.
 */
export function getMechanismsForObstacleType(
  obstacleType: NonNullable<BestPracticeMechanism["relevantObstacleTypes"]>[number],
): readonly BestPracticeMechanism[] {
  return getProductionMechanisms().filter((m) => m.relevantObstacleTypes?.includes(obstacleType))
}

/**
 * EXTENSION POINT — dependency graph.
 * Direct prerequisites of a mechanism, resolved to records where known.
 * A full transitive graph is deliberately NOT built in this pass.
 */
export function getPrerequisiteMechanisms(id: string): readonly BestPracticeMechanism[] {
  const mechanism = getMechanismById(id)
  if (!mechanism?.prerequisiteMechanismIds?.length) return []
  return mechanism.prerequisiteMechanismIds
    .map((pid) => getMechanismById(pid))
    .filter((m): m is BestPracticeMechanism => Boolean(m))
}
