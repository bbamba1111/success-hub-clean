"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { markCherryBlossomWelcomeSeen } from "@/lib/onboarding/onboarding-welcome-store"

/**
 * Cherry Blossom Welcome™
 *
 * The first screen every real member sees after login, before the required
 * Founder Profile™ → Business Context™ on-ramp. Shown once per device —
 * `getPostLoginDestination()` skips straight to /founder-profile on
 * subsequent visits once `markCherryBlossomWelcomeSeen()` has fired here.
 */
export function CherryBlossomWelcomeClient() {
  const router = useRouter()
  const [entering, setEntering] = useState(false)

  function handleContinue() {
    setEntering(true)
    markCherryBlossomWelcomeSeen()
    router.push("/founder-profile")
  }

  return (
    <CherryBlossomScene variant="garden" minHeight="min-h-screen">
      <CherryBlossomSceneCard title="Welcome to Harmony Lane™" time="2 mins">
        <p>
          Before you begin your first Work-Life Balance Business Day™, we&apos;d love to
          get to know you — and the business you&apos;re building.
        </p>
        <p>
          You&apos;ll complete two short steps: your <strong>Founder Profile™</strong>{" "}
          and your <strong>Business Context™</strong>. Together, they let Harmony Lane™
          personalize everything that follows.
        </p>
      </CherryBlossomSceneCard>

      <button
        type="button"
        onClick={handleContinue}
        disabled={entering}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-brand-green/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {entering ? "Beginning…" : "Begin My Founder & Business Profile™"}
        {!entering && <ChevronRight className="h-4 w-4" aria-hidden />}
      </button>
    </CherryBlossomScene>
  )
}
