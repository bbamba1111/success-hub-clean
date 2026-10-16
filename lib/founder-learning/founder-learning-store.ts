/**
 * Founder Learning Profile™ — Storage Layer (Phase 10.1)
 * ---------------------------------------------------------------------------
 * Client-side localStorage storage following the exact pattern of
 * business-context-store.ts.
 *
 * Key: "hl:founder-learning:v1"
 */

import type { FounderLearningProfile } from "./types"

const STORAGE_KEY = "hl:founder-learning:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const FOUNDER_LEARNING_EVENT = "hl:founder-learning:changed"

export function saveFounderLearning(data: FounderLearningProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(FOUNDER_LEARNING_EVENT))
  } catch (error) {
    console.error("[FounderLearning] Error saving profile:", error)
  }
}

export function getFounderLearning(): FounderLearningProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FounderLearningProfile
  } catch (error) {
    console.error("[FounderLearning] Error reading profile:", error)
    return null
  }
}

export function clearFounderLearning(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(FOUNDER_LEARNING_EVENT))
  } catch (error) {
    console.error("[FounderLearning] Error clearing profile:", error)
  }
}

/** True if the founder has a completed learning profile on this device. */
export function hasCompletedFounderLearning(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}
