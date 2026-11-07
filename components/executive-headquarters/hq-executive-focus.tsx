"use client"

/**
 * HQExecutiveFocus — Phase 15.2
 * Today's single highest-leverage focus block, derived from GPS history.
 * One recommendation, one CTA. No noise.
 */

import Link from "next/link"
import { ArrowRight, Target } from "lucide-react"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"

interface Props {
  latestFocus: RecommendationHistoryEntry | null
  accentColor: string
}

export function HQExecutiveFocus({ latestFocus, accentColor }: Props) {
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
          <Target className="h-4 w-4" style={{ color: accentColor }} aria-hidden />
        </span>
        <h2 className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
          Today&apos;s Executive Focus™
        </h2>
      </div>

      {latestFocus ? (
        <>
          <div className="flex flex-col gap-2 flex-1">
            <p className="font-playfair text-xl font-semibold leading-snug text-[#1C161A]">
              {latestFocus.recommendationTitle}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="rounded-full px-2.5 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: accentColor + "12", color: accentColor }}
              >
                {latestFocus.segmentId.replace(/-/g, " ")}
              </span>
              <span className="font-montserrat text-xs text-[#9CA3AF]">
                {new Date(latestFocus.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            {latestFocus.reflection && (
              <p className="mt-1 font-montserrat text-sm italic leading-relaxed text-[#5C4F55]">
                &ldquo;{latestFocus.reflection}&rdquo;
              </p>
            )}
          </div>

          <Link
            href="/my-harmony"
            className="inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            View full GPS
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          <p className="font-montserrat text-sm leading-relaxed text-[#5C4F55]">
            Your Founder GPS™ has not generated a recommendation yet. Complete your onboarding to activate your personalised executive focus.
          </p>
          <Link
            href="/my-harmony"
            className="inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            Activate Founder GPS™
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}
