"use client"

/**
 * EventsClient — Phase 15.1
 * ---------------------------
 * Client orchestrator for the /events route. Renders the page header with
 * a Time Freedom™ awareness strip (Fri–Sun) and the full EventsGrid.
 */

import { useHarmonyWeek } from "@/components/harmony-week/harmony-week-provider"
import { EventsGrid } from "@/components/events/events-grid"

export function EventsClient() {
  const harmonyWeek = useHarmonyWeek()

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-black/[0.06] bg-white px-6 py-10 sm:px-8 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Community Events™
          </p>
          <h1 className="text-balance font-playfair text-3xl font-semibold text-foreground sm:text-4xl">
            Live Together, Lead Together™
          </h1>
          <p className="mt-3 max-w-2xl font-montserrat text-sm leading-relaxed text-muted-foreground">
            Every event on the platform is designed around your Work-Life Balance Operating System™ —
            co-working inside your CEO Workday™, Monday alignment, peer accountability, and expert-led
            skill sessions. The community is open Monday through Thursday.
          </p>

          {/* Time Freedom™ awareness strip — visible Fri–Sun */}
          {harmonyWeek?.isTimeFreedomNow && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#5D9D61]/20 bg-[#5D9D61]/6 px-4 py-3">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#5D9D61]"
                aria-hidden
              />
              <p className="font-montserrat text-sm text-[#5D9D61]">
                <span className="font-semibold">Time Freedom™ is active.</span>
                {" "}The community resumes Monday morning. Enjoy the life you built your business to support.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Events grid */}
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8 md:px-12">
        <EventsGrid />
      </div>
    </main>
  )
}
