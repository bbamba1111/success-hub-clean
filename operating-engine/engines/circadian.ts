/**
 * Circadian Rhythm Engine
 * Determines the current phase of the Work-Life Balance Business Day™
 * from the resolved time, and exposes block-index helpers reused by the
 * Business Day Engine.
 */
import type { BlockConfig, CircadianPhase, TimeContext } from "../types"
import { SCHEDULE, resolveEffectiveBlock } from "../config/schedule"
import { pickDaily } from "./time"

/** Does `minutes` fall within [start, end), accounting for blocks that wrap midnight? */
function isWithinBlock(minutes: number, block: BlockConfig): boolean {
  const { startMinutes, endMinutes } = block
  if (startMinutes <= endMinutes) {
    return minutes >= startMinutes && minutes < endMinutes
  }
  // Wrapping block (e.g. 23:00 → 07:00): match late-night OR early-morning.
  return minutes >= startMinutes || minutes < endMinutes
}

/**
 * Index of the block active at the given minutes-since-midnight, for the
 * given day of week. `mondayOnly` blocks (Make Time For More On Mondays™)
 * are only eligible to match on Monday; every block's effective (day-aware)
 * start/end minutes are used, so Monday's resequenced morning resolves
 * correctly.
 */
export function getCurrentBlockIndex(minutesSinceMidnight: number, dayOfWeek: number): number {
  const isMonday = dayOfWeek === 1
  const index = SCHEDULE.findIndex((block) => {
    if (block.mondayOnly && !isMonday) return false
    return isWithinBlock(minutesSinceMidnight, resolveEffectiveBlock(block, dayOfWeek))
  })
  // Fallback to the wrapping detox block if nothing matched (should not happen).
  return index === -1 ? SCHEDULE.length - 1 : index
}

/** The block active right now (with Monday time overrides already applied). */
export function getCurrentBlock(time: TimeContext): BlockConfig {
  const index = getCurrentBlockIndex(time.minutesSinceMidnight, time.dayOfWeek)
  return resolveEffectiveBlock(SCHEDULE[index], time.dayOfWeek)
}

/** Resolve the full circadian phase for the current moment. */
export function getCircadianPhase(time: TimeContext): CircadianPhase {
  const block = getCurrentBlock(time)
  const message = pickDaily(block.messages, time.dayOfYear, block.messages[0])

  return {
    block,
    part: block.part,
    greetingPeriod: block.greetingPeriod,
    greetingEmoji: block.greetingEmoji,
    message,
  }
}
