"use client"

/**
 * useFounderLiveEvent — the single integration point for the Founder Live
 * Media Surface.
 *
 * IMPORTANT: No real streaming provider is connected today (no Mux, LiveKit,
 * WebRTC, RTMP, or YouTube/LinkedIn/Facebook/Instagram Live API integration
 * exists in this codebase). This hook therefore always resolves to `null`
 * (offline) so the UI can never fabricate a "LIVE" state.
 *
 * When a real canonical Live Event backend is connected, replace the body of
 * this hook with a real subscription (e.g. Supabase Realtime on a
 * `live_events` table, or a polling/SWR fetch against the provider's API)
 * that resolves the current `LiveEvent | null`. No changes should be needed
 * in `FounderMediaSurface` or any component that consumes this hook — that
 * is the entire point of the boundary.
 */
import type { LiveEvent } from "./types"

export function useFounderLiveEvent(): LiveEvent | null {
  // No canonical Live Event source is wired up yet — always offline.
  return null
}
