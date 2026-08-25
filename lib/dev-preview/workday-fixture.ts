/**
 * DEVELOPMENT-ONLY fixture data for visually verifying the live 4-Hour CEO
 * Workday™ experience (Founder GPS™ → Next Best Move™ → Today's Outcome →
 * Decide/Delegate/Design → Today's 1–5 PM Build → hourly check-ins → 4:55
 * proof/closeout).
 *
 * This module writes ONLY to localStorage/sessionStorage — the exact same
 * client-side caches the real app already reads via `HarmonyProvider`
 * (`getBusinessContext`, `getEsaResults`, `getFounderDestination`, etc.).
 * It never touches Supabase, never creates an account, never bypasses
 * payment, and never modifies the real founder data model or its schema.
 *
 * Imported ONLY by `app/dev-preview/workday/page.tsx`, which itself 404s
 * outside development. Do not import this from any production code path.
 */

import { saveBusinessContext } from "@/lib/business-context/business-context-store"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import { saveFounderDestination } from "@/lib/founder-destination/founder-destination-store"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import { saveFounderProfile } from "@/lib/founder-profile/founder-profile-store"
import { saveEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import type { EsaResults, OperatingPillarId, PillarScore } from "@/lib/entrepreneur-success/types"
import { getDateKey, updateTodaysPlan } from "@/lib/daily-plan/storage"
import type { CeoActivity } from "@/lib/daily-plan/types"

const PILLAR_NAMES: Record<OperatingPillarId, string> = {
  "strategic-foundation": "Strategic Foundation™",
  "revenue-engine": "Revenue Engine™",
  "operations-systems": "Operations & Systems™",
  "financial-intelligence": "Financial Intelligence™",
  "people-leadership": "People & Leadership™",
  "client-excellence": "Client Excellence™",
  "growth-innovation": "Growth & Innovation™",
  "human-sustainability": "Human Sustainability™",
}

/**
 * Realistic mid-stage founder: strong on delivery/client-excellence and
 * financial basics, but weak on Revenue Engine™ — specifically ideal
 * customer clarity — so Founder GPS™ has a clear, single weakest pillar to
 * reason from (matches the "Customer Clarity Foundation" example used
 * throughout the planning discussion).
 */
const PILLAR_SCORES: PillarScore[] = (
  [
    ["strategic-foundation", 68],
    ["revenue-engine", 34],
    ["operations-systems", 61],
    ["financial-intelligence", 72],
    ["people-leadership", 55],
    ["client-excellence", 79],
    ["growth-innovation", 58],
    ["human-sustainability", 63],
  ] as [OperatingPillarId, number][]
).map(([pillarId, percentage]) => ({
  pillarId,
  pillarName: PILLAR_NAMES[pillarId],
  percentage,
  practiceCount: 4,
}))

function fixtureEsaResults(): EsaResults {
  const overallScore = Math.round(PILLAR_SCORES.reduce((sum, p) => sum + p.percentage, 0) / PILLAR_SCORES.length)
  return {
    overallScore,
    pillarScores: PILLAR_SCORES,
    practiceScores: [],
    responses: {},
    completedAt: new Date().toISOString(),
  }
}

function fixtureBusinessContext(): BusinessContextProfile {
  return {
    completedAt: new Date().toISOString(),
    businessName: "Cedar & Sage Coaching",
    businessStage: "early-revenue",
    businessModel: ["coaching", "consulting"],
    industry: "Business coaching for service-based founders",
    founderRole: "solopreneur",
    teamSize: "1-3",
    revenueStage: "50k-100k",
    biggestGoals: ["scale-revenue", "build-team"],
    biggestChallenges: ["lead-generation", "clarity"],
    biggestGoalText: "Fill my next cohort with 12 ideal-fit clients without relying on referrals alone.",
    biggestChallengeText: "My offer and messaging try to speak to everyone, so nothing lands with anyone.",
    successVision: "A full, waitlisted program built around a customer I can describe in one sentence.",
    operatingEnvironment: "home-office",
    supportNetwork: ["virtual-assistant", "coach"],
    biggestOpportunities: ["finding-ideal-customer", "increasing-sales"],
    longTermVision: {
      oneYear: "Consistent $25k months with a waitlisted signature program.",
      threeYear: "A small team running delivery so I only run strategy and sales.",
      fiveYear: "A recognized name in my niche with a certified coach network.",
      tenYear: "An advisory-only role with recurring licensing revenue.",
      description: "Build a business known for one thing, for one customer, done extremely well.",
    },
    capitalStrategy: ["bootstrapped"],
    growthVision: "scale-then-exit",
    exitVision: "undecided",
    businessCredit: "building",
    businessBanking: "dedicated-business-account",
    financialFoundation: ["business-entity", "ein", "business-bank-account", "bookkeeping"],
    wealthBuildingInterests: ["retirement-accounts"],
    communicationLevel: "developing",
    learningInterests: ["positioning", "offer-design", "sales-conversations"],
  }
}

function fixtureFounderDestination(): FounderDestinationProfile {
  return {
    desiredBusinessSize: "small-team",
    desiredTeamSize: "4-10",
    desiredGeographicReach: "national",
    desiredMarketPosition: "niche-authority",
    revenueAmbition: "seven-figure",
    desiredFounderRole: "visionary-ceo",
    remainResponsibleFor: ["Vision & Strategy", "Key Relationships"],
    notResponsibleFor: ["Day-to-Day Operations"],
    desiredWorkingHoursPerWeek: "20-30",
    desiredFounderInvolvement: "important-weekly",
    desiredZoneOfGenius: "Translating a founder's expertise into a sellable, teachable program.",
    desiredFounderIndependence: "business-runs-without-me-some",
    desiredWorkLifeBalanceModel: "integrated-blend",
    desiredTimeFreedomLevel: "protected-time-off",
    desiredLifestyle: "Home by 5:30, present for dinner, one real day off each weekend.",
    nonNegotiableLifeBoundaries: ["Evenings with family", "Weekends off"],
    businessLifePurpose: "Fund a life where work is contained and family time is not negotiated.",
    desiredWorkplaceType: "flexible-choice",
    desiredEmployeeExperience: "high-autonomy",
    desiredWorkDesign: "async-first",
    desiredAiHumanRelationship: "ai-augmented-humans-lead",
    desiredLeadershipCulture: "servant-leadership",
    desiredHumanSustainabilityStandard: "performance-with-balance",
  }
}

function fixtureFounderProfile(): Record<string, unknown> {
  return {
    completedAt: new Date().toISOString(),
    firstName: "Jordan",
    lastName: "Reyes",
    role: "Founder & Lead Coach",
  }
}

/** A couple of realistic, already-in-progress activities so the "Today's
 *  CEO Workday™ Activities" section (below the Founder GPS™ card) also
 *  renders populated instead of the empty state. Independent of the GPS
 *  recommendation — never matched against it. */
function fixtureCeoActivities(): CeoActivity[] {
  return [
    {
      id: "fixture-activity-1",
      title: "Draft ideal customer description for the flagship program",
      minutes: 90,
      definitionOfDone: "One paragraph specific enough to reject the wrong-fit lead.",
      status: "in-progress",
    },
    {
      id: "fixture-activity-2",
      title: "Rewrite homepage headline against the new customer description",
      minutes: 45,
      definitionOfDone: "Headline names the customer and the outcome, not just the coach.",
      status: "not-started",
    },
  ]
}

/**
 * Seeds every localStorage/sessionStorage cache `HarmonyProvider` reads so
 * the Founder GPS™ Next Best Move™ → Build Path™ → Build Blueprint™ chain
 * has real signal to reason over. Idempotent — safe to call on every mount
 * of the dev-only preview page.
 */
export function seedWorkdayPreviewFixture(): void {
  saveBusinessContext(fixtureBusinessContext())
  saveFounderDestination(fixtureFounderDestination())
  saveFounderProfile(fixtureFounderProfile())
  saveEsaResults(fixtureEsaResults())
  updateTodaysPlan({ ceoActivities: fixtureCeoActivities() }, getDateKey())
}
