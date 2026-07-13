import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CherryBlossomGuidance } from "@/components/cherry-blossom/cherry-blossom-guidance"
import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { deriveAssessmentCadence } from "@/lib/assessment-cadence"

export default async function AuditPage() {
  // Derive assessment cadence server-side from the founder's personal cycle.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let assessmentWindow: "7-day" | "30-day" = "30-day"
  let assessmentType: "baseline_30_day" | "weekly_7_day" | "monthly_30_day" = "baseline_30_day"
  let is30Day = true

  if (user) {
    const cycleContext = await getCycleContext(user.id)
    const cadence = deriveAssessmentCadence(
      cycleContext.mode === "first-sunday" ? null : "set",
      cycleContext.cycleWeek,
    )
    assessmentWindow = cadence.window
    assessmentType = cadence.type
    is30Day = cadence.window === "30-day"
  }

  const cbGreeting = is30Day
    ? "Let's begin with your Work-Life Balance Audit™."
    : "Welcome back. Let's check in on the past 7 days."

  const cbMessage = is30Day
    ? "Before we design your first Work-Life Balance Business Week™, let's understand how your life has been operating over the past 30 days. There are no right or wrong answers — we're simply creating awareness together."
    : "Before we design your next week, let's take a quick pulse on how the past 7 days have felt across the areas of your life that matter most."

  return (
    <div>
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-medium text-brand-coral transition-colors duration-200 hover:text-brand-green"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-4">
        <CherryBlossomGuidance greeting={cbGreeting}>
          <p>{cbMessage}</p>
        </CherryBlossomGuidance>
      </div>

      <WorkLifeBalanceAudit
        assessmentWindow={assessmentWindow}
        assessmentType={assessmentType}
      />
    </div>
  )
}
