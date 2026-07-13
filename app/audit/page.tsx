import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { deriveAssessmentCadence } from "@/lib/assessment-cadence"

export const metadata = {
  title: "Work-Life Balance Audit™ | Harmony Lane™",
  description:
    "A honest snapshot of your life across 15 areas. Calm, guided, and context-aware.",
}

export default async function AuditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let assessmentWindow: "7-day" | "30-day" = "30-day"
  let assessmentType: "baseline_30_day" | "weekly_7_day" | "monthly_30_day" = "baseline_30_day"

  if (user) {
    const cycleContext = await getCycleContext(user.id)
    const cadence = deriveAssessmentCadence(
      cycleContext.mode === "first-sunday" ? null : "set",
      cycleContext.cycleWeek,
    )
    assessmentWindow = cadence.window
    assessmentType   = cadence.type
  }

  const is30Day = assessmentWindow === "30-day"

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Scene 1: Cherry Blossom Garden / Torii Gate ───────────────── */}
      <CherryBlossomScene variant="garden" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title={is30Day ? "Your 30-Day Work-Life Balance Audit™" : "Your 7-Day Work-Life Pulse™"}
          time="5 mins"
        >
          <p>
            {is30Day
              ? <>Before we design your first <strong>Work-Life Balance Business Week™</strong>, I'd like to understand how your life has been showing up over the past <strong>30 days</strong> across 15 areas.</>
              : <>Before we design the week ahead, let's take a quick pulse on how the past <strong>7 days</strong> have felt across the areas of your life that matter most.</>}
          </p>
          <p className="text-brand-ink-soft">
            {is30Day
              ? "There are no right or wrong answers. We are simply establishing your starting point together."
              : <>This is a gentle check-in. Be honest with yourself — <em>this is just between us</em>.</>}
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── WLB Audit form — flows below the scene ────────────────────── */}
      <div className="bg-white">
        <WorkLifeBalanceAudit
          assessmentWindow={assessmentWindow}
          assessmentType={assessmentType}
          resultsUrl="/my-results"
        />
      </div>

    </div>
  )
}
