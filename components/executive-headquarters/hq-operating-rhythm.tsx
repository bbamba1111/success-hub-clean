"use client"

/**
 * HQOperatingRhythm — Phase 15.2
 * Today's day-theme operating rhythm card: philosophy, primary guidance,
 * and workspace priorities drawn from HarmonyWeek.
 */

import Link from "next/link"
import { ArrowRight, Waves } from "lucide-react"
import type { HarmonyWeekContextValue } from "@/components/harmony-week/harmony-week-provider"

interface Props {
  harmonyWeek: HarmonyWeekContextValue | null
}

export function HQOperatingRhythm({ harmonyWeek }: Props) {
  if (!harmonyWeek) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-black/[0.07] bg-white p-6 shadow-sm h-full">
        <div className="h-4 w-32 animate-pulse rounded bg-black/[0.06]" />
        <div className="h-16 w-full animate-pulse rounded bg-black/[0.04]" />
      </div>
    )
  }

  const { accent, themeName, philosophy, cherryBlossomGuidance, workspacePriorities, primaryCta } = harmonyWeek
  const accentColor = accent.color

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-black/[0.07] bg-white p-6 shadow-sm h-full"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: accentColor + "15" }}
        >
          <Waves className="h-4 w-4" style={{ color: accentColor }} aria-hidden />
        </span>
        <h2 className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
          Today&apos;s Operating Rhythm™
        </h2>
      </div>

      {/* Day name + philosophy */}
      <div className="flex flex-col gap-1">
        <p className="font-playfair text-xl font-semibold leading-snug text-[#1C161A]">{themeName}</p>
        {philosophy && (
          <p className="font-montserrat text-xs italic leading-relaxed text-[#9CA3AF]">{philosophy}</p>
        )}
      </div>

      {/* Primary Cherry Blossom guidance */}
      {cherryBlossomGuidance && cherryBlossomGuidance.length > 0 && (
        <blockquote
          className="rounded-lg px-4 py-3 font-montserrat text-sm leading-relaxed text-[#5C4F55]"
          style={{ backgroundColor: accentColor + "0C", borderLeft: `2px solid ${accentColor}40` }}
        >
          {cherryBlossomGuidance[1] ?? cherryBlossomGuidance[0]}
        </blockquote>
      )}

      {/* Workspace priorities */}
      {workspacePriorities && workspacePriorities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {workspacePriorities.slice(0, 4).map((priority) => (
            <span
              key={priority}
              className="rounded-full px-2.5 py-0.5 font-montserrat text-[10px] font-medium"
              style={{ backgroundColor: accentColor + "10", color: accentColor }}
            >
              {priority}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {primaryCta && (
        <Link
          href={primaryCta.href ?? "/"}
          className="mt-auto inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: accentColor }}
        >
          {primaryCta.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  )
}
