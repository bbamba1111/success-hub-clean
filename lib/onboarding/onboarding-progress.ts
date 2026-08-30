import { createClient } from "@/lib/supabase/server"

/**
 * Onboarding Progress™ — server-side snapshot of the three required
 * on-ramp steps (Founder Profile™ → Business Context™ → EGA Screen 1).
 * ---------------------------------------------------------------------------
 * Reads directly from Supabase (the account's canonical source of truth —
 * see utils/founder-profile-storage.ts, utils/business-context-storage.ts,
 * lib/ega/ega-storage.ts) so a member landing on any onboarding page sees an
 * accurate "here's what's done, here's what's outstanding" confirmation
 * regardless of what their local browser cache does or doesn't have.
 *
 * This intentionally duplicates the completion checks in
 * utils/reality-check-storage.ts's getPostLoginDestination() rather than
 * importing it, because that function is client-only (it also reads
 * localStorage) while this one must run on the server.
 */
export interface OnboardingProgress {
  founderProfileComplete: boolean
  businessContextComplete: boolean
  egaComplete: boolean
}

const EMPTY_PROGRESS: OnboardingProgress = {
  founderProfileComplete: false,
  businessContextComplete: false,
  egaComplete: false,
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

    const [{ data: founderProfile }, { data: businessContext }, { data: egaEntry }] = await Promise.all([
      supabase.from("founder_profiles").select("completed_at").eq("user_id", user.id).maybeSingle(),
      supabase.from("business_context_profiles").select("completed_at").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("ega_entries")
        .select("id")
        .eq("user_id", user.id)
        .eq("source", "direct_ega")
        .limit(1)
        .maybeSingle(),
    ])

    return {
      founderProfileComplete: Boolean(founderProfile?.completed_at),
      businessContextComplete: Boolean(businessContext?.completed_at),
      egaComplete: Boolean(egaEntry),
    }
  } catch (error) {
    console.log("[v0] getOnboardingProgressServer skipped:", (error as Error)?.message)
    return EMPTY_PROGRESS
  }
}
