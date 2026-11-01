"use client"

/**
 * Business Function 5 → Boundary Design & Redesign.
 *
 * The only place the weekly and monthly boundary focus appear inside the
 * CEO Workday™. Each opens on demand and uses the SAME boundary records as
 * Decide & Design™ — it never creates a second weekly or monthly selection.
 * The Monthly Boundary Builder™ is gated by the monthly membership entitlement.
 */

import { useState } from "react"
import { CalendarRange, ChevronDown, Lock, ShieldCheck } from "lucide-react"

import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { useMonthlyBoundaryFocus } from "@/lib/monthly-boundary-focus/use-monthly-boundary-focus"
import { BoundaryFocusPanel } from "@/components/ceo-workday/boundary-focus-panel"
import { MonthlyBoundaryFocusPanel } from "@/components/ceo-workday/monthly-boundary-focus-panel"
import { cn } from "@/lib/utils"

type OpenPanel = "weekly" | "monthly" | null

const cardClass =
  "flex w-full flex-col items-start gap-1 rounded-2xl border border-[#7FB069]/30 bg-white px-4 py-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F3F8ED] hover:shadow-md"

export function BoundaryDesignRedesign() {
  const weekly = useWeeklyBoundaryFocus()
  const monthly = useMonthlyBoundaryFocus()
  const [open, setOpen] = useState<OpenPanel>(null)

  const weeklyText = weekly.focus.boundaryText?.trim() || ""
  const monthlyText = monthly.focus?.boundaryText?.trim() || ""
  const toggle = (panel: Exclude<OpenPanel, null>) => setOpen((current) => (current === panel ? null : panel))

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
        Open your weekly or monthly boundary to review, choose, or change how it protects your time. These are the
        same boundaries you set in Decide &amp; Design™.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={cn(cardClass, open === "weekly" && "border-[#5A7A45] bg-[#F3F8ED]")}
          aria-expanded={open === "weekly"}
          aria-controls="boundary-design-weekly"
          onClick={() => toggle("weekly")}
        >
          <span className="flex w-full items-center justify-between gap-2 font-sans text-base font-bold text-[#2E1F27]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#5A7A45]" aria-hidden /> This Week&apos;s Boundary Focus™
            </span>
            <ChevronDown
              className={cn("h-4 w-4 text-[#5A7A45] transition-transform", open === "weekly" && "rotate-180")}
              aria-hidden
            />
          </span>
          <span className="font-sans text-base leading-relaxed text-[#6B5860]">
            {weeklyText ? `This week: ${weeklyText}` : "Choose this week's boundary."}
          </span>
        </button>

        {monthly.entitled ? (
          <button
            type="button"
            className={cn(cardClass, open === "monthly" && "border-[#5A7A45] bg-[#F3F8ED]")}
            aria-expanded={open === "monthly"}
            aria-controls="boundary-design-monthly"
            onClick={() => toggle("monthly")}
          >
            <span className="flex w-full items-center justify-between gap-2 font-sans text-base font-bold text-[#2E1F27]">
              <span className="inline-flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-[#5A7A45]" aria-hidden /> Monthly Boundary Focus™
              </span>
              <ChevronDown
                className={cn("h-4 w-4 text-[#5A7A45] transition-transform", open === "monthly" && "rotate-180")}
                aria-hidden
              />
            </span>
            <span className="font-sans text-base leading-relaxed text-[#6B5860]">
              {monthlyText ? `This cycle: ${monthlyText}` : "Choose this cycle's boundary in Decide & Design™."}
            </span>
          </button>
        ) : (
          <div className="flex flex-col items-start gap-1 rounded-2xl border border-dashed border-[#E8DFE2] bg-white px-4 py-3">
            <span className="inline-flex items-center gap-2 font-sans text-base font-bold text-[#6B5860]">
              <Lock className="h-4 w-4" aria-hidden /> Monthly Boundary Focus™
            </span>
            <span className="font-sans text-base leading-relaxed text-[#6B5860]">
              Included with Monthly Membership.
            </span>
          </div>
        )}
      </div>

      {open === "weekly" && (
        <div id="boundary-design-weekly">
          <BoundaryFocusPanel />
        </div>
      )}
      {open === "monthly" && monthly.entitled && (
        <div id="boundary-design-monthly">
          <MonthlyBoundaryFocusPanel />
        </div>
      )}
    </section>
  )
}
