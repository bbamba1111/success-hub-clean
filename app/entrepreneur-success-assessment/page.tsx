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
            During the past 30 days you&apos;ve developed habits, routines, and business practices —{" "}
            <em>some intentionally, others by default</em>.
          </p>
          <p>
            This assessment helps me understand how you&apos;ve been operating your business so I can{" "}
            <strong>personalize Harmony Lane™ specifically for you</strong>.
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers. We are simply establishing your starting point.
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
