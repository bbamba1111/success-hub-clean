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

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { DailyTransition } from "@/components/cherry-blossom/daily-transition"
import { BusinessDayBlock } from "@/components/business-day-block"
import { useActiveSpace } from "@/components/active-space-provider"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useHarmonyWeek } from "@/components/harmony-week/harmony-week-provider"
import { getActiveRules } from "@/lib/operating-rules/storage"
import { SCHEDULE, type BlockConfig } from "@/operating-engine"
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

interface TransitionState {
  from: { id: string; shortTitle: string }
  to: { id: string; shortTitle: string }
}

export function BusinessDaySchedule() {
  const experience = useOperatingEngine()
  const harmonyWeek = useHarmonyWeek()
  const activeSpace = useActiveSpace()
  const [activeTransition, setActiveTransition] = useState<TransitionState | null>(null)

  // Hand-off from other pages (e.g. Reality Check™'s "Design My Week™" CTA)
  // arrives as `?openSpace=<blockId>`. Once the timeline/DOM has mounted, force
  // that block's accordion open and scroll to it via the same `enterSpace()`
  // used by every other "Enter the Space™" trigger, then strip the param so a
  // refresh doesn't re-trigger the jump. Read via plain `window.location` (not
  // `useSearchParams`) since this only ever needs to run once, client-side,
  // after mount — no Suspense boundary required.
  useEffect(() => {
    if (!activeSpace) return
    const params = new URLSearchParams(window.location.search)
    const openSpaceId = params.get("openSpace")
    if (!openSpaceId) return
    const block = SCHEDULE.find((b) => b.id === openSpaceId)
    if (!block) return
    const timer = setTimeout(() => {
      activeSpace.enterSpace(block.id, block.sectionId)
      params.delete("openSpace")
      const query = params.toString()
      window.history.replaceState({}, "", query ? `/?${query}` : "/")
    }, 50)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSpace])

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
  // (every block "upcoming") so the markup is stable and SSR-safe. The engine's
  // `buildTimeline` already inserts Monday-only blocks (Reality Check™,
  // Debrief™) in the correct chronological position and applies each block's
  // Monday-specific timing via `resolveEffectiveBlock` — no manual
  // re-sequencing is needed here.
  const timeline =
    experience?.businessDay.timeline ?? SCHEDULE.map((block) => ({ block, state: "upcoming" as const }))

  // Build a lookup from block id → next block's shortTitle for transition labels
  const nextBlockById = useMemo(() => {
    const map: Record<string, { id: string; shortTitle: string }> = {}
    for (let i = 0; i < timeline.length - 1; i++) {
      map[timeline[i].block.id] = {
        id: timeline[i + 1].block.id,
        shortTitle: timeline[i + 1].block.shortTitle,
      }
    }
    return map
  }, [timeline])

  return (
    <>
      {/* Passage of Time™ — full-screen cinematic transition overlay */}
      <AnimatePresence>
        {activeTransition && (
          <DailyTransition
            key="daily-transition"
            fromSegment={activeTransition.from}
            toSegment={activeTransition.to}
            onComplete={() => {
              setActiveTransition(null)
              scrollToOperatingPlanner()
            }}
          />
        )}
      </AnimatePresence>

      <div id="todays-business-day" className="w-full scroll-mt-20 pb-8 pt-4" style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)" }}>
        <div className="mx-auto max-w-7xl">

          {timeline.map(({ block, state }) => {
            const timing =
              state === "current" && experience
                ? segmentTiming(block, experience.time.minutesSinceMidnight)
                : null
            const nextBlock = nextBlockById[block.id]
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
                isClosed={block.engagement === "closed"}
                description={block.description}
                onTransition={
                  // Self-guided Monday-only blocks (Reality Check™, Debrief™) use their
                  // own "Begin the ___™" CTA to open their in-card accordion — they must
                  // never skip straight into the Daily Transition™ overlay.
                  state === "current" && nextBlock && !block.mondayOnly
                    ? () =>
                        setActiveTransition({
                          from: { id: block.id, shortTitle: block.shortTitle },
                          to: nextBlock,
                        })
                    : undefined
                }
                onAction={
                  // Self-guided Monday-only blocks (Reality Check™, Debrief™) render
                  // their own ReflectionSpace™/DebriefSpace™ inline — they have no
                  // Operating Planner™ at all, so scrolling to "#operating-planner"
                  // lands on an unrelated element near the hero instead of opening
                  // this card. Use the same "Enter the Space™" expand+scroll used by
                  // every other in-flow hand-off so the CTA opens and scrolls to this
                  // block's own accordion.
                  block.mondayOnly
                    ? () => activeSpace?.enterSpace(block.id, block.sectionId)
                    : scrollToOperatingPlanner
                }
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
    </>
  )
}
