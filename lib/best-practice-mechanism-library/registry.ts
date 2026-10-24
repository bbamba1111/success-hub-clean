/**
 * Best-Practice Mechanism Library™ — Registry (Validation Pass)
 * ---------------------------------------------------------------------------
 * The eventual single source of truth for Best-Practice Mechanisms™. In THIS
 * pass the registry holds exactly TWO fully-populated VALIDATION records
 * (status "validation") — no production corpus, no practitioner library.
 *
 * The two records are deliberately different KINDS of mechanism so the schema
 * is proven against more than one shape:
 *   1. Client Delivery Standardization™ — an operations / delivery mechanism
 *      (Business Builder Asset → workflow → AI → human rules → HROI).
 *   2. High-Value Work Focus™ — a founder-effectiveness mechanism that
 *      eventually supports the 4-Hour CEO Workday™ (executive attention →
 *      protected window → AI prepares / founder focuses / business executes).
 *
 * Each record REFERENCES existing asset registries (EDE asset-registry and the
 * Business Asset Library™) by id — it never creates or duplicates an asset.
 * The AI opportunity / workflow / prompt / copilot artifacts for these two
 * records live in ./validation-ai-artifacts.ts and reference these ids.
 *
 * No practitioner content is encoded as a corpus. Where a mechanism is
 * practitioner-derived, provenance records that honestly and distinguishes the
 * original principle from the Harmony Lane™ adaptation — it never presents a
 * practitioner's framework as Harmony Lane's, nor implies any endorsement.
 */

import type { BestPracticeMechanism, MechanismStage } from "./types"

/* ===========================================================================
 * VALIDATION RECORD 1 — Client Delivery Standardization™
 * ---------------------------------------------------------------------------
 * An operations mechanism, NOT a Human Sustainability mechanism by itself.
 * References the existing "standard-operating-procedure" and
 * "client-onboarding-system" EDE assets and the "sop-playbook-template",
 * "accountability-map", and "role-scorecard" Business Asset Library™ ids.
 * ======================================================================== */

const CLIENT_DELIVERY_STANDARDIZATION: BestPracticeMechanism = {
  id: "client-delivery-standardization",
  name: "Client Delivery Standardization™",
  shortDescription:
    "Produce a consistent client outcome without the founder personally performing every repeatable delivery step.",
  description:
    "A repeatable way to define the standard client result, capture the steps that reliably produce it, and move the repeatable steps off the founder — so delivery quality no longer depends on the founder personally executing each one. The founder keeps ownership of the standard itself and of the exceptions the standard does not cover.",
  businessOutcome:
    "Consistent client outcomes that do not require the founder to personally execute every repeatable delivery step.",
  businessCondition:
    "Delivery quality depends on the founder; results vary when the founder is unavailable, and every new client re-consumes founder time on work that repeats.",
  stages: ["grow", "scale"] as MechanismStage[],
  stageMapping: ["growth", "scale"],
  stageBehavior: {
    start:
      "Precursor only: name what a 'good' client result is and deliver it consistently by hand — no system yet, the founder still performs delivery.",
    grow: "Capture the repeatable delivery steps as a documented standard (SOP / playbook) so a second person can meet the standard without the founder present.",
    scale:
      "Move documented steps to team and tools, measure adherence, and reserve the founder for defining the standard and handling exceptions — delivery capacity grows without more founder hours.",
  },
  businessDomain: "client-delivery",
  requiredCompetencies: [
    { capability: "Define what a 'good' client result actually is", obstacleType: "decision", mode: "learn", dimension: "know" },
    { capability: "Document how a repeatable delivery step is performed", obstacleType: "system", mode: "systemize", dimension: "do" },
    { capability: "Consistently follow and refine the documented standard", obstacleType: "system", mode: "practice", dimension: "practice" },
    { capability: "Meet the documented standard without the founder present", obstacleType: "delegation", mode: "delegate", dimension: "team" },
    {
      capability: "Personally performing every repeatable delivery step",
      obstacleType: "delegation",
      mode: "delegate",
      dimension: "founder-retires",
    },
  ],
  prerequisiteMechanismIds: [],
  enablesMechanismIds: ["high-value-work-focus"],
  // References to EXISTING asset registries — never new asset records.
  edeAssetIds: ["standard-operating-procedure", "client-onboarding-system"],
  businessAssetLibraryIds: ["sop-playbook-template", "accountability-map", "role-scorecard"],
  relevantEgaGapRefs: [],
  relevantObstacleTypes: ["system", "delegation", "capacity"],
  applicableActionTypes: ["build", "design", "delegate", "restructure"],
  suggestedBuildPaths: ["founder-build", "co-build", "delegate"],
  founderRoleImplication: "The founder shifts from performing delivery to defining the standard and owning the exceptions.",
  operatingRuleImplication:
    "New delivery work follows the documented standard; deviations are logged and reviewed, not silently improvised.",
  timeHorizon: "30-days",
  workInterventionTypes: ["standardized", "delegated", "augmented-with-ai", "kept-human"],
  humanJudgmentRequirements: [
    "Defining what a 'good' client result is",
    "Handling non-standard client situations the standard does not cover",
    "Deciding when a repeated exception should become part of the standard",
  ],
  humanSustainability: {
    humanValueAffected: "Founder time and attention reclaimed from repeatable delivery",
    boundaryAtRisk: "Founder remains the permanent quality-control bottleneck for every client",
    requiredByBoundary: "A documented standard others can meet without the founder present",
    operatingRuleImplication: "Delivery follows the standard; the founder reviews exceptions, not every task",
    capacityToProtect: "Founder focus reserved for high-judgment work",
    keepHuman: ["Defining the standard", "Exception handling", "Final client-relationship judgment"],
    mayDelegate: ["Executing documented delivery steps"],
    mayAutomate: ["Status updates", "Checklist enforcement", "Handoff reminders"],
    mayAugment: [
      "Drafting delivery documentation from real examples",
      "Drafting answers to routine recurring client questions from approved sources",
    ],
    humanEscalation: [
      "Client dissatisfaction the standard did not anticipate",
      "Requests that fall outside the defined standard result",
    ],
  },
  hroi: {
    businessMeasures: ["Delivery consistency", "Response speed", "Founder-dependency reduction", "Delivery capacity", "Client experience"],
    humanMeasures: [
      "Founder interruptions reduced",
      "After-hours delivery work reduced",
      "Cognitive load reduced",
      "Protected founder focus time",
      "Balanced team workload",
    ],
  },
  provenance: {
    sourceType: "documented-business-practice",
    harmonyLaneAdaptation:
      "Framed as an operations mechanism that is explicitly gated by Human Sustainability™ rules — standardization removes the founder as a delivery bottleneck WITHOUT simply refilling the reclaimed capacity with more work.",
    isHarmonyLaneNative: false,
    evidenceStrength: "practitioner-derived",
    evidenceNotes:
      "Process standardization / SOP documentation is a widely documented operations practice (quality management, EOS-style operating systems, E-Myth systemization). No single third-party framework is claimed as the source; Harmony Lane's specific contribution is the Human Sustainability™ gating.",
  },
  status: "validation",
}

/* ===========================================================================
 * VALIDATION RECORD 2 — High-Value Work Focus™
 * ---------------------------------------------------------------------------
 * A founder operating / executive-effectiveness mechanism. Eventually supports
 * the 4-Hour CEO Workday™. References existing "decision-framework" and
 * "strategic-plan" EDE assets and the "priority-clarity-score",
 * "28-day-focus-plan", "good-better-best-outcome-ladder", and
 * "delegation-brief" Business Asset Library™ ids. Provenance records the focus
 * principle as practitioner-derived — NOT a proprietary Harmony Lane framework
 * and NOT attributed to any practitioner as an endorsed framework.
 * ======================================================================== */

const HIGH_VALUE_WORK_FOCUS: BestPracticeMechanism = {
  id: "high-value-work-focus",
  name: "High-Value Work Focus™",
  shortDescription:
    "Deliberately concentrate the founder's limited executive attention on the highest-value business work instead of letting reactive work consume it.",
  description:
    "A repeatable way to identify the small number of highest-value activities only the founder should perform, protect a work window for them, and route lower-value and reactive work to elimination, delegation, systems, or AI preparation — so the founder's scarce attention compounds on work that actually moves the business rather than being absorbed by whatever is loudest.",
  businessOutcome:
    "The founder's executive attention is consistently spent on the highest-value business work rather than absorbed by reactive, low-leverage tasks.",
  businessCondition:
    "Reactive and low-value work is consuming the founder's available executive time; the highest-value work is repeatedly crowded out or pushed to after hours.",
  stages: ["start", "grow", "scale"] as MechanismStage[],
  stageMapping: ["launch", "growth", "scale"],
  stageBehavior: {
    start:
      "Identify the few activities that most drive a highly successful business (offer, key relationships, decisive selling) and protect time for them even while doing most of the work personally.",
    grow: "Formalize the line between high-value founder work and reactive work, and begin routing reactive/repeatable work to delegation and systems so the high-value window is protected.",
    scale:
      "Institutionalize a protected executive work window (the 4-Hour CEO Workday™) with team and AI preparing inputs before it and executing bounded follow-up after it.",
  },
  businessDomain: "founder-effectiveness",
  requiredCompetencies: [
    { capability: "Identify which work is genuinely highest-value versus merely urgent", obstacleType: "priority", mode: "learn", dimension: "know" },
    { capability: "Protect and defend a work window for high-value work", obstacleType: "time", mode: "practice", dimension: "do" },
    { capability: "Consistently decline or route low-value work in the moment", obstacleType: "priority", mode: "practice", dimension: "practice" },
    {
      capability: "Prepare inputs and handle bounded follow-up so the founder's window stays high-value",
      obstacleType: "delegation",
      mode: "delegate",
      dimension: "team",
    },
    {
      capability: "Personally absorbing reactive and low-value work during prime hours",
      obstacleType: "time",
      mode: "delegate",
      dimension: "founder-retires",
    },
  ],
  prerequisiteMechanismIds: [],
  enablesMechanismIds: [],
  edeAssetIds: ["decision-framework", "strategic-plan"],
  businessAssetLibraryIds: ["priority-clarity-score", "28-day-focus-plan", "good-better-best-outcome-ladder", "delegation-brief"],
  relevantEgaGapRefs: [],
  relevantObstacleTypes: ["priority", "time", "capacity"],
  applicableActionTypes: ["design", "restructure", "protect_non_negotiables", "delegate"],
  suggestedBuildPaths: ["founder-build", "delegate"],
  founderRoleImplication: "The founder moves from being the default owner of all work to being the deliberate owner of only the highest-value work.",
  operatingRuleImplication: "A protected high-value work window is a non-negotiable; reactive work is scheduled around it, not through it.",
  timeHorizon: "30-days",
  workInterventionTypes: ["eliminated", "simplified", "delegated", "augmented-with-ai", "kept-human"],
  humanJudgmentRequirements: [
    "Deciding what counts as highest-value work for this business right now",
    "Making the decisions, judgments, and relationship moves only the founder can make",
    "Choosing what to stop doing",
  ],
  humanSustainability: {
    humanValueAffected: "Founder attention, focus, and recovery — and the life space outside work",
    boundaryAtRisk:
      "A protected executive window becomes just another block reactive work invades, or freed time is immediately refilled with more work",
    requiredByBoundary: "A defended high-value work window with explicit rules for what may and may not enter it",
    operatingRuleImplication:
      "AI and team prepare BEFORE the window and execute bounded follow-up AFTER it; the window itself stays founder-only high-value work",
    capacityToProtect: "The founder's finite daily executive attention and non-work recovery time",
    keepHuman: ["Judgment", "Decisions", "Innovation", "Key relationships", "Leadership"],
    mayDelegate: ["Reactive work", "Repeatable low-value tasks", "Bounded follow-up"],
    mayAutomate: ["Scheduling and coordination", "Routine status handling"],
    mayAugment: ["Research, summarization, option preparation, and drafting done before the window"],
    humanEscalation: ["Anything requiring a founder decision or judgment call — surfaced FOR the protected window, not around it"],
  },
  hroi: {
    businessMeasures: ["High-value work completed", "Strategic progress", "Revenue / capacity impact", "Priority execution rate"],
    humanMeasures: ["Protected CEO time preserved", "Interruptions reduced", "Focus", "Recovery", "Time available for life"],
  },
  provenance: {
    sourceType: "practitioner-methodology",
    harmonyLaneAdaptation:
      "The practitioner principle of concentrating effort on the highest-value activities is adapted into an AI-era operating model — AI prepares, the founder focuses, the business executes, and human life is protected — and wired to the 4-Hour CEO Workday™. The underlying focus principle is practitioner-derived; it is not claimed as a Harmony Lane invention.",
    isHarmonyLaneNative: false,
    evidenceStrength: "practitioner-derived",
    evidenceNotes:
      "Reflects a widely taught executive-focus / highest-value-activity principle common to sales and management practice. Recorded as a practitioner-derived principle, not a proprietary framework, and not presented as endorsed by any practitioner.",
  },
  status: "validation",
}

/**
 * The full library. Contains ONLY the two validation records in this pass.
 * Populate with real production Start / Grow / Scale mechanisms — and any
 * practitioner-derived corpus — in a later, deliberate pass.
 */
export const BEST_PRACTICE_MECHANISMS: readonly BestPracticeMechanism[] = [
  CLIENT_DELIVERY_STANDARDIZATION,
  HIGH_VALUE_WORK_FOCUS,
] as const

/* ===========================================================================
 * Read-only helpers (no engine, no scoring, no recommendation logic)
 * ======================================================================== */

/** Approved production mechanisms — excludes validation, draft, and schema-example records. Empty in this pass. */
export function getProductionMechanisms(): readonly BestPracticeMechanism[] {
  return BEST_PRACTICE_MECHANISMS.filter((m) => m.status === "active")
}

/** The validation records authored to prove the schema travels end-to-end. */
export function getValidationMechanisms(): readonly BestPracticeMechanism[] {
  return BEST_PRACTICE_MECHANISMS.filter((m) => m.status === "validation")
}

/** Look up a mechanism by id (includes validation records). */
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
