import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { deriveAssessmentCadence, type AssessmentType, type AssessmentWindow } from "@/lib/assessment-cadence"

export const metadata = {
  title: "Work-Life Balance Audit™ | Harmony Lane™",
  description:
    "A honest snapshot of your life across 15 areas. Calm, guided, and context-aware.",
}

export default async function AuditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let assessmentWindow: AssessmentWindow = "30-day"
  let assessmentType: AssessmentType = "baseline_30_day"

  if (user) {
    const cycleContext = await getCycleContext(user.id)
    const cadence = deriveAssessmentCadence(
      cycleContext.mode === "first-sunday" ? null : "set",
      cycleContext.cycleWeek,
    )
    assessmentWindow = cadence.window
    assessmentType   = cadence.type
  }

  // The 30-day look-back happens ONLY the very first time — a founder's
  // one-time baseline snapshot of how work and life were gelling together
  // before Harmony Lane™. Every Monday after that reflects on the past 7 days.
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
            Today&apos;s Work-Life Balance Audit™ measures how your life has been operating
            across <strong>15 key areas</strong>.
          </p>
          <p>
            {isBaseline
              ? <>If this is your first <strong>Reality Check™</strong>, you&apos;ll reflect on the past <strong>30 days</strong>.</>
              : <>Today&apos;s <strong>Reality Check™</strong> reflects on the previous <strong>7 days</strong>, helping you measure your progress since last Monday.</>}
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers. Simply answer honestly. Awareness creates the
            clarity needed to intentionally redesign your entry into the workweek.
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
