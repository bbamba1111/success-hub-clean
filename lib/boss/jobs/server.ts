import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"
import { todayInEastern, type Job, type JobsData, type TeamMember } from "./definitions"

export const JOB_COLUMNS =
  "id, title, details, business_function, due_date, do_first_rank, assignee_type, assignee_executive_id, assignee_team_member_id, status, paused, stopped, permission_level, waiting_question, whats_ready, decision, decision_note, decided_at, created_by_actor, last_change_actor, updated_at"

type JobRow = {
  id: string
  title: string
  details: string | null
  business_function: Job["businessFunction"]
  due_date: string | null
  do_first_rank: number
  assignee_type: Job["assigneeType"]
  assignee_executive_id: Job["assigneeExecutiveId"]
  assignee_team_member_id: string | null
  status: Job["status"]
  paused: boolean
  stopped: boolean
  permission_level: Job["permissionLevel"]
  waiting_question: string | null
  whats_ready: string | null
  decision: Job["decision"]
  decision_note: string | null
  decided_at: string | null
  created_by_actor: Job["createdByActor"]
  last_change_actor: Job["lastChangeActor"]
  updated_at: string
}

type TeamRow = {
  id: string
  name: string
  role: string | null
  member_type: TeamMember["memberType"]
  business_functions: TeamMember["businessFunctions"]
  note: string | null
  archived: boolean
}

export function toTeamMember(row: TeamRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    memberType: row.member_type,
    businessFunctions: row.business_functions ?? [],
    note: row.note,
    archived: row.archived,
  }
}

export async function loadTeam(supabase: SupabaseClient, userId: string): Promise<TeamMember[]> {
  const { data } = await supabase
    .from("boss_team_members")
    .select("id, name, role, member_type, business_functions, note, archived")
    .eq("user_id", userId)
    .order("archived")
    .order("name")
  return ((data ?? []) as TeamRow[]).map(toTeamMember)
}

export async function loadJobsData(supabase: SupabaseClient, userId: string): Promise<JobsData> {
  const todayDate = todayInEastern()
  const [jobsRes, depsRes, team, planRes] = await Promise.all([
    supabase
      .from("boss_jobs")
      .select(JOB_COLUMNS)
      .eq("user_id", userId)
      .order("do_first_rank")
      .order("created_at"),
    supabase.from("boss_job_dependencies").select("job_id, depends_on_job_id").eq("user_id", userId),
    loadTeam(supabase, userId),
    supabase.from("ceo_workday_plans").select("id").eq("user_id", userId).eq("plan_date", todayDate).maybeSingle(),
  ])

  const todayPlanId = (planRes.data?.id as string | undefined) ?? null
  const linked = new Set<string>()
  if (todayPlanId) {
    const { data: items } = await supabase
      .from("ceo_workday_plan_items")
      .select("local_work_item_id")
      .eq("plan_id", todayPlanId)
      .eq("user_id", userId)
      .not("local_work_item_id", "is", null)
    for (const item of items ?? []) linked.add(item.local_work_item_id as string)
  }

  const deps = new Map<string, string[]>()
  for (const d of (depsRes.data ?? []) as { job_id: string; depends_on_job_id: string }[]) {
    deps.set(d.job_id, [...(deps.get(d.job_id) ?? []), d.depends_on_job_id])
  }

  const jobs: Job[] = ((jobsRes.data ?? []) as JobRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    details: row.details,
    businessFunction: row.business_function,
    dueDate: row.due_date,
    doFirstRank: row.do_first_rank,
    assigneeType: row.assignee_type,
    assigneeExecutiveId: row.assignee_executive_id,
    assigneeTeamMemberId: row.assignee_team_member_id,
    status: row.status,
    paused: row.paused,
    stopped: row.stopped,
    permissionLevel: row.permission_level,
    waitingQuestion: row.waiting_question,
    whatsReady: row.whats_ready,
    decision: row.decision,
    decisionNote: row.decision_note,
    decidedAt: row.decided_at,
    createdByActor: row.created_by_actor,
    lastChangeActor: row.last_change_actor,
    updatedAt: row.updated_at,
    dependsOn: deps.get(row.id) ?? [],
    onTodaysWorkday: linked.has(row.id),
  }))

  return { jobs, team, todayPlanId, todayDate }
}
