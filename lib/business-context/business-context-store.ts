/**
 * Business Context Profile™ — Storage Layer (Phase 10.1)
 * ---------------------------------------------------------------------------
 * Client-side localStorage storage following the exact pattern of
 * esa-storage.ts and business-stage-store.ts.
 *
 * Key: "hl:business-context:v1"
 */

import type { BusinessContextProfile } from "./types"

const STORAGE_KEY = "hl:business-context:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const BUSINESS_CONTEXT_EVENT = "hl:business-context:changed"

export function saveBusinessContext(data: BusinessContextProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(BUSINESS_CONTEXT_EVENT))
  } catch (error) {
    console.error("[BusinessContext] Error saving profile:", error)
  }
}

export function getBusinessContext(): BusinessContextProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as BusinessContextProfile
  } catch (error) {
    console.error("[BusinessContext] Error reading profile:", error)
    return null
  }
}

export function clearBusinessContext(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(BUSINESS_CONTEXT_EVENT))
  } catch (error) {
    console.error("[BusinessContext] Error clearing profile:", error)
  }
}

/** True if the founder has a completed Business Context Profile™ on this device. */
export function hasCompletedBusinessContext(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}
