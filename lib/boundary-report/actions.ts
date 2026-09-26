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
import type { BoundaryReportData, SelectedPath } from "@/lib/boundary-report/types"

interface SaveResult {
  ok: boolean
  id?: string
  error?: string
}

export async function saveBoundaryReport(data: BoundaryReportData): Promise<SaveResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You need to be signed in to save your Boundary Report." }

  // The first completed report becomes the persistent baseline. Never overwrite it.
  const { data: existing } = await supabase
    .from("boundary_reports")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_initial_baseline", true)
    .maybeSingle()

  const isInitialBaseline = !existing

  const { data: inserted, error } = await supabase
    .from("boundary_reports")
    .insert({
      user_id: user.id,
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
    })
    .select("id")
    .single()

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
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data?.report) return null
  return { id: data.id, data: data.report as BoundaryReportData }
}
