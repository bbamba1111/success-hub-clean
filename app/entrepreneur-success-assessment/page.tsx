import { createClient } from "@/lib/supabase/server"
import { hasCompletedBbaBaselineServer } from "@/lib/business-bottleneck-audit/bba-server"
import { BbaPageClient } from "@/components/business-bottleneck-audit/bba-page-client"

export const metadata = {
  title: "Business Bottleneck Audit™ | Harmony Lane™",
  description:
    "An honest baseline of where your business is bottlenecked across 15 business areas, paired with a lightweight weekly measurement — not a full re-take every Monday.",
}

/**
 * BBA™ (Business Bottleneck Audit™) replaces the Entrepreneur Success
 * Assessment™ (ESA) as the active business diagnostic at this same route —
 * every existing onboarding/nav link into /entrepreneur-success-assessment
 * keeps working unchanged. Unlike the ESA, BBA™ is a ONE-TIME baseline
 * (manually re-runnable later) paired with a lightweight Monday weekly
 * measurement layer — it is never retaken in full every week.
 *
 * The old ESA registry/storage/scoring/components remain completely
 * intact and unrouted below this page for historical reference — this
 * change does not delete or migrate any existing ESA data.
 */
export default async function EntrepreneurSuccessAssessmentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const hasBaseline = user ? await hasCompletedBbaBaselineServer(user.id) : false

  return <BbaPageClient hasBaseline={hasBaseline} />
}
