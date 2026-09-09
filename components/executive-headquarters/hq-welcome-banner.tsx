"use client"

/**
 * HQWelcomeBanner — Phase 15.2
 * Full-width greeting hero for Executive Headquarters™.
 * Shows greeting + time phrase, day theme chip, Harmony Score ring, and
 * the day's Cherry Blossom opening message.
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { HarmonyWeekContextValue } from "@/components/harmony-week/harmony-week-provider"
import type { MemberExperience } from "@/operating-engine"

interface Props {
  experience: MemberExperience | null
  harmonyWeek: HarmonyWeekContextValue | null
  harmonyScore: number | null
  scoreTrend: "up" | "down" | "flat" | null
}

function ScoreRing({ score, accentColor }: { score: number; accentColor: string }) {
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(score, 0), 100) / 100
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
      <svg className="absolute inset-0" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r={radius} stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={accentColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className="font-montserrat text-lg font-bold" style={{ color: accentColor }}>
        {score}
      </span>
    </div>
  )
}

export function HQWelcomeBanner({ experience, harmonyWeek, harmonyScore, scoreTrend }: Props) {
  const greeting = experience?.member.greeting ?? "Good Morning, Friend"
  const currentBlockTitle = experience?.businessDay.current.title ?? "Your Business Day™"
  const accentColor = harmonyWeek?.accent.color ?? "#5D9D61"
  const themeName = harmonyWeek?.themeName ?? "Monday Momentum™"
  const tagline = harmonyWeek?.tagline ?? "Build unstoppable momentum."
  const openingGuidance = harmonyWeek?.cherryBlossomGuidance?.[0] ?? tagline

  const TrendIcon = scoreTrend === "up" ? TrendingUp : scoreTrend === "down" ? TrendingDown : Minus
  const trendColor = scoreTrend === "up" ? "#5D9D61" : scoreTrend === "down" ? "#E26C73" : "#9CA3AF"

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      {/* Subtle tinted wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)` }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: greeting + guidance */}
        <div className="flex flex-col gap-3 min-w-0">
          {/* Day chip */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                backgroundColor: accentColor + "18",
                color: accentColor,
                border: `1px solid ${accentColor}30`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} aria-hidden />
              {themeName}
            </span>
            <span className="font-montserrat text-xs text-[#9CA3AF]">{currentBlockTitle}</span>
          </div>

          {/* Greeting */}
          <h1 className="font-playfair text-3xl font-semibold leading-tight tracking-tight text-[#1C161A] sm:text-4xl text-balance">
            {greeting}
          </h1>

          {/* Cherry Blossom opening guidance */}
          <p className="font-montserrat text-sm leading-relaxed text-[#5C4F55] max-w-xl">
            {openingGuidance}
          </p>
        </div>

        {/* Right: Harmony Score ring */}
        {harmonyScore !== null && (
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <ScoreRing score={harmonyScore} accentColor={accentColor} />
            <div className="flex items-center gap-1">
              <TrendIcon className="h-3.5 w-3.5 shrink-0" style={{ color: trendColor }} aria-hidden />
              <span className="font-montserrat text-[10px] font-semibold uppercase tracking-wide" style={{ color: trendColor }}>
                Harmony Score™
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
