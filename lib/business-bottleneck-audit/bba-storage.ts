/**
 * Business Bottleneck Audit™ (BBA™) — Client Storage Layer
 * ---------------------------------------------------------------------------
 * Unlike the original ESA (localStorage-first, Supabase mirror), BBA™ is
 * Supabase-first from the start per the approved architecture: Supabase is
 * the source of truth for the founder's baseline and every weekly check-in.
 * A small amount of local state is used only for in-progress DRAFT UX (so a
 * refresh mid-wizard doesn't lose answers) — it is never treated as the
 * record of truth and is cleared once a save succeeds.
 */

import type { BbaBaselineRecord, BbaBaselineResponses, BbaWeeklyCheckinRecord } from "./types"

const DRAFT_BASELINE_KEY = "bbaBaselineDraft"
const DRAFT_WEEKLY_KEY = "bbaWeeklyDraft"

/** Returns the Monday (start) of the given week as YYYY-MM-DD — matches esa-storage.ts / reality-check-storage.ts so records line up across Life + Business + BBA. */
export function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

async function getUserId(): Promise<string | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

/* ===========================================================================
 * Draft UX helpers — local state only, never the source of truth.
 * ======================================================================== */

export function saveBaselineDraft(responses: BbaBaselineResponses, otherText: Record<string, string>): void {
  try {
    localStorage.setItem(DRAFT_BASELINE_KEY, JSON.stringify({ responses, otherText }))
  } catch (error) {
    console.log("[v0] saveBaselineDraft skipped:", (error as Error)?.message)
  }
}

export function getBaselineDraft(): { responses: BbaBaselineResponses; otherText: Record<string, string> } | null {
  try {
    const raw = localStorage.getItem(DRAFT_BASELINE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearBaselineDraft(): void {
  try {
    localStorage.removeItem(DRAFT_BASELINE_KEY)
  } catch {
    // no-op
  }
}

export function saveWeeklyDraft(record: Partial<BbaWeeklyCheckinRecord>): void {
  try {
    localStorage.setItem(DRAFT_WEEKLY_KEY, JSON.stringify(record))
  } catch (error) {
    console.log("[v0] saveWeeklyDraft skipped:", (error as Error)?.message)
  }
}

export function getWeeklyDraft(): Partial<BbaWeeklyCheckinRecord> | null {
  try {
    const raw = localStorage.getItem(DRAFT_WEEKLY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearWeeklyDraft(): void {
  try {
    localStorage.removeItem(DRAFT_WEEKLY_KEY)
  } catch {
    // no-op
  }
}

/* ===========================================================================
 * Baseline — persisted to bba_baseline_assessments. Never overwritten: a new
 * baseline save inserts a new row and flips is_current, preserving history.
 * ======================================================================== */

export async function saveBbaBaseline(
  responses: BbaBaselineResponses,
  otherText: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, error: "not-signed-in" }
  }

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    // Prior baselines are preserved as history — only the is_current flag moves.
    await supabase.from("bba_baseline_assessments").update({ is_current: false }).eq("user_id", userId).eq("is_current", true)

    const { data: latest } = await supabase
      .from("bba_baseline_assessments")
      .select("version")
      .eq("user_id", userId)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle()

    const nextVersion = (latest?.version ?? 0) + 1

    const { error } = await supabase.from("bba_baseline_assessments").insert({
      user_id: userId,
      version: nextVersion,
      responses,
      other_text: otherText,
      is_current: true,
      completed_at: new Date().toISOString(),
    })

    if (error) {
      console.log("[v0] saveBbaBaseline insert error:", error.message)
      return { success: false, error: error.message }
    }

    clearBaselineDraft()
    return { success: true }
  } catch (error) {
    console.log("[v0] saveBbaBaseline skipped:", (error as Error)?.message)
    return { success: false, error: (error as Error)?.message }
  }
}

export async function getCurrentBbaBaseline(): Promise<BbaBaselineRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { data } = await supabase
      .from("bba_baseline_assessments")
      .select("version, responses, other_text, completed_at")
      .eq("user_id", userId)
      .eq("is_current", true)
      .maybeSingle()

    if (!data) return null

    return {
      version: data.version,
      responses: (data.responses ?? {}) as BbaBaselineResponses,
      otherText: (data.other_text ?? {}) as Record<string, string>,
      completedAt: data.completed_at,
    }
  } catch (error) {
    console.log("[v0] getCurrentBbaBaseline skipped:", (error as Error)?.message)
    return null
  }
}

export async function hasCompletedBbaBaseline(): Promise<boolean> {
  const record = await getCurrentBbaBaseline()
  return record !== null
}

/* ===========================================================================
 * Weekly check-in — persisted to bba_weekly_checkins, one row per user per
 * ISO week (unique on user_id + week_key), upserted so mid-week edits update
 * the same row while every past week remains queryable history.
 * ======================================================================== */

export async function saveBbaWeeklyCheckin(
  record: Omit<BbaWeeklyCheckinRecord, "weekKey" | "completedAt">,
): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, error: "not-signed-in" }
  }

  const weekKey = getWeekKey()

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    const { error } = await supabase.from("bba_weekly_checkins").upsert(
      {
        user_id: userId,
        week_key: weekKey,
        life_improvement: record.lifeImprovement,
        business_improvement: record.businessImprovement,
        bottlenecks_cleared_count: record.bottlenecksClearedCount,
        business_assets: record.businessAssets,
        assignment_status: record.assignmentStatus,
        assignment_problems: record.assignmentProblems,
        stakeholder_deadlines: record.stakeholderDeadlines,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,week_key" },
    )

    if (error) {
      console.log("[v0] saveBbaWeeklyCheckin upsert error:", error.message)
      return { success: false, error: error.message }
    }

    clearWeeklyDraft()
    return { success: true }
  } catch (error) {
    console.log("[v0] saveBbaWeeklyCheckin skipped:", (error as Error)?.message)
    return { success: false, error: (error as Error)?.message }
  }
}

export async function getBbaWeeklyCheckin(weekKey = getWeekKey()): Promise<BbaWeeklyCheckinRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { data } = await supabase
      .from("bba_weekly_checkins")
      .select(
        "week_key, life_improvement, business_improvement, bottlenecks_cleared_count, business_assets, assignment_status, assignment_problems, stakeholder_deadlines, completed_at",
      )
      .eq("user_id", userId)
      .eq("week_key", weekKey)
      .maybeSingle()

    if (!data) return null

    return {
      weekKey: data.week_key,
      lifeImprovement: data.life_improvement ?? { selectedIds: [] },
      businessImprovement: data.business_improvement ?? { selectedIds: [] },
      bottlenecksClearedCount: data.bottlenecks_cleared_count,
      businessAssets: data.business_assets ?? [],
      assignmentStatus: data.assignment_status,
      assignmentProblems: data.assignment_problems ?? { selectedIds: [] },
      stakeholderDeadlines: data.stakeholder_deadlines ?? [],
      completedAt: data.completed_at,
    }
  } catch (error) {
    console.log("[v0] getBbaWeeklyCheckin skipped:", (error as Error)?.message)
    return null
  }
}

export async function hasCompletedThisWeeksBbaCheckin(): Promise<boolean> {
  const record = await getBbaWeeklyCheckin()
  return Boolean(record?.completedAt)
}

/* ===========================================================================
 * Reality Check adapter — /reality-check previously read a 0-100
 * "Business Score" straight off the old ESA's Likert scoring engine
 * (esa-storage.ts's getEsaResults). BBA™ has no comparable Likert score, so
 * this derives a lightweight, honest proxy directly from real submitted
 * weekly data (never invented data) so that page keeps working without a
 * redesign: meaningful business-improvement signals + bottlenecks cleared
 * raise the score; an incomplete/blocked Business Building Assignment is
 * surfaced as a "Focus This Week™" area.
 * ======================================================================== */

export interface BbaRealityCheckSnapshot {
  overallScore: number
  pillarScores: { pillarName: string; percentage: number }[]
}

const NON_SIGNAL_BUSINESS_IMPROVEMENT_IDS = new Set(["no-meaningful-improvement", "other"])

export async function getBbaRealityCheckSnapshot(): Promise<BbaRealityCheckSnapshot | null> {
  const record = await getBbaWeeklyCheckin()
  if (!record || !record.completedAt) return null

  const meaningfulImprovements = record.businessImprovement.selectedIds.filter(
    (id) => !NON_SIGNAL_BUSINESS_IMPROVEMENT_IDS.has(id),
  ).length
  const bottlenecksCleared = record.bottlenecksClearedCount ?? 0

  const overallScore = Math.max(0, Math.min(100, meaningfulImprovements * 15 + bottlenecksCleared * 10))

  const pillarScores: { pillarName: string; percentage: number }[] = [
    {
      pillarName: "Bottleneck Clearance",
      percentage: Math.max(0, Math.min(100, bottlenecksCleared * 25)),
    },
  ]

  if (record.assignmentStatus === "not-started" || record.assignmentStatus === "started-not-completed") {
    pillarScores.push({ pillarName: "Business Building Assignment", percentage: 25 })
  }

  return { overallScore, pillarScores }
}
