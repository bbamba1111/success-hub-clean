/**
 * My Time Freedom Declaration™ — client store
 * ---------------------------------------------------------------------------
 * A first-person statement woven from this week's My Weekly Life Priorities™ —
 * the parts of life the founder is protecting, enjoying, or planning for during
 * their Time Freedom™. It mirrors the CEO Workday Declaration™ pattern but is
 * sourced from life priorities instead of business decisions.
 *
 * Persisted to localStorage keyed to the current WLBB week so it survives
 * refresh / navigation and stays put until the founder changes, edits, or
 * rebuilds it. A new week starts fresh.
 *
 * Key: "hl:time-freedom:declaration:v1"
 */

import { getWeekKey } from "@/lib/wlbb-week/storage"

const STORAGE_KEY = "hl:time-freedom:declaration:v1"

/** Fired on window after any change so live listeners refresh. */
export const TIME_FREEDOM_DECLARATION_EVENT = "hl:time-freedom:declaration:changed"

export interface TimeFreedomDeclaration {
  weekKey: string
  text: string
  variant: number
  edited: boolean
  builtAt: string | null
}

export function emptyDeclaration(weekKey: string = getWeekKey()): TimeFreedomDeclaration {
  return { weekKey, text: "", variant: 0, edited: false, builtAt: null }
}

export function getTimeFreedomDeclaration(weekKey: string = getWeekKey()): TimeFreedomDeclaration {
  if (typeof window === "undefined") return emptyDeclaration(weekKey)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyDeclaration(weekKey)
    const parsed = JSON.parse(raw) as Partial<TimeFreedomDeclaration>
    // A new week starts fresh — last week's declaration doesn't carry over.
    if (parsed.weekKey !== weekKey) return emptyDeclaration(weekKey)
    return {
      weekKey,
      text: typeof parsed.text === "string" ? parsed.text : "",
      variant: typeof parsed.variant === "number" ? parsed.variant : 0,
      edited: Boolean(parsed.edited),
      builtAt: parsed.builtAt ?? null,
    }
  } catch (error) {
    console.error("[TimeFreedomDeclaration] Error reading:", error)
    return emptyDeclaration(weekKey)
  }
}

export function setTimeFreedomDeclaration(next: TimeFreedomDeclaration): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(TIME_FREEDOM_DECLARATION_EVENT))
  } catch (error) {
    console.error("[TimeFreedomDeclaration] Error saving:", error)
  }
}
