"use server"

/**
 * BO$$ Business Journey™ + readiness answers. Owner-scoped via RLS; the user is
 * always resolved server-side. Readiness answers are founder-stated only.
 */

import { createClient } from "@/lib/supabase/server"
import { deriveBusinessStage, type BusinessStageSignals } from "@/lib/business-stage/business-stage"
import {
  isBossJourney,
  suggestJourney,
  type BossJourney,
  type ReadinessAnswerStatus,
} from "./readiness"

export interface BossJourneyContext {
  journey: BossJourney
  /** True when the founder hasn't confirmed; `journey` is then a suggestion. */
  suggested: boolean
  harmonyTransition: boolean
  answers: Record<string, ReadinessAnswerStatus>
  approvedFactLabels: string[]
  doneKeys: string[]
}

const ANSWER_STATUSES: ReadinessAnswerStatus[] = ["have", "missing", "not_needed"]

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: data.user?.id ?? null }
}

export async function getBossJourneyContext(): Promise<BossJourneyContext | null> {
  const { supabase, userId } = await requireUser()
  if (!userId) return null

  const [profileRes, answersRes, factsRes, doneRes] = await Promise.all([
    supabase
      .from("business_context_profiles")
      .select("business_stage, boss_journey, harmony_lane_transition, journey_confirmed_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("boss_readiness_answers").select("requirement_key, status").eq("user_id", userId),
    supabase
      .from("business_profile_facts")
      .select("label, approved_label")
      .eq("user_id", userId)
      .eq("approval_status", "approved"),
    supabase
      .from("ceo_workday_plan_items")
      .select("assignment_key")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("assignment_key", "is", null),
  ])

  const p = profileRes.data as
    | { business_stage: string | null; boss_journey: string | null; harmony_lane_transition: boolean | null; journey_confirmed_at: string | null }
    | null
  const confirmed = p && isBossJourney(p.boss_journey) && p.journey_confirmed_at
  const journey: BossJourney = confirmed
    ? (p!.boss_journey as BossJourney)
    : suggestJourney(
        deriveBusinessStage(
          p?.business_stage ? ({ businessStage: p.business_stage } as BusinessStageSignals) : null,
        ),
      )

  const answers: Record<string, ReadinessAnswerStatus> = {}
  for (const a of (answersRes.data ?? []) as Array<{ requirement_key: string; status: ReadinessAnswerStatus }>) {
    answers[a.requirement_key] = a.status
  }

  return {
    journey,
    suggested: !confirmed,
    harmonyTransition: !!p?.harmony_lane_transition,
    answers,
    approvedFactLabels: ((factsRes.data ?? []) as Array<{ label: string | null; approved_label: string | null }>)
      .map((f) => f.approved_label || f.label || "")
      .filter(Boolean),
    doneKeys: Array.from(
      new Set(((doneRes.data ?? []) as Array<{ assignment_key: string }>).map((r) => r.assignment_key)),
    ),
  }
}

export async function saveBossJourney(input: { journey: BossJourney; harmonyTransition: boolean }) {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false as const, error: "Please sign in again." }
  if (!isBossJourney(input.journey)) return { ok: false as const, error: "Choose a journey." }

  const patch = {
    boss_journey: input.journey,
    harmony_lane_transition: !!input.harmonyTransition,
    journey_confirmed_at: new Date().toISOString(),
  }
  const { data: existing } = await supabase
    .from("business_context_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle()
  const { error } = existing
    ? await supabase.from("business_context_profiles").update(patch).eq("user_id", userId)
    : await supabase.from("business_context_profiles").insert({ user_id: userId, ...patch })
  if (error) {
    console.error("[v0] saveBossJourney failed", error.message)
    return { ok: false as const, error: "Couldn't save your journey. Please try again." }
  }
  return { ok: true as const }
}

export async function saveReadinessAnswer(input: { requirementKey: string; status: ReadinessAnswerStatus }) {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false as const, error: "Please sign in again." }
  const key = String(input.requirementKey ?? "").trim().slice(0, 100)
  if (!key || !/^[a-z0-9-]+$/.test(key)) return { ok: false as const, error: "Unknown requirement." }
  if (!ANSWER_STATUSES.includes(input.status)) return { ok: false as const, error: "Unknown answer." }

  const { error } = await supabase
    .from("boss_readiness_answers")
    .upsert(
      { user_id: userId, requirement_key: key, status: input.status, updated_at: new Date().toISOString() },
      { onConflict: "user_id,requirement_key" },
    )
  if (error) {
    console.error("[v0] saveReadinessAnswer failed", error.message)
    return { ok: false as const, error: "Couldn't save that answer." }
  }
  return { ok: true as const }
}
