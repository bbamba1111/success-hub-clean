"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Target,
  RotateCcw,
  MessageCircleHeart,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react"
import {
  getOperatingCenterData,
  type OperatingCenterData,
} from "@/utils/reality-check-storage"
import { categoryLabel } from "@/utils/life-value-categories"

interface LifeValueScore {
  category: string
  percentage: number
  label?: string
}

function formatWeekLabel(weekKey: string): string {
  // weekKey is the Monday as YYYY-MM-DD; render as "Week of Mon D".
  const [y, m, d] = weekKey.split("-").map(Number)
  if (!y || !m || !d) return weekKey
  const date = new Date(y, m - 1, d)
  return `Week of ${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
}

function scoreRating(score: number): string {
  if (score >= 80) return "Thriving"
  if (score >= 65) return "Strong"
  if (score >= 50) return "Steady"
  if (score >= 35) return "Needs attention"
  return "Time to realign"
}

export function OperatingCenter() {
  const [data, setData] = useState<OperatingCenterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getOperatingCenterData()
      .then((d) => {
        if (active) setData(d)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E26C73]/25 border-t-[#E26C73]" />
      </div>
    )
  }

  const current = data?.current ?? null

  // Empty state — no Reality Check recorded yet.
  if (!current) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#7FB069]/15">
          <ClipboardCheck className="h-8 w-8 text-[#7FB069]" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-[#5A4A52] text-balance">
          Your Weekly Operating Center™ is ready
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-[#5A4A52]/75">
          Complete your first Weekly Reality Check™ and this dashboard will fill with your scores, your
          intention, and your progress over time.
        </p>
        <Link href="/audit" className="mt-8 inline-block">
          <Button
            size="lg"
            className="bg-[#E26C73] px-8 py-6 text-lg font-semibold text-white shadow-lg hover:bg-[#D55A60]"
          >
            Begin My Weekly Reality Check™
          </Button>
        </Link>
      </div>
    )
  }

  const memberName = data?.memberName?.trim().split(" ")[0] || "there"
  const overall = current.overall_score ?? 0
  const scores = (current.life_value_scores ?? []) as LifeValueScore[]
  const sorted = [...scores].sort((a, b) => b.percentage - a.percentage)
  const focusAreas = current.selected_priority_areas ?? []
  const declaration = current.operating_declaration
  const delta = data?.scoreDelta ?? null
  const completedDate = current.scored_at ?? current.completed_at

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      {/* Greeting */}
      <header className="mb-8">
        <p className="flex items-center gap-2 text-sm font-medium text-[#7FB069]">
          <CalendarDays className="h-4 w-4" />
          {formatWeekLabel(current.week_key)}
          {!data?.currentIsThisWeek && (
            <span className="rounded-full bg-[#E26C73]/10 px-2 py-0.5 text-xs text-[#E26C73]">
              Most recent
            </span>
          )}
        </p>
        <h1 className="mt-2 font-playfair text-3xl font-bold text-[#5A4A52] sm:text-4xl text-balance">
          Welcome back, {memberName}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overall score card */}
        <Card className="rounded-2xl border-[#E26C73]/15 bg-white shadow-sm lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-[#5A4A52]/60">
              Overall Reality Score
            </p>
            <div className="relative my-4 flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E26C73" strokeOpacity="0.12" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#E26C73"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overall / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-playfair text-4xl font-bold text-[#5A4A52]">{overall}%</span>
                <span className="text-xs font-medium text-[#5A4A52]/60">{scoreRating(overall)}</span>
              </div>
            </div>
            {delta !== null && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  delta > 0 ? "text-[#7FB069]" : delta < 0 ? "text-[#E26C73]" : "text-[#5A4A52]/60"
                }`}
              >
                {delta > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : delta < 0 ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
                {delta > 0 ? `Up ${delta} pts` : delta < 0 ? `Down ${Math.abs(delta)} pts` : "No change"} from last
                week
              </div>
            )}
            {completedDate && (
              <p className="mt-3 text-xs text-[#5A4A52]/50">
                Completed {new Date(completedDate).toLocaleDateString("en-US", { weekday: "long" })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Intention + focus areas */}
        <Card className="rounded-2xl border-[#E26C73]/15 bg-white shadow-sm lg:col-span-2">
          <CardContent className="flex h-full flex-col gap-6 p-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#E26C73]">
                <Sparkles className="h-4 w-4" />
                Current Weekly Intention
              </p>
              {declaration ? (
                <p className="mt-2 font-playfair text-xl leading-relaxed text-[#5A4A52] text-pretty">
                  &ldquo;{declaration}&rdquo;
                </p>
              ) : (
                <div className="mt-2">
                  <p className="text-[#5A4A52]/70">You haven&apos;t set a Weekly Intention yet.</p>
                  <Link href="/cherry-blossom-intentions" className="text-sm font-medium text-[#E26C73] hover:underline">
                    Set your intention →
                  </Link>
                </div>
              )}
            </div>

            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#7FB069]">
                <Target className="h-4 w-4" />
                Priority Focus Areas
              </p>
              {focusAreas.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-[#7FB069]/12 px-3 py-1 text-sm font-medium text-[#5A7A4A]"
                    >
                      {categoryLabel(area)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[#5A4A52]/70">No focus areas chosen yet for this week.</p>
              )}
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <Link href="/my-results">
                <Button className="bg-[#E26C73] text-white hover:bg-[#D55A60]">
                  <MessageCircleHeart className="mr-2 h-4 w-4" />
                  Review with Cherry Blossom
                </Button>
              </Link>
              <Link href="/audit">
                <Button variant="outline" className="border-[#7FB069] bg-transparent text-[#5A7A4A] hover:bg-[#7FB069]/10">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Reality Check
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown */}
      <section className="mt-8">
        <h2 className="mb-4 font-playfair text-2xl font-bold text-[#5A4A52]">Your Life Value Breakdown</h2>
        <Card className="rounded-2xl border-[#E26C73]/15 bg-white shadow-sm">
          <CardContent className="grid gap-x-8 gap-y-4 p-6 sm:grid-cols-2">
            {sorted.map((s) => (
              <div key={s.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#5A4A52]">{s.label ?? categoryLabel(s.category)}</span>
                  <span className="text-[#5A4A52]/70">{s.percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#5A4A52]/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.percentage}%`,
                      backgroundColor: s.percentage >= 65 ? "#7FB069" : s.percentage >= 40 ? "#E2A34C" : "#E26C73",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Enter the hub */}
      <div className="mt-10 text-center">
        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] px-8 py-6 text-lg font-semibold text-white shadow-md hover:from-[#D55A60] hover:to-[#6FA055]"
          >
            Enter the Success Hub™
          </Button>
        </Link>
      </div>
    </div>
  )
}
