"use server"

/**
 * Work-Life Balance Boundary Report™ persistence.
 *
 * The $97 diagnostic writes its full output to `public.boundary_reports`
 * (RLS: owner-only). The FIRST completed report is the persistent
 * INITIAL_30_DAY_BASELINE — `is_initial_baseline = true` — and is never
 * overwritten. Later runs insert new rows so the baseline is preserved and the
 * founder's data survives even when they choose GO IT ALONE.
 */

import { createClient } from "@/lib/supabase/server"
import type { BoundaryReportData, BoundaryReportDraft, SelectedPath } from "@/lib/boundary-report/types"
import { normalizeCurrentBusiness, type CurrentBusiness } from "@/lib/boundary-report/current-business"

interface SaveResult {
  ok: boolean
  id?: string
  error?: string
}

type ServerClient = Awaited<ReturnType<typeof createClient>>

// Weekly 7-day audits share this table; everything in this file is the full 30-day assessment.
const FULL_ASSESSMENT = "full_30_day"

async function findDraftId(supabase: ServerClient, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("boundary_reports")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "draft")
    .eq("assessment_type", FULL_ASSESSMENT)
    .maybeSingle()
  return data?.id ?? null
}

/**
 * Autosave in-progress answers to the member's single draft row
 * (status = 'draft', never a baseline, never completed).
 */
export async function saveBoundaryDraft(draft: BoundaryReportDraft): Promise<SaveResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sign in to save your progress." }

  const fields = {
    draft_state: draft,
    current_business: { ...draft.currentBusiness, updatedAt: new Date().toISOString() },
    updated_at: new Date().toISOString(),
  }

  const update = async (id: string) =>
    supabase.from("boundary_reports").update(fields).eq("id", id).eq("user_id", user.id)

  const draftId = await findDraftId(supabase, user.id)
  if (draftId) {
    const { error } = await update(draftId)
    return error ? { ok: false, error: error.message } : { ok: true, id: draftId }
  }

  const { data: inserted, error } = await supabase
    .from("boundary_reports")
    .insert({ user_id: user.id, status: "draft", is_initial_baseline: false, ...fields })
    .select("id")
    .single()

  // A parallel save may have created the draft first (one-draft-per-member index).
  if (error?.code === "23505") {
    const racedId = await findDraftId(supabase, user.id)
    if (racedId) {
      const { error: retryError } = await update(racedId)
      return retryError ? { ok: false, error: retryError.message } : { ok: true, id: racedId }
    }
  }
  if (error) {
    console.error("[v0] saveBoundaryDraft error:", error.message)
    return { ok: false, error: "We couldn't save your progress." }
  }
  return { ok: true, id: inserted.id }
}

/**
 * The member's in-progress draft, plus the Current Business™ answers from their
 * latest completed report so returning members don't start from blank.
 */
export async function loadBoundaryDraft(): Promise<{
  draft: BoundaryReportDraft | null
  previousCurrentBusiness: CurrentBusiness | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { draft: null, previousCurrentBusiness: null }

  const [{ data: draftRow }, { data: lastCompleted }] = await Promise.all([
    supabase
      .from("boundary_reports")
      .select("draft_state")
      .eq("user_id", user.id)
      .eq("status", "draft")
      .eq("assessment_type", FULL_ASSESSMENT)
      .maybeSingle(),
    supabase
      .from("boundary_reports")
      .select("current_business")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("assessment_type", FULL_ASSESSMENT)
      .not("current_business", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const draft = (draftRow?.draft_state as BoundaryReportDraft | null) ?? null
  if (draft) draft.currentBusiness = normalizeCurrentBusiness(draft.currentBusiness) ?? draft.currentBusiness

  return { draft, previousCurrentBusiness: normalizeCurrentBusiness(lastCompleted?.current_business) }
}

export async function saveBoundaryReport(data: BoundaryReportData): Promise<SaveResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You need to be signed in to save your Boundary Report." }

  // The first completed report becomes the persistent baseline. Never overwrite it.
  // Drafts are always is_initial_baseline = false, so they never satisfy this check.
  const { data: existing } = await supabase
    .from("boundary_reports")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_initial_baseline", true)
    .maybeSingle()

  const isInitialBaseline = !existing

  const payload = {
    user_id: user.id,
    status: "completed",
    draft_state: null,
    current_business: data.currentBusiness ?? null,
    is_initial_baseline: isInitialBaseline,
      original_intention: data.originalIntention,
      baseline_scores: data.baseline.areas,
      baseline_overall: data.baseline.overall,
      baseline_date: data.baseline.date,
      priority_focus_areas: data.priorityFocusAreas,
      life_boundaries: data.lifeBoundaries,
      boundary_collisions: data.boundaryCollisions,
      business_requirements: data.businessRequirements,
      stage_considerations: { stage: data.stage, considerations: data.stageConsiderations },
      report: data,
    selected_path: data.selectedPath ?? null,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Promote this run's draft row to the completed version; otherwise insert a new version.
  const draftId = await findDraftId(supabase, user.id)
  const { data: inserted, error } = draftId
    ? await supabase.from("boundary_reports").update(payload).eq("id", draftId).eq("user_id", user.id).select("id").single()
    : await supabase.from("boundary_reports").insert(payload).select("id").single()

  if (error) {
    console.error("[v0] saveBoundaryReport error:", error.message)
    return { ok: false, error: "We couldn't save your Boundary Report. Please try again." }
  }

  return { ok: true, id: inserted.id }
}

export async function setBoundaryReportPath(reportId: string, path: SelectedPath): Promise<SaveResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You need to be signed in." }

  const { error } = await supabase
    .from("boundary_reports")
    .update({ selected_path: path, updated_at: new Date().toISOString() })
    .eq("id", reportId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] setBoundaryReportPath error:", error.message)
    return { ok: false, error: "We couldn't record your choice. Please try again." }
  }
  return { ok: true, id: reportId }
}

/** Latest Boundary Report for the current founder (for the report view / GO IT ALONE access). */
export async function getLatestBoundaryReport(): Promise<{ id: string; data: BoundaryReportData } | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("boundary_reports")
    .select("id, report")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .eq("assessment_type", FULL_ASSESSMENT)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data?.report) return null
  return { id: data.id, data: data.report as BoundaryReportData }
}
