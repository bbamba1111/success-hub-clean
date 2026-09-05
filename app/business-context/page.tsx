import { Suspense } from "react"
import { BusinessContextOnboardingFlow } from "@/components/business-context/business-context-onboarding-flow"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import { getOnboardingProgressServer } from "@/lib/onboarding/onboarding-progress"

export const metadata = {
  title: "Business Context Profile™ | Harmony Lane™",
  description:
    "Tell me about the business you are building so every recommendation Harmony Lane™ makes is personalized to your actual context.",
}

export default async function BusinessContextPage() {
  const progress = await getOnboardingProgressServer()

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Scene: Executive garden — introduces the business layer ───── */}
      <CherryBlossomScene variant="workspace" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Business Context Profile™"
          time="Approx. 10 mins"
          step="Step 2 of 3"
          scrollPrompt="Build My Business Context Profile™"
        >
          <p>
            Now tell me about <strong>the business</strong> you&apos;re building, so every
            recommendation I make fits your real situation.
          </p>
          <p className="text-brand-ink-soft">
            Step two of three — no scores, no right answers, just context. About 10 minutes.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Business Context Profile™ wizard — flows below the scene ─── */}
      <div className="bg-white">
        <OnboardingProgressBanner progress={progress} currentStep="businessContextComplete" />
        <Suspense fallback={null}>
          <BusinessContextOnboardingFlow />
        </Suspense>
      </div>

    </div>
  )
}
