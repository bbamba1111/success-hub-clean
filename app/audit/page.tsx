import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { AlreadyMeasuredNotice } from "@/components/assessment-cadence/already-measured-notice"
import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { deriveAssessmentCadence, type AssessmentType, type AssessmentWindow } from "@/lib/assessment-cadence"
import { hasCompletedThisWeeksRealityCheckServer } from "@/utils/reality-check-server"

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
  let alreadyMeasuredThisWeek = false

  if (user) {
    const cycleContext = await getCycleContext(user.id)
    const cadence = deriveAssessmentCadence(
      cycleContext.mode === "initial_baseline" ? null : "set",
      cycleContext.cycleWeek,
    )
    assessmentWindow = cadence.window
    assessmentType   = cadence.type

    // Monday Weekly Measurement™ rule: once this week's Audit is scored, it
    // is locked until next Monday — never re-shown mid-week. Only applies to
    // the recurring weekly cadence, never to a founder's one-time baseline.
    if (cadence.type === "weekly_7_day") {
      alreadyMeasuredThisWeek = await hasCompletedThisWeeksRealityCheckServer(user.id)
    }
  }

  // The 30-day look-back happens ONLY the very first time — a founder's
  // one-time baseline snapshot of how work and life were gelling together
  // before Harmony Lane™. Every Monday after that reflects on the past 7 days.
  const isBaseline = assessmentType === "baseline_30_day"

  if (alreadyMeasuredThisWeek) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <AlreadyMeasuredNotice
          title="Your Work-Life Balance Audit™ Is Already In"
          resultsUrl="/my-results"
          resultsLabel="Review My Results"
        />
      </div>
    )
  }

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
            Today&apos;s audit measures how your life has been operating alongside your work over
            the past <strong>{isBaseline ? "30 days" : "7 days"}</strong> across the{" "}
            <strong>15 Core Life Value Areas™</strong>.
          </p>
          <p>
            {isBaseline
              ? <>It shows where you stand today and what may need your attention this week.</>
              : <>It shows your progress in your <strong>1–3 Priority Focus Areas™</strong> since last Monday and what may need your attention this week.</>}
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers, so answer honestly. Awareness gives you the
            clarity to redesign your entry into the workweek.
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
