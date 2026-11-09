/**
 * Quarterly Review Engine™ — Phase 14.0
 * ---------------------------------------------------------------------------
 * Aggregates monthly reviews into a QuarterlyReview.
 * Pure function — no side effects.
 */

import type { QuarterlyReview, MonthlyReview, HarmonyScore } from "./types"

function uid(): string {
  return `qr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
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

function quarterLabel(date: Date): string {
  const q = Math.floor(date.getMonth() / 3) + 1
  return `Q${q} ${date.getFullYear()}`
}

function buildCherryBlossomLetter(
  name: string,
  score: number,
  definingMoments: string[],
  recommendations: string[],
): string {
  const band = scoreBand(score)
  return `Dear ${name},

A quarter has passed. Three months of operating data, of choosing your rhythm over chaos, of protecting what matters most.

${band === "flourishing" || band === "thriving"
  ? `This quarter, you proved that a founder can build a thriving business while genuinely living. That proof is rare — and it is yours.`
  : band === "stable"
  ? `This quarter built a foundation. Stability is the precursor to everything that comes next. You are more ready than you think.`
  : `This quarter showed you where your operating system needs strengthening. That clarity is a gift. You now know exactly where to focus.`}

${definingMoments[0] ? `Your defining moment: ${definingMoments[0]}` : ""}

My recommendation for next quarter: ${recommendations[0] ?? "Deepen your Time Freedom™ protection — it is the source of everything."}

You are doing the work that matters most.

With unwavering belief,
Cherry Blossom`
}

export function generateQuarterlyReview(monthlyReviews: MonthlyReview[]): QuarterlyReview {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getInstallationProfile } = require("@/lib/installation/installation-store")

  const profile = getInstallationProfile()
  const name = profile?.founderProfile?.firstName ?? "Founder"

  const scores = monthlyReviews.map((m) => m.harmonyScore.value)
  const avgScore = avg(scores)
  const prevAvg = scores.length > 1 ? scores[0] : avgScore
  const delta = avgScore - prevAvg
  const trend: HarmonyScore["trend"] = delta > 3 ? "up" : delta < -3 ? "down" : "flat"
  const band = scoreBand(avgScore)

  const harmonyScore: HarmonyScore = {
    value: avgScore,
    trend,
    delta,
    band,
    rationale: `Aggregate across ${monthlyReviews.length} monthly review${monthlyReviews.length > 1 ? "s" : ""}.`,
  }

  const tfAvg = avg(monthlyReviews.map((m) => {
    const m2 = m.metrics.find(met => met.id === "tf-avg")
    return typeof m2?.value === "number" ? m2.value : 70
  }))
  const rhythmAvg = avg(monthlyReviews.map((m) => m.rhythmConsistencyScore))

  const definingMoments: string[] = []
  const bestMonth = monthlyReviews.reduce(
    (best, m) => (m.harmonyScore.value > (best?.harmonyScore.value ?? 0) ? m : best),
    monthlyReviews[0],
  )
  if (bestMonth) {
    definingMoments.push(`Strongest month: ${bestMonth.period.label} with a ${bestMonth.harmonyScore.value}/100 Harmony Score.`)
  }
  const allMilestones = monthlyReviews.flatMap((m) => m.milestones)
  if (allMilestones[0]) definingMoments.push(allMilestones[0])
  if (definingMoments.length < 3) definingMoments.push(`Completed ${monthlyReviews.length} full monthly executive review${monthlyReviews.length > 1 ? "s" : ""}.`)

  const executiveRecommendations: string[] = []
  if (rhythmAvg < 70) {
    executiveRecommendations.push("Rebuild your CEO Workday™ scheduling habit — block time before the week begins.")
  } else {
    executiveRecommendations.push("Extend your CEO Workday™ depth — consider adding a Thursday Finish Strong session.")
  }
  if (tfAvg < 70) {
    executiveRecommendations.push("Time Freedom™ needs active protection — install your Power Down ritual in your calendar.")
  } else {
    executiveRecommendations.push("Your Time Freedom™ is a strength — celebrate and reinforce this pattern next quarter.")
  }
  executiveRecommendations.push("Run your Sunday Design Day™ every week without exception — it is the keystone of your operating system.")

  const now = new Date()
  const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
  const qEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0)

  const strategicNarrative = `In ${quarterLabel(now)}, your Harmony Score averaged ${avgScore}/100 across ${monthlyReviews.length} month${monthlyReviews.length > 1 ? "s" : ""}. Your CEO Workday™ adherence was ${rhythmAvg}% and your Time Freedom™ averaged ${tfAvg}/100. ${band === "thriving" || band === "flourishing" ? "This is the trajectory of a founder building a business that supports their life — not the other way around." : "The operating data is building. Each quarter of consistency compounds into a fundamentally different kind of business."}`

  const metrics = [
    { id: "q-harmony", label: "Quarterly Harmony Score", value: avgScore, unit: "/ 100", trend, icon: "Star" },
    { id: "q-tf", label: "Avg Time Freedom™ Score", value: tfAvg, unit: "/ 100", icon: "Leaf" },
    { id: "q-rhythm", label: "CEO Workday™ Adherence", value: rhythmAvg, unit: "%", icon: "Briefcase" },
    { id: "q-months", label: "Months Reviewed", value: monthlyReviews.length, icon: "Calendar" },
  ]

  const cherryBlossomLetter = buildCherryBlossomLetter(name, avgScore, definingMoments, executiveRecommendations)

  return {
    id: uid(),
    period: {
      type: "quarterly",
      startDate: qStart.toISOString().slice(0, 10),
      endDate: qEnd.toISOString().slice(0, 10),
      label: quarterLabel(now),
      generatedAt: new Date().toISOString(),
    },
    harmonyScore,
    strategicNarrative,
    definingMoments: definingMoments.slice(0, 3),
    executiveRecommendations: executiveRecommendations.slice(0, 3),
    cherryBlossomLetter,
    metrics,
    monthlyReviewIds: monthlyReviews.map((m) => m.id),
  }
}
