"use client"

/**
 * Business Function 5 → Boundary Design & Redesign.
 *
 * Opens the SAME boundary records used in Decide & Design™ and the CEO
 * Workday™ — it never creates a second weekly or monthly selection.
 * The Monthly Boundary Builder™ is gated by the monthly membership entitlement.
 */

import { useState } from "react"
import { CalendarRange, Lock, ShieldCheck } from "lucide-react"

import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { useMonthlyBoundaryFocus } from "@/lib/monthly-boundary-focus/use-monthly-boundary-focus"
import { BoundaryBuilderDialog } from "@/components/boundary-builder/boundary-builder-dialog"
import { monthlyBuilderKey } from "@/components/ceo-workday/monthly-boundary-focus-panel"

const cardClass =
  "flex w-full flex-col items-start gap-1 rounded-2xl border border-[#7FB069]/30 bg-white px-4 py-3 text-left shadow-sm transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:bg-[#F3F8ED] enabled:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"

export function BoundaryDesignRedesign() {
  const weekly = useWeeklyBoundaryFocus()
  const monthly = useMonthlyBoundaryFocus()
  const [weeklyOpen, setWeeklyOpen] = useState(false)
  const [monthlyOpen, setMonthlyOpen] = useState(false)

  const weeklyText = weekly.focus.boundaryText?.trim() || ""
  const monthlyText = monthly.focus?.boundaryText?.trim() || ""
  const canOpenMonthly = monthly.entitled && Boolean(monthly.cycleKey) && Boolean(monthlyText)

  return (
    <section
      aria-labelledby="boundary-design-heading"
      className="flex flex-col gap-3 rounded-2xl border border-[#E8DFE2] bg-[#FBFDF9] p-4"
    >
      <p
        id="boundary-design-heading"
        className="inline-flex items-center gap-2 font-montserrat text-[14px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]"
      >
        <ShieldCheck className="h-4 w-4" aria-hidden /> Boundary Design &amp; Redesign
      </p>
      <p className="font-sans text-base leading-relaxed text-[#6B5860] text-pretty">
        Review or change how your boundaries protect your time. These open the same boundaries you set in Decide
        &amp; Design™.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" className={cardClass} disabled={!weeklyText} onClick={() => setWeeklyOpen(true)}>
          <span className="inline-flex items-center gap-2 font-sans text-base font-bold text-[#2E1F27]">
            <ShieldCheck className="h-4 w-4 text-[#5A7A45]" aria-hidden /> Weekly Boundary Builder™
          </span>
          <span className="font-sans text-base leading-relaxed text-[#6B5860]">
            {weeklyText
              ? `This week: ${weeklyText}`
              : "Choose this week's boundary in Decide & Design™ or This Week's Boundary Focus™ first."}
          </span>
        </button>

        {monthly.entitled ? (
          <button type="button" className={cardClass} disabled={!canOpenMonthly} onClick={() => setMonthlyOpen(true)}>
            <span className="inline-flex items-center gap-2 font-sans text-base font-bold text-[#2E1F27]">
              <CalendarRange className="h-4 w-4 text-[#5A7A45]" aria-hidden /> Monthly Boundary Builder™
            </span>
            <span className="font-sans text-base leading-relaxed text-[#6B5860]">
              {monthlyText
                ? `This cycle: ${monthlyText}`
                : "Choose this cycle's boundary in Decide & Design™ first."}
            </span>
          </button>
        ) : (
          <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-[#E8DFE2] bg-white px-4 py-3">
            <span className="inline-flex items-center gap-2 font-sans text-base font-bold text-[#6B5860]">
              <Lock className="h-4 w-4" aria-hidden /> Monthly Boundary Builder™
            </span>
            <span className="font-sans text-base leading-relaxed text-[#6B5860]">
              Included with Monthly Membership.
            </span>
          </div>
        )}
      </div>

      {weeklyText && (
        <BoundaryBuilderDialog
          open={weeklyOpen}
          onOpenChange={setWeeklyOpen}
          weekKey={weekly.focus.weekKey}
          boundaryFocusText={weeklyText}
          boundaryOptionId={weekly.focus.optionId}
          cadence="weekly"
        />
      )}
      {canOpenMonthly && monthly.cycleKey && monthly.focus && (
        <BoundaryBuilderDialog
          open={monthlyOpen}
          onOpenChange={setMonthlyOpen}
          weekKey={monthlyBuilderKey(monthly.cycleKey)}
          boundaryFocusText={monthlyText}
          boundaryOptionId={monthly.focus.optionId}
          cadence="monthly"
        />
      )}
    </section>
  )
}
