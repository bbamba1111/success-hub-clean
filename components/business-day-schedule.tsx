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
import { SCHEDULE, SCHEDULE_BY_ID, type BlockConfig } from "@/operating-engine"
import { SEGMENT_ABOUT, renderSegmentAbout } from "@/operating-engine/config/segment-about"

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

  // Monday-only logic:
  //   - Insert "Make Time For More On Mondays™" (monday-reality-check) after early-access.
  //   - Shift morning-given time label to 9:30–10:30 AM on Mondays.
  //   - On Tue–Thu morning-given stays at 9:00–10:30 AM.
  //   - monday-reality-check auto-hides once past 9:30 AM.
  const isMonday = experience ? experience.time.dayOfWeek === 1 : new Date().getDay() === 1
  const currentMinutes = experience?.time.minutesSinceMidnight ?? (new Date().getHours() * 60 + new Date().getMinutes())

  const mondayRealityCheck = SCHEDULE_BY_ID["monday-reality-check"]
  const showRealityCheck = isMonday && currentMinutes < 9 * 60 + 30

  const timeline = rawTimeline.flatMap(({ block, state }) => {
    // On Mondays, shift morning-given time display to 9:30–10:30 AM
    if (isMonday && block.id === "morning-given") {
      const shifted = { ...block, timeLabel: "9:30–10:30 AM" }
      return [{ block: shifted, state }]
    }
    // After early-access on Mondays, inject the reality check card
    if (block.id === "early-access") {
      const result: typeof rawTimeline = [{ block, state }]
      if (showRealityCheck && mondayRealityCheck) {
        const checkState: "current" | "upcoming" | "completed" =
          currentMinutes >= 9 * 60 ? "current" : "upcoming"
        result.push({ block: mondayRealityCheck, state: checkState })
      }
      return result
    }
    return [{ block, state }]
  })

  return (
    <div id="todays-business-day" className="w-full scroll-mt-20 pb-8 pt-4" style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)" }}>
      <div className="mx-auto max-w-7xl">

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
              buttonText={block.mondayOnly ? block.cta : "Continue Segment™"}
              status={state}
              blockId={block.id}
              description={block.description}
              onAction={scrollToOperatingPlanner}
              segmentProgress={timing?.progress}
              segmentRemaining={timing?.remaining}
              operatingRulePreview={ruleBySegment[block.id]}
              aboutContent={
                SEGMENT_ABOUT[block.id]
                  ? renderSegmentAbout(SEGMENT_ABOUT[block.id])
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
