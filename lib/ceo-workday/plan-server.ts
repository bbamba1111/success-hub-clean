"use server"

/**
 * CEO Workday™ Plan — Server Actions (Supabase source of truth)
 * ---------------------------------------------------------------------------
 * Mirrors lib/business-bottleneck-audit/bba-server.ts. All reads/writes are
 * scoped to the signed-in founder via RLS (auth.uid() = user_id); we also
 * resolve the user server-side rather than trusting a client-supplied id.
 *
 * Flow:
 *   saveCeoWorkdayPlan   ← "Build My CEO Workday™" (Decide & Design)
 *   getCeoWorkdayPlan    ← live FounderGpsWorkspace at 1 PM
 *   markPlanEntered / updatePlanItemStatus / saveHourCheckin ← execution
 *   closeCeoWorkdayPlan  ← 4:55 check-in; also writes ONE segment_completions
 *                          row so existing Harmony operating-history sees it
 *   getCeoWorkdayEvidence ← GPS / Cherry Blossom (additive intelligence feed)
 */

import { createClient } from "@/lib/supabase/server"
import type {
  CeoCheckinRecord,
  CeoNextAction,
  CeoPlanItem,
  CeoPlanItemStatus,
  CeoPlanStatus,
  CeoWorkdayEvidenceSummary,
  CeoWorkdayPlan,
} from "./plan-types"
import { isRetiredWorkTitle } from "./function-work-options"

// ── helpers ─────────────────────────────────────────────────────────────────

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return { supabase, userId: null as string | null }
  return { supabase, userId: data.user.id as string | null }
}

type PlanRow = {
  id: string
  plan_date: string
  week_key: string
  business_area_id: string | null
  bottleneck_ega_entry_ids: string[] | null
  primary_assignment_ref: string | null
  primary_asset_id: string | null
  constraint_summary: string | null
  intervention_summary: string | null
  identity_statement: string | null
  declaration: string | null
  planned_minutes: number
  status: CeoPlanStatus
  entered_at: string | null
  closed_at: string | null
}

type ItemRow = {
  id: string
  plan_id: string
  position: number
  title: string
  purpose: string | null
  expected_evidence: string | null
  treatment: CeoPlanItem["treatment"]
  business_function: CeoPlanItem["businessFunction"]
  role: CeoPlanItem["role"]
  estimated_minutes: number
  related_asset_id: string | null
  related_assignment_ref: string | null
  ceo_work_category: string | null
  gps_original: CeoPlanItem["gpsOriginal"]
  founder_decision: CeoPlanItem["founderDecision"]
  status: CeoPlanItemStatus
  next_action: CeoNextAction | null
  local_work_item_id: string | null
  job_id: string | null
  delegate_to: string | null
  handoff_note: string | null
  assignment_key: string | null
  strategic_objective: string | null
  readiness: CeoPlanItem["readiness"]
  asset_requirement: CeoPlanItem["assetRequirement"]
  asset_reason: string | null
  experience_occurrence_id: string | null
  completion_basis: CeoPlanItem["completionBasis"]
}

function rowToItem(r: ItemRow): CeoPlanItem {
  return {
    id: r.id,
    planId: r.plan_id,
    position: r.position,
    title: r.title,
    purpose: r.purpose ?? "",
    expectedEvidence: r.expected_evidence ?? "",
    treatment: r.treatment,
    businessFunction: r.business_function,
    role: r.role,
    estimatedMinutes: r.estimated_minutes,
    relatedAssetId: r.related_asset_id,
    relatedAssignmentRef: r.related_assignment_ref,
    ceoWorkCategory: (r.ceo_work_category as CeoPlanItem["ceoWorkCategory"]) ?? null,
    gpsOriginal: r.gps_original ?? null,
    founderDecision: r.founder_decision,
    status: r.status,
    nextAction: r.next_action,
    localWorkItemId: r.local_work_item_id,
    jobId: r.job_id,
    delegateTo: r.delegate_to,
    handoffNote: r.handoff_note,
    assignmentKey: r.assignment_key,
    strategicObjective: r.strategic_objective,
    readiness: r.readiness,
    assetRequirement: r.asset_requirement,
    assetReason: r.asset_reason,
    experienceOccurrenceId: r.experience_occurrence_id,
    completionBasis: r.completion_basis,
  }
}

function rowToPlan(p: PlanRow, items: ItemRow[]): CeoWorkdayPlan {
  return {
    id: p.id,
    planDate: p.plan_date,
    weekKey: p.week_key,
    businessAreaId: p.business_area_id,
    bottleneckEgaEntryIds: p.bottleneck_ega_entry_ids ?? [],
    primaryAssignmentRef: p.primary_assignment_ref,
    primaryAssetId: p.primary_asset_id,
    constraintSummary: p.constraint_summary,
    interventionSummary: p.intervention_summary,
    identityStatement: p.identity_statement,
    declaration: p.declaration,
    plannedMinutes: p.planned_minutes,
    status: p.status,
    enteredAt: p.entered_at,
    closedAt: p.closed_at,
    items: items.sort((a, b) => a.position - b.position).map(rowToItem),
  }
}

const PLAN_COLS =
  "id, plan_date, week_key, business_area_id, bottleneck_ega_entry_ids, primary_assignment_ref, primary_asset_id, constraint_summary, intervention_summary, identity_statement, declaration, planned_minutes, status, entered_at, closed_at"
const ITEM_COLS =
  "id, plan_id, position, title, purpose, expected_evidence, treatment, business_function, role, estimated_minutes, related_asset_id, related_assignment_ref, ceo_work_category, gps_original, founder_decision, status, next_action, local_work_item_id, job_id, delegate_to, handoff_note, assignment_key, strategic_objective, readiness, asset_requirement, asset_reason, experience_occurrence_id, completion_basis"

/** Founder sessions may only record these; `system-verified` is written by the service role. */
function clientCompletionBasis(b: CeoPlanItem["completionBasis"]) {
  return b === "internal" || b === "founder-reported" ? b : null
}

// ── Phase 3 job link ────────────────────────────────────────────────────────

type Db = Awaited<ReturnType<typeof createClient>>

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function jobFunction(fn: CeoPlanItem["businessFunction"]): string {
  switch (fn) {
    case "client-attraction":
    case "market":
    case "connect":
    case "communicate":
      return "attraction"
    case "sales-conversion":
    case "sell":
      return "sales"
    case "delivery":
    case "deliver":
      return "delivery"
    case "operations-design":
    case "build":
    case "systemize":
    case "augment-automate-ai":
      return "design"
    case "trust-experiences":
      return "experiences"
    default:
      return "operations"
  }
}

/** Item status → job status. `null` means "leave the job as it is". */
function jobStatusFor(status: CeoPlanItemStatus): string | null {
  switch (status) {
    case "planned":
      return "not_started"
    case "in-progress":
      return "working"
    case "completed":
      return "done"
    case "blocked":
      return "needs_help"
    default:
      return null
  }
}

function needsJob(decision: CeoPlanItem["founderDecision"]) {
  return decision !== "remove"
}

/**
 * Gives every kept item a persistent BO$$ job. Reuses the job the item already
 * had (only if it belongs to this founder), otherwise creates one. Returns
 * job ids aligned with `items`.
 */
async function ensureJobs(
  supabase: Db,
  userId: string,
  items: Array<Pick<CeoPlanItem, "title" | "purpose" | "businessFunction" | "founderDecision"> & { jobId?: string | null }>,
): Promise<Array<string | null>> {
  const wanted = Array.from(
    new Set(items.map((i) => i.jobId).filter((id): id is string => !!id && UUID_RE.test(id))),
  )
  const owned = new Set<string>()
  if (wanted.length) {
    const { data } = await supabase.from("boss_jobs").select("id").eq("user_id", userId).in("id", wanted)
    for (const r of data ?? []) owned.add(r.id as string)
  }

  const used = new Set<string>()
  const result: Array<string | null> = []
  for (const item of items) {
    if (!needsJob(item.founderDecision)) {
      result.push(null)
      continue
    }
    if (item.jobId && owned.has(item.jobId) && !used.has(item.jobId)) {
      used.add(item.jobId)
      result.push(item.jobId)
      continue
    }
    const { data: job } = await supabase
      .from("boss_jobs")
      .insert({
        user_id: userId,
        title: item.title.trim().slice(0, 200) || "CEO Workday™ work",
        details: item.purpose?.trim().slice(0, 4000) || null,
        business_function: jobFunction(item.businessFunction),
        assignee_type: "founder",
        created_by_actor: "founder",
        last_change_actor: "founder",
        last_change_action: "created",
        last_change_note: "Planned in the CEO Workday™",
      })
      .select("id")
      .single()
    const id = (job?.id as string | undefined) ?? null
    if (id) used.add(id)
    result.push(id)
  }
  return result
}

/** Keeps each linked job's status in step with its Workday item. */
async function syncJobs(supabase: Db, userId: string, updates: Array<{ itemId: string; status: CeoPlanItemStatus }>) {
  const relevant = updates.filter((u) => jobStatusFor(u.status))
  if (!relevant.length) return
  const { data: rows } = await supabase
    .from("ceo_workday_plan_items")
    .select("id, job_id")
    .eq("user_id", userId)
    .in(
      "id",
      relevant.map((u) => u.itemId),
    )
  const jobByItem = new Map((rows ?? []).map((r) => [r.id as string, r.job_id as string | null]))
  // One update per job: the database refuses to finish a job that is still
  // waiting on another, and that refusal must not block the other jobs.
  for (const u of relevant) {
    const jobId = jobByItem.get(u.itemId)
    const status = jobStatusFor(u.status)
    if (!jobId || !status) continue
    await supabase
      .from("boss_jobs")
      .update({
        status,
        ...(status === "done" ? { paused: false } : {}),
        last_change_actor: "founder",
        last_change_action: status === "done" ? "finished" : "status_changed",
        last_change_note: "Updated from the CEO Workday™",
      })
      .eq("user_id", userId)
      .eq("id", jobId)
      .neq("status", status)
  }
}

// ── reads ───────────────────────────────────────────────────────────────────

/** Loads the founder's plan for a date (default today, platform-local). */
export async function getCeoWorkdayPlan(planDate: string): Promise<CeoWorkdayPlan | null> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return null
    const { data: plan } = await supabase
      .from("ceo_workday_plans")
      .select(PLAN_COLS)
      .eq("user_id", userId)
      .eq("plan_date", planDate)
      .maybeSingle()
    if (!plan) return null
    const { data: items } = await supabase
      .from("ceo_workday_plan_items")
      .select(ITEM_COLS)
      .eq("plan_id", plan.id)
      .order("position")
    return rowToPlan(plan as PlanRow, (items ?? []) as ItemRow[])
  } catch {
    return null
  }
}

export async function getCeoWorkdayCheckins(planId: string): Promise<CeoCheckinRecord[]> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return []
    const { data } = await supabase
      .from("ceo_workday_checkins")
      .select(
        "id, plan_id, item_id, hour_block, scheduled_at, opened_at, saved_at, working_on_declaration, actual_status, actual_minutes, blocker, reflection, next_action",
      )
      .eq("plan_id", planId)
      .eq("user_id", userId)
      .order("hour_block")
    return (data ?? []).map((r) => ({
      id: r.id,
      planId: r.plan_id,
      itemId: r.item_id,
      hourBlock: r.hour_block as 1 | 2 | 3 | 4,
      scheduledAt: r.scheduled_at,
      openedAt: r.opened_at,
      savedAt: r.saved_at,
      workingOnDeclaration: r.working_on_declaration,
      actualStatus: r.actual_status,
      actualMinutes: r.actual_minutes,
      blocker: r.blocker,
      reflection: r.reflection,
      nextAction: r.next_action,
    }))
  } catch {
    return []
  }
}

// ── writes ──────────────────────────────────────────────────────────────────

export interface SaveCeoWorkdayPlanInput {
  planDate: string
  weekKey: string
  businessAreaId?: string | null
  bottleneckEgaEntryIds: string[]
  primaryAssignmentRef?: string | null
  primaryAssetId?: string | null
  constraintSummary?: string | null
  interventionSummary?: string | null
  identityStatement?: string | null
  declaration?: string | null
  items: Array<Omit<CeoPlanItem, "id" | "planId"> & { id?: string }>
}

/**
 * Upserts the designed plan for the day and replaces its items. Returns the
 * persisted plan (with server ids) so the caller can mirror items into the
 * local Today's Work™ queue and write `localWorkItemId` back.
 */
export async function saveCeoWorkdayPlan(input: SaveCeoWorkdayPlanInput): Promise<CeoWorkdayPlan | null> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return null

    const plannedMinutes = input.items
      .filter((i) => i.founderDecision !== "remove")
      .reduce((s, i) => s + Math.max(0, Math.round(i.estimatedMinutes || 0)), 0)

    const { data: plan, error } = await supabase
      .from("ceo_workday_plans")
      .upsert(
        {
          user_id: userId,
          plan_date: input.planDate,
          week_key: input.weekKey,
          business_area_id: input.businessAreaId ?? null,
          bottleneck_ega_entry_ids: input.bottleneckEgaEntryIds,
          primary_assignment_ref: input.primaryAssignmentRef ?? null,
          primary_asset_id: input.primaryAssetId ?? null,
          constraint_summary: input.constraintSummary ?? null,
          intervention_summary: input.interventionSummary ?? null,
          identity_statement: input.identityStatement ?? null,
          declaration: input.declaration ?? null,
          planned_minutes: plannedMinutes,
          status: "designed",
        },
        { onConflict: "user_id,plan_date" },
      )
      .select(PLAN_COLS)
      .single()
    if (error || !plan) return null

    // Re-saving the design must keep each item on the job it already has, so
    // remember the current links (by title when the caller has no job id).
    const { data: previous } = await supabase
      .from("ceo_workday_plan_items")
      .select("title, job_id")
      .eq("plan_id", plan.id)
      .eq("user_id", userId)
    const jobByTitle = new Map<string, string>()
    const previousTitles = new Set<string>()
    for (const p of previous ?? []) {
      const key = String(p.title).trim().toLowerCase()
      previousTitles.add(key)
      if (p.job_id && !jobByTitle.has(key)) jobByTitle.set(key, p.job_id as string)
    }
    // Retired options stay on rows that already had them, but can't be added anew.
    if (input.items.some((i) => isRetiredWorkTitle(i.title) && !previousTitles.has(i.title.trim().toLowerCase()))) {
      return null
    }
    const jobIds = await ensureJobs(
      supabase,
      userId,
      input.items.map((i) => ({ ...i, jobId: i.jobId ?? jobByTitle.get(i.title.trim().toLowerCase()) ?? null })),
    )

    // Replace items (design-time only — before execution begins).
    await supabase.from("ceo_workday_plan_items").delete().eq("plan_id", plan.id).eq("user_id", userId)

    const rows = input.items.map((i, idx) => ({
      job_id: jobIds[idx],
      plan_id: plan.id,
      user_id: userId,
      position: idx,
      title: i.title.trim().slice(0, 200),
      purpose: i.purpose?.trim().slice(0, 1200) ?? null,
      expected_evidence: i.expectedEvidence?.trim().slice(0, 1200) ?? null,
      treatment: i.treatment,
      business_function: i.businessFunction,
      role: i.role,
      estimated_minutes: Math.max(0, Math.min(240, Math.round(i.estimatedMinutes || 0))),
      related_asset_id: i.relatedAssetId ?? null,
      related_assignment_ref: i.relatedAssignmentRef ?? null,
      ceo_work_category: i.ceoWorkCategory ?? null,
      gps_original: i.gpsOriginal ?? null,
      founder_decision: i.founderDecision,
      status:
        i.founderDecision === "save-for-later" ? "saved-for-later" : i.founderDecision === "delegate" ? "delegated" : "planned",
      next_action: null,
      local_work_item_id: i.localWorkItemId ?? null,
      delegate_to: i.founderDecision === "delegate" ? (i.delegateTo?.trim().slice(0, 200) || null) : null,
      handoff_note:
        i.founderDecision === "save-for-later" || i.founderDecision === "delegate"
          ? (i.handoffNote?.trim().slice(0, 1200) || null)
          : null,
      assignment_key: i.assignmentKey?.slice(0, 200) ?? null,
      strategic_objective: i.strategicObjective?.trim().slice(0, 600) ?? null,
      readiness: i.readiness ?? null,
      asset_requirement: i.assetRequirement ?? null,
      asset_reason: i.assetReason?.trim().slice(0, 600) ?? null,
      experience_occurrence_id: i.experienceOccurrenceId ?? null,
      completion_basis: clientCompletionBasis(i.completionBasis),
    }))

    const { data: items } = rows.length
      ? await supabase.from("ceo_workday_plan_items").insert(rows).select(ITEM_COLS)
      : { data: [] as ItemRow[] }

    // Prerequisite assignments become real BO$$ job dependencies, so the
    // database refuses to finish dependent work before its preparation.
    const jobByKey = new Map<string, string>()
    input.items.forEach((i, idx) => {
      if (i.assignmentKey && jobIds[idx]) jobByKey.set(i.assignmentKey, jobIds[idx] as string)
    })
    const deps: Array<{ user_id: string; job_id: string; depends_on_job_id: string }> = []
    input.items.forEach((i, idx) => {
      const jobId = jobIds[idx]
      if (!jobId || i.founderDecision === "remove") return
      for (const k of i.prerequisiteKeys ?? []) {
        const dep = jobByKey.get(k)
        if (dep && dep !== jobId) deps.push({ user_id: userId, job_id: jobId, depends_on_job_id: dep })
      }
    })
    // One insert per edge: a duplicate (re-save) must not discard the others.
    for (const d of deps) await supabase.from("boss_job_dependencies").insert(d)

    return rowToPlan(plan as PlanRow, (items ?? []) as ItemRow[])
  } catch {
    return null
  }
}

/** Writes back the local queue ids after mirroring into Today's Work™. */
export async function linkPlanItemsToLocalQueue(pairs: Array<{ itemId: string; localWorkItemId: string }>) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    await Promise.all(
      pairs.map((p) =>
        supabase
          .from("ceo_workday_plan_items")
          .update({ local_work_item_id: p.localWorkItemId })
          .eq("id", p.itemId)
          .eq("user_id", userId),
      ),
    )
  } catch {
    // best-effort
  }
}

export async function updateCeoPlanStatus(planId: string, status: CeoPlanStatus) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    const patch: Record<string, unknown> = { status }
    if (status === "entered") patch.entered_at = new Date().toISOString()
    if (status === "closed") patch.closed_at = new Date().toISOString()
    await supabase.from("ceo_workday_plans").update(patch).eq("id", planId).eq("user_id", userId)
  } catch {
    // best-effort
  }
}

export async function updateCeoPlanDeclaration(planId: string, declaration: string, identityStatement?: string | null) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    await supabase
      .from("ceo_workday_plans")
      .update({ declaration: declaration.trim().slice(0, 1000), identity_statement: identityStatement ?? null })
      .eq("id", planId)
      .eq("user_id", userId)
  } catch {
    // best-effort
  }
}

/** Execution-time adjustment or check-in outcome: SAME item, new state. */
export async function updateCeoPlanItem(
  itemId: string,
  patch: Partial<Pick<CeoPlanItem, "title" | "estimatedMinutes" | "status" | "nextAction" | "founderDecision" | "relatedAssetId">>,
) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    const row: Record<string, unknown> = {}
    if (patch.title !== undefined) row.title = patch.title.trim().slice(0, 200)
    if (patch.estimatedMinutes !== undefined) row.estimated_minutes = Math.max(0, Math.round(patch.estimatedMinutes))
    if (patch.status !== undefined) row.status = patch.status
    if (patch.nextAction !== undefined) row.next_action = patch.nextAction
    if (patch.founderDecision !== undefined) row.founder_decision = patch.founderDecision
    // Linking (or re-linking) the item to a Business Asset Library™ template.
    if (patch.relatedAssetId !== undefined) row.related_asset_id = patch.relatedAssetId
    await supabase.from("ceo_workday_plan_items").update(row).eq("id", itemId).eq("user_id", userId)
    if (patch.status !== undefined) await syncJobs(supabase, userId, [{ itemId, status: patch.status }])
  } catch {
    // best-effort
  }
}

/** Founder adds manual work during design or execution (secondary path). */
export async function addCeoPlanItem(
  planId: string,
  item: Omit<CeoPlanItem, "id" | "planId" | "position">,
): Promise<CeoPlanItem | null> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId || isRetiredWorkTitle(item.title)) return null
    const { count } = await supabase
      .from("ceo_workday_plan_items")
      .select("id", { count: "exact", head: true })
      .eq("plan_id", planId)
    const [jobId] = await ensureJobs(supabase, userId, [{ ...item, founderDecision: "added" }])
    const { data } = await supabase
      .from("ceo_workday_plan_items")
      .insert({
        job_id: jobId,
        plan_id: planId,
        user_id: userId,
        position: count ?? 0,
        title: item.title.trim().slice(0, 200),
        purpose: item.purpose ?? null,
        expected_evidence: item.expectedEvidence ?? null,
        treatment: item.treatment,
        business_function: item.businessFunction,
        role: "founder-added",
        estimated_minutes: Math.max(0, Math.round(item.estimatedMinutes || 0)),
        related_asset_id: item.relatedAssetId ?? null,
        ceo_work_category: item.ceoWorkCategory ?? null,
        founder_decision: "added",
        status: "planned",
        local_work_item_id: item.localWorkItemId ?? null,
      })
      .select(ITEM_COLS)
      .single()
    return data ? rowToItem(data as ItemRow) : null
  } catch {
    return null
  }
}

/** "Tell us what you're working on" for an hour block. */
export async function saveWorkingOnDeclaration(
  planId: string,
  hourBlock: 1 | 2 | 3 | 4,
  scheduledAt: string,
  text: string,
) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    await supabase.from("ceo_workday_checkins").insert({
      plan_id: planId,
      item_id: null,
      user_id: userId,
      hour_block: hourBlock,
      scheduled_at: scheduledAt,
      saved_at: new Date().toISOString(),
      working_on_declaration: text.trim().slice(0, 600),
    })
    await supabase.from("ceo_workday_plans").update({ status: "in-progress" }).eq("id", planId).eq("user_id", userId)
  } catch {
    // best-effort
  }
}

export interface HourCheckinItemOutcome {
  itemId: string
  actualStatus: CeoPlanItemStatus
  nextAction?: CeoNextAction | null
  actualMinutes?: number | null
  blocker?: string | null
}

/**
 * Persists the hourly 5-Minute Check-In™: one row per item outcome, and
 * updates each item's state in place (same identity through the lifecycle).
 */
export async function saveHourCheckin(input: {
  planId: string
  hourBlock: 1 | 2 | 3 | 4
  scheduledAt: string
  openedAt: string
  reflection?: string | null
  outcomes: HourCheckinItemOutcome[]
}) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    const savedAt = new Date().toISOString()
    if (input.outcomes.length) {
      await supabase.from("ceo_workday_checkins").insert(
        input.outcomes.map((o) => ({
          plan_id: input.planId,
          item_id: o.itemId,
          user_id: userId,
          hour_block: input.hourBlock,
          scheduled_at: input.scheduledAt,
          opened_at: input.openedAt,
          saved_at: savedAt,
          actual_status: o.actualStatus,
          actual_minutes: o.actualMinutes ?? null,
          blocker: o.blocker?.trim().slice(0, 600) ?? null,
          reflection: input.reflection?.trim().slice(0, 1200) ?? null,
          next_action: o.actualStatus === "completed" ? null : (o.nextAction ?? null),
        })),
      )
      await Promise.all(
        input.outcomes.map((o) =>
          supabase
            .from("ceo_workday_plan_items")
            .update({
              status: o.actualStatus,
              next_action: o.actualStatus === "completed" ? null : (o.nextAction ?? null),
            })
            .eq("id", o.itemId)
            .eq("user_id", userId),
        ),
      )
      await syncJobs(
        supabase,
        userId,
        input.outcomes.map((o) => ({ itemId: o.itemId, status: o.actualStatus })),
      )
    }
  } catch {
    // best-effort
  }
}

/**
 * 4:55 PM close. Also writes ONE `segment_completions` row (segment_id
 * "ceo-workday") so the existing Harmony operating-history reader picks the
 * day up without a new pathway.
 */
export async function closeCeoWorkdayPlan(planId: string, planDate: string) {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    const closedAt = new Date().toISOString()
    await supabase
      .from("ceo_workday_plans")
      .update({ status: "closed", closed_at: closedAt })
      .eq("id", planId)
      .eq("user_id", userId)

    const { data: items } = await supabase
      .from("ceo_workday_plan_items")
      .select("id, status")
      .eq("plan_id", planId)
      .eq("user_id", userId)

    await syncJobs(
      supabase,
      userId,
      (items ?? [])
        .filter((i) => i.status === "completed")
        .map((i) => ({ itemId: i.id as string, status: "completed" as const })),
    )

    const total = items?.length ?? 0
    const completed = items?.filter((i) => i.status === "completed").length ?? 0
    const completionStatus =
      total > 0 && completed === total ? "honored" : completed > 0 ? "modified" : "not-completed"

    // segment_completions has no unique key on (user, segment, date), so
    // update the day's row if it exists instead of relying on upsert.
    const { data: existing } = await supabase
      .from("segment_completions")
      .select("id")
      .eq("user_id", userId)
      .eq("segment_id", "ceo-workday")
      .eq("segment_date", planDate)
      .limit(1)
      .maybeSingle()
    if (existing) {
      await supabase
        .from("segment_completions")
        .update({ completion_status: completionStatus })
        .eq("id", existing.id)
        .eq("user_id", userId)
    } else {
      await supabase.from("segment_completions").insert({
        user_id: userId,
        segment_id: "ceo-workday",
        segment_date: planDate,
        completion_status: completionStatus,
      })
    }
  } catch {
    // best-effort
  }
}

// ── intelligence feed ───────────────────────────────────────────────────────

/** Latest CEO Workday evidence for GPS / Harmony / Cherry Blossom. */
export async function getCeoWorkdayEvidence(userIdParam?: string): Promise<CeoWorkdayEvidenceSummary | null> {
  try {
    const { supabase, userId: authed } = await requireUser()
    const userId = authed ?? userIdParam ?? null
    if (!userId) return null
    const { data: plan } = await supabase
      .from("ceo_workday_plans")
      .select("id, plan_date, status, business_area_id, planned_minutes")
      .eq("user_id", userId)
      .order("plan_date", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!plan) return null
    const [{ data: items }, { data: checkins }] = await Promise.all([
      supabase
        .from("ceo_workday_plan_items")
        .select("id, title, status, next_action, founder_decision")
        .eq("plan_id", plan.id),
      supabase.from("ceo_workday_checkins").select("hour_block").eq("plan_id", plan.id).not("item_id", "is", null),
    ])
    const list = items ?? []
    const count = (s: CeoPlanItemStatus) => list.filter((i) => i.status === s).length
    return {
      planDate: plan.plan_date,
      planStatus: plan.status,
      businessAreaId: plan.business_area_id,
      plannedMinutes: plan.planned_minutes,
      itemCount: list.length,
      completedCount: count("completed"),
      inProgressCount: count("in-progress"),
      savedForLaterCount: count("saved-for-later"),
      delegatedCount: count("delegated"),
      eliminatedCount: count("eliminated"),
      blockedCount: count("blocked"),
      founderChangedCount: list.filter((i) => !["keep", "added"].includes(i.founder_decision)).length,
      carryForward: list
        .filter((i) => i.next_action && ["continue-next-hour", "save-for-later", "move-segment", "need-help"].includes(i.next_action))
        .map((i) => ({ itemId: i.id, title: i.title, nextAction: i.next_action as CeoNextAction })),
      hoursCheckedIn: new Set((checkins ?? []).map((c) => c.hour_block)).size,
    }
  } catch {
    return null
  }
}
