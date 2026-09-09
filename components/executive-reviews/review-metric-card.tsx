/**
 * ReviewMetricCard™ — Phase 14.0
 * Reusable card: icon + label + value + trend chip.
 */

import { TrendingUp, TrendingDown, Minus, CheckCircle, Leaf, Briefcase, Star, Calendar, Activity } from "lucide-react"
import type { ReviewMetric } from "@/lib/executive-reviews/types"

const ICONS: Record<string, React.ElementType> = {
  CheckCircle,
  Leaf,
  Briefcase,
  Star,
  Calendar,
  Activity,
}

function TrendChip({ trend, delta }: { trend?: ReviewMetric["trend"]; delta?: number }) {
  if (!trend || trend === "flat") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-ink-soft/10 px-2 py-0.5 font-montserrat text-[10px] font-semibold text-brand-ink-soft">
        <Minus className="h-2.5 w-2.5" />
        Stable
      </span>
    )
  }
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-2 py-0.5 font-montserrat text-[10px] font-semibold text-brand-green">
        <TrendingUp className="h-2.5 w-2.5" />
        {delta != null && delta > 0 ? `+${delta}` : "Up"}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 font-montserrat text-[10px] font-semibold text-rose-500">
      <TrendingDown className="h-2.5 w-2.5" />
      {delta != null && delta < 0 ? delta : "Down"}
    </span>
  )
}

export function ReviewMetricCard({ metric }: { metric: ReviewMetric }) {
  const Icon = metric.icon ? (ICONS[metric.icon] ?? Activity) : Activity

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-black/[0.07] bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/10">
            <Icon className="h-4 w-4 text-brand-green" />
          </span>
          <span className="font-montserrat text-xs font-semibold uppercase tracking-wide text-brand-ink-soft">
            {metric.label}
          </span>
        </div>
        <TrendChip trend={metric.trend} delta={metric.delta} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-playfair text-2xl font-semibold text-brand-ink">
          {metric.value}
        </span>
        {metric.unit && (
          <span className="font-montserrat text-xs text-brand-ink-soft">{metric.unit}</span>
        )}
      </div>
    </div>
  )
}
