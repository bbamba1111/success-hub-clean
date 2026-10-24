/**
 * Founder Digital Twin™ — Foresight Engine (Phase 11.0)
 * ---------------------------------------------------------------------------
 * Derives ≤5 proactive ForesightSignals from the twin profile + aggregate.
 * Pure function. No I/O. Never alarmist — all signals framed as opportunity
 * or timing window.
 */

import type { ForesightSignal, FounderTwinProfile } from "@/lib/digital-twin/types"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"

function isoExpiry(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}

/* ===========================================================================
 * Signal generators
 * ======================================================================== */

function sopReadinessSignal(twin: FounderTwinProfile): ForesightSignal | null {
  const hasDeferredOps = twin.deferredTopics.some((t) => t.includes("operations") || t.includes("delegation") || t.includes("sop"))
  const needsDelegation = !twin.masteredTopics.some((t) => t.includes("delegation") || t.includes("operations"))
  const hasGrowingTeam = twin.teamSize && twin.teamSize !== "solo" && twin.teamSize !== "1-2"
  if (!needsDelegation || !hasGrowingTeam) return null
  return {
    id: "sop-readiness",
    type: "readiness-gap",
    title: "SOP readiness before next hire",
    description: "Your team size indicates delegation is active or imminent. Documented SOPs are the foundation that makes every hire more effective and reduces onboarding risk.",
    evidenceBasis: `Team size signal (${twin.teamSize}) and executive capability history.`,
    suggestedAction: hasDeferredOps
      ? "Consider completing an Operations Briefing to build your SOP foundation before the next hire."
      : "Building an SOP library for your top 3 recurring tasks would materially reduce your onboarding burden.",
    confidence: 72,
    expiresAt: isoExpiry(30),
  }
}

function assetPackagingSignal(twin: FounderTwinProfile): ForesightSignal | null {
  const hasCompletions = twin.completionRate90d > 50
  const hasCapability = twin.masteredTopics.length >= 3
  const alreadyFocused = twin.masteredTopics.some((t) => t.includes("asset") || t.includes("content"))
  if (!hasCompletions || !hasCapability || alreadyFocused) return null
  return {
    id: "asset-packaging-timing",
    type: "timing-window",
    title: "Asset packaging timing window",
    description: `Your ${twin.completionRate90d}% completion rate and ${twin.masteredTopics.length} mastered capability topics suggest you are producing work that could be packaged into reusable business assets.`,
    evidenceBasis: "GPS completion rate and capability memory.",
    suggestedAction: "Identify your top 2–3 most-repeated work products and explore packaging them as Business Assets™.",
    confidence: 65,
    expiresAt: isoExpiry(45),
  }
}

function ceoDayProtectionSignal(twin: FounderTwinProfile): ForesightSignal | null {
  const isScaling = twin.teamSize && (twin.teamSize.includes("3") || twin.teamSize.includes("5") || twin.teamSize.includes("10"))
  const hasHighSkip = twin.skipRate90d > 35
  if (!isScaling && !hasHighSkip) return null
  return {
    id: "ceo-workday-protection",
    type: "opportunity",
    title: "CEO Workday™ protection opportunity",
    description: twin.skipRate90d > 35
      ? `A ${twin.skipRate90d}% skip rate over 90 days suggests your available capacity may be under pressure. A defined CEO Workday™ protocol creates structural protection.`
      : "As your team grows, protecting CEO Workday™ time becomes increasingly important to maintain strategic output.",
    evidenceBasis: twin.skipRate90d > 35 ? "90-day GPS skip rate." : "Team size and business stage signal.",
    suggestedAction: "Define and document your CEO Workday™ rules — what time is protected, what never gets scheduled, and what is non-negotiable.",
    confidence: 78,
    expiresAt: null,
  }
}

function premiumPricingSignal(twin: FounderTwinProfile, agg: HarmonyContextAggregate): ForesightSignal | null {
  const hasCapability = twin.masteredTopics.length >= 5
  const hasRevenue = twin.revenueStage && (twin.revenueStage.includes("consistent") || twin.revenueStage.includes("growing"))
  const hasHighCompletion = twin.completionRate90d >= 60
  if (!hasCapability || !hasRevenue || !hasHighCompletion) return null
  return {
    id: "premium-pricing-signal",
    type: "opportunity",
    title: "Premium positioning window",
    description: `Your executive capability development (${twin.masteredTopics.length} topics mastered) and consistent completion rate suggest increasing readiness for a premium pricing move.`,
    evidenceBasis: "Capability memory, completion rate, and revenue stage.",
    suggestedAction: "Evaluate whether your current pricing reflects the value and capability you have built over the past 90 days.",
    confidence: 60,
    expiresAt: isoExpiry(60),
  }
}

function momentumReinvestmentSignal(twin: FounderTwinProfile): ForesightSignal | null {
  if (!twin.hasMomentum || twin.consecutiveCompletions < 3) return null
  return {
    id: "momentum-reinvestment",
    type: "timing-window",
    title: "Momentum reinvestment window",
    description: `You have ${twin.consecutiveCompletions} consecutive completions. This is an ideal window to direct that momentum toward a high-leverage strategic decision or asset-creation project.`,
    evidenceBasis: `${twin.consecutiveCompletions} consecutive GPS completions.`,
    suggestedAction: "Use this momentum to tackle one decision or project that would compound over the next 90 days.",
    confidence: 80,
    expiresAt: isoExpiry(14),
  }
}

function aiAdoptionSignal(twin: FounderTwinProfile): ForesightSignal | null {
  const hasAiCapability = twin.masteredTopics.some((t) => t.includes("ai"))
  const hasOperationsGap = !twin.masteredTopics.some((t) => t.includes("operations") || t.includes("automation"))
  if (hasAiCapability || !hasOperationsGap) return null
  if (twin.dataCompleteness < 40) return null
  return {
    id: "ai-adoption-gap",
    type: "readiness-gap",
    title: "AI leverage gap",
    description: "Your operating history shows no recorded AI capability development. Given current market conditions, building a foundational AI leverage practice is a high-value capability gap to close.",
    evidenceBasis: "Executive capability memory — no AI briefings completed.",
    suggestedAction: "Explore the AI Leverage Briefing to start building your AI operating foundation.",
    confidence: 68,
    expiresAt: isoExpiry(30),
  }
}

/* ===========================================================================
 * Main deriver
 * ======================================================================== */

export function deriveForesightSignals(
  twin: FounderTwinProfile,
  agg: HarmonyContextAggregate,
  _history: RecommendationHistoryEntry[],
): ForesightSignal[] {
  const candidates: (ForesightSignal | null)[] = [
    momentumReinvestmentSignal(twin),
    ceoDayProtectionSignal(twin),
    sopReadinessSignal(twin),
    assetPackagingSignal(twin),
    premiumPricingSignal(twin, agg),
    aiAdoptionSignal(twin),
  ]

  return candidates
    .filter((s): s is ForesightSignal => s !== null)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}
