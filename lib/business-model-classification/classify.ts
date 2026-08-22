/**
 * Business Model Classification™ — classifier (Phase 9B)
 * ---------------------------------------------------------------------------
 * Pure, deterministic function: `BusinessContextProfile | null` →
 * `BusinessModelProfile`. Reads exactly the signals the spec names —
 * `businessModel[]`, `industry`, `founderRole`, `teamSize`, `revenueStage` —
 * and nothing else. Anything those signals do not support stays `"unknown"`
 * rather than guessed.
 */

import type { BusinessContextProfile, BusinessModelOption } from "@/lib/business-context/types"
import type { BusinessModelId } from "@/lib/entrepreneur-success/types"
import type {
  AcquisitionModelId,
  BusinessModelProfile,
  ConfidenceLevel,
  CustomerModelId,
  DeliveryModelId,
  FounderDependencyLevel,
  RevenueModelId,
  ScaleMechanismId,
} from "./types"

/**
 * Resolves each loose Business Context™ archetype string onto the canonical
 * `BusinessModelId` vocabulary. A few Business Context options have no exact
 * canonical counterpart ("digital-products", "physical-products",
 * "real-estate", "other") — these resolve to the closest reasonable
 * canonical archetype, or "custom" when none fits, and are always flagged in
 * `evidence` so the mapping is never silently lossy.
 */
const BUSINESS_MODEL_OPTION_TO_ARCHETYPE: Record<BusinessModelOption, BusinessModelId> = {
  service: "professional-services",
  "digital-products": "creator",
  "physical-products": "retail",
  saas: "saas",
  agency: "agency",
  consulting: "consulting",
  coaching: "coaching",
  membership: "membership",
  marketplace: "marketplace",
  franchise: "franchise",
  "real-estate": "custom",
  other: "custom",
}

/** Simple, transparent keyword rules for refining/adding an archetype from the freeform `industry` field. */
const INDUSTRY_KEYWORD_ARCHETYPES: { keywords: string[]; archetype: BusinessModelId }[] = [
  { keywords: ["health", "medical", "clinic", "wellness", "therapy"], archetype: "healthcare" },
  { keywords: ["restaurant", "cafe", "food truck", "catering", "bakery"], archetype: "restaurant" },
  { keywords: ["retail", "store", "shop", "boutique"], archetype: "retail" },
  { keywords: ["construction", "contractor", "builder"], archetype: "construction" },
  { keywords: ["manufactur"], archetype: "manufacturing" },
  { keywords: ["nonprofit", "non-profit", "ngo"], archetype: "nonprofit" },
  { keywords: ["school", "tutor", "curriculum", "education"], archetype: "education" },
  { keywords: ["plumb", "electric", "hvac", "trade"], archetype: "trades" },
  { keywords: ["local", "storefront", "neighborhood"], archetype: "local-business" },
]

function detectArchetypeFromIndustry(industry: string | undefined): { archetype: BusinessModelId; keyword: string } | null {
  if (!industry) return null
  const lower = industry.toLowerCase()
  for (const rule of INDUSTRY_KEYWORD_ARCHETYPES) {
    const match = rule.keywords.find((keyword) => lower.includes(keyword))
    if (match) return { archetype: rule.archetype, keyword: match }
  }
  return null
}

/** Characteristics a given archetype typically implies. Deliberately partial per-archetype — never guessed. */
interface ArchetypeCharacteristics {
  customerModel?: CustomerModelId[]
  revenueModel?: RevenueModelId[]
  deliveryModel?: DeliveryModelId[]
  acquisitionModel?: AcquisitionModelId[]
  scaleMechanism?: ScaleMechanismId[]
}

const ARCHETYPE_CHARACTERISTICS: Record<BusinessModelId, ArchetypeCharacteristics> = {
  coaching: {
    revenueModel: ["recurring-retainer", "one-time"],
    deliveryModel: ["high-touch-custom"],
    acquisitionModel: ["inbound-content", "referral-network"],
    scaleMechanism: ["people-leverage"],
  },
  consulting: {
    customerModel: ["b2b"],
    revenueModel: ["hybrid"],
    deliveryModel: ["high-touch-custom"],
    acquisitionModel: ["referral-network"],
    scaleMechanism: ["people-leverage"],
  },
  agency: {
    customerModel: ["b2b"],
    revenueModel: ["recurring-retainer"],
    deliveryModel: ["high-touch-custom"],
    acquisitionModel: ["referral-network"],
    scaleMechanism: ["people-leverage"],
  },
  saas: {
    revenueModel: ["recurring-subscription"],
    deliveryModel: ["self-serve-software"],
    acquisitionModel: ["inbound-content"],
    scaleMechanism: ["product-leverage"],
  },
  "professional-services": {
    revenueModel: ["hybrid"],
    deliveryModel: ["high-touch-custom"],
    acquisitionModel: ["referral-network"],
    scaleMechanism: ["people-leverage"],
  },
  "local-business": {
    customerModel: ["b2c"],
    revenueModel: ["one-time", "recurring-subscription"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["outbound-sales", "referral-network"],
    scaleMechanism: ["systems-leverage"],
  },
  healthcare: {
    customerModel: ["b2c"],
    revenueModel: ["recurring-retainer"],
    deliveryModel: ["high-touch-custom"],
    acquisitionModel: ["referral-network"],
    scaleMechanism: ["people-leverage"],
  },
  restaurant: {
    customerModel: ["b2c"],
    revenueModel: ["one-time"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["outbound-sales"],
    scaleMechanism: ["systems-leverage"],
  },
  retail: {
    customerModel: ["b2c"],
    revenueModel: ["one-time"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["paid-acquisition"],
    scaleMechanism: ["systems-leverage"],
  },
  trades: {
    customerModel: ["b2c"],
    revenueModel: ["one-time"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["referral-network", "outbound-sales"],
    scaleMechanism: ["people-leverage"],
  },
  construction: {
    customerModel: ["b2b", "b2c"],
    revenueModel: ["one-time"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["referral-network", "outbound-sales"],
    scaleMechanism: ["people-leverage"],
  },
  manufacturing: {
    customerModel: ["b2b"],
    revenueModel: ["one-time"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["outbound-sales"],
    scaleMechanism: ["capital-leverage"],
  },
  nonprofit: {
    revenueModel: ["recurring-subscription"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["partnership-channel"],
    scaleMechanism: ["systems-leverage"],
  },
  membership: {
    customerModel: ["b2c"],
    revenueModel: ["recurring-subscription"],
    deliveryModel: ["productized-service"],
    acquisitionModel: ["inbound-content"],
    scaleMechanism: ["systems-leverage"],
  },
  creator: {
    customerModel: ["b2c"],
    revenueModel: ["one-time", "usage-based"],
    deliveryModel: ["self-serve-software", "productized-service"],
    acquisitionModel: ["inbound-content"],
    scaleMechanism: ["product-leverage"],
  },
  education: {
    revenueModel: ["one-time", "recurring-subscription"],
    deliveryModel: ["productized-service"],
    acquisitionModel: ["inbound-content"],
    scaleMechanism: ["product-leverage"],
  },
  marketplace: {
    customerModel: ["marketplace-two-sided"],
    revenueModel: ["commission-take-rate"],
    deliveryModel: ["self-serve-software"],
    acquisitionModel: ["marketplace-discovery"],
    scaleMechanism: ["systems-leverage"],
  },
  franchise: {
    revenueModel: ["recurring-retainer"],
    deliveryModel: ["done-for-you"],
    acquisitionModel: ["partnership-channel"],
    scaleMechanism: ["systems-leverage"],
  },
  custom: {},
}

function unionOrUnknown<T>(lists: (T[] | undefined)[]): T[] | "unknown" {
  const seen = new Set<T>()
  for (const list of lists) {
    for (const value of list ?? []) seen.add(value)
  }
  return seen.size === 0 ? "unknown" : Array.from(seen)
}

function dedupePreserveOrder(ids: BusinessModelId[]): BusinessModelId[] {
  const seen = new Set<BusinessModelId>()
  const result: BusinessModelId[] = []
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }
  return result
}

const CURRENT_DEPENDENCY_BY_TEAM_SIZE: Partial<Record<NonNullable<BusinessContextProfile["teamSize"]>, FounderDependencyLevel>> = {
  solo: "fully-dependent",
  "1-3": "mostly-dependent",
  "4-10": "mostly-dependent",
  "11-25": "partially-independent",
  "26-50": "largely-independent",
  "50-plus": "largely-independent",
}

function classifyFounderDependency(
  founderRole: BusinessContextProfile["founderRole"] | undefined,
  teamSize: BusinessContextProfile["teamSize"] | undefined,
): FounderDependencyLevel | "unknown" {
  if (founderRole === "ceo-growing-team") return "largely-independent"
  if (teamSize && CURRENT_DEPENDENCY_BY_TEAM_SIZE[teamSize]) return CURRENT_DEPENDENCY_BY_TEAM_SIZE[teamSize]!
  if (founderRole === "solopreneur") return "fully-dependent"
  if (founderRole === "ceo-small-team" || founderRole === "co-founder" || founderRole === "fractional" || founderRole === "operator") {
    return "mostly-dependent"
  }
  return "unknown"
}

/**
 * Classifies a founder's business model from their Business Context
 * Profile™. Deterministic and side-effect-free — safe to call on every
 * render, and safe to pass a null profile (a founder who hasn't completed
 * Business Context™ yet gets an honest, fully-"unknown" profile back).
 */
export function classifyBusinessModel(businessContext: BusinessContextProfile | null): BusinessModelProfile {
  const now = new Date().toISOString()

  if (!businessContext) {
    return {
      generatedAt: now,
      primaryArchetype: "unknown",
      secondaryArchetypes: [],
      customerModel: "unknown",
      revenueModel: "unknown",
      deliveryModel: "unknown",
      acquisitionModel: "unknown",
      scaleMechanism: "unknown",
      founderDependency: "unknown",
      confidence: "low",
      evidence: ["No Business Context Profile™ available yet."],
    }
  }

  const evidence: string[] = []
  const selectedModels = businessContext.businessModel ?? []

  let archetypes = dedupePreserveOrder(
    selectedModels.map((option) => BUSINESS_MODEL_OPTION_TO_ARCHETYPE[option]),
  )
  for (const option of selectedModels) {
    evidence.push(`Business Context businessModel "${option}" mapped to archetype "${BUSINESS_MODEL_OPTION_TO_ARCHETYPE[option]}".`)
  }

  const industryMatch = detectArchetypeFromIndustry(businessContext.industry)
  if (industryMatch && !archetypes.includes(industryMatch.archetype)) {
    archetypes = dedupePreserveOrder([...archetypes, industryMatch.archetype])
    evidence.push(`Industry text matched "${industryMatch.keyword}" → added archetype "${industryMatch.archetype}".`)
  }

  const primaryArchetype: BusinessModelId | "unknown" = archetypes.length > 0 ? archetypes[0] : "unknown"
  const secondaryArchetypes = archetypes.slice(1)

  const characteristicSources = archetypes.map((id) => ARCHETYPE_CHARACTERISTICS[id])
  const customerModel = unionOrUnknown(characteristicSources.map((c) => c.customerModel))
  const revenueModel = unionOrUnknown(characteristicSources.map((c) => c.revenueModel))
  const deliveryModel = unionOrUnknown(characteristicSources.map((c) => c.deliveryModel))
  const acquisitionModel = unionOrUnknown(characteristicSources.map((c) => c.acquisitionModel))
  const scaleMechanism = unionOrUnknown(characteristicSources.map((c) => c.scaleMechanism))

  const founderDependency = classifyFounderDependency(businessContext.founderRole, businessContext.teamSize)
  if (founderDependency !== "unknown") {
    evidence.push(`founderRole "${businessContext.founderRole}" and teamSize "${businessContext.teamSize}" imply founderDependency "${founderDependency}".`)
  }

  // Confidence: a single, clearly-mapped archetype is high; multiple archetypes or
  // any reliance on the "custom" fallback lowers confidence; a business with
  // real revenue traction (beyond pre-revenue) gets a modest confidence lift,
  // since the founder has had a chance to observe their actual operating pattern.
  let confidence: ConfidenceLevel = "low"
  if (archetypes.length === 0) {
    confidence = "low"
    evidence.push("No business model archetype could be determined from the available signals.")
  } else if (archetypes.length === 1 && archetypes[0] !== "custom") {
    confidence = "high"
  } else if (archetypes.every((id) => id === "custom")) {
    confidence = "low"
  } else {
    confidence = "medium"
  }

  const hasEarnedRevenueSignal =
    !!businessContext.revenueStage && businessContext.revenueStage !== "pre-revenue"
  if (hasEarnedRevenueSignal && confidence === "low" && primaryArchetype !== "unknown") {
    confidence = "medium"
    evidence.push(`revenueStage "${businessContext.revenueStage}" reflects real operating history, raising confidence.`)
  } else if (hasEarnedRevenueSignal && confidence === "medium") {
    evidence.push(`revenueStage "${businessContext.revenueStage}" reflects real operating history.`)
  }

  return {
    generatedAt: now,
    primaryArchetype,
    secondaryArchetypes,
    customerModel,
    revenueModel,
    deliveryModel,
    acquisitionModel,
    scaleMechanism,
    founderDependency,
    confidence,
    evidence,
  }
}
