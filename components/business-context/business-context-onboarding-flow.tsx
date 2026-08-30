"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { BusinessContextProfile } from "@/components/business-context/business-context-profile"
import { hasCompletedBusinessContext } from "@/lib/business-context/business-context-store"
import { hasCompletedEgaOnboardingSignal } from "@/lib/ega/ega-signal-store"

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
 *
 *      The local-cache check alone is only correct on the SAME device/browser
 *      session that originally completed it — a fresh sign-in, cleared
 *      cache, or new device starts with empty localStorage even though the
 *      database already has the completed record. BusinessContextProfile's
 *      onHydrated callback reports the database's completedAt once its DB
 *      fetch resolves, so we reconcile wasAlreadyComplete before the member
 *      can finish the wizard and hit the wrong branch below.
 */
export function BusinessContextOnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wasAlreadyComplete = useRef(hasCompletedBusinessContext())
  const returnTo = searchParams.get("from") || "/my-harmony"

  function handleDone() {
    // A completed Business Context™ alone doesn't mean onboarding itself is
    // done — a founder who goes Back to Founder Profile™ mid-onboarding and
    // then forward again lands back here with `wasAlreadyComplete` true even
    // though they've never reached EGA yet. Only treat this as a genuine
    // post-onboarding revisit (→ returnTo) once EGA's own signal capture is
    // ALSO on record; otherwise always keep moving forward through the
    // required sequence.
    const onboardingFullyComplete = wasAlreadyComplete.current && hasCompletedEgaOnboardingSignal()
    router.push(onboardingFullyComplete ? returnTo : "/entrepreneur-gap-assessment?onboarding=1")
  }

  function handleHydrated(completedInDb: boolean) {
    if (completedInDb) {
      wasAlreadyComplete.current = true
    }
  }

  return <BusinessContextProfile onDone={handleDone} onHydrated={handleHydrated} />
}
