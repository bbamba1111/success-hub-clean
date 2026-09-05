/**
 * Weekly WLBB (Work-Life Balance Blueprint™) state — the canonical record of
 * what a founder chose during the Monday 30-Minute Design My WLB Weekly
 * Debrief™, and how that choice evolves Tuesday–Thursday.
 *
 * One record per WLBB Week (Monday–Thursday). A new Monday creates a new
 * week; prior weeks are never overwritten (see storage.ts).
 */

/** Days that carry a daily update inside the WLBB Week. Fri/Sat are Time Freedom™ — no CEO Workday. */
export type WlbbDayKey = "monday" | "tuesday" | "wednesday" | "thursday"

export type LifeIntentionKind =
  | "family"
  | "reconnect"
  | "forgive"
  | "ask-forgiveness"
  | "movement"
  | "rest"
  | "nature"
  | "recreation"
  | "other"

export interface LifeIntention {
  id: string
  kind: LifeIntentionKind
  /** Free-text label, e.g. "Family dinner", "Call my sister", "7-minute Tai Chi". */
  label: string
  /** Optional explicit scheduling, e.g. "Wednesday" + "6:30 PM". Left undefined = open weekly intention. */
  day?: string
  time?: string
  /** Relationship-repair entries are private — only ever shown back to the founder themself. */
  isRelationshipRepair?: boolean
  completed?: boolean
  addedOn: string // ISO timestamp
}

export type OutcomeStatus = "not-started" | "selected-today" | "completed" | "carried-forward" | "deferred"

export interface BusinessOutcome {
  id: string
  areaId: string
  areaName: string
  text: string
  operatingBehaviors: string[]
  /** Auto-derived from the catalog mapping — primary function area(s) that support this outcome. */
  primaryExecutiveIds: string[]
  supportingExecutiveIds: string[]
  status: OutcomeStatus
  /** Optional explicit day if the founder scheduled this outcome for a specific day. */
  scheduledDay?: WlbbDayKey
  addedOn: string // ISO timestamp
  completedOn?: string
}

export interface DailyEntry {
  /** Outcome ids the founder selected to work on this day. */
  selectedOutcomeIds: string[]
  /** Outcome ids completed this day. */
  completedOutcomeIds: string[]
  /** Outcome ids carried forward into this day from a prior day. */
  carriedForwardOutcomeIds: string[]
  ceoWorkspaceEntered: boolean
  updatedAt: string // ISO timestamp
}

export interface WlbbWeekState {
  weekKey: string // Monday date, YYYY-MM-DD
  life: {
    intentions: LifeIntention[]
  }
  business: {
    businessAreaId: string | null
    outcomes: BusinessOutcome[]
    humanZoneOfGeniusPracticeTitle: string | null
    /** Ids of open EgaEntry rows (lib/ega/types.ts) the founder chose as this week's Bottlenecks — max 3. */
    bottleneckEgaEntryIds: string[]
  }
  gpsRecommendation: string | null
  debriefCompletedAt: string | null // ISO timestamp — set once the Monday Debrief™ is completed
  daily: Partial<Record<WlbbDayKey, DailyEntry>>
  updatedAt: string // ISO timestamp
}
