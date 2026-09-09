"use client"

/**
 * DEVELOPMENT-ONLY preview — visually verifies the live, revised 4-Hour CEO
 * Workday™ experience with realistic Founder GPS™ / ESA™ / Founder
 * Destination™ / Business Context™ signal, without going through the real
 * paid signup flow.
 *
 * What this IS:
 *   - A fixture that seeds the exact localStorage/sessionStorage caches
 *     `HarmonyProvider` already reads (see `lib/dev-preview/workday-fixture.ts`).
 *   - A render of the SAME canonical, unmodified components the real app
 *     uses: `BusinessDaySchedule` → `BusinessDayBlock` ("ceo-workday") →
 *     `TodaysCeoWorkdayCard` → `FounderGpsWorkspace`.
 *
 * What this is NOT:
 *   - Not a new Workday implementation.
 *   - Not a change to production authentication, payment, or the real
 *     founder data model.
 *   - Not a mount point for the orphaned `CeoWorkdayWorkspace`.
 *
 * 404s outside development so it can never appear in production.
 */

import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { BusinessDaySchedule } from "@/components/business-day-schedule"
import { useActiveSpace } from "@/components/active-space-provider"
import { seedWorkdayPreviewFixture } from "@/lib/dev-preview/workday-fixture"

/** Forces the ceo-workday accordion open once mounted inside the real ActiveSpaceProvider — the same mechanism the Hero/Welcome CTAs use. */
function AutoOpenCeoWorkday() {
  const activeSpace = useActiveSpace()
  useEffect(() => {
    activeSpace?.enterSpace("ceo-workday", "block-ceo-workday")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function WorkdayPreviewPage() {
  // 404 outside development — called during render, before any hooks below,
  // so this page can never render in production.
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    // Seed the fixture BEFORE HarmonyProvider mounts below, so its own
    // one-time load effect reads the freshly seeded caches.
    seedWorkdayPreviewFixture()
    setSeeded(true)
  }, [])

  if (!seeded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F1E8]">
        <p className="font-sans text-sm text-[#6B5860]">Seeding fixture data…</p>
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
            Realistic fixture data only — no real account, no payment, no production data. Renders the same live{" "}
            <code>BusinessDaySchedule → ceo-workday → TodaysCeoWorkdayCard → FounderGpsWorkspace</code> the real app
            uses. The "CEO Workday™" segment below is auto-expanded.
          </p>
        </div>
      </div>
      <HarmonyProvider>
        <AutoOpenCeoWorkday />
        <BusinessDaySchedule />
      </HarmonyProvider>
    </div>
  )
}
