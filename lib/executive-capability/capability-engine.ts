/**
 * Executive Capability Intelligence™ — Capability Engine (Phase 10.4)
 * ---------------------------------------------------------------------------
 * Pure reasoning functions that detect knowledge gaps, resolve the right
 * briefing for a given GPS recommendation, and derive the founder's current
 * Capability Profile from localStorage.
 *
 * This file has NO "use client" directive — it may be imported from both
 * server and client contexts. localStorage calls are isolated to the memory
 * store module.
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { GpsRecommendationCard } from "@/lib/founder-gps/engine"
import type {
  CapabilityDimensionId,
  CapabilityProfile,
  ExecutiveBriefingTopicId,
} from "@/lib/executive-capability/types"
import { BRIEFING_TOPIC_META } from "@/lib/executive-capability/briefing-registry"
import type { CommunicationLevel } from "@/lib/founder-learning/types"

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_LEVEL: CommunicationLevel = "foundation"

// ─── Capability Dimensions ───────────────────────────────────────────────────

export const CAPABILITY_DIMENSIONS = [
  {
    id: "strategic-thinking" as CapabilityDimensionId,
    label: "Strategic Thinking",
    executiveOwner: "strategy",
    briefingTopics: ["pricing", "exit-planning", "capital-strategy", "recurring-revenue"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "financial-capability" as CapabilityDimensionId,
    label: "Financial Capability",
    executiveOwner: "finance",
    briefingTopics: ["business-credit", "cash-flow", "profit-margins", "business-banking", "capital-strategy", "wealth-building"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "marketing-capability" as CapabilityDimensionId,
    label: "Marketing Capability",
    executiveOwner: "marketing-brand",
    briefingTopics: ["pricing", "customer-lifetime-value", "recurring-revenue"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "operational-excellence" as CapabilityDimensionId,
    label: "Operational Excellence",
    executiveOwner: "operations",
    briefingTopics: ["delegation", "sops", "operating-rules", "ai-delegation"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "leadership" as CapabilityDimensionId,
    label: "Leadership",
    executiveOwner: "people-culture",
    briefingTopics: ["hiring", "delegation", "operating-rules"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "decision-making" as CapabilityDimensionId,
    label: "Decision-Making",
    executiveOwner: "strategy",
    briefingTopics: ["capital-strategy", "exit-planning", "pricing", "hiring"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "ai-leverage" as CapabilityDimensionId,
    label: "AI Leverage",
    executiveOwner: "innovation",
    briefingTopics: ["ai-delegation", "sops"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "customer-experience" as CapabilityDimensionId,
    label: "Customer Experience",
    executiveOwner: "client-success",
    briefingTopics: ["customer-lifetime-value", "recurring-revenue", "operating-rules"] as ExecutiveBriefingTopicId[],
  },
  {
    id: "business-asset-thinking" as CapabilityDimensionId,
    label: "Business Asset Thinking",
    executiveOwner: "growth",
    briefingTopics: ["recurring-revenue", "exit-planning", "wealth-building", "sops"] as ExecutiveBriefingTopicId[],
  },
]

// ─── Gap Detection ────────────────────────────────────────────────────────────

/**
 * Maps context signals to the highest-priority knowledge gap.
 * Returns null if no gap is detectable or all gaps are already mastered.
 */
export function detectCapabilityGap(
  agg: HarmonyContextAggregate,
  masteredTopics: ExecutiveBriefingTopicId[] = [],
): ExecutiveBriefingTopicId | null {
  const candidates: Array<{ topic: ExecutiveBriefingTopicId; priority: number }> = []

  function add(topic: ExecutiveBriefingTopicId, priority: number) {
    if (!masteredTopics.includes(topic)) {
      candidates.push({ topic, priority })
    }
  }

  // Financial gaps
  if (agg.businessCredit === "no-credit" || agg.businessCredit === null) {
    add("business-credit", 95)
  }
  if (agg.capitalStrategy.length === 0 || agg.capitalStrategy.includes("bootstrapped")) {
    add("cash-flow", 80)
  }
  if (agg.wealthBuildingInterests.length > 0) {
    add("wealth-building", 75)
  }
  if (agg.capitalStrategy.includes("angel") || agg.capitalStrategy.includes("venture") || agg.capitalStrategy.includes("sba-loan")) {
    add("capital-strategy", 85)
  }

  // Opportunity gaps
  if (agg.biggestOpportunities.includes("business-credit")) add("business-credit", 90)
  if (agg.biggestOpportunities.includes("systems-sops")) add("sops", 80)
  if (agg.biggestOpportunities.includes("delegation")) add("delegation", 78)
  if (agg.biggestOpportunities.includes("hiring")) add("hiring", 72)
  if (agg.biggestOpportunities.includes("ai-implementation")) add("ai-delegation", 70)
  if (agg.biggestOpportunities.includes("pricing")) add("pricing", 82)
  if (agg.biggestOpportunities.includes("recurring-revenue")) add("recurring-revenue", 85)
  if (agg.biggestOpportunities.includes("scaling")) add("exit-planning", 65)
  if (agg.biggestOpportunities.includes("strategic-partnerships")) add("capital-strategy", 60)
  if (agg.biggestOpportunities.includes("wealth-building")) add("wealth-building", 75)

  // Challenge gaps
  if (agg.biggestChallenges.includes("cash-flow")) add("cash-flow", 90)
  if (agg.biggestChallenges.includes("team")) add("hiring", 78)
  if (agg.biggestChallenges.includes("tech-systems")) add("sops", 82)

  // Revenue stage gaps
  if (agg.revenueStage === "pre-revenue") {
    add("pricing", 70)
    add("recurring-revenue", 65)
  }

  // Friction gaps
  if (agg.executionFriction) {
    add("operating-rules", 60)
    add("delegation", 58)
  }

  // Learning interest gaps
  const interestMap: Partial<Record<string, ExecutiveBriefingTopicId>> = {
    "Business Credit & Funding": "business-credit",
    "Business Banking & Financial Systems": "business-banking",
    "Wealth Building & Investing": "wealth-building",
    "Capital Strategy & Raising Funds": "capital-strategy",
    "Sales Systems & Revenue Generation": "recurring-revenue",
    "Pricing Strategy": "pricing",
    "Exit Planning & Business Valuation": "exit-planning",
    "AI Integration & Automation": "ai-delegation",
    "Operations & Systems": "sops",
    "Leadership & Team Building": "hiring",
  }
  for (const interest of agg.learningInterests) {
    const mapped = interestMap[interest]
    if (mapped) add(mapped, 55)
  }

  if (candidates.length === 0) return null

  // Return highest priority
  candidates.sort((a, b) => b.priority - a.priority)
  return candidates[0].topic
}

// ─── GPS Recommendation Mapping ──────────────────────────────────────────────

/**
 * Maps a GPS recommendation card to the most relevant briefing topic.
 * Returns null if no clear mapping exists.
 */
export function getBriefingForRecommendation(
  card: Pick<GpsRecommendationCard, "id" | "primaryOutcome">,
  agg: HarmonyContextAggregate,
  masteredTopics: ExecutiveBriefingTopicId[] = [],
): ExecutiveBriefingTopicId | null {
  const id = card.id.toLowerCase()

  const candidatesByPattern: Array<[RegExp | string, ExecutiveBriefingTopicId]> = [
    ["credit", "business-credit"],
    ["banking", "business-banking"],
    ["cash-flow", "cash-flow"],
    ["profit", "profit-margins"],
    ["wealth", "wealth-building"],
    ["capital", "capital-strategy"],
    ["exit", "exit-planning"],
    ["recurring", "recurring-revenue"],
    ["pricing", "pricing"],
    ["clv", "customer-lifetime-value"],
    ["ltv", "customer-lifetime-value"],
    ["sop", "sops"],
    ["delegation", "delegation"],
    ["delegat", "delegation"],
    ["hire", "hiring"],
    ["hiring", "hiring"],
    ["ai-", "ai-delegation"],
    ["automat", "ai-delegation"],
    ["operating-rule", "operating-rules"],
  ]

  for (const [pattern, topic] of candidatesByPattern) {
    const matches = typeof pattern === "string" ? id.includes(pattern) : pattern.test(id)
    if (matches && !masteredTopics.includes(topic)) return topic
  }

  // Fall back to context-based gap detection
  return detectCapabilityGap(agg, masteredTopics)
}

// ─── Communication Level Resolution ─────────────────────────────────────────

export function resolveCommunicationLevel(
  agg: HarmonyContextAggregate,
): CommunicationLevel {
  if (!agg.communicationLevel) return DEFAULT_LEVEL
  const valid: CommunicationLevel[] = [
    "foundation",
    "developing",
    "professional",
    "executive",
    "executive-mba",
  ]
  return valid.includes(agg.communicationLevel as CommunicationLevel)
    ? (agg.communicationLevel as CommunicationLevel)
    : DEFAULT_LEVEL
}

// ─── Derive Trigger Context ───────────────────────────────────────────────────

export function deriveTriggerContext(
  topicId: ExecutiveBriefingTopicId,
  agg: HarmonyContextAggregate,
): string {
  const meta = BRIEFING_TOPIC_META.find((m) => m.id === topicId)
  const topicTitle = meta?.title ?? topicId.replace(/-/g, " ")

  if (agg.biggestOpportunities.some((o) => o.includes(topicId.split("-")[0]))) {
    return `${topicTitle} is one of your declared growth opportunities.`
  }
  if (agg.learningInterests.some((i) => i.toLowerCase().includes(topicTitle.toLowerCase().split(" ")[0]))) {
    return `You expressed interest in ${topicTitle} during your Business Context™ setup.`
  }
  if (topicId === "business-credit" && (agg.businessCredit === "no-credit" || agg.businessCredit === null)) {
    return "Your Business Context™ shows business credit has not yet been established."
  }
  if (topicId === "cash-flow" && agg.biggestChallenges.includes("cash-flow")) {
    return "Cash flow is one of your declared biggest challenges."
  }
  return `Your GPS route identified ${topicTitle} as your most relevant capability gap right now.`
}

// ─── Capability Profile Derivation ───────────────────────────────────────────

/**
 * Derives a capability profile from a stored profile.
 * Returns a default profile when no data exists.
 */
export function deriveCapabilityProfile(
  storedProfile: CapabilityProfile | null,
): CapabilityProfile {
  if (!storedProfile) {
    return {
      dimensions: Object.fromEntries(
        CAPABILITY_DIMENSIONS.map((d) => [d.id, 0]),
      ) as Record<CapabilityDimensionId, number>,
      topicsMastered: [],
      topicsInProgress: [],
      topicsDeferred: [],
      topicsSkipped: [],
      completedBriefingIds: [],
      lastUpdated: new Date().toISOString(),
    }
  }
  return storedProfile
}

// ─── Show Guard ───────────────────────────────────────────────────────────────

/**
 * Returns true if a briefing should be shown to the founder right now.
 * Prevents showing a briefing that was mastered or shown very recently.
 */
export function shouldShowBriefingToday(
  topicId: ExecutiveBriefingTopicId,
  masteredTopics: ExecutiveBriefingTopicId[],
  completedBriefingIds: string[],
  level: CommunicationLevel,
): boolean {
  if (masteredTopics.includes(topicId)) return false
  const briefingId = `${topicId}:${level}`
  // Don't show same topic+level twice unless significant time has passed
  // We use a simple heuristic: if it's been completed at this level before, skip
  if (completedBriefingIds.includes(briefingId)) return false
  return true
}
