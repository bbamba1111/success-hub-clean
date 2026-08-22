/**
 * Build Strategy™ + Build Blueprint™ — types (Phase 9F)
 * ---------------------------------------------------------------------------
 * Once Founder GPS™ (`lib/founder-gps/next-best-move-engine.ts`) names the
 * ONE highest-leverage next move (`GpsRecommendation`), Build Strategy™
 * answers the founder's very next question: "Okay — HOW do I actually build
 * this?" The founder picks a Build Path™, and Build Blueprint™ turns the
 * recommendation into a concrete, adapted plan for that path.
 *
 * This is a plan, not an execution engine. Nothing here sources vendors,
 * hires people, or autonomously executes AI work — nothing that can't be
 * honestly derived from the founder's own Founder GPS™, Business Model
 * Profile™, and Founder Destination™ signals is invented. Anything not yet
 * knowable is explicitly `"not yet determined"`.
 */

import type { BusinessModelId } from "@/lib/entrepreneur-success/types"

/**
 * The 8 ways a founder can choose to build any given Next Best Move™.
 * Not a ranking — the founder's own choice of who/what does the work.
 */
export type BuildPathId =
  | "founder-build" // The founder builds it themselves, step by step.
  | "co-build" // The founder builds it together with AI, as a guided dialogue.
  | "ai-build" // AI produces the output directly; founder reviews/finishes.
  | "delegate" // An existing team member takes ownership.
  | "hire" // A new hire is needed to own this.
  | "outsource" // A freelancer/contractor is engaged for this specific work.
  | "buy" // An existing tool/template/service is purchased instead of built.
  | "partner" // A strategic partner or agency takes this on.

export interface BuildPathDefinition {
  id: BuildPathId
  /** Short label shown on the picker card. */
  label: string
  /** One plain-language sentence describing what choosing this path means. */
  description: string
  /** Lucide icon name, matching the convention in `EXECUTION_PATHS`. */
  icon: string
  /** Whether Harmony Lane can produce real, ready-to-use output for this path today. */
  fulfillmentStatus: "available-now" | "plan-only"
}

/** One step in a founder-build or co-build plan. */
export interface BuildStep {
  stepNumber: number
  title: string
  /** What this step accomplishes and why it matters, in plain language. */
  objective: string
  /** Concrete, do-this-now instructions — never vague. */
  instructions: string
  /** Why this step matters for the founder's specific business model/destination. */
  why: string
  /** A worked example adapted to the founder's Business Model Profile™, when derivable. */
  example?: string
  /** What the output of this step looks like when it's right. */
  expectedOutput: string
  /** What "done" looks like for this step. */
  definitionOfDone: string
  /** Step numbers that must be complete before this one can start. */
  dependsOnSteps: number[]
}

export interface BuildStepsDetail {
  kind: "build-steps"
  /**
   * `false` for founder-build (solo instructions), `true` for co-build,
   * where the same steps are reframed as a collaborative AI dialogue
   * (question prompts) rather than solo instructions. One generator, one
   * framing flag — not two engines.
   */
  coBuildFraming: boolean
  steps: BuildStep[]
}

export interface AiBuildDetail {
  kind: "ai-build"
  /** The concrete outputs AI can actually produce for this move — honest, not aspirational. */
  aiProducibleOutputs: string[]
  /** What the founder still has to do by hand — AI cannot claim to execute these. */
  remainingHumanActions: string[]
  /** Whether Harmony Lane can generate these outputs directly in-app today. */
  executionAvailable: boolean
}

export interface DelegateDetail {
  kind: "delegate"
  /** The role/title best suited to own this, derived from `executiveDomain`/`owner`. */
  suggestedOwnerRole: string
  /** What "handed off successfully" looks like. */
  handoffDefinitionOfDone: string
  /** What context the founder needs to brief the team member with. */
  briefingPoints: string[]
}

export interface HireDetail {
  kind: "hire"
  /** The role this move suggests hiring for. */
  suggestedRole: string
  /** Core responsibilities this hire would own, derived from the move's scope. */
  coreResponsibilities: string[]
  /** Budget range for this hire — "not yet determined" unless a real signal exists. */
  budgetRange: string
  /** Timeline to fill this role — "not yet determined" unless a real signal exists. */
  timeline: string
}

export interface OutsourceDetail {
  kind: "outsource"
  /** The kind of specialist/contractor this scope calls for. */
  suggestedSpecialistType: string
  /** The scope of work a contractor would be briefed on. */
  scopeOfWork: string[]
  /** Budget range for this engagement — "not yet determined" unless a real signal exists. */
  budgetRange: string
}

export interface BuyDetail {
  kind: "buy"
  /** The category of tool/template/service that would replace building this from scratch. */
  suggestedCategory: string
  /** What to evaluate when choosing a purchase in this category. */
  evaluationCriteria: string[]
  /** Budget range for this purchase — "not yet determined" unless a real signal exists. */
  budgetRange: string
}

export interface PartnerDetail {
  kind: "partner"
  /** The type of strategic partner/agency this scope calls for. */
  suggestedPartnerType: string
  /** What the founder would hand to a partner vs. keep. */
  scopeHandedToPartner: string[]
  /** What the founder retains ownership/decision rights over. */
  founderRetains: string[]
}

export type BuildPathDetail =
  | BuildStepsDetail
  | AiBuildDetail
  | DelegateDetail
  | HireDetail
  | OutsourceDetail
  | BuyDetail
  | PartnerDetail

/**
 * The full Build Blueprint™ produced once a founder selects a Build Path™
 * for a given Founder GPS™ recommendation. Every field maps to a spec field;
 * anything not derivable from existing signals is `"not yet determined"` —
 * never fabricated.
 */
export interface BuildBlueprint {
  /** The `GpsRecommendation.id`/`readinessCapabilityId` this blueprint was built for. */
  recommendationId: string
  /** The Build Path™ the founder chose. */
  buildPath: BuildPathId
  generatedAt: string

  // 1–6: core framing, mapped directly from the GpsRecommendation.
  /** What this move is (`capabilityName` / `nextTurn`). */
  what: string
  /** Why this matters (`reason`). */
  why: string
  /** Why now (`whyNow`). */
  whyNow: string
  /** The desired outcome once complete (`definitionOfDone` / `expectedOutcome`). */
  desiredOutcome: string
  /** The founder's current state before this move (`currentState`). */
  currentState: string
  /** The target state once this move is complete (`targetState`). */
  targetState: string

  // 7–8: ownership.
  /** Plain-language summary of who does the work under this Build Path™. */
  ownerSummary: string
  /** The founder-GPS-assigned owner, carried through (`owner`/`leverageMode`). */
  owner: "founder" | "team-or-ai" | "unspecified"

  // 9–12: adaptation context, for transparency (not new computation).
  /** The Business Model archetype this blueprint was adapted for, if known. */
  businessModelArchetype: BusinessModelId | "unknown"
  /** Plain-language note on how the business model shaped this blueprint's language/examples. */
  businessModelAdaptationNote: string
  /** Plain-language note on how the founder's destination shaped scope/sequencing, if a destination signal existed. */
  destinationAdaptationNote?: string
  /** Whether this move was sequenced/deferred to respect current founder capacity. */
  capacityConsideration?: string

  // 13–14: dependencies, copied directly — no re-derivation.
  /** Same-stage prerequisites that must exist first (from `recommendation.prerequisites`). */
  prerequisites: { id: string; title: string }[]
  /** Capabilities this move unlocks once complete (from `recommendation.unlocksCapabilities`). */
  unlocksCapabilities: { id: string; title: string }[]

  // 15–18: planning/logistics — honest placeholders unless a real signal exists.
  budgetEstimate: string
  timelineEstimate: string
  targetCompletionDate: string
  /** Whether the resulting package (delegate/hire/outsource/buy/partner) is ready to hand off to someone else. */
  handoffReady: boolean

  // 19–22: traceability, carried through for the founder's confidence.
  confidence?: string
  evidence: string[]
  source?: string
  triggeredBy: string[]

  // 23–25: forward-looking framing.
  /** Whether this move is being built ahead of current-stage need. */
  stageFraming: "current-stage" | "build-ahead-of-need"
  /** Alignment with the founder's Future Workplace Destination™, when a signal exists. */
  futureWorkplaceAlignment?: string
  /** The path-specific detail structure (steps, or the relevant package fields). */
  detail: BuildPathDetail
}

/** Everything the blueprint engine needs beyond the recommendation itself. */
export interface BuildBlueprintContext {
  businessModelProfile?: import("@/lib/business-model-classification/types").BusinessModelProfile | null
  founderDestination?: import("@/lib/founder-destination/types").FounderDestinationProfile | null
}

/* ===========================================================================
 * PHASE 11 — Build Path Selection™ + Second Opinion™
 * ---------------------------------------------------------------------------
 * Neither of these is a new intelligence engine. Both are explanations of
 * signals the existing Founder GPS™/Executive Decision Engine™/Build
 * Blueprint™ already produced — no new scoring, no new inference.
 * ======================================================================== */

/** The output of `deriveRecommendedBuildPath()` — a Build Path™ suggestion the founder can accept, override, or ask about. */
export interface RecommendedBuildPath {
  /** `null` only when the underlying Leverage Class™ is "eliminate" — no Build Path applies to work that shouldn't be done. */
  buildPath: BuildPathId | null
  /** Plain-language reason, traceable to real GPS/EDE signals — never invented. */
  reason: string
}

/**
 * Second Opinion™ — answers the founder's 9 questions about a Build Path™
 * decision by EXPLAINING existing signals (Founder GPS™, Business Model
 * Profile™, Business Operating Fingerprint™, Founder Destination™,
 * Readiness Capability™, EDE reasoning, Build Strategy™, capacity
 * information). Not a second recommendation engine.
 */
export interface SecondOpinion {
  isRightThingToBuild: string
  isRightTime: string
  isRightBuildPath: string
  /** Other Build Path™ options the founder could reasonably choose instead. */
  alternatives: string[]
  tradeoffs: string[]
  whatWouldChangeThisRecommendation: string[]
  founderShouldRetain: string[]
  canBeHandedOff: string[]
  riskOfDoingNothing: string
}

/** What `deriveRecommendedBuildPath()`/`deriveSecondOpinion()` need beyond the recommendation itself — all optional, honestly degrading when absent. */
export interface BuildPathSelectionContext {
  /** Whether the founder already has an internal team member with real capacity — never assumed true by default. */
  hasInternalTeamCapacity?: boolean
  businessModelProfile?: import("@/lib/business-model-classification/types").BusinessModelProfile | null
  founderDestination?: import("@/lib/founder-destination/types").FounderDestinationProfile | null
}
