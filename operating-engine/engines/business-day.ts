/**
 * Business Day Engine
 * Resolves the current/previous/next block, countdown to the next block,
 * the hero status badge, progress through the open day, and the full
 * timeline with per-block presentation state.
 */
import type { BlockConfig, BusinessDayState, SessionStatus, TimeContext, TimelineEntry } from "../types"
import {
  COMMUNITY_CLOSE_MINUTES,
  COMMUNITY_OPEN_MINUTES,
  SCHEDULE,
  SCHEDULE_BY_ID,
  nextReachableIndex,
  previousReachableIndex,
  resolveEffectiveBlock,
} from "../config/schedule"
import { buildCountdown } from "./time"
import { getCurrentBlockIndex } from "./circadian"

/** Minutes until a target start time, wrapping forward across midnight. */
function minutesUntil(fromMinutes: number, targetMinutes: number): number {
  let diff = targetMinutes - fromMinutes
  if (diff <= 0) diff += 24 * 60
  return diff
}

/**
 * Returns the semantically correct next operating segment for the given moment.
 *
 * The naive `SCHEDULE[(index + 1) % len]` approach works for most blocks but
 * breaks for `digital-detox` (11 PM → 7 AM) because that block wraps midnight
 * across multiple calendar days.  During the Time Freedom™ weekend
 * (Thu 17:00 → Mon 07:00) the night after `digital-detox` is still Time
 * Freedom™ — NOT Early Access™.  Only Sunday night's closure leads back into
 * Early Access™.
 *
 * Official weekend transitions:
 *   Thu night  → Time Freedom™   (Fri)
 *   Fri night  → Time Freedom™   (Sat)
 *   Sat night  → Time Freedom™   (Sun)
 *   Sun night  → Early Access™   (Mon 7 AM)
 *
 * For every other block this function simply returns the next array element,
 * preserving all existing behaviour.
 *
 * @param currentIndex  Index of the currently-active block in SCHEDULE.
 * @param time          Full time context (supplies dayOfWeek + minutesSinceMidnight).
 */
export function getNextOperatingSegment(currentIndex: number, time: TimeContext): BlockConfig {
  const len = SCHEDULE.length
  const current = SCHEDULE[currentIndex]

  // Only the overnight closure ("digital-detox") needs bespoke day-aware
  // logic below. For all other blocks, advance to the next reachable block
  // (skipping `mondayOnly` blocks on every day except Monday) and apply that
  // block's day-aware timing.
  if (current.id !== "digital-detox") {
    return resolveEffectiveBlock(SCHEDULE[nextReachableIndex(currentIndex, time.dayOfWeek)], time.dayOfWeek)
  }

  // digital-detox spans 11 PM → 7 AM.  The "next" segment depends on which
  // calendar day the block WILL END on (i.e. the morning after tonight).
  //
  // We derive the upcoming morning's day-of-week:
  //   • If it's currently past midnight (0:00–6:59) the morning is TODAY.
  //   • If it's currently 23:00+ the morning is TOMORROW (dayOfWeek + 1 mod 7).
  const isPastMidnight = time.minutesSinceMidnight < 7 * 60 // 00:00–06:59
  const morningDayOfWeek = isPastMidnight
    ? time.dayOfWeek                          // already past midnight, still same calendar day
    : (time.dayOfWeek + 1) % 7               // 11 PM — morning is the next calendar day

  // Sunday night (morningDayOfWeek === 1, i.e. Monday morning) → Early Access™
  // All other nights within Time Freedom™ weekend → Time Freedom™ continues
  if (morningDayOfWeek === 1) {
    // Sunday night → Monday morning: re-enter the standard schedule via Early Access™
    return SCHEDULE_BY_ID["early-access"] ?? SCHEDULE[(currentIndex + 1) % len]
  }

  // Thu / Fri / Sat night → Time Freedom™ continues the next day
  // dayOfWeek of the morning: 5 = Fri, 6 = Sat, 0 = Sun → all Time Freedom™
  if ([5, 6, 0].includes(morningDayOfWeek)) {
    return SCHEDULE_BY_ID["time-freedom"] ?? SCHEDULE[(currentIndex + 1) % len]
  }

  // Tue / Wed / Thu night → standard weekday morning (Early Access™ at 7 AM).
  // Resolved explicitly by id (rather than falling through to array-next)
  // so this stays correct regardless of where blocks sit in SCHEDULE.
  return SCHEDULE_BY_ID["early-access"] ?? SCHEDULE[(currentIndex + 1) % len]
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

/** Build the per-block timeline with current/upcoming/completed states.
 *  Blocks marked `mondayOnly` are excluded on every day except Monday (dayOfWeek === 1).
 *  Every block's day-aware timing (see `resolveEffectiveBlock`) is applied, so
 *  Monday's resequenced morning (Morning GIV•EN™ → Reality Check™ → Debrief™
 *  → Movement™ → Lunch™) renders with the correct times automatically.
 */
function buildTimeline(currentIndex: number, dayOfWeek: number): TimelineEntry[] {
  const isMonday = dayOfWeek === 1
  return SCHEDULE.flatMap((block, index) => {
    // Hide mondayOnly blocks on non-Monday days
    if (block.mondayOnly && !isMonday) return []
    const resolvedBlock = resolveEffectiveBlock(block, dayOfWeek)
    let state: TimelineEntry["state"] = "upcoming"
    if (index === currentIndex) state = "current"
    else if (index < currentIndex) state = "completed"
    return [{ block: resolvedBlock, state }]
  })
}

/** Days that are Time Freedom™ all-day (7 AM → 11 PM). */
const WEEKEND_DAYS = new Set([5, 6, 0]) // Fri, Sat, Sun

/** Returns true when the given day is a Time Freedom weekend day. */
function isWeekendDay(dayOfWeek: number): boolean {
  return WEEKEND_DAYS.has(dayOfWeek)
}

export function getBusinessDayState(time: TimeContext): BusinessDayState {
  const minutes = time.minutesSinceMidnight
  const len = SCHEDULE.length

  // ── Weekend override ───────────────────────────────────────────────────────
  // On Fri / Sat / Sun, Time Freedom™ runs all day from 7 AM.
  // Before 7 AM those days are still Digital Detox (overnight closure).
  //
  // Fri/Sat run all the way to 11 PM before closing.
  // Sunday closes ONE HOUR EARLIER (10 PM) to prepare members for
  // Make Time For More On Mondays™ — after 10 PM Sunday, control falls
  // through to the standard weekday schedule below, which already has a
  // real Power Down™ (10–11 PM) → Digital Detox™ (11 PM–7 AM) sequence
  // that leads correctly into Monday's Early Access™.
  const tfBlock = SCHEDULE_BY_ID["time-freedom"]!
  const detoxBlock = SCHEDULE_BY_ID["digital-detox"]!
  const tfWeekendStart = tfBlock.weekendStartMinutes ?? 7 * 60 // 420
  const isSunday = time.dayOfWeek === 0
  const tfCloseMinutes = isSunday ? 22 * 60 : 23 * 60 // Sun 10 PM · Fri/Sat 11 PM

  const inWeekendOvernightClosure = isWeekendDay(time.dayOfWeek) && minutes < tfWeekendStart
  const inWeekendTimeFreedom =
    isWeekendDay(time.dayOfWeek) && minutes >= tfWeekendStart && minutes < tfCloseMinutes

  if (inWeekendOvernightClosure) {
    // Still in overnight Digital Detox — Time Freedom starts at 7 AM.
    const current = detoxBlock
    const nextLabel = isSunday ? tfBlock.sundayTimeLabel : tfBlock.weekendTimeLabel
    const next: BlockConfig = { ...tfBlock, timeLabel: nextLabel ?? tfBlock.timeLabel }
    const minutesUntilNext = tfWeekendStart - minutes
    const status = resolveStatus(current, next, minutesUntilNext)
    const detoxIndex = SCHEDULE.findIndex((b) => b.id === "digital-detox")

    return {
      current,
      previous: SCHEDULE[(detoxIndex - 1 + len) % len],
      next,
      minutesUntilNext,
      countdownToNext: buildCountdown(minutesUntilNext),
      status,
      progress: resolveProgress(minutes),
      timeline: buildTimeline(detoxIndex, time.dayOfWeek),
    }
  }

  if (inWeekendTimeFreedom) {
    // Effective timeLabel for the panel: Sunday closes an hour earlier than Fri/Sat.
    const label = isSunday ? tfBlock.sundayTimeLabel : tfBlock.weekendTimeLabel
    const currentWithLabel: BlockConfig = { ...tfBlock, timeLabel: label ?? tfBlock.timeLabel }

    // "Next" is the wind-down transition at close — always framed as
    // Power Down & Unplug™, with the countdown pointed at the correct
    // close time for the day (10 PM Sunday · 11 PM Fri/Sat).
    const next: BlockConfig = {
      ...detoxBlock,
      title: "Power Down & Unplug™",
      shortTitle: "Power Down & Unplug™",
      startMinutes: tfCloseMinutes,
    }
    const minutesUntilNext = minutesUntil(minutes, tfCloseMinutes)
    const tfIndex = SCHEDULE.findIndex((b) => b.id === "time-freedom")
    const status = resolveStatus(currentWithLabel, next, minutesUntilNext)

    return {
      current: currentWithLabel,
      previous: SCHEDULE[(tfIndex - 1 + len) % len],
      next,
      minutesUntilNext,
      countdownToNext: buildCountdown(minutesUntilNext),
      status,
      progress: resolveProgress(minutes),
      timeline: buildTimeline(tfIndex, time.dayOfWeek),
    }
  }
  // ── Standard weekday logic ────────────────────────────────────────────────
  // Also covers Sunday from 10 PM onward: Power Down™ (10–11 PM) → Digital
  // Detox™ (11 PM–7 AM), which getNextOperatingSegment already resolves into
  // Monday's Early Access™.

  const currentIndex = getCurrentBlockIndex(minutes, time.dayOfWeek)
  const current: BlockConfig = resolveEffectiveBlock(SCHEDULE[currentIndex], time.dayOfWeek)
  const previous = resolveEffectiveBlock(
    SCHEDULE[previousReachableIndex(currentIndex, time.dayOfWeek)],
    time.dayOfWeek,
  )
  const next = getNextOperatingSegment(currentIndex, time)

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
    timeline: buildTimeline(currentIndex, time.dayOfWeek),
  }
}
