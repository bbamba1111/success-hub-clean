"use client"

/**
 * Redesign Your Entry Into The Workweek — Monday, top of Decide & Design™.
 *
 * Expands the Weekly 7-Day Work-Life Balance Audit™ retake inline, directly
 * above My Priority Focus Areas™. The panel stays mounted while collapsed so
 * in-progress answers survive closing and reopening.
 */

import { useState } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { WeeklyAuditFlow } from "@/components/weekly-audit/weekly-audit-flow"

export function WeeklyRealityCheckSection() {
  const [open, setOpen] = useState(false)

  return (
    <section
      id="weekly-reality-check"
      aria-labelledby="weekly-reality-check-title"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#E8DFE2] bg-white shadow-sm"
    >
      <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
        <div className="min-w-0 max-w-2xl">
          <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B835F]">
            Monday · Weekly 7-Day Work-Life Balance Audit™
          </p>
          <h3
            id="weekly-reality-check-title"
            className="font-serif text-2xl font-semibold leading-tight text-[#2E1F27] text-balance"
          >
            Redesign Your Entry Into The Workweek
          </h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#5C4F55] text-pretty">
            Retake your 7-day Work-Life Balance Audit™ to see how your life has been operating this past week, then
            choose the one to three Priority Focus Areas™ that will guide your redesign for the week ahead.
          </p>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="weekly-reality-check-panel"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#C13B6B] px-5 py-3 text-center font-montserrat text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#A8305C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C13B6B] focus-visible:ring-offset-2 sm:self-center"
        >
          {open ? (
            <>
              Close Audit
              <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
            </>
          ) : (
            <>
              Take My 7-Day Audit™
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <div id="weekly-reality-check-panel" hidden={!open} className="border-t border-[#E8DFE2] bg-[#FDFAF6]">
        <WeeklyAuditFlow />
      </div>
    </section>
  )
}
