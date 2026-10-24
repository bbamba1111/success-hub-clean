"use server"

/**
 * Weekly 7-Day Work-Life Balance Audit™ persistence.
 *
 * Every query here is scoped to the signed-in member AND
 * assessment_type = 'weekly_7_day', so nothing can read or write the full
 * 30-day onboarding draft or the initial baseline. The initial baseline is only
 * ever SELECTed, for comparison.
 */

import { createClient } from "@/lib/supabase/server"
import {
  AUDIT_QUESTION_COUNT,
  isCompleteAuditAnswers,
  sanitizeAuditAnswers,
  scoreAuditAnswers,
} from "@/lib/work-life-balance-audit/questions"
import { CATEGORY_LABELS } from "@/utils/life-value-categories"
import type { BoundaryReportData } from "@/lib/boundary-report/types"
import {
  FULL_ASSESSMENT,
  MAX_WEEKLY_PRIORITIES,
  WEEKLY_ASSESSMENT,
  type CurrentPriorityFocus,
  type WeeklyAreaScore,
  type WeeklyAuditDraft,
  type WeeklyAuditReport,
  type WeeklyComparison,
  type WeeklyHistoryItem,
} from "@/lib/boundary-report/weekly-types"

type ServerClient = Awaited<ReturnType<typeof createClient>>

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

async function getSessionUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

async function findWeeklyDraftId(supabase: ServerClient, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("boundary_reports")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "draft")
    .eq("assessment_type", WEEKLY_ASSESSMENT)
    .maybeSingle()
  return data?.id ?? null
}

function toAreaScores(raw: unknown): WeeklyAreaScore[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((a): a is { key: string; label?: string; score: number } => !!a && typeof a.key === "string" && typeof a.score === "number")
    .map((a) => ({ key: a.key, label: a.label ?? CATEGORY_LABELS[a.key] ?? a.key, score: a.score }))
}

function compare(
  current: { overall: number; areas: WeeklyAreaScore[] },
  row: {
    id: string
    assessment_type: string
    completed_at: string | null
    created_at: string
    period_start: string | null
    period_end: string | null
    baseline_overall: number | null
    baseline_scores: unknown
  } | null,
): WeeklyComparison | null {
  if (!row || typeof row.baseline_overall !== "number") return null
  const prior = new Map(toAreaScores(row.baseline_scores).map((a) => [a.key, a.score]))
  const areaDeltas: Record<string, number> = {}
  for (const a of current.areas) {
    const p = prior.get(a.key)
    if (typeof p === "number") areaDeltas[a.key] = a.score - p
  }
  return {
    reportId: row.id,
    assessmentType: row.assessment_type === WEEKLY_ASSESSMENT ? "weekly_7_day" : "full_30_day",
    completedAt: row.completed_at ?? row.created_at,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    overall: row.baseline_overall,
    overallDelta: current.overall - row.baseline_overall,
    areaDeltas,
  }
}

const COMPARISON_COLUMNS =
  "id, assessment_type, completed_at, created_at, period_start, period_end, baseline_overall, baseline_scores"

function toHistoryItem(row: {
  id: string
  completed_at: string | null
  created_at: string
  period_start: string | null
  period_end: string | null
  baseline_overall: number | null
  report: unknown
}): WeeklyHistoryItem {
  const report = row.report as Partial<WeeklyAuditReport> | null
  return {
    id: row.id,
    completedAt: row.completed_at ?? row.created_at,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    overall: row.baseline_overall ?? report?.overall ?? 0,
    priorityLabels: (report?.priorityAreas ?? []).map((a) => a.label),
  }
}

/** Autosave the member's single in-progress weekly draft. */
export async function saveWeeklyDraft(draft: WeeklyAuditDraft): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await getSessionUser()
  if (!user) return { ok: false, error: "Sign in to save your progress." }

  const draftState: WeeklyAuditDraft = {
    answers: sanitizeAuditAnswers(draft?.answers),
    questionIndex: Math.min(Math.max(Math.trunc(Number(draft?.questionIndex) || 0), 0), AUDIT_QUESTION_COUNT - 1),
  }
  const fields = { draft_state: draftState, updated_at: new Date().toISOString() }

  const update = (id: string) =>
    supabase
      .from("boundary_reports")
      .update(fields)
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("status", "draft")
      .eq("assessment_type", WEEKLY_ASSESSMENT)

  const draftId = await findWeeklyDraftId(supabase, user.id)
  if (draftId) {
    const { error } = await update(draftId)
    return error ? { ok: false, error: "We couldn't save your progress." } : { ok: true }
  }

  const { error } = await supabase.from("boundary_reports").insert({
    user_id: user.id,
    status: "draft",
    assessment_type: WEEKLY_ASSESSMENT,
    is_initial_baseline: false,
    ...fields,
  })

  // A parallel save created the draft first (boundary_reports_one_draft_per_user_type).
  if (error?.code === "23505") {
    const racedId = await findWeeklyDraftId(supabase, user.id)
    if (racedId) {
      const { error: retryError } = await update(racedId)
      return retryError ? { ok: false, error: "We couldn't save your progress." } : { ok: true }
    }
  }
  if (error) {
    console.error("[v0] saveWeeklyDraft error:", error.message)
    return { ok: false, error: "We couldn't save your progress." }
  }
  return { ok: true }
}

/** Everything the Monday weekly audit needs to open: draft, latest result, history. */
export async function loadWeeklyAudit(): Promise<{
  signedIn: boolean
  draft: WeeklyAuditDraft | null
  latest: { id: string; report: WeeklyAuditReport } | null
  history: WeeklyHistoryItem[]
}> {
  const { supabase, user } = await getSessionUser()
  if (!user) return { signedIn: false, draft: null, latest: null, history: [] }

  const [{ data: draftRow }, { data: completed }] = await Promise.all([
    supabase
      .from("boundary_reports")
      .select("draft_state")
      .eq("user_id", user.id)
      .eq("status", "draft")
      .eq("assessment_type", WEEKLY_ASSESSMENT)
      .maybeSingle(),
    supabase
      .from("boundary_reports")
      .select("id, completed_at, created_at, period_start, period_end, baseline_overall, report")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("assessment_type", WEEKLY_ASSESSMENT)
      .order("completed_at", { ascending: false })
      .limit(26),
  ])

  const rawDraft = draftRow?.draft_state as Partial<WeeklyAuditDraft> | null
  const draft = rawDraft
    ? { answers: sanitizeAuditAnswers(rawDraft.answers), questionIndex: Number(rawDraft.questionIndex) || 0 }
    : null

  const rows = completed ?? []
  const latestRow = rows.find((r) => (r.report as WeeklyAuditReport | null)?.kind === "weekly_7_day")
  return {
    signedIn: true,
    draft,
    latest: latestRow ? { id: latestRow.id, report: latestRow.report as WeeklyAuditReport } : null,
    history: rows.map(toHistoryItem),
  }
}

/** Completed weekly records only, newest first — for Your Boundary Report™ history. */
export async function listWeeklyHistory(): Promise<WeeklyHistoryItem[]> {
  const { supabase, user } = await getSessionUser()
  if (!user) return []
  const { data } = await supabase
    .from("boundary_reports")
    .select("id, completed_at, created_at, period_start, period_end, baseline_overall, report")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .eq("assessment_type", WEEKLY_ASSESSMENT)
    .order("completed_at", { ascending: false })
  return (data ?? []).map(toHistoryItem)
}

/**
 * Submit the weekly audit: recompute scores server-side, compare against the
 * previous completed weekly audit and the initial 30-day baseline, then promote
 * the weekly draft to a new completed row (or insert one). Earlier completed
 * weekly rows are never updated.
 */
export async function completeWeeklyAudit(
  rawAnswers: Record<number, number>,
): Promise<{ ok: boolean; id?: string; report?: WeeklyAuditReport; error?: string }> {
  const { supabase, user } = await getSessionUser()
  if (!user) return { ok: false, error: "Sign in to save your 7-day results." }

  const answers = sanitizeAuditAnswers(rawAnswers)
  if (!isCompleteAuditAnswers(answers)) {
    return { ok: false, error: "Please answer all 15 questions before submitting." }
  }

  const { overallScore, results } = scoreAuditAnswers(answers)
  const areas: WeeklyAreaScore[] = results.map((r) => ({ key: r.category, label: r.label, score: r.percentage }))

  const [{ data: previousWeekly }, { data: initialBaseline }] = await Promise.all([
    supabase
      .from("boundary_reports")
      .select(COMPARISON_COLUMNS)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("assessment_type", WEEKLY_ASSESSMENT)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("boundary_reports")
      .select(COMPARISON_COLUMNS)
      .eq("user_id", user.id)
      .eq("is_initial_baseline", true)
      .eq("assessment_type", FULL_ASSESSMENT)
      .maybeSingle(),
  ])

  const now = new Date()
  const completedAt = now.toISOString()
  const periodStart = new Date(now.getTime() - SEVEN_DAYS_MS).toISOString()

  const report: WeeklyAuditReport = {
    kind: "weekly_7_day",
    completedAt,
    periodStart,
    periodEnd: completedAt,
    overall: overallScore,
    areas,
    answers,
    priorityAreas: [],
    comparisons: {
      previousWeekly: compare({ overall: overallScore, areas }, previousWeekly),
      initialBaseline: compare({ overall: overallScore, areas }, initialBaseline),
    },
  }

  const payload = {
    user_id: user.id,
    status: "completed",
    assessment_type: WEEKLY_ASSESSMENT,
    is_initial_baseline: false,
    draft_state: null,
    baseline_scores: areas.map((a) => ({ ...a, isCandidate: a.score <= 60 })),
    baseline_overall: overallScore,
    baseline_date: completedAt,
    priority_focus_areas: [],
    report,
    period_start: periodStart,
    period_end: completedAt,
    completed_at: completedAt,
    updated_at: completedAt,
  }

  const draftId = await findWeeklyDraftId(supabase, user.id)
  const { data: saved, error } = draftId
    ? await supabase
        .from("boundary_reports")
        .update(payload)
        .eq("id", draftId)
        .eq("user_id", user.id)
        .eq("status", "draft")
        .eq("assessment_type", WEEKLY_ASSESSMENT)
        .select("id")
        .single()
    : await supabase.from("boundary_reports").insert(payload).select("id").single()

  if (error || !saved) {
    console.error("[v0] completeWeeklyAudit error:", error?.message)
    return { ok: false, error: "We couldn't save your 7-day results. Please try again." }
  }
  return { ok: true, id: saved.id, report }
}

/** Save 1–3 Priority Focus Areas™ onto one completed weekly record. */
export async function setWeeklyPriorities(
  reportId: string,
  keys: string[],
): Promise<{ ok: boolean; report?: WeeklyAuditReport; error?: string }> {
  const { supabase, user } = await getSessionUser()
  if (!user) return { ok: false, error: "Sign in to save your priorities." }

  const unique = Array.from(new Set(Array.isArray(keys) ? keys : []))
  if (unique.length < 1 || unique.length > MAX_WEEKLY_PRIORITIES || unique.some((k) => !(k in CATEGORY_LABELS))) {
    return { ok: false, error: "Choose one to three Priority Focus Areas™." }
  }

  const { data: row } = await supabase
    .from("boundary_reports")
    .select("id, report")
    .eq("id", reportId)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .eq("assessment_type", WEEKLY_ASSESSMENT)
    .maybeSingle()
  const current = row?.report as WeeklyAuditReport | null
  if (!row || current?.kind !== "weekly_7_day") return { ok: false, error: "We couldn't find that weekly result." }

  const byKey = new Map(current.areas.map((a) => [a.key, a]))
  const priorityAreas = unique.map((k) => byKey.get(k) ?? { key: k, label: CATEGORY_LABELS[k], score: 0 })
  const report: WeeklyAuditReport = { ...current, priorityAreas }

  const { error } = await supabase
    .from("boundary_reports")
    .update({ priority_focus_areas: unique, report, updated_at: new Date().toISOString() })
    .eq("id", reportId)
    .eq("user_id", user.id)
    .eq("assessment_type", WEEKLY_ASSESSMENT)

  if (error) {
    console.error("[v0] setWeeklyPriorities error:", error.message)
    return { ok: false, error: "We couldn't save your priorities. Please try again." }
  }
  return { ok: true, report }
}

/** One completed weekly record, for reopening as results. */
export async function getWeeklyReport(id: string): Promise<{ id: string; report: WeeklyAuditReport } | null> {
  const { supabase, user } = await getSessionUser()
  if (!user) return null
  const { data } = await supabase
    .from("boundary_reports")
    .select("id, report")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .eq("assessment_type", WEEKLY_ASSESSMENT)
    .maybeSingle()
  const report = data?.report as WeeklyAuditReport | null
  return data && report?.kind === "weekly_7_day" ? { id: data.id, report } : null
}

/**
 * Priorities for Decide & Design™: the latest weekly audit with chosen
 * priorities, otherwise the latest full Boundary Report™.
 */
export async function getCurrentPriorityFocus(): Promise<CurrentPriorityFocus | null> {
  const { supabase, user } = await getSessionUser()
  if (!user) return null

  const [{ data: weeklyRows }, { data: fullRow }] = await Promise.all([
    supabase
      .from("boundary_reports")
      .select("id, completed_at, created_at, period_start, period_end, report")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("assessment_type", WEEKLY_ASSESSMENT)
      .order("completed_at", { ascending: false })
      .limit(8),
    supabase
      .from("boundary_reports")
      .select("id, completed_at, created_at, report")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("assessment_type", FULL_ASSESSMENT)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const weekly = (weeklyRows ?? []).find(
    (r) => ((r.report as WeeklyAuditReport | null)?.priorityAreas?.length ?? 0) > 0,
  )
  if (weekly) {
    return {
      source: "weekly_7_day",
      reportId: weekly.id,
      date: weekly.completed_at ?? weekly.created_at,
      periodStart: weekly.period_start,
      periodEnd: weekly.period_end,
      priorityAreas: (weekly.report as WeeklyAuditReport).priorityAreas,
    }
  }

  const full = fullRow?.report as BoundaryReportData | null
  if (fullRow && (full?.priorityAreas?.length ?? 0) > 0) {
    return {
      source: "full_30_day",
      reportId: fullRow.id,
      date: fullRow.completed_at ?? fullRow.created_at,
      periodStart: null,
      periodEnd: null,
      priorityAreas: full!.priorityAreas,
    }
  }
  return null
}
