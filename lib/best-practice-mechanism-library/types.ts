/**
 * Best-Practice Mechanism Library™ — Type Surface (Architecture Foundation)
 * ---------------------------------------------------------------------------
 * ARCHITECTURE / DESIGN PASS ONLY. This module introduces the missing
 * conceptual layer between a founder's Business Reality and the concrete
 * Business Asset™ they eventually build:
 *
 *   Business Reality
 *     → Gap / Need              (EGA — lib/ega)
 *     → BEST-PRACTICE MECHANISM™  (THIS module — the missing "how" layer)
 *     → Required Competency     (derived from EGA obstacle vocabulary)
 *     → Business Asset™          (BAL — lib/business-asset-library,
 *                                 and EDE — lib/executive-decision-engine)
 *     → Build Blueprint™         (lib/build-strategy)
 *     → Operating Rule™          (existing artifactKind)
 *     → AI / Technology          (reuses LeverageClassId intervention vocab)
 *     → Human Sustainability™     (connection points only, this pass)
 *     → HROI™                     (connection points only, this pass)
 *
 * A Best-Practice Mechanism™ is the underlying, repeatable WAY a successful
 * business accomplishes an important business outcome. It is NOT a task,
 * checklist, template, business asset, course, motivational concept, generic
 * tip, AI tool, recommendation, or founder goal. The mechanism names the
 * outcome and the repeatable way to reach it; the EXISTING Business Asset
 * libraries remain the single source of truth for WHAT gets built.
 *
 * INTENTIONALLY ADDITIVE. This module:
 *   - creates NO new assessment, academy, gap engine, recommendation engine,
 *     or Build Blueprint engine;
 *   - does NOT duplicate the Business Asset Library™ or the EDE asset registry
 *     — it REFERENCES their ids;
 *   - changes NO existing file, type, or business logic;
 *   - ships NO production corpus — the registry stays empty except for a
 *     single, clearly-marked schema-demonstration entry (status
 *     "schema-example") that never surfaces as production data.
 *
 * Every id-reference field below is a plain `string` typed as its home id
 * union where cheap, so a mechanism can point at real EGA/BAL/EDE/Blueprint
 * records without this module taking a hard runtime dependency on their data.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { LeverageClassId } from "@/lib/executive-decision-engine/types"
import type { EgaObstacleType, EgaActionType } from "@/lib/ega/types"
import type { BuildPathId } from "@/lib/build-strategy/types"
import type { Lever as CaioLever } from "@/lib/founder-os/ai-transformation"

/* ===========================================================================
 * 1. STAGE — Start / Grow / Scale
 * ---------------------------------------------------------------------------
 * The three business environments a mechanism can serve. Deliberately its own
 * concept, NOT the existing `BusinessStage` ("launch" | "growth" | "scale" |
 * "legacy"), because these describe the mechanism's PURPOSE, not the founder's
 * lifecycle position:
 *   start — build a highly successful business
 *   grow  — make a successful business repeatable and less founder-dependent
 *   scale — produce value at greater scale without more human consumption
 * A mechanism may belong to one, two, or all three. `stageMapping` records
 * the (non-authoritative) relationship to the founder-lifecycle BusinessStage
 * so the two vocabularies can be reconciled later without a migration.
 * ======================================================================== */

export type MechanismStage = "start" | "grow" | "scale"

export const ALL_MECHANISM_STAGES: MechanismStage[] = ["start", "grow", "scale"]

/* ===========================================================================
 * 2. WORK INTERVENTION — the AI / Technology layer
 * ---------------------------------------------------------------------------
 * AI is never assumed to be the answer. This EXTENDS the existing Executive
 * Decision Engine™ leverage vocabulary (`LeverageClassId` =
 * "keep" | "delegate" | "automate" | "eliminate") rather than replacing it —
 * a mechanism's work can resolve to any of the richer options below, and the
 * `leverageClassEquivalent` helper maps each back to the canonical
 * LeverageClassId so nothing downstream needs a new enum.
 * ======================================================================== */

export type WorkInterventionType =
  | "eliminated" // the work should stop entirely (maps to LeverageClassId "eliminate")
  | "simplified" // reduce the work before touching tooling
  | "delegated" // a human takes ownership (maps to "delegate")
  | "standardized" // make it repeatable (SOP / playbook) before automating
  | "automated" // rule-based technology performs it (maps to "automate")
  | "augmented-with-ai" // AI assists a human who stays in the loop
  | "ai-agent-assisted" // an AI agent performs it under human supervision
  | "kept-human" // must remain human work (maps to "keep")

/* ===========================================================================
 * 3. COMPETENCY — reuses the EGA obstacle vocabulary
 * ---------------------------------------------------------------------------
 * No new competency assessment. A mechanism declares which capability it
 * demands and what the founder's realistic response is. `obstacleType` is the
 * SAME EgaObstacleType the EGA already produces, so a founder's known EGA
 * obstacles can be matched against a mechanism's competencies directly.
 * ======================================================================== */

/** What the founder/team must actually DO about a required capability. */
export type CapabilityMode =
  | "learn"
  | "practice"
  | "build"
  | "delegate"
  | "systemize"
  | "augment"

/**
 * Which side of the competency question a requirement answers. Lets a
 * mechanism carry the "what must the founder KNOW / DO / PRACTICE, what must
 * the TEAM do, and what does the founder NO LONGER do" metadata as structured
 * data — without a competency assessment engine.
 */
export type CompetencyDimension =
  | "know" // knowledge the founder must have
  | "do" // an action the founder must be able to perform
  | "practice" // a behavior the founder must repeat until reliable
  | "team" // a capability the team must hold
  | "founder-retires" // work the founder no longer personally performs once the mechanism works

export interface MechanismCompetency {
  /** Plain-language capability the mechanism requires. */
  capability: string
  /** The EGA obstacle this capability maps to, when it corresponds to one. */
  obstacleType?: EgaObstacleType
  /** The founder's realistic response — learn it, practice it, build it, delegate it, systemize it, or augment it. */
  mode: CapabilityMode
  /** Which competency question this requirement answers (know / do / practice / team / founder-retires). */
  dimension?: CompetencyDimension
}

/* ===========================================================================
 * 4. PROVENANCE — required on every mechanism
 * ---------------------------------------------------------------------------
 * The eventual corpus is derived from many bodies of work. Provenance must
 * always distinguish a Harmony Lane™ native mechanism from an adaptation of a
 * third party's framework, and must NEVER imply a Harmony Lane mechanism was
 * authored by someone else. No practitioner content is loaded in this pass.
 * ======================================================================== */

export type MechanismSourceType =
  | "management-research"
  | "operations-research"
  | "strategy-research"
  | "practitioner-methodology"
  | "documented-business-practice"
  | "harmony-lane-native"

/** How well-supported the mechanism is by evidence. */
export type EvidenceStrength = "research-supported" | "practitioner-derived" | "harmony-lane-native"

export interface MechanismProvenance {
  sourceType: MechanismSourceType
  /** Named source work/framework, when adapted from one (e.g. a book or methodology). Omit for native mechanisms. */
  sourceWork?: string
  /** Named originator/author, when applicable. Omit for native mechanisms. */
  originalSource?: string
  /** How Harmony Lane™ adapted the source, if it did. */
  harmonyLaneAdaptation?: string
  /** True only for mechanisms authored by Harmony Lane™ — never set alongside a third-party originalSource. */
  isHarmonyLaneNative: boolean
  evidenceStrength: EvidenceStrength
  /** Free-form notes on the evidence base. */
  evidenceNotes?: string
}

/* ===========================================================================
 * 5. HUMAN SUSTAINABILITY™ — connection points only
 * ---------------------------------------------------------------------------
 * Every mechanism must eventually pass through the Human Sustainability
 * Business Model™. This pass establishes the FIELDS the future engine will
 * read; it does not build that engine.
 * ======================================================================== */

export interface MechanismHumanSustainability {
  /** Human value this mechanism could affect (time, attention, autonomy, focus, recovery, meaningful work). */
  humanValueAffected?: string
  /** A boundary the mechanism might threaten if implemented carelessly. */
  boundaryAtRisk?: string
  /** The business requirement created by protecting that boundary. */
  requiredByBoundary?: string
  /** An Operating Rule™ that may need to change to keep the mechanism sustainable. */
  operatingRuleImplication?: string
  /** Human capacity that must be protected. */
  capacityToProtect?: string
  /** Work that should remain human. */
  keepHuman?: string[]
  /** Work that may be delegated. */
  mayDelegate?: string[]
  /** Work that may be automated. */
  mayAutomate?: string[]
  /** Work that may be augmented with AI. */
  mayAugment?: string[]
  /** Escalation that must remain human. */
  humanEscalation?: string[]
}

/* ===========================================================================
 * 6. HROI™ — Holistic Return on Investment™ connection points only
 * ---------------------------------------------------------------------------
 * The future HROI engine evaluates a business return AND a human return. This
 * pass declares the measure lists that engine will consume; it performs no
 * calculation.
 * ======================================================================== */

export interface MechanismHroiMeasures {
  /** Business-return measures (capacity, revenue, speed, quality, consistency, client experience, scalability, founder-dependency). */
  businessMeasures: string[]
  /** Human-return measures (time, attention, recovery, autonomy, focus, workload, interruptions, meaningful work, protected life space). */
  humanMeasures: string[]
}

/* ===========================================================================
 * 7. THE MECHANISM
 * ======================================================================== */

export type MechanismStatus =
  /** The single demonstration record proving the schema compiles — never production. */
  | "schema-example"
  /**
   * A real, fully-populated mechanism authored to validate that the schema can
   * carry a mechanism end-to-end (Gap → Mechanism → Competency → Asset →
   * Blueprint → Work → Intervention → AI → Human Sustainability → HROI).
   * NOT production data and NOT part of a corpus — excluded from
   * getProductionMechanisms(), surfaced only via getValidationMechanisms().
   */
  | "validation"
  /** Authored but not yet approved for production surfacing. */
  | "draft"
  /** Approved for production surfacing (none exist in this pass). */
  | "active"

export interface BestPracticeMechanism {
  /** Stable identifier — safe for routing, storage, and future engine hooks. */
  id: string
  /** Brand name (e.g. "Client Delivery Standardization Mechanism™"). */
  name: string
  /** One-line summary for cards. */
  shortDescription: string
  /** The repeatable way this mechanism accomplishes its outcome. */
  description: string

  /** The important business outcome this mechanism produces. */
  businessOutcome: string
  /** The business condition/trigger under which this mechanism becomes relevant. */
  businessCondition: string

  /** Which of Start / Grow / Scale this mechanism serves — one or more. */
  stages: MechanismStage[]
  /**
   * Non-authoritative mapping to the founder-lifecycle BusinessStage vocabulary,
   * so the two can be reconciled later without a data migration. Optional.
   */
  stageMapping?: BusinessStage[]
  /**
   * How the mechanism actually behaves in each Start / Grow / Scale environment.
   * Only the stages where the behavior is genuinely different need entries — a
   * mechanism is never forced to describe a stage the evidence does not support.
   */
  stageBehavior?: Partial<Record<MechanismStage, string>>
  /** Business domain/area (e.g. "sales", "client-delivery", "operations"). Free-form this pass. */
  businessDomain?: string

  /** Capabilities the mechanism requires — reuses the EGA obstacle vocabulary. */
  requiredCompetencies: MechanismCompetency[]

  /* ---- Dependency graph (extension point — see registry helpers) ---- */
  /** Mechanisms that should exist first. */
  prerequisiteMechanismIds?: string[]
  /** Mechanisms this one unlocks. */
  enablesMechanismIds?: string[]

  /* ---- Connections to existing systems (references, never duplicates) ---- */
  /** Business Asset Library™ ids (lib/business-asset-library) this mechanism can be realized through. */
  businessAssetLibraryIds?: string[]
  /** Executive Decision Engine™ outcome-asset ids (lib/executive-decision-engine/asset-registry) this mechanism maps to. */
  edeAssetIds?: string[]
  /** EGA gap sourceRefs / signals this mechanism addresses (lib/ega). */
  relevantEgaGapRefs?: string[]
  /** EGA obstacle types this mechanism is a response to. */
  relevantObstacleTypes?: EgaObstacleType[]
  /** EGA action types this mechanism typically implies. */
  applicableActionTypes?: EgaActionType[]
  /** Build Path™ ids most appropriate for building this mechanism's asset (lib/build-strategy). */
  suggestedBuildPaths?: BuildPathId[]

  /* ---- Operating & founder implications ---- */
  /** How this mechanism changes the founder's role. */
  founderRoleImplication?: string
  /** An Operating Rule™ this mechanism implies. */
  operatingRuleImplication?: string
  /** Rough time horizon to realize the outcome. */
  timeHorizon?: "immediate" | "30-days" | "90-days" | "6-months" | "12-months-plus"

  /* ---- AI / technology layer (extends the leverage vocabulary) ---- */
  /** How the underlying work should be handled — eliminated → kept-human. */
  workInterventionTypes?: WorkInterventionType[]
  /** Where human judgment is required even after intervention. */
  humanJudgmentRequirements?: string[]

  /* ---- Human Sustainability™ + HROI™ (connection points only) ---- */
  humanSustainability?: MechanismHumanSustainability
  hroi?: MechanismHroiMeasures

  /* ---- Provenance (required) ---- */
  provenance: MechanismProvenance

  status: MechanismStatus
}

/**
 * Maps the richer WorkInterventionType back to the canonical Executive
 * Decision Engine™ LeverageClassId so downstream leverage logic needs no new
 * enum. Interventions with no exact leverage class (simplified, standardized,
 * augmented-with-ai, ai-agent-assisted) resolve to their nearest canonical
 * class; documented here so the mapping is explicit, not implicit.
 */
export function leverageClassEquivalent(intervention: WorkInterventionType): LeverageClassId {
  switch (intervention) {
    case "eliminated":
      return "eliminate"
    case "kept-human":
      return "keep"
    case "delegated":
      return "delegate"
    case "automated":
    case "ai-agent-assisted":
      return "automate"
    case "augmented-with-ai":
      return "delegate" // AI assists a human owner — nearest canonical class is delegate
    case "simplified":
    case "standardized":
      return "keep" // still founder/team-owned work, just made repeatable — not yet automated
    default: {
      const _exhaustive: never = intervention
      return _exhaustive
    }
  }
}

/**
 * Reconciles the mechanism `WorkInterventionType` vocabulary with the existing
 * CAIO `Lever` vocabulary (lib/founder-os/ai-transformation:
 * "Eliminate" | "Systemize" | "Automate" | "Augment" | "Delegate").
 *
 * This is a NARROW reconciliation for the validation pass only — it lets a
 * mechanism's interventions be expressed in the CAIO dashboard's terms without
 * refactoring the CAIO system or collapsing either enum. `kept-human` has no
 * CAIO lever (every CAIO lever is an active intervention) and returns null.
 * The two vocabularies are intentionally NOT merged yet; that is a later
 * decision informed by more than two examples.
 */
export function caioLeverEquivalent(intervention: WorkInterventionType): CaioLever | null {
  switch (intervention) {
    case "eliminated":
      return "Eliminate"
    case "simplified":
    case "standardized":
      return "Systemize"
    case "delegated":
      return "Delegate"
    case "automated":
    case "ai-agent-assisted":
      return "Automate"
    case "augmented-with-ai":
      return "Augment"
    case "kept-human":
      return null
    default: {
      const _exhaustive: never = intervention
      return _exhaustive
    }
  }
}
