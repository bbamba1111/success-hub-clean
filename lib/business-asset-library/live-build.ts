/**
 * Live AI Build™ — Allowlist (Phase 12.2 proof of concept)
 * ---------------------------------------------------------------------------
 * Exactly ONE Business Asset™ — Founder Destination™ — is wired to a real,
 * live AI conversation, for BOTH "Build With AI" and "Do It Myself" modes.
 * Every other asset in the library keeps the fully static GuidedBuildFlow.
 *
 * This module is the single switch that decides whether an asset gets the
 * live chat experience. Expanding live AI to more assets later means adding
 * their id here — no changes needed anywhere else that reads this list.
 */

/** Business Asset™ ids wired to a real, live AI conversation. */
export const LIVE_AI_BUILD_ASSET_IDS: string[] = ["founder-destination"]

export function isLiveAiBuildAvailable(assetId: string): boolean {
  return LIVE_AI_BUILD_ASSET_IDS.includes(assetId)
}
