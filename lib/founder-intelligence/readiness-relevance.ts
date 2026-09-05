/**
 * Readiness Relevance™ — contextual reasoning over Readiness Capabilities™ (Phase 4)
 * ---------------------------------------------------------------------------
 * Phase 3 (`lib/excellence-intelligence/readiness.ts`) answers ONE question:
 * "what should be installed now, or ahead of need?" using only Business
 * Stage™ + Founder Destination™ ambition signals. This module answers the
 * NEXT question the Founder Intelligence Engine™ actually needs: "of what
 * Excellence Intelligence™ says SHOULD exist, which is most relevant to THIS
 * founder, right now, and why?"
 *
 * Still explicitly NOT:
 *   - A scoring engine (no composite "readiness score" is produced).
 *   - AI (every rule below is a plain, readable conditional).
 *   - Founder GPS™ (this produces relevance/prioritization metadata for a
 *     brief; it does not decide the founder's Next Best Move™ — that stays
 *     Founder GPS™'s job, and nothing here is invoked by it).
 *
 * Every signal used is data the architecture already declares elsewhere:
 *   - Business Stage™ + Founder Destination™          (Phase 3, unchanged)
 *   - Business Context Profile™ biggestChallenges/biggestOpportunities
 *   - Entrepreneur Success Assessment™ pillar scores   (evidence corroboration
 *     and, via the Human Sustainability™ pillar, business-capacity awareness)
 *
 * All inputs are OPTIONAL. With none supplied, this degrades gracefully to
 * Phase 3's stage/destination-only behavior — same candidate pool, just every
 * capability labeled "relevant" or "emerging" instead of "priority".
 *
 * Deliberately excluded: the Work-Life Balance Audit™. It belongs to the
 * separate Work-Life Balance Operating System™, not the Business Builder™ —
 * `capacityConstrained` below reads only the ESA's Human Sustainability™
 * pillar, a business-diagnostic signal, never the WLB Audit's own score.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { FounderDestinationProfile, FounderResponsibilityOption } from "@/lib/founder-destination/types"
import type { ChallengeOption, OpportunityOption } from "@/lib/business-context/types"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import type { BusinessModelProfile } from "@/lib/business-model-classification/types"
import {
  READINESS_CAPABILITIES,
  type ReadinessCapability,
  type ReadinessDomainId,
} from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import {
  deriveRequiredCapabilities,
  hasBusinessAmbitionSignal,
  hasFutureWorkplaceSignal,
} from "@/lib/excellence-intelligence/readiness"

/** Where a Readiness Capability™ stands for THIS founder, right now. */
export type ReadinessRelevanceStatus =
  | "priority" // corroborated by a real signal (ESA gap or a stated challenge/opportunity)
  | "relevant" // installed during the founder's current Business Stage™
  | "emerging" // surfaced early from a Founder Destination™ ambition signal
  | "already-installed" // ESA signal suggests this is likely already in place
  | "not-yet-relevant" // outside the current-stage + destination-signal pool
  | "future" // more than one Business Stage™ away — architecture hook for Founder GPS™

/** How strongly the relevance call is grounded in real evidence vs. inference. */
export type ReadinessConfidence = "high" | "medium" | "low"

/** Who is best positioned to close this capability's gap. */
export type SuggestedReadinessOwner = "founder" | "team-or-ai" | "unspecified"

/** The gap this capability describes, in the capability's own words — never invented copy. */
export interface ReadinessGap {
  /** The situation today (`capability.appliesWhen`). */
  current: string
  /** The capability that should exist (`capability.capability`). */
  required: string
  /** A short phrase naming the Founder Destination™ signal that surfaced this early, if any. */
  destination: string | null
}

/** One Readiness Capability™, reasoned about in this founder's actual context. */
export interface RelevantReadinessCapability {
  id: string
  title: string
  readinessDomain: ReadinessDomainId
  relevanceStatus: ReadinessRelevanceStatus
  confidence: ReadinessConfidence
  gap: ReadinessGap
  /** Executive Leadership Team™ id best positioned to own this — identifies, does not route. */
  owningExecutiveId: string | null
  suggestedOwner: SuggestedReadinessOwner
  /** True when the ESA's Human Sustainability™ pillar suggests caution before adding more (never the Work-Life Balance Audit™). */
  capacityConstrained: boolean
  /** A short, explainable "why this, why now" line — always derivable from the fields above. */
  whyNow: string
  /** Full registry reference, for callers that need more (e.g. `sequencing`, `businessConcepts`). */
  capability: ReadinessCapability

  /**
   * Phase 9E — Business Capability Registry™ selection reasoning. All three
   * optional; computed once inside `deriveReadinessRelevance()` as a second
   * pass over the same candidate pool, never altering `relevanceStatus`,
   * `confidence`, or sort order above.
   */
  /**
   * Whether every same-stage prerequisite in `capability.prerequisiteCapabilityIds`
   * already shows `"already-installed"` in this same pool. A prerequisite
   * from an earlier stage — not present in this stage's candidate pool at
   * all — is presumed already handled (the registry never surfaces
   * behind-schedule work), so it is not counted as unmet. Undefined when the
   * capability declares no prerequisites.
   */
  prerequisiteSatisfied?: boolean
  /** The same-stage prerequisites that are NOT yet `"already-installed"`. */
  unmetPrerequisites?: { id: string; title: string }[]
  /** The capabilities this one unlocks (`capability.enablesCapabilityIds`), title-resolved from the full registry. */
  unlocks?: { id: string; title: string }[]
  /**
   * How well this capability fits the founder's classified Business Model
   * Profile™. `"neutral"` whenever the capability applies to `"all"` business
   * models or no `businessModelProfile` signal was supplied — never invented
   * from a missing signal.
   */
  businessModelFit?: "strong-fit" | "neutral" | "possible-mismatch"
}

export interface FounderReadinessContextInput {
  businessStage: BusinessStage
  founderDestination?: FounderDestinationProfile | null
  businessContext?: {
    biggestChallenges?: ChallengeOption[]
    biggestOpportunities?: OpportunityOption[]
  } | null
  esaResults?: EsaResults | null
  /**
   * Business Model Profile™ (Phase 9B), already assembled by
   * `assembleHarmonySnapshot()` (Phase 9D). Optional — when absent,
   * `businessModelFit` below degrades to `"neutral"` for every capability,
   * same as before this field existed.
   */
  businessModelProfile?: BusinessModelProfile | null
  /**
   * Phase 10 — Build Record™ feedback loop. A capability id → its current
   * `BuildLifecycleStatus`, sourced from `getActiveBuildStatusByCapabilityId()`
   * (`lib/build-record/build-record-store.ts`). Optional and untyped here
   * (a plain string) to avoid a dependency from Founder Intelligence™ onto
   * Build Record™'s types — only string equality against the small set of
   * non-terminal/installed status values is ever performed. Absent/empty
   * map ⇒ byte-identical behavior to today (backward compatible).
   */
  capabilityBuildStatusById?: Record<string, string> | null
}

/**
 * Phase 10 — statuses that mean "this capability's build is already spoken
 * for" and should force `relevanceStatus = "already-installed"` (reusing the
 * existing value, never a new one) so Founder GPS™ never repeats it. Mirrors
 * `ACTIVE_BUILD_STATUSES` + `"installed"` from `lib/build-record/types.ts`,
 * duplicated as plain strings here rather than imported, to keep this module
 * independent of Build Record™'s types (see `capabilityBuildStatusById` doc).
 */
const BUILD_STATUSES_MEANING_ALREADY_SPOKEN_FOR = new Set<string>([
  "path-selected",
  "accepted",
  "in-progress",
  "briefed",
  "awaiting-external",
  "blocked",
  "paused",
  "review",
  "revision-requested",
  "ready-to-install",
  "installing",
  "measuring",
  "installed",
])

/* ===========================================================================
 * Explainable crosswalks
 * ---------------------------------------------------------------------------
 * Every one of these is a plain, documented lookup table — not inference,
 * not AI. They exist because `ReadinessCapability` and `BusinessContextProfile`
 * / `FounderDestinationProfile` were built in different phases with different
 * id vocabularies; these tables are the explicit bridge between them.
 * ======================================================================== */

/** Challenge/opportunity options → the Business Concepts™ ids they overlap with. */
const CHALLENGE_TO_CONCEPTS: Partial<Record<ChallengeOption, string[]>> = {
  "cash-flow": ["cash-flow", "burn-rate"],
  "lead-generation": ["customer-lifetime-value"],
  operations: ["sop", "operating-rule"],
  team: ["delegation", "human-zone-of-genius"],
  time: ["capacity-planning", "human-zone-of-genius"],
  pricing: ["margin", "gross-profit"],
  marketing: ["customer-lifetime-value"],
  "tech-systems": ["sop"],
  capital: ["cash-flow", "burn-rate"],
}

const OPPORTUNITY_TO_CONCEPTS: Partial<Record<OpportunityOption, string[]>> = {
  "finding-ideal-customer": ["customer-lifetime-value"],
  "creating-offer": ["margin", "gross-profit"],
  "increasing-sales": ["customer-lifetime-value"],
  marketing: ["customer-lifetime-value"],
  pricing: ["margin", "gross-profit"],
  "recurring-revenue": ["cash-flow"],
  hiring: ["sop", "delegation"],
  delegation: ["delegation", "human-zone-of-genius"],
  "ai-implementation": ["human-zone-of-genius"],
  "systems-sops": ["sop", "operating-rule"],
  leadership: ["delegation", "human-zone-of-genius"],
  "raising-capital": ["cash-flow"],
  scaling: ["capacity-planning"],
  "work-life-harmony": ["capacity-planning", "human-zone-of-genius"],
  "time-freedom": ["capacity-planning", "human-zone-of-genius"],
}

/**
 * Executive id → Entrepreneur Success Assessment™ pillar id, used only to
 * read an existing pillar score as a corroborating (or "already installed")
 * signal for a capability owned by that executive. A deterministic PROXY —
 * not a real "installed" tracker, since none exists yet in the codebase.
 */
const EXECUTIVE_TO_PILLAR: Record<string, string> = {
  strategy: "strategic-foundation",
  sales: "revenue-engine",
  finance: "financial-intelligence",
  operations: "operations-systems",
  "people-culture": "people-leadership",
  innovation: "growth-innovation",
  "client-success": "client-excellence",
  growth: "growth-innovation",
}

/** Executive id → the Founder Destination™ responsibility phrase it corresponds to. */
const EXECUTIVE_TO_RESPONSIBILITY: Partial<Record<string, FounderResponsibilityOption>> = {
  strategy: "Vision & Strategy",
  sales: "Sales & Growth",
  finance: "Financial Oversight",
  operations: "Day-to-Day Operations",
  "people-culture": "Team Leadership",
  innovation: "Product / Offer Direction",
  "client-success": "Key Relationships",
  growth: "Sales & Growth",
}

const PILLAR_GAP_THRESHOLD = 50
const PILLAR_INSTALLED_THRESHOLD = 75
const CAPACITY_CONSTRAINED_THRESHOLD = 50

function conceptOverlap(
  capability: ReadinessCapability,
  businessContext: FounderReadinessContextInput["businessContext"],
): boolean {
  if (!businessContext) return false
  const concepts = new Set(capability.businessConcepts)

  for (const challenge of businessContext.biggestChallenges ?? []) {
    for (const conceptId of CHALLENGE_TO_CONCEPTS[challenge] ?? []) {
      if (concepts.has(conceptId)) return true
    }
  }
  for (const opportunity of businessContext.biggestOpportunities ?? []) {
    for (const conceptId of OPPORTUNITY_TO_CONCEPTS[opportunity] ?? []) {
      if (concepts.has(conceptId)) return true
    }
  }
  return false
}

/** Reads the ESA pillar score aligned to this capability's owning executive, if any. */
function pillarScoreFor(capability: ReadinessCapability, esaResults: EsaResults | null | undefined): number | null {
  const executiveId = capability.relatedExecutives[0]
  if (!executiveId) return null
  const pillarId = EXECUTIVE_TO_PILLAR[executiveId]
  if (!pillarId) return null
  const pillar = esaResults?.pillarScores.find((p) => p.pillarId === pillarId)
  return pillar ? pillar.percentage : null
}

function suggestedOwnerFor(
  capability: ReadinessCapability,
  founderDestination: FounderDestinationProfile | null | undefined,
): SuggestedReadinessOwner {
  const executiveId = capability.relatedExecutives[0]
  const responsibility = executiveId ? EXECUTIVE_TO_RESPONSIBILITY[executiveId] : undefined
  if (!responsibility || !founderDestination) return "unspecified"
  if (founderDestination.notResponsibleFor?.includes(responsibility)) return "team-or-ai"
  if (founderDestination.remainResponsibleFor?.includes(responsibility)) return "founder"
  return "unspecified"
}

function destinationPhraseFor(isCurrentStage: boolean, ambitious: boolean, futureWorkplaceMinded: boolean): string | null {
  if (isCurrentStage) return null
  if (futureWorkplaceMinded) return "You've indicated intent about the future workplace you want to build."
  if (ambitious) return "You've indicated ambition beyond your current Business Stage™."
  return null
}

/**
 * Phase 9E — a plain, explainable lookup: does this capability's declared
 * `businessModels` list include the founder's classified `primaryArchetype`?
 * Both sides share the same `BusinessModelId` vocabulary
 * (`business-model-classification/types.ts`'s `primaryArchetype` is typed
 * directly as `BusinessModelId | "unknown"`) — no crosswalk needed.
 */
function businessModelFitFor(
  capability: ReadinessCapability,
  businessModelProfile: BusinessModelProfile | null | undefined,
): "strong-fit" | "neutral" | "possible-mismatch" {
  if (capability.businessModels === "all") return "neutral"
  if (!businessModelProfile || businessModelProfile.primaryArchetype === "unknown") return "neutral"
  return capability.businessModels.includes(businessModelProfile.primaryArchetype) ? "strong-fit" : "possible-mismatch"
}

function whyNowFor(status: ReadinessRelevanceStatus, capability: ReadinessCapability): string {
  switch (status) {
    case "priority":
      return capability.decisionRule
    case "already-installed":
      return "Signals suggest this may already be in place — revisit if that changes."
    case "emerging":
      return "Surfacing early, ahead of need, based on where you've said this is headed."
    case "relevant":
    default:
      return capability.appliesWhen
  }
}

/**
 * deriveReadinessRelevance — the core function this module exposes.
 *
 * Pure: (Business Stage™, Founder Destination™, Business Context Profile™,
 * Entrepreneur Success Assessment™) → RelevantReadinessCapability[].
 * Deterministic and side-effect-free. Deliberately does NOT take the
 * Work-Life Balance Audit™ — see the module doc comment above.
 *
 * The candidate pool is unchanged from Phase 3 (`deriveRequiredCapabilities`)
 * — this function only REASONS about that pool; it never removes from or
 * duplicates its filtering logic.
 */
export function deriveReadinessRelevance(input: FounderReadinessContextInput): RelevantReadinessCapability[] {
  const {
    businessStage,
    founderDestination,
    businessContext,
    esaResults,
    businessModelProfile,
    capabilityBuildStatusById,
  } = input

  const candidates = deriveRequiredCapabilities({ businessStage, founderDestination })
  const ambitious = founderDestination ? hasBusinessAmbitionSignal(founderDestination) : false
  const futureWorkplaceMinded = founderDestination ? hasFutureWorkplaceSignal(founderDestination) : false

  // Capacity awareness comes exclusively from the ESA's Human Sustainability™
  // pillar — a business-diagnostic signal — never from the Work-Life Balance
  // Audit™, which belongs to the separate Work-Life Balance Operating System™.
  const humanSustainabilityScore =
    esaResults?.pillarScores.find((p) => p.pillarId === "human-sustainability")?.percentage ?? null
  const capacityConstrained = humanSustainabilityScore != null && humanSustainabilityScore < CAPACITY_CONSTRAINED_THRESHOLD

  const results: RelevantReadinessCapability[] = candidates.map((capability) => {
    const isCurrentStage = capability.businessStages.includes(businessStage)
    const overlap = conceptOverlap(capability, businessContext)
    const pillarScore = pillarScoreFor(capability, esaResults)
    const corroboratedGap = pillarScore != null && pillarScore < PILLAR_GAP_THRESHOLD
    const likelyInstalled = pillarScore != null && pillarScore >= PILLAR_INSTALLED_THRESHOLD

    let status: ReadinessRelevanceStatus = isCurrentStage ? "relevant" : "emerging"
    if (likelyInstalled && isCurrentStage) {
      status = "already-installed"
    } else if (overlap || corroboratedGap) {
      status = "priority"
    }

    // Phase 10 — Build Record™ feedback loop. A real build status (in
    // progress, awaiting external, or installed) always wins over the ESA
    // proxy above: it is ground truth, the proxy is a guess. Absent/empty
    // map ⇒ this block never runs, so behavior is byte-identical to before
    // this field existed.
    const buildStatus = capabilityBuildStatusById?.[capability.id]
    if (buildStatus && BUILD_STATUSES_MEANING_ALREADY_SPOKEN_FOR.has(buildStatus)) {
      status = "already-installed"
    }

    const confidence: ReadinessConfidence = overlap || corroboratedGap ? "high" : isCurrentStage ? "medium" : "low"

    return {
      id: capability.id,
      title: capability.title,
      readinessDomain: capability.readinessDomain,
      relevanceStatus: status,
      confidence,
      gap: {
        current: capability.appliesWhen,
        required: capability.capability,
        destination: destinationPhraseFor(isCurrentStage, ambitious, futureWorkplaceMinded),
      },
      owningExecutiveId: capability.relatedExecutives[0] ?? null,
      suggestedOwner: suggestedOwnerFor(capability, founderDestination),
      capacityConstrained,
      whyNow: whyNowFor(status, capability),
      capability,
    }
  })

  // Phase 9E — second pass over the same pool, appending prerequisite,
  // unlock, and Business Model Profile™ fit reasoning. Never alters
  // `relevanceStatus`, `confidence`, or any field computed above.
  const statusById = new Map(results.map((r) => [r.id, r]))
  for (const r of results) {
    const prereqIds = r.capability.prerequisiteCapabilityIds
    if (prereqIds?.length) {
      const unmet: { id: string; title: string }[] = []
      for (const prereqId of prereqIds) {
        const inPool = statusById.get(prereqId)
        // Not present in this stage's candidate pool at all → an earlier-stage
        // prerequisite, presumed already handled (never surfaced as unmet).
        if (inPool && inPool.relevanceStatus !== "already-installed") {
          unmet.push({ id: inPool.id, title: inPool.title })
        }
      }
      r.prerequisiteSatisfied = unmet.length === 0
      r.unmetPrerequisites = unmet
    }

    const enablesIds = r.capability.enablesCapabilityIds
    if (enablesIds?.length) {
      r.unlocks = enablesIds.map((id) => {
        const registryMatch = READINESS_CAPABILITIES.find((c) => c.id === id)
        return { id, title: registryMatch?.title ?? id }
      })
    }

    r.businessModelFit = businessModelFitFor(r.capability, businessModelProfile)
  }

  const statusOrder: Record<ReadinessRelevanceStatus, number> = {
    priority: 0,
    relevant: 1,
    emerging: 2,
    "already-installed": 3,
    "not-yet-relevant": 4,
    future: 5,
  }
  return results.sort((a, b) => statusOrder[a.relevanceStatus] - statusOrder[b.relevanceStatus])
}

/**
 * Caps a reasoned list to the top N — a thin, reusable helper so callers
 * (today's `founder-intelligence.ts`, tomorrow's Founder GPS™) can each
 * decide how many to surface without re-implementing the ordering rule.
 */
export function pickTopReadinessCapabilities(
  list: RelevantReadinessCapability[],
  count: number,
): RelevantReadinessCapability[] {
  return list.slice(0, count)
}

const STAGE_ORDER: BusinessStage[] = ["launch", "growth", "scale", "legacy"]

/**
 * The full-registry counterpart to `deriveReadinessRelevance` — includes
 * every Readiness Capability™ in the registry, labeling anything outside the
 * Phase 3 candidate pool as `"not-yet-relevant"` (same stage distance) or
 * `"future"` (more than one Business Stage™ away). Architecture hook for
 * Founder GPS™; not read by anything in this phase's `founder-intelligence.ts`
 * wiring, which uses `deriveReadinessRelevance` (the surfaced-only list) above.
 */
export function deriveAllReadinessRelevance(input: FounderReadinessContextInput): RelevantReadinessCapability[] {
  const surfaced = deriveReadinessRelevance(input)
  const surfacedIds = new Set(surfaced.map((r) => r.id))
  const stageIndex = STAGE_ORDER.indexOf(input.businessStage)

  const remainder: RelevantReadinessCapability[] = READINESS_CAPABILITIES.filter((c) => !surfacedIds.has(c.id)).map(
    (capability) => {
      const nearestStageIndex = Math.min(...capability.businessStages.map((s) => STAGE_ORDER.indexOf(s)))
      const distance = stageIndex >= 0 && nearestStageIndex >= 0 ? Math.abs(nearestStageIndex - stageIndex) : 99
      const status: ReadinessRelevanceStatus = distance <= 1 ? "not-yet-relevant" : "future"
      return {
        id: capability.id,
        title: capability.title,
        readinessDomain: capability.readinessDomain,
        relevanceStatus: status,
        confidence: "low",
        gap: { current: capability.appliesWhen, required: capability.capability, destination: null },
        owningExecutiveId: capability.relatedExecutives[0] ?? null,
        suggestedOwner: "unspecified",
        capacityConstrained: false,
        whyNow: whyNowFor(status, capability),
        capability,
      }
    },
  )

  return [...surfaced, ...remainder]
}
