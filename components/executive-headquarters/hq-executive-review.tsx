"use client"

/**
 * HQExecutiveReview — Phase 15.2
 * Shows the latest Weekly Review card or a "Generate your first review" prompt.
 */

import Link from "next/link"
import { ArrowRight, FileText, Star } from "lucide-react"
import type { WeeklyReview } from "@/lib/executive-reviews/types"

interface Props {
  latestReview: WeeklyReview | null
  accentColor: string
}

export function HQExecutiveReview({ latestReview, accentColor }: Props) {
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
          <FileText className="h-4 w-4" style={{ color: accentColor }} aria-hidden />
        </span>
        <h2 className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
          Executive Review Engine™
        </h2>
      </div>

      {latestReview ? (
        <div className="flex flex-col gap-4 flex-1">
          {/* Score + period */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-playfair text-3xl font-bold leading-none text-[#1C161A]">
                {latestReview.harmonyScore.overall}
                <span className="font-montserrat text-sm font-normal text-[#9CA3AF]"> / 100</span>
              </p>
              <p className="mt-1 font-montserrat text-xs text-[#9CA3AF]">
                Week of {new Date(latestReview.period.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {(["balance", "momentum", "wellbeing"] as const).map((dim) => (
                <div key={dim} className="flex items-center gap-2">
                  <span className="font-montserrat text-[10px] capitalize text-[#9CA3AF]">{dim}</span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-black/[0.07]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${latestReview.harmonyScore[dim]}%`, backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top win */}
          {latestReview.wins.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg p-3" style={{ backgroundColor: accentColor + "0A" }}>
              <Star className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} aria-hidden />
              <p className="font-montserrat text-xs leading-relaxed text-[#5C4F55]">
                {latestReview.wins[0]}
              </p>
            </div>
          )}

          <Link
            href="/executive-reviews"
            className="mt-auto inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            Full review
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          <p className="font-montserrat text-sm leading-relaxed text-[#5C4F55]">
            Your Weekly Executive Review synthesises your GPS history, adaptation patterns, and Harmony data into a single operating picture. Generate your first review to unlock your Harmony Score™.
          </p>
          <Link
            href="/executive-reviews"
            className="inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            Generate first review
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}
