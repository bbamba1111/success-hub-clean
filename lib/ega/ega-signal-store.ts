/**
 * Entrepreneur Gap Assessment™ — Onboarding Signal Capture Gate
 * ---------------------------------------------------------------------------
 * Tracks whether a founder has completed EGA Screen 1 ("What is getting in
 * your way?") as part of the required on-ramp:
 *
 *   Founder Profile™ → Business Context™ → EGA Screen 1 → Cherry Blossom Thank-You™
 *
 * IMPORTANT — this gate is ONLY about the one-time onboarding signal capture,
 * tracked by `direct_ega`-sourced entries. It is separate from the recurring
 * weekly current-state capture that now runs inside the Monday Reality
 * Check (Step 3 of components/reflection-space.tsx, via
 * components/ega/ega-weekly-check.tsx), which re-uses this same Screen 1
 * catalog but writes `weekly_reality_check`-sourced entries instead and has
 * no onboarding gate of its own — it simply resets with the week. Outside
 * of onboarding and the weekly check, EGA still operates as a diagnostic
 * layer that reacts to signals (ESA, Business Context, asset/rule state)
 * and surfaces targeted follow-up questions only when relevant.
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
