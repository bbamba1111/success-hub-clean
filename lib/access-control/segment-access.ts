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
  "daily-planning-gps",
  "morning-given",
  "movement-window",
  "lunch-break",
  "ceo-workday",
  "time-freedom",
  "power-down",
])

/**
 * The Business Day runs as TWO cumulative operating blocks, not a chain of
 * per-segment windows. Within a block, each segment opens at its own start
 * time and then STAYS open — the founder accumulates open spaces as the block
 * progresses — until the whole block closes at once.
 *
 * WORK BLOCK (7 AM–5 PM): every one of these segments opens at its scheduled
 * start, stays open, and they ALL close together at 5 PM for the rest of the
 * day. (Flex Time™ — `early-access` — is always-open and not gated, so it is
 * not listed here.)
 */
export const WORK_BLOCK_SEGMENT_IDS: ReadonlySet<string> = new Set([
  "monday-reality-check",
  "monday-debrief",
  "daily-planning-gps",
  "morning-given",
  "movement-window",
  "lunch-break",
  "ceo-workday",
])

/**
 * LIFE / RECOVERY BLOCK (5 PM–11 PM): Time Freedom™ opens at 5 PM, Power Down™
 * opens at 10 PM, and both stay open until the whole block closes at 11 PM —
 * when the overnight Unplug Digital Detox™ takes over.
 */
export const LIFE_BLOCK_SEGMENT_IDS: ReadonlySet<string> = new Set([
  "time-freedom",
  "power-down",
])

/** Minutes-since-midnight of the 5:00 PM WORK-block close. */
export const WORK_CLOSE_MINUTES = 17 * 60
/** Minutes-since-midnight of the 11:00 PM LIFE/RECOVERY-block close. */
export const LIFE_CLOSE_MINUTES = 23 * 60

/**
 * A manual override from Barbara's Tour Control™ panel.
 *
 * The two states are deliberately NOT the same power:
 *  - `"tour"`     — opens a READ-ONLY guided preview for the founder (About +
 *                   "what happens here"), for Barbara's Thursday/Sunday demo.
 *                   It NEVER grants live execution. This is Barbara's lever.
 *  - `"unlocked"` — a developer/legacy full unlock that forces true live
 *                   execution ahead of schedule. Kept for Developer Mode and
 *                   backwards-compatibility; it is not exposed as a founder
 *                   Tour action.
 *  - `null`       — no override; follow the clock (automatic).
 *
 * Governing principle (Tour Control note):
 *   AUTOMATION controls LIVE access. BARBARA controls TOUR access.
 *   Neither one overrides the other.
 */
export type SegmentOverride = "tour" | "unlocked" | null

/**
 * What kind of access the founder currently has to a segment:
 *  - `"live"`   — the interactive workspace is open for real execution.
 *  - `"tour"`   — a read-only guided preview (workspace withheld, About shown).
 *  - `"locked"` — closed; About + countdown only.
 */
export type SegmentMode = "live" | "tour" | "locked"

export interface SegmentAccess {
  /**
   * True when the LIVE interactive workspace must stay closed. This stays
   * `true` for BOTH `"locked"` and `"tour"` — tour is a preview, never
   * execution — so the existing gate (`if (locked) <LockedSegment/>`) keeps
   * withholding the workspace during a tour without any change.
   */
  locked: boolean
  /** The access kind, so the UI can frame tour previews vs hard locks. */
  mode: SegmentMode
  /** Why it's locked, for copy/telemetry. `null` when live. */
  reason: "before-unlock" | "not-today" | "closed-for-day" | "tour-preview" | null
  /** Human label of the unlock moment, e.g. "9:00 AM". `null` when N/A. */
  unlockAtLabel: string | null
  /** Minutes-since-midnight of the unlock moment today. `null` when N/A. */
  unlockAtMinutes: number | null
  /** Whole minutes until unlock (0 once unlocked / not applicable). */
  minutesUntilUnlock: number
}

const UNLOCKED: SegmentAccess = {
  locked: false,
  mode: "live",
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
 * What the CLOCK alone grants for a gated segment — the automatic LIVE window,
 * ignoring admin bypass and any Tour override. This is the single source of
 * truth for live execution access; AUTOMATION owns it. Returns `mode: "live"`
 * when the segment is within its window, else a `mode: "locked"` result.
 */
function resolveClockAccess(
  segmentId: string,
  dayOfWeek: number,
  minutesSinceMidnight: number,
): SegmentAccess {
  // Find the segment as it exists *today* (respects mondayOnly / excludeMonday
  // and applies the day's effective times).
  const todaysBlock = orderedBlocksForDay(dayOfWeek).find((b) => b.id === segmentId)
  if (!todaysBlock) {
    return { locked: true, mode: "locked", reason: "not-today", unlockAtLabel: null, unlockAtMinutes: null, minutesUntilUnlock: 0 }
  }

  // Before the segment's start time — locked until it opens.
  if (minutesSinceMidnight < todaysBlock.startMinutes) {
    return {
      locked: true,
      mode: "locked",
      reason: "before-unlock",
      unlockAtLabel: formatClockLabel(todaysBlock.startMinutes),
      unlockAtMinutes: todaysBlock.startMinutes,
      minutesUntilUnlock: Math.max(0, todaysBlock.startMinutes - minutesSinceMidnight),
    }
  }

  // Cumulative block close. A segment stays open from its start until its
  // whole operating block closes as a unit: WORK segments all close at 5 PM,
  // LIFE/RECOVERY segments (Time Freedom™, Power Down™) at 11 PM. Once closed
  // it does not reopen today (no countdown).
  const closeMinutes = WORK_BLOCK_SEGMENT_IDS.has(segmentId)
    ? WORK_CLOSE_MINUTES
    : LIFE_BLOCK_SEGMENT_IDS.has(segmentId)
      ? LIFE_CLOSE_MINUTES
      : null

  if (closeMinutes !== null && minutesSinceMidnight >= closeMinutes) {
    return {
      locked: true,
      mode: "locked",
      reason: "closed-for-day",
      unlockAtLabel: null,
      unlockAtMinutes: null,
      minutesUntilUnlock: 0,
    }
  }

  // Live: start has passed and its block hasn't closed yet.
  return UNLOCKED
}

/**
 * Core resolver. Given the platform clock, a segment id, and the caller's
 * privileges, decide whether the segment workspace is open — and in what mode.
 *
 * Order of precedence encodes the Tour Control principle:
 *   1. Developer/admin bypass and the legacy `"unlocked"` override → LIVE.
 *   2. Otherwise the CLOCK decides LIVE execution (automation owns live).
 *   3. When the clock has NOT opened it live, a `"tour"` override opens a
 *      read-only PREVIEW only — the interactive workspace stays withheld.
 *   4. Otherwise the clock's locked result stands.
 */
export function resolveSegmentAccess(params: ResolveSegmentAccessParams): SegmentAccess {
  const { segmentId, dayOfWeek, minutesSinceMidnight, isAdmin = false, override = null } = params

  // Non-gated segments are always open.
  if (!GATED_SEGMENT_IDS.has(segmentId)) return UNLOCKED

  // Admin (Developer Mode) and the legacy full unlock bypass the clock into
  // real live execution. Tour does NOT — it is handled below.
  if (isAdmin || override === "unlocked") return UNLOCKED

  // Automation owns live access.
  const clock = resolveClockAccess(segmentId, dayOfWeek, minutesSinceMidnight)
  if (!clock.locked) return clock

  // Clock has it closed. Barbara's Tour override opens a READ-ONLY preview,
  // never live execution — the workspace stays withheld (`locked: true`).
  if (override === "tour") {
    return {
      locked: true,
      mode: "tour",
      reason: "tour-preview",
      unlockAtLabel: clock.unlockAtLabel,
      unlockAtMinutes: clock.unlockAtMinutes,
      minutesUntilUnlock: clock.minutesUntilUnlock,
    }
  }

  return clock
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
