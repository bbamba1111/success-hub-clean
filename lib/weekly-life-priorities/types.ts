/**
 * Weekly Life Priorities™ — a COLLECTION.
 *
 * Unlike the old single "Weekly Life Priority™" field, a founder may hold
 * MANY life priorities for a given week. There is deliberately no maximum:
 * we do not ask a founder to narrow their whole life down to three things.
 *
 * Each row is one life priority the founder wants to make room for this week.
 * Stored per (founder, week) in public.weekly_life_priorities.
 */

export interface WeeklyLifePriority {
  id: string
  weekKey: string
  /** Catalog category id, or "custom". */
  optionId: string | null
  label: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/** A not-yet-persisted selection (used while choosing before the row exists). */
export interface LifePrioritySelection {
  optionId: string | null
  label: string
}
