import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { deriveAssessmentCadence, type AssessmentType, type AssessmentWindow } from "@/lib/assessment-cadence"
import { EsaPageClient } from "@/components/entrepreneur-success/esa-page-client"

export const metadata = {
  title: "Entrepreneur Success Assessment™ | Harmony Lane™",
  description:
    "A honest snapshot of how your business has been operating. Calm, guided, and context-aware.",
}

export default async function EntrepreneurSuccessAssessmentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let assessmentWindow: AssessmentWindow = "30-day"
  let assessmentType: AssessmentType = "baseline_30_day"

  if (user) {
    const cycleContext = await getCycleContext(user.id)
    const cadence = deriveAssessmentCadence(
      cycleContext.mode === "initial_baseline" ? null : "set",
      cycleContext.cycleWeek,
    )
    assessmentWindow = cadence.window
    assessmentType = cadence.type
  }

  // Mirrors app/audit/page.tsx: the 30-day look-back happens ONLY the very
  // first time — every Monday after that reflects on the past 7 days.
  const isBaseline = assessmentType === "baseline_30_day"

  return (
    <EsaPageClient
      assessmentWindow={assessmentWindow}
      assessmentType={assessmentType}
      isBaseline={isBaseline}
    />
  )
}
