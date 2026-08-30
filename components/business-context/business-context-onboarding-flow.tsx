"use client"

import { useRouter } from "next/navigation"
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
 *      Harmony™ → finishing here should NOT replay the onboarding
 *      transition. We capture completion state on mount (before this save
 *      can change it) to tell the two cases apart.
 */
export function BusinessContextOnboardingFlow() {
  const router = useRouter()
  const wasAlreadyComplete = useRef(hasCompletedBusinessContext())

  function handleDone() {
    router.push(wasAlreadyComplete.current ? "/business-context" : "/entrepreneur-gap-assessment?onboarding=1")
  }

  return <BusinessContextProfile onDone={handleDone} />
}
