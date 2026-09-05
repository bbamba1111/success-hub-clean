"use client"

/**
 * Business Bottleneck Audit™ (BBA™) — Page Client
 * ---------------------------------------------------------------------------
 * BBA™ replaces the Entrepreneur Success Assessment™ as the active business
 * diagnostic rendered at /entrepreneur-success-assessment. Mirrors
 * esa-page-client.tsx's orchestration shape (scene → wizard → completion),
 * but the underlying decision is different:
 *
 *   No baseline yet   → full 15-category BBA baseline wizard (one-time).
 *   Baseline exists,
 *     this week done  → AlreadyMeasuredNotice (locked until next Monday).
 *   Baseline exists,
 *     this week open  → lightweight Monday Weekly Business Measurement™.
 *
 * The old ESA registry/storage/scoring/components are left completely
 * intact and unrouted for historical reference — this file does not
 * delete or import them.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { AlreadyMeasuredNotice } from "@/components/assessment-cadence/already-measured-notice"
import BbaBaselineWizard from "@/components/business-bottleneck-audit/bba-baseline-wizard"
import BbaWeeklyCheckin from "@/components/business-bottleneck-audit/bba-weekly-checkin"
import { hasCompletedThisWeeksBbaCheckin } from "@/lib/business-bottleneck-audit/bba-storage"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import type { OnboardingProgress } from "@/lib/onboarding/onboarding-progress"

const RESULTS_URL = "/reality-check"

type Mode = "loading" | "baseline" | "weekly" | "already-measured" | "complete"

export function BbaPageClient({
  hasBaseline,
  onboarding = false,
  progress,
}: {
  hasBaseline: boolean
  /** True when reached as required onboarding Step 3 (?onboarding=1). */
  onboarding?: boolean
  /** Onboarding Progress™ snapshot — only passed when onboarding=true. */
  progress?: OnboardingProgress
}) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(hasBaseline ? "loading" : "baseline")

  // Finishing the one-time baseline as part of onboarding continues into the
  // Cherry Blossom Thank-You™ transition (the final on-ramp step) instead of
  // the standalone in-page completion screen.
  const handleBaselineComplete = () => {
    if (onboarding) {
      router.push("/welcome/cherry-blossom/complete")
      return
    }
    setMode("complete")
  }

  useEffect(() => {
    if (!hasBaseline) return
    let isMounted = true
    hasCompletedThisWeeksBbaCheckin().then((alreadyDone) => {
      if (isMounted) setMode(alreadyDone ? "already-measured" : "weekly")
    })
    return () => {
      isMounted = false
    }
  }, [hasBaseline])

  if (mode === "loading") {
    return <div className="min-h-screen bg-brand-cream" aria-hidden />
  }

  if (mode === "already-measured") {
    return (
      <div className="min-h-screen bg-brand-cream">
        <AlreadyMeasuredNotice
          title="Your Monday Weekly Business Measurement™ Is Already In"
          resultsUrl={RESULTS_URL}
          resultsLabel="Review My Reality Check"
        />
      </div>
    )
  }

  if (mode === "complete") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-0">
          <span className="relative inline-flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand-blush shadow-md mb-5">
            <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-coral mb-6">Cherry Blossom&trade;</span>
          <section className="relative overflow-hidden rounded-2xl border border-brand-blush bg-white/80 backdrop-blur-sm shadow-ds w-full text-left px-8 py-9 sm:px-10 sm:py-10">
            <p className="font-sans font-bold text-2xl text-brand-ink mb-4 text-balance">
              {hasBaseline
                ? "Your business is now measured for this week."
                : "You just built your Business Bottleneck Audit™ baseline."}
            </p>
            <p className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-3 text-pretty mb-6">
              {hasBaseline
                ? "GPS™ now has this week's signals to guide your next Business Building Assignment."
                : "This baseline now feeds Founder GPS™, your Business Brief™, and every recommendation ahead."}
            </p>
            <a
              href={RESULTS_URL}
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark"
            >
              Review My Reality Check
            </a>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <CherryBlossomScene variant="executive" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Business Bottleneck Audit™"
          time={mode === "baseline" ? "Approx. 15 mins" : "Approx. 5 mins"}
          scrollPrompt={mode === "baseline" ? "Begin Business Bottleneck Audit™" : "Begin Weekly Business Measurement™"}
        >
          {mode === "baseline" ? (
            <>
              <p>Every business has bottlenecks — this is where we <strong>find yours</strong>.</p>
              <p>
                Across <strong>15 areas</strong> of your business, you&apos;ll mark what&apos;s working, what
                isn&apos;t, and who currently owns each part.
              </p>
              <p className="text-brand-ink-soft">
                It&apos;s a <strong>one-time baseline</strong>, not a weekly retake — and it&apos;s what lets GPS™
                recommend your right next move. There are no wrong answers.
              </p>
            </>
          ) : (
            <>
              <p>Your baseline is set. This week, we just measure what moved.</p>
              <p>
                A few quick questions about the past <strong>7 days</strong> — your business, your bottlenecks, and
                last week&apos;s Business Building Assignment.
              </p>
            </>
          )}
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      <div className="bg-white">
        {onboarding && progress && mode === "baseline" && (
          <OnboardingProgressBanner progress={progress} currentStep="bbaComplete" />
        )}
        {mode === "baseline" && <BbaBaselineWizard onComplete={handleBaselineComplete} />}
        {mode === "weekly" && <BbaWeeklyCheckin onComplete={() => setMode("complete")} />}
      </div>
    </div>
  )
}
