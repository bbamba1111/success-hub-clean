/**
 * Founder Destination™ — Storage Layer
 * ---------------------------------------------------------------------------
 * Client-side localStorage storage following the exact pattern of
 * lib/founder-profile/founder-profile-store.ts.
 *
 * Key: "hl:founder-destination:v1"
 *
 * Founder Destination™ captures where the founder wants their business,
 * their own role, their life, and their future workplace to end up —
 * distinct from Business Context™ (the business's current state) and
 * Founder Profile™ (who the founder is today).
 */

import type { FounderDestinationProfile } from "./types"

const STORAGE_KEY = "hl:founder-destination:v1"

/** Fired on window after a save so any live listeners can refresh. */
export const FOUNDER_DESTINATION_EVENT = "hl:founder-destination:changed"

export function saveFounderDestination(data: FounderDestinationProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(FOUNDER_DESTINATION_EVENT))
  } catch (error) {
    console.error("[FounderDestination] Error saving destination:", error)
  }
}

export function getFounderDestination(): FounderDestinationProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FounderDestinationProfile
  } catch (error) {
    console.error("[FounderDestination] Error reading destination:", error)
    return null
  }
}

export function clearFounderDestination(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(FOUNDER_DESTINATION_EVENT))
  } catch (error) {
    console.error("[FounderDestination] Error clearing destination:", error)
  }
}

/** True if the founder has saved a Founder Destination™ on this device. */
export function hasCompletedFounderDestination(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

/* ── Resume position ────────────────────────────────────────────────────
 * If a founder leaves mid-way through the four sections, the form should
 * reopen on the same section rather than sending them back to the start.
 * This is presentation state only — never sent to the database. */

const SECTION_KEY = "hl:founder-destination:section:v1"

export function saveFounderDestinationSection(sectionIndex: number): void {
  try {
    localStorage.setItem(SECTION_KEY, String(sectionIndex))
  } catch {
    // Non-fatal — worst case the founder resumes from the first section.
  }
}

export function getFounderDestinationSection(): number {
  try {
    const raw = localStorage.getItem(SECTION_KEY)
    return raw ? Number.parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}
