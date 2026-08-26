/**
 * Harmony Context Aggregator™ — Phase 10.2
 * ---------------------------------------------------------------------------
 * Assembles a clean, flat, serializable reasoning object from every available
 * signal source before the GPS engine fires.
 *
 * Why a separate aggregator?
 * HarmonyContextValue is the React context — it contains setters, references,
 * and non-serializable fields. This aggregator produces a pure data object that
 * every engine function can safely pattern-match over without React coupling.
 *
 * PURE MODULE — reads from storage once, produces a flat snapshot.
 * No React. No I/O beyond localStorage reads.
 */

import type { HarmonyContextValue } from "@/lib/harmony-context/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type {
  BusinessModelOption,
  TeamSizeOption,
  RevenueStagOption,
  FounderRoleOption,
  GoalOption,
  ChallengeOption,
  CapitalStrategyOption,
  GrowthVisionOption,
  OperatingEnvironmentOption,
  SupportNetworkOption,
  OpportunityOption,
  BusinessCreditOption,
  WealthBuildingOption,
  LongTermVision,
} from "@/lib/business-context/types"
import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { ProgressSummary } from "@/lib/founder-gps/progress-intelligence"
import type { LifeEvent } from "@/lib/whole-life-context"
import {
  deriveProgressSummary,
} from "@/lib/founder-gps/progress-intelligence"
import {
  getUpcomingLifeEvents,
  getActivePersonalGoals,
  getNonNegotiableCommitments,
  getRelationships,
} from "@/lib/whole-life-context"
import {
  deriveExecutiveMemoryContext,
} from "@/lib/founder-gps/history/executive-decision-memory"
import {
  getLastSkipReason,
  getRecommendationHistory,
} from "@/lib/founder-gps/history/recommendation-history-store"
import type { RecommendationOutcome } from "@/lib/founder-gps/history/recommendation-history-store"

/* ===========================================================================
 * HarmonyContextAggregate — the unified reasoning object
 * ======================================================================== */

export interface HarmonyContextAggregate {
  // ── Identity ──────────────────────────────────────────────────────────────
  firstName: string | null
  businessStage: BusinessStage | null
  businessModel: BusinessModelOption[] | null
  teamSize: TeamSizeOption | null
  revenueStage: RevenueStagOption | null
  founderRole: FounderRoleOption | null

  // ── Business Context ──────────────────────────────────────────────────────
  biggestGoals: GoalOption[]
  biggestChallenges: ChallengeOption[]
  biggestOpportunities: OpportunityOption[]
  capitalStrategy: CapitalStrategyOption[]
  growthVision: GrowthVisionOption | null
  operatingEnvironment: OperatingEnvironmentOption | null
  supportNetwork: SupportNetworkOption[]
  businessCredit: BusinessCreditOption | null
  wealthBuildingInterests: WealthBuildingOption[]
  longTermVision: LongTermVision | null
  exitVision: string | null

  // ── Founder Operating (assessment signals) ────────────────────────────────
  // Deliberately excludes the Work-Life Balance Audit™ — it belongs to the
  // separate Work-Life Balance Operating System™ and must never feed
  // Founder GPS™ / Business Builder™ reasoning.
  entrepreneurSuccessScore: number | null
  weakestEsaPillar: OperatingPillarId | null
  strongestEsaPillar: OperatingPillarId | null

  // ── CEO Workday ───────────────────────────────────────────────────────────
  weekDesigned: boolean
  weeklyIntention: string | null
  ceoWorkdayPriorities: string | null
  humanZoneOfGenius: string | null
  executionFriction: string | null
  businessOperatingRule: string | null

  // ── Progress Intelligence ─────────────────────────────────────────────────
  progress: ProgressSummary | null
  consecutiveCompletions: number

  // ── Whole-Life Context ────────────────────────────────────────────────────
  upcomingLifeEvents: LifeEvent[]
  activePersonalGoalsCount: number
  hasRelationships: boolean
  nonNegotiableCommitmentsCount: number
  hasEventRequiringPreparation: boolean
  inLifeProtectionMode: boolean
  daysUntilNextSignificantEvent: number | null

  // ── Learning ──────────────────────────────────────────────────────────────
  learningInterests: string[]
  communicationLevel: string | null

  // ── Recommendation History ────────────────────────────────────────────────
  recentRecommendationIds: string[]
  lastCompletedRecommendationId: string | null
  lastCompletedRecommendationTitle: string | null
  hasMomentum: boolean
  recentWin: string | null
  pendingSkipReason: ReturnType<typeof getLastSkipReason>
  lastRecommendationOutcome: RecommendationOutcome | null

  // ── Behavior ──────────────────────────────────────────────────────────────
  /** Days since first recommendation recorded — proxy for platform tenure. */
  platformEngagementDays: number

  // ── Phase 10.5 — Harmony Memory™ ─────────────────────────────────────────
  /**
   * Top 3 PatternSignals derived from GPS history. Optional — undefined in
   * environments where the pattern engine hasn't been loaded yet.
   */
  patternSignals?: import("@/lib/harmony-memory/types").PatternSignal[]

  // ── Phase 10.6 — Adaptive Workspace™ ─────────────────────────────────────
  /**
   * The current recommended OperatingMode. Optional — populated best-effort
   * via require() IIFE in assembleHarmonyContext().
   */
  operatingMode?: import("@/lib/adaptive-workspace/types").OperatingMode
  /**
   * The recommended WorkspaceProfileId for this founder's current state.
   * Optional — same best-effort derivation as operatingMode.
   */
  workspaceProfile?: import("@/lib/adaptive-workspace/types").WorkspaceProfileId

  // ── Phase 11.0 — Founder Digital Twin™ ───────────────────────────────────
  /**
   * The founder's Digital Twin profile built from all stores.
   * Optional — populated best-effort via require() IIFE.
   */
  twinProfile?: import("@/lib/digital-twin/types").FounderTwinProfile
}

/* ===========================================================================
 * Assembly function
 * ======================================================================== */

/**
 * Assembles the HarmonyContextAggregate from all available signal sources.
 * Safe to call from any non-React context (server actions, pure TS modules).
 * Returns a fully-populated aggregate with safe defaults for missing data.
 */
export function assembleHarmonyContext(
  ctx: HarmonyContextValue,
): HarmonyContextAggregate {
  const bc = ctx.businessContext
  const fl = ctx.founderLearning
  const ceo = ctx.ceo

  // ── Progress Intelligence ──────────────────────────────────────────────
  let progress: ProgressSummary | null = null
  try {
    progress = deriveProgressSummary()
  } catch {
    progress = null
  }

  // ── Whole-Life Context ─────────────────────────────────────────────────
  let upcomingLifeEvents: LifeEvent[] = []
  let activePersonalGoalsCount = 0
  let nonNegotiableCommitmentsCount = 0
  let hasRelationships = false
  let hasEventRequiringPreparation = false
  let inLifeProtectionMode = false
  let daysUntilNextSignificantEvent: number | null = null

  try {
    // getUpcomingLifeEvents returns LifeEvent[] filtered to the next N days
    const rawEvents = getUpcomingLifeEvents(30)
    upcomingLifeEvents = rawEvents

    hasEventRequiringPreparation = rawEvents.some(
      (e) => (e as { requiresPreparation?: boolean }).requiresPreparation === true,
    )

    const now = new Date()
    const significantEvents = rawEvents
      .filter((e) => e.significance === "life-defining" || e.significance === "high")
      .map((e) => {
        const eventDate = new Date(e.date)
        const diff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { ...e, daysUntil: diff }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)

    if (significantEvents.length > 0) {
      daysUntilNextSignificantEvent = significantEvents[0].daysUntil
      inLifeProtectionMode = daysUntilNextSignificantEvent <= 3
    }

    const activeGoals = getActivePersonalGoals()
    activePersonalGoalsCount = activeGoals.length

    const nonNeg = getNonNegotiableCommitments()
    nonNegotiableCommitmentsCount = nonNeg.length

    const relationships = getRelationships()
    hasRelationships = relationships.length > 0
  } catch {
    // Whole-life data may be unavailable — degrade gracefully
  }

  // ── Recommendation History ─────────────────────────────────────────────
  const memory = deriveExecutiveMemoryContext()
  let lastRecommendationOutcome: RecommendationOutcome | null = null
  let platformEngagementDays = 0

  try {
    const history = getRecommendationHistory()
    if (history.length > 0) {
      const sorted = [...history].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      lastRecommendationOutcome = sorted[0].outcome
      // Earliest recorded entry date = proxy for platform tenure
      const earliest = history.sort((a, b) => a.date.localeCompare(b.date))[0]
      const diffMs = Date.now() - new Date(earliest.date).getTime()
      platformEngagementDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    }
  } catch {
    // History unavailable — degrade gracefully
  }

  // ── ESA ──────────────────────────────────────────────────────────────────
  // Stored in a separate ESA audit — the actual storage is in
  // entrepreneur-success stores; we read what's available from ctx.
  // Deliberately does NOT read Work-Life Balance Audit™ data — that belongs
  // to the separate Work-Life Balance Operating System™.
  const entrepreneurSuccessScore: number | null = null // populated by callers with ESA data
  const weakestEsaPillar: OperatingPillarId | null = null
  const strongestEsaPillar: OperatingPillarId | null = null

  return {
    // Identity
    firstName: ctx.firstName,
    businessStage: ctx.businessStage ?? null,
    businessModel: bc?.businessModel ?? null,
    teamSize: bc?.teamSize ?? null,
    revenueStage: bc?.revenueStage ?? null,
    founderRole: bc?.founderRole ?? null,

    // Business Context
    biggestGoals: bc?.biggestGoals ?? [],
    biggestChallenges: bc?.biggestChallenges ?? [],
    biggestOpportunities: bc?.biggestOpportunities ?? [],
    capitalStrategy: bc?.capitalStrategy ?? [],
    growthVision: bc?.growthVision ?? null,
    operatingEnvironment: bc?.operatingEnvironment ?? null,
    supportNetwork: bc?.supportNetwork ?? [],
    businessCredit: bc?.businessCredit ?? null,
    wealthBuildingInterests: bc?.wealthBuildingInterests ?? [],
    longTermVision: bc?.longTermVision ?? null,
    exitVision: bc?.exitVision ?? null,

    // Assessments
    entrepreneurSuccessScore,
    weakestEsaPillar,
    strongestEsaPillar,

    // CEO Workday
    weekDesigned: ctx.hasDesignedWeek,
    weeklyIntention: ctx.weeklyIntention || null,
    ceoWorkdayPriorities: ceo?.priorities || null,
    humanZoneOfGenius: ceo?.humanZoneOfGenius || null,
    executionFriction: ceo?.executionFriction || null,
    businessOperatingRule: ceo?.businessOperatingRule || null,

    // Progress
    progress,
    consecutiveCompletions: memory.consecutiveCompletions,

    // Whole-Life
    upcomingLifeEvents,
    activePersonalGoalsCount,
    hasRelationships,
    nonNegotiableCommitmentsCount,
    hasEventRequiringPreparation,
    inLifeProtectionMode,
    daysUntilNextSignificantEvent,

    // Learning
    learningInterests: fl?.learningInterests ?? [],
    communicationLevel: fl?.communicationLevel ?? ctx.communicationStyle ?? null,

    // History / Memory
    recentRecommendationIds: memory.recentRecommendationIds,
    lastCompletedRecommendationId: null,
    lastCompletedRecommendationTitle: memory.lastCompletedSummary,
    hasMomentum: memory.hasMomentum,
    recentWin: memory.recentWin,
    pendingSkipReason: memory.pendingSkipReason,
    lastRecommendationOutcome,

    // Behavior
    platformEngagementDays,

    // Phase 10.6 — Adaptive Workspace™ (best-effort, graceful require())
    operatingMode: (() => {
      try {
        const { deriveOperatingMode } = require("@/lib/adaptive-workspace/operating-mode-engine")
        // Recursive call safe because operatingMode is not used inside deriveOperatingMode
        const result = deriveOperatingMode({
          businessStage: ctx.businessStage,
          teamSize: ctx.businessContext?.teamSize ?? null,
          revenueStage: ctx.businessContext?.revenueStage ?? null,
          inLifeProtectionMode: false,
          consecutiveCompletions: 0,
          hasMomentum: false,
          upcomingLifeEvents: [],
          daysUntilNextSignificantEvent: null,
          biggestOpportunities: ctx.businessContext?.biggestOpportunities ?? [],
          biggestGoals: ctx.businessContext?.biggestGoals ?? [],
        } as Parameters<typeof deriveOperatingMode>[0])
        return result.mode
      } catch {
        return undefined
      }
    })() as import("@/lib/adaptive-workspace/types").OperatingMode | undefined,

    workspaceProfile: (() => {
      try {
        const { deriveWorkspaceConfig } = require("@/lib/adaptive-workspace/workspace-intelligence-engine")
        // Build a minimal aggregate for profile derivation (no recursion risk)
        const miniAgg = {
          businessStage: ctx.businessStage,
          teamSize: ctx.businessContext?.teamSize ?? null,
          revenueStage: ctx.businessContext?.revenueStage ?? null,
          inLifeProtectionMode: false,
          consecutiveCompletions: 0,
          hasMomentum: false,
          upcomingLifeEvents: [],
          daysUntilNextSignificantEvent: null,
          biggestOpportunities: ctx.businessContext?.biggestOpportunities ?? [],
          biggestGoals: ctx.businessContext?.biggestGoals ?? [],
        }
        const config = deriveWorkspaceConfig(miniAgg as Parameters<typeof deriveWorkspaceConfig>[0])
        return config.recommendedProfile
      } catch {
        return undefined
      }
    })() as import("@/lib/adaptive-workspace/types").WorkspaceProfileId | undefined,

    // Phase 10.5 — Harmony Memory™ pattern signals (best-effort, no required stores)
    patternSignals: (() => {
      try {
        const { analyzePatterns } = require("@/lib/harmony-memory/pattern-recognition-engine")
        const { getRecommendationHistory } = require(
          "@/lib/founder-gps/history/recommendation-history-store",
        )
        const { getExecutiveMemory } = require("@/lib/executive-office/executive-memory-store")
        const { getCapabilityMemory } = require(
          "@/lib/executive-capability/capability-memory-store",
        )
        const patterns = analyzePatterns({
          gpsHistory: getRecommendationHistory(),
          execMemory: getExecutiveMemory().entries,
          capability: getCapabilityMemory(),
        })
        return patterns.slice(0, 3)
      } catch {
        return undefined
      }
    })(),

    // Phase 11.0 — Founder Digital Twin™ (best-effort, graceful require())
    twinProfile: (() => {
      try {
        const { buildFounderTwin } = require("@/lib/digital-twin/twin-builder")
        return buildFounderTwin()
      } catch {
        return undefined
      }
    })() as import("@/lib/digital-twin/types").FounderTwinProfile | undefined,
  }
}
