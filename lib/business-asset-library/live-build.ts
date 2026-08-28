/**
 * Live AI Build™ — Allowlist (Phase 12.2 → Phase 12.3)
 * ---------------------------------------------------------------------------
 * Business Asset™ ids wired to a real, live AI conversation, for
 * "Build With AI", "Let AI Do It", and "Do It Myself" modes: Founder
 * Destination™, Founder Onboarding Template™, and — as of Phase 12.3, the
 * first Business Asset Library™ proof of concept — Ideal Client Compass™.
 * Every other asset in the library keeps the fully static GuidedBuildFlow
 * (and the three static-brief modes never touch this allowlist at all —
 * they render from registry content only).
 *
 * This module is the single switch that decides whether an asset gets the
 * live chat experience. Expanding live AI to more assets later means adding
 * their id here — no changes needed anywhere else that reads this list.
 */

/** Business Asset™ ids wired to a real, live AI conversation. */
export const LIVE_AI_BUILD_ASSET_IDS: string[] = [
  "founder-destination",
  "founder-onboarding-template",
  "ideal-client-compass",
]

export function isLiveAiBuildAvailable(assetId: string): boolean {
  return LIVE_AI_BUILD_ASSET_IDS.includes(assetId)
}
