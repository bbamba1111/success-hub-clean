"use client"

/**
 * Executive Performance Dashboard™ — Phase 9.0 / Part 6 (Progress Intelligence™)
 * ---------------------------------------------------------------------------
 * The first operational dashboard in Harmony Lane™. Reads from Progress
 * Intelligence™ (session-scoped) to display real operating behavior across
 * two dimensions:
 *
 *   Human Sustainability™ — the life commitments that sustain the CEO
 *   Business Performance™ — the executive outputs that build compounding assets
 *
 * Architecture principles:
 *   - Reads from deriveProgressSummary() — pure client-side session store
 *   - Cherry Blossom™ narrates the summary (Single Voice Principle™)
 *   - No fabricated data — every metric reflects actual session entries
 *   - Every section is contextually meaningful even with zero data
 *   - Supabase persistence will be wired in a future phase; the UI is ready
 *
 * Design: stained-glass editorial panels matching MorningExecutiveBrief™.
 * Two-section layout with metric rows, streak indicators, and CB summary.
 */

import { useMemo } from "react"
import { Activity, Award, Cpu, Heart, Layers, TrendingUp, Users } from "lucide-react"
import {
  deriveProgressSummary,
  getProgressStore,
  type ProgressSummary,
} from "@/lib/founder-gps/progress-intelligence"

/* ===========================================================================
 * Main export
 * ======================================================================== */

export function ExecutivePerformanceDashboard() {
  const progress = useMemo(() => deriveProgressSummary(), [])
  const store = useMemo(() => getProgressStore(), [])

  const hasLifeData = progress.todayLifeEntryExists || progress.nonNegotiableStreak > 0 || progress.workoutStreak > 0
  const hasBusinessData = progress.executiveOutcomesCompletedThisWeek > 0 || progress.totalAssetsIdentified > 0 || progress.totalSopsCreated > 0

  return (
    <div className="space-y-6">
      {/* Cherry Blossom™ Progress Summary (shows only when there's something to say) */}
      {(hasLifeData || hasBusinessData) && (
        <CbProgressSummary progress={progress} />
      )}

      {/* Human Sustainability™ */}
      <DashboardSection
        icon={Heart}
        color="green"
        title="Human Sustainability™"
        subtitle="Daily Non-Negotiables™ that protect your health, relationships, recovery, and Time Freedom™."
      >
        <HumanSustainabilityMetrics progress={progress} hasData={hasLifeData} />
      </DashboardSection>

      {/* Business Performance™ */}
      <DashboardSection
        icon={TrendingUp}
        color="rose"
        title="Business Performance™"
        subtitle="Executive outputs that build compounding business assets and operating leverage."
      >
        <BusinessPerformanceMetrics progress={progress} hasData={hasBusinessData} />
      </DashboardSection>
    </div>
  )
}

/* ===========================================================================
 * Cherry Blossom™ Progress Summary Narration
 * ======================================================================== */

function CbProgressSummary({ progress }: { progress: ProgressSummary }) {
  const parts: string[] = []

  if (progress.nonNegotiableStreak >= 3) {
    parts.push(`${progress.nonNegotiableStreak} consecutive days of Daily Non-Negotiables™ honored`)
  }
  if (progress.workoutStreak >= 2) {
    parts.push(`${progress.workoutStreak} consecutive Workout Windows™`)
  }
  if (progress.executiveOutcomesCompletedThisWeek > 0) {
    parts.push(`${progress.executiveOutcomesCompletedThisWeek} Executive ${progress.executiveOutcomesCompletedThisWeek === 1 ? "Outcome™" : "Outcomes™"} completed this week`)
  }
  if (progress.totalAssetsIdentified > 0) {
    parts.push(`${progress.totalAssetsIdentified} Business ${progress.totalAssetsIdentified === 1 ? "Asset™" : "Assets™"} identified`)
  }
  if (progress.totalSopsCreated > 0) {
    parts.push(`${progress.totalSopsCreated} ${progress.totalSopsCreated === 1 ? "SOP" : "SOPs"} created`)
  }
  if (progress.lastExecutiveOutcome) {
    parts.push(`last executive focus: "${progress.lastExecutiveOutcome}"`)
  }

  if (parts.length === 0) return null

  // Build CB's summary sentence
  const summary = parts.length === 1
    ? `You have: ${parts[0]}.`
    : `You have: ${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}.`

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E26C73]/20 bg-[#FDF6F6] px-6 py-5">
      <div aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[#E26C73]" />
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 overflow-hidden rounded-full border border-[#E26C73]/30 shrink-0">
          <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.16em] text-[#E26C73] mb-1">
            Cherry Blossom™ — Progress Summary
          </p>
          <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
            {summary}
          </p>
          <p className="mt-1 font-montserrat text-[12px] leading-relaxed text-[#6B5860]/70 text-pretty">
            This reflects session activity. Supabase persistence will track your 30-day operating history.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ===========================================================================
 * Human Sustainability™ Metrics
 * ======================================================================== */

function HumanSustainabilityMetrics({
  progress,
  hasData,
}: {
  progress: ProgressSummary
  hasData: boolean
}) {
  const metrics: MetricRowProps[] = [
    {
      icon: Activity,
      label: "Morning GIV\u2022EN™ Consistency",
      value: progress.nonNegotiableStreak > 0 ? `${progress.nonNegotiableStreak}-day streak` : null,
      emptyLabel: "Not yet tracked",
      description: "Consecutive days with a Daily Non-Negotiable™ honored.",
      accent: "green",
      isStreak: true,
      streakCount: progress.nonNegotiableStreak,
    },
    {
      icon: Activity,
      label: "Workout Window™ Consistency",
      value: progress.workoutStreak > 0 ? `${progress.workoutStreak}-day streak` : null,
      emptyLabel: "Not yet tracked",
      description: "Consecutive Workout Windows™ honored.",
      accent: "green",
      isStreak: true,
      streakCount: progress.workoutStreak,
    },
    {
      icon: Heart,
      label: "Daily Non-Negotiables™ Today",
      value: progress.todayLifeEntryExists ? "Recorded today" : null,
      emptyLabel: "Not recorded yet today",
      description: "Whether today's life commitments have been logged.",
      accent: progress.todayLifeEntryExists ? "green" : "neutral",
      isStreak: false,
      streakCount: 0,
    },
  ]

  if (!hasData) {
    return <EmptyState message="Non-Negotiable tracking begins once you start logging your daily commitments in Live Today™." />
  }

  return (
    <div className="space-y-3">
      {metrics.map((m) => (
        <MetricRow key={m.label} {...m} />
      ))}
    </div>
  )
}

/* ===========================================================================
 * Business Performance™ Metrics
 * ======================================================================== */

function BusinessPerformanceMetrics({
  progress,
  hasData,
}: {
  progress: ProgressSummary
  hasData: boolean
}) {
  const metrics: MetricRowProps[] = [
    {
      icon: Award,
      label: "Executive Outcomes™ This Week",
      value: progress.executiveOutcomesCompletedThisWeek > 0
        ? `${progress.executiveOutcomesCompletedThisWeek} completed`
        : null,
      emptyLabel: "None completed yet",
      description: "CEO Workday™ Executive Outcomes™ completed in the past 7 days.",
      accent: progress.executiveOutcomesCompletedThisWeek >= 3 ? "rose" : "neutral",
      isStreak: false,
      streakCount: 0,
    },
    {
      icon: Layers,
      label: "Business Assets™ Identified",
      value: progress.totalAssetsIdentified > 0
        ? `${progress.totalAssetsIdentified} total`
        : null,
      emptyLabel: "None identified yet",
      description: "Business Assets™ that continue creating value after the CEO Workday™ ends.",
      accent: progress.totalAssetsIdentified > 0 ? "rose" : "neutral",
      isStreak: false,
      streakCount: 0,
    },
    {
      icon: Layers,
      label: "SOPs Created",
      value: progress.totalSopsCreated > 0
        ? `${progress.totalSopsCreated} created`
        : null,
      emptyLabel: "None created yet",
      description: "Standard Operating Procedures that reduce execution friction permanently.",
      accent: progress.totalSopsCreated > 0 ? "rose" : "neutral",
      isStreak: false,
      streakCount: 0,
    },
    {
      icon: TrendingUp,
      label: "Last Executive Outcome™",
      value: progress.lastExecutiveOutcome ? `"${progress.lastExecutiveOutcome}"` : null,
      emptyLabel: "No Executive Outcomes™ recorded",
      description: "The most recently completed or in-progress Executive Outcome™.",
      accent: "neutral",
      isStreak: false,
      streakCount: 0,
    },
  ]

  if (!hasData) {
    return <EmptyState message="Business Performance™ tracking begins once you complete your first CEO Workday™ Executive Outcome™." />
  }

  return (
    <div className="space-y-3">
      {metrics.map((m) => (
        <MetricRow key={m.label} {...m} />
      ))}
    </div>
  )
}

/* ===========================================================================
 * Shared sub-components
 * ======================================================================== */

type MetricAccent = "green" | "rose" | "neutral"

interface MetricRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | null
  emptyLabel: string
  description: string
  accent: MetricAccent
  isStreak: boolean
  streakCount: number
}

function MetricRow({
  icon: Icon,
  label,
  value,
  emptyLabel,
  description,
  accent,
  isStreak,
  streakCount,
}: MetricRowProps) {
  const hasValue = value !== null

  const accentStyles: Record<MetricAccent, { valueCls: string; dotCls: string }> = {
    green: { valueCls: "text-[#5B835F] font-semibold", dotCls: "bg-[#5B835F]" },
    rose:  { valueCls: "text-[#C13B6B] font-semibold", dotCls: "bg-[#C13B6B]" },
    neutral: { valueCls: "text-[#6B5860]", dotCls: "bg-[#6B5860]/30" },
  }

  const { valueCls, dotCls } = accentStyles[accent]

  return (
    <div className="flex items-start gap-4 rounded-xl border border-black/[0.06] bg-white/60 px-4 py-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04]">
        <Icon className="h-4 w-4 text-[#6B5860]/70" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-montserrat text-[13px] font-semibold text-[#3A2E33]">{label}</p>
        <p className="font-montserrat text-[11px] leading-relaxed text-[#6B5860]/70 mt-0.5">{description}</p>
      </div>
      <div className="shrink-0 text-right">
        {hasValue ? (
          <div className="flex items-center gap-2">
            {isStreak && streakCount >= 3 && (
              <span
                className={`inline-block h-2 w-2 rounded-full ${dotCls}`}
                aria-hidden
              />
            )}
            <p className={`font-montserrat text-[13px] ${valueCls}`}>{value}</p>
          </div>
        ) : (
          <p className="font-montserrat text-[12px] text-[#6B5860]/40 italic">{emptyLabel}</p>
        )}
      </div>
    </div>
  )
}

function DashboardSection({
  icon: Icon,
  color,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  color: "green" | "rose"
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  const styles = {
    green: { border: "border-[#5B835F]/20", bg: "bg-[#5B835F]/[0.04]", icon: "text-[#5B835F]" },
    rose:  { border: "border-[#C13B6B]/20", bg: "bg-[#C13B6B]/[0.04]", icon: "text-[#C13B6B]" },
  }[color]

  return (
    <div className={`rounded-2xl border ${styles.border} ${styles.bg} px-6 py-6`}>
      <div className="flex items-start gap-3 mb-5">
        <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${styles.icon}`} aria-hidden />
        <div>
          <h3 className="font-montserrat text-base font-bold text-[#3A2E33]">{title}</h3>
          <p className="mt-0.5 font-montserrat text-[12px] leading-relaxed text-[#6B5860]/80">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-black/[0.08] bg-white/40 px-5 py-5 text-center">
      <p className="font-montserrat text-[13px] leading-relaxed text-[#6B5860]/70 text-pretty">{message}</p>
    </div>
  )
}
