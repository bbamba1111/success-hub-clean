/**
 * TEMPORARY diagnostic script — not part of the app. Reproduces the exact
 * dev-preview fixture data (in-memory, no localStorage) and runs it through
 * the real Founder GPS™ pipeline to find where "customer clarity" fails to
 * resolve to `start-customer-clarity`. Delete after the investigation.
 */
import { deriveBusinessStage } from "@/lib/business-stage/business-stage"
import { deriveReadinessRelevance } from "@/lib/founder-intelligence/readiness-relevance"
import { deriveNextBestMove, buildGpsContext } from "@/lib/founder-gps/next-best-move-engine"
import { getRecommendedBusinessAsset } from "@/lib/business-asset-library/gps-recommendation-link"
import type { EsaResults, PillarScore, OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"

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
).map(([pillarId, percentage]) => ({ pillarId, pillarName: PILLAR_NAMES[pillarId], percentage, practiceCount: 4 }))

const esaResults: EsaResults = {
  overallScore: Math.round(PILLAR_SCORES.reduce((s, p) => s + p.percentage, 0) / PILLAR_SCORES.length),
  pillarScores: PILLAR_SCORES,
  practiceScores: [],
  responses: {},
  completedAt: new Date().toISOString(),
} as EsaResults

const businessContext: BusinessContextProfile = {
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
  biggestOpportunities: ["finding-ideal-customer", "increasing-sales"],
} as BusinessContextProfile

const founderDestination: FounderDestinationProfile = {
  desiredBusinessSize: "small-team",
  desiredTeamSize: "4-10",
  desiredGeographicReach: "national",
  desiredMarketPosition: "niche-authority",
  revenueAmbition: "seven-figure",
  desiredFounderRole: "visionary-ceo",
  remainResponsibleFor: ["Vision & Strategy", "Key Relationships"],
  notResponsibleFor: ["Day-to-Day Operations"],
} as FounderDestinationProfile

const businessStage = deriveBusinessStage(businessContext)
console.log("1. Derived BusinessStage:", businessStage)

// Deliberately mirrors `deriveNextBestMove`'s real call EXACTLY — it never
// passes `businessContext` (Concept Overlap™ signal) through. Confirming
// whether that omission changes the winning candidate.
const relevance = deriveReadinessRelevance({
  businessStage,
  founderDestination,
  esaResults,
})

const target = relevance.find((r) => r.id === "start-customer-clarity")
console.log("2. start-customer-clarity in pool?", !!target)
if (target) {
  console.log("   relevanceStatus:", target.relevanceStatus, "| confidence:", target.confidence)
}
console.log(
  "3. Full pool (id, status):",
  relevance.map((r) => `${r.id}:${r.relevanceStatus}`),
)

const ctx = buildGpsContext({
  businessStage,
  businessModel: null,
  founderDestination,
  esaResults,
})
console.log("4. GpsContext.weakestEsaPillar:", ctx.weakestEsaPillar)

const move = deriveNextBestMove(ctx, { founderDestination, esaResults })
console.log("5. Final GpsRecommendation.id (readinessCapabilityId):", move.readinessCapabilityId ?? move.id)
console.log("   nextTurn:", move.nextTurn)

const asset = getRecommendedBusinessAsset(move)
console.log("6. Matched Business Asset:", asset?.id ?? "NONE")
