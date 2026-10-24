/**
 * Monthly Review Engine™ — Phase 14.0
 * ---------------------------------------------------------------------------
 * Aggregates weekly reviews and business context into a MonthlyReview.
 * Pure function — no side effects.
 */

import type { MonthlyReview, WeeklyReview, HarmonyScore } from "./types"

function uid(): string {
  return `mr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

function scoreBand(v: number): HarmonyScore["band"] {
  if (v >= 85) return "flourishing"
  if (v >= 70) return "thriving"
  if (v >= 55) return "stable"
  if (v >= 35) return "developing"
  return "critical"
}

function buildCherryBlossomLetter(
  name: string,
  score: number,
  milestones: string[],
  patterns: string[],
): string {
  const band = scoreBand(score)
  return `Dear ${name},

A month has passed — and I have been watching.

${band === "flourishing" || band === "thriving"
  ? `This month showed what is possible when a founder commits to their operating rhythm. You were consistent, intentional, and present.`
  : band === "stable"
  ? `This month was steady. Steady is the secret ingredient most founders underestimate. You are building something durable.`
  : `This month held challenges — but every month of data makes the next month sharper. You are learning what this season of your business requires.`}

${milestones[0] ? `Your defining moment: ${milestones[0]}` : ""}

${patterns[0] ? `The pattern I noticed: ${patterns[0]}` : ""}

The best thing you can do going into next month is to begin it the same way you begin every week: with intention.

With deep belief in your journey,
Cherry Blossom`
}

export function generateMonthlyReview(weeklyReviews: WeeklyReview[]): MonthlyReview {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getInstallationProfile } = require("@/lib/installation/installation-store")
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getBusinessContext } = require("@/lib/business-context/business-context-store")

  const profile = getInstallationProfile()
  const bc = getBusinessContext()
  const name = profile?.founderProfile?.firstName ?? "Founder"

  const scores = weeklyReviews.map((w) => w.harmonyScore.value)
  const avgScore = avg(scores)
  const prevAvg = avgScore - (weeklyReviews[0]?.harmonyScore.delta ?? 0)
  const delta = avgScore - prevAvg
  const trend: HarmonyScore["trend"] = delta > 3 ? "up" : delta < -3 ? "down" : "flat"
  const band = scoreBand(avgScore)

  const harmonyScore: HarmonyScore = {
    value: avgScore,
    trend,
    delta,
    band,
    rationale: `Average of ${weeklyReviews.length} weekly review${weeklyReviews.length > 1 ? "s" : ""} this month.`,
  }

  const rhythmScore = avg(weeklyReviews.map((w) => w.ceoWorkdayScore))
  const tfAvg = avg(weeklyReviews.map((w) => w.timeFreedomScore))

  const milestones: string[] = []
  if (weeklyReviews.some((w) => w.harmonyScore.band === "flourishing")) {
    milestones.push("Achieved a Flourishing™ Harmony Score week.")
  }
  if (tfAvg >= 80) milestones.push("Time Freedom™ consistently protected across the month.")
  if (rhythmScore >= 75) milestones.push("CEO Workday™ adherence exceeded 75% — a strong operating month.")
  const allWins = weeklyReviews.flatMap((w) => w.wins)
  if (allWins[0]) milestones.push(allWins[0])
  while (milestones.length < 3) milestones.push("Sustained consistent operating rhythm.")

  const patterns: string[] = []
  if (weeklyReviews.filter((w) => w.timeFreedomScore < 60).length > 1) {
    patterns.push("Time Freedom™ boundaries faced repeated pressure — protection ritual needs reinforcement.")
  } else {
    patterns.push("Operating schedule held consistent — your rhythm is stabilising.")
  }
  const allInsights = weeklyReviews.flatMap((w) => w.insights)
  if (allInsights[0]) patterns.push(allInsights[0])
  if (patterns.length < 3) patterns.push("GPS recommendations are building a personalised operating profile.")

  const industry = bc?.industry ?? "your industry"

  const businessGrowthSummary = `This month, you operated inside ${industry} with a CEO Workday™ adherence of ${rhythmScore}%. ${rhythmScore >= 70 ? "Your contained workday is becoming a competitive advantage." : "There is real opportunity to reclaim more focused execution time next month."}`

  const personalGrowthSummary = `Your Time Freedom™ score averaged ${tfAvg}/100 this month. ${tfAvg >= 70 ? "Your personal life is being genuinely protected by your operating system." : "The boundary between work and life deserves more attention next month."}`

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

  const metrics = [
    { id: "monthly-harmony", label: "Monthly Harmony Score", value: avgScore, unit: "/ 100", trend, icon: "Star" },
    { id: "tf-avg", label: "Avg Time Freedom™ Score", value: tfAvg, unit: "/ 100", icon: "Leaf" },
    { id: "rhythm", label: "CEO Workday™ Adherence", value: rhythmScore, unit: "/ 100", icon: "Briefcase" },
    { id: "weeks", label: "Weeks Reviewed", value: weeklyReviews.length, icon: "Calendar" },
  ]

  const cherryBlossomLetter = buildCherryBlossomLetter(name, avgScore, milestones, patterns)

  return {
    id: uid(),
    period: {
      type: "monthly",
      startDate: monthStart,
      endDate: monthEnd,
      label: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      generatedAt: new Date().toISOString(),
    },
    harmonyScore,
    businessGrowthSummary,
    personalGrowthSummary,
    rhythmConsistencyScore: rhythmScore,
    milestones: milestones.slice(0, 3),
    patterns: patterns.slice(0, 3),
    cherryBlossomLetter,
    metrics,
    weeklyReviewIds: weeklyReviews.map((w) => w.id),
  }
}
