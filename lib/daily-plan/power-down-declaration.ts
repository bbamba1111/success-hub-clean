"use client"

/**
 * Power Down Declaration™ store — bridges Step 1 (Set My Power Down
 * Intention™, lived inside the Decide & Design™ collapsible) to Steps 2 & 3
 * (the declaration reveal + completion check-in, which live inside the real
 * Power Down™ segment). Founders build the declaration once in Decide &
 * Design; it then "arrives" in Power Down on its own. Mirrors
 * `movement-declaration.ts` / `lunch-declaration.ts` exactly — no duration
 * is set or tracked; this protected window is honoured, not timed.
 *
 * Deliberately a separate, tiny localStorage record — not `TodaysPlanRecord`
 * — since it needs its own `builtAt` timestamp (to gate the one-time glass
 * reveal animation and the 5-minute wrap-up reveal of Step 3).
 */

import { getDateKey } from "./storage"

export interface PowerDownDeclaration {
  dateKey: string
  activity: string
  /** Planned hours of sleep tonight — captured in the same Step 1 as `activity`, so Power Down™ and the 11 PM Unplug Digital Detox™ share one combined declaration. */
  sleepHours: number
  declaration: string
  /** ISO timestamp of when the declaration was built — powers the glass reveal + wrap-up timing. */
  builtAt: string
}

const KEY = "power_down_declaration_v1"
const SEEN_KEY = "power_down_declaration_seen_v1"
const STARTED_KEY = "power_down_declaration_started_v1"

/** Minutes the founder must be living inside Power Down before Step 3 (wrap-up) appears. */
export const POWER_DOWN_WRAP_UP_MINUTES = 5

/** Fired on window after a save so Power Down can pick it up if already mounted. */
export const POWER_DOWN_DECLARATION_EVENT = "hl:power-down-declaration:changed"

export function savePowerDownDeclaration(input: {
  activity: string
  sleepHours: number
  declaration: string
}): PowerDownDeclaration {
  const record: PowerDownDeclaration = {
    dateKey: getDateKey(),
    activity: input.activity,
    sleepHours: input.sleepHours,
    declaration: input.declaration,
    builtAt: new Date().toISOString(),
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(record))
    localStorage.removeItem(SEEN_KEY)
    window.dispatchEvent(new Event(POWER_DOWN_DECLARATION_EVENT))
  }
  return record
}

/** Returns today's declaration, or null if none has been built (or it's from a prior day). */
export function loadPowerDownDeclaration(dateKey: string = getDateKey()): PowerDownDeclaration | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PowerDownDeclaration
    return parsed.dateKey === dateKey ? parsed : null
  } catch {
    return null
  }
}

export function clearPowerDownDeclaration() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
  localStorage.removeItem(SEEN_KEY)
  localStorage.removeItem(STARTED_KEY)
  window.dispatchEvent(new Event(POWER_DOWN_DECLARATION_EVENT))
}

/**
 * Marks the moment the founder actually arrived in Power Down™ and started
 * living the declaration (Step 2). Idempotent per `dateKey` — the first call
 * each day wins, so the 5-minute wrap-up timer (Step 3) counts from when she
 * opened the segment, not from when she built the declaration earlier.
 */
export function markPowerDownDeclarationStarted(dateKey: string) {
  if (typeof window === "undefined") return
  const raw = localStorage.getItem(STARTED_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { dateKey: string; startedAt: string }
      if (parsed.dateKey === dateKey) return
    } catch {
      // fall through and overwrite a corrupt record
    }
  }
  localStorage.setItem(STARTED_KEY, JSON.stringify({ dateKey, startedAt: new Date().toISOString() }))
}

/** Whole minutes elapsed since `markPowerDownDeclarationStarted` was called for `dateKey`, or null if never started. */
export function minutesElapsedSincePowerDownStart(dateKey: string): number | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STARTED_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { dateKey: string; startedAt: string }
    if (parsed.dateKey !== dateKey) return null
    return Math.floor((Date.now() - new Date(parsed.startedAt).getTime()) / 60000)
  } catch {
    return null
  }
}
