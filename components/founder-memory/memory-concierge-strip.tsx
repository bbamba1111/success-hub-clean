"use client"

/**
 * MemoryConciergeStrip — Phase 16.0
 * Horizontal coaching strip that surfaces Cherry Blossom's coachingNote
 * derived from buildConciergeContext(). Used on HQ, Executive Reviews page,
 * and the Founder Memory page.
 */

import Link from "next/link"
import type { ConciergeContext } from "@/lib/founder-memory/types"

interface MemoryConciergeStripProps {
  context: ConciergeContext
  /** Suppress the "View Timeline" CTA when already on the memory page. */
  hideTimelineCta?: boolean
}

export function MemoryConciergeStrip({
  context,
  hideTimelineCta = false,
}: MemoryConciergeStripProps) {
  if (!context.coachingNote) return null

  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-[#F2DDE0] bg-[#FDF9FA] px-5 py-4 sm:flex-row sm:items-start sm:gap-4">
      {/* Cherry Blossom avatar dot */}
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6E4E7]">
          <span className="font-playfair text-[13px] font-semibold text-[#C4909A]">CB</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <p className="font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#C4909A]">
          Cherry Blossom remembers
        </p>
        <p className="font-montserrat text-[13px] italic leading-relaxed text-[#3A2E33]">
          &ldquo;{context.coachingNote}&rdquo;
        </p>

        {/* Supporting context chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {context.streakInfo.days > 0 && (
            <span className="rounded-full bg-[#F0FDF4] px-2.5 py-0.5 font-montserrat text-[10px] font-semibold text-[#5D9D61]">
              {context.streakInfo.label}
            </span>
          )}
          {context.recentWins.length > 0 && (
            <span className="rounded-full bg-[#FFFBEB] px-2.5 py-0.5 font-montserrat text-[10px] font-semibold text-[#B8860B]">
              {context.recentWins.length} win{context.recentWins.length > 1 ? "s" : ""} this week
            </span>
          )}
          {context.latestMilestone && (
            <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 font-montserrat text-[10px] font-semibold text-[#3730A3]">
              Latest: {context.latestMilestone.title}
            </span>
          )}
        </div>
      </div>

      {/* View Timeline CTA */}
      {!hideTimelineCta && (
        <div className="flex-shrink-0">
          <Link
            href="/founder-memory"
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 font-montserrat text-[11px] font-semibold text-[#1C161A] shadow-sm ring-1 ring-[#E8C5CA] transition-all hover:bg-[#FDF9FA]"
          >
            View Timeline &rarr;
          </Link>
        </div>
      )}
    </aside>
  )
}
