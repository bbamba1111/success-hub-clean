"use client"

/**
 * Movement Declaration™ store — bridges Step 1 (Set My Movement Intention™,
 * lived inside the Decide & Design™ collapsible) to Steps 2 & 3 (the
 * declaration reveal + completion check-in, which live inside the real
 * 30-Minute Movement Window™ segment). Founders build the declaration once
 * in Decide & Design; it then "arrives" in the Movement Window on its own.
 *
 * Deliberately a separate, tiny localStorage record — not `TodaysPlanRecord`
 * — since it needs its own `builtAt` timestamp (to gate the one-time glass
 * reveal animation and the 5-minute wrap-up reveal of Step 3).
 */

import { getDateKey } from "./storage"

export interface MovementDeclaration {
  dateKey: string
  /** One or more movement/exercise types selected together for today's window. */
  types: string[]
  duration: number
  declaration: string
  /** ISO timestamp of when the declaration was built — powers the glass reveal + wrap-up timing. */
  builtAt: string
}

const KEY = "movement_declaration_v1"
const SEEN_KEY = "movement_declaration_seen_v1"
const STARTED_KEY = "movement_declaration_started_v1"

/** Minutes the founder must be living inside the Movement Window before Step 3 (wrap-up) appears. */
export const MOVEMENT_WRAP_UP_MINUTES = 5

/** Fired on window after a save so the Movement Window can pick it up if already mounted. */
export const MOVEMENT_DECLARATION_EVENT = "hl:movement-declaration:changed"

export function saveMovementDeclaration(input: {
  types: string[]
  duration: number
  declaration: string
}): MovementDeclaration {
  const record: MovementDeclaration = {
    dateKey: getDateKey(),
    types: input.types,
    duration: input.duration,
    declaration: input.declaration,
    builtAt: new Date().toISOString(),
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(record))
    // A freshly built declaration has not been "seen" (glass-revealed) yet.
    localStorage.removeItem(SEEN_KEY)
    window.dispatchEvent(new Event(MOVEMENT_DECLARATION_EVENT))
  }
  return record
}

/** Returns today's declaration, or null if none has been built (or it's from a prior day). */
export function loadMovementDeclaration(dateKey: string = getDateKey()): MovementDeclaration | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MovementDeclaration
    return parsed.dateKey === dateKey ? parsed : null
  } catch {
    return null
  }
}

export function clearMovementDeclaration() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
  localStorage.removeItem(SEEN_KEY)
  localStorage.removeItem(STARTED_KEY)
  window.dispatchEvent(new Event(MOVEMENT_DECLARATION_EVENT))
}

/** Whether the glass-reveal animation has already played for the given declaration. */
export function hasSeenMovementDeclaration(builtAt: string): boolean {
  if (typeof window === "undefined") return true
  return localStorage.getItem(SEEN_KEY) === builtAt
}

export function markMovementDeclarationSeen(builtAt: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(SEEN_KEY, builtAt)
}

/**
 * Marks the moment the founder actually arrived in the 30-Minute Movement
 * Window™ and started living the declaration (Step 2). Idempotent per
 * `dateKey` — the first call each day wins, so the 5-minute wrap-up timer
 * (Step 3) counts from when she opened the segment, not from when she built
 * the declaration earlier in Decide & Design™.
 */
export function markMovementDeclarationStarted(dateKey: string) {
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

/** Whole minutes elapsed since `markMovementDeclarationStarted` was called for `dateKey`, or null if never started. */
export function minutesElapsedSinceStart(dateKey: string): number | null {
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
