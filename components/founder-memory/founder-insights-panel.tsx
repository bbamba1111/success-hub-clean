"use client"

/**
 * FounderInsightsPanel — Phase 16.0
 * Grid of FounderInsight cards derived from pattern-recognition-engine.
 */

import { TrendingUp, TrendingDown, Minus, Target, BarChart2, Zap, Users } from "lucide-react"
import type { FounderInsight } from "@/lib/founder-memory/types"

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  BarChart2,
  Zap,
  TrendingUp,
  Users,
}

function InsightIcon({ name }: { name?: string }) {
  const Icon = name ? (ICON_MAP[name] ?? Target) : Target
  return <Icon className="h-4 w-4" />
}

// ─── Trend badge ──────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: FounderInsight["trend"] }) {
  if (trend === "up") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 font-montserrat text-[10px] font-semibold text-[#5D9D61]">
        <TrendingUp className="h-3 w-3" /> Trending Up
      </span>
    )
  }
  if (trend === "down") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#FFF1F2] px-2 py-0.5 font-montserrat text-[10px] font-semibold text-[#E26C73]">
        <TrendingDown className="h-3 w-3" /> Trending Down
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2 py-0.5 font-montserrat text-[10px] font-semibold text-gray-500">
      <Minus className="h-3 w-3" /> Steady
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FounderInsightsPanelProps {
  insights: FounderInsight[]
}

export function FounderInsightsPanel({ insights }: FounderInsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-[#FAFAFA] px-6 py-8 text-center">
        <p className="font-montserrat text-sm text-gray-400">
          Pattern insights will appear here as your operating history grows. Complete a few GPS
          recommendations and generate your first review to activate this panel.
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-xl font-semibold text-[#1C161A]">
          Pattern Insights™
        </h2>
        <span className="font-montserrat text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Powered by Pattern Recognition™
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {insights.map((insight) => (
          <article
            key={insight.id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F5F0] text-[#5D9D61]">
                  <InsightIcon name={insight.icon} />
                </span>
                <h3 className="font-montserrat text-[13px] font-semibold text-[#1C161A]">
                  {insight.label}
                </h3>
              </div>
              <TrendBadge trend={insight.trend} />
            </div>

            <p className="font-montserrat text-[12px] leading-relaxed text-gray-500">
              {insight.description}
            </p>

            <p className="mt-2 font-montserrat text-[10px] text-gray-300">
              {insight.dataPoints} data point{insight.dataPoints !== 1 ? "s" : ""}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
