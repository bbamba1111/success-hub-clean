import { createClient } from "@/lib/supabase/client"

/**
 * Reality Check persistence layer (Phase 1 memory layer).
 *
 * Guiding principle: the Reality Check is a *weekly snapshot* of the member's
 * current state. There is ONE living record per member per week, keyed by
 * (user_id, week_key). It is created when the audit is scored and then
 * progressively enriched as the member selects priority areas, saves their
 * Weekly Operating Declaration, and completes their Weekly Reflection.
 *
 * localStorage remains the source of truth for instant UX. These functions
 * mirror the completed data to Supabase so Cherry Blossom can remember it.
 * All writes are best-effort: if the member is not signed in (e.g. the public
 * preview) nothing is written and the app continues normally.
 */

/** Returns the Monday (start) of the given week as YYYY-MM-DD. Mirrors WeeklyRealityCheck.getWeekKey. */
export function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday, 1 = Monday, ...
  const diff = (day + 6) % 7 // days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

interface AuditResultRow {
  category: string
  percentage: number
  label: string
}

interface AuditSnapshot {
  overallScore: number
  results: AuditResultRow[]
}

/** Shape of the progressive weekly enrichment fields. */
interface WeeklyEnrichment {
  selectedPriorityAreas?: string[]
  operatingDeclaration?: string
  weeklyReflection?: string
  evidenceOfTransformation?: string
  testimonialPermission?: boolean
}

/**
 * Resolves the current signed-in user id, or null if anonymous.
 * Never throws — callers treat null as "skip persistence".
 */
async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

/**
 * Creates (or refreshes) this week's Reality Check record with the scored
 * audit snapshot. Called when the Work-Life Balance Audit is scored and the
 * Results Dashboard is generated. This is the official weekly snapshot.
 */
export async function saveRealityCheckSnapshot(snapshot: AuditSnapshot): Promise<void> {
  const userId = await getUserId()
  if (!userId) return // anonymous — localStorage still holds the data

  try {
    const supabase = createClient()
    const now = new Date().toISOString()
    const weekKey = getWeekKey()

    // Upsert on (user_id, week_key) so we never create a second row for the week.
    await supabase.from("reality_checks").upsert(
      {
        user_id: userId,
        week_key: weekKey,
        overall_score: snapshot.overallScore,
        life_value_scores: snapshot.results,
        scored_at: now,
        completed_at: now,
        updated_at: now,
      },
      { onConflict: "user_id,week_key" },
    )
  } catch (error) {
    console.log("[v0] saveRealityCheckSnapshot skipped:", (error as Error)?.message)
  }
}

/**
 * Progressively enriches THIS week's existing Reality Check record. Used after
 * the member selects Priority Focus Areas, saves their Operating Declaration,
 * or completes their Weekly Reflection. Never creates a duplicate weekly row.
 */
export async function updateRealityCheck(enrichment: WeeklyEnrichment): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (enrichment.selectedPriorityAreas !== undefined) patch.selected_priority_areas = enrichment.selectedPriorityAreas
  if (enrichment.operatingDeclaration !== undefined) patch.operating_declaration = enrichment.operatingDeclaration
  if (enrichment.weeklyReflection !== undefined) patch.weekly_reflection = enrichment.weeklyReflection
  if (enrichment.evidenceOfTransformation !== undefined)
    patch.evidence_of_transformation = enrichment.evidenceOfTransformation
  if (enrichment.testimonialPermission !== undefined) patch.testimonial_permission = enrichment.testimonialPermission

  try {
    const supabase = createClient()
    const weekKey = getWeekKey()

    // Ensure the weekly row exists (member may enrich before a fresh snapshot
    // in edge cases), then apply the enrichment to that single row.
    await supabase
      .from("reality_checks")
      .upsert(
        { user_id: userId, week_key: weekKey, ...patch },
        { onConflict: "user_id,week_key" },
      )
  } catch (error) {
    console.log("[v0] updateRealityCheck skipped:", (error as Error)?.message)
  }
}

interface RealityCheckRecord {
  week_key: string
  overall_score: number | null
  life_value_scores: AuditResultRow[] | null
  selected_priority_areas: string[] | null
  operating_declaration: string | null
  weekly_reflection: string | null
  scored_at: string | null
  completed_at: string
}

/**
 * Loads the member's most recent Reality Check record (this week if present,
 * otherwise the latest prior week). Used by Cherry Blossom to open already
 * knowing the member's current state — no copy/paste required.
 */
export async function getLatestRealityCheck(): Promise<RealityCheckRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("reality_checks")
      .select(
        "week_key, overall_score, life_value_scores, selected_priority_areas, operating_declaration, weekly_reflection, scored_at, completed_at",
      )
      .eq("user_id", userId)
      .order("week_key", { ascending: false })
      .limit(1)
      .maybeSingle()

    return (data as RealityCheckRecord) ?? null
  } catch (error) {
    console.log("[v0] getLatestRealityCheck skipped:", (error as Error)?.message)
    return null
  }
}

/** True if THIS week's Reality Check has been scored (the snapshot exists). */
export async function hasCompletedThisWeeksRealityCheck(): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("reality_checks")
      .select("scored_at, overall_score")
      .eq("user_id", userId)
      .eq("week_key", getWeekKey())
      .maybeSingle()

    // "Completed" = the audit was scored for the current week.
    return Boolean(data && (data.scored_at || data.overall_score !== null))
  } catch (error) {
    console.log("[v0] hasCompletedThisWeeksRealityCheck skipped:", (error as Error)?.message)
    return false
  }
}

export interface OperatingCenterData {
  memberName: string | null
  current: RealityCheckRecord | null
  previous: RealityCheckRecord | null
  /** current.overall_score - previous.overall_score, or null if not comparable. */
  scoreDelta: number | null
  /** True if the current record belongs to this calendar week. */
  currentIsThisWeek: boolean
}

/**
 * Loads everything the Weekly Operating Center™ dashboard needs in one call:
 * the member's name, this week's Reality Check (or latest), the prior week for
 * trend comparison, and the computed score delta. Returns safe empties for
 * anonymous sessions so the page can still render a friendly empty state.
 */
export async function getOperatingCenterData(): Promise<OperatingCenterData> {
  const empty: OperatingCenterData = {
    memberName: null,
    current: null,
    previous: null,
    scoreDelta: null,
    currentIsThisWeek: false,
  }

  const userId = await getUserId()
  if (!userId) return empty

  try {
    const supabase = createClient()

    const [{ data: profile }, { data: rows }] = await Promise.all([
      supabase.from("user_profiles").select("name").eq("id", userId).maybeSingle(),
      supabase
        .from("reality_checks")
        .select(
          "week_key, overall_score, life_value_scores, selected_priority_areas, operating_declaration, weekly_reflection, scored_at, completed_at",
        )
        .eq("user_id", userId)
        .order("week_key", { ascending: false })
        .limit(2),
    ])

    const current = (rows?.[0] as RealityCheckRecord) ?? null
    const previous = (rows?.[1] as RealityCheckRecord) ?? null

    const scoreDelta =
      current?.overall_score != null && previous?.overall_score != null
        ? current.overall_score - previous.overall_score
        : null

    return {
      memberName: (profile?.name as string) ?? null,
      current,
      previous,
      scoreDelta,
      currentIsThisWeek: current?.week_key === getWeekKey(),
    }
  } catch (error) {
    console.log("[v0] getOperatingCenterData skipped:", (error as Error)?.message)
    return empty
  }
}

/**
 * Decides where a member lands right after login, per the new 4-section IA:
 *   - If this week's Weekly Reality Check™ is NOT done → send to the Welcome
 *     ritual page (/begin), which introduces the week and leads into the check.
 *     (First-time members always fall here until onboarding is complete.)
 *   - If it IS done → send straight to Live Today™ (/live-today), the new daily
 *     front door for returning members.
 * Falls back to /begin on any uncertainty (the ritual is always safe to re-enter).
 */
export async function getPostLoginDestination(): Promise<string> {
  const done = await hasCompletedThisWeeksRealityCheck()
  return done ? "/live-today" : "/begin"
}
