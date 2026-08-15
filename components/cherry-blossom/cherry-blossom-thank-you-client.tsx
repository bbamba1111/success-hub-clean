"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { markCherryBlossomThankYouSeen } from "@/lib/onboarding/onboarding-welcome-store"
import { getPostLoginDestination } from "@/utils/reality-check-storage"

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

  async function handleEnter() {
    setEntering(true)
    markCherryBlossomThankYouSeen()
    // Both on-ramp gates and the Thank-You screen are now satisfied, so the
    // existing routing engine resolves straight to the correct current day
    // (or this week's Reality Check ritual if that's still outstanding).
    const destination = await getPostLoginDestination()
    router.push(destination)
  }

  return (
    <CherryBlossomScene variant="ceo-office" minHeight="min-h-screen">
      <CherryBlossomSceneCard title="Beautiful. Your on-ramp is complete." time="Ready when you are">
        <p>
          Thank you for introducing yourself — and your business — to Harmony Lane™.
        </p>
        <p>
          Everything you shared will personalize your Work-Life Balance Business Day™
          from here forward.
        </p>
      </CherryBlossomSceneCard>

      <button
        type="button"
        onClick={handleEnter}
        disabled={entering}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-brand-green/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {entering ? "Entering…" : "Enter My Work-Life Balance Business Day™"}
        {!entering && <ChevronRight className="h-4 w-4" aria-hidden />}
      </button>
    </CherryBlossomScene>
  )
}
