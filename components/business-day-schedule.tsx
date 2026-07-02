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
import { SCHEDULE, type BlockId } from "@/operating-engine"

/**
 * Maps each schedule block to the chat context key understood by Cherry
 * Blossom's planning workstation. Blocks omitted here (early-access,
 * digital-detox) do not offer inline planning.
 */
const BLOCK_CHAT_CONTEXT: Partial<Record<BlockId, string>> = {
  "morning-given": "morning-routine",
  "movement-window": "workout-window",
  "lunch-break": "lunch-break",
  "ceo-workday": "ceo-workday",
  "time-freedom": "lifestyle-experiences",
  "power-down": "digital-detox",
}

export function BusinessDaySchedule() {
  const experience = useOperatingEngine()

  // Before the first client tick, render the schedule with no active highlight
  // (every block "upcoming") so the markup is stable and SSR-safe.
  const timeline =
    experience?.businessDay.timeline ?? SCHEDULE.map((block) => ({ block, state: "upcoming" as const }))

  return (
    <div id="todays-business-day" className="w-full scroll-mt-20 bg-gradient-to-br from-[#F5F1E8] to-white py-8">
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pb-3 text-center">
          <h2 className="text-pretty font-playfair text-2xl font-medium text-[#5B835F] sm:text-3xl">
            Live Your New 9-5 &amp; Nighttime <span className="text-[#C13B6B]">Non-Negotiable</span> SOPs
          </h2>
          <p className="mt-1 font-montserrat text-sm font-thin italic text-[#6B5860]">
            (Sustainable Operating Practices)
          </p>
        </div>

        {/* Frosted-glass status bar — matches the width of the cards below */}
        <div className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl px-6 py-5 text-center">
            <p className="text-pretty font-playfair text-xl font-medium italic text-[#3A2E33] sm:text-2xl">
              {experience
                ? `${experience.time.dayName}'s ${experience.businessDay.next.shortTitle} starts in ${experience.businessDay.countdownToNext.label}...`
                : "Continue into today's rhythm..."}
            </p>
          </div>
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
            chatContext={BLOCK_CHAT_CONTEXT[block.id]}
            socialSharing={block.id === "time-freedom"}
          />
        ))}
      </div>
    </div>
  )
}
