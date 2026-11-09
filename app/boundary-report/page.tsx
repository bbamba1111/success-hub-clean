import { BoundaryReportJourney } from "@/components/boundary-report/boundary-report-journey"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { getOnboardingProgressServer } from "@/lib/onboarding/onboarding-progress"

export const metadata = {
  title: "Work-Life Balance Reality Check™ | Harmony Lane",
  description:
    "The Work-Life Balance Reality Check™ — your first step in Harmony Lane™. Surface your original intention, your baseline, and the boundaries your business needs to protect.",
}

/** ?onboarding=1 — Step 3 of the on-ramp (Founder Profile™ → Business Context™ → Reality Check™). */
export default async function BoundaryReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const isOnboarding = (await searchParams).onboarding === "1"
  const progress = isOnboarding ? await getOnboardingProgressServer() : null

  return (
    <div className="min-h-screen bg-brand-cream">
      <CherryBlossomScene variant="business-bottleneck" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title={isOnboarding ? "Welcome to Your Work-Life Balance Reality Check™" : "Work-Life Balance Reality Check™"}
          step={isOnboarding ? "Step 3 of 3" : undefined}
          scrollPrompt="Begin The Reality Check™"
        >
          <p className="font-bold">Your first step in Harmony Lane™.</p>
          <p>
            Let&apos;s connect what you built your business for with how your life is really operating today — and
            uncover what your business needs to protect so you can make time for more life.
          </p>
          <p className="text-brand-ink-soft">
            Your answers save as you go, and you can come back to review or update them any time.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      <div className="bg-white">
        {progress && <OnboardingProgressBanner progress={progress} currentStep="realityCheckComplete" />}
        <BoundaryReportJourney onboarding={isOnboarding} />
      </div>
    </div>
  )
}
