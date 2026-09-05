import { createClient } from "@/lib/supabase/client"
import type { AssessmentType } from "@/lib/assessment-cadence"

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
  /** Assessment cadence metadata — persisted so Cherry Blossom™ and Founder GPS™ can read it. */
  assessmentType?: AssessmentType
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
        assessment_type: snapshot.assessmentType ?? "baseline_30_day",
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

/**
 * Loads every weekly Reality Check™ record the member has (newest first).
 * Used by the Work-Life Harmony Blueprint™ calendar to show "Week of…" cards
 * for the whole month at a glance and to build the Archive once a week rolls
 * out of the current calendar month. Returns [] for anonymous sessions.
 */
export async function getRealityChecksHistory(): Promise<RealityCheckRecord[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("reality_checks")
      .select(
        "week_key, overall_score, life_value_scores, selected_priority_areas, operating_declaration, weekly_reflection, scored_at, completed_at",
      )
      .eq("user_id", userId)
      .order("week_key", { ascending: false })

    return (data as RealityCheckRecord[]) ?? []
  } catch (error) {
    console.log("[v0] getRealityChecksHistory skipped:", (error as Error)?.message)
    return []
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
 * Decides where a member lands right after login. Checks required onboarding
 * gates in order before falling back to the recurring measurement/daily logic.
 *
 * Production on-ramp (every real member must complete ALL steps — there is
 * no skip path):
 *   1. Founder Profile™ NOT completed → Cherry Blossom Welcome™ (first time)
 *      or straight to /founder-profile (if Welcome was already seen but the
 *      member left before finishing).
 *   2. Business Context™ NOT completed → /business-context.
 *   3. Business Bottleneck Assessment™ baseline NOT completed →
 *      /entrepreneur-success-assessment?onboarding=1. This is the ONE-TIME
 *      15-area baseline, not a recurring assessment — see
 *      lib/business-bottleneck-audit/bba-storage.ts.
 *   4. All three complete but the Cherry Blossom Thank-You™ transition hasn't
 *      been shown yet → /welcome/cherry-blossom/complete.
 *   5. On-ramp fully complete → fall back to the recurring measurement/daily
 *      logic: this week's Weekly Reality Check™ NOT done → /begin; otherwise
 *      → "/", the daily Work-Life Balance Business Day™ front door.
 *
 * IMPORTANT — localStorage is a fast cache, NOT the source of truth. Founder
 * Profile™, Business Context™, and the EGA onboarding signal all persist to
 * Supabase (founder_profiles, business_context_profiles, ega_entries). A
 * fresh sign-in session, a cleared cache, a different device/browser, or a
 * new preview origin all start with an empty localStorage even though the
 * database already has the completed record. So each gate below checks the
 * local flag first (instant, no network) and — only if that says
 * "incomplete" — confirms against the database before concluding the step
 * really is outstanding. This prevents already-completed members from being
 * routed back through onboarding from scratch.
 *
 * IMPORTANT — SSR: the on-ramp gates above live in localStorage/Supabase
 * client calls, which do not exist on the server. Rather than let that
 * silently resolve to "every gate incomplete" (which would send every
 * /monday-style server component visitor to Cherry Blossom Welcome™
 * regardless of their real state), this function explicitly skips those
 * gates when `window` is undefined and falls straight to the
 * Supabase-backed daily logic — exactly the prior behavior for the Business
 * Context™ gate. Server callers must layer the skipped gates back in on the
 * client (see components/monday/monday-cta-link.tsx for the established
 * pattern) before trusting this as a final destination.
 */
export async function getPostLoginDestination(): Promise<string> {
  if (typeof window !== "undefined") {
    try {
      const { hasCompletedFounderProfile } = await import("@/lib/founder-profile/founder-profile-store")
      const { hasCompletedBusinessContext } = await import("@/lib/business-context/business-context-store")
      const { hasCompletedBbaBaseline } = await import("@/lib/business-bottleneck-audit/bba-storage")
      const {
        hasSeenCherryBlossomWelcome,
        hasSeenCherryBlossomThankYou,
      } = await import("@/lib/onboarding/onboarding-welcome-store")
      const { hasCompletedFounderProfileInDb } = await import("@/utils/founder-profile-storage")
      const { hasCompletedBusinessContextInDb } = await import("@/utils/business-context-storage")

      const founderProfileDone = hasCompletedFounderProfile() || (await hasCompletedFounderProfileInDb())
      if (!founderProfileDone) {
        return hasSeenCherryBlossomWelcome() ? "/founder-profile" : "/welcome/cherry-blossom"
      }

      const businessContextDone = hasCompletedBusinessContext() || (await hasCompletedBusinessContextInDb())
      if (!businessContextDone) {
        return "/business-context"
      }

      const bbaDone = await hasCompletedBbaBaseline()
      if (!bbaDone) {
        return "/entrepreneur-success-assessment?onboarding=1"
      }

      if (!hasSeenCherryBlossomThankYou()) {
        return "/welcome/cherry-blossom/complete"
      }
    } catch {
      // Unexpected localStorage/DB failure on the client — fall through to
      // reality-check logic rather than hard-failing at the front door.
    }
  }

  const done = await hasCompletedThisWeeksRealityCheck()
  return done ? "/" : "/begin"
}
