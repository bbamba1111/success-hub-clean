"use client"

/**
 * HQCelebrate — Phase 15.2
 * Consistency celebration strip: GPS completions, adaptations, reviews, streak.
 */

import { Sparkles } from "lucide-react"

interface MetricPillProps {
  value: number | string
  label: string
  accentColor: string
}

function MetricPill({ value, label, accentColor }: MetricPillProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-black/[0.06] bg-white px-5 py-4 text-center shadow-sm flex-1 min-w-[80px]"
      style={{ borderTop: `2px solid ${accentColor}` }}
    >
      <span className="font-montserrat text-2xl font-bold" style={{ color: accentColor }}>
        {value}
      </span>
      <span className="font-montserrat text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </span>
    </div>
  )
}

interface Props {
  completions: number
  adaptations: number
  reviews: number
  streak: number
  accentColor: string
}

export function HQCelebrate({ completions, adaptations, reviews, streak, accentColor }: Props) {
  const metrics: MetricPillProps[] = [
    { value: completions, label: "Focus Completions", accentColor },
    { value: adaptations, label: "Adaptations Made", accentColor: "#4A7FA5" },
    { value: reviews,     label: "Reviews Generated", accentColor: "#E26C73" },
    { value: `${streak}d`, label: "Current Streak",   accentColor: "#C6924A" },
  ]

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/[0.07] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0" style={{ color: accentColor }} aria-hidden />
        <h2 className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
          Your Consistency™
        </h2>
      </div>

      {completions === 0 && adaptations === 0 && reviews === 0 ? (
        <p className="font-montserrat text-sm text-[#9CA3AF]">
          Your consistency metrics will appear here as you complete focus blocks and generate reviews.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {metrics.map((m) => (
            <MetricPill key={m.label} {...m} />
          ))}
        </div>
      )}
    </div>
  )
}
