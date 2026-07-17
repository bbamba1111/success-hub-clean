"use client"

/**
 * Operating Mode Card™ — Phase 10.6
 *
 * A thin horizontal pill row shown between DynamicHero and segment list.
 * Shows the current operating mode, confidence, and an expandable rationale.
 * Links to /my-harmony#adaptive-workspace for the full adaptation history.
 *
 * Only renders when ctx.ready && ctx.hasDesignedWeek.
 */

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { assembleHarmonyContext } from "@/lib/founder-gps/context/harmony-context-aggregator"
import { deriveOperatingMode, MODE_DEFINITIONS } from "@/lib/adaptive-workspace/operating-mode-engine"

export function OperatingModeCard() {
  const ctx = useHarmonyContext()
  const [expanded, setExpanded] = useState(false)

  const modeData = useMemo(() => {
    if (!ctx.ready || !ctx.hasDesignedWeek) return null
    try {
      const agg = assembleHarmonyContext(ctx)
      const result = deriveOperatingMode(agg)
      const def = MODE_DEFINITIONS[result.mode]
      return { ...result, def }
    } catch {
      return null
    }
  }, [ctx])

  if (!modeData) return null

  const { mode, confidence, rationale, def } = modeData

  // Confidence bar width capped at 100
  const barWidth = Math.min(confidence, 100)

  return (
    <div
      className="mt-6 overflow-hidden rounded-2xl border border-black/[0.07] bg-white/80 shadow-sm backdrop-blur-sm"
      role="region"
      aria-label="Adaptive Operating Mode"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.02]"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Mode pill */}
          <span
            className={`shrink-0 rounded-full px-3 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] ${def.bgClass} ${def.textClass}`}
          >
            {def.name}
          </span>

          {/* Confidence bar */}
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-black/[0.08]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${barWidth}%`, backgroundColor: def.accentColor }}
              />
            </div>
            <span className="font-montserrat text-[11px] text-brand-ink-soft shrink-0">
              {confidence}% confidence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline font-montserrat text-[11px] text-brand-ink-soft">
            Why this mode?
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-brand-ink-soft transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-black/[0.05] px-5 py-4 space-y-3">
          <p className="font-montserrat text-[13px] leading-relaxed text-brand-ink-soft text-pretty">
            {rationale}
          </p>
          <p className="font-montserrat text-[11px] text-brand-ink-soft/70">
            {def.tagline}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {def.primaryFocus.map((f) => (
              <span
                key={f}
                className="rounded-full border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 font-montserrat text-[10px] text-brand-ink-soft"
              >
                {f}
              </span>
            ))}
          </div>
          <Link
            href="/my-harmony#adaptive-workspace"
            className="inline-flex items-center gap-1 font-montserrat text-[11px] font-semibold underline underline-offset-2"
            style={{ color: def.accentColor }}
          >
            View adaptation history
          </Link>
        </div>
      )}
    </div>
  )
}
