/**
 * Live AI Build™ — Allowlist (Phase 12.2 → Phase 12.3)
 * ---------------------------------------------------------------------------
 * Business Asset™ ids wired to a real, live AI conversation, for
 * "Build With AI", "Let AI Do It", and "Do It Myself" modes: Founder
 * Destination™, Founder Onboarding Template™, and — as of Phase 12.3, the
 * first Business Asset Library™ proof of concept — Ideal Client Asset
 * (internal id: `ideal-client-compass`, unchanged).
 * Every other asset in the library keeps the fully static GuidedBuildFlow
 * (and the three static-brief modes never touch this allowlist at all —
 * they render from registry content only).
 *
 * This module is the single switch that decides whether an asset gets the
 * live chat experience. Expanding live AI to more assets later means adding
 * their id here — no changes needed anywhere else that reads this list.
 */

/**
 * Business Asset™ ids that were the original live-AI proof of concept.
 * Kept for reference/telemetry only — the live template + chat builder is now
 * the shared experience for EVERY asset's AI build modes (see below), because
 * the API route and Template™ panel read only generic registry content
 * (`instructions`, `whatIsThis`, `whyItMatters`, Communication Style™), which
 * every asset already has.
 */
export const LIVE_AI_BUILD_ASSET_IDS: string[] = [
  "founder-destination",
  "founder-onboarding-template",
  "ideal-client-compass",
]

/**
 * Every Business Asset™ now gets the two-column Template™ + live AI EXEC chat
 * experience for its AI build modes — so any asset can be built and saved as a
 * hand-off-ready document. The founder can always type into the template
 * directly and Compile & Save even before the chat is used.
 */
export function isLiveAiBuildAvailable(_assetId: string): boolean {
  return true
}
