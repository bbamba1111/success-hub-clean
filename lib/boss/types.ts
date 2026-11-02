export type BusinessFunction = "attraction" | "sales" | "delivery" | "operations" | "design" | "experiences"

export type Priority = "critical" | "high" | "medium" | "low"

export type LifecycleStatus =
  | "captured"
  | "defined"
  | "planned"
  | "authorized"
  | "assigned"
  | "in_progress"
  | "under_review"
  | "completed"

export type ExceptionStatus =
  | "blocked"
  | "awaiting_approval"
  | "awaiting_external"
  | "on_hold"
  | "cancelled"
  | "failed"

export type WorkStatus = LifecycleStatus | ExceptionStatus

export type ResourceCategory = "founder" | "employee" | "contractor" | "external" | "ai" | "automation"

export interface Resource {
  id: string
  name: string
  category: ResourceCategory
  role: string
  functions: BusinessFunction[]
  capabilities: string[]
  availability: string
  /** External collaborators are never under the founder's direct control. */
  directControl: boolean
  detail: Record<string, string>
}

export type AuthLevel = "research" | "prepare" | "approved_execution" | "preauthorized_execution"

export type PermissionStatus = "authorized" | "awaiting_approval" | "not_authorized" | "suspended" | "expired"

export interface AuditEntry {
  at: string
  by: string
  note: string
}

export interface Permission {
  id: string
  resourceId: string
  action: string
  scope: string
  functions: BusinessFunction[]
  level: AuthLevel
  conditions: string
  limits: string
  approver: string
  duration: string
  status: PermissionStatus
  history: AuditEntry[]
  /** Set when the founder approved a single assignment instead of a standing permission. */
  workId?: string
}

export interface ChangeEntry {
  id: string
  at: string
  actor: string
  workId?: string
  kind:
    | "created"
    | "edited"
    | "status"
    | "reassigned"
    | "priority"
    | "plan"
    | "dependency"
    | "decision"
    | "closeout"
    | "authority"
  summary: string
}

export interface WorkItem {
  id: string
  title: string
  outcome: string
  fn: BusinessFunction
  priority: Priority
  rank: number
  assigneeId: string | null
  ownerId: string
  status: WorkStatus
  dueDate: string
  effortMins: number
  dependsOn: string[]
  parentId: string | null
  approach: string
  requiresFounderDecision: boolean
  decisionQuestion: string
  reviewRequired: boolean
  evidence: string
  inTodayPlan: boolean
  plannedForDate: string | null
  carriedFrom: string | null
  history: ChangeEntry[]
  createdAt: string
}

export interface Notice {
  id: string
  at: string
  workId: string
  resourceId: string
  kind: "reassignment" | "new_assignment" | "dependency"
  summary: string
  status: "pending_authorization" | "authorized" | "dismissed"
}

export type CoordinatorEventKind =
  | "proposed"
  | "awaiting_authorization"
  | "authorized"
  | "simulated"
  | "verified"
  | "exception"
  | "note"

export interface CoordinatorProposal {
  type: "assign"
  workId: string
  resourceId: string
}

export interface CoordinatorEvent {
  id: string
  at: string
  kind: CoordinatorEventKind
  summary: string
  workId?: string
  proposal?: CoordinatorProposal
  resolution?: "open" | "accepted" | "declined"
}

export interface Outcome {
  id: string
  text: string
  done: boolean
}

export interface CloseoutRecord {
  date: string
  closedAt: string
  outcomes: Outcome[]
  completed: string[]
  carried: string[]
  returned: string[]
  cancelled: string[]
  notes: string
}

export interface BusinessDay {
  date: string
  outcomes: Outcome[]
  planConfirmedAt: string | null
  workdayStartedAt: string | null
  closedOutAt: string | null
}

export type OpportunityType =
  | "speaking"
  | "podcast"
  | "media"
  | "partnership"
  | "guest"
  | "collaboration"
  | "wlb_week_invitation"

export type OpportunityStage =
  | "researching"
  | "pitch_preparing"
  | "awaiting_founder_approval"
  | "outreach_sent"
  | "response_received"
  | "closed"

export interface Opportunity {
  id: string
  name: string
  organization: string
  contact: string
  type: OpportunityType
  notes: string
  fit: "strong" | "moderate" | "weak" | "unassessed"
  source: string
  nextAction: string
  assigneeId: string
  approval: "not_required" | "awaiting" | "approved" | "declined"
  followUp: string
  stage: OpportunityStage
  outcome: string
}

export interface SystemRecord {
  id: string
  type: "sop" | "workflow" | "system" | "automation"
  name: string
  fn: BusinessFunction
  ownerId: string
  responsibility: string
  reviewDate: string
  approval: "approved" | "draft" | "under_review"
  summary: string
}

export type ProfileField = { key: string; label: string; value: string; prompt: string; multiline?: boolean }

export type ClockMode = "live" | "planning" | "workday" | "closeout" | "protected"

export interface BossState {
  version: number
  resources: Resource[]
  permissions: Permission[]
  work: WorkItem[]
  notices: Notice[]
  coordinator: CoordinatorEvent[]
  changes: ChangeEntry[]
  day: BusinessDay
  pastDays: CloseoutRecord[]
  opportunities: Opportunity[]
  systems: SystemRecord[]
  founderProfile: ProfileField[]
  businessProfile: ProfileField[]
  clockMode: ClockMode
  seq: number
}
