"use client"

/**
 * Lunch Declaration™ store — bridges Step 1 (Set My Lunch Break Intention™,
 * lived inside the Decide & Design™ collapsible) to Steps 2 & 3 (the
 * declaration reveal + completion check-in, which live inside the real
 * Extended Healthy Hybrid Lunch Break™ segment). Founders build the
 * declaration once in Decide & Design; it then "arrives" in the Lunch Break
 * on its own. Mirrors `movement-declaration.ts` exactly — except no duration
 * is set or tracked; this protected window is honoured, not timed.
 *
 * Deliberately a separate, tiny localStorage record — not `TodaysPlanRecord`
 * — since it needs its own `builtAt` timestamp (to gate the one-time glass
 * reveal animation and the 5-minute wrap-up reveal of Step 3).
 */

import { getDateKey } from "./storage"

export interface LunchDeclaration {
  dateKey: string
  activity: string
  declaration: string
  /** ISO timestamp of when the declaration was built — powers the glass reveal + wrap-up timing. */
  builtAt: string
}

const KEY = "lunch_declaration_v1"
const SEEN_KEY = "lunch_declaration_seen_v1"
const STARTED_KEY = "lunch_declaration_started_v1"

/** Minutes the founder must be living inside the Lunch Break before Step 3 (wrap-up) appears. */
export const LUNCH_WRAP_UP_MINUTES = 5

/** Fired on window after a save so the Lunch Break can pick it up if already mounted. */
export const LUNCH_DECLARATION_EVENT = "hl:lunch-declaration:changed"

export function saveLunchDeclaration(input: { activity: string; declaration: string }): LunchDeclaration {
  const record: LunchDeclaration = {
    dateKey: getDateKey(),
    activity: input.activity,
    declaration: input.declaration,
    builtAt: new Date().toISOString(),
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(record))
    localStorage.removeItem(SEEN_KEY)
    window.dispatchEvent(new Event(LUNCH_DECLARATION_EVENT))
  }
  return record
}

/** Returns today's declaration, or null if none has been built (or it's from a prior day). */
export function loadLunchDeclaration(dateKey: string = getDateKey()): LunchDeclaration | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LunchDeclaration
    return parsed.dateKey === dateKey ? parsed : null
  } catch {
    return null
  }
}

export function clearLunchDeclaration() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
  localStorage.removeItem(SEEN_KEY)
  localStorage.removeItem(STARTED_KEY)
  window.dispatchEvent(new Event(LUNCH_DECLARATION_EVENT))
}

/**
 * Marks the moment the founder actually arrived in the Lunch Break™ and
 * started living the declaration (Step 2). Idempotent per `dateKey` — the
 * first call each day wins, so the 5-minute wrap-up timer (Step 3) counts
 * from when she opened the segment, not from when she built the declaration
 * earlier in Decide & Design™.
 */
export function markLunchDeclarationStarted(dateKey: string) {
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

/** Whole minutes elapsed since `markLunchDeclarationStarted` was called for `dateKey`, or null if never started. */
export function minutesElapsedSinceLunchStart(dateKey: string): number | null {
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
