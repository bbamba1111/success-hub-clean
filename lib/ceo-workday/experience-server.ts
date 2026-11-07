"use server"

/**
 * Workshops & Webinars — series and occurrence server actions.
 * All reads/writes run as the signed-in founder; RLS enforces ownership.
 * Assignments are only *proposed* here. The founder places each one into a
 * CEO Workday™ hour, so nothing is scheduled without their approval.
 */

import { createClient } from "@/lib/supabase/server"
import {
  EXPERIENCE_OPTION_BY_KEY,
  EXPERIENCE_OPTIONS,
  isExperienceOptionKey,
  type ExperienceOptionKey,
} from "./experience-options"
import {
  EXPERIENCE_TEMPLATES,
  addDaysISO,
  isExperienceTemplateKey,
  nextWeekdayOnOrAfter,
  type ExperienceTemplateKey,
} from "./experience-templates"

export interface ExperienceSeries {
  id: string
  templateKey: ExperienceTemplateKey
  name: string
  cadence: "weekly" | "one-off"
  weekday: number | null
  localStartTime: string | null
  durationMinutes: number
  conversionOffer: string | null
  status: "active" | "paused" | "ended"
}

export interface ExperienceOccurrence {
  id: string
  seriesId: string | null
  templateKey: ExperienceTemplateKey
  occurrenceDate: string
  durationMinutes: number
  workdayOverlap: "none" | "approved-exception"
  status: "planned" | "held" | "cancelled"
  registrationUrl: string | null
  registrations: number | null
  attended: number | null
  noShows: number | null
  followUpStatus: "not-started" | "drafted" | "founder-reported-sent" | "verified-sent"
  conversions: number | null
  reviewNotes: string | null
  chosenImprovement: string | null
  dismissedOptionKeys: ExperienceOptionKey[]
}

export interface ProposedAssignment {
  optionKey: ExperienceOptionKey
  proposedDate: string
  minutes: number
  scope: "setup" | "per-occurrence"
  /** True when a plan item already links this option to the occurrence. */
  placed: boolean
}

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return { supabase, userId: data.user?.id ?? null }
}

const SERIES_COLS = "id, template_key, name, cadence, weekday, local_start_time, duration_minutes, conversion_offer, status"
const OCC_COLS =
  "id, series_id, template_key, occurrence_date, duration_minutes, workday_overlap, status, registration_url, registrations, attended, no_shows, follow_up_status, conversions, review_notes, chosen_improvement, dismissed_option_keys"

/* eslint-disable @typescript-eslint/no-explicit-any */
function toSeries(r: any): ExperienceSeries {
  return {
    id: r.id,
    templateKey: r.template_key,
    name: r.name,
    cadence: r.cadence,
    weekday: r.weekday,
    localStartTime: r.local_start_time,
    durationMinutes: r.duration_minutes,
    conversionOffer: r.conversion_offer,
    status: r.status,
  }
}

function toOccurrence(r: any): ExperienceOccurrence {
  return {
    id: r.id,
    seriesId: r.series_id,
    templateKey: r.template_key,
    occurrenceDate: r.occurrence_date,
    durationMinutes: r.duration_minutes,
    workdayOverlap: r.workday_overlap,
    status: r.status,
    registrationUrl: r.registration_url,
    registrations: r.registrations,
    attended: r.attended,
    noShows: r.no_shows,
    followUpStatus: r.follow_up_status,
    conversions: r.conversions,
    reviewNotes: r.review_notes,
    chosenImprovement: r.chosen_improvement,
    dismissedOptionKeys: (r.dismissed_option_keys ?? []).filter(isExperienceOptionKey),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const nonNegInt = (v: unknown) =>
  v === null || v === undefined || v === "" ? null : Number.isInteger(Number(v)) && Number(v) >= 0 ? Number(v) : undefined

export async function listExperienceSeries(): Promise<ExperienceSeries[]> {
  const { supabase, userId } = await requireUser()
  if (!userId) return []
  const { data } = await supabase
    .from("boss_experience_series")
    .select(SERIES_COLS)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
  return (data ?? []).map(toSeries)
}

export async function createExperienceSeries(input: {
  templateKey: string
  name?: string
  weekday?: number | null
  localStartTime?: string | null
  durationMinutes?: number
  conversionOffer?: string | null
}): Promise<ExperienceSeries | null> {
  const { supabase, userId } = await requireUser()
  if (!userId || !isExperienceTemplateKey(input.templateKey)) return null
  const t = EXPERIENCE_TEMPLATES[input.templateKey]
  const duration = input.durationMinutes ?? t.defaultDurationMinutes
  if (duration < t.durationRangeMinutes[0] || duration > t.durationRangeMinutes[1]) return null
  const weekday = input.weekday ?? null
  if (weekday !== null && (!Number.isInteger(weekday) || weekday < 0 || weekday > 6)) return null
  const time = input.localStartTime ?? null
  if (time !== null && !/^\d{2}:\d{2}$/.test(time)) return null

  const { data } = await supabase
    .from("boss_experience_series")
    .insert({
      user_id: userId,
      template_key: t.key,
      name: (input.name?.trim() || t.name).slice(0, 200),
      cadence: t.defaultCadence,
      weekday,
      local_start_time: time,
      duration_minutes: duration,
      // Monday Redesigned™'s destination is fixed; others are founder-named.
      conversion_offer: t.destinationConfigurable ? input.conversionOffer?.trim().slice(0, 300) || null : t.destination,
    })
    .select(SERIES_COLS)
    .single()
  return data ? toSeries(data) : null
}

export async function listOccurrences(seriesId?: string): Promise<ExperienceOccurrence[]> {
  const { supabase, userId } = await requireUser()
  if (!userId) return []
  let q = supabase.from("boss_experience_occurrences").select(OCC_COLS).eq("user_id", userId)
  if (seriesId) q = q.eq("series_id", seriesId)
  const { data } = await q.order("occurrence_date", { ascending: true })
  return (data ?? []).map(toOccurrence)
}

/** Creates the next dated occurrence of a series (or an explicit date). */
export async function createOccurrence(seriesId: string, dateISO?: string): Promise<ExperienceOccurrence | null> {
  const { supabase, userId } = await requireUser()
  if (!userId) return null
  const { data: s } = await supabase
    .from("boss_experience_series")
    .select(SERIES_COLS)
    .eq("id", seriesId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!s) return null
  const series = toSeries(s)
  const today = new Date().toISOString().slice(0, 10)
  const date =
    dateISO && /^\d{4}-\d{2}-\d{2}$/.test(dateISO)
      ? dateISO
      : series.weekday !== null
        ? nextWeekdayOnOrAfter(today, series.weekday)
        : null
  if (!date) return null

  return insertOccurrenceIfMissing(supabase, userId, series, date)
}

type Supabase = Awaited<ReturnType<typeof createClient>>

/**
 * `on conflict (series_id, occurrence_date) do nothing`, then read the row.
 * An existing occurrence is never overwritten, so its results stay intact.
 */
async function insertOccurrenceIfMissing(
  supabase: Supabase,
  userId: string,
  series: ExperienceSeries,
  date: string,
): Promise<ExperienceOccurrence | null> {
  await supabase.from("boss_experience_occurrences").upsert(
    {
      user_id: userId,
      series_id: series.id,
      template_key: series.templateKey,
      occurrence_date: date,
      duration_minutes: series.durationMinutes,
    },
    { onConflict: "series_id,occurrence_date", ignoreDuplicates: true },
  )
  const { data } = await supabase
    .from("boss_experience_occurrences")
    .select(OCC_COLS)
    .eq("user_id", userId)
    .eq("series_id", series.id)
    .eq("occurrence_date", date)
    .maybeSingle()
  return data ? toOccurrence(data) : null
}

export interface UpcomingExperience {
  occurrence: ExperienceOccurrence
  title: string
  /** Proposals still waiting for the founder (not placed, not dismissed). */
  pendingCount: number
}

/**
 * Called when the founder opens weekly or daily planning. Creates the next
 * occurrence of each active weekly series on demand (never months ahead) and
 * returns upcoming planned occurrences. Creates no assignments.
 */
export async function ensureUpcomingOccurrences(todayISO?: string): Promise<UpcomingExperience[]> {
  const { supabase, userId } = await requireUser()
  if (!userId) return []
  const today = todayISO && /^\d{4}-\d{2}-\d{2}$/.test(todayISO) ? todayISO : new Date().toISOString().slice(0, 10)

  const { data: seriesRows } = await supabase
    .from("boss_experience_series")
    .select(SERIES_COLS)
    .eq("user_id", userId)
    .eq("status", "active")
  const series = (seriesRows ?? []).map(toSeries)
  for (const s of series) {
    if (s.cadence === "weekly" && s.weekday !== null) {
      await insertOccurrenceIfMissing(supabase, userId, s, nextWeekdayOnOrAfter(today, s.weekday))
    }
  }

  const { data: occRows } = await supabase
    .from("boss_experience_occurrences")
    .select(OCC_COLS)
    .eq("user_id", userId)
    .eq("status", "planned")
    .gte("occurrence_date", today)
    .order("occurrence_date", { ascending: true })
    .limit(10)
  const nameBySeries = new Map(series.map((s) => [s.id, s.name]))

  const upcoming: UpcomingExperience[] = []
  for (const r of occRows ?? []) {
    const occ = toOccurrence(r)
    const proposals = await proposeOccurrenceAssignments(occ.id)
    upcoming.push({
      occurrence: occ,
      title: (occ.seriesId && nameBySeries.get(occ.seriesId)) || EXPERIENCE_TEMPLATES[occ.templateKey].name,
      pendingCount: proposals.filter((p) => !p.placed).length,
    })
  }
  return upcoming
}

/** For Cherry Blossom™'s brief: the next planned occurrence, read-only. */
export async function getNextScheduledExperience(
  todayISO?: string,
): Promise<{ title: string; occurrenceDate: string } | null> {
  const { supabase, userId } = await requireUser()
  if (!userId) return null
  const today = todayISO && /^\d{4}-\d{2}-\d{2}$/.test(todayISO) ? todayISO : new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from("boss_experience_occurrences")
    .select("occurrence_date, template_key, series_id, boss_experience_series(name)")
    .eq("user_id", userId)
    .eq("status", "planned")
    .gte("occurrence_date", today)
    .order("occurrence_date", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (!data) return null
  const seriesName = (data as { boss_experience_series?: { name?: string } | null }).boss_experience_series?.name
  const templateKey = data.template_key as string
  return {
    title: seriesName || (isExperienceTemplateKey(templateKey) ? EXPERIENCE_TEMPLATES[templateKey].name : "Experience"),
    occurrenceDate: data.occurrence_date as string,
  }
}

/** Four 55-minute work blocks; the 5-minute buffers are never used. */
const WORKDAY_WORK_MINUTES = 4 * 55

export type PlaceResult =
  | { ok: true; itemId: string }
  | {
      ok: false
      reason: "not-signed-in" | "not-proposed" | "already-placed" | "no-plan" | "full" | "error"
      existingItemId?: string
    }

/**
 * Accept and place one proposal into the founder's CEO Workday™ for a date.
 * The founder chooses the date; capacity is checked and nothing is bumped.
 * `saveForLater` stores it as unscheduled work that returns at next planning.
 */
export async function acceptProposedAssignment(
  occurrenceId: string,
  optionKey: string,
  planDate: string,
  opts: { saveForLater?: boolean } = {},
): Promise<PlaceResult> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false, reason: "not-signed-in" }
  if (!isExperienceOptionKey(optionKey) || !/^\d{4}-\d{2}-\d{2}$/.test(planDate)) {
    return { ok: false, reason: "not-proposed" }
  }

  const proposals = await proposeOccurrenceAssignments(occurrenceId)
  const proposal = proposals.find((p) => p.optionKey === optionKey)
  if (!proposal) return { ok: false, reason: "not-proposed" }
  if (proposal.placed) return { ok: false, reason: "already-placed" }

  const { data: plan } = await supabase
    .from("ceo_workday_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("plan_date", planDate)
    .maybeSingle()
  if (!plan) return { ok: false, reason: "no-plan" }

  const { data: items } = await supabase
    .from("ceo_workday_plan_items")
    .select("estimated_minutes, status, next_action")
    .eq("plan_id", plan.id)
    .eq("user_id", userId)

  if (!opts.saveForLater) {
    const scheduled = (items ?? [])
      .filter((i) => !["saved-for-later", "delegated", "eliminated"].includes(i.status as string))
      .reduce((sum, i) => sum + (i.estimated_minutes ?? 0), 0)

    // An event inside workday hours with an approved exception fills those hours.
    const { data: occ } = await supabase
      .from("boss_experience_occurrences")
      .select("occurrence_date, duration_minutes, workday_overlap")
      .eq("id", occurrenceId)
      .eq("user_id", userId)
      .maybeSingle()
    const blockedByEvent =
      occ && occ.occurrence_date === planDate && occ.workday_overlap === "approved-exception"
        ? Math.ceil((occ.duration_minutes ?? 60) / 60) * 55
        : 0

    if (scheduled + proposal.minutes > WORKDAY_WORK_MINUTES - blockedByEvent) return { ok: false, reason: "full" }
  }

  const option = EXPERIENCE_OPTION_BY_KEY[optionKey]
  const { data, error } = await supabase
    .from("ceo_workday_plan_items")
    .insert({
      plan_id: plan.id,
      user_id: userId,
      position: items?.length ?? 0,
      title: option.work,
      purpose: option.outcome,
      expected_evidence: option.outcome,
      treatment: "build-change",
      business_function: "trust-experiences",
      role: "founder-added",
      estimated_minutes: option.minutes,
      ceo_work_category: option.category,
      founder_decision: opts.saveForLater ? "save-for-later" : "added",
      next_action: opts.saveForLater ? "save-for-later" : null,
      status: opts.saveForLater ? "saved-for-later" : "planned",
      assignment_key: `${occurrenceId}:${optionKey}`,
      experience_occurrence_id: occurrenceId,
    })
    .select("id")
    .single()
  // The partial unique index (user_id, experience_occurrence_id, assignment_key)
  // atomically rejects a concurrent second accept; hand back the existing row.
  if (error?.code === "23505") {
    const { data: existing } = await supabase
      .from("ceo_workday_plan_items")
      .select("id")
      .eq("user_id", userId)
      .eq("experience_occurrence_id", occurrenceId)
      .eq("assignment_key", `${occurrenceId}:${optionKey}`)
      .maybeSingle()
    return { ok: false, reason: "already-placed", existingItemId: existing?.id }
  }
  if (error || !data) return { ok: false, reason: "error" }
  return { ok: true, itemId: data.id }
}

/** Founder-entered results. "Verified" follow-up can't be set from here. */
export async function updateOccurrenceResults(
  occurrenceId: string,
  input: {
    status?: "planned" | "held" | "cancelled"
    registrationUrl?: string | null
    registrations?: number | null
    attended?: number | null
    noShows?: number | null
    conversions?: number | null
    followUpStatus?: "not-started" | "drafted" | "founder-reported-sent"
    reviewNotes?: string | null
    chosenImprovement?: string | null
    workdayOverlap?: "none" | "approved-exception"
  },
): Promise<boolean> {
  const { supabase, userId } = await requireUser()
  if (!userId) return false
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  for (const [field, col] of [
    ["registrations", "registrations"],
    ["attended", "attended"],
    ["noShows", "no_shows"],
    ["conversions", "conversions"],
  ] as const) {
    if (field in input) {
      const v = nonNegInt(input[field])
      if (v === undefined) return false
      patch[col] = v
    }
  }
  if (input.status && ["planned", "held", "cancelled"].includes(input.status)) patch.status = input.status
  if (input.followUpStatus && ["not-started", "drafted", "founder-reported-sent"].includes(input.followUpStatus)) {
    patch.follow_up_status = input.followUpStatus
  }
  if (input.workdayOverlap && ["none", "approved-exception"].includes(input.workdayOverlap)) {
    patch.workday_overlap = input.workdayOverlap
  }
  if ("registrationUrl" in input) {
    const url = input.registrationUrl?.trim() || null
    if (url && !/^https:\/\//i.test(url)) return false
    patch.registration_url = url?.slice(0, 500) ?? null
  }
  if ("reviewNotes" in input) patch.review_notes = input.reviewNotes?.trim().slice(0, 4000) || null
  if ("chosenImprovement" in input) patch.chosen_improvement = input.chosenImprovement?.trim().slice(0, 1000) || null

  const { error } = await supabase
    .from("boss_experience_occurrences")
    .update(patch)
    .eq("id", occurrenceId)
    .eq("user_id", userId)
  return !error
}

/** "Not this time" — hides one proposed option for this occurrence only. */
export async function dismissOccurrenceOption(occurrenceId: string, optionKey: string): Promise<boolean> {
  const { supabase, userId } = await requireUser()
  if (!userId || !isExperienceOptionKey(optionKey)) return false
  const { data } = await supabase
    .from("boss_experience_occurrences")
    .select("dismissed_option_keys")
    .eq("id", occurrenceId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!data) return false
  const next = Array.from(new Set([...(data.dismissed_option_keys ?? []), optionKey]))
  const { error } = await supabase
    .from("boss_experience_occurrences")
    .update({ dismissed_option_keys: next, updated_at: new Date().toISOString() })
    .eq("id", occurrenceId)
    .eq("user_id", userId)
  return !error
}

/**
 * Proposed work for one occurrence. Setup work is proposed only for the
 * series' first occurrence; dismissed options are left out.
 */
export async function proposeOccurrenceAssignments(occurrenceId: string): Promise<ProposedAssignment[]> {
  const { supabase, userId } = await requireUser()
  if (!userId) return []
  const { data: o } = await supabase
    .from("boss_experience_occurrences")
    .select(OCC_COLS)
    .eq("id", occurrenceId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!o) return []
  const occ = toOccurrence(o)
  const template = EXPERIENCE_TEMPLATES[occ.templateKey]

  let isFirst = true
  if (occ.seriesId) {
    const { count } = await supabase
      .from("boss_experience_occurrences")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("series_id", occ.seriesId)
      .lt("occurrence_date", occ.occurrenceDate)
    isFirst = (count ?? 0) === 0
  }

  const { data: linked } = await supabase
    .from("ceo_workday_plan_items")
    .select("assignment_key")
    .eq("user_id", userId)
    .eq("experience_occurrence_id", occ.id)
  const placedKeys = new Set((linked ?? []).map((r) => String(r.assignment_key ?? "")))

  return EXPERIENCE_OPTIONS.filter((opt) => (opt.scope === "setup" ? isFirst : true))
    .filter((opt) => !occ.dismissedOptionKeys.includes(opt.key))
    .map((opt) => {
      const offset =
        (opt.scope === "setup" ? template.setupOffsets[opt.key] : template.occurrenceOffsets[opt.key]) ?? 0
      return {
        optionKey: opt.key,
        proposedDate: addDaysISO(occ.occurrenceDate, offset),
        minutes: EXPERIENCE_OPTION_BY_KEY[opt.key].minutes,
        scope: opt.scope,
        placed: placedKeys.has(`${occ.id}:${opt.key}`),
      }
    })
}
