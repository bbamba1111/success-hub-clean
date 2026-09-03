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
  "id, plan_id, position, title, purpose, expected_evidence, treatment, business_function, role, estimated_minutes, related_asset_id, related_assignment_ref, ceo_work_category, gps_original, founder_decision, status, next_action, local_work_item_id"

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

    // Replace items (design-time only — before execution begins).
    await supabase.from("ceo_workday_plan_items").delete().eq("plan_id", plan.id).eq("user_id", userId)

    const rows = input.items.map((i, idx) => ({
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
      status: i.founderDecision === "defer" ? "deferred" : i.founderDecision === "delegate" ? "delegated" : "planned",
      next_action: null,
      local_work_item_id: i.localWorkItemId ?? null,
    }))

    const { data: items } = rows.length
      ? await supabase.from("ceo_workday_plan_items").insert(rows).select(ITEM_COLS)
      : { data: [] as ItemRow[] }

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
  patch: Partial<Pick<CeoPlanItem, "title" | "estimatedMinutes" | "status" | "nextAction" | "founderDecision">>,
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
    await supabase.from("ceo_workday_plan_items").update(row).eq("id", itemId).eq("user_id", userId)
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
    if (!userId) return null
    const { count } = await supabase
      .from("ceo_workday_plan_items")
      .select("id", { count: "exact", head: true })
      .eq("plan_id", planId)
    const { data } = await supabase
      .from("ceo_workday_plan_items")
      .insert({
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
      .select("status")
      .eq("plan_id", planId)
      .eq("user_id", userId)
    const total = items?.length ?? 0
    const completed = items?.filter((i) => i.status === "completed").length ?? 0
    const completionStatus = total === 0 ? "skipped" : completed === total ? "completed" : completed > 0 ? "partial" : "skipped"

    await supabase.from("segment_completions").upsert(
      {
        user_id: userId,
        segment_id: "ceo-workday",
        completed_date: planDate,
        completion_status: completionStatus,
        completed_at: closedAt,
      },
      { onConflict: "user_id,segment_id,completed_date" },
    )
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
      deferredCount: count("deferred"),
      delegatedCount: count("delegated"),
      eliminatedCount: count("eliminated"),
      blockedCount: count("blocked"),
      founderChangedCount: list.filter((i) => !["keep", "added"].includes(i.founder_decision)).length,
      carryForward: list
        .filter((i) => i.next_action && ["continue-next-hour", "later", "move-segment", "need-help"].includes(i.next_action))
        .map((i) => ({ itemId: i.id, title: i.title, nextAction: i.next_action as CeoNextAction })),
      hoursCheckedIn: new Set((checkins ?? []).map((c) => c.hour_block)).size,
    }
  } catch {
    return null
  }
}
