/**
 * Segment Access Control™ — the single source of truth for whether a member
 * may enter a Work-Life Balance Business Day™ segment workspace *right now*.
 *
 * Pure and framework-free (no React, no DOM, no `new Date()`), so it runs
 * identically on the server (middleware backstop) and the client (the
 * in-dashboard segment gate), and is trivially testable.
 *
 * Rule of the rhythm: a member cannot "jump ahead" into a segment before its
 * time has arrived. A gated segment unlocks once the platform clock reaches
 * its effective start time for the day, and then stays open for the rest of
 * that day so the member can revisit it. Segments that don't exist on a given
 * day (e.g. Monday's Reality Check™ on a Wednesday) are locked with a
 * "not-today" reason.
 *
 * Never-locked cases:
 *  - Platform Administrators (Barbara) — see `isAdmin`.
 *  - A live manual override from the Work-Life Balance Access Control™ panel
 *    (Phase D) — see `override`.
 *  - Non-gated, always-open segments (Flex Time™, the overnight Digital
 *    Detox™ closure, which is governed separately by the community lockout).
 */

import { orderedBlocksForDay } from "@/operating-engine/config/schedule"
import type { MemberExperience } from "@/operating-engine/types"

/**
 * Segments whose workspace is time-gated. Everything with an interactive
 * workspace is here; the always-open Flex Time™ (`early-access`) and the
 * overnight `digital-detox` closure are intentionally excluded.
 */
export const GATED_SEGMENT_IDS: ReadonlySet<string> = new Set([
  "monday-reality-check",
  "monday-debrief",
  "monday-transition-break",
  "daily-planning-gps",
  "morning-given",
  "movement-window",
  "lunch-break",
  "ceo-workday",
  "time-freedom",
  "power-down",
])

/**
 * The 5:00 PM workspace close — deliberately NARROW. At 5 PM ONLY these two
 * segments lock for the rest of the day: the 4-Hour Focused CEO Workday™ and
 * Decide & Design My Business Day™ (`monday-debrief`). 5 PM is the end of
 * *work* access, NOT a blanket "lock every workspace" — Flex Time™, Movement™,
 * the Extended Healthy Hybrid Lunch™, Time Freedom™, Power Down & Unplug™, and
 * every other segment stay available on their own schedule. Barbara's manual
 * unlock (and admin) still override this close, same as any other lock.
 */
export const CLOSES_AT_5PM: ReadonlySet<string> = new Set(["ceo-workday", "monday-debrief"])

/** Minutes-since-midnight of the 5:00 PM work-access close. */
export const WORK_CLOSE_MINUTES = 17 * 60

/**
 * A manual override from Barbara's Work-Life Balance Access Control™ panel.
 * `"unlocked"` forces a segment open ahead of its time; `null` means "no
 * override — follow the clock". (Phase D supplies the live value; Phase C
 * accepts it so the signature is already correct.)
 */
export type SegmentOverride = "unlocked" | null

export interface SegmentAccess {
  /** True when the workspace must stay closed and show About + countdown. */
  locked: boolean
  /** Why it's locked, for copy/telemetry. `null` when unlocked. */
  reason: "before-unlock" | "not-today" | "closed-for-day" | null
  /** Human label of the unlock moment, e.g. "9:00 AM". `null` when N/A. */
  unlockAtLabel: string | null
  /** Minutes-since-midnight of the unlock moment today. `null` when N/A. */
  unlockAtMinutes: number | null
  /** Whole minutes until unlock (0 once unlocked / not applicable). */
  minutesUntilUnlock: number
}

const UNLOCKED: SegmentAccess = {
  locked: false,
  reason: null,
  unlockAtLabel: null,
  unlockAtMinutes: null,
  minutesUntilUnlock: 0,
}

/** Format minutes-since-midnight (0–1439) as a 12-hour clock label. */
export function formatClockLabel(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440
  const hour24 = Math.floor(m / 60)
  const minute = m % 60
  const period = hour24 >= 12 ? "PM" : "AM"
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`
}

export interface ResolveSegmentAccessParams {
  segmentId: string
  dayOfWeek: number
  minutesSinceMidnight: number
  isAdmin?: boolean
  override?: SegmentOverride
}

/**
 * Core resolver. Given the platform clock, a segment id, and the caller's
 * privileges, decide whether the segment workspace is open.
 */
export function resolveSegmentAccess(params: ResolveSegmentAccessParams): SegmentAccess {
  const { segmentId, dayOfWeek, minutesSinceMidnight, isAdmin = false, override = null } = params

  // Non-gated segments are always open.
  if (!GATED_SEGMENT_IDS.has(segmentId)) return UNLOCKED

  // Barbara (admin) and any active manual unlock bypass the clock entirely.
  if (isAdmin || override === "unlocked") return UNLOCKED

  // Find the segment as it exists *today* (respects mondayOnly / excludeMonday
  // and applies the day's effective times).
  const todaysBlock = orderedBlocksForDay(dayOfWeek).find((b) => b.id === segmentId)
  if (!todaysBlock) {
    return { locked: true, reason: "not-today", unlockAtLabel: null, unlockAtMinutes: null, minutesUntilUnlock: 0 }
  }

  // Before the segment's start time — locked until it opens.
  if (minutesSinceMidnight < todaysBlock.startMinutes) {
    return {
      locked: true,
      reason: "before-unlock",
      unlockAtLabel: formatClockLabel(todaysBlock.startMinutes),
      unlockAtMinutes: todaysBlock.startMinutes,
      minutesUntilUnlock: Math.max(0, todaysBlock.startMinutes - minutesSinceMidnight),
    }
  }

  // The narrow 5:00 PM work-access close: CEO Workday™ and Decide & Design™
  // lock for the rest of the day at 5 PM. Every other segment stays open once
  // its start has passed. Does not reopen today (no countdown).
  if (CLOSES_AT_5PM.has(segmentId) && minutesSinceMidnight >= WORK_CLOSE_MINUTES) {
    return {
      locked: true,
      reason: "closed-for-day",
      unlockAtLabel: null,
      unlockAtMinutes: null,
      minutesUntilUnlock: 0,
    }
  }

  // Open: start has passed and it hasn't hit a same-day close.
  return UNLOCKED
}

/**
 * Convenience wrapper that reads the platform clock and privileges straight
 * from a live Operating Engine snapshot — what the in-dashboard gate uses.
 */
export function resolveSegmentAccessFromExperience(
  experience: MemberExperience,
  segmentId: string,
  override: SegmentOverride = null,
): SegmentAccess {
  return resolveSegmentAccess({
    segmentId,
    dayOfWeek: experience.time.dayOfWeek,
    minutesSinceMidnight: experience.time.minutesSinceMidnight,
    // Admins are never locked out (Developer Mode implies admin).
    isAdmin: experience.access.isAdmin,
    override,
  })
}
