import { BoundaryReportJourney } from "@/components/boundary-report/boundary-report-journey"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import { getOnboardingProgressServer } from "@/lib/onboarding/onboarding-progress"

export const metadata = {
  title: "Work-Life Balance Boundary Report™ | Harmony Lane",
  description:
    "The $97 Weekly Work-Life Balance Reality Check™ — a Sunday-afternoon diagnostic that surfaces your original intention, your baseline, and the boundaries your business needs to protect.",
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
    <>
      {progress && <OnboardingProgressBanner progress={progress} currentStep="realityCheckComplete" />}
      <BoundaryReportJourney onboarding={isOnboarding} />
    </>
  )
}
