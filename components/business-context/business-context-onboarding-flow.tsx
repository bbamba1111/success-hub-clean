"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import { BusinessContextProfile } from "@/components/business-context/business-context-profile"
import { hasCompletedBusinessContext } from "@/lib/business-context/business-context-store"

/**
 * Wires the required onboarding routing on top of the reusable
 * BusinessContextProfile wizard. /business-context is reached two ways:
 *   1. First-time on-ramp (Founder Profile™ just completed, Business
 *      Context™ not yet done) → finishing here leads to the Cherry Blossom
 *      Thank-You™ transition, never straight into the daily Audit/ESA
 *      rhythm (those live inside Reality Check™, not onboarding).
 *   2. A returning member reviewing/updating their profile later from My
 *      Harmony™ → finishing here should NOT replay the onboarding
 *      transition. We capture completion state on mount (before this save
 *      can change it) to tell the two cases apart.
 */
export function BusinessContextOnboardingFlow() {
  const router = useRouter()
  const wasAlreadyComplete = useRef(hasCompletedBusinessContext())

  function handleDone() {
    router.push(wasAlreadyComplete.current ? "/business-context" : "/welcome/cherry-blossom/complete")
  }

  return <BusinessContextProfile onDone={handleDone} />
}
