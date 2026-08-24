/**
 * Daily Operating Segment™ visual system — the shared two-layer treatment for
 * the six Decide → Populate → Execute segments (Decide & Design™, Movement
 * Window™, Lunch Break™, CEO Workday™, Time Freedom™, Power Down™):
 *
 *   LAYER 1 — OUTER segment container → always this soft sage-green
 *   LAYER 2 — INNER content panel     → white (daytime) · warm (Time
 *                                        Freedom™) · evening (Power Down™)
 *
 * Centralized here so the colors are defined once and reused, instead of
 * scattered hex values across components. Everything else (morning-given,
 * the Monday-only reflective blocks, digital-detox, etc.) is untouched and
 * keeps the original cream/blush gradient.
 */

export type SegmentInnerTone = "white" | "warm" | "evening"

/** LAYER 1 — the soft sage-green frame shared by all six daily segments. */
export const SEGMENT_SAGE_OUTER = "#DCE7D2"

/** LAYER 2 — the inner content panel background, per tone. */
export const SEGMENT_INNER_BG: Record<SegmentInnerTone, string> = {
  white: "#FFFFFF",
  /** Time Freedom™ — warm cream, not the old bright blush. */
  warm: "#FBF1E3",
  /** Power Down™ — muted dusk teal, not black or harsh navy. */
  evening: "#2C4442",
}
