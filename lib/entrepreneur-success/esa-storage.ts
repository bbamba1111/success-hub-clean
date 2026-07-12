/**
 * Entrepreneur Success Assessment™ — Storage Layer (Phase 6.0)
 * ---------------------------------------------------------------------------
 * Client-side storage for ESA results, matching the audit-storage.ts pattern
 * used by the Work-Life Balance Audit™. Future phases replace this with a
 * Supabase server action for authenticated, persisted, historical comparison.
 *
 * Key: "entrepreneurSuccessAssessmentResults"
 */

import type { EsaResults } from "./types"

const STORAGE_KEY = "entrepreneurSuccessAssessmentResults"

export function saveEsaResults(results: EsaResults): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
  } catch (error) {
    console.error("[ESA] Error saving results:", error)
  }
}

export function getEsaResults(): EsaResults | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as EsaResults
  } catch (error) {
    console.error("[ESA] Error reading results:", error)
    return null
  }
}

export function clearEsaResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("[ESA] Error clearing results:", error)
  }
}

/** True if the founder has a completed assessment on this device. */
export function hasCompletedEsa(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}
