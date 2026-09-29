"use client"

/**
 * DEVELOPMENT-ONLY preview — visually verifies the Movement Declaration™
 * flow spanning two Monday segments:
 *   1. "Decide & Design My Work-Life Balance Business Day™" (monday-debrief)
 *      — Step 1 of 3, `MovementIntentionForm`, builds the declaration.
 *   2. "30-Minute Workday Movement Window™" (movement-window)
 *      — `TodaysMovementCard` hosts Steps 2 & 3 plus the always-present
 *        Movement Tracker & Movement History.
 *
 * Renders the same live, unmodified `BusinessDaySchedule` the real app uses.
 * 404s outside development so it can never appear in production.
 */

import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { BusinessDaySchedule } from "@/components/business-day-schedule"
import { useActiveSpace } from "@/components/active-space-provider"
import { useDeveloperMode } from "@/components/operating-engine-provider"

/**
 * Forces the simulated day to Monday (dayOfWeek 1) via the existing admin
 * Developer Mode override, then opens the monday-debrief accordion once
 * mounted inside the real ActiveSpaceProvider — without this, monday-only
 * blocks (monday-debrief, monday-reality-check) never render on any other
 * day of the week.
 */
function AutoOpenMondayDebrief() {
  const activeSpace = useActiveSpace()
  const devMode = useDeveloperMode()

  useEffect(() => {
    devMode?.setOverride({ dayOfWeek: 1, blockId: "monday-debrief" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    activeSpace?.enterSpace("monday-debrief", "block-monday-debrief")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function MondayMovementPreviewPage() {
  // 404 outside development — called during render, before any hooks below,
  // so this page can never render in production.
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F1E8]">
        <p className="font-sans text-sm text-[#6B5860]">Loading preview…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <div className="rounded-2xl border border-dashed border-[#C13B6B]/40 bg-[#FBF1F5] px-5 py-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C13B6B]">
            Development-only preview
          </p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-[#6B5860]">
            No real account, no payment. Renders the live{" "}
            <code>BusinessDaySchedule → monday-debrief / movement-window</code> blocks. The{" "}
            &quot;Decide &amp; Design My Work-Life Balance Business Day™&quot; segment below is auto-expanded —
            scroll down to &quot;30-Minute Workday Movement Window™&quot; to see Steps 2 &amp; 3 plus the tracker
            after building a declaration.
          </p>
        </div>
      </div>
      <HarmonyProvider>
        <AutoOpenMondayDebrief />
        <BusinessDaySchedule />
      </HarmonyProvider>
    </div>
  )
}
