/**
 * Weekly Work-Life Balance Boundary Focus™ — EXACTLY ONE per (founder, week).
 *
 * This is the single boundary the founder commits to building into the
 * business and living this week. It is a separate concept from Life
 * Priorities™ (which is a collection). Delegation, operating rules, and
 * stakeholder steps are NOT stored here — they become the Boundary Builder™
 * in a later milestone.
 */

export type BoundaryFocusStatus = "chosen" | "in-progress" | "built" | "deferred"

export interface WeeklyBoundaryFocus {
  id: string | null
  weekKey: string
  /** The boundary the founder is building this week. */
  boundaryText: string | null
  /** Catalog option id, or "custom". */
  optionId: string | null
  /** Why this was recommended / where it came from (recommendation context). */
  sourceContext: string | null
  status: BoundaryFocusStatus
  createdAt: string | null
  updatedAt: string | null
}

export function emptyBoundaryFocus(weekKey: string): WeeklyBoundaryFocus {
  return {
    id: null,
    weekKey,
    boundaryText: null,
    optionId: null,
    sourceContext: null,
    status: "chosen",
    createdAt: null,
    updatedAt: null,
  }
}

export const BOUNDARY_FOCUS_STATUS_LABEL: Record<BoundaryFocusStatus, string> = {
  chosen: "Chosen",
  "in-progress": "In progress",
  built: "Built into the business",
  deferred: "Deferred",
}
