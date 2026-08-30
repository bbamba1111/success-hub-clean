/**
 * Entrepreneur Gap Assessment™ — Onboarding Signal Capture Gate
 * ---------------------------------------------------------------------------
 * Tracks whether a founder has completed EGA Screen 1 ("What is getting in
 * your way?") as part of the required on-ramp:
 *
 *   Founder Profile™ → Business Context™ → EGA Screen 1 → Cherry Blossom Thank-You™
 *
 * IMPORTANT — this gate is ONLY about the one-time onboarding signal capture.
 * EGA is NOT a recurring weekly assessment. After onboarding, EGA operates as
 * a diagnostic layer that reacts to signals (ESA, Business Context, asset/rule
 * state) and surfaces targeted follow-up questions only when relevant — the
 * founder is never asked to "take the EGA" again in full.
 *
 * Client-side localStorage storage following the exact pattern of
 * business-context-store.ts / onboarding-welcome-store.ts.
 */

const STORAGE_KEY = "hl:ega-onboarding-signal:v1"

/** True if the founder has completed EGA Screen 1 during onboarding on this device. */
export function hasCompletedEgaOnboardingSignal(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

export function markEgaOnboardingSignalComplete(): void {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  } catch (error) {
    console.error("[EgaOnboardingSignal] Error saving:", error)
  }
}
