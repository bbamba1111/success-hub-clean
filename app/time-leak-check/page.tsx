import { createClient } from "@/lib/supabase/server"
import { hasCompletedTimeLeakCheckServer } from "@/lib/wlb-time-leak/server"
import { TimeLeakPageClient } from "@/components/wlb-time-leak/time-leak-page-client"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Work-Life Balance Time-Leak Check™ | Harmony Lane™",
  description:
    "What's really causing work to take more of your life than you intended? Identify the conditions, habits, and missing structures causing work to expand beyond the boundaries you want.",
}

/**
 * Work-Life Balance Time-Leak Check™ — the onboarding diagnostic that now
 * occupies Step 3 of the Harmony Lane™ on-ramp (Founder Profile™ → Business
 * Context™ → Time-Leak Check™ → Ready for Monday). The Business Bottleneck
 * Audit stays fully intact at /entrepreneur-success-assessment; it is simply
 * no longer part of onboarding.
 */
export default async function TimeLeakCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Step 3 of onboarding is now the Reality Check™; keep old ?onboarding=1 links working.
  if ((await searchParams).onboarding === "1") redirect("/boundary-report?onboarding=1")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const hasCheck = user ? await hasCompletedTimeLeakCheckServer(user.id) : false

  return <TimeLeakPageClient hasCheck={hasCheck} />
}
