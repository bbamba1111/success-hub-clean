"use client"

/**
 * Founder Presence Banner™ — Phase 10.6
 *
 * A calm, supplementary single-line greeting rendered above the DynamicHero.
 * Never replaces Cherry Blossom's voice — only adds a thin contextual layer
 * when the founder has designed their week and context is available.
 *
 * Rules:
 * - Only renders when ctx.ready && ctx.hasDesignedWeek
 * - Transparent background — blends into the hero
 * - One line max — operating mode + optional pattern day note
 * - Never interposes on Cherry Blossom's core message
 */

import { useMemo } from "react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { assembleHarmonyContext } from "@/lib/founder-gps/context/harmony-context-aggregator"
import { deriveOperatingMode, MODE_DEFINITIONS } from "@/lib/adaptive-workspace/operating-mode-engine"
import type { PatternSignal } from "@/lib/harmony-memory/types"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function FounderPresenceBanner() {
  const ctx = useHarmonyContext()

  const { modeName, dayNote } = useMemo(() => {
    if (!ctx.ready || !ctx.hasDesignedWeek) return { modeName: null, dayNote: null }

    try {
      // Reuse the provider's already-resolved BBA signals (fetched
      // server-side once via getBbaSignalSummary()) rather than re-fetching.
      const agg = assembleHarmonyContext(ctx, ctx.snapshot.intelligence.gpsContext.bbaSignalSummary)
      const modeResult = deriveOperatingMode(agg)
      const def = MODE_DEFINITIONS[modeResult.mode]

      // Check for a confirmed operating-day pattern matching today
      const todayName = DAY_NAMES[new Date().getDay()]
      const patterns = (agg.patternSignals ?? []) as PatternSignal[]
      const matchedPattern = patterns.find(
        (p) =>
          p.category === "completion-cadence" &&
          p.contextHint === todayName &&
          (p.strength === "confirmed" || p.strength === "strong"),
      )

      return {
        modeName: def.name,
        dayNote: matchedPattern ? `${todayName}s are consistently your strongest operating days.` : null,
      }
    } catch {
      return { modeName: null, dayNote: null }
    }
  }, [ctx])

  if (!ctx.ready || !ctx.hasDesignedWeek || !modeName) return null

  return (
    <div
      className="w-full px-6 pt-4 pb-0"
      aria-label="Operating context"
      role="complementary"
    >
      <div className="mx-auto max-w-3xl">
        <p className="font-montserrat text-[11px] leading-relaxed text-white/50 text-pretty">
          {dayNote ? `${dayNote} ` : ""}
          Your workspace is in{" "}
          <span className="font-semibold text-white/70">{modeName}</span>.
        </p>
      </div>
    </div>
  )
}
