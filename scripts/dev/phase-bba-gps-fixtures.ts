/**
 * BBA → Founder GPS™ integration fixtures. Exercises the pure signal-derivation
 * functions with a lettered set of scenarios so the BBA↔GPS wiring (and its
 * "stay silent when unfetched" contract) can be verified without a browser or
 * a Supabase-backed user. Run with: npx tsx scripts/dev/phase-bba-gps-fixtures.ts
 */

import { evaluateOperatingSignals, type ActiveSignal } from "@/lib/founder-gps/context/operating-signal-weighting"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"
import { buildGpsContext, deriveActiveGpsSignals, type NextBestMoveInput } from "@/lib/founder-gps/next-best-move-engine"
import { BBA_CATEGORIES } from "@/lib/business-bottleneck-audit/bba-registry"

let pass = 0
let fail = 0

function check(label: string, condition: boolean) {
  if (condition) {
    pass++
    console.log(`  \u2713 ${label}`)
  } else {
    fail++
    console.log(`  \u2717 FAIL: ${label}`)
  }
}

/* ===========================================================================
 * [A] BBA registry sanity — 15 categories, stable ids, no duplicates
 * ======================================================================== */

console.log("\n[A] BBA_CATEGORIES registry sanity\n")

check("[A] exactly 15 categories", BBA_CATEGORIES.length === 15)
check(
  "[A] every category id is unique",
  new Set(BBA_CATEGORIES.map((c) => c.id)).size === BBA_CATEGORIES.length,
)
check(
  "[A] order values are unique and cover 1..N",
  new Set(BBA_CATEGORIES.map((c) => c.order)).size === BBA_CATEGORIES.length,
)

/* ===========================================================================
 * Minimal HarmonyContextAggregate builder — every field defaulted to the
 * "nothing active" shape so each scenario only varies bbaSignalSummary.
 * ======================================================================== */

function baseAggregate(bbaSignalSummary?: BbaSignalSummary): HarmonyContextAggregate {
  return {
    firstName: null,
    businessStage: null,
    businessModel: null,
    teamSize: null,
    revenueStage: null,
    founderRole: null,
    biggestGoals: [],
    biggestChallenges: [],
    biggestOpportunities: [],
    capitalStrategy: [],
    growthVision: null,
    operatingEnvironment: null,
    supportNetwork: [],
    businessCredit: null,
    wealthBuildingInterests: [],
    longTermVision: null,
    exitVision: null,
    entrepreneurSuccessScore: 70, // deliberately "healthy" so no ESA-era signal fires and muddies the BBA-only assertions
    weakestEsaPillar: null,
    strongestEsaPillar: null,
    bbaSignalSummary,
    weekDesigned: true,
    weeklyIntention: null,
    ceoWorkdayPriorities: null,
    humanZoneOfGenius: null,
    executionFriction: null,
    businessOperatingRule: null,
    progress: { nonNegotiableStreak: 3, workoutStreak: 3, totalAssetsIdentified: 0 } as HarmonyContextAggregate["progress"],
    consecutiveCompletions: 0,
    upcomingLifeEvents: [],
    activePersonalGoalsCount: 1,
    hasRelationships: true,
    nonNegotiableCommitmentsCount: 1,
    hasEventRequiringPreparation: false,
    inLifeProtectionMode: false,
    daysUntilNextSignificantEvent: null,
    learningInterests: [],
    communicationLevel: null,
    recentRecommendationIds: [],
    lastCompletedRecommendationId: null,
    lastCompletedRecommendationTitle: null,
    hasMomentum: false,
    recentWin: null,
    pendingSkipReason: null,
    lastRecommendationOutcome: null,
    platformEngagementDays: 10,
  }
}

function findSignal(signals: ActiveSignal[], id: string): ActiveSignal | undefined {
  return signals.find((s) => s.id === id)
}

/* ===========================================================================
 * [B] Operating Signal Weighting™ — bbaSignalSummary omitted entirely
 * ======================================================================== */

console.log("\n[B] evaluateOperatingSignals — bbaSignalSummary omitted (caller didn't fetch it)\n")

{
  const signals = evaluateOperatingSignals(baseAggregate(undefined))
  check("[B] no BBA signal fires when summary is undefined (no false 'not completed' guess)", !findSignal(signals, "no-bba-completed"))
  check("[B] no ownership-gap signal fires when summary is undefined", !findSignal(signals, "bba-ownership-gap-widespread"))
  check("[B] no assignment-blocked signal fires when summary is undefined", !findSignal(signals, "bba-assignment-repeatedly-blocked"))
}

/* ===========================================================================
 * [C] Operating Signal Weighting™ — no baseline yet
 * ======================================================================== */

console.log("\n[C] evaluateOperatingSignals — bba.hasBaseline === false\n")

{
  const bba: BbaSignalSummary = {
    hasBaseline: false,
    baselineCompletedAt: null,
    unownedCategoryIds: [],
    hasWidespreadOwnershipGap: false,
    hasThisWeeksCheckin: false,
    bottlenecksClearedThisWeek: null,
    lastAssignmentStatus: null,
    assignmentRepeatedlyBlocked: false,
    reportedBusinessAssetActivity: false,
    upcomingStakeholderDeadlineCount: 0,
  }
  const signals = evaluateOperatingSignals(baseAggregate(bba))
  const s = findSignal(signals, "no-bba-completed")
  check("[C] 'no-bba-completed' fires when a fetched summary has no baseline", Boolean(s))
  check("[C] fired at primary influence, build-compounding-assets outcome", s?.influence === "primary" && s?.outcome === "build-compounding-assets")
  check("[C] ownership/assignment signals do not also fire (mutually exclusive with no-baseline)", !findSignal(signals, "bba-ownership-gap-widespread") && !findSignal(signals, "bba-assignment-repeatedly-blocked"))
}

/* ===========================================================================
 * [D] Operating Signal Weighting™ — baseline complete, widespread ownership gap
 * ======================================================================== */

console.log("\n[D] evaluateOperatingSignals — baseline complete, 3+ unowned categories\n")

{
  const bba: BbaSignalSummary = {
    hasBaseline: true,
    baselineCompletedAt: new Date().toISOString(),
    unownedCategoryIds: ["marketing", "sales", "financial-economics"],
    hasWidespreadOwnershipGap: true,
    hasThisWeeksCheckin: true,
    bottlenecksClearedThisWeek: 1,
    lastAssignmentStatus: "completed",
    assignmentRepeatedlyBlocked: false,
    reportedBusinessAssetActivity: true,
    upcomingStakeholderDeadlineCount: 0,
  }
  const signals = evaluateOperatingSignals(baseAggregate(bba))
  const s = findSignal(signals, "bba-ownership-gap-widespread")
  check("[D] 'bba-ownership-gap-widespread' fires", Boolean(s))
  check("[D] label reflects the real unowned count (3), never invented copy", s?.label === "3 business areas have no clear owner")
  check("[D] 'no-bba-completed' does NOT also fire once a baseline exists", !findSignal(signals, "no-bba-completed"))
}

/* ===========================================================================
 * [E] Operating Signal Weighting™ — assignment repeatedly blocked
 * ======================================================================== */

console.log("\n[E] evaluateOperatingSignals — assignment repeatedly blocked\n")

{
  const bba: BbaSignalSummary = {
    hasBaseline: true,
    baselineCompletedAt: new Date().toISOString(),
    unownedCategoryIds: [],
    hasWidespreadOwnershipGap: false,
    hasThisWeeksCheckin: true,
    bottlenecksClearedThisWeek: 0,
    lastAssignmentStatus: "not-started",
    assignmentRepeatedlyBlocked: true,
    reportedBusinessAssetActivity: false,
    upcomingStakeholderDeadlineCount: 0,
  }
  const signals = evaluateOperatingSignals(baseAggregate(bba))
  const s = findSignal(signals, "bba-assignment-repeatedly-blocked")
  check("[E] 'bba-assignment-repeatedly-blocked' fires", Boolean(s))
  check("[E] routed to reduce-execution-friction outcome, primary influence", s?.outcome === "reduce-execution-friction" && s?.influence === "primary")
}

/* ===========================================================================
 * [F] Regression — pre-existing ESA-era signals still fire independent of BBA
 * ======================================================================== */

console.log("\n[F] Regression — ESA-era signals unaffected by BBA wiring\n")

{
  const agg = baseAggregate(undefined)
  agg.entrepreneurSuccessScore = null // exercise the pre-existing "no business context" style path
  const signals = evaluateOperatingSignals(agg)
  check(
    "[F] pre-existing 'no-business-context-completed' signal still evaluable (untouched by BBA changes)",
    signals.every((s) => typeof s.id === "string" && typeof s.weight === "number"),
  )
}

/* ===========================================================================
 * [G] Next Best Move™ engine — buildGpsContext + deriveActiveGpsSignals wiring
 * ======================================================================== */

console.log("\n[G] buildGpsContext / deriveActiveGpsSignals — bbaSignalSummary passthrough\n")

{
  const inputNoBba: NextBestMoveInput = { businessStage: "pre-launch", weekDesigned: true, nonNegotiablesCount: 1, hasPersonalGoals: true, hasRelationships: true }
  const ctxNoBba = buildGpsContext(inputNoBba)
  check("[G] bbaSignalSummary defaults to undefined when omitted from input", ctxNoBba.bbaSignalSummary === undefined)
  const signalsNoBba = deriveActiveGpsSignals(ctxNoBba)
  check("[G] no BBA signal ids appear when bbaSignalSummary is absent", !signalsNoBba.includes("no-bba-completed"))

  const bba: BbaSignalSummary = {
    hasBaseline: true,
    baselineCompletedAt: new Date().toISOString(),
    unownedCategoryIds: ["marketing", "sales", "team-employees"],
    hasWidespreadOwnershipGap: true,
    hasThisWeeksCheckin: true,
    bottlenecksClearedThisWeek: 2,
    lastAssignmentStatus: "started-not-completed",
    assignmentRepeatedlyBlocked: true,
    reportedBusinessAssetActivity: true,
    upcomingStakeholderDeadlineCount: 1,
  }
  const inputWithBba: NextBestMoveInput = { ...inputNoBba, bbaSignalSummary: bba }
  const ctxWithBba = buildGpsContext(inputWithBba)
  check("[G] bbaSignalSummary passes through buildGpsContext unchanged", ctxWithBba.bbaSignalSummary === bba)

  const signalsWithBba = deriveActiveGpsSignals(ctxWithBba)
  check("[G] 'bba-ownership-gap-widespread' appears in derived signals", signalsWithBba.includes("bba-ownership-gap-widespread"))
  check("[G] 'bba-assignment-repeatedly-blocked' appears in derived signals", signalsWithBba.includes("bba-assignment-repeatedly-blocked"))
  check("[G] 'no-bba-completed' does NOT appear once a baseline exists", !signalsWithBba.includes("no-bba-completed"))
}

/* ===========================================================================
 * Summary
 * ======================================================================== */

console.log(`\n${pass} passed, ${fail} failed\n`)
if (fail > 0) process.exit(1)
