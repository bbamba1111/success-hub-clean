/**
 * Segment check-in timing — the ONE rule for every Business Day™ segment.
 * ---------------------------------------------------------------------------
 * A segment's 5-Minute Check-In™ opens exactly:
 *
 *     checkInTime = segment end − 5 minutes
 *
 * derived from the segment's ACTUAL configured start/end in the canonical
 * schedule (respecting Monday overrides). It is NOT a fixed "every 55 minutes"
 * or "one hour" assumption — the same calculation holds for a 30-minute,
 * 45-minute, 2-hour, or 4-hour segment.
 *
 *   Morning GIV•EN™  9:00–9:45   → 9:40
 *   Decide & Design™ 9:45–10:30  → 10:25
 *   Movement™        10:30–11:00 → 10:55
 *   Lunch™           11:00–1:00  → 12:55
 *   CEO Workday™     1:00–5:00   → 4:55 (segment level)
 *   Time Freedom™    5:00–10:00  → 9:55
 *   Power Down™      10:00–11:00 → 10:55
 *
 * The check-in is NOT visible before its five-minute window. If the founder
 * misses the window it stays available as an outstanding check-in (never
 * auto-deleted); persistence of the completed/outstanding state is the caller's
 * responsibility.
 *
 * NOTE: the CEO Workday™ ALSO has four internal hourly check-ins
 * (1:55 / 2:55 / 3:55 / 4:55) computed the same way per hour block in
 * `lib/ceo-workday/hour-blocks.ts`. Those are separate from this
 * Business-Day-segment-level timing and are intentionally kept distinct.
 *
 * Pure functions — safe on server and client.
 */

import { SCHEDULE_BY_ID, resolveEffectiveBlock } from "@/operating-engine/config/schedule"

/** Every segment check-in opens exactly this many minutes before the segment ends. */
export const CHECKIN_LEAD_MINUTES = 5

/** Minutes since local midnight for `now`. */
function localMinutes(now: Date): number {
  return now.getHours() * 60 + now.getMinutes()
}

/** Effective start/end (minutes since midnight) for a segment on a given weekday. */
function effectiveWindow(blockId: string, dayOfWeek: number): { start: number; end: number } | null {
  const block = SCHEDULE_BY_ID[blockId]
  if (!block) return null
  const eff = resolveEffectiveBlock(block, dayOfWeek)
  return { start: eff.startMinutes, end: eff.endMinutes }
}

/**
 * The minute-since-midnight at which this segment's check-in opens:
 * effective end − 5 minutes. Returns null for an unknown segment.
 */
export function segmentCheckinMinutes(blockId: string, dayOfWeek: number): number | null {
  const win = effectiveWindow(blockId, dayOfWeek)
  if (!win) return null
  return win.end - CHECKIN_LEAD_MINUTES
}

function fmt(min: number): string {
  const wrapped = ((min % 1440) + 1440) % 1440
  const h24 = Math.floor(wrapped / 60)
  const m = wrapped % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const suffix = h24 >= 12 ? "PM" : "AM"
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`
}

/** Human label for a segment's check-in time, e.g. "10:55 AM". Empty for unknown segments. */
export function segmentCheckinLabel(blockId: string, dayOfWeek = 2): string {
  const min = segmentCheckinMinutes(blockId, dayOfWeek)
  return min === null ? "" : fmt(min)
}

/**
 * Whether a segment's check-in is OPEN right now (i.e. the local clock has
 * reached end − 5 min). It intentionally stays open past the segment end so a
 * founder who missed the window can still complete an outstanding check-in.
 * Returns true for unknown segments (no gate).
 */
export function isSegmentCheckInOpen(blockId: string, now: Date = new Date(), dayOfWeek = now.getDay()): boolean {
  const checkinMin = segmentCheckinMinutes(blockId, dayOfWeek)
  if (checkinMin === null) return true
  return localMinutes(now) >= checkinMin
}

/**
 * Whether the check-in is strictly WITHIN its five-minute due window
 * (end − 5 ≤ now < end). Use this to distinguish "due now" from "missed but
 * still openable".
 */
export function isSegmentCheckInDue(blockId: string, now: Date = new Date(), dayOfWeek = now.getDay()): boolean {
  const win = effectiveWindow(blockId, dayOfWeek)
  if (!win) return false
  const min = localMinutes(now)
  return min >= win.end - CHECKIN_LEAD_MINUTES && min < win.end
}
