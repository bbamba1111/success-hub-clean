"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ACTION_KINDS, DECISIONS, JOB_FUNCTIONS } from "@/lib/boss/jobs/definitions"

type Result = { ok: true; message?: string } | { ok: false; error: string }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const HASH = /^[0-9a-f]{64}$/
const MAX_PREAUTH_DAYS = 90

async function founder() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

function cleanNote(raw: unknown, max: number) {
  const value = typeof raw === "string" ? raw.trim() : ""
  if (value.length > max) return undefined
  return value.length ? value : null
}

function done(message?: string): Result {
  revalidatePath("/boss/queue")
  return { ok: true, message }
}

function failed(error: { message: string }, fallback: string): Result {
  console.error("[v0] boss authority action failed:", error.message)
  const known = /no longer waiting|changed\. Review|not found|not allowed|closed/i.test(error.message)
  return { ok: false, error: known ? error.message : fallback }
}

async function execute(supabase: Awaited<ReturnType<typeof createClient>>, proposalId: string): Promise<Result> {
  const { data, error } = await supabase.rpc("boss_execute_proposal", { p_proposal_id: proposalId })
  if (error) return failed(error, "It could not be done right now.")
  const outcome = data as { ok: boolean; reason?: string | null }
  if (!outcome?.ok) return { ok: false, error: outcome?.reason ?? "It could not be done right now." }
  return done("Done.")
}

export async function decideProposal(
  proposalId: string,
  decision: string,
  expectedHash: string,
  note?: string,
): Promise<Result> {
  const { supabase, userId } = await founder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  if (!UUID.test(proposalId) || !HASH.test(expectedHash)) return { ok: false, error: "That proposal is not valid." }
  if (!DECISIONS.some((d) => d.key === decision)) return { ok: false, error: "Unknown decision." }
  const clean = cleanNote(note, 2000)
  if (clean === undefined) return { ok: false, error: "That note is too long." }

  const { error } = await supabase.rpc("boss_decide_proposal", {
    p_proposal_id: proposalId,
    p_decision: decision,
    p_expected_hash: expectedHash,
    p_note: clean,
  })
  if (error) return failed(error, "Your decision could not be saved.")

  if (decision !== "yes_do_it") return done()
  const outcome = await execute(supabase, proposalId)
  if (!outcome.ok) {
    revalidatePath("/boss/queue")
    return { ok: false, error: `Approved, but not done: ${outcome.error}` }
  }
  return outcome
}

export async function retryProposal(proposalId: string): Promise<Result> {
  const { supabase, userId } = await founder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  if (!UUID.test(proposalId)) return { ok: false, error: "That proposal is not valid." }
  return execute(supabase, proposalId)
}

export type PreauthorizationInput = {
  jobId?: string | null
  businessFunction?: string | null
  actionKinds: string[]
  days: number
  maxUses?: number | null
  note?: string
}

export async function grantPreauthorization(input: PreauthorizationInput): Promise<Result> {
  const { supabase, userId } = await founder()
  if (!userId) return { ok: false, error: "Please sign in again." }

  const jobId = input.jobId && UUID.test(input.jobId) ? input.jobId : null
  const area = JOB_FUNCTIONS.some((f) => f.key === input.businessFunction) ? input.businessFunction : null
  if (!jobId && !area) return { ok: false, error: "Choose one job or one business area." }

  const kinds = Array.from(new Set(input.actionKinds)).filter((k) => ACTION_KINDS.some((a) => a.key === k))
  if (kinds.length === 0) return { ok: false, error: "Choose at least one thing it may do." }

  const days = Math.floor(Number(input.days))
  if (!Number.isFinite(days) || days < 1 || days > MAX_PREAUTH_DAYS) {
    return { ok: false, error: `Choose between 1 and ${MAX_PREAUTH_DAYS} days.` }
  }
  const maxUses = input.maxUses == null || input.maxUses === 0 ? null : Math.floor(Number(input.maxUses))
  if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses < 1 || maxUses > 1000)) {
    return { ok: false, error: "Choose between 1 and 1000 uses, or leave it empty." }
  }
  const note = cleanNote(input.note, 1000)
  if (note === undefined) return { ok: false, error: "That note is too long." }

  const expiresAt = new Date(Date.now() + days * 86_400_000 - 60_000).toISOString()
  const { error } = await supabase.rpc("boss_grant_preauthorization", {
    p_job_id: jobId,
    p_business_function: jobId ? null : area,
    p_action_kinds: kinds,
    p_expires_at: expiresAt,
    p_max_uses: maxUses,
    p_note: note,
  })
  if (error) return failed(error, "The pre-authorization could not be saved.")
  return done("Saved.")
}

export async function revokePreauthorization(id: string, note?: string): Promise<Result> {
  const { supabase, userId } = await founder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  if (!UUID.test(id)) return { ok: false, error: "That pre-authorization is not valid." }
  const clean = cleanNote(note, 1000)
  if (clean === undefined) return { ok: false, error: "That note is too long." }
  const { error } = await supabase.rpc("boss_revoke_preauthorization", { p_id: id, p_note: clean })
  if (error) return failed(error, "The pre-authorization could not be withdrawn.")
  return done("Withdrawn.")
}
