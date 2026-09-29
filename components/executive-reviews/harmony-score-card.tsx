/**
 * HarmonyScoreCard™ — Phase 14.0
 * Circular score display with band label, trend indicator, and rationale.
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { HarmonyScore } from "@/lib/executive-reviews/types"

const BAND_CONFIG: Record<HarmonyScore["band"], { label: string; color: string; bg: string }> = {
  flourishing: { label: "Flourishing™",  color: "#5D9D61", bg: "rgba(93,157,97,0.12)"  },
  thriving:    { label: "Thriving™",     color: "#4A7C4E", bg: "rgba(74,124,78,0.10)"  },
  stable:      { label: "Stable™",       color: "#C8874A", bg: "rgba(200,135,74,0.10)" },
  developing:  { label: "Developing™",   color: "#4A8C8C", bg: "rgba(74,140,140,0.10)" },
  critical:    { label: "Needs Reset™",  color: "#E26C73", bg: "rgba(226,108,115,0.10)" },
}

function TrendBadge({ trend, delta }: { trend: HarmonyScore["trend"]; delta: number }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-2.5 py-1 font-montserrat text-xs font-bold text-brand-green">
        <TrendingUp className="h-3.5 w-3.5" />
        +{delta} pts
      </span>
    )
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 font-montserrat text-xs font-bold text-rose-500">
        <TrendingDown className="h-3.5 w-3.5" />
        {delta} pts
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-ink-soft/10 px-2.5 py-1 font-montserrat text-xs font-bold text-brand-ink-soft">
      <Minus className="h-3.5 w-3.5" />
      No change
    </span>
  )
}

export function HarmonyScoreCard({
  score,
  accentColor,
}: {
  score: HarmonyScore
  accentColor?: string
}) {
  const cfg = BAND_CONFIG[score.band]
  const ringColor = accentColor ?? cfg.color

  // SVG ring: circumference for r=42 circle = 2π×42 ≈ 263.9
  const CIRC = 263.9
  const dash = (score.value / 100) * CIRC

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border border-black/[0.07] p-6 text-center sm:flex-row sm:text-left"
      style={{ background: cfg.bg }}
    >
      {/* Ring */}
      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-black/[0.06]" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={ringColor} strokeWidth="7"
            strokeDasharray={`${dash} ${CIRC}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="font-playfair text-3xl font-bold leading-none" style={{ color: ringColor }}>
            {score.value}
          </span>
          <span className="font-montserrat text-[9px] font-bold uppercase tracking-widest text-brand-ink-soft">
            / 100
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 font-montserrat text-xs font-bold"
            style={{ background: ringColor + "20", color: ringColor }}
          >
            {cfg.label}
          </span>
          <TrendBadge trend={score.trend} delta={score.delta} />
        </div>
        <p className="font-montserrat text-sm leading-relaxed text-brand-ink">
          {score.rationale}
        </p>
      </div>
    </div>
  )
}
