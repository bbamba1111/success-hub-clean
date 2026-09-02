/**
 * Harmony Context Engine™ — Aggregator (Phase 6.1)
 * ---------------------------------------------------------------------------
 * The single source of contextual truth for the Harmony Lane™ Operating System.
 *
 * The engine aggregates EXISTING registries without duplicating them:
 *   - HarmonyContextValue  (lib/harmony-context/types.ts)    → business/time/language signals
 *   - WholeLifeContext      (lib/whole-life-context/)         → life, relationships, events, goals
 *   - EsaResults            (lib/entrepreneur-success/)       → scored assessment data
 *   - GpsContext            (lib/founder-gps/types.ts)        → GPS signal surface
 *   - BusinessPerformance™  (lib/founder-gps/types.ts)        → performance snapshot
 *
 * Cherry Blossom™, Founder GPS™, Executive Leadership Team™, Professional
 * Advisors™, Academy™, Sunday Design Day™, and future AI reasoning all read
 * from HarmonyContextSnapshot — never from individual registries directly.
 *
 * ARCHITECTURE ONLY — no recommendation engine, no AI calls, no notifications.
 * The function `assembleHarmonySnapshot()` is pure: same inputs → same output.
 *
 * Design rule: every field has a meaningful null/empty default. The engine
 * NEVER throws. A founder with zero data still gets a valid, warm snapshot.
 */

import type { HarmonyContextValue } from "./types"
import type { WholeLifeContext } from "@/lib/whole-life-context/types"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import type { GpsContext, BusinessPerformanceSnapshot } from "@/lib/founder-gps/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import type { BusinessModelProfile } from "@/lib/business-model-classification/types"
import { classifyBusinessModel } from "@/lib/business-model-classification/classify"
import type { BusinessOperatingFingerprint } from "@/lib/business-operating-fingerprint/types"
import { deriveBusinessOperatingFingerprint } from "@/lib/business-operating-fingerprint/derive"
import type { BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"

/* ===========================================================================
 * Harmony Context Snapshot™
 * ---------------------------------------------------------------------------
 * The complete, unified context object. Every system on the platform reads
 * this. It is intentionally flat at the top level to keep consumer code clean,
 * while namespacing sub-objects by domain.
 * ======================================================================== */

/**
 * The complete Harmony Context Snapshot™ — the brain of Harmony Lane™.
 *
 * Fields are organized into five layers:
 *   1. Identity™            — who the founder is
 *   2. Business Context™    — what the business is and how it's performing
 *   3. Whole-Life Context™  — the life outside the business
 *   4. Operating Context™   — what was designed for this week
 *   5. Intelligence Hooks™  — pre-computed signals for Founder GPS™
 */
export interface HarmonyContextSnapshot {
  /**
   * True once the engine has assembled a complete snapshot.
   * False while loading or if no data has been set.
   */
  ready: boolean

  /* -------------------------------------------------------------------------
   * Layer 1 — Identity™
   * ---------------------------------------------------------------------- */
  identity: IdentityContext

  /* -------------------------------------------------------------------------
   * Layer 2 — Business Context™
   * ---------------------------------------------------------------------- */
  business: BusinessContext

  /* -------------------------------------------------------------------------
   * Layer 2.5 — Business Model Profile™ / Business Operating Fingerprint™
   * (Phase 9D)
   * Assembled once here from `classifyBusinessModel()` (Phase 9B) and
   * `deriveBusinessOperatingFingerprint()` (Phase 9A) — pure, additive
   * derivations over signals this engine already loads. Architecture hook:
   * no recommendation logic reads these yet.
   * ---------------------------------------------------------------------- */
  /** The founder's classified Business Model Profile™ — archetype + operating characteristics, all "unknown"-safe. */
  businessModelProfile: BusinessModelProfile
  /** The founder's assembled Business Operating Fingerprint™ — the cross-domain operating snapshot. */
  businessOperatingFingerprint: BusinessOperatingFingerprint

  /* -------------------------------------------------------------------------
   * Layer 3 — Whole-Life Context™
   * ---------------------------------------------------------------------- */
  life: WholeLifeContext

  /* -------------------------------------------------------------------------
   * Layer 3.5 — Founder Destination™ (Phase 6.2)
   * Where the founder wants things to end up — distinct from `business`
   * (current state). Null-safe: every field defaults to null/"undecided"
   * absent data, matching the engine's "never throws" contract.
   * ---------------------------------------------------------------------- */
  destination: DestinationContext

  /* -------------------------------------------------------------------------
   * Layer 4 — Operating Context™
   * ---------------------------------------------------------------------- */
  operating: OperatingContext

  /* -------------------------------------------------------------------------
   * Layer 5 — Intelligence Hooks™
   * Architecture only — no inference logic runs against these this phase.
   * ---------------------------------------------------------------------- */
  intelligence: IntelligenceHooks
}

/* ---------------------------------------------------------------------------
 * Layer 1 — Identity™
 * ------------------------------------------------------------------------- */
export interface IdentityContext {
  /** Supabase user id — the universal foreign key. */
  userId: string | null
  /** The name Cherry Blossom™ uses. */
  preferredName: string | null
  /** "America/New_York" etc. */
  timeZone: string
  /** ISO 639 language code. */
  preferredLanguage: string
  /** How the founder prefers business concepts explained. */
  communicationStyle: string
  /** ISO date of first platform use. */
  memberSince: string | null
  /** What the founder hopes to achieve — free text. */
  founderGoals: string | null
  /** Current focus — e.g. "Preparing to launch my first course". */
  currentFocus: string | null
}

/* ---------------------------------------------------------------------------
 * Layer 2 — Business Context™
 * ------------------------------------------------------------------------- */
export interface BusinessContext {
  /** The founder's current Business Stage™. */
  businessStage: BusinessStage
  /** Human-readable stage description. */
  businessStageDescription: string
  /** ESA results — null if not yet completed. */
  esaResults: EsaResults | null
  /** Entrepreneur Success Score™ (0–100) — null if no ESA. */
  entrepreneurSuccessScore: number | null
  /** Work-Life Balance Audit™ overall score (0–100) — null if no audit. */
  workLifeBalanceScore: number | null
  /** Business Performance™ snapshot — null if not yet captured. */
  performance: Partial<BusinessPerformanceSnapshot> | null
  /** Whether the ESA has been completed at least once. */
  hasCompletedEsa: boolean
  /** Whether the Work-Life Balance Audit™ has been completed. */
  hasCompletedAudit: boolean
  /**
   * Latest Reality Check™ score (0–100), sourced from Supabase `reality_checks`
   * — the founder's most recent weekly snapshot, not a re-derived value.
   * Null for anonymous sessions or founders with no recorded Reality Check™.
   */
  latestRealityCheckScore: number | null
  /** The week key (Monday, YYYY-MM-DD) the latest Reality Check™ belongs to. */
  latestRealityCheckWeekKey: string | null
  /** Priority areas the founder selected on their latest Reality Check™. */
  latestRealityCheckPriorityAreas: string[]
  /** Whether the latest Reality Check™ belongs to the current calendar week. */
  realityCheckIsCurrentWeek: boolean
}

/* ---------------------------------------------------------------------------
 * Layer 3.5 — Founder Destination™
 * ------------------------------------------------------------------------- */
export interface DestinationContext {
  /** True once the founder has saved at least one Founder Destination™ field. */
  hasDestination: boolean
  /** The full Founder Destination™ profile, unmodified — null if not started. */
  profile: FounderDestinationProfile | null
  /** Business Destination™ — where the business itself is headed. */
  businessDestination: {
    desiredBusinessSize: string | null
    revenueAmbition: string | null
    desiredMarketPosition: string | null
  }
  /** Founder Destination™ — the founder's own future role. */
  founderRoleDestination: {
    desiredFounderRole: string | null
    desiredFounderIndependence: string | null
    desiredWorkingHoursPerWeek: string | null
  }
  /** Life Destination™ — the life the business should support. */
  lifeDestination: {
    desiredWorkLifeBalanceModel: string | null
    desiredTimeFreedomLevel: string | null
    nonNegotiableLifeBoundaries: string[]
  }
  /** Future Workplace Destination™ — the workplace they want to build. */
  futureWorkplaceDestination: {
    desiredWorkplaceType: string | null
    desiredAiHumanRelationship: string | null
    desiredLeadershipCulture: string | null
  }
}

/* ---------------------------------------------------------------------------
 * Layer 4 — Operating Context™
 * ------------------------------------------------------------------------- */
export interface OperatingContext {
  /** Current day name — e.g. "Tuesday". */
  dayName: string
  /** Time of day bucket — "Morning" | "Afternoon" | "Evening" | "Night". */
  timeOfDay: string
  /** Greeting — e.g. "Good Morning". */
  greeting: string
  /** Whether the founder has completed Sunday Design Day™ this week. */
  weekDesigned: boolean
  /** The Weekly Intention Declaration™ for this week. */
  weeklyIntention: string
  /** Active Priority Focus Areas™ labels. */
  activeFocusAreas: string[]
  /** The current Operating Segment™ title (e.g. "CEO Workday™"). */
  currentSegmentTitle: string | null
  /** The founder's installed Operating Rule™ for the current segment. */
  currentSegmentRule: string | null
  /** The founder's current Daily Non-Negotiable™. */
  currentNonNegotiable: string | null
  /** Total number of completed SDD cycles (architecture hook). */
  sddCyclesCompleted: number
}

/* ---------------------------------------------------------------------------
 * Layer 5 — Intelligence Hooks™
 * Pre-computed signals — architecture only, no logic reads these yet.
 * ------------------------------------------------------------------------- */
export interface IntelligenceHooks {
  /**
   * Pre-assembled GpsContext — the signal surface Founder GPS™ will reason
   * over. Architecture hook: the GPS engine doesn't run this phase.
   */
  gpsContext: GpsContext

  /**
   * The three GPS Outcomes™ ranked by current urgency (architecture hook).
   * Derived deterministically from the available signals.
   */
  urgentOutcomes: UrgentOutcome[]

  /**
   * Upcoming life events within the awareness window.
   * Pre-filtered from WholeLifeContext.lifeEvents for Cherry Blossom's awareness.
   */
  upcomingLifeEvents: UpcomingEventSignal[]

  /**
   * Active Non-Negotiable™ life commitments this week.
   * Pre-filtered from WholeLifeContext.lifeCommitments.
   */
  activeNonNegotiables: NonNegotiableSignal[]

  /**
   * Personal goals currently being pursued — architecture hook for GPS routing.
   */
  activePersonalGoals: PersonalGoalSignal[]

  /**
   * Weakest ESA pillar — the GPS's primary candidate for its next recommendation.
   * Null if no ESA data.
   */
  weakestPillar: OperatingPillarId | null

  /**
   * Strongest ESA pillar — the GPS celebrates this and builds on it.
   * Null if no ESA data.
   */
  strongestPillar: OperatingPillarId | null

  /**
   * The single most important signal the GPS would act on if it were running.
   * Derived deterministically — architecture only, no UI reads this yet.
   */
  topPrioritySignal: string | null

  /**
   * Derived summary over the founder's real DECIDE→EMBODY→EXECUTE execution
   * history (Supabase `segment_completions`) — counts and a streak only,
   * never raw rows. Architecture hook: no logic reads this yet.
   */
  operatingHistory: OperatingHistorySummary
}

/**
 * A bounded, aggregated summary of the founder's real Operating Segment™
 * completion history — never a raw row dump. Mirrors the honored/modified/
 * not-completed vocabulary already used by `segment_completions.completion_status`.
 */
export interface OperatingHistorySummary {
  /** Whether any `segment_completions` rows exist for this founder. */
  hasHistory: boolean
  /** Total completions considered in this summary's bounded window. */
  totalCompletions: number
  honoredCount: number
  modifiedCount: number
  notCompletedCount: number
  /** Consecutive honored days counting back from today (0 if broken/none). */
  currentStreak: number
  /** ISO date of the most recent completion, or null. */
  lastCompletedAt: string | null
}

/** A ranked urgent outcome — the GPS would surface recommendations against these first. */
export interface UrgentOutcome {
  outcome: "honor-non-negotiables" | "build-compounding-assets" | "reduce-execution-friction"
  urgency: "critical" | "high" | "medium" | "low"
  reason: string
}

/** A pre-filtered upcoming life event for Cherry Blossom's awareness. */
export interface UpcomingEventSignal {
  eventId: string
  title: string
  date: string
  daysUntil: number
  requiresPreparation: boolean
  significance: string
}

/** A pre-filtered active Non-Negotiable™ commitment. */
export interface NonNegotiableSignal {
  commitmentId: string
  title: string
  category: string
  daysOfWeek: string[]
}

/** A pre-filtered active personal goal. */
export interface PersonalGoalSignal {
  goalId: string
  title: string
  domain: string
  targetDate: string | null
  daysUntilTarget: number | null
}

/* ===========================================================================
 * Empty / default snapshot
 * ======================================================================== */
import { EMPTY_WHOLE_LIFE_CONTEXT } from "@/lib/whole-life-context/types"
import { DEFAULT_BUSINESS_STAGE } from "@/lib/business-stage/business-stage"

// Both derived by calling the real Phase 9A/9B functions with null inputs —
// their own "unknown"-safe defaults, never a hand-duplicated empty shape.
// Extracted so the same empty values can be reused inside `gpsContext` below.
const EMPTY_BUSINESS_MODEL_PROFILE: BusinessModelProfile = classifyBusinessModel(null)
const EMPTY_BUSINESS_OPERATING_FINGERPRINT: BusinessOperatingFingerprint = deriveBusinessOperatingFingerprint({
  businessContext: null,
  founderDestination: null,
  businessStage: DEFAULT_BUSINESS_STAGE,
})

export const EMPTY_HARMONY_SNAPSHOT: HarmonyContextSnapshot = {
  ready: false,
  identity: {
    userId: null,
    preferredName: null,
    timeZone: "America/New_York",
    preferredLanguage: "en-US",
    communicationStyle: "business-builder",
    memberSince: null,
    founderGoals: null,
    currentFocus: null,
  },
  business: {
    businessStage: DEFAULT_BUSINESS_STAGE,
    businessStageDescription: "",
    esaResults: null,
    entrepreneurSuccessScore: null,
    workLifeBalanceScore: null,
    performance: null,
    hasCompletedEsa: false,
    hasCompletedAudit: false,
    latestRealityCheckScore: null,
    latestRealityCheckWeekKey: null,
    latestRealityCheckPriorityAreas: [],
    realityCheckIsCurrentWeek: false,
  },
  businessModelProfile: EMPTY_BUSINESS_MODEL_PROFILE,
  businessOperatingFingerprint: EMPTY_BUSINESS_OPERATING_FINGERPRINT,
  life: EMPTY_WHOLE_LIFE_CONTEXT,
  destination: {
    hasDestination: false,
    profile: null,
    businessDestination: {
      desiredBusinessSize: null,
      revenueAmbition: null,
      desiredMarketPosition: null,
    },
    founderRoleDestination: {
      desiredFounderRole: null,
      desiredFounderIndependence: null,
      desiredWorkingHoursPerWeek: null,
    },
    lifeDestination: {
      desiredWorkLifeBalanceModel: null,
      desiredTimeFreedomLevel: null,
      nonNegotiableLifeBoundaries: [],
    },
    futureWorkplaceDestination: {
      desiredWorkplaceType: null,
      desiredAiHumanRelationship: null,
      desiredLeadershipCulture: null,
    },
  },
  operating: {
    dayName: "",
    timeOfDay: "Morning",
    greeting: "Good Morning",
    weekDesigned: false,
    weeklyIntention: "",
    activeFocusAreas: [],
    currentSegmentTitle: null,
    currentSegmentRule: null,
    currentNonNegotiable: null,
    sddCyclesCompleted: 0,
  },
  intelligence: {
    gpsContext: {
      firstName: null,
      businessStage: null,
      businessModel: null,
      preferredLanguage: null,
      businessPerformance: null,
      entrepreneurSuccessScore: null,
      weakestEsaPillar: null,
      strongestEsaPillar: null,
      currentOperatingSegment: null,
      weeklyIntention: null,
      activeFocusAreas: [],
      weekDesigned: false,
      memberSince: null,
      assessmentCyclesCompleted: 0,
      lastEsaDate: null,
      esaTrend: null,
      businessComprehension: null,
      nonNegotiablesCount: 0,
      upcomingLifeEventsCount: 0,
      hasEventRequiringPreparation: false,
      hasPersonalGoals: false,
      activePersonalGoalsCount: 0,
      hasRelationships: false,
      daysUntilNextSignificantEvent: null,
      inLifeProtectionMode: false,
      businessModelProfile: EMPTY_BUSINESS_MODEL_PROFILE,
      businessOperatingFingerprint: EMPTY_BUSINESS_OPERATING_FINGERPRINT,
    },
    urgentOutcomes: [],
    upcomingLifeEvents: [],
    activeNonNegotiables: [],
    activePersonalGoals: [],
    weakestPillar: null,
    strongestPillar: null,
    topPrioritySignal: null,
    operatingHistory: {
      hasHistory: false,
      totalCompletions: 0,
      honoredCount: 0,
      modifiedCount: 0,
      notCompletedCount: 0,
      currentStreak: 0,
      lastCompletedAt: null,
    },
  },
}

/* ===========================================================================
 * assembleHarmonySnapshot()
 * ---------------------------------------------------------------------------
 * Pure function. Takes all available context as inputs and returns a fully
 * assembled HarmonyContextSnapshot. Never throws. Safe to call server-side.
 *
 * ARCHITECTURE: This function is the brain's assembly line. In future phases,
 * Supabase server actions will call this with real data. For now, consumers
 * may call it with localStorage data on the client.
 * ======================================================================== */
export function assembleHarmonySnapshot(input: AssemblyInput): HarmonyContextSnapshot {
  const {
    harmonyContext,
    wholeLife,
    esaResults,
    auditScore,
    performance,
    founderDestination,
    realityCheck,
    operatingHistory: operatingHistoryInput,
    bbaSignalSummary,
  } = input

  // --- Identity ---
  const identity: IdentityContext = {
    userId: input.userId ?? null,
    preferredName: harmonyContext?.firstName ?? wholeLife?.profile?.preferredName ?? null,
    timeZone: wholeLife?.profile?.timeZone ?? harmonyContext?.preferredLocale ?? "America/New_York",
    preferredLanguage: harmonyContext?.preferredLanguage ?? "en-US",
    communicationStyle: harmonyContext?.communicationStyle ?? "business-builder",
    memberSince: wholeLife?.profile?.memberSince ?? null,
    founderGoals: wholeLife?.profile?.founderGoals ?? null,
    currentFocus: wholeLife?.profile?.currentFocus ?? null,
  }

  // --- Business ---
  const weakestPillar = esaResults?.pillarScores
    ? [...esaResults.pillarScores].sort((a, b) => a.percentage - b.percentage)[0]?.pillarId ?? null
    : null
  const strongestPillar = esaResults?.pillarScores
    ? [...esaResults.pillarScores].sort((a, b) => b.percentage - a.percentage)[0]?.pillarId ?? null
    : null

  const business: BusinessContext = {
    businessStage: harmonyContext?.businessStage ?? DEFAULT_BUSINESS_STAGE,
    businessStageDescription: harmonyContext?.businessStageDescription ?? "",
    esaResults: esaResults ?? null,
    entrepreneurSuccessScore: esaResults?.overallScore ?? null,
    workLifeBalanceScore: auditScore ?? null,
    performance: performance ?? null,
    hasCompletedEsa: !!esaResults,
    hasCompletedAudit: auditScore != null,
    latestRealityCheckScore: realityCheck?.overall_score ?? null,
    latestRealityCheckWeekKey: realityCheck?.week_key ?? null,
    latestRealityCheckPriorityAreas: realityCheck?.selected_priority_areas ?? [],
    realityCheckIsCurrentWeek: realityCheck?.week_key === getCurrentWeekKey(),
  }

  // --- Business Model Profile™ (Phase 9B) / Business Operating Fingerprint™ (Phase 9A) ---
  // `harmonyContext.businessContext` is the same Business Context Profile™ the
  // provider already loads (Phase 10.1) — reused here, never re-fetched.
  const businessContextProfile = harmonyContext?.businessContext ?? null
  const businessModelProfile: BusinessModelProfile = classifyBusinessModel(businessContextProfile)

  // --- Founder Destination™ ---
  const fd = founderDestination ?? null

  const businessOperatingFingerprint: BusinessOperatingFingerprint = deriveBusinessOperatingFingerprint({
    businessContext: businessContextProfile,
    founderDestination: fd,
    businessStage: business.businessStage,
    businessModelProfile,
  })
  const destination: DestinationContext = {
    hasDestination: !!fd,
    profile: fd,
    businessDestination: {
      desiredBusinessSize: fd?.desiredBusinessSize ?? null,
      revenueAmbition: fd?.revenueAmbition ?? null,
      desiredMarketPosition: fd?.desiredMarketPosition ?? null,
    },
    founderRoleDestination: {
      desiredFounderRole: fd?.desiredFounderRole ?? null,
      desiredFounderIndependence: fd?.desiredFounderIndependence ?? null,
      desiredWorkingHoursPerWeek: fd?.desiredWorkingHoursPerWeek ?? null,
    },
    lifeDestination: {
      desiredWorkLifeBalanceModel: fd?.desiredWorkLifeBalanceModel ?? null,
      desiredTimeFreedomLevel: fd?.desiredTimeFreedomLevel ?? null,
      nonNegotiableLifeBoundaries: fd?.nonNegotiableLifeBoundaries ?? [],
    },
    futureWorkplaceDestination: {
      desiredWorkplaceType: fd?.desiredWorkplaceType ?? null,
      desiredAiHumanRelationship: fd?.desiredAiHumanRelationship ?? null,
      desiredLeadershipCulture: fd?.desiredLeadershipCulture ?? null,
    },
  }

  // --- Operating ---
  const operating: OperatingContext = {
    dayName: harmonyContext?.dayName ?? "",
    timeOfDay: harmonyContext?.timeOfDay ?? "Morning",
    greeting: harmonyContext?.greeting ?? "Good Morning",
    weekDesigned: harmonyContext?.hasDesignedWeek ?? false,
    weeklyIntention: harmonyContext?.weeklyDeclaration ?? harmonyContext?.weeklyIntention ?? "",
    activeFocusAreas: harmonyContext?.focusAreas ?? [],
    currentSegmentTitle: harmonyContext?.currentSegment?.title ?? null,
    currentSegmentRule: harmonyContext?.currentSegment?.rule ?? null,
    currentNonNegotiable: harmonyContext?.currentSegment?.nonNegotiable ?? null,
    sddCyclesCompleted: 0, // Architecture hook — populated when cycle tracking ships.
  }

  // --- Intelligence Hooks ---
  const now = new Date()

  const upcomingLifeEvents: UpcomingEventSignal[] = (wholeLife?.lifeEvents ?? [])
    .filter((e) => {
      const eventDate = new Date(e.date)
      const awarenessDays = e.awarenessWindowDays ?? 7
      const awarenessStart = new Date(eventDate.getTime() - awarenessDays * 24 * 60 * 60 * 1000)
      return awarenessStart <= now && eventDate >= now
    })
    .map((e) => ({
      eventId: e.id,
      title: e.title,
      date: e.date,
      daysUntil: Math.ceil((new Date(e.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      requiresPreparation: e.requiresPreparation ?? false,
      significance: e.significance,
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)

  const activeNonNegotiables: NonNegotiableSignal[] = (wholeLife?.lifeCommitments ?? [])
    .filter((c) => c.isActive && c.isNonNegotiable)
    .map((c) => ({
      commitmentId: c.id,
      title: c.title,
      category: c.category,
      daysOfWeek: c.daysOfWeek,
    }))

  const activePersonalGoals: PersonalGoalSignal[] = (wholeLife?.personalGoals ?? [])
    .filter((g) => g.status === "active")
    .map((g) => ({
      goalId: g.id,
      title: g.title,
      domain: g.domain,
      targetDate: g.targetDate ?? null,
      daysUntilTarget: g.targetDate
        ? Math.ceil((new Date(g.targetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    }))

  // Determine urgent outcomes deterministically from signals. Deliberately
  // does NOT pass Work-Life Balance Audit™ data — see `deriveUrgentOutcomes`'s
  // own doc comment for why.
  const urgentOutcomes = deriveUrgentOutcomes({
    hasCompletedEsa: business.hasCompletedEsa,
    weekDesigned: operating.weekDesigned,
    esaScore: business.entrepreneurSuccessScore,
    nonNegotiablesCount: activeNonNegotiables.length,
    cashFlow: performance?.cashFlow ?? null,
  })

  // Top priority signal — the single GPS signal that would fire first
  const topPrioritySignal = deriveTopPrioritySignal({
    hasCompletedEsa: business.hasCompletedEsa,
    weekDesigned: operating.weekDesigned,
    esaScore: business.entrepreneurSuccessScore,
  })

  // Whole-Life GPS signal pre-computation
  const significantUpcoming = upcomingLifeEvents.filter(
    (e) => e.significance === "life-defining" || e.significance === "high"
  )
  const daysUntilNextSignificantEvent = significantUpcoming.length > 0
    ? significantUpcoming[0].daysUntil
    : null
  const inLifeProtectionMode = daysUntilNextSignificantEvent != null && daysUntilNextSignificantEvent <= 3

  const gpsContext: GpsContext = {
    firstName: identity.preferredName,
    businessStage: business.businessStage,
    // Filled from Business Model Classification™ (Phase 9B) — "unknown" (no
    // supporting signal yet) maps to null, same as every other GpsContext field.
    businessModel: businessModelProfile.primaryArchetype === "unknown" ? null : businessModelProfile.primaryArchetype,
    preferredLanguage: identity.preferredLanguage,
    businessPerformance: performance ?? null,
    // Deliberately does NOT include `business.workLifeBalanceScore` — the
    // Work-Life Balance Audit™ belongs to the separate Work-Life Balance
    // Operating System™ and must never be a Founder GPS™ input.
    entrepreneurSuccessScore: business.entrepreneurSuccessScore,
    weakestEsaPillar: weakestPillar as OperatingPillarId | null,
    strongestEsaPillar: strongestPillar as OperatingPillarId | null,
    currentOperatingSegment: operating.currentSegmentTitle,
    weeklyIntention: operating.weeklyIntention || null,
    activeFocusAreas: operating.activeFocusAreas,
    weekDesigned: operating.weekDesigned,
    memberSince: identity.memberSince,
    assessmentCyclesCompleted: 0, // Architecture hook
    lastEsaDate: esaResults?.completedAt ?? null,
    esaTrend: null, // Architecture hook — trend tracking deferred
    businessComprehension: identity.communicationStyle,
    // Whole-Life signals (Phase 6.1)
    nonNegotiablesCount: activeNonNegotiables.length,
    upcomingLifeEventsCount: upcomingLifeEvents.length,
    hasEventRequiringPreparation: upcomingLifeEvents.some((e) => e.requiresPreparation),
    hasPersonalGoals: (wholeLife?.personalGoals ?? []).length > 0,
    activePersonalGoalsCount: activePersonalGoals.length,
    hasRelationships: (wholeLife?.relationships ?? []).length > 0,
    daysUntilNextSignificantEvent,
    inLifeProtectionMode,
    // Business Model Profile™ (Phase 9B) / Business Operating Fingerprint™
    // (Phase 9A) passthrough — same values as the top-level snapshot fields.
    businessModelProfile,
    businessOperatingFingerprint,
    // Business Bottleneck Audit™ (BBA™) signals — additive; see
    // `lib/founder-gps/context/bba-context-aggregator.ts`. Undefined when
    // the caller hasn't fetched it yet (or the founder has no BBA data),
    // never a false signal.
    bbaSignalSummary: bbaSignalSummary ?? undefined,
  }

  const resolvedOperatingHistory: OperatingHistorySummary = operatingHistoryInput ?? {
    hasHistory: false,
    totalCompletions: 0,
    honoredCount: 0,
    modifiedCount: 0,
    notCompletedCount: 0,
    currentStreak: 0,
    lastCompletedAt: null,
  }

  return {
    ready: true,
    identity,
    business,
    businessModelProfile,
    businessOperatingFingerprint,
    life: wholeLife ?? EMPTY_WHOLE_LIFE_CONTEXT,
    destination,
    operating,
    intelligence: {
      gpsContext,
      urgentOutcomes,
      upcomingLifeEvents,
      activeNonNegotiables,
      activePersonalGoals,
      weakestPillar: weakestPillar as OperatingPillarId | null,
      strongestPillar: strongestPillar as OperatingPillarId | null,
      topPrioritySignal,
      operatingHistory: resolvedOperatingHistory,
    },
  }
}

/** Returns the Monday (start) of the current week as YYYY-MM-DD — mirrors utils/reality-check-storage.ts's getWeekKey. */
function getCurrentWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/* ===========================================================================
 * Assembly input type
 * ======================================================================== */

/** Minimal shape of a `reality_checks` row this engine needs — matches `RealityCheckRecord` in utils/reality-check-storage.ts. */
export interface RealityCheckInput {
  week_key: string
  overall_score: number | null
  selected_priority_areas: string[] | null
}

export interface AssemblyInput {
  /** The authenticated user's Supabase id. */
  userId?: string | null
  /** The current HarmonyContextValue from the context provider. */
  harmonyContext?: HarmonyContextValue | null
  /** The founder's Whole-Life Context™ snapshot. */
  wholeLife?: WholeLifeContext | null
  /** ESA results — null if not completed. */
  esaResults?: EsaResults | null
  /** Work-Life Balance Audit™ overall score (0–100). */
  auditScore?: number | null
  /** The founder's Founder Destination™ profile — null if not started. */
  founderDestination?: FounderDestinationProfile | null
  /** The founder's most recent Reality Check™ record — null if none exists. */
  realityCheck?: RealityCheckInput | null
  /** Pre-derived Operating History™ summary — null/omitted defaults to empty. */
  operatingHistory?: OperatingHistorySummary | null
  /** Business Performance™ snapshot. */
  performance?: Partial<BusinessPerformanceSnapshot> | null
  /**
   * Business Bottleneck Audit™ (BBA™) signal summary — see
   * `lib/founder-gps/context/bba-context-aggregator.ts`. Optional and
   * purely additive; omitting it changes nothing (same "degrades
   * gracefully" contract as every other GpsContext field).
   */
  bbaSignalSummary?: BbaSignalSummary | null
}

/* ===========================================================================
 * Pure derivation helpers
 * Architecture only — deterministic, no side effects, no AI.
 * ======================================================================== */

// Deliberately does NOT take Work-Life Balance Audit™ signals (score or
// completion state) — that data belongs to the separate Work-Life Balance
// Operating System™ and must never drive a Founder GPS™ urgent outcome.
// "Honor Non-Negotiables™" urgency here is driven only by the founder's own
// declared Life Non-Negotiables™ count.
function deriveUrgentOutcomes(signals: {
  hasCompletedEsa: boolean
  weekDesigned: boolean
  esaScore: number | null
  nonNegotiablesCount: number
  cashFlow: "healthy" | "tight" | "critical" | null
}): UrgentOutcome[] {
  const outcomes: UrgentOutcome[] = []

  // Honor Non-Negotiables™ urgency
  if (signals.nonNegotiablesCount === 0) {
    outcomes.push({
      outcome: "honor-non-negotiables",
      urgency: "medium",
      reason: "No Life Non-Negotiables™ have been defined.",
    })
  }

  // Build Compounding Assets™ urgency
  if (signals.cashFlow === "critical") {
    outcomes.push({
      outcome: "build-compounding-assets",
      urgency: "critical",
      reason: "Business cash flow is critical — revenue engine needs immediate attention.",
    })
  } else if (!signals.hasCompletedEsa) {
    outcomes.push({
      outcome: "build-compounding-assets",
      urgency: "high",
      reason: "Entrepreneur Success Assessment™ not completed — GPS cannot route without a baseline.",
    })
  } else if (signals.esaScore != null && signals.esaScore < 40) {
    outcomes.push({
      outcome: "build-compounding-assets",
      urgency: "critical",
      reason: "Entrepreneur Success Score™ is critically low.",
    })
  }

  // Reduce Execution Friction™ urgency
  if (!signals.weekDesigned) {
    outcomes.push({
      outcome: "reduce-execution-friction",
      urgency: "high",
      reason: "Sunday Design Day™ not completed — weekly direction is undefined.",
    })
  }

  return outcomes.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.urgency] - order[b.urgency]
  })
}

// Deliberately does NOT take Work-Life Balance Audit™ signals — see
// `deriveUrgentOutcomes` above for why.
function deriveTopPrioritySignal(signals: {
  hasCompletedEsa: boolean
  weekDesigned: boolean
  esaScore: number | null
}): string | null {
  if (!signals.hasCompletedEsa) return "no-esa-completed"
  if (signals.esaScore != null && signals.esaScore < 40) return "esa-score-critical"
  if (!signals.weekDesigned) return "week-not-designed"
  return null
}
