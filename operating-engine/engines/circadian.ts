/**
 * Circadian Rhythm Engine
 * Determines the current phase of the Work-Life Balance Business Day™
 * from the resolved time, and exposes block-index helpers reused by the
 * Business Day Engine.
 */
import type { BlockConfig, CircadianPhase, TimeContext } from "../types"
import { SCHEDULE } from "../config/schedule"
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

/** Index of the block active at the given minutes-since-midnight. */
export function getCurrentBlockIndex(minutesSinceMidnight: number): number {
  const index = SCHEDULE.findIndex((block) => isWithinBlock(minutesSinceMidnight, block))
  // Fallback to the wrapping detox block if nothing matched (should not happen).
  return index === -1 ? SCHEDULE.length - 1 : index
}

/** The block active right now. */
export function getCurrentBlock(time: TimeContext): BlockConfig {
  return SCHEDULE[getCurrentBlockIndex(time.minutesSinceMidnight)]
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
