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

  let assessmentWindow: "30-day" = "30-day"
  let assessmentType: "baseline_30_day" | "monthly_30_day" = "baseline_30_day"

  if (user) {
    const cycleContext = await getCycleContext(user.id)
    const cadence = deriveAssessmentCadence(
      cycleContext.mode === "first-sunday" ? null : "set",
      cycleContext.cycleWeek,
    )
    assessmentWindow = cadence.window
    assessmentType   = cadence.type
  }

  const isBaseline = assessmentType === "baseline_30_day"

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Work-Life Balance Audit™ Hero ─────────────────────────────── */}
      <CherryBlossomScene variant="pond" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Your Work-Life Balance Audit™"
          time="5 mins"
          scrollPrompt="Take My Work-Life Balance Audit™"
        >
          <p>
            {isBaseline
              ? <>Before we design your first <strong>Work-Life Balance Business Week™</strong>, I&apos;d like to understand how your life has been showing up over the past <strong>30 days</strong> across 15 areas.</>
              : <>Each month we revisit how your life has been showing up across <strong>15 areas</strong> over the past <strong>30 days</strong> — so your operating system stays tuned to your real life.</>}
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers. Be honest with yourself — <em>this is just between us</em>.
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
