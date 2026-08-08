"use client"

import { useState } from "react"
import EntrepreneurSuccessAssessment, {
  CompletionScreen,
} from "@/components/entrepreneur-success/entrepreneur-success-assessment"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

const RESULTS_URL =
  "https://success-hub-clean-ics7g40y6-thought-leader-barbaras-projects.vercel.app/harmony-blueprint"

export default function EntrepreneurSuccessAssessmentPage() {
  const [complete, setComplete] = useState(false)

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
            Over the past 30 days, your business has been operating in its own unique way.
          </p>
          <p>
            This assessment measures how your business has been operating{" "}
            <strong>alongside your life</strong> during that same period so we can compare both
            experiences and better understand where they are working together — and where they
            may be competing with one another.
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers. Simply answer honestly. Honest reflection
            creates the awareness needed to intentionally redesign your entry into the workweek.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── ESA questions ─────────────────────────────────────────────── */}
      <div className="bg-white">
        <EntrepreneurSuccessAssessment
          resultsUrl={RESULTS_URL}
          onComplete={() => setComplete(true)}
        />
      </div>

    </div>
  )
}
