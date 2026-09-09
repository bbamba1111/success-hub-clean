/**
 * CEO Workday™ hour blocks — deterministic, schedule-anchored timing.
 * ---------------------------------------------------------------------------
 * The 4-Hour Focused CEO Workday™ runs 1:00–5:00 PM platform time
 * (operating-engine/config/schedule.ts → "ceo-workday": 13:00–17:00).
 * Four hourly blocks; each block's 5-Minute Check-In™ opens at EXACTLY
 * block end − 5 minutes (1:55, 2:55, 3:55, 4:55). Nothing here is random
 * or timer-drift based: everything is derived from the platform wall clock.
 *
 * Pure functions — safe on server and client. Tests: scripts/dev/phase-ceo-workday-fixtures.ts
 */

import { PLATFORM_TIMEZONE, SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"

export type HourBlockIndex = 1 | 2 | 3 | 4

export interface HourBlock {
  index: HourBlockIndex
  /** minutes since midnight, platform tz */
  startMin: number
  endMin: number
  /** endMin − 5 */
  checkinMin: number
  label: string // "1:00–2:00"
  checkinLabel: string // "1:55 PM"
}

export const CHECKIN_LEAD_MINUTES = 5

const CEO_BLOCK = SCHEDULE_BY_ID["ceo-workday"]
export const CEO_WORKDAY_START_MIN = CEO_BLOCK?.startMinutes ?? 13 * 60
export const CEO_WORKDAY_END_MIN = CEO_BLOCK?.endMinutes ?? 17 * 60

function fmt(min: number): string {
  const h24 = Math.floor(min / 60)
  const m = min % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, "0")}`
}
function ampm(min: number): string {
  return `${fmt(min)} ${Math.floor(min / 60) >= 12 ? "PM" : "AM"}`
}

export const HOUR_BLOCKS: readonly HourBlock[] = ([1, 2, 3, 4] as HourBlockIndex[]).map((index) => {
  const startMin = CEO_WORKDAY_START_MIN + (index - 1) * 60
  const endMin = startMin + 60
  return {
    index,
    startMin,
    endMin,
    checkinMin: endMin - CHECKIN_LEAD_MINUTES,
    label: `${fmt(startMin)}–${fmt(endMin)}`,
    checkinLabel: ampm(endMin - CHECKIN_LEAD_MINUTES),
  }
})

/** Platform-tz minutes since midnight for an instant. */
export function platformMinutes(now: Date = new Date(), timeZone: string = PLATFORM_TIMEZONE): number {
  const zoned = new Date(now.toLocaleString("en-US", { timeZone }))
  return zoned.getHours() * 60 + zoned.getMinutes()
}

/** Platform-tz seconds since midnight (for precise check-in gating). */
export function platformSeconds(now: Date = new Date(), timeZone: string = PLATFORM_TIMEZONE): number {
  const zoned = new Date(now.toLocaleString("en-US", { timeZone }))
  return zoned.getHours() * 3600 + zoned.getMinutes() * 60 + zoned.getSeconds()
}

/** Which block contains `minutes`, or null outside 1–5 PM. */
export function currentHourBlock(minutes: number): HourBlock | null {
  return HOUR_BLOCKS.find((b) => minutes >= b.startMin && minutes < b.endMin) ?? null
}

/**
 * Whether the check-in for `block` is due: the platform clock is at/after
 * block end − 5 min AND before the block ends (window closes at end; a
 * missed check-in is still openable manually and is reported as late).
 */
export function isCheckinDue(block: HourBlock, minutes: number): boolean {
  return minutes >= block.checkinMin && minutes < block.endMin
}

/** Check-in was missed (block already ended) and hasn't been saved. */
export function isCheckinOverdue(block: HourBlock, minutes: number): boolean {
  return minutes >= block.endMin
}

/** Whole minutes until the block's check-in opens (0 if now/past). */
export function minutesUntilCheckin(block: HourBlock, minutes: number): number {
  return Math.max(0, block.checkinMin - minutes)
}

/** ISO timestamp for a block's scheduled check-in on a given platform date (YYYY-MM-DD). */
export function scheduledCheckinIso(block: HourBlock, dateKey: string, timeZone: string = PLATFORM_TIMEZONE): string {
  // Build the wall-clock instant in the platform tz, then convert to a real instant.
  const [y, mo, d] = dateKey.split("-").map(Number)
  const h = Math.floor(block.checkinMin / 60)
  const m = block.checkinMin % 60
  // Find UTC offset for that tz on that date by probing.
  const probe = new Date(Date.UTC(y, mo - 1, d, h, m, 0))
  const zonedProbe = new Date(probe.toLocaleString("en-US", { timeZone }))
  const offsetMs = probe.getTime() - zonedProbe.getTime()
  return new Date(probe.getTime() + offsetMs).toISOString()
}

/** Blocks whose check-in has not yet been saved, in order. */
export function pendingBlocks(savedBlocks: ReadonlySet<number>): HourBlock[] {
  return HOUR_BLOCKS.filter((b) => !savedBlocks.has(b.index))
}

/** The block whose check-in should be surfaced right now (due or overdue, unsaved), else null. */
export function blockNeedingCheckin(minutes: number, savedBlocks: ReadonlySet<number>): HourBlock | null {
  for (const b of HOUR_BLOCKS) {
    if (savedBlocks.has(b.index)) continue
    if (isCheckinDue(b, minutes) || isCheckinOverdue(b, minutes)) return b
    break // earlier blocks gate later ones
  }
  return null
}
