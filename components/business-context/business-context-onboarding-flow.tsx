"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { BusinessContextProfile } from "@/components/business-context/business-context-profile"
import { hasCompletedBusinessContext } from "@/lib/business-context/business-context-store"

/**
 * Wires the required onboarding routing on top of the reusable
 * BusinessContextProfile wizard. /business-context is reached two ways:
 *   1. First-time on-ramp (Founder Profile™ just completed, Business
 *      Context™ not yet done) → finishing here leads to EGA Screen 1
 *      ("What is getting in your way?") — the founder's one-time signal
 *      capture — and only then the Cherry Blossom Thank-You™ transition.
 *      Never straight into the daily Audit/ESA rhythm (those live inside
 *      Reality Check™, not onboarding).
 *   2. A returning member reviewing/updating their profile later from My
 *      Harmony™ or My Blueprint™ → finishing here should NOT replay the
 *      onboarding transition. We capture completion state on mount (before
 *      this save can change it) to tell the two cases apart, and route back
 *      to wherever they came from (?from=) — NEVER back to "/business-context"
 *      itself, which just re-mounts this same wizard from step 0 and looks
 *      like the save silently did nothing.
 */
export function BusinessContextOnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wasAlreadyComplete = useRef(hasCompletedBusinessContext())
  const returnTo = searchParams.get("from") || "/my-harmony"

  function handleDone() {
    router.push(wasAlreadyComplete.current ? returnTo : "/entrepreneur-gap-assessment?onboarding=1")
  }

  return <BusinessContextProfile onDone={handleDone} />
}
