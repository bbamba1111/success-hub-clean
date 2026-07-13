import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CherryBlossomScene } from "@/components/cherry-blossom/cherry-blossom-scene"
import { createClient } from "@/lib/supabase/server"
import { getCycleContext } from "@/lib/sunday-cycle/cycle-actions"
import { deriveAssessmentCadence } from "@/lib/assessment-cadence"
import { Clock } from "lucide-react"

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
        <div className="glass-panel mx-auto w-full max-w-lg rounded-3xl px-7 py-11 text-center sm:px-10 sm:py-14">

          {/* CB avatar */}
          <div className="mb-5 flex justify-center">
            <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white/70 shadow-lg">
              <img
                src="/images/logo.png"
                alt="Cherry Blossom"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.22em] text-brand-coral">
            Cherry Blossom™
          </p>

          <h1 className="mt-3 font-playfair text-balance text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
            {is30Day
              ? "Your 30-Day Work-Life Balance Audit™"
              : "Your 7-Day Work-Life Pulse™"}
          </h1>

          <div className="mt-6 space-y-3 text-left">
            <p className="font-montserrat text-[14px] leading-relaxed text-brand-ink text-pretty">
              {is30Day
                ? "Before we design your first Work-Life Balance Business Week\u2122, I\u2019d like to understand how your life has been showing up over the past 30 days across 15 areas."
                : "Before we design the week ahead, let\u2019s take a quick pulse on how the past 7 days have felt across the areas of your life that matter most."}
            </p>
            <p className="font-montserrat text-[14px] leading-relaxed text-brand-ink-soft text-pretty">
              {is30Day
                ? "There are no right or wrong answers. We are simply establishing your starting point together."
                : "This is a gentle check-in. Be honest with yourself \u2014 this is just between us."}
            </p>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-sm text-brand-ink-soft">
            <Clock className="h-4 w-4 text-brand-coral" aria-hidden />
            <span className="font-montserrat font-medium">5 mins</span>
          </div>

        </div>
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
