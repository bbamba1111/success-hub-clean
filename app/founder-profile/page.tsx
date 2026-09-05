import type { Metadata } from "next"
import { Suspense } from "react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { FounderProfileForm } from "@/components/founder-profile/founder-profile-form"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import { getOnboardingProgressServer } from "@/lib/onboarding/onboarding-progress"

export const metadata: Metadata = {
  title: "Founder & Business Profile™ | Harmony Lane™",
  description:
    "Tell us about yourself and the business you're building so Harmony Lane™ can personalize your experience from day one.",
}

/**
 * /founder-profile — REQUIRED Step 1 of the Harmony Lane™ onboarding on-ramp.
 *
 * One-time onboarding experience — Founder & Business Profile™.
 * There is no production "skip" path — completion is required before a
 * member can proceed to Business Context™ and, ultimately, their first
 * Work-Life Balance Business Day™.
 *
 * Flow:
 *   Cherry Blossom Welcome™ → /founder-profile → /business-context
 *     → Cherry Blossom Thank-You™ → current Work-Life Balance Business Day™
 */
export default async function FounderProfilePage() {
  const progress = await getOnboardingProgressServer()

  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* ── Cherry Blossom™ Hero — CEO Executive Office ─────────────── */}
      <CherryBlossomScene variant="ceo-office" minHeight="min-h-[72vh]">
        <CherryBlossomSceneCard
          title="Welcome to Harmony Lane™"
          time="10 – 15 mins"
          scrollPrompt="Begin My Founder & Business Profile™"
          maxWidth="max-w-2xl"
        >
          {/* Badge */}
          <div className="flex justify-center mb-1 -mt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-ink/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral shrink-0" aria-hidden />
              Founder &amp; Business Profile™
            </span>
          </div>

          <p>
            First, tell me a little about <strong>you</strong> — who you are and the life your
            business is meant to support.
          </p>
          <p className="text-brand-ink-soft">
            This is step one of three. It takes about 10 minutes, every field is optional, and it
            teaches Harmony Lane™ how to guide you from day one.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      <OnboardingProgressBanner progress={progress} currentStep="founderProfileComplete" />

      {/* ── Founder & Business Profile™ Form ────────────────────────── */}
      <Suspense fallback={null}>
        <FounderProfileForm />
      </Suspense>

    </div>
  )
}
