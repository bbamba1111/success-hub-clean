"use client"

/**
 * DECIDE & DESIGN™ — Harmony Lane™
 * ---------------------------------------------------------------------------
 * "What are the most important changes I am choosing to make this week so I
 *  can protect my life and contain my work?"
 *
 * The founder chooses EXACTLY THREE weekly priorities — Life, Delegation,
 * Operating Rule — each with a first-person intention, then weaves them into
 * one Weekly Declaration™ (WorkdayDeclaration, persisted on the weekly
 * commitments record and read at the top of the live CEO Workday™ all week).
 *
 * Today's work no longer lives here. "What Must Happen Today™" and its four
 * protected hours now belong to the live CEO Workday™ (FounderGpsWorkspace),
 * where the founder brings their real business work into the protected
 * container. Decide & Design is purely the weekly redesign: who I'm being,
 * my three priorities, my declaration, and the protected windows of my day.
 */

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { CeoWorkdayDesignForm } from "@/components/planners/ceo-workday-design-form"
import { MovementIntentionForm } from "@/components/planners/movement-intention-form"
import { LunchIntentionForm } from "@/components/planners/lunch-intention-form"
import { PowerDownIntentionForm } from "@/components/planners/power-down-intention-form"
import { CherryBlossomWorkstation } from "@/components/cherry-blossom-workstation"
import { TimeFreedomSocial } from "@/components/time-freedom-social"
import { UpcomingLifeEvents } from "@/components/cherry-blossom/upcoming-life-events"
import { PriorityFocusAreas } from "@/components/decide-design/priority-focus-areas"
import { WeeklyPrioritiesDesigner, WeeklyLifePrioritiesCard } from "@/components/decide-design/weekly-priorities-designer"
import { WorkdayDeclaration } from "@/components/decide-design/workday-declaration"
import { TimeFreedomDeclaration } from "@/components/decide-design/time-freedom-declaration"
import { DecideIdentitySpace } from "@/components/daily-identity/decide-identity-space"

export function DebriefSpace() {
  // Renders identically on Monday (`monday-debrief`) and Tue–Sun
  // (`daily-planning-gps`) — only the schedule lookup (and therefore the
  // ritual label + time shown just below) differs by day.
  const [isMonday, setIsMonday] = useState(true)
  useEffect(() => {
    setIsMonday(new Date().getDay() === 1)
  }, [])
  const debriefSchedule = SCHEDULE_BY_ID[isMonday ? "monday-debrief" : "daily-planning-gps"]

  // Seeded from the Time Freedom collapsible's Life Events™ list — bumping this
  // with a new prompt string auto-sends it into the adjacent Cherry Blossom chat.
  const [timeFreedomPrompt, setTimeFreedomPrompt] = useState<string | undefined>(undefined)

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      {/* ── Header ─── heading sits ABOVE the identity box ───────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">Decide &amp; Design</p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          This Is Where I Choose How I Live, Work &amp; Lead.
        </h2>
        <p className="inline-flex items-center justify-center gap-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {isMonday ? "Monday Ritual™" : "Daily Ritual™"} · {debriefSchedule?.timeLabel ?? "10:30–11:00 AM"}
        </p>
      </div>

      {/* ── My 3 Priority Focus Areas™ — carried over from the Reality Check™ ── */}
      <PriorityFocusAreas />

      {/* Identity box — moved under the heading so the two are reversed. */}
      <DecideIdentitySpace />

      {/* ── My Weekly Work-Life Balance Boundary Focus™ (ends with Save My Week) ── */}
      <WeeklyPrioritiesDesigner />

      {/* ── My 4-Hour CEO Workday Declaration™ — woven from who you're being,
           your weekly life priorities, and your boundary focus. */}
      <div className="rounded-3xl border border-[#7FB069]/30 bg-white shadow-sm px-6 py-6 sm:px-8 sm:py-7">
        <WorkdayDeclaration mode="build" />
      </div>

      {/* Half-inch of breathing room before designing the day. */}
      <div aria-hidden className="h-12" />

      {/* ── Design My Work-Life Balance Business Day™ ────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-6">
        <div>
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Design My Work-Life Balance Business Day™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Design the protected time already built into your day.
          </p>
        </div>

        {/* ── The protected windows of the day, in daily rhythm order ───────── */}
        <div className="space-y-4 pt-2">
          <CollapsibleSubSection title="30-Minute Movement Window">
            <MovementIntentionForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Extended Healthy Hybrid Lunch Break">
            <LunchIntentionForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="4-Hour Focused CEO Workday">
            <CeoWorkdayDesignForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Time Freedom" keepMounted={false}>
            {(open) => (
              <div className="space-y-5">
<WeeklyLifePrioritiesCard />
<TimeFreedomDeclaration />
<UpcomingLifeEvents onPlan={setTimeFreedomPrompt} />
                <CherryBlossomWorkstation
                  context="lifestyle-experiences"
                  active={open}
                  pendingPrompt={timeFreedomPrompt}
                />
                <TimeFreedomSocial active={open} />
              </div>
            )}
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Power Down">
            <PowerDownIntentionForm />
          </CollapsibleSubSection>
        </div>
      </div>
    </section>
  )
}
