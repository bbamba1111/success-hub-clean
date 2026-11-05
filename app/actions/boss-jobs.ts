"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { LEGACY_BUSINESS_FUNCTIONS, SEVEN_BUSINESS_FUNCTIONS } from "@/lib/business-functions"
import {
  DECISIONS,
  ALL_JOB_FUNCTIONS,
  EXECUTIVES,
  JOB_FUNCTIONS,
  JOB_STATUSES,
  PERMISSION_LEVELS,
  todayInEastern,
  type AssigneeType,
  type JobDecision,
  type JobHistoryEntry,
  type JobStatus,
  type PermissionLevel,
} from "@/lib/boss/jobs/definitions"

type Result = { ok: true } | { ok: false; error: string }

const JOBS_PATH = "/boss/queue"
const TEAM_PATH = "/boss/workforce"
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function requireFounder() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

function text(raw: unknown, max: number, required = false) {
  const value = typeof raw === "string" ? raw.trim() : ""
  if (required && value.length === 0) return undefined
  if (value.length > max) return undefined
  return value.length === 0 ? null : value
}

function isOneOf<T extends string>(list: readonly { key: T }[], value: unknown): value is T {
  return typeof value === "string" && list.some((item) => item.key === value)
}

function finish(error: { message: string } | null, fallback: string): Result {
  if (error) {
    console.error("[v0] boss jobs action failed:", error.message)
    return { ok: false, error: fallback }
  }
  revalidatePath(JOBS_PATH)
  revalidatePath(TEAM_PATH)
  return { ok: true }
}

type AssigneeInput = { type: AssigneeType; executiveId?: string | null; teamMemberId?: string | null }

function resolveAssignee(input: AssigneeInput) {
  if (input.type === "founder" || input.type === "cherry") {
    return { assignee_type: input.type, assignee_executive_id: null, assignee_team_member_id: null }
  }
  if (input.type === "executive" && EXECUTIVES.some((e) => e.id === input.executiveId)) {
    return { assignee_type: "executive", assignee_executive_id: input.executiveId, assignee_team_member_id: null }
  }
  if (input.type === "team_member" && typeof input.teamMemberId === "string" && UUID.test(input.teamMemberId)) {
    return { assignee_type: "team_member", assignee_executive_id: null, assignee_team_member_id: input.teamMemberId }
  }
  return null
}

export type JobInput = {
  title: string
  details?: string
  businessFunction: string
  dueDate?: string
  assignee: AssigneeInput
  permissionLevel?: string
}

/** New jobs use the seven standard functions; edits may keep an earlier saved one. */
function cleanJobInput(input: JobInput, { allowLegacy }: { allowLegacy: boolean }) {
  const title = text(input.title, 200, true)
  const details = text(input.details, 4000)
  if (!title || details === undefined) return null
  if (!isOneOf(allowLegacy ? ALL_JOB_FUNCTIONS : JOB_FUNCTIONS, input.businessFunction)) return null
  const dueDate = input.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(input.dueDate) ? input.dueDate : null
  const assignee = resolveAssignee(input.assignee)
  if (!assignee) return null
  const permission: PermissionLevel = isOneOf(PERMISSION_LEVELS, input.permissionLevel)
    ? input.permissionLevel
    : "research"
  return {
    title,
    details,
    business_function: input.businessFunction,
    due_date: dueDate,
    permission_level: permission,
    ...assignee,
  }
}

export async function createJob(input: JobInput): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const clean = cleanJobInput(input, { allowLegacy: false })
  if (!clean) return { ok: false, error: "Please check the job details." }

  const { data: last } = await supabase
    .from("boss_jobs")
    .select("do_first_rank")
    .eq("user_id", userId)
    .order("do_first_rank", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from("boss_jobs").insert({
    user_id: userId,
    ...clean,
    do_first_rank: (last?.do_first_rank ?? 0) + 1,
    last_change_actor: "founder",
    last_change_action: "created",
  })
  return finish(error, "The job could not be saved.")
}

export async function updateJob(jobId: string, input: JobInput): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return { ok: false, error: "Please sign in again." }
  const clean = cleanJobInput(input, { allowLegacy: true })
  if (!clean) return { ok: false, error: "Please check the job details." }
  const { error } = await supabase
    .from("boss_jobs")
    .update({ ...clean, last_change_actor: "founder", last_change_action: "changed" })
    .eq("id", jobId)
    .eq("user_id", userId)
  return finish(error, "The change could not be saved.")
}

async function patchJob(jobId: string, patch: Record<string, unknown>, action: string, fallback: string) {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return { ok: false, error: "Please sign in again." } as Result
  const { error } = await supabase
    .from("boss_jobs")
    .update({ ...patch, last_change_actor: "founder", last_change_action: action })
    .eq("id", jobId)
    .eq("user_id", userId)
  return finish(error, fallback)
}

export async function setJobStatus(jobId: string, status: string, note?: string): Promise<Result> {
  if (!isOneOf(JOB_STATUSES, status)) return { ok: false, error: "Unknown status." }
  const cleanNote = text(note, 2000)
  if (cleanNote === undefined) return { ok: false, error: "That note is too long." }
  const patch: Record<string, unknown> = { status: status as JobStatus, last_change_note: cleanNote }
  if (status === "done") patch.paused = false
  return patchJob(jobId, patch, status === "done" ? "finished" : "status_changed", "The status could not be saved.")
}

export async function setJobPaused(jobId: string, paused: boolean): Promise<Result> {
  return patchJob(jobId, { paused }, paused ? "paused" : "resumed", "The job could not be paused.")
}

export async function setJobStopped(jobId: string, stopped: boolean): Promise<Result> {
  return patchJob(jobId, { stopped, paused: false }, stopped ? "stopped" : "restarted", "The job could not be stopped.")
}

export async function moveJob(jobId: string, direction: "up" | "down"): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return { ok: false, error: "Please sign in again." }
  const { data: jobs } = await supabase
    .from("boss_jobs")
    .select("id, do_first_rank")
    .eq("user_id", userId)
    .eq("stopped", false)
    .neq("status", "done")
    .order("do_first_rank")
    .order("created_at")
  const list = jobs ?? []
  const index = list.findIndex((j) => j.id === jobId)
  const swapWith = direction === "up" ? index - 1 : index + 1
  if (index < 0 || swapWith < 0 || swapWith >= list.length) return { ok: true }
  const reordered = [...list]
  ;[reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]]
  for (let i = 0; i < reordered.length; i++) {
    if (reordered[i].do_first_rank === i + 1) continue
    const { error } = await supabase
      .from("boss_jobs")
      .update({ do_first_rank: i + 1, last_change_actor: "founder", last_change_action: "reordered" })
      .eq("id", reordered[i].id)
      .eq("user_id", userId)
    if (error) return finish(error, "The order could not be saved.")
  }
  return finish(null, "")
}

/** Give a job to the founder, Cherry Blossom™ or one executive. Only the owner can change it. */
export async function setJobAssignee(jobId: string, assignee: AssigneeInput): Promise<Result> {
  const resolved = resolveAssignee(assignee)
  if (!resolved) return { ok: false, error: "Please choose who should do this." }
  const result = await patchJob(jobId, resolved, "reassigned", "That change could not be saved.")
  if (result.ok) revalidatePath("/ceo-workday")
  return result
}

export type WorkdayJobView = {
  id: string
  title: string
  assigneeType: AssigneeType
  assigneeExecutiveId: string | null
  status: JobStatus
  paused: boolean
  stopped: boolean
  whatsReady: string | null
  waitingQuestion: string | null
  decision: JobDecision | null
  pendingApproval: string | null
  /** The executive's latest work waiting for the founder (Phase 4 proposal). */
  pendingWork: { id: string; hash: string; summary: string; text: string | null; proposedBy: string } | null
  permissionLevel: PermissionLevel
  /** The real result the founder recorded when finishing (link or where it lives). */
  finishedResult: string | null
  blockedBy: number
}

/** Read-only view of the jobs carrying today's CEO Workday™ items. */
export async function loadWorkdayJobs(jobIds: string[]): Promise<WorkdayJobView[]> {
  const ids = Array.from(new Set(jobIds.filter((id) => typeof id === "string" && UUID.test(id)))).slice(0, 100)
  if (ids.length === 0) return []
  const { supabase, userId } = await requireFounder()
  if (!userId) return []
  const [jobsRes, proposalsRes, depsRes] = await Promise.all([
    supabase
      .from("boss_jobs")
      .select(
        "id, title, assignee_type, assignee_executive_id, status, paused, stopped, whats_ready, waiting_question, decision, permission_level, last_change_action, last_change_note",
      )
      .eq("user_id", userId)
      .in("id", ids),
    supabase
      .from("boss_job_proposals")
      .select("id, job_id, summary, version, payload_hash, action_kind, action_payload, proposed_by")
      .eq("user_id", userId)
      .eq("status", "pending")
      .in("job_id", ids)
      .order("version", { ascending: false }),
    supabase.from("boss_job_dependencies").select("job_id, depends_on_job_id").eq("user_id", userId).in("job_id", ids),
  ])
  if (jobsRes.error) {
    console.error("[v0] workday jobs load failed:", jobsRes.error.message)
    return []
  }
  const pending = new Map<string, string>()
  const pendingWork = new Map<string, NonNullable<WorkdayJobView["pendingWork"]>>()
  for (const p of proposalsRes.data ?? []) {
    if (pending.has(p.job_id)) continue
    pending.set(p.job_id, p.summary)
    const payload = p.action_payload as { text?: unknown } | null
    pendingWork.set(p.job_id, {
      id: p.id,
      hash: p.payload_hash,
      summary: p.summary,
      text: p.action_kind === "job.save_whats_ready" && typeof payload?.text === "string" ? payload.text : null,
      proposedBy: p.proposed_by,
    })
  }

  const depIds = Array.from(new Set((depsRes.data ?? []).map((d) => d.depends_on_job_id as string)))
  const openDeps = new Set<string>()
  if (depIds.length) {
    const { data } = await supabase.from("boss_jobs").select("id, status, stopped").eq("user_id", userId).in("id", depIds)
    for (const d of data ?? []) if (d.status !== "done" && !d.stopped) openDeps.add(d.id as string)
  }
  const blockedBy = new Map<string, number>()
  for (const d of depsRes.data ?? []) {
    if (openDeps.has(d.depends_on_job_id as string)) blockedBy.set(d.job_id as string, (blockedBy.get(d.job_id as string) ?? 0) + 1)
  }

  return (jobsRes.data ?? []).map((j) => ({
    id: j.id,
    title: j.title,
    assigneeType: j.assignee_type,
    assigneeExecutiveId: j.assignee_executive_id,
    status: j.status,
    paused: j.paused,
    stopped: j.stopped,
    whatsReady: j.whats_ready,
    waitingQuestion: j.waiting_question,
    decision: j.decision,
    pendingApproval: pending.get(j.id) ?? null,
    pendingWork: pendingWork.get(j.id) ?? null,
    permissionLevel: j.permission_level,
    finishedResult: j.status === "done" && j.last_change_action === "finished" ? j.last_change_note : null,
    blockedBy: blockedBy.get(j.id) ?? 0,
  }))
}

/** Founder lets an executive make drafts for this job (Phase 4 "prepare" — nothing goes out). */
export async function allowJobDrafts(jobId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return { ok: false, error: "Please sign in again." }
  const { data: job } = await supabase.from("boss_jobs").select("permission_level").eq("id", jobId).eq("user_id", userId).maybeSingle()
  if (!job) return { ok: false, error: "That work could not be found." }
  if (job.permission_level !== "research") return { ok: true }
  return patchJob(jobId, { permission_level: "prepare" }, "changed", "That change could not be saved.")
}

/** Founder saves her own edits to the executive's draft as the work result. */
export async function saveEditedWork(jobId: string, proposalId: string, hash: string, edited: string): Promise<Result> {
  const clean = text(edited, 4000, true)
  if (!clean) return { ok: false, error: "The work cannot be empty." }
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId) || !UUID.test(proposalId) || !/^[0-9a-f]{64}$/.test(hash)) {
    return { ok: false, error: "Please sign in again." }
  }
  const { error } = await supabase.rpc("boss_decide_proposal", {
    p_proposal_id: proposalId,
    p_decision: "change_it",
    p_expected_hash: hash,
    p_note: "Founder edited the executive's work and approved her version.",
  })
  if (error) return finish(error, "Your edits could not be saved.")
  const result = await patchJob(jobId, { whats_ready: clean, waiting_question: null }, "ready_updated", "Your edits could not be saved.")
  if (result.ok) revalidatePath("/ceo-workday")
  return result
}

/**
 * Finish is only possible with a real result: approved work must exist and the
 * founder records where it now lives (a link, or what happened).
 */
export async function finishJobWithResult(jobId: string, resultText: string): Promise<Result> {
  const clean = text(resultText, 2000, true)
  if (!clean) return { ok: false, error: "Tell us where the finished work is — paste the link or say what happened." }
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return { ok: false, error: "Please sign in again." }
  const { data: job } = await supabase
    .from("boss_jobs")
    .select("assignee_type, whats_ready")
    .eq("id", jobId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!job) return { ok: false, error: "That work could not be found." }
  if (job.assignee_type !== "founder" && !job.whats_ready) {
    return { ok: false, error: "Approve the work first, then finish it." }
  }
  return patchJob(jobId, { status: "done", paused: false, last_change_note: clean }, "finished", "This could not be finished.")
}

export async function setWaitingQuestion(jobId: string, question: string): Promise<Result> {
  const clean = text(question, 2000)
  if (clean === undefined) return { ok: false, error: "That question is too long." }
  return patchJob(
    jobId,
    { waiting_question: clean, ...(clean ? { status: "waiting_for_you" } : {}) },
    "question_asked",
    "The question could not be saved.",
  )
}

export async function setWhatsReady(jobId: string, summary: string): Promise<Result> {
  const clean = text(summary, 4000)
  if (clean === undefined) return { ok: false, error: "That summary is too long." }
  return patchJob(jobId, { whats_ready: clean }, "ready_updated", "The summary could not be saved.")
}

export async function decideJob(jobId: string, decision: string, note?: string): Promise<Result> {
  if (!isOneOf(DECISIONS, decision)) return { ok: false, error: "Unknown decision." }
  const cleanNote = text(note, 2000)
  if (cleanNote === undefined) return { ok: false, error: "That note is too long." }
  const effects: Record<JobDecision, Record<string, unknown>> = {
    yes_do_it: { status: "working", paused: false },
    no_stop: { stopped: true, paused: false },
    change_it: { status: "working", paused: false },
    wait: { paused: true },
  }
  return patchJob(
    jobId,
    { decision, decision_note: cleanNote, waiting_question: null, ...effects[decision] },
    "decided",
    "Your decision could not be saved.",
  )
}

export async function addDependency(jobId: string, dependsOnJobId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId) || !UUID.test(dependsOnJobId) || jobId === dependsOnJobId) {
    return { ok: false, error: "Please choose a different job." }
  }
  const { error } = await supabase
    .from("boss_job_dependencies")
    .insert({ user_id: userId, job_id: jobId, depends_on_job_id: dependsOnJobId })
  return finish(error, "That link could not be saved.")
}

export async function removeDependency(jobId: string, dependsOnJobId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId) || !UUID.test(dependsOnJobId)) return { ok: false, error: "Please sign in again." }
  const { error } = await supabase
    .from("boss_job_dependencies")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .eq("depends_on_job_id", dependsOnJobId)
  return finish(error, "That link could not be removed.")
}

const WORKDAY_FUNCTION: Record<string, string> = Object.fromEntries(
  [...SEVEN_BUSINESS_FUNCTIONS, ...LEGACY_BUSINESS_FUNCTIONS].map((f) => [f.jobKey, f.planKey]),
)

export async function addJobToTodaysWorkday(jobId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return { ok: false, error: "Please sign in again." }

  const { data: plan } = await supabase
    .from("ceo_workday_plans")
    .select("id, status")
    .eq("user_id", userId)
    .eq("plan_date", todayInEastern())
    .maybeSingle()
  if (!plan) return { ok: false, error: "Design today's CEO Workday™ first, then add jobs to it." }
  if (plan.status === "closed") return { ok: false, error: "Today's CEO Workday™ is already closed." }

  const { data: job } = await supabase
    .from("boss_jobs")
    .select("id, title, details, business_function, assignee_type")
    .eq("id", jobId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!job) return { ok: false, error: "That job could not be found." }

  const { data: existing } = await supabase
    .from("ceo_workday_plan_items")
    .select("id")
    .eq("plan_id", plan.id)
    .eq("user_id", userId)
    .eq("local_work_item_id", jobId)
    .maybeSingle()
  if (existing) return { ok: true }

  const { count } = await supabase
    .from("ceo_workday_plan_items")
    .select("id", { count: "exact", head: true })
    .eq("plan_id", plan.id)

  const founderDoes = job.assignee_type === "founder"
  const { error } = await supabase.from("ceo_workday_plan_items").insert({
    plan_id: plan.id,
    user_id: userId,
    position: count ?? 0,
    title: job.title.slice(0, 200),
    purpose: job.details,
    treatment: founderDoes ? "implement-operate" : "delegate-transfer",
    business_function: WORKDAY_FUNCTION[job.business_function] ?? "operations",
    role: "founder-added",
    estimated_minutes: 0,
    founder_decision: founderDoes ? "added" : "delegate",
    status: founderDoes ? "planned" : "delegated",
    local_work_item_id: jobId,
  })
  if (error) return finish(error, "The job could not be added to today's workday.")
  revalidatePath("/ceo-workday")
  return finish(null, "")
}

export async function loadJobHistory(jobId: string): Promise<JobHistoryEntry[]> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(jobId)) return []
  const { data } = await supabase
    .from("boss_job_history")
    .select("id, action, actor, field, previous_value, new_value, note, result, error, created_at")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(100)
  return (data ?? []).map((row) => ({
    id: row.id,
    action: row.action,
    actor: row.actor,
    field: row.field,
    previousValue: row.previous_value,
    newValue: row.new_value,
    note: row.note,
    result: row.result,
    error: row.error,
    createdAt: row.created_at,
  }))
}

export type TeamMemberInput = {
  name: string
  role?: string
  memberType: string
  businessFunctions: string[]
  note?: string
}

function cleanTeamInput(input: TeamMemberInput) {
  const name = text(input.name, 120, true)
  const role = text(input.role, 120)
  const note = text(input.note, 1000)
  if (!name || role === undefined || note === undefined) return null
  if (input.memberType !== "employee" && input.memberType !== "contractor") return null
  const functions = (input.businessFunctions ?? []).filter((f) => isOneOf(ALL_JOB_FUNCTIONS, f))
  return { name, role, note, member_type: input.memberType, business_functions: Array.from(new Set(functions)) }
}

export async function addTeamMember(input: TeamMemberInput): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const clean = cleanTeamInput(input)
  if (!clean) return { ok: false, error: "Please check the team member's details." }
  const { error } = await supabase.from("boss_team_members").insert({ user_id: userId, ...clean })
  return finish(error, "The team member could not be saved.")
}

export async function updateTeamMember(memberId: string, input: TeamMemberInput): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(memberId)) return { ok: false, error: "Please sign in again." }
  const clean = cleanTeamInput(input)
  if (!clean) return { ok: false, error: "Please check the team member's details." }
  const { error } = await supabase.from("boss_team_members").update(clean).eq("id", memberId).eq("user_id", userId)
  return finish(error, "The change could not be saved.")
}

export async function setTeamMemberArchived(memberId: string, archived: boolean): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId || !UUID.test(memberId)) return { ok: false, error: "Please sign in again." }
  const { error } = await supabase
    .from("boss_team_members")
    .update({ archived })
    .eq("id", memberId)
    .eq("user_id", userId)
  return finish(error, "The change could not be saved.")
}
