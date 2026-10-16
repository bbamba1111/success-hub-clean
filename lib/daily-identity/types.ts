/**
 * Daily Identity™ — the record of what a founder decided during the
 * Tue–Thu "Decide My Identity & Design My Business Boundaries™" block
 * (9:45–10:30 AM, `daily-planning-gps`).
 *
 * Unlike the Weekly WLBB Menu™ (one record per Monday-start week), this is
 * a per-calendar-day decision — a founder decides who they're being and
 * what boundaries hold *today*, and that can be revisited/changed later in
 * the day as things come up ("life happens").
 */

export type IdentityCheckInStatus = "done" | "partial" | "not-yet" | "changed"

export interface IdentityCheckIn {
  status: IdentityCheckInStatus
  note?: string
  recordedAt: string // ISO timestamp
}

export interface DailyIdentityRecord {
  /** Calendar date this record belongs to, e.g. "2026-08-18". */
  dateKey: string
  /** "Who I'm being today" — free text, optionally seeded from a quick-pick chip. */
  identityStatement: string
  /** Today's Business Boundaries™ statement — what today will and won't include. */
  boundaryStatement: string
  /** CEO Workday™ outcome ids selected for today, mirrored into the Weekly WLBB Menu™'s DailyEntry. */
  ceoOutcomeIds: string[]
  /** End-of-block Cherry Blossom Check-in™ result, if recorded. */
  checkIn?: IdentityCheckIn
  updatedAt: string // ISO timestamp
}
