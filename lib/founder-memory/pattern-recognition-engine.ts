/**
 * Founder Memory™ Pattern Recognition Engine — Phase 16.0
 * ---------------------------------------------------------------------------
 * Pure function — no React, no DOM, no side effects.
 * Derives FounderInsight[] from FounderMemory[] and GPS history.
 */

import type { FounderMemory, FounderInsight, InsightTrend } from "./types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreToTrend(delta: number): InsightTrend {
  if (delta > 2) return "up"
  if (delta < -2) return "down"
  return "flat"
}

function isoWeekNumber(dateStr: string): number {
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    )
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Derives a list of FounderInsight records from memory + GPS history.
 * Returns an empty array when insufficient data exists for any insight.
 */
export function deriveFounderInsights(
  memories: FounderMemory[],
  gpsHistory: RecommendationHistoryEntry[],
): FounderInsight[] {
  const insights: FounderInsight[] = []

  // ── 1. GPS Completion Rate ────────────────────────────────────────────────
  if (gpsHistory.length >= 3) {
    const total = gpsHistory.length
    const completed = gpsHistory.filter((h) => h.outcome === "completed").length
    const rate = Math.round((completed / total) * 100)
    const recentCompleted = gpsHistory.slice(-10).filter((h) => h.outcome === "completed").length
    const recentRate = Math.round((recentCompleted / Math.min(10, gpsHistory.length)) * 100)
    const trend = scoreToTrend(recentRate - rate)
    insights.push({
      id: "gps-completion-rate",
      label: "GPS Completion Rate",
      description: `You complete ${rate}% of Founder GPS™ recommendations. ${
        trend === "up" ? "Your recent consistency is trending upward." :
        trend === "down" ? "Recent sessions show a slight dip — consider a lighter approach." :
        "Your consistency is steady and reliable."
      }`,
      trend,
      dataPoints: total,
      icon: "Target",
    })
  }

  // ── 2. Operating Rhythm Consistency ──────────────────────────────────────
  const reviewMemories = memories.filter((m) => m.category === "review")
  if (reviewMemories.length >= 2) {
    const weekNumbers = reviewMemories.map((m) => isoWeekNumber(m.date))
    const uniqueWeeks = new Set(weekNumbers).size
    const span = weekNumbers.length > 0
      ? Math.max(...weekNumbers) - Math.min(...weekNumbers) + 1
      : 1
    const consistency = Math.round((uniqueWeeks / Math.max(span, 1)) * 100)
    insights.push({
      id: "review-consistency",
      label: "Review Consistency",
      description: `You have completed executive reviews in ${uniqueWeeks} of ${span} tracked week${span !== 1 ? "s" : ""} — ${consistency}% consistency. ${
        consistency >= 80 ? "Outstanding operating discipline." :
        consistency >= 50 ? "Good rhythm; a few gaps to close." :
        "Increasing review frequency will compound your clarity significantly."
      }`,
      trend: consistency >= 70 ? "up" : consistency >= 40 ? "flat" : "down",
      dataPoints: reviewMemories.length,
      icon: "BarChart2",
    })
  }

  // ── 3. Win Velocity ───────────────────────────────────────────────────────
  const winMemories = memories.filter((m) => m.category === "win")
  if (winMemories.length >= 3) {
    const recent7 = winMemories.filter((m) => {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 7)
      return new Date(m.date) >= cutoff
    }).length
    const prev7 = winMemories.filter((m) => {
      const cutoffEnd = new Date()
      cutoffEnd.setDate(cutoffEnd.getDate() - 7)
      const cutoffStart = new Date()
      cutoffStart.setDate(cutoffStart.getDate() - 14)
      const d = new Date(m.date)
      return d >= cutoffStart && d < cutoffEnd
    }).length
    const trend = scoreToTrend(recent7 - prev7)
    insights.push({
      id: "win-velocity",
      label: "Win Velocity",
      description: `${recent7} win${recent7 !== 1 ? "s" : ""} recorded in the last 7 days${
        prev7 > 0 ? ` vs ${prev7} the prior week` : ""
      }. ${
        trend === "up" ? "Momentum is building — keep this energy." :
        trend === "down" ? "A lighter week — protect your energy and recommit." :
        "Steady output. Consistency is the compound effect at work."
      }`,
      trend,
      dataPoints: winMemories.length,
      icon: "Zap",
    })
  }

  // ── 4. Harmony Score Trajectory ──────────────────────────────────────────
  const scoredMemories = memories
    .filter((m) => m.category === "review" && typeof m.harmonyScore === "number")
    .slice(0, 6)
  if (scoredMemories.length >= 2) {
    const scores = scoredMemories.map((m) => m.harmonyScore as number)
    const latest = scores[0]
    const oldest = scores[scores.length - 1]
    const delta = latest - oldest
    const trend = scoreToTrend(delta)
    insights.push({
      id: "harmony-score-trajectory",
      label: "Harmony Score™ Trajectory",
      description: `Your Harmony Score™ has ${
        delta > 0 ? `risen ${delta} points` :
        delta < 0 ? `shifted ${Math.abs(delta)} points lower` :
        "held steady"
      } across ${scoredMemories.length} reviews, currently at ${latest}/100. ${
        trend === "up" ? "The operating system is working." :
        trend === "down" ? "A recalibration conversation with Cherry Blossom™ may help." :
        "Stability here means your foundations are solid."
      }`,
      trend,
      dataPoints: scoredMemories.length,
      icon: "TrendingUp",
    })
  }

  // ── 5. Community Engagement ───────────────────────────────────────────────
  const communityMemories = memories.filter((m) => m.category === "community")
  if (communityMemories.length > 0) {
    insights.push({
      id: "community-engagement",
      label: "Community Engagement",
      description: `${communityMemories.length} community interaction${communityMemories.length !== 1 ? "s" : ""} recorded. ${
        communityMemories.length >= 8
          ? "You are deeply integrated into the Harmony Lane™ community — a strong signal for sustainable growth."
          : communityMemories.length >= 3
          ? "Good community rhythm. Live co-working is one of the highest-leverage actions in the platform."
          : "Your first few community touchpoints are recorded. The network effect compounds quickly."
      }`,
      trend: communityMemories.length >= 5 ? "up" : "flat",
      dataPoints: communityMemories.length,
      icon: "Users",
    })
  }

  return insights
}
