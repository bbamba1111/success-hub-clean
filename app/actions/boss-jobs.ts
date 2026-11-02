"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  DECISIONS,
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

function cleanJobInput(input: JobInput) {
  const title = text(input.title, 200, true)
  const details = text(input.details, 4000)
  if (!title || details === undefined) return null
  if (!isOneOf(JOB_FUNCTIONS, input.businessFunction)) return null
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
  const clean = cleanJobInput(input)
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
  const clean = cleanJobInput(input)
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

const WORKDAY_FUNCTION: Record<string, string> = {
  attraction: "client-attraction",
  sales: "sales-conversion",
  delivery: "delivery",
  operations: "operations",
  design: "operations-design",
}

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
    .select("id, action, actor, field, previous_value, new_value, note, created_at")
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
  const functions = (input.businessFunctions ?? []).filter((f) => isOneOf(JOB_FUNCTIONS, f))
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
