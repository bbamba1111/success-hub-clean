"use server"

/**
 * Communicate + Delegate™ — Server Actions (Supabase, RLS-scoped)
 * ---------------------------------------------------------------------------
 * A communication is the SOURCE message for one decision the founder made. It
 * may hang off a weekly commitment, off a live CEO Workday work item, or off
 * nothing at all. Several communications can share the same context; none of
 * them ever create a weekly priority or a task.
 *
 * The column names here match scripts/024_communications_extensible.sql exactly
 * (this is what fixes the "Could not find the 'audience' column" schema-cache
 * error — the old code queried columns that never existed).
 */

import { createClient } from "@/lib/supabase/server"
import type {
  Audience,
  CommitmentType,
  CommunicationDetails,
  CommunicationFormat,
  CommunicationRecord,
  CommunicationStatus,
  CommunicationType,
  SourceContext,
  Tone,
} from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: (data.user?.id ?? null) as string | null }
}

type Row = {
  id: string
  user_id: string
  commitment_id: string | null
  commitment_type: CommitmentType
  commitment_text: string
  communication_type: CommunicationType
  source_context: SourceContext
  work_item_id: string | null
  plan_id: string | null
  audience: Audience[] | null
  audience_other: string | null
  timing: string | null
  subject_text: string | null
  message_intent: string | null
  desired_outcome: string | null
  tone: Tone
  details: CommunicationDetails | null
  source_subject: string | null
  source_message: string | null
  approved_subject: string | null
  approved_message: string | null
  final_format: CommunicationFormat | null
  status: CommunicationStatus
  created_at: string
  updated_at: string
}

function rowToRecord(r: Row): CommunicationRecord {
  return {
    id: r.id,
    commitmentId: r.commitment_id,
    commitmentType: r.commitment_type,
    commitmentText: r.commitment_text,
    communicationType: r.communication_type,
    sourceContext: r.source_context,
    workItemId: r.work_item_id,
    planId: r.plan_id,
    audience: r.audience ?? [],
    audienceOther: r.audience_other,
    timing: r.timing,
    subjectText: r.subject_text,
    messageIntent: r.message_intent,
    desiredOutcome: r.desired_outcome,
    tone: r.tone,
    details: r.details ?? {},
    sourceSubject: r.source_subject,
    sourceBody: r.source_message,
    approvedSubject: r.approved_subject,
    approvedBody: r.approved_message,
    finalFormat: r.final_format,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.slice(0, n))

export interface ListCommunicationsFilter {
  commitmentId?: string | null
  workItemId?: string | null
}

/** Everything the founder has created for a given commitment or work item. */
export async function listCommunications(filter: ListCommunicationsFilter) {
  const { supabase, userId } = await requireUser()
  if (!userId) return [] as CommunicationRecord[]
  let query = supabase.from("commitment_communications").select("*").eq("user_id", userId)
  if (filter.commitmentId) query = query.eq("commitment_id", filter.commitmentId)
  if (filter.workItemId) query = query.eq("work_item_id", filter.workItemId)
  const { data, error } = await query.order("created_at", { ascending: false })
  if (error || !data) return []
  return (data as Row[]).map(rowToRecord)
}

export interface SaveCommunicationInput {
  id?: string | null
  commitmentId?: string | null
  commitmentType: CommitmentType
  commitmentText: string
  communicationType: CommunicationType
  sourceContext: SourceContext
  workItemId?: string | null
  planId?: string | null
  audience: Audience[]
  audienceOther?: string | null
  timing?: string | null
  subjectText?: string | null
  messageIntent?: string | null
  desiredOutcome?: string | null
  tone: Tone
  details?: CommunicationDetails
  sourceSubject?: string | null
  sourceBody?: string | null
  approvedSubject?: string | null
  approvedBody?: string | null
  finalFormat?: CommunicationFormat | null
  status: Exclude<CommunicationStatus, "used">
}

export async function saveCommunication(
  input: SaveCommunicationInput,
): Promise<{ ok: true; record: CommunicationRecord } | { ok: false; error: string }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false, error: "Please sign in to save your communication." }

  const payload = {
    user_id: userId,
    commitment_id: input.commitmentId ?? null,
    commitment_type: input.commitmentType,
    commitment_text: clip(input.commitmentText, 600) ?? "",
    communication_type: input.communicationType,
    source_context: input.sourceContext,
    work_item_id: input.workItemId ?? null,
    plan_id: input.planId ?? null,
    audience: input.audience,
    audience_other: clip(input.audienceOther, 120),
    timing: clip(input.timing, 200),
    subject_text: clip(input.subjectText, 600),
    message_intent: clip(input.messageIntent, 800),
    desired_outcome: clip(input.desiredOutcome, 800),
    tone: input.tone,
    details: input.details ?? {},
    source_subject: clip(input.sourceSubject, 200),
    source_message: clip(input.sourceBody, 4000),
    approved_subject: clip(input.approvedSubject, 200),
    approved_message: clip(input.approvedBody, 4000),
    final_format: input.finalFormat ?? null,
    status: input.status,
  }

  const query = input.id
    ? supabase.from("commitment_communications").update(payload).eq("id", input.id).eq("user_id", userId)
    : supabase.from("commitment_communications").insert(payload)

  const { data, error } = await query.select("*").single()
  if (error || !data) return { ok: false, error: error?.message ?? "Could not save." }
  return { ok: true, record: rowToRecord(data as Row) }
}

/** The founder must explicitly say it was used / sent / shared. */
export async function markCommunicationUsed(id: string, format: CommunicationFormat | null) {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false as const, error: "Please sign in." }
  const { data, error } = await supabase
    .from("commitment_communications")
    .update({ status: "used", final_format: format, used_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single()
  if (error || !data) return { ok: false as const, error: error?.message ?? "Could not update." }
  return { ok: true as const, record: rowToRecord(data as Row) }
}
