"use client"

/**
 * HQMemorySection — Phase 16.0
 * Compact Executive Headquarters™ widget showing the latest milestone,
 * latest insight chip, and a "View Timeline" CTA.
 * Consumed by ExecutiveHeadquartersClient.
 */

import Link from "next/link"
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { FounderMemory, FounderInsight } from "@/lib/founder-memory/types"

interface HQMemorySectionProps {
  latestMemory: FounderMemory | null
  latestInsight: FounderInsight | null
  accentColor: string
}

export function HQMemorySection({
  latestMemory,
  latestInsight,
  accentColor,
}: HQMemorySectionProps) {
  if (!latestMemory && !latestInsight) return null

  return (
    <section className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-lg font-semibold text-[#1C161A]">
          Founder Memory™
        </h2>
        <Link
          href="/founder-memory"
          className="font-montserrat text-[11px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-70"
          style={{ color: accentColor }}
        >
          View Timeline &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Latest milestone */}
        {latestMemory && (
          <div className="flex items-start gap-3 rounded-lg bg-[#FFFBEB] p-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FEF3C7]">
              <Trophy className="h-4 w-4 text-[#B8860B]" />
            </span>
            <div className="min-w-0">
              <p className="mb-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#B8860B]">
                Latest Milestone
              </p>
              <p className="font-montserrat text-[13px] font-medium leading-snug text-[#1C161A]">
                {latestMemory.title}
              </p>
              <p className="mt-0.5 font-montserrat text-[11px] text-gray-400">
                {new Date(latestMemory.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Latest insight */}
        {latestInsight && (
          <div className="flex items-start gap-3 rounded-lg bg-[#F5F3FF] p-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE]">
              {latestInsight.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
              ) : latestInsight.trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-[#E26C73]" />
              ) : (
                <Minus className="h-4 w-4 text-[#7C3AED]" />
              )}
            </span>
            <div className="min-w-0">
              <p className="mb-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#7C3AED]">
                Top Insight
              </p>
              <p className="font-montserrat text-[13px] font-medium leading-snug text-[#1C161A]">
                {latestInsight.label}
              </p>
              <p className="mt-0.5 font-montserrat text-[11px] leading-relaxed text-gray-400 line-clamp-2">
                {latestInsight.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
