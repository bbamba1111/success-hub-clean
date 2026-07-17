"use client"

/**
 * Founder Evolution Dashboard™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * The top-level client component that:
 * 1. Reads all localStorage stores on mount
 * 2. Derives patterns, predictions, milestones, timeline, and weekly insight
 * 3. Renders all five sections in a single, cohesive dashboard
 *
 * All computation is pure / synchronous — no async data fetching.
 */

import { useEffect, useState } from "react"
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  Clock,
  BarChart3,
  Sparkles,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

// Stores
import { getRecommendationHistory } from "@/lib/founder-gps/history/recommendation-history-store"
import { getExecutiveMemory } from "@/lib/executive-office/executive-memory-store"
import { getCapabilityMemory } from "@/lib/executive-capability/capability-memory-store"

// Engines
import { analyzePatterns } from "@/lib/harmony-memory/pattern-recognition-engine"
import { deriveEarnedMilestones } from "@/lib/harmony-memory/milestone-engine"
import { generateInsight } from "@/lib/harmony-memory/insight-generator"
import { buildExecutiveTimeline } from "@/lib/harmony-memory/timeline-engine"

// Types
import type {
  ExecutiveMilestone,
  PatternSignal,
  PredictiveInsight,
  ExecutiveInsight,
  TimelineEntry,
} from "@/lib/harmony-memory/types"

// Timeline sub-component
import { ExecutiveTimeline } from "@/components/harmony-memory/executive-timeline"
import { derivePredictions } from "@/lib/harmony-memory/predictive-intelligence-engine"

// ─── Confidence label ─────────────────────────────────────────────────────────

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.75) return "High"
  if (confidence >= 0.55) return "Moderate"
  return "Low"
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.75) return "#2E7D32"
  if (confidence >= 0.55) return "#C9A96E"
  return "#9E9E9E"
}

/* ===========================================================================
 * Sub-components
 * ======================================================================== */

// ─── Section header ───────────────────────────────────────────────────────────

function DashboardSectionHeader({
  icon: Icon,
  title,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  color: string
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg"
        style={{ background: `${color}18` }}
        aria-hidden
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <h3 className="font-montserrat text-sm font-semibold text-brand-ink">{title}</h3>
    </div>
  )
}

// ─── Milestones ───────────────────────────────────────────────────────────────

function MilestonesSection({ milestones }: { milestones: ExecutiveMilestone[] }) {
  const earned = milestones.filter((m) => m.earned)
  const pending = milestones.filter((m) => !m.earned).slice(0, 6)

  return (
    <section aria-labelledby="milestones-heading">
      <DashboardSectionHeader icon={Award} title="Executive Milestones™" color="#C9A96E" />

      {earned.length === 0 && (
        <p className="mb-4 text-sm text-brand-ink-soft">
          Your first milestone unlocks with your first GPS completion.
        </p>
      )}

      {earned.length > 0 && (
        <div className="mb-4">
          <p className="mb-2.5 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-brand-ink-soft/50">
            Earned
          </p>
          <div className="flex flex-wrap gap-2">
            {earned.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-1.5 rounded-full border border-[#C9A96E]/30 bg-[#FBF7EE] px-3 py-1.5"
                title={m.celebrationNote}
              >
                <Award className="h-3.5 w-3.5 shrink-0 text-[#C9A96E]" aria-hidden />
                <span className="font-montserrat text-[12px] font-semibold text-[#3A2E33]">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <p className="mb-2.5 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-brand-ink-soft/50">
            Upcoming
          </p>
          <div className="flex flex-wrap gap-2">
            {pending.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-1.5 rounded-full border border-dashed border-black/[0.08] bg-card px-3 py-1.5"
              >
                <Award className="h-3.5 w-3.5 shrink-0 text-brand-ink-soft/25" aria-hidden />
                <span className="font-montserrat text-[12px] text-brand-ink-soft/50">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Patterns ─────────────────────────────────────────────────────────────────

const STRENGTH_CONFIG: Record<
  PatternSignal["strength"],
  { label: string; bg: string; text: string }
> = {
  emerging: { label: "Emerging", bg: "#E8F5E9", text: "#2E7D32" },
  confirmed: { label: "Confirmed", bg: "#E3F2FD", text: "#1565C0" },
  strong: { label: "Strong", bg: "#F3E5F5", text: "#6A1B9A" },
}

function PatternRecognitionSection({ patterns }: { patterns: PatternSignal[] }) {
  const top = patterns.slice(0, 5)

  if (top.length === 0) {
    return (
      <section aria-labelledby="patterns-heading">
        <DashboardSectionHeader icon={BarChart3} title="Pattern Recognition™" color="#1565C0" />
        <div className="rounded-xl border border-dashed border-black/[0.07] px-5 py-8 text-center">
          <p className="font-montserrat text-sm font-medium text-brand-ink-soft">
            Patterns emerge after a few weeks of consistent use.
          </p>
          <p className="mt-1 text-xs text-brand-ink-soft/60">
            Your GPS history will surface behavioral patterns that help you understand how you operate.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="patterns-heading">
      <DashboardSectionHeader icon={BarChart3} title="Pattern Recognition™" color="#1565C0" />
      <div className="space-y-3">
        {top.map((p) => {
          const cfg = STRENGTH_CONFIG[p.strength]
          return (
            <div
              key={p.id}
              className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-card px-4 py-3.5"
            >
              <span
                className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: cfg.bg, color: cfg.text }}
              >
                {cfg.label}
              </span>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-brand-ink">{p.description}</p>
                <p className="mt-0.5 font-montserrat text-[11px] text-brand-ink-soft/60">
                  {p.evidenceCount} data point{p.evidenceCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Predictions ──────────────────────────────────────────────────────────────

function PredictiveInsightsSection({ predictions }: { predictions: PredictiveInsight[] }) {
  if (predictions.length === 0) {
    return (
      <section aria-labelledby="predictions-heading">
        <DashboardSectionHeader icon={Lightbulb} title="Predictive Intelligence™" color="#7C9A82" />
        <div className="rounded-xl border border-dashed border-black/[0.07] px-5 py-8 text-center">
          <p className="font-montserrat text-sm font-medium text-brand-ink-soft">
            Predictive insights activate after 2 weeks of data.
          </p>
          <p className="mt-1 text-xs text-brand-ink-soft/60">
            The system learns your operating patterns and anticipates what comes next.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="predictions-heading">
      <DashboardSectionHeader icon={Lightbulb} title="Predictive Intelligence™" color="#7C9A82" />
      <div className="space-y-3">
        {predictions.map((p) => {
          const clabel = confidenceLabel(p.confidence)
          const ccolor = confidenceColor(p.confidence)
          return (
            <div
              key={p.id}
              className="rounded-xl border border-black/[0.06] bg-card px-4 py-4"
            >
              <div className="mb-1.5 flex flex-wrap items-start gap-2">
                <p className="flex-1 font-montserrat text-sm font-semibold leading-snug text-brand-ink">
                  {p.headline}
                </p>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wide"
                  style={{ background: `${ccolor}18`, color: ccolor }}
                >
                  {clabel}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-brand-ink-soft">{p.rationale}</p>
              {p.actionSuggestion && (
                <div className="mt-3 flex items-center gap-1.5">
                  {p.actionHref ? (
                    <Link
                      href={p.actionHref}
                      className="inline-flex items-center gap-1 font-montserrat text-[12px] font-semibold text-brand-green hover:underline underline-offset-2"
                    >
                      {p.actionSuggestion}
                      <ChevronRight className="h-3 w-3" aria-hidden />
                    </Link>
                  ) : (
                    <p className="font-montserrat text-[12px] text-brand-ink-soft">
                      {p.actionSuggestion}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Weekly Insight ───────────────────────────────────────────────────────────

function WeeklyInsightSection({ insight }: { insight: ExecutiveInsight | null }) {
  if (!insight || (insight.wins.length === 0 && insight.trends.length === 0)) {
    return (
      <section aria-labelledby="weekly-insight-heading">
        <DashboardSectionHeader icon={Sparkles} title="Weekly Executive Insight™" color="#C9A96E" />
        <div className="rounded-xl border border-dashed border-black/[0.07] px-5 py-8 text-center">
          <p className="font-montserrat text-sm font-medium text-brand-ink-soft">
            Your first weekly insight generates after 7 days of activity.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="weekly-insight-heading">
      <DashboardSectionHeader icon={Sparkles} title="Weekly Executive Insight™" color="#C9A96E" />
      <div className="rounded-xl border border-black/[0.06] bg-card p-5">
        {/* Narrative */}
        <p className="font-serif text-base italic leading-relaxed text-brand-ink">
          &ldquo;{insight.narrative}&rdquo;
        </p>

        {(insight.wins.length > 0 || insight.risks.length > 0 || insight.opportunities.length > 0) && (
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {insight.wins.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-brand-ink-soft/50">
                  <CheckCircle2 className="h-3 w-3 text-brand-green" aria-hidden /> Wins
                </p>
                <ul className="space-y-1">
                  {insight.wins.map((w) => (
                    <li key={w} className="text-xs leading-relaxed text-brand-ink">{w}</li>
                  ))}
                </ul>
              </div>
            )}
            {insight.risks.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-brand-ink-soft/50">
                  <AlertTriangle className="h-3 w-3 text-[#C9A96E]" aria-hidden /> Watch
                </p>
                <ul className="space-y-1">
                  {insight.risks.map((r) => (
                    <li key={r} className="text-xs leading-relaxed text-brand-ink">{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {insight.opportunities.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-brand-ink-soft/50">
                  <TrendingUp className="h-3 w-3 text-[#1565C0]" aria-hidden /> Opportunities
                </p>
                <ul className="space-y-1">
                  {insight.opportunities.map((o) => (
                    <li key={o} className="text-xs leading-relaxed text-brand-ink">{o}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/* ===========================================================================
 * Main dashboard client
 * ======================================================================== */

interface DashboardState {
  milestones: ExecutiveMilestone[]
  patterns: PatternSignal[]
  predictions: PredictiveInsight[]
  timeline: TimelineEntry[]
  weeklyInsight: ExecutiveInsight | null
}

function emptyState(): DashboardState {
  return {
    milestones: [],
    patterns: [],
    predictions: [],
    timeline: [],
    weeklyInsight: null,
  }
}

export function FounderEvolutionDashboard() {
  const [data, setData] = useState<DashboardState>(emptyState())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read all stores
    const gpsHistory = getRecommendationHistory()
    const execStore = getExecutiveMemory()
    const execEntries = execStore.entries
    const capability = getCapabilityMemory()

    // Derive all
    const patternStores = {
      gpsHistory,
      execMemory: execEntries,
      capability,
    }
    const patterns = analyzePatterns(patternStores)
    // Pass null aggregate — predictions that require HarmonyContextAggregate are skipped gracefully
    const predictions = derivePredictions(patterns, null, gpsHistory)
    const milestones = deriveEarnedMilestones(gpsHistory, execEntries, capability)
    const timeline = buildExecutiveTimeline(gpsHistory, execEntries, capability, milestones)
    const weeklyInsight = generateInsight("weekly", gpsHistory, patterns, predictions, capability)

    setData({ milestones, patterns, predictions, timeline, weeklyInsight })
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8" aria-busy="true" aria-label="Loading Founder Evolution Dashboard">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-black/[0.07]" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-black/[0.04]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <MilestonesSection milestones={data.milestones} />
      <PatternRecognitionSection patterns={data.patterns} />
      <PredictiveInsightsSection predictions={data.predictions} />
      <WeeklyInsightSection insight={data.weeklyInsight} />

      {/* Executive Timeline */}
      <section aria-labelledby="timeline-heading">
        <DashboardSectionHeader icon={Clock} title="Executive Timeline™" color="#6A1B9A" />
        <ExecutiveTimeline entries={data.timeline} />
      </section>
    </div>
  )
}
