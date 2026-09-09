/**
 * Weekly Review Engine™ — Phase 14.0
 * ---------------------------------------------------------------------------
 * Pure function. Reads from localStorage stores and synthesizes a
 * WeeklyReview. No API calls, no side effects.
 */

import type { WeeklyReview, HarmonyScore, ReviewMetric } from "./types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { AdaptationHistoryEntry } from "@/lib/adaptive-workspace/types"
import type { InstallationProfile } from "@/lib/installation/types"

function uid(): string {
  return `wr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoNDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function formatDateLabel(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/** Score band from raw 0–100 value. */
function scoreBand(v: number): HarmonyScore["band"] {
  if (v >= 85) return "flourishing"
  if (v >= 70) return "thriving"
  if (v >= 55) return "stable"
  if (v >= 35) return "developing"
  return "critical"
}

/** Derive a 0–100 Harmony Score from GPS + adaptation data. */
function deriveHarmonyScore(
  gpsEntries: RecommendationHistoryEntry[],
  adaptEntries: AdaptationHistoryEntry[],
  prevScore: number,
): HarmonyScore {
  const total = gpsEntries.length
  if (total === 0) {
    const value = 50
    return { value, trend: "flat", delta: 0, band: scoreBand(value), rationale: "No activity recorded this week." }
  }

  const completed = gpsEntries.filter((e) => e.outcome === "completed").length
  const accepted = gpsEntries.filter((e) => e.outcome === "accepted").length
  const adaptations = adaptEntries.length

  // Weighted: completions 60%, acceptances 30%, adaptations 10%
  const completionRate = total > 0 ? completed / total : 0
  const acceptanceRate = total > 0 ? (completed + accepted) / total : 0
  const adaptBonus = Math.min(10, adaptations * 2)

  const raw = completionRate * 60 + acceptanceRate * 30 + adaptBonus
  const value = Math.round(Math.min(100, Math.max(0, raw)))
  const delta = value - prevScore
  const trend: HarmonyScore["trend"] = delta > 3 ? "up" : delta < -3 ? "down" : "flat"
  const band = scoreBand(value)

  const rationale =
    band === "flourishing"
      ? "Exceptional operating rhythm — you are building strong momentum."
      : band === "thriving"
      ? "Strong week with consistent execution. Keep protecting your CEO Workdays."
      : band === "stable"
      ? "Solid foundation. Small, consistent improvements will compound quickly."
      : band === "developing"
      ? "Progress is happening. Focus on one operating habit to strengthen this week."
      : "Your system needs attention. Let Cherry Blossom help you reset with compassion."

  return { value, trend, delta, band, rationale }
}

function deriveTimeFreedomScore(gpsEntries: RecommendationHistoryEntry[]): number {
  const weekend = gpsEntries.filter((e) => {
    const d = new Date(e.date + "T12:00:00").getDay()
    return d === 0 || d === 5 || d === 6
  })
  if (weekend.length === 0) return 85 // No weekend activity data = protected by default
  const violations = weekend.filter((e) => e.outcome === "accepted" || e.outcome === "completed").length
  return Math.max(0, Math.round(100 - violations * 15))
}

function deriveCeoWorkdayScore(gpsEntries: RecommendationHistoryEntry[]): number {
  const weekday = gpsEntries.filter((e) => {
    const d = new Date(e.date + "T12:00:00").getDay()
    return d >= 1 && d <= 4
  })
  if (weekday.length === 0) return 50
  const completed = weekday.filter((e) => e.outcome === "completed").length
  return Math.round(Math.min(100, (completed / weekday.length) * 100))
}

function deriveWins(
  gpsEntries: RecommendationHistoryEntry[],
  profile: InstallationProfile | null,
): string[] {
  const wins: string[] = []

  // Wins from GPS completions
  const completions = gpsEntries.filter((e) => e.outcome === "completed")
  for (const c of completions.slice(0, 2)) {
    wins.push(`Completed: ${c.recommendationTitle}`)
  }

  // Win from profile context
  if (profile?.founderProfile?.firstName) {
    wins.push(
      completions.length > 0
        ? `${profile.founderProfile.firstName} executed ${completions.length} GPS recommendation${completions.length > 1 ? "s" : ""} this week.`
        : `${profile.founderProfile.firstName} stayed intentional with their operating rhythm.`,
    )
  } else if (gpsEntries.length > 0) {
    wins.push(`${gpsEntries.length} operating touchpoint${gpsEntries.length > 1 ? "s" : ""} recorded this week.`)
  }

  if (wins.length === 0) wins.push("You showed up this week. That is the foundation.")
  return wins.slice(0, 3)
}

function deriveInsights(
  gpsEntries: RecommendationHistoryEntry[],
  adaptEntries: AdaptationHistoryEntry[],
): string[] {
  const insights: string[] = []

  const skipReasons = gpsEntries.filter((e) => e.skipReason).map((e) => e.skipReason!)
  if (skipReasons.includes("low-energy")) {
    insights.push("Energy was a limiting factor this week — consider adjusting your most demanding CEO blocks to your peak energy window.")
  }
  if (skipReasons.includes("not-enough-time")) {
    insights.push("Time constraints surfaced this week — your schedule may need more protection for deep work.")
  }
  if (adaptEntries.length > 0) {
    insights.push(`Your Adaptive Workspace™ made ${adaptEntries.length} adjustment${adaptEntries.length > 1 ? "s" : ""} — your system is learning what works.`)
  }

  const completed = gpsEntries.filter((e) => e.outcome === "completed")
  if (completed.length >= 3) {
    insights.push("Three or more completions this week signals a growing operating rhythm.")
  }

  if (insights.length === 0) {
    insights.push("Your operating data is building. More insights will emerge as your Harmony Week™ history grows.")
  }

  return insights.slice(0, 3)
}

function buildCherryBlossomLetter(
  review: Omit<WeeklyReview, "cherryBlossomLetter" | "id">,
  profile: InstallationProfile | null,
): string {
  const name = profile?.founderProfile?.firstName ?? "Founder"
  const { harmonyScore, wins, timeFreedomScore } = review
  const tfProtected = timeFreedomScore >= 70

  return `Dear ${name},

${harmonyScore.band === "flourishing" || harmonyScore.band === "thriving"
  ? `This was a week worth celebrating. You moved through your Harmony Week™ with ${harmonyScore.band === "flourishing" ? "exceptional" : "real"} intention — and it shows in your score.`
  : harmonyScore.band === "stable"
  ? `You held your ground this week. In a world that constantly pulls founders off course, staying consistent is its own kind of win.`
  : `This week was challenging — and I want you to know that I see how much effort you brought even when it felt hard.`}

${wins[0] ? `Your most meaningful moment: ${wins[0]}` : ""}

${tfProtected
  ? "Your Time Freedom™ was protected this week. That boundary is the source of your best work."
  : "Time Freedom™ took some pressure this week. Next week, let us reclaim one full day together."}

Carry this week's lessons into the next. I am with you.

With care,
Cherry Blossom`
}

function buildMetrics(
  gpsEntries: RecommendationHistoryEntry[],
  timeFreedomScore: number,
  ceoWorkdayScore: number,
): ReviewMetric[] {
  const completed = gpsEntries.filter((e) => e.outcome === "completed").length
  const total = gpsEntries.length

  return [
    {
      id: "gps-completions",
      label: "GPS Completions",
      value: completed,
      unit: `/ ${total}`,
      trend: completed >= 3 ? "up" : completed === 0 ? "down" : "flat",
      icon: "CheckCircle",
    },
    {
      id: "time-freedom-score",
      label: "Time Freedom™ Score",
      value: timeFreedomScore,
      unit: "/ 100",
      trend: timeFreedomScore >= 70 ? "up" : timeFreedomScore < 50 ? "down" : "flat",
      icon: "Leaf",
    },
    {
      id: "ceo-workday-score",
      label: "CEO Workday™ Adherence",
      value: ceoWorkdayScore,
      unit: "/ 100",
      trend: ceoWorkdayScore >= 70 ? "up" : ceoWorkdayScore < 50 ? "down" : "flat",
      icon: "Briefcase",
    },
    {
      id: "operating-touchpoints",
      label: "Operating Touchpoints",
      value: total,
      icon: "Activity",
    },
  ]
}

/**
 * Generates a WeeklyReview from existing localStorage data.
 * Call client-side only (reads localStorage).
 */
export function generateWeeklyReview(prevScore = 65): WeeklyReview {
  // Lazy-require so this module is SSR-safe at import time
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getRecommendationHistory } = require("@/lib/founder-gps/history/recommendation-history-store")
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAdaptationHistory } = require("@/lib/adaptive-workspace/adaptation-store")
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getInstallationProfile } = require("@/lib/installation/installation-store")

  const allGps: RecommendationHistoryEntry[] = getRecommendationHistory()
  const allAdapt: AdaptationHistoryEntry[] = getAdaptationHistory()
  const profile: InstallationProfile | null = getInstallationProfile()

  const weekStart = isoNDaysAgo(6)
  const weekEnd = isoToday()

  const gpsEntries = allGps.filter((e) => e.date >= weekStart && e.date <= weekEnd)
  const adaptEntries = allAdapt.filter((e) => e.timestamp >= weekStart)

  const harmonyScore = deriveHarmonyScore(gpsEntries, adaptEntries, prevScore)
  const timeFreedomScore = deriveTimeFreedomScore(gpsEntries)
  const ceoWorkdayScore = deriveCeoWorkdayScore(gpsEntries)
  const wins = deriveWins(gpsEntries, profile)
  const insights = deriveInsights(gpsEntries, adaptEntries)
  const metrics = buildMetrics(gpsEntries, timeFreedomScore, ceoWorkdayScore)

  const topOpportunity =
    ceoWorkdayScore < 60
      ? "Protect at least two full CEO Workday™ blocks next week — schedule them now."
      : "Build on this week's momentum by tackling your highest-leverage business priority first on Monday."

  const topRisk =
    timeFreedomScore < 60
      ? "Weekend boundaries are eroding. Block your Power Down time in your calendar before Friday."
      : insights.find((i) => i.includes("energy"))
      ? "Energy management — align your hardest tasks to your peak focus window."
      : "Scope creep — resist adding to your plate mid-week without trading something out."

  const reviewBase = {
    period: {
      type: "weekly" as const,
      startDate: weekStart,
      endDate: weekEnd,
      label: `Week of ${formatDateLabel(weekStart)}`,
      generatedAt: new Date().toISOString(),
    },
    harmonyScore,
    wins,
    insights,
    topOpportunity,
    topRisk,
    metrics,
    timeFreedomScore,
    ceoWorkdayScore,
  }

  const cherryBlossomLetter = buildCherryBlossomLetter(reviewBase, profile)

  return { id: uid(), ...reviewBase, cherryBlossomLetter }
}
