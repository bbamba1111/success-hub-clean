"use client"

/**
 * DECIDE & DESIGN™ — Harmony Lane™
 * ---------------------------------------------------------------------------
 * "What are the most important changes I am choosing to make this week so I
 *  can protect my life and contain my work?"
 *
 * The founder chooses EXACTLY THREE weekly priorities — Life, Delegation,
 * Operating Rule — each with a first-person intention. There is no fourth
 * category; the Business Bottleneck Audit™ and GPS inform the system quietly
 * (e.g. delegation suggestions) but never add founder-facing priorities here.
 *
 * "Design My Work-Life Balance Business Day™" keeps the existing Movement,
 * Lunch, Time Freedom and Power Down experiences untouched. The old CEO Workday
 * DESIGN form (240-minute activity planner) is replaced by a read-through of the
 * three commitments. The live GPS-driven CEO Workday™ in FounderGpsWorkspace is
 * not modified — it remains the protected container for real business work.
 */

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { MovementIntentionForm } from "@/components/planners/movement-intention-form"
import { LunchIntentionForm } from "@/components/planners/lunch-intention-form"
import { PowerDownIntentionForm } from "@/components/planners/power-down-intention-form"
import { CherryBlossomWorkstation } from "@/components/cherry-blossom-workstation"
import { TimeFreedomSocial } from "@/components/time-freedom-social"
import { UpcomingLifeEvents } from "@/components/cherry-blossom/upcoming-life-events"
import { WeeklyPrioritiesDesigner } from "@/components/decide-design/weekly-priorities-designer"
import { WeeklyCommitmentsSummary } from "@/components/decide-design/weekly-commitments-summary"

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
    <section className="w-full space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">Decide &amp; Design™</p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          This is where I choose how I want to enter and operate my week.
        </h2>
      </div>

      {/* ── Title card ─────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#5B835F]" aria-hidden />
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            {isMonday ? "Monday Ritual™" : "Daily Ritual™"} · {debriefSchedule?.timeLabel ?? "10:30–11:00 AM"}
          </p>
        </div>
        <p className="font-serif text-2xl font-semibold text-[#2E1F27] leading-snug">
          Protect my life. Move one thing off my plate. Change one condition of how work operates.
        </p>

        {/* ── Permission-giving intro ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-5 py-4">
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
            You have permission to design intentionally, not react. There&apos;s nowhere to rush to — you are not
            being given more work. You are choosing three changes.
          </p>
        </div>

        {/* ── Cherry Blossom coaching ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-6 py-5 flex gap-4 items-start">
          <div className="shrink-0 mt-0.5">
            <span className="text-xl select-none" role="img" aria-label="Cherry blossom">
              🌸
            </span>
          </div>
          <div className="space-y-2">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
            <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">
              Sit with what surfaced — then choose deliberately.
            </p>
            <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
              Awareness without a pause to process it rarely becomes lasting change. Take a few quiet minutes, then
              choose your three weekly priorities below — what you decide here stays with you Monday through Thursday.
            </p>
          </div>
        </div>
      </div>

      {/* ── Decide My Three Weekly Priorities™ ──────────────────────────────── */}
      <WeeklyPrioritiesDesigner />

      {/* ── Design My Work-Life Balance Business Day™ ────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm px-8 py-7 space-y-4">
        <div>
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Design My Work-Life Balance Business Day™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Open any section below to plan the protected time already built into your day. The CEO Workday™ itself is
            the protected work container.
          </p>
        </div>

        <CollapsibleSubSection title="30-Minute Movement Window">
          <MovementIntentionForm />
        </CollapsibleSubSection>

        <CollapsibleSubSection title="4-Hour Focused CEO Workday">
          <WeeklyCommitmentsSummary />
        </CollapsibleSubSection>

        <CollapsibleSubSection title="Extended Healthy Hybrid Lunch Break">
          <LunchIntentionForm />
        </CollapsibleSubSection>

        <CollapsibleSubSection title="Time Freedom">
          {(open) => (
            <div className="space-y-5">
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
    </section>
  )
}
