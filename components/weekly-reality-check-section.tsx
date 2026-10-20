"use client"

/**
 * Monday panoramic card — Work-Life Balance Reality Check™.
 *
 * Sits immediately above Decide & Design™ on Monday. The assessment expands
 * inline (no modal, no navigation). The panel stays mounted while collapsed so
 * in-progress answers survive closing and reopening the card.
 */

import { useState } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { BoundaryReportJourney } from "@/components/boundary-report/boundary-report-journey"

export function WeeklyRealityCheckSection() {
  const [open, setOpen] = useState(false)

  return (
    <section
      id="weekly-reality-check"
      aria-labelledby="weekly-reality-check-title"
      className="scroll-mt-24 w-full px-4 py-3 sm:px-6 lg:px-8"
    >
      <div
        className="relative w-full overflow-hidden rounded-3xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 45%, #F0F5EE 100%)" }}
      >
        <div className="flex w-full flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-9">
          <div className="min-w-0 max-w-2xl">
            <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#78AD7D]">
              Monday · Before Decide &amp; Design™
            </p>
            <h2
              id="weekly-reality-check-title"
              className="font-playfair text-2xl font-semibold leading-tight text-[#1C161A] text-balance sm:text-3xl"
            >
              Work-Life Balance Reality Check™
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[#5C4F55] text-pretty sm:text-base">
              See what your business is actually making possible in your life—and identify what needs your
              attention this week.
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
                Close Reality Check
                <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
              </>
            ) : (
              <>
                Take Your Work-Life Balance Reality Check™
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        <div
          id="weekly-reality-check-panel"
          hidden={!open}
          className="border-t border-[#C13B6B]/12 bg-white/40"
        >
          <BoundaryReportJourney />
        </div>
      </div>
    </section>
  )
}
