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

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
import { WorkdayDeclaration } from "@/components/decide-design/workday-declaration"
import { WhatMustHappenToday } from "@/components/decide-design/what-must-happen-today"
import { TodaysWorkdayCard } from "@/components/decide-design/todays-workday-card"
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

  // Save My Day → the Workday Declaration™ is revealed on its own for 10 seconds,
  // then drops down into the "4-Hour Focused CEO Workday" panel, which opens.
  const [reveal, setReveal] = useState<string | null>(null)
  const [workdayOpen, setWorkdayOpen] = useState(false)
  const [editSignal, setEditSignal] = useState(0)
  const workdayPanelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!reveal) return
    const t = setTimeout(() => {
      setReveal(null)
      setWorkdayOpen(true)
      workdayPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 10_000)
    return () => clearTimeout(t)
  }, [reveal])

  return (
    <section className="w-full space-y-6">
      {/* ── Header ─── heading now sits ABOVE the identity box (reversed) ────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">Decide &amp; Design</p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          This is where I redesign my workweek; choose how I live, work and lead in it and decide what must happen today.
        </h2>
        <p className="inline-flex items-center justify-center gap-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {isMonday ? "Monday Ritual™" : "Daily Ritual™"} · {debriefSchedule?.timeLabel ?? "10:30–11:00 AM"}
        </p>
      </div>

      {/* Identity box — moved under the heading so the two are reversed. */}
      <DecideIdentitySpace />

      {/* ── Decide My Three Weekly Priorities™ (ends with Save My Week) ──────── */}
      <WeeklyPrioritiesDesigner />

      {/* ── Workday Declaration™ reveal — 10 seconds, then drops into the panel below ── */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            key="reveal"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 160, scale: 0.96 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-3xl border-2 border-[#7FB069]/40 bg-white shadow-lg px-8 py-8 space-y-4"
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
              My Workday Declaration™
            </p>
            <p className="font-serif text-xl italic leading-relaxed text-[#2E1F27] sm:text-2xl text-pretty">{reveal}</p>
            <p className="font-sans text-sm text-[#6B5860]">
              Read it aloud. In a moment it settles into your 4-Hour Focused CEO Workday below.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Half-inch of breathing room after Save My Week, before designing the day. */}
      <div aria-hidden className="h-12" />

      {/* ── Design My Work-Life Balance Business Day™ ────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm px-8 py-7 space-y-6">
        <div>
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Design My Work-Life Balance Business Day™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Read your declaration, decide what must happen today, then design the protected time already built into
            your day.
          </p>
        </div>

        {/* My Workday Declaration™ — first, woven from this week's three priorities. */}
        <div className="rounded-2xl border border-[#E8DFE2] bg-white px-6 py-6 sm:px-7">
          <WorkdayDeclaration mode="build" />
        </div>

        {/* What Must Happen Today™ → Save My Day (creates today's CEO Workday™). */}
        <WhatMustHappenToday onSaved={(text) => setReveal(text)} editSignal={editSignal} />

        {/* ── Design My Business Day™ — the protected windows, Movement first ─── */}
        <div className="space-y-4 pt-2">
          <p className="font-montserrat text-sm font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Design My Business Day™
          </p>

          <CollapsibleSubSection title="30-Minute Movement Window">
            <MovementIntentionForm />
          </CollapsibleSubSection>

          <div ref={workdayPanelRef} className="scroll-mt-6">
            <CollapsibleSubSection title="4-Hour Focused CEO Workday" open={workdayOpen} onOpenChange={setWorkdayOpen}>
              <TodaysWorkdayCard
                onEdit={() => {
                  setEditSignal((n) => n + 1)
                }}
              />
            </CollapsibleSubSection>
          </div>

          <CollapsibleSubSection title="Extended Healthy Hybrid Lunch Break">
            <LunchIntentionForm />
          </CollapsibleSubSection>

          <CollapsibleSubSection title="Time Freedom" keepMounted={false}>
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
      </div>
    </section>
  )
}
