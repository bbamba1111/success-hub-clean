"use server"

/**
 * Human SOS™ — Server Actions (Supabase).
 *
 * ONE record per (user, week) in public.human_sos, enforced by a unique
 * constraint and UPSERT on (user_id, week_key). Each required stakeholder is a
 * row in public.human_sos_stakeholders (parent-scoped by sos_id). RLS scopes
 * every read/write to the signed-in founder.
 */

import { createClient } from "@/lib/supabase/server"
import type { BusinessRequirementId } from "@/lib/boundary-library/types"
import {
  emptyCommunication,
  emptyEscalation,
  emptyExceptions,
  emptyHumanSos,
  emptyMondayEval,
  type CommunicationSnapshot,
  type EscalationData,
  type ExceptionsData,
  type HumanSos,
  type HumanSosStatus,
  type ImplementationItem,
  type MondayEval,
  type ResponseSla,
  type SosStakeholder,
  type StakeholderResolutionStatus,
  type StakeholderResponseState,
  type TrainingItem,
} from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.trim().slice(0, n) || null)

/* ---------------------------------------------------------------- */
/* Row mapping                                                       */
/* ---------------------------------------------------------------- */

type SosRow = {
  id: string
  week_key: string
  boundary_focus_text: string
  pattern_id: string | null
  family_id: string | null
  what_protecting: unknown
  boundary_statement: string
  business_requirement_ids: unknown
  operating_rule_ids: unknown
  operating_rule_text: string
  implementation: unknown
  escalation: unknown
  exceptions: unknown
  communication: unknown
  training: unknown
  status: HumanSosStatus
  current_step: number
  effective_date: string | null
  review_date: string | null
  monday_eval: unknown
  created_at: string
  updated_at: string
}

const asArray = <T,>(v: unknown, fallback: T[] = []): T[] => (Array.isArray(v) ? (v as T[]) : fallback)
const asStrings = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : [])

function fromSosRow(r: SosRow): HumanSos {
  const base = emptyHumanSos(r.week_key, r.boundary_focus_text)
  return {
    ...base,
    id: r.id,
    boundaryFocusText: r.boundary_focus_text ?? "",
    patternId: r.pattern_id,
    familyId: r.family_id,
    whatProtecting: asStrings(r.what_protecting),
    boundaryStatement: r.boundary_statement ?? "",
    businessRequirementIds: asStrings(r.business_requirement_ids) as BusinessRequirementId[],
    operatingRuleIds: asStrings(r.operating_rule_ids),
    operatingRuleText: r.operating_rule_text ?? "",
    implementation: asArray<ImplementationItem>(r.implementation),
    escalation: { ...emptyEscalation(), ...((r.escalation as Partial<EscalationData>) ?? {}) },
    exceptions: { ...emptyExceptions(), ...((r.exceptions as Partial<ExceptionsData>) ?? {}) },
    communication: { ...emptyCommunication(), ...((r.communication as Partial<CommunicationSnapshot>) ?? {}) },
    training: asArray<TrainingItem>(r.training),
    status: r.status,
    currentStep: r.current_step ?? 1,
    effectiveDate: r.effective_date,
    reviewDate: r.review_date,
    mondayEval: { ...emptyMondayEval(), ...((r.monday_eval as Partial<MondayEval>) ?? {}) },
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

type StakeholderRow = {
  id: string
  sos_id: string
  name: string
  stakeholder_type: string
  role: string | null
  what_to_understand: string | null
  required_action: string | null
  training_needed: boolean
  meeting_needed: boolean
  qa_needed: boolean
  followup_needed: boolean
  response_sla: ResponseSla
  deadline: string | null
  response_state: StakeholderResponseState
  question_text: string | null
  question_owner: string | null
  question_response: string | null
  question_resolution_deadline: string | null
  question_status: StakeholderResolutionStatus
  concern: string | null
  impact: string | null
  requested_change: string | null
  objection_owner: string | null
  objection_resolution_deadline: string | null
  objection_status: StakeholderResolutionStatus
  sort_order: number
  created_at: string
  updated_at: string
}

function fromStakeholderRow(r: StakeholderRow): SosStakeholder {
  return {
    id: r.id,
    sosId: r.sos_id,
    name: r.name ?? "",
    stakeholderType: r.stakeholder_type ?? "other",
    role: r.role ?? "",
    whatToUnderstand: r.what_to_understand ?? "",
    requiredAction: r.required_action ?? "",
    trainingNeeded: !!r.training_needed,
    meetingNeeded: !!r.meeting_needed,
    qaNeeded: !!r.qa_needed,
    followupNeeded: !!r.followup_needed,
    responseSla: r.response_sla ?? "48h",
    deadline: r.deadline,
    responseState: r.response_state ?? "pending",
    questionText: r.question_text,
    questionOwner: r.question_owner,
    questionResponse: r.question_response,
    questionResolutionDeadline: r.question_resolution_deadline,
    questionStatus: r.question_status ?? "none",
    concern: r.concern,
    impact: r.impact,
    requestedChange: r.requested_change,
    objectionOwner: r.objection_owner,
    objectionResolutionDeadline: r.objection_resolution_deadline,
    objectionStatus: r.objection_status ?? "none",
    sortOrder: r.sort_order ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const SOS_COLS =
  "id, week_key, boundary_focus_text, pattern_id, family_id, what_protecting, boundary_statement, business_requirement_ids, operating_rule_ids, operating_rule_text, implementation, escalation, exceptions, communication, training, status, current_step, effective_date, review_date, monday_eval, created_at, updated_at"

const STAKEHOLDER_COLS =
  "id, sos_id, name, stakeholder_type, role, what_to_understand, required_action, training_needed, meeting_needed, qa_needed, followup_needed, response_sla, deadline, response_state, question_text, question_owner, question_response, question_resolution_deadline, question_status, concern, impact, requested_change, objection_owner, objection_resolution_deadline, objection_status, sort_order, created_at, updated_at"

/* ---------------------------------------------------------------- */
/* Reads                                                             */
/* ---------------------------------------------------------------- */

export interface HumanSosBundle {
  sos: HumanSos
  stakeholders: SosStakeholder[]
}

export async function getHumanSos(weekKey: string, boundaryFocusText = ""): Promise<HumanSosBundle> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { sos: emptyHumanSos(weekKey, boundaryFocusText), stakeholders: [] }

    const { data: sosData } = await supabase
      .from("human_sos")
      .select(SOS_COLS)
      .eq("user_id", userId)
      .eq("week_key", weekKey)
      .maybeSingle()

    if (!sosData) return { sos: emptyHumanSos(weekKey, boundaryFocusText), stakeholders: [] }

    const sos = fromSosRow(sosData as SosRow)
    const { data: stk } = await supabase
      .from("human_sos_stakeholders")
      .select(STAKEHOLDER_COLS)
      .eq("user_id", userId)
      .eq("sos_id", sos.id as string)
      .order("sort_order", { ascending: true })

    return { sos, stakeholders: (stk ?? []).map((r) => fromStakeholderRow(r as StakeholderRow)) }
  } catch {
    return { sos: emptyHumanSos(weekKey, boundaryFocusText), stakeholders: [] }
  }
}

/* ---------------------------------------------------------------- */
/* Writes                                                            */
/* ---------------------------------------------------------------- */

export async function saveHumanSos(sos: HumanSos): Promise<{ ok: boolean; sos?: HumanSos; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in to build your Human SOS™." }

    const { data, error } = await supabase
      .from("human_sos")
      .upsert(
        {
          user_id: userId,
          week_key: sos.weekKey,
          boundary_focus_text: clip(sos.boundaryFocusText, 300) ?? "",
          pattern_id: clip(sos.patternId, 80),
          family_id: clip(sos.familyId, 80),
          what_protecting: sos.whatProtecting.slice(0, 40),
          boundary_statement: clip(sos.boundaryStatement, 600) ?? "",
          business_requirement_ids: sos.businessRequirementIds.slice(0, 40),
          operating_rule_ids: sos.operatingRuleIds.slice(0, 40),
          operating_rule_text: clip(sos.operatingRuleText, 1200) ?? "",
          implementation: sos.implementation.slice(0, 60),
          escalation: sos.escalation,
          exceptions: sos.exceptions,
          communication: sos.communication,
          training: sos.training.slice(0, 60),
          status: sos.status,
          current_step: Math.max(1, Math.min(8, sos.currentStep || 1)),
          effective_date: sos.effectiveDate,
          review_date: sos.reviewDate,
          monday_eval: sos.mondayEval,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,week_key" },
      )
      .select(SOS_COLS)
      .single()

    if (error) return { ok: false, error: error.message }
    return { ok: true, sos: fromSosRow(data as SosRow) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save your Human SOS™." }
  }
}

export async function saveStakeholder(
  stakeholder: SosStakeholder,
): Promise<{ ok: boolean; stakeholder?: SosStakeholder; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in." }
    if (!stakeholder.sosId) return { ok: false, error: "Save the boundary before adding stakeholders." }

    const payload = {
      user_id: userId,
      sos_id: stakeholder.sosId,
      name: clip(stakeholder.name, 160) ?? "",
      stakeholder_type: clip(stakeholder.stakeholderType, 40) ?? "other",
      role: clip(stakeholder.role, 160),
      what_to_understand: clip(stakeholder.whatToUnderstand, 800),
      required_action: clip(stakeholder.requiredAction, 800),
      training_needed: !!stakeholder.trainingNeeded,
      meeting_needed: !!stakeholder.meetingNeeded,
      qa_needed: !!stakeholder.qaNeeded,
      followup_needed: !!stakeholder.followupNeeded,
      response_sla: stakeholder.responseSla,
      deadline: stakeholder.deadline,
      response_state: stakeholder.responseState,
      question_text: clip(stakeholder.questionText, 800),
      question_owner: clip(stakeholder.questionOwner, 160),
      question_response: clip(stakeholder.questionResponse, 800),
      question_resolution_deadline: stakeholder.questionResolutionDeadline,
      question_status: stakeholder.questionStatus,
      concern: clip(stakeholder.concern, 800),
      impact: clip(stakeholder.impact, 800),
      requested_change: clip(stakeholder.requestedChange, 800),
      objection_owner: clip(stakeholder.objectionOwner, 160),
      objection_resolution_deadline: stakeholder.objectionResolutionDeadline,
      objection_status: stakeholder.objectionStatus,
      sort_order: stakeholder.sortOrder,
      updated_at: new Date().toISOString(),
    }

    // Insert (no real id yet) vs update existing row.
    const isExisting = stakeholder.id && !stakeholder.id.startsWith("tmp-")
    const query = isExisting
      ? supabase.from("human_sos_stakeholders").update(payload).eq("id", stakeholder.id).eq("user_id", userId)
      : supabase.from("human_sos_stakeholders").insert(payload)

    const { data, error } = await query.select(STAKEHOLDER_COLS).single()
    if (error) return { ok: false, error: error.message }
    return { ok: true, stakeholder: fromStakeholderRow(data as StakeholderRow) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save the stakeholder." }
  }
}

export async function deleteStakeholder(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { supabase, userId } = await requireUser()
    if (!userId) return { ok: false, error: "Please sign in." }
    const { error } = await supabase.from("human_sos_stakeholders").delete().eq("id", id).eq("user_id", userId)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not remove the stakeholder." }
  }
}
