import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"
import { ACTION_KINDS, JOB_STATUSES, type ActionKind } from "./jobs/definitions"

export type ProposalInput = {
  jobId: string
  proposedBy: "cherry" | "executive" | "system"
  aiCapability: string
  summary: string
  actionKind: ActionKind
  payload: Record<string, unknown>
}

function validPayload(kind: ActionKind, payload: Record<string, unknown>) {
  if (kind === "job.save_whats_ready") {
    return typeof payload.text === "string" && payload.text.trim().length > 0 && payload.text.length <= 4000
  }
  if (kind === "job.set_status") {
    return JOB_STATUSES.some((s) => s.key === payload.status)
  }
  return false
}

/**
 * The only way AI can ask to change a job. It never changes the job itself:
 * the proposal waits for the founder, unless an active pre-authorization covers it.
 * Must be called with the signed-in member's own Supabase client so RLS and auth.uid() apply.
 */
export async function proposeJobAction(supabase: SupabaseClient, input: ProposalInput) {
  if (!ACTION_KINDS.some((a) => a.key === input.actionKind) || !validPayload(input.actionKind, input.payload)) {
    return { ok: false as const, error: "That action is not allowed." }
  }
  const summary = input.summary.trim().slice(0, 2000)
  if (!summary) return { ok: false as const, error: "A proposal needs a summary." }

  const { data: proposalId, error } = await supabase.rpc("boss_create_proposal", {
    p_job_id: input.jobId,
    p_proposed_by: input.proposedBy,
    p_ai_capability: input.aiCapability.slice(0, 120),
    p_summary: summary,
    p_action_kind: input.actionKind,
    p_action_payload: input.payload,
  })
  if (error || !proposalId) return { ok: false as const, error: error?.message ?? "The proposal could not be saved." }

  const { data: outcome } = await supabase.rpc("boss_execute_proposal", { p_proposal_id: proposalId })
  const result = outcome as { ok: boolean; via?: string; reason?: string } | null
  return {
    ok: true as const,
    proposalId: proposalId as string,
    executed: Boolean(result?.ok),
    waitingForFounder: !result?.ok,
  }
}
