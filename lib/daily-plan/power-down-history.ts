"use client"

/**
 * Power Down History™ storage — the completed-wind-down log for the real
 * Power Down™ segment (`PowerDownReleaseCard`). Deliberately untimed — no
 * duration is ever recorded, since this protected window is honoured, not
 * tracked by the minute.
 */

export interface PowerDownLogEntry {
  id: string
  date: string
  activity: string
  declaration: string
  completionStatus: "yes" | "partially" | "no"
  reflection: string
}

const KEY = "power_down_log_v1"

/** Fired on window after any save/delete so other mounted widgets can refresh. */
export const POWER_DOWN_HISTORY_EVENT = "hl:power-down-history:changed"

export function loadPowerDownHistory(): PowerDownLogEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PowerDownLogEntry[]) : []
  } catch {
    return []
  }
}

export function savePowerDownLogEntry(entry: PowerDownLogEntry): PowerDownLogEntry[] {
  const updated = [entry, ...loadPowerDownHistory()]
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(POWER_DOWN_HISTORY_EVENT))
  }
  return updated
}

export function deletePowerDownLogEntry(id: string): PowerDownLogEntry[] {
  const updated = loadPowerDownHistory().filter((w) => w.id !== id)
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(POWER_DOWN_HISTORY_EVENT))
  }
  return updated
}
