"use client"

/**
 * Work-Life Balance Time-Leak Check™ — Page Client
 * ---------------------------------------------------------------------------
 * Orchestrates scene → wizard → profile, mirroring bba-page-client.tsx. This
 * is REQUIRED Step 3 of the Harmony Lane™ on-ramp (Founder Profile™ →
 * Business Context™ → Time-Leak Check™), replacing the Business Bottleneck
 * Audit in that position. Finishing continues into the Cherry Blossom
 * Thank-You™ / Ready for Monday transition, exactly as the BBA did.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import TimeLeakWizard from "@/components/wlb-time-leak/time-leak-wizard"
import { TimeLeakResults } from "@/components/wlb-time-leak/time-leak-results"
import { getCurrentTimeLeakCheck } from "@/lib/wlb-time-leak/storage"
import type { TimeLeakResponses } from "@/lib/wlb-time-leak/types"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import type { OnboardingProgress } from "@/lib/onboarding/onboarding-progress"

type Mode = "loading" | "wizard" | "results"

export function TimeLeakPageClient({
  hasCheck,
  onboarding = false,
  progress,
}: {
  hasCheck: boolean
  onboarding?: boolean
  progress?: OnboardingProgress
}) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(hasCheck ? "loading" : "wizard")
  const [responses, setResponses] = useState<TimeLeakResponses | null>(null)

  const showResults = async () => {
    const record = await getCurrentTimeLeakCheck()
    if (record) {
      setResponses(record.responses)
      setMode("results")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return true
    }
    return false
  }

  const handleComplete = async () => {
    const shown = await showResults()
    if (!shown) setMode("wizard")
  }

  const handleContinue = () => {
    router.push("/welcome/cherry-blossom/complete")
  }

  useEffect(() => {
    if (!hasCheck) return
    let isMounted = true
    getCurrentTimeLeakCheck().then((record) => {
      if (!isMounted) return
      if (record) {
        setResponses(record.responses)
        setMode("results")
      } else {
        setMode("wizard")
      }
    })
    return () => {
      isMounted = false
    }
  }, [hasCheck])

  if (mode === "loading") {
    return <div className="min-h-screen bg-brand-cream" aria-hidden />
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <CherryBlossomScene variant="business-bottleneck" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Work-Life Balance Time-Leak Check™"
          time="Approx. 5 – 7 mins"
          step={onboarding && mode === "wizard" ? "Step 3 of 3" : undefined}
          scrollPrompt={mode === "wizard" ? "Begin Time-Leak Check™" : "Review My Time-Leak Profile™"}
        >
          <p className="font-bold">What&apos;s really causing work to take more of your life than you intended?</p>
          <p>
            Before we measure your Work-Life Balance, let&apos;s identify what may be causing the imbalance.
          </p>
          <p className="text-brand-ink-soft">
            This isn&apos;t about whether you&apos;re a good or bad business owner. It&apos;s about identifying the
            conditions, habits, and missing structures that are causing work to expand beyond the boundaries you want.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      <div className="bg-white">
        {onboarding && progress && mode === "wizard" && (
          <OnboardingProgressBanner progress={progress} currentStep="timeLeakComplete" />
        )}
        {mode === "wizard" && <TimeLeakWizard onComplete={handleComplete} />}
        {mode === "results" && responses && (
          <TimeLeakResults
            responses={responses}
            onContinue={onboarding ? handleContinue : undefined}
            continueLabel="Continue to Ready for Monday"
          />
        )}
      </div>
    </div>
  )
}
