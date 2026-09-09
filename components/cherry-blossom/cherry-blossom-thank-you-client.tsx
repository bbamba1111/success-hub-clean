"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { markCherryBlossomThankYouSeen } from "@/lib/onboarding/onboarding-welcome-store"

/**
 * Cherry Blossom Thank-You™ / Transition
 *
 * Shown once, after Founder Profile™ and Business Context™ are both
 * complete — the on-ramp's closing ritual before the founder enters their
 * first Work-Life Balance Business Day™.
 */
export function CherryBlossomThankYouClient() {
  const router = useRouter()
  const [entering, setEntering] = useState(false)

  function handleEnter() {
    setEntering(true)
    markCherryBlossomThankYouSeen()
    // This is the on-ramp's closing transition — NOT entry into the operational
    // workspaces. The CTA leads into the orientation/preview environment ("/"),
    // where every segment is visible with its schedule and About This Segment™
    // but each workspace stays LOCKED until its scheduled time (Phase C access
    // control). The founder learns the rhythm first, then the workspaces open.
    router.push("/")
  }

  return (
    <CherryBlossomScene variant="ceo-office" minHeight="min-h-screen">
      <CherryBlossomSceneCard
        title="Beautiful. Your On-Ramp Into Harmony Lane™ Is Complete."
        time="Your Monday experience is ready"
      >
        <p>
          You&apos;ve completed your Founder Profile™, Business Context™, and Work-Life Balance
          Time-Leak Check™.
        </p>
        <p>Your Monday experience is ready.</p>
        <p>
          Until then, you can explore the Work-Life Balance Business Day/Week™ and become familiar
          with the rhythm you&apos;ll be stepping into.
        </p>
        <p>Every segment has its own Work-Life Balance Time &amp; Space Boundary™.</p>
        <p className="font-semibold">Your workspaces will open when it&apos;s time.</p>
      </CherryBlossomSceneCard>

      <button
        type="button"
        onClick={handleEnter}
        disabled={entering}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-brand-green/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {entering ? "Entering…" : "Explore & Learn More About The Work-Life Balance Business Day/Week™"}
        {!entering && <ChevronRight className="h-4 w-4" aria-hidden />}
      </button>
    </CherryBlossomScene>
  )
}
