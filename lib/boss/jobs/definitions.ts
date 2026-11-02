export const JOB_FUNCTIONS = [
  { key: "attraction", label: "Client Attraction" },
  { key: "sales", label: "Sales" },
  { key: "delivery", label: "Delivery" },
  { key: "operations", label: "Operations" },
  { key: "design", label: "Design" },
] as const
export type JobFunction = (typeof JOB_FUNCTIONS)[number]["key"]

export const JOB_STATUSES = [
  { key: "not_started", label: "Not Started" },
  { key: "working", label: "Working" },
  { key: "waiting_for_you", label: "Waiting for You" },
  { key: "needs_help", label: "Needs Help" },
  { key: "done", label: "Done" },
] as const
export type JobStatus = (typeof JOB_STATUSES)[number]["key"]

export const PERMISSION_LEVELS = [
  { key: "research", label: "Look up", hint: "Find information only" },
  { key: "prepare", label: "Get ready", hint: "Prepare drafts, nothing goes out" },
  { key: "approved_execution", label: "Do after your OK", hint: "Act only after you say yes" },
  { key: "preauthorized_execution", label: "Do within limits", hint: "Act within limits you set" },
] as const
export type PermissionLevel = (typeof PERMISSION_LEVELS)[number]["key"]

export const DECISIONS = [
  { key: "yes_do_it", label: "Yes, Do It" },
  { key: "no_stop", label: "No, Stop" },
  { key: "change_it", label: "Change It" },
  { key: "wait", label: "Wait" },
] as const
export type JobDecision = (typeof DECISIONS)[number]["key"]

export const EXECUTIVES = [
  { id: "strategy", name: "Strategy Executive™" },
  { id: "marketing-brand", name: "Marketing & Brand Executive™" },
  { id: "sales", name: "Sales Executive™" },
  { id: "operations", name: "Operations Executive™" },
  { id: "finance", name: "Finance Executive™" },
  { id: "people-culture", name: "People & Culture Executive™" },
  { id: "client-success", name: "Client Success Executive™" },
  { id: "innovation", name: "Innovation Executive™" },
  { id: "growth", name: "Growth Executive™" },
] as const
export type ExecutiveId = (typeof EXECUTIVES)[number]["id"]

export type AssigneeType = "founder" | "cherry" | "executive" | "team_member"
export type JobActor = "founder" | "cherry" | "executive" | "system"

export type TeamMember = {
  id: string
  name: string
  role: string | null
  memberType: "employee" | "contractor"
  businessFunctions: JobFunction[]
  note: string | null
  archived: boolean
}

export type Job = {
  id: string
  title: string
  details: string | null
  businessFunction: JobFunction
  dueDate: string | null
  doFirstRank: number
  assigneeType: AssigneeType
  assigneeExecutiveId: ExecutiveId | null
  assigneeTeamMemberId: string | null
  status: JobStatus
  paused: boolean
  stopped: boolean
  permissionLevel: PermissionLevel
  waitingQuestion: string | null
  whatsReady: string | null
  decision: JobDecision | null
  decisionNote: string | null
  decidedAt: string | null
  createdByActor: JobActor
  lastChangeActor: JobActor
  updatedAt: string
  dependsOn: string[]
  onTodaysWorkday: boolean
  openProposal: JobProposal | null
}

export const ACTION_KINDS = [
  { key: "job.save_whats_ready", label: "Write What's Ready", requires: "prepare" },
  { key: "job.set_status", label: "Change the status", requires: "approved_execution" },
] as const
export type ActionKind = (typeof ACTION_KINDS)[number]["key"]

export type JobProposal = {
  id: string
  version: number
  proposedBy: JobActor
  aiCapability: string
  summary: string
  actionKind: ActionKind
  payloadHash: string
  status: "pending" | "approved" | "change_requested" | "waiting" | "failed"
  error: string | null
  createdAt: string
}

export type Preauthorization = {
  id: string
  jobId: string | null
  businessFunction: JobFunction | null
  actionKinds: ActionKind[]
  maxUses: number | null
  uses: number
  note: string | null
  expiresAt: string
  revokedAt: string | null
}

export function preauthorizationActive(p: Preauthorization) {
  return !p.revokedAt && new Date(p.expiresAt).getTime() > Date.now() && (p.maxUses === null || p.uses < p.maxUses)
}

export type JobHistoryEntry = {
  id: string
  action: string
  actor: string
  field: string | null
  previousValue: string | null
  newValue: string | null
  note: string | null
  result: string | null
  error: string | null
  createdAt: string
}

export type JobsData = {
  jobs: Job[]
  team: TeamMember[]
  todayPlanId: string | null
  todayDate: string
  preauthorizations: Preauthorization[]
}

export const JOB_AREAS = [
  { key: "mine", label: "My Jobs" },
  { key: "cherry", label: "Cherry's Jobs" },
  { key: "team", label: "My Team's Jobs" },
  { key: "waiting", label: "Waiting for Me" },
  { key: "done", label: "Done" },
] as const
export type JobArea = (typeof JOB_AREAS)[number]["key"]

export function isClosed(job: Job) {
  return job.status === "done" || job.stopped
}

export function jobInArea(job: Job, area: JobArea) {
  if (area === "done") return isClosed(job)
  if (isClosed(job)) return false
  if (area === "waiting") return job.status === "waiting_for_you" || job.status === "needs_help"
  if (area === "mine") return job.assigneeType === "founder"
  if (area === "cherry") return job.assigneeType === "cherry" || job.assigneeType === "executive"
  return job.assigneeType === "team_member"
}

export function labelFor<T extends { key: string; label: string }>(list: readonly T[], key: string | null) {
  return list.find((item) => item.key === key)?.label ?? key ?? ""
}

export function assigneeName(
  type: AssigneeType,
  executiveId: string | null,
  teamMemberId: string | null,
  team: TeamMember[],
) {
  if (type === "founder") return "You"
  if (type === "cherry") return "Cherry Blossom™"
  if (type === "executive") return EXECUTIVES.find((e) => e.id === executiveId)?.name ?? "Executive"
  return team.find((m) => m.id === teamMemberId)?.name ?? "Team member"
}

export function todayInEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}
