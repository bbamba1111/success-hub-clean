/**
 * Work-Life Balance Boundary Library™ — type definitions.
 *
 * This is a structured BACKEND/CONTENT layer, not a founder-facing assessment.
 * It provides reusable boundary patterns and the business-design options that
 * can support them, plus the relationships that let a future Boundary Builder™
 * move a founder from:
 *
 *   Weekly Work-Life Balance Boundary Focus™
 *     → Work-Life Balance Boundary™
 *     → Business Requirement
 *     → Operating Rule
 *     → Implementation
 *     → Escalation / Exceptions
 *     → Stakeholder Alignment
 *     → Training / Q&A / Follow-Up
 *     → Human SOS™
 *
 * Everything here is static content EXCEPT custom boundaries, which are the one
 * piece of user data (persisted in public.custom_boundaries under RLS).
 */

/* ------------------------------------------------------------------ */
/* Signal vocabularies (relationship tokens, not new assessments)      */
/* ------------------------------------------------------------------ */

/**
 * Reality Check™ signal tokens. These are NOT a new diagnostic — they are
 * lightweight tokens the future recommendation engine can derive from the
 * existing Boundary Report™ (priority focus areas, baseline areas,
 * collisions) and match against boundary patterns.
 */
export type RealityCheckSignal =
  | "frequent-evening-work"
  | "frequent-weekend-work"
  | "after-hours-availability"
  | "after-hours-communication"
  | "founder-dependency"
  | "founder-approval-dependency"
  | "high-relationship-priority"
  | "high-family-priority"
  | "high-health-priority"
  | "high-rest-priority"
  | "low-recovery"
  | "always-on"
  | "interrupted-focus"
  | "no-defined-workday"
  | "travel-conflict"

/** Business & Workplace Reality™ operating signals. */
export type BusinessRealitySignal =
  | "high-meeting-load"
  | "founder-approval-dependency"
  | "after-hours-communication"
  | "low-team-ownership"
  | "client-scope-volatility"
  | "high-repetitive-workload"
  | "no-coverage"
  | "unclear-ownership"
  | "no-escalation-path"
  | "reactive-communication"
  | "capacity-overload"

/* ------------------------------------------------------------------ */
/* Core library objects                                                */
/* ------------------------------------------------------------------ */

/** A. Boundary Families — broad types of Work-Life Balance Boundaries™. */
export type BoundaryFamilyId =
  | "time"
  | "availability"
  | "focus"
  | "communication"
  | "meetings"
  | "decision-ownership"
  | "client"
  | "team"
  | "workload-capacity"
  | "recovery-human"
  | "ai-automation"

export interface BoundaryFamily {
  id: BoundaryFamilyId
  name: string
  description: string
  sortOrder: number
}

/** B. Boundary Patterns — specific boundaries within a family. */
export interface BoundaryPattern {
  id: string
  family: BoundaryFamilyId
  name: string
  shortDescription: string
  /** Plain first-person founder language. */
  boundaryStatement: string
  bestFor: string
  /** C. Boundary Focus Mapping → Life Priorities™ (ids from LIFE_PRIORITY_CATEGORIES). */
  possibleLifePriorities: string[]
  relatedRealityCheckSignals: RealityCheckSignal[]
  relatedBusinessRealitySignals: BusinessRealitySignal[]
  /** D. Business Requirements this boundary may need (ids). */
  businessRequirements: BusinessRequirementId[]
  /** E. Operating Rule Patterns commonly used to realize this boundary (ids). */
  operatingRules: string[]
  /** G. Escalation patterns this boundary can adopt (ids). */
  escalationPatterns: string[]
  /** H. Exception patterns commonly relevant (ids). */
  exceptionPatterns: string[]
  /** I. Stakeholder types commonly relevant (ids). */
  stakeholderTypes: StakeholderTypeId[]
  active: boolean
  sortOrder: number
}

/** D. Business Requirements — business changes that may enable a boundary. */
export type BusinessRequirementId =
  | "delegate"
  | "eliminate"
  | "automate"
  | "ai-augment"
  | "systematize"
  | "change-scheduling"
  | "change-meetings"
  | "change-communication-expectations"
  | "change-client-expectations"
  | "reassign-decision-ownership"
  | "create-coverage"
  | "clarify-ownership"
  | "change-workload-capacity"
  | "create-escalation-coverage"
  | "document-process"
  | "create-backup-ownership"
  | "other-custom"

export interface BusinessRequirement {
  id: BusinessRequirementId
  label: string
  description: string
  /** E. Operating Rule Patterns this requirement can produce (ids). */
  operatingRules: string[]
}

/** E. Operating Rule Patterns — concrete ways the business can operate differently. */
export interface OperatingRulePattern {
  id: string
  category: BoundaryFamilyId
  name: string
  /** The rule as it would read in an operating agreement. */
  ruleText: string
  businessRequirements: BusinessRequirementId[]
  /** F. Implementation requirements this rule commonly needs (ids). */
  implementationRequirements: string[]
  sortOrder: number
}

/** F. Implementation Requirements — things needed for a rule to work. */
export interface ImplementationRequirement {
  id: string
  label: string
  description: string
}

/** G. Escalation Patterns — templates for who handles a challenged boundary. */
export interface EscalationLevel {
  order: number
  role: string
  responsibility: string
}

export interface EscalationPattern {
  id: string
  name: string
  trigger: string
  channel: string
  responseExpectation: string
  founderInvolvementThreshold: string
  levels: EscalationLevel[]
}

/** H. Exception Patterns — what qualifies (and what does NOT). */
export interface ExceptionPattern {
  id: string
  label: string
  /** true = a legitimate exception; false = explicitly NOT an exception. */
  isException: boolean
  description: string
}

/** I. Stakeholder Types. */
export type StakeholderTypeId =
  | "founder"
  | "team-member"
  | "manager"
  | "client"
  | "partner"
  | "vendor"
  | "investor"
  | "shareholder"
  | "board-member"
  | "advisor"
  | "contractor"
  | "family-personal"
  | "other"

export interface StakeholderType {
  id: StakeholderTypeId
  label: string
  description: string
}

/** I. Stakeholder Requirements — what a stakeholder may need to do. */
export type StakeholderRequirementId =
  | "must-be-informed"
  | "must-acknowledge"
  | "must-approve"
  | "must-change-behavior"
  | "must-take-ownership"
  | "must-receive-training"
  | "must-attend-qa"
  | "must-attend-meeting"
  | "must-understand-escalation"
  | "must-confirm-coverage"
  | "must-confirm-effective-date"

export interface StakeholderRequirement {
  id: StakeholderRequirementId
  label: string
  description: string
}

/** J. Training / Q&A / Follow-Up requirement patterns. */
export type TrainingRequirementId =
  | "none"
  | "written-instructions"
  | "training-session"
  | "qa-session"
  | "team-meeting"
  | "client-meeting"
  | "one-on-one"
  | "walkthrough"
  | "demonstration"
  | "practice-period"
  | "test-period"
  | "follow-up-meeting"
  | "confirmation-checkpoint"

export interface TrainingRequirement {
  id: TrainingRequirementId
  label: string
  description: string
}

/**
 * Response / Alignment model — reused from the existing Communicate It™ tool.
 * Included here only so the future Builder can reference the shared vocabulary;
 * the Communicate It™ tool itself is NOT changed by this library.
 */
export type BoundaryResponseState = "thumbs-up" | "thumbs-down" | "question" | "pending"

/* ------------------------------------------------------------------ */
/* Custom boundaries (the only user-data object in the library)        */
/* ------------------------------------------------------------------ */

export type CustomBoundaryStatus = "draft" | "active" | "archived"

/** A founder-authored boundary that reuses the same downstream Builder process. */
export interface CustomBoundary {
  id: string
  weekKey: string | null
  boundaryFocus: string | null
  boundaryStatement: string
  lifePriorityId: string | null
  businessRequirementIds: BusinessRequirementId[]
  familyId: BoundaryFamilyId | null
  status: CustomBoundaryStatus
  createdAt: string
  updatedAt: string
}

export type CustomBoundaryInput = {
  weekKey?: string | null
  boundaryFocus?: string | null
  boundaryStatement: string
  lifePriorityId?: string | null
  businessRequirementIds?: BusinessRequirementId[]
  familyId?: BoundaryFamilyId | null
  status?: CustomBoundaryStatus
}
