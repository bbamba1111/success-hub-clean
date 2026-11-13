"use client"

/**
 * DECIDE & DESIGN™ — Harmony Lane™
 * ---------------------------------------------------------------------------
 * "What are the most important changes I am choosing to make this week so I
 *  can protect my life and contain my work?"
 *
 * The founder reviews the 1–3 life priorities carried forward from the Work-Life
 * Balance Audit™. These priorities are independent of the boundary design below.
 * The founder then personalizes each protected boundary. Each saved plan appears
 * in its respective live space when that boundary arrives.
 *
 * The 4-Hour CEO Workday section separately designs business work for execution.
 * No weekly identity picker or CEO Workday Declaration™ is required to design
 * the business day or personalize its protected boundaries.
 */

import { Briefcase, CalendarDays, Clock, Footprints, MoonStar, Sun, Utensils } from "lucide-react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { CeoWorkdayDesignForm } from "@/components/planners/ceo-workday-design-form"
import { MovementIntentionForm } from "@/components/planners/movement-intention-form"
import { LunchIntentionForm } from "@/components/planners/lunch-intention-form"
import { PowerDownIntentionForm } from "@/components/planners/power-down-intention-form"
import { CherryBlossomWorkstation } from "@/components/cherry-blossom-workstation"
import { PriorityFocusAreas } from "@/components/decide-design/priority-focus-areas"
import { WeeklyLifePrioritiesCard } from "@/components/decide-design/weekly-priorities-designer"
import { TimeFreedomDeclaration } from "@/components/decide-design/time-freedom-declaration"

export function DebriefSpace() {
  // Renders identically on Monday (`monday-debrief`) and Tue–Sun
  // (`daily-planning-gps`) — only the schedule lookup (and therefore the
  // ritual label + time shown just below) differs by day.
  // Read the day from the Operating Engine (platform timezone) so Developer
  // Mode's Time Machine "Simulated Day" is honored — the raw browser clock
  // ignored it and hid the Monday-only audit on every other real day.
  const experience = useOperatingEngine()
  const isMonday = experience?.time.dayOfWeek === 1
  const debriefSchedule = SCHEDULE_BY_ID[isMonday ? "monday-debrief" : "daily-planning-gps"]

  return (
    <section className="mx-auto w-full max-w-5xl space-y-9">
      {/* ── Decide & Design heading ─────────────────────────────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">Decide &amp; Design</p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          This Is Where I Choose How I Live, Work &amp; Lead.
        </h2>
        <p className="inline-flex items-center justify-center gap-2 font-montserrat text-[12px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {isMonday ? "Monday Ritual™" : "Daily Ritual™"} · {debriefSchedule?.timeLabel ?? "10:30–11:00 AM"}
        </p>
      </div>

      {/* ── My 3 Priority Focus Areas™ — carried over from the Reality Check™ ── */}
      <PriorityFocusAreas />

      {/* ── Design My Work-Life Balance Business Day™ ────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm transition-shadow duration-700 hover:shadow-[0_24px_50px_-12px_rgba(28,22,26,0.35)] px-6 py-6 sm:px-8 sm:py-7 space-y-6">
        <div>
          <p className="flex items-center gap-2 font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#C0545A]" aria-hidden />
            Design My Work-Life Balance Business Day™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Design the protected time already built into your day.
          </p>
        </div>

        {/* ── The protected windows of the day, in daily rhythm order ───────── */}
        <div className="space-y-4 pt-2">
          <CollapsibleSubSection title="30-Minute Movement Window" icon={Footprints} iconClassName="text-[#5B835F]">
            <MovementIntentionForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Extended Healthy Hybrid Lunch Break" icon={Utensils} iconClassName="text-[#A8875A]">
            <LunchIntentionForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="4-Hour Focused CEO Workday" icon={Briefcase} iconClassName="text-[#C0545A]">
            <CeoWorkdayDesignForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Time Freedom" icon={Sun} iconClassName="text-[#C9A227]" keepMounted={false}>
            {(open) => (
              <div className="space-y-5">
                <WeeklyLifePrioritiesCard />
                <TimeFreedomDeclaration />
                <CherryBlossomWorkstation
                  context="lifestyle-experiences"
                  active={open}
                />
              </div>
            )}
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Power Down" icon={MoonStar} iconClassName="text-[#7A5C8E]">
            <PowerDownIntentionForm />
          </CollapsibleSubSection>
        </div>
      </div>
    </section>
  )
}
