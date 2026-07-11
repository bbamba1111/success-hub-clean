import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { SundayRitual } from "@/components/sunday-design-day/sunday-ritual"
import { OperatingEngineProvider } from "@/components/operating-engine-provider"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"

export const metadata: Metadata = {
  title: "Sunday Design Day™ | Make Time For More™",
  description:
    "Design Tomorrow. Live It Tomorrow.™ Move through one calm weekly ritual — Reality Check, Download & Delegate, Design Tomorrow, and Commit & Prepare — one page at a time.",
}

/**
 * /begin — Sunday Design Day™ entry point (Phase 6.1).
 *
 * Server Component: fetches the founder's personal installation cycle from
 * Supabase and passes it down to the client ritual shell. No DB call happens
 * on the client — Cherry Blossom already knows where the founder is.
 *
 * Wraps the ritual in OperatingEngineProvider + HarmonyProvider so the
 * InstallBriefScreen can call assembleOperatingBrief() from live Harmony
 * Context™ without any duplication of the FI engine.
 */
export default async function BeginPage() {
  // Get the authenticated session — safe to call in Server Components.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Derive the cycle context for this founder. Falls back to "first-sunday"
  // if the user is not logged in or has never completed a Sunday.
  const cycleContext = user ? await getCycleContext(user.id) : undefined

  return (
    <OperatingEngineProvider>
      <HarmonyProvider>
        <SundayRitual cycleContext={cycleContext} userId={user?.id} />
      </HarmonyProvider>
    </OperatingEngineProvider>
  )
}
