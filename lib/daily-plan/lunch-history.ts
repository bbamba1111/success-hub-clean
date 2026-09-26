"use client"

/**
 * Lunch Break History™ storage — the completed-break log for the real
 * Extended Healthy Hybrid Lunch Break™ segment (`TodaysLunchCard`).
 * Deliberately untimed — no duration is ever recorded, since this
 * protected window is honoured, not tracked by the minute.
 */

export interface LunchLogEntry {
  id: string
  date: string
  activity: string
  declaration: string
  completionStatus: "yes" | "partially" | "no"
  reflection: string
}

const KEY = "lunch_breaks_v2"

/** Fired on window after any save/delete so other mounted widgets can refresh. */
export const LUNCH_HISTORY_EVENT = "hl:lunch-history:changed"

export function loadLunchHistory(): LunchLogEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LunchLogEntry[]) : []
  } catch {
    return []
  }
}

export function saveLunchLogEntry(entry: LunchLogEntry): LunchLogEntry[] {
  const updated = [entry, ...loadLunchHistory()]
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(LUNCH_HISTORY_EVENT))
  }
  return updated
}

export function deleteLunchLogEntry(id: string): LunchLogEntry[] {
  const updated = loadLunchHistory().filter((w) => w.id !== id)
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(LUNCH_HISTORY_EVENT))
  }
  return updated
}
