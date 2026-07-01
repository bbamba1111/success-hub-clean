"use client"

/**
 * BusinessDaySchedule — pure presentation layer for the Work-Life Balance
 * Business Day™ timeline.
 *
 * The full list of blocks, their order, times, images, tints, CTAs, and the
 * per-block current/upcoming/completed state all come from the shared
 * Operating Engine via `useOperatingEngine()`. This component just maps the
 * engine's timeline into cards — it owns no schedule data or time logic.
 */

import { BusinessDayBlock } from "@/components/business-day-block"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { SCHEDULE } from "@/operating-engine"

export function BusinessDaySchedule() {
  const experience = useOperatingEngine()

  // Before the first client tick, render the schedule with no active highlight
  // (every block "upcoming") so the markup is stable and SSR-safe.
  const timeline =
    experience?.businessDay.timeline ?? SCHEDULE.map((block) => ({ block, state: "upcoming" as const }))

  return (
    <div id="todays-business-day" className="w-full scroll-mt-20 bg-gradient-to-br from-[#F5F1E8] to-white py-8">
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pb-2 text-center">
          <h2 className="text-pretty text-2xl font-bold text-[#C13B6B] sm:text-3xl">
            Live Your New 9-5 &amp; <span className="text-[#7FB069]">Nighttime Non-Negotiable SOPs</span>
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#7FB069]">(Sustainable Operating Practices)</p>
          <p className="mt-1 text-sm font-medium text-[#6B5860]">
            {experience
              ? `It's ${experience.time.dayName}. ${experience.businessDay.next.shortTitle} starts in ${experience.businessDay.countdownToNext.label}.`
              : "Continue into today's rhythm."}
          </p>
        </div>

        {timeline.map(({ block, state }) => (
          <BusinessDayBlock
            key={block.id}
            sectionId={block.sectionId}
            backgroundImage={block.backgroundImage}
            tint={block.tint}
            emoji={block.emoji}
            time={block.timeLabel}
            title={block.title}
            buttonText={block.cta}
            status={state}
            href={block.href}
            description={block.description}
          />
        ))}
      </div>
    </div>
  )
}
