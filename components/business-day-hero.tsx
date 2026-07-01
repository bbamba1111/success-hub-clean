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
import { FloatingPetals } from "@/components/floating-petals"
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
      {/* Invitation band — sits ABOVE the imagery on the warm logo-cream color */}
      <div className="w-full bg-[#F3EBDD] px-6 py-8 text-center sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="text-balance font-playfair text-3xl font-medium leading-[1.1] tracking-tight text-[#7FB069] sm:text-4xl lg:text-5xl">
            Enter Today&apos;s Work-Life Balance Business Day™
          </h1>
          <p className="mt-3 font-playfair text-lg italic text-[#A9885E] sm:text-xl">Where We Make Time For More™</p>
        </motion.div>
      </div>

      {/* Imagery + dynamic glass card */}
      <div className="relative w-full overflow-hidden">
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
                "linear-gradient(90deg, rgba(255,241,245,0.62) 0%, rgba(255,241,245,0.22) 46%, rgba(255,241,245,0) 68%)",
            }}
          />
        </div>

        {/* Ambient drifting petals — a calm sense of arrival */}
        <FloatingPetals count={16} />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-6 py-16 sm:min-h-[640px] lg:py-24">
          {/* Dynamic glass card — its contents change with the phase of the day */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="glass-panel w-full max-w-2xl rounded-3xl p-8 sm:p-10"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          >
            {/* Status + Day of Week (large editorial serif) */}
            {experience && (
              <div className="flex flex-wrap items-center gap-4">
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
                <span className="font-playfair text-3xl font-medium leading-none text-[#5A4A52] sm:text-4xl">
                  {experience.time.dayName}
                </span>
              </div>
            )}

            {experience && (
              <motion.div
                key={`${experience.businessDay.current.id}-${experience.member.greeting}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                {/* Current activity */}
                <p className="mt-5 text-pretty font-playfair text-2xl font-medium leading-tight text-[#C13B6B] sm:text-3xl">
                  Your {experience.businessDay.current.title}
                </p>

                {/* Up next countdown — directly under the current activity */}
                <p className="mt-2 text-sm font-medium text-[#6B5860]">
                  Up next: {experience.businessDay.next.shortTitle} in{" "}
                  <span className="font-semibold text-[#5A7F46]">{experience.businessDay.countdownToNext.label}</span>
                </p>

                {/* Personalized greeting */}
                <p className="mt-5 text-xl font-semibold text-[#5A4A52] sm:text-2xl">
                  {experience.member.greeting} <span aria-hidden>{experience.member.greetingEmoji}</span>
                </p>

                {/* Encouraging message about the activity at hand */}
                <p className="mt-2 text-base leading-relaxed text-[#5A4A52]">{experience.phase.message}</p>
              </motion.div>
            )}

            {/* Repeat After Me™ affirmation — relevant to the current block */}
            {experience && (
              <motion.div
                key={experience.motivation.affirmations.join("|")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 rounded-2xl border border-[#7FB069]/30 bg-white/55 p-5"
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

            {/* Enter button at the bottom — label adapts to the current block */}
            <div className="mt-8">
              <Button
                size="lg"
                onClick={scrollToRhythm}
                className="bg-[#E26C73] px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
              >
                {experience ? experience.businessDay.current.cta : "Enter Today's Business Day™"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
