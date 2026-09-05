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
import { BbaBaselineSummary } from "@/components/business-bottleneck-audit/bba-baseline-summary"
import { getCurrentBbaBaseline, hasCompletedThisWeeksBbaCheckin } from "@/lib/business-bottleneck-audit/bba-storage"
import type { BbaBaselineRecord, BbaCategoryId } from "@/lib/business-bottleneck-audit/types"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import type { OnboardingProgress } from "@/lib/onboarding/onboarding-progress"

const RESULTS_URL = "/reality-check"

type Mode = "loading" | "baseline" | "summary" | "weekly" | "already-measured" | "complete"

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
  // The current saved baseline, loaded for the editable summary view.
  const [baseline, setBaseline] = useState<BbaBaselineRecord | null>(null)
  // When editing from the summary, which category the wizard opens on.
  const [editCategory, setEditCategory] = useState<BbaCategoryId | undefined>(undefined)

  // Load the saved baseline and switch to the editable summary — the shape the
  // founder sees whenever a baseline already exists during onboarding, and the
  // review screen shown right after completing/saving the audit.
  const showSummary = async () => {
    const record = await getCurrentBbaBaseline()
    if (record) {
      setBaseline(record)
      setEditCategory(undefined)
      setMode("summary")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return true
    }
    return false
  }

  // Onboarding: finishing (or re-saving) the one-time baseline lands on the
  // editable summary so the founder can review every answer, not the standalone
  // completion card. Outside onboarding it keeps the original completion card.
  const handleBaselineComplete = async () => {
    if (onboarding) {
      const shown = await showSummary()
      if (!shown) router.push("/welcome/cherry-blossom/complete")
      return
    }
    setMode("complete")
  }

  const handleEditCategory = (categoryId: BbaCategoryId) => {
    setEditCategory(categoryId)
    setMode("baseline")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Summary "Continue" is the final on-ramp step → Cherry Blossom Thank-You™.
  const handleContinueFromSummary = () => {
    router.push("/welcome/cherry-blossom/complete")
  }

  useEffect(() => {
    if (!hasBaseline) return
    let isMounted = true

    // During onboarding a completed baseline should surface as the editable
    // summary — NOT the weekly measurement (that belongs to the ongoing weekly
    // rhythm, not the one-time onboarding baseline).
    if (onboarding) {
      getCurrentBbaBaseline().then((record) => {
        if (!isMounted) return
        if (record) {
          setBaseline(record)
          setMode("summary")
        } else {
          setMode("baseline")
        }
      })
      return () => {
        isMounted = false
      }
    }

    hasCompletedThisWeeksBbaCheckin().then((alreadyDone) => {
      if (isMounted) setMode(alreadyDone ? "already-measured" : "weekly")
    })
    return () => {
      isMounted = false
    }
  }, [hasBaseline, onboarding])

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
      <CherryBlossomScene variant="business-bottleneck" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Business Bottleneck Audit™"
          time={mode === "baseline" ? "Approx. 10 mins" : mode === "summary" ? "Review & edit" : "Approx. 5 mins"}
          step={onboarding && (mode === "baseline" || mode === "summary") ? "Step 3 of 3" : undefined}
          scrollPrompt={
            mode === "baseline"
              ? "Begin Business Bottleneck Audit™"
              : mode === "summary"
                ? "Review My Business Bottleneck Audit™"
                : "Begin Weekly Business Measurement™"
          }
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
          ) : mode === "summary" ? (
            <>
              <p>Beautiful work — your <strong>Business Bottleneck Audit™</strong> is complete.</p>
              <p>
                Here&apos;s everything you told me, across all <strong>15 areas</strong>. Review it, edit anything that
                needs a second look, then continue.
              </p>
              <p className="text-brand-ink-soft">
                This baseline now feeds Founder GPS™ and every recommendation ahead.
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
        {onboarding && progress && (mode === "baseline" || mode === "summary") && (
          <OnboardingProgressBanner progress={progress} currentStep="bbaComplete" />
        )}
        {mode === "baseline" && (
          <BbaBaselineWizard
            onComplete={handleBaselineComplete}
            initialResponses={editCategory ? baseline?.responses : undefined}
            initialOtherText={editCategory ? baseline?.otherText : undefined}
            startCategoryId={editCategory}
            completeLabel={editCategory ? "Save Changes" : "Complete Audit"}
          />
        )}
        {mode === "summary" && baseline && (
          <BbaBaselineSummary
            responses={baseline.responses}
            otherText={baseline.otherText}
            onEditCategory={handleEditCategory}
            onContinue={onboarding ? handleContinueFromSummary : undefined}
          />
        )}
        {mode === "weekly" && <BbaWeeklyCheckin onComplete={() => setMode("complete")} />}
      </div>
    </div>
  )
}
