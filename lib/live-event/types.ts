/**
 * Canonical Live Event — provider-agnostic architecture boundary.
 *
 * The product vision is ONE live broadcast (the founder's Morning GIV•EN™,
 * a teaching, a community kickoff, a podcast recording, etc.) that can be
 * distributed to multiple destinations — the community, YouTube, LinkedIn,
 * Facebook, Instagram — without ever creating five independent broadcasts.
 *
 * No streaming provider is connected yet. These types exist so the UI has a
 * single, stable shape to render against. When a real provider (Mux,
 * LiveKit, YouTube Live API, etc.) is wired up, populate this shape from
 * that provider — no UI changes should be required.
 */

/** Minimum viable live-state model. Never derive "live" from a hard-coded boolean. */
export type LiveEventStatus = "offline" | "scheduled" | "live" | "ended"

export type RecordingStatus = "none" | "recording" | "processing" | "ready"

/** A single distribution destination for the canonical Live Event. */
export interface LiveEventDestination {
  /** Whether this destination's account/integration is actually connected. */
  connected: boolean
  /** Destination-specific watch/embed URL, only set once genuinely live or replayable. */
  url?: string
}

export interface LiveEventDestinations {
  community?: LiveEventDestination
  youtube?: LiveEventDestination
  linkedin?: LiveEventDestination
  facebook?: LiveEventDestination
  instagram?: LiveEventDestination
}

/** The single source-of-truth broadcast record. One event, many destinations. */
export interface LiveEvent {
  id: string
  title: string
  description?: string
  hostName: string
  status: LiveEventStatus
  scheduledAt?: string
  startedAt?: string
  endedAt?: string
  thumbnailUrl?: string
  /** Provider-agnostic playback URL/embed — only present while status === "live". */
  playbackUrl?: string
  /** Present once a recording exists and a replay is available. */
  replayUrl?: string
  recordingStatus?: RecordingStatus
  destinations?: LiveEventDestinations
}
