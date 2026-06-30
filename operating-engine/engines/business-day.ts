/**
 * Business Day Engine
 * Resolves the current/previous/next block, countdown to the next block,
 * the hero status badge, progress through the open day, and the full
 * timeline with per-block presentation state.
 */
import type { BusinessDayState, SessionStatus, TimeContext, TimelineEntry } from "../types"
import { COMMUNITY_CLOSE_MINUTES, COMMUNITY_OPEN_MINUTES, SCHEDULE } from "../config/schedule"
import { buildCountdown } from "./time"
import { getCurrentBlockIndex } from "./circadian"

/** Minutes until a target start time, wrapping forward across midnight. */
function minutesUntil(fromMinutes: number, targetMinutes: number): number {
  let diff = targetMinutes - fromMinutes
  if (diff <= 0) diff += 24 * 60
  return diff
}

/** Window (in minutes before start) during which a live block reads as "STARTING NEXT". */
const NEXT_LEAD_MINUTES = 15

/**
 * Resolve the hero/community status badge:
 * - NIGHT  → community closed (digital detox)
 * - NEXT   → a live-room block starts within NEXT_LEAD_MINUTES
 * - LIVE   → current block hosts a live room
 * - OPEN   → community open, no live room active
 */
function resolveStatus(current: (typeof SCHEDULE)[number], next: (typeof SCHEDULE)[number], minutesUntilNext: number): SessionStatus {
  if (current.engagement === "closed") return "NIGHT"
  if (next.engagement === "live-room" && minutesUntilNext <= NEXT_LEAD_MINUTES) return "NEXT"
  if (current.engagement === "live-room") return "LIVE"
  return "OPEN"
}

/** Progress (0–100) through the open business day (07:00–23:00). */
function resolveProgress(minutes: number): number {
  if (minutes <= COMMUNITY_OPEN_MINUTES) return 0
  if (minutes >= COMMUNITY_CLOSE_MINUTES) return 100
  const span = COMMUNITY_CLOSE_MINUTES - COMMUNITY_OPEN_MINUTES
  return Math.round(((minutes - COMMUNITY_OPEN_MINUTES) / span) * 100)
}

/** Build the per-block timeline with current/upcoming/completed states. */
function buildTimeline(currentIndex: number): TimelineEntry[] {
  return SCHEDULE.map((block, index) => {
    let state: TimelineEntry["state"] = "upcoming"
    if (index === currentIndex) state = "current"
    else if (index < currentIndex) state = "completed"
    return { block, state }
  })
}

export function getBusinessDayState(time: TimeContext): BusinessDayState {
  const minutes = time.minutesSinceMidnight
  const currentIndex = getCurrentBlockIndex(minutes)
  const len = SCHEDULE.length

  const current = SCHEDULE[currentIndex]
  const previous = SCHEDULE[(currentIndex - 1 + len) % len]
  const next = SCHEDULE[(currentIndex + 1) % len]

  const minutesUntilNext = minutesUntil(minutes, next.startMinutes)
  const status = resolveStatus(current, next, minutesUntilNext)

  return {
    current,
    previous,
    next,
    minutesUntilNext,
    countdownToNext: buildCountdown(minutesUntilNext),
    status,
    progress: resolveProgress(minutes),
    timeline: buildTimeline(currentIndex),
  }
}
