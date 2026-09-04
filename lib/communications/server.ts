"use server"

/**
 * Commitment Communications — Server Actions (Supabase, RLS-scoped)
 * ---------------------------------------------------------------------------
 * A communication belongs to one weekly commitment. Several communications
 * (team message, family explanation, client note) may share the same commitment;
 * none of them ever create a duplicate weekly priority.
 *
 *   listCommunications   ← everything for this week's commitment
 *   saveCommunication    ← create or update (draft / approved)
 *   markCommunicationUsed← founder explicitly says "I sent / shared this"
 */

import { createClient } from "@/lib/supabase/server"
import type { Audience, CommitmentCommunication, CommitmentType, CommunicationFormat, CommunicationStatus, Tone } from "./types"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return { supabase, userId: null as string | null }
  return { supabase, userId: data.user.id as string | null }
}

type Row = {
  id: string
  user_id: string
  weekly_commitment_id: string
  commitment_type: CommitmentType
  commitment_text: string
  audience: Audience[]
  audience_other: string | null
  timing: string | null
  desired_outcome: string | null
  tone: Tone
  generated_subject: string | null
  generated_body: string | null
  final_subject: string | null
  final_body: string | null
  final_format: CommunicationFormat | null
  status: CommunicationStatus
  created_at: string
  updated_at: string
}

function rowToRecord(r: Row): CommitmentCommunication {
  return {
    id: r.id,
    weeklyCommitmentId: r.weekly_commitment_id,
    commitmentType: r.commitment_type,
    commitmentText: r.commitment_text,
    audience: r.audience ?? [],
    audienceOther: r.audience_other,
    timing: r.timing,
    desiredOutcome: r.desired_outcome,
    tone: r.tone,
    generatedSubject: r.generated_subject,
    generatedBody: r.generated_body,
    finalSubject: r.final_subject,
    finalBody: r.final_body,
    finalFormat: r.final_format,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const clip = (s: string | null | undefined, n: number) => (s == null ? null : s.slice(0, n))

export async function listCommunications(weeklyCommitmentId: string, commitmentType: CommitmentType) {
  const { supabase, userId } = await requireUser()
  if (!userId) return [] as CommitmentCommunication[]
  const { data, error } = await supabase
    .from("commitment_communications")
    .select("*")
    .eq("user_id", userId)
    .eq("weekly_commitment_id", weeklyCommitmentId)
    .eq("commitment_type", commitmentType)
    .order("created_at", { ascending: false })
  if (error || !data) return []
  return (data as Row[]).map(rowToRecord)
}

export interface SaveCommunicationInput {
  id?: string | null
  weeklyCommitmentId: string
  commitmentType: CommitmentType
  commitmentText: string
  audience: Audience[]
  audienceOther?: string | null
  timing?: string | null
  desiredOutcome?: string | null
  tone: Tone
  generatedSubject?: string | null
  generatedBody?: string | null
  finalSubject?: string | null
  finalBody?: string | null
  finalFormat?: CommunicationFormat | null
  status: Exclude<CommunicationStatus, "used">
}

export async function saveCommunication(
  input: SaveCommunicationInput,
): Promise<{ ok: true; record: CommitmentCommunication } | { ok: false; error: string }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false, error: "Please sign in to save your communication." }

  const payload = {
    user_id: userId,
    weekly_commitment_id: input.weeklyCommitmentId,
    commitment_type: input.commitmentType,
    commitment_text: clip(input.commitmentText, 600) ?? "",
    audience: input.audience,
    audience_other: clip(input.audienceOther, 120),
    timing: clip(input.timing, 160),
    desired_outcome: clip(input.desiredOutcome, 600),
    tone: input.tone,
    generated_subject: clip(input.generatedSubject, 200),
    generated_body: clip(input.generatedBody, 4000),
    final_subject: clip(input.finalSubject, 200),
    final_body: clip(input.finalBody, 4000),
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
    .update({ status: "used", final_format: format })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single()
  if (error || !data) return { ok: false as const, error: error?.message ?? "Could not update." }
  return { ok: true as const, record: rowToRecord(data as Row) }
}
