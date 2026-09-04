"use server"

/**
 * Weekly Work-Life Balance Commitments™ — Server Actions (Supabase source of truth)
 * ---------------------------------------------------------------------------
 * Mirrors lib/ceo-workday/plan-server.ts conventions: user resolved server-side,
 * RLS scopes every read/write, and the record is UPSERTED on (user_id, week_key)
 * so a week never gets duplicate commitments.
 *
 *   getWeeklyCommitments     ← Decide & Design + Monday–Thursday visibility
 *   saveWeeklyCommitments    ← autosave of choices/intentions + "Save My Week"
 *   updateCommitmentStatus   ← lightweight status changes through the week
 *   getPreviousWeekCarryover ← "Still in progress" items for the next cycle
 */

import { createClient } from "@/lib/supabase/server"
import {
  emptyWeeklyCommitments,
  isStillInProgress,
  type BoundaryAudience,
  type DelegationStatus,
  type LifePriorityStatus,
  type LifeWindow,
  type OperatingRuleStatus,
  type WeeklyCommitments,
} from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

type Row = {
  id: string
  week_key: string
  life_priority: string | null
  life_priority_option_id: string | null
  life_windows: string[] | null
  life_intention: string | null
  life_intention_variant: number
  life_intention_edited: boolean
  life_status: LifePriorityStatus
  boundary_audiences: string[] | null
  boundary_draft: string | null
  boundary_draft_edited: boolean
  delegation_priority: string | null
  delegation_option_id: string | null
  delegation_intention: string | null
  delegation_intention_variant: number
  delegation_intention_edited: boolean
  delegation_status: DelegationStatus
  operating_rule: string | null
  operating_rule_option_id: string | null
  operating_rule_intention: string | null
  operating_rule_intention_variant: number
  operating_rule_intention_edited: boolean
  operating_rule_status: OperatingRuleStatus
  designed_at: string | null
  created_at: string
  updated_at: string
}

function fromRow(r: Row): WeeklyCommitments {
  return {
    id: r.id,
    weekKey: r.week_key,
    lifePriority: r.life_priority,
    lifePriorityOptionId: r.life_priority_option_id,
    lifeWindows: (r.life_windows ?? []) as LifeWindow[],
    lifeIntention: r.life_intention,
    lifeIntentionVariant: r.life_intention_variant ?? 0,
    lifeIntentionEdited: r.life_intention_edited,
    lifeStatus: r.life_status,
    boundaryAudiences: (r.boundary_audiences ?? []) as BoundaryAudience[],
    boundaryDraft: r.boundary_draft,
    boundaryDraftEdited: r.boundary_draft_edited,
    delegationPriority: r.delegation_priority,
    delegationOptionId: r.delegation_option_id,
    delegationIntention: r.delegation_intention,
    delegationIntentionVariant: r.delegation_intention_variant ?? 0,
    delegationIntentionEdited: r.delegation_intention_edited,
    delegationStatus: r.delegation_status,
    operatingRule: r.operating_rule,
    operatingRuleOptionId: r.operating_rule_option_id,
    operatingRuleIntention: r.operating_rule_intention,
    operatingRuleIntentionVariant: r.operating_rule_intention_variant ?? 0,
    operatingRuleIntentionEdited: r.operating_rule_intention_edited,
    operatingRuleStatus: r.operating_rule_status,
    designedAt: r.designed_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.trim().slice(0, n) || null)

function toRow(c: WeeklyCommitments, userId: string) {
  return {
    user_id: userId,
    week_key: c.weekKey,
    life_priority: clip(c.lifePriority, 200),
    life_priority_option_id: clip(c.lifePriorityOptionId, 80),
    life_windows: c.lifeWindows,
    life_intention: clip(c.lifeIntention, 600),
    life_intention_variant: c.lifeIntentionVariant,
    life_intention_edited: c.lifeIntentionEdited,
    life_status: c.lifeStatus,
    boundary_audiences: c.boundaryAudiences,
    boundary_draft: clip(c.boundaryDraft, 800),
    boundary_draft_edited: c.boundaryDraftEdited,
    delegation_priority: clip(c.delegationPriority, 200),
    delegation_option_id: clip(c.delegationOptionId, 80),
    delegation_intention: clip(c.delegationIntention, 600),
    delegation_intention_variant: c.delegationIntentionVariant,
    delegation_intention_edited: c.delegationIntentionEdited,
    delegation_status: c.delegationStatus,
    operating_rule: clip(c.operatingRule, 200),
    operating_rule_option_id: clip(c.operatingRuleOptionId, 80),
    operating_rule_intention: clip(c.operatingRuleIntention, 600),
    operating_rule_intention_variant: c.operatingRuleIntentionVariant,
    operating_rule_intention_edited: c.operatingRuleIntentionEdited,
    operating_rule_status: c.operatingRuleStatus,
    designed_at: c.designedAt,
  }
}

/** The founder's commitments for a week (empty shell when none exist yet). */
export async function getWeeklyCommitments(weekKey: string): Promise<WeeklyCommitments> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return emptyWeeklyCommitments(weekKey)
    const { data } = await supabase
      .from("weekly_commitments")
      .select("*")
      .eq("user_id", userId)
      .eq("week_key", weekKey)
      .maybeSingle()
    return data ? fromRow(data as Row) : emptyWeeklyCommitments(weekKey)
  } catch {
    return emptyWeeklyCommitments(weekKey)
  }
}

/**
 * Upsert the whole record for (user, week). Used both for quiet autosave as
 * the founder chooses, and for "Save My Week" (pass markDesigned = true).
 */
export async function saveWeeklyCommitments(
  commitments: WeeklyCommitments,
  opts: { markDesigned?: boolean } = {},
): Promise<{ ok: boolean; commitments?: WeeklyCommitments; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in to save your week." }
    const next: WeeklyCommitments = {
      ...commitments,
      designedAt: opts.markDesigned ? new Date().toISOString() : commitments.designedAt,
    }
    const { data, error } = await supabase
      .from("weekly_commitments")
      .upsert(toRow(next, userId), { onConflict: "user_id,week_key" })
      .select("*")
      .single()
    if (error) return { ok: false, error: error.message }
    return { ok: true, commitments: fromRow(data as Row) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save your week." }
  }
}

/** Lightweight status change for one of the three priorities. */
export async function updateCommitmentStatus(
  weekKey: string,
  patch: Partial<{
    lifeStatus: LifePriorityStatus
    delegationStatus: DelegationStatus
    operatingRuleStatus: OperatingRuleStatus
  }>,
): Promise<void> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return
    const row: Record<string, unknown> = {}
    if (patch.lifeStatus) row.life_status = patch.lifeStatus
    if (patch.delegationStatus) row.delegation_status = patch.delegationStatus
    if (patch.operatingRuleStatus) row.operating_rule_status = patch.operatingRuleStatus
    if (Object.keys(row).length === 0) return
    await supabase.from("weekly_commitments").update(row).eq("user_id", userId).eq("week_key", weekKey)
  } catch {
    /* non-fatal */
  }
}

/**
 * Anything still open from the most recent PRIOR week. Never auto-recreated —
 * Decide & Design shows "Still in progress" and the founder chooses.
 */
export async function getPreviousWeekCarryover(currentWeekKey: string): Promise<{
  weekKey: string
  commitments: WeeklyCommitments
  open: ReturnType<typeof isStillInProgress>
} | null> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return null
    const { data } = await supabase
      .from("weekly_commitments")
      .select("*")
      .eq("user_id", userId)
      .lt("week_key", currentWeekKey)
      .order("week_key", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!data) return null
    const commitments = fromRow(data as Row)
    const open = isStillInProgress(commitments)
    if (!open.life && !open.delegation && !open.operatingRule) return null
    return { weekKey: commitments.weekKey, commitments, open }
  } catch {
    return null
  }
}
