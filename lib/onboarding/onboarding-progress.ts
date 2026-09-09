import { createClient } from "@/lib/supabase/server"
import { hasCompletedTimeLeakCheckServer } from "@/lib/wlb-time-leak/server"

/**
 * Onboarding Progress™ — server-side snapshot of the three required
 * on-ramp steps (Founder Profile™ → Business Context™ → Work-Life Balance
 * Time-Leak Check™).
 * ---------------------------------------------------------------------------
 * Reads directly from Supabase (the account's canonical source of truth —
 * see utils/founder-profile-storage.ts, utils/business-context-storage.ts,
 * lib/wlb-time-leak/storage.ts) so a member landing on any onboarding page
 * sees an accurate "here's what's done, here's what's outstanding"
 * confirmation regardless of what their local browser cache does or doesn't
 * have.
 *
 * The Business Bottleneck Audit™ was previously Step 3 here; it is preserved
 * intact at /entrepreneur-success-assessment but no longer part of the
 * onboarding on-ramp. Step 3 is now the Time-Leak Check™.
 */
export interface OnboardingProgress {
  founderProfileComplete: boolean
  businessContextComplete: boolean
  timeLeakComplete: boolean
}

const EMPTY_PROGRESS: OnboardingProgress = {
  founderProfileComplete: false,
  businessContextComplete: false,
  timeLeakComplete: false,
}

/**
 * Loads the signed-in member's onboarding progress from the database. Safe
 * to call from any Server Component. Returns all-false for anonymous
 * sessions or on unexpected failure rather than throwing.
 */
export async function getOnboardingProgressServer(): Promise<OnboardingProgress> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return EMPTY_PROGRESS

    const [{ data: founderProfile }, { data: businessContext }, timeLeakComplete] = await Promise.all([
      supabase.from("founder_profiles").select("completed_at").eq("user_id", user.id).maybeSingle(),
      supabase.from("business_context_profiles").select("completed_at").eq("user_id", user.id).maybeSingle(),
      hasCompletedTimeLeakCheckServer(user.id),
    ])

    return {
      founderProfileComplete: Boolean(founderProfile?.completed_at),
      businessContextComplete: Boolean(businessContext?.completed_at),
      timeLeakComplete,
    }
  } catch (error) {
    console.log("[v0] getOnboardingProgressServer skipped:", (error as Error)?.message)
    return EMPTY_PROGRESS
  }
}
