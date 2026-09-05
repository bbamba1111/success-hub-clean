"use client"

import { useEffect, useState } from "react"
import EntrepreneurSuccessAssessment, {
  CompletionScreen,
} from "@/components/entrepreneur-success/entrepreneur-success-assessment"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { AlreadyMeasuredNotice } from "@/components/assessment-cadence/already-measured-notice"
import { getEsaHistory, getWeekKey } from "@/lib/entrepreneur-success/esa-storage"
import type { AssessmentType, AssessmentWindow } from "@/lib/assessment-cadence"

const RESULTS_URL = "/reality-check"

export function EsaPageClient({
  assessmentWindow,
  assessmentType,
  isBaseline,
}: {
  assessmentWindow: AssessmentWindow
  assessmentType: AssessmentType
  isBaseline: boolean
}) {
  const [complete, setComplete] = useState(false)
  // Monday Weekly Measurement™ rule: once this week's ESA is recorded, it is
  // locked until next Monday. ESA's canonical weekly record lives in
  // localStorage history (esa-storage.ts), unlike Audit's Supabase-backed
  // reality_checks row, so this check runs client-side after mount.
  const [alreadyMeasuredThisWeek, setAlreadyMeasuredThisWeek] = useState(false)

  useEffect(() => {
    if (assessmentType !== "weekly_7_day") return
    const currentWeekKey = getWeekKey()
    const alreadyDone = getEsaHistory().some((entry) => entry.weekKey === currentWeekKey)
    setAlreadyMeasuredThisWeek(alreadyDone)
  }, [assessmentType])

  if (alreadyMeasuredThisWeek) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <AlreadyMeasuredNotice
          title="Your Entrepreneur Success Assessment™ Is Already In"
          resultsUrl={RESULTS_URL}
          resultsLabel="Review My Reality Check"
        />
      </div>
    )
  }

  if (complete) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center py-16 px-4">
        <CompletionScreen resultsUrl={RESULTS_URL} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Scene: Japanese Executive Study / Shoji Screens ─────────── */}
      <CherryBlossomScene variant="executive" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Entrepreneur Success Assessment™"
          time="Approx. 10 mins"
          scrollPrompt="Begin Entrepreneur Success Assessment™"
        >
          <p>
            Your business has been operating alongside your life every day.
          </p>
          <p>
            This assessment measures how your business has been operating during the{" "}
            <strong>same period</strong> as your Work-Life Balance Audit™.
          </p>
          <p>
            {isBaseline
              ? <>If this is your first <strong>Reality Check™</strong>, you&apos;ll reflect on the past <strong>30 days</strong>.</>
              : <>Today&apos;s <strong>Reality Check™</strong> reflects on the previous <strong>7 days</strong>, helping you measure your progress since last Monday.</>}
          </p>
          <p>
            Together, these two reflections create your personalized{" "}
            <strong>Work-Life Balance Reality Check™</strong>, helping you see how your life and
            your business are working together — and where they may need better alignment.
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers. Simply answer honestly. Reflection creates
            awareness, and awareness is the first step toward intentionally redesigning your
            entry into the workweek.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── ESA questions ─────────────────────────────────────────────── */}
      <div className="bg-white">
        <EntrepreneurSuccessAssessment
          resultsUrl={RESULTS_URL}
          assessmentWindow={assessmentWindow}
          assessmentType={assessmentType}
          onComplete={() => setComplete(true)}
        />
      </div>

    </div>
  )
}
