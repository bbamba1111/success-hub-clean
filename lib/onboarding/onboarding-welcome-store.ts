/**
 * Cherry Blossom Welcome™ / Thank-You™ — Storage Layer
 * ---------------------------------------------------------------------------
 * Tracks whether a member has seen the two orientation screens that bookend
 * the Founder Profile™ → Business Context™ on-ramp:
 *
 *   Cherry Blossom Welcome™     — shown once, before Founder Profile.
 *   Cherry Blossom Thank-You™   — shown once, after both onboarding steps
 *                                 are complete, right before the member
 *                                 enters their first Work-Life Balance
 *                                 Business Day™.
 *
 * Client-side localStorage storage following the exact pattern of
 * business-context-store.ts.
 */

const WELCOME_KEY = "hl:cherry-blossom-welcome:v1"
const THANK_YOU_KEY = "hl:cherry-blossom-thank-you:v1"

export function hasSeenCherryBlossomWelcome(): boolean {
  try {
    return !!localStorage.getItem(WELCOME_KEY)
  } catch {
    return false
  }
}

export function markCherryBlossomWelcomeSeen(): void {
  try {
    localStorage.setItem(WELCOME_KEY, new Date().toISOString())
  } catch (error) {
    console.error("[CherryBlossomWelcome] Error saving:", error)
  }
}

export function hasSeenCherryBlossomThankYou(): boolean {
  try {
    return !!localStorage.getItem(THANK_YOU_KEY)
  } catch {
    return false
  }
}

export function markCherryBlossomThankYouSeen(): void {
  try {
    localStorage.setItem(THANK_YOU_KEY, new Date().toISOString())
  } catch (error) {
    console.error("[CherryBlossomThankYou] Error saving:", error)
  }
}
