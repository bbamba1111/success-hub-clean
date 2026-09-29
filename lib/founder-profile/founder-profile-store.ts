/**
 * Founder Profile™ — Storage Layer
 * ---------------------------------------------------------------------------
 * Client-side localStorage storage following the exact pattern of
 * business-context-store.ts.
 *
 * Key: "hl:founder-profile:v1"
 */

const STORAGE_KEY = "hl:founder-profile:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const FOUNDER_PROFILE_EVENT = "hl:founder-profile:changed"

export function saveFounderProfile(data: Record<string, unknown>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(FOUNDER_PROFILE_EVENT))
  } catch (error) {
    console.error("[FounderProfile] Error saving profile:", error)
  }
}

export function getFounderProfile(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Record<string, unknown>
  } catch (error) {
    console.error("[FounderProfile] Error reading profile:", error)
    return null
  }
}

export function clearFounderProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(FOUNDER_PROFILE_EVENT))
  } catch (error) {
    console.error("[FounderProfile] Error clearing profile:", error)
  }
}

/**
 * True if the founder has a completed Founder Profile™ on this device.
 * Founder Profile is a REQUIRED onboarding gate for every real member —
 * there is no production "skip" path. Completion is recorded the moment
 * the founder saves the form, even if every individual field is optional.
 */
export function hasCompletedFounderProfile(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}
