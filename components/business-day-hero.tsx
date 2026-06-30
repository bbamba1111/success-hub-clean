"use client"

/**
 * BusinessDayHero — pure presentation layer.
 *
 * This component renders whatever the shared Operating Engine returns for the
 * current moment. It contains NO time math, schedule data, affirmations, or
 * auth logic — all of that lives in `@/operating-engine` and is delivered via
 * `useOperatingEngine()`. The Hero simply asks "what should this member
 * experience right now?" and renders it.
 */

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import type { SessionStatus } from "@/operating-engine"

const STATUS_META: Record<SessionStatus, { label: string; icon: string; className: string }> = {
  LIVE: { label: "LIVE NOW", icon: "🔴", className: "bg-[#E26C73] text-white" },
  NEXT: { label: "STARTING NEXT", icon: "🟢", className: "bg-[#7FB069] text-white" },
  NIGHT: { label: "CLOSED FOR THE NIGHT", icon: "🌙", className: "bg-[#2E2A3A] text-white" },
  OPEN: { label: "COMMUNITY OPEN", icon: "🌅", className: "bg-white/85 text-[#5A4A52]" },
}

function scrollToRhythm() {
  const el = document.getElementById("todays-business-day")
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function BusinessDayHero() {
  const experience = useOperatingEngine()

  // Stable fallback background before the first client tick.
  const backgroundImage = experience?.theme.backgroundImage ?? "/images/business-day-hero-bg.png"
  const status = experience ? STATUS_META[experience.businessDay.status] : null

  return (
    <section className="relative w-full overflow-hidden">
      {/* Dynamic background — provided by the engine's Theme Engine (current block image) */}
      <div className="absolute inset-0">
        <img
          key={backgroundImage}
          src={backgroundImage || "/placeholder.svg"}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Soft left-weighted wash so the glass panel reads clearly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.72) 0%, rgba(255,241,245,0.3) 42%, rgba(255,241,245,0) 64%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-16 sm:min-h-[600px] lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-3xl border border-white/40 bg-white/25 p-8 shadow-xl backdrop-blur-md sm:p-10"
        >
          {/* Dynamic day + status row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-[#5A4A52]">
              <span aria-hidden>🌸</span>
              {experience ? `Today is ${experience.time.dayName}` : "Today"}
            </span>
            {status && (
              <motion.span
                key={status.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] shadow-sm ${status.className}`}
              >
                <span aria-hidden>{status.icon}</span>
                {status.label}
              </motion.span>
            )}
          </div>

          <h1 className="text-pretty text-4xl font-bold leading-tight text-[#C13B6B] sm:text-5xl">
            Join Today&apos;s <span className="text-[#7FB069]">Work-Life Balance Business Day™</span>
          </h1>

          <p className="mt-4 text-lg font-semibold text-[#5A4A52]">
            Live Intentionally. Work Smarter. Lead Successfully.
          </p>

          {/* Personalized greeting + dynamic phase message */}
          {experience && (
            <motion.div
              key={`${experience.member.greeting}-${experience.phase.message}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5"
            >
              <p className="text-xl font-bold text-[#C13B6B] sm:text-2xl">
                {experience.member.greeting} <span aria-hidden>{experience.member.greetingEmoji}</span>
              </p>
              <p className="mt-2 text-base leading-relaxed text-[#6B5860]">{experience.phase.message}</p>
            </motion.div>
          )}

          {/* Current time block + live countdown to the next block */}
          {experience && (
            <motion.div
              key={`${experience.businessDay.current.id}-${experience.businessDay.countdownToNext.label}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-white/50 bg-white/45 px-4 py-3 text-sm backdrop-blur-sm"
            >
              <span aria-hidden>{experience.businessDay.current.emoji}</span>
              <span className="font-semibold text-[#4A3A42]">Now: {experience.businessDay.current.shortTitle}</span>
              <span className="text-[#8A7A82]">·</span>
              <span className="text-[#6B5860]">
                {experience.businessDay.next.shortTitle} in{" "}
                <span className="font-semibold text-[#5A7F46]">{experience.businessDay.countdownToNext.label}</span>
              </span>
            </motion.div>
          )}

          {/* AI coaching message — rotates daily */}
          {experience && (
            <motion.p
              key={experience.motivation.coachingMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-pretty text-sm italic leading-relaxed text-[#5A7F46]"
            >
              {experience.motivation.coachingMessage}
            </motion.p>
          )}

          {/* Repeat After Me™ affirmation card — rotates daily */}
          {experience && (
            <motion.div
              key={experience.motivation.affirmations.join("|")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 rounded-2xl border border-[#7FB069]/30 bg-white/55 p-5 backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">
                <span aria-hidden>🌸</span>
                Repeat After Me™
              </p>
              <ul className="mt-3 space-y-1.5">
                {experience.motivation.affirmations.map((line) => (
                  <li key={line} className="text-pretty text-base font-medium italic leading-relaxed text-[#4A3A42]">
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* One primary CTA — label adapts to the current block */}
          <div className="mt-8">
            <Button
              size="lg"
              onClick={scrollToRhythm}
              className="bg-[#E26C73] px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              {experience ? experience.businessDay.current.cta : "Enter Today's Business Day™"}
            </Button>
          </div>

          {/* Scroll indicator */}
          <motion.button
            type="button"
            onClick={scrollToRhythm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ delay: 0.4, y: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#5A7F46] hover:text-[#4A6B38]"
          >
            <span aria-hidden>↓</span>
            Continue Into Today&apos;s Rhythm
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
