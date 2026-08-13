/**
 * Segment mapping for the Harmony Context Engine™ (Phase 4B.2).
 *
 * The shared Operating Engine (operating-engine/) identifies the current block
 * of the Work-Life Balance Business Day™ using its own `BlockId`. Sunday Design
 * Day™ stores the member's design under its own segment ids (sdd-config.ts).
 * These are mostly aligned but a few differ. This module is the single place
 * that reconciles the two vocabularies so the rest of the platform can move
 * fluidly between "what time is it?" (engine) and "what did I design?" (SDD).
 */

import type { BlockId } from "@/operating-engine"

/**
 * Maps an Operating Engine BlockId to the Sunday Design Day™ segment id.
 * `digital-detox` is overnight rest — it has no designed operating segment,
 * so it maps to null (the member should be unplugged and asleep).
 */
export const ENGINE_BLOCK_TO_SDD_SEGMENT: Record<BlockId, string | null> = {
  "monday-flex": "early-access",
  "monday-reality-check": null,
  "monday-debrief": null,
  "early-access": "early-access",
  "morning-given": "morning-given",
  "movement-window": "movement",
  "lunch-break": "lunch",
  "ceo-workday": "ceo-workday",
  "time-freedom": "time-freedom",
  "power-down": "power-down",
  "digital-detox": null,
}

/** Resolve the SDD segment id for a given engine block id (or null). */
export function sddSegmentIdFor(blockId: BlockId): string | null {
  return ENGINE_BLOCK_TO_SDD_SEGMENT[blockId] ?? null
}
