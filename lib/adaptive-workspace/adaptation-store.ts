/**
 * Adaptation Store™ — Phase 10.6
 *
 * localStorage persistence for AdaptationHistoryEntry[].
 * Key: "harmony:adaptations:v1"
 * Client-safe: all localStorage calls are guarded.
 */

import type { AdaptationHistoryEntry } from "./types"

const STORAGE_KEY = "harmony:adaptations:v1"
export const ADAPTATION_HISTORY_UPDATED = "ADAPTATION_HISTORY_UPDATED"

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Returns the full adaptation history, newest-first.
 * Returns [] when outside a browser context.
 */
export function getAdaptationHistory(): AdaptationHistoryEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AdaptationHistoryEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Records a new adaptation entry and persists to localStorage.
 * Keeps at most 100 entries (oldest pruned).
 */
export function recordAdaptation(
  entry: Omit<AdaptationHistoryEntry, "id">,
): void {
  if (typeof window === "undefined") return
  try {
    const existing = getAdaptationHistory()
    const next: AdaptationHistoryEntry = { ...entry, id: uid("adapt") }
    const updated = [next, ...existing].slice(0, 100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(ADAPTATION_HISTORY_UPDATED))
  } catch {
    // localStorage unavailable — no-op
  }
}

/**
 * Clears all adaptation history.
 */
export function clearAdaptationHistory(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(ADAPTATION_HISTORY_UPDATED))
  } catch {
    // no-op
  }
}
