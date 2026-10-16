"use client"

/**
 * HQSnapshotGrid — Phase 15.2
 * 6-card premium summary grid surfacing the founder's real-time operating picture.
 * Cards: Score, Phase, Weekly Objective, Operating Mode, Business Day, Review Status.
 */

import { BarChart2, Sun, Target, Zap, Calendar, FileCheck } from "lucide-react"
import type { HarmonyWeekContextValue } from "@/components/harmony-week/harmony-week-provider"
import type { MemberExperience } from "@/operating-engine"
import type { WeeklyReview } from "@/lib/executive-reviews/types"

interface SnapshotCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subvalue?: string
  accentColor: string
}

function SnapshotCard({ icon, label, value, subvalue, accentColor }: SnapshotCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/[0.07] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
          {label}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: accentColor + "15" }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </span>
      </div>
      <div>
        <p className="font-montserrat text-base font-bold leading-tight text-[#1C161A]">{value}</p>
        {subvalue && (
          <p className="mt-0.5 font-montserrat text-xs text-[#9CA3AF]">{subvalue}</p>
        )}
      </div>
    </div>
  )
}

interface Props {
  experience: MemberExperience | null
  harmonyWeek: HarmonyWeekContextValue | null
  harmonyScore: number | null
  latestReview: WeeklyReview | null
}

export function HQSnapshotGrid({ experience, harmonyWeek, harmonyScore, latestReview }: Props) {
  const accentColor = harmonyWeek?.accent.color ?? "#5D9D61"
  const phase = experience?.phase.label ?? "Morning Focus"
  const dayName = experience?.member.dayName ?? "Today"
  const streak = experience?.member.streak ?? 0
  const progress = experience?.member.progress ?? 0
  const reviewStatus = latestReview
    ? `Score ${latestReview.harmonyScore.overall}/100`
    : "Not yet generated"
  const reviewSub = latestReview
    ? `Week of ${new Date(latestReview.period.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : "Generate your first review"
  const weeklyObjective = harmonyWeek?.workspacePriorities?.[0] ?? "Execute with intention"

  const cards: SnapshotCardProps[] = [
    {
      icon: <BarChart2 className="h-4 w-4" />,
      label: "Harmony Score™",
      value: harmonyScore !== null ? `${harmonyScore} / 100` : "Pending",
      subvalue: harmonyScore !== null ? "From latest weekly review" : "Generate a review",
      accentColor,
    },
    {
      icon: <Sun className="h-4 w-4" />,
      label: "Current Phase",
      value: phase,
      subvalue: dayName,
      accentColor: "#C6924A",
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Today's Priority",
      value: weeklyObjective,
      subvalue: harmonyWeek?.themeName ?? "Focus Day",
      accentColor: "#4A7FA5",
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: "Momentum Streak",
      value: streak > 0 ? `${streak} day${streak === 1 ? "" : "s"}` : "Start today",
      subvalue: streak > 0 ? "Consecutive completions" : "Complete your first focus block",
      accentColor: "#7C5C8A",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Day Progress",
      value: `${Math.round(progress * 100)}%`,
      subvalue: "Business Day™ completion",
      accentColor: "#8AAF8C",
    },
    {
      icon: <FileCheck className="h-4 w-4" />,
      label: "Latest Review",
      value: reviewStatus,
      subvalue: reviewSub,
      accentColor: "#E26C73",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <SnapshotCard key={card.label} {...card} />
      ))}
    </div>
  )
}
