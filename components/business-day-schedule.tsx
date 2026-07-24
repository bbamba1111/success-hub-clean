"use client"

/**
 * BusinessDaySchedule — pure presentation layer for the Work-Life Balance
 * Business Day™ timeline.
 *
 * The full list of blocks, their order, times, images, tints, CTAs, and the
 * per-block current/upcoming/completed state all come from the shared
 * Operating Engine via `useOperatingEngine()`. This component just maps the
 * engine's timeline into cards — it owns no schedule data or time logic.
 */

import { useMemo } from "react"
import useSWR from "swr"
import { BusinessDayBlock } from "@/components/business-day-block"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useHarmonyWeek } from "@/components/harmony-week/harmony-week-provider"
import { getActiveRules } from "@/lib/operating-rules/storage"
import { SCHEDULE, type BlockConfig } from "@/operating-engine"

/** Smoothly bring the member to the Operating Planner™ workspace below the hero. */
function scrollToOperatingPlanner() {
  document.getElementById("operating-planner")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Elapsed progress (0–100) and a human "time left" label for a segment,
 * given the current minutes-since-midnight. Handles the block that wraps
 * past midnight (end <= start).
 */
function segmentTiming(block: BlockConfig, minutes: number): { progress: number; remaining: string } {
  let start = block.startMinutes
  let end = block.endMinutes
  let now = minutes
  if (end <= start) {
    end += 24 * 60
    if (now < start) now += 24 * 60
  }
  const span = end - start
  const elapsed = Math.min(span, Math.max(0, now - start))
  const progress = span > 0 ? Math.round((elapsed / span) * 100) : 0

  const minsLeft = Math.max(0, end - now)
  const hrs = Math.floor(minsLeft / 60)
  const mins = minsLeft % 60
  const remaining = hrs > 0 ? `${hrs}h ${String(mins).padStart(2, "0")}m left` : `${mins}m left`

  return { progress, remaining }
}

export function BusinessDaySchedule() {
  const experience = useOperatingEngine()
  const harmonyWeek = useHarmonyWeek()

  // Each segment's current Operating Rule™, loaded once (newest-first) and
  // mapped by segment so every card can preview its guiding commitment.
  const { data: activeRules } = useSWR("operating-rules:active", getActiveRules)
  const ruleBySegment = useMemo(() => {
    const map: Record<string, string> = {}
    for (const rule of activeRules ?? []) {
      if (!map[rule.operatingSegment]) map[rule.operatingSegment] = rule.ruleText
    }
    return map
  }, [activeRules])

  // Before the first client tick, render the schedule with no active highlight
  // (every block "upcoming") so the markup is stable and SSR-safe.
  const rawTimeline =
    experience?.businessDay.timeline ?? SCHEDULE.map((block) => ({ block, state: "upcoming" as const }))

  // During Time Freedom™ (Thu 5 PM → Mon 7 AM) hide the CEO Workday block
  // from the daily schedule — founders are off the operating clock.
  const timeline = harmonyWeek?.isTimeFreedomNow
    ? rawTimeline.filter(({ block }) => block.id !== "ceo-workday")
    : rawTimeline

  return (
    <div id="todays-business-day" className="w-full scroll-mt-20 bg-white pb-8 pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pb-3 text-center">
          <h2 className="text-pretty font-playfair text-3xl font-medium text-[#5B835F] sm:text-4xl">
            Live Your New 9-5 &amp; Nighttime <span className="italic text-[#C13B6B]">Non-Negotiable</span> SOPs
          </h2>
          <p className="mt-1 font-montserrat text-sm font-thin italic text-[#6B5860]">
            (Sustainable Operating Practices)
          </p>
        </div>

        {/* Frosted-glass status bar — matches the width of the cards below */}
        <div className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl px-6 py-5 text-center">
            <p className="text-pretty font-playfair text-xl font-medium italic text-[#3A2E33] sm:text-2xl">
              {experience
                ? `${experience.time.dayName}'s ${experience.businessDay.next.shortTitle} starts in ${experience.businessDay.countdownToNext.label}...`
                : "Continue into today's rhythm..."}
            </p>
          </div>
        </div>

        {timeline.map(({ block, state }) => {
          const timing =
            state === "current" && experience
              ? segmentTiming(block, experience.time.minutesSinceMidnight)
              : null
          return (
            <BusinessDayBlock
              key={block.id}
              sectionId={block.sectionId}
              backgroundImage={block.backgroundImage}
              tint={block.tint}
              emoji={block.emoji}
              time={block.timeLabel}
              title={block.title}
              buttonText="Continue Segment™"
              status={state}
              description={block.description}
              onAction={scrollToOperatingPlanner}
              segmentProgress={timing?.progress}
              segmentRemaining={timing?.remaining}
              operatingRulePreview={ruleBySegment[block.id]}
            />
          )
        })}
      </div>
    </div>
  )
}
