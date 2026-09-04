/**
 * Weekly Work-Life Balance Commitments™ — the three changes a founder chooses
 * in Decide & Design™ and carries through the Work-Life Balance Business Week™.
 *
 *   WEEKLY LIFE PRIORITY™            = what I am protecting in my life
 *   WEEKLY DELEGATION PRIORITY™      = what I am moving off my plate
 *   WEEKLY OPERATING RULE PRIORITY™  = what I am changing about how work operates
 *
 * These are NOT task lists. They are three conditions being integrated into
 * how the founder operates. The CEO Workday™ (FounderGpsWorkspace) remains the
 * protected container for real business work and is not touched by this model.
 *
 * One record per founder per WLBB week (Monday-keyed). Never duplicated.
 */

export type LifePriorityStatus =
  | "not-planned"
  | "planned"
  | "in-progress"
  | "experienced"
  | "deferred"
  | "changed"

export type DelegationStatus =
  | "not-started"
  | "in-progress"
  | "delegated"
  | "completed"
  | "deferred"
  | "no-longer-needed"

export type OperatingRuleStatus =
  | "not-started"
  | "in-progress"
  | "implemented"
  | "needs-adjustment"
  | "deferred"
  | "no-longer-needed"

/** Where the Life Priority is protected in time — After 5 / Weekend Life Priority™. */
export type LifeWindow = "after-5" | "friday" | "saturday" | "sunday" | "time-freedom"

export type BoundaryAudience = "family" | "partner" | "team" | "clients" | "partners" | "stakeholders" | "other"

export interface WeeklyCommitments {
  id: string | null
  weekKey: string

  // Priority 1 — Weekly Life Priority™
  lifePriority: string | null
  /** Catalog option id, or "custom". */
  lifePriorityOptionId: string | null
  lifeWindows: LifeWindow[]
  lifeIntention: string | null
  lifeIntentionVariant: number
  lifeIntentionEdited: boolean
  lifeStatus: LifePriorityStatus
  boundaryAudiences: BoundaryAudience[]
  boundaryDraft: string | null
  boundaryDraftEdited: boolean

  // Priority 2 — Weekly Delegation Priority™
  delegationPriority: string | null
  delegationOptionId: string | null
  delegationIntention: string | null
  delegationIntentionVariant: number
  delegationIntentionEdited: boolean
  delegationStatus: DelegationStatus

  // Priority 3 — Weekly Operating Rule Priority™
  operatingRule: string | null
  operatingRuleOptionId: string | null
  operatingRuleIntention: string | null
  operatingRuleIntentionVariant: number
  operatingRuleIntentionEdited: boolean
  operatingRuleStatus: OperatingRuleStatus

  // My 4-Hour CEO Workday Declaration™ — the three priorities woven into one
  // first-person declaration, built in Decide & Design™ and read aloud at the
  // top of the live CEO Workday™ every day this week.
  workdayDeclaration: string | null
  workdayDeclarationVariant: number
  workdayDeclarationEdited: boolean
  /** Set when the founder presses "Build My Declaration". */
  workdayDeclarationBuiltAt: string | null

  /** Set when the founder presses "Save My Week". */
  designedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export function emptyWeeklyCommitments(weekKey: string): WeeklyCommitments {
  return {
    id: null,
    weekKey,
    lifePriority: null,
    lifePriorityOptionId: null,
    lifeWindows: [],
    lifeIntention: null,
    lifeIntentionVariant: 0,
    lifeIntentionEdited: false,
    lifeStatus: "not-planned",
    boundaryAudiences: [],
    boundaryDraft: null,
    boundaryDraftEdited: false,
    delegationPriority: null,
    delegationOptionId: null,
    delegationIntention: null,
    delegationIntentionVariant: 0,
    delegationIntentionEdited: false,
    delegationStatus: "not-started",
    operatingRule: null,
    operatingRuleOptionId: null,
    operatingRuleIntention: null,
    operatingRuleIntentionVariant: 0,
    operatingRuleIntentionEdited: false,
    operatingRuleStatus: "not-started",
    workdayDeclaration: null,
    workdayDeclarationVariant: 0,
    workdayDeclarationEdited: false,
    workdayDeclarationBuiltAt: null,
    designedAt: null,
    createdAt: null,
    updatedAt: null,
  }
}

export const LIFE_STATUS_LABEL: Record<LifePriorityStatus, string> = {
  "not-planned": "Not planned",
  planned: "Planned",
  "in-progress": "In progress",
  experienced: "Experienced / Completed",
  deferred: "Deferred",
  changed: "Changed",
}

export const DELEGATION_STATUS_LABEL: Record<DelegationStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  delegated: "Delegated",
  completed: "Completed",
  deferred: "Deferred",
  "no-longer-needed": "No longer needed",
}

export const OPERATING_RULE_STATUS_LABEL: Record<OperatingRuleStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  implemented: "Implemented",
  "needs-adjustment": "Needs adjustment",
  deferred: "Deferred",
  "no-longer-needed": "No longer needed",
}

export const LIFE_WINDOW_LABEL: Record<LifeWindow, string> = {
  "after-5": "After 5",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  "time-freedom": "Another Time Freedom™ window",
}

export const BOUNDARY_AUDIENCE_LABEL: Record<BoundaryAudience, string> = {
  family: "Family",
  partner: "Partner",
  team: "Team",
  clients: "Clients",
  partners: "Partners",
  stakeholders: "Stakeholders",
  other: "Other",
}

/** A priority still open at the end of its week — the next week decides what to do with it. */
export function isStillInProgress(c: WeeklyCommitments): {
  life: boolean
  delegation: boolean
  operatingRule: boolean
} {
  return {
    life: !!c.lifePriority && !["experienced", "changed", "deferred"].includes(c.lifeStatus),
    delegation:
      !!c.delegationPriority && !["completed", "delegated", "no-longer-needed", "deferred"].includes(c.delegationStatus),
    operatingRule:
      !!c.operatingRule && !["implemented", "no-longer-needed", "deferred"].includes(c.operatingRuleStatus),
  }
}
