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
import type { PartOfDay, SessionStatus } from "@/operating-engine"

const STATUS_META: Record<SessionStatus, { label: string; icon: string; className: string; glow?: boolean }> = {
  LIVE: { label: "In Session", icon: "🌸", className: "bg-[#78AD7D] text-white", glow: true },
  NEXT: { label: "STARTING NEXT", icon: "🌸", className: "bg-[#78AD7D] text-white", glow: true },
  NIGHT: { label: "CLOSED FOR THE NIGHT", icon: "🌙", className: "bg-[#3A3340] text-white" },
  OPEN: { label: "COMMUNITY OPEN", icon: "🌅", className: "bg-white/85 text-[#3A3340]" },
}

function scrollToRhythm() {
  const el = document.getElementById("todays-business-day")
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Returns the correct heading, subline, badge pill text, and emoji
 * based purely on the current calendar day + time.
 * This is the single source of truth for the hero — no workflow state,
 * no theme engine, no Synchronize™ / Execute™ / Optimize™ / Finish Strong™.
 *
 * Time Freedom™ window: Thursday 5:00 PM → Monday 7:00 AM.
 */
function getCalendarInvitation(): {
  text: string
  accent?: string
  subheading: string
  badge: string
  emoji: string
} {
  const now = new Date()
  const day = now.getDay()   // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const hour = now.getHours()

  // ── Time Freedom™ window ──────────────────────────────────────────────────
  if (day === 4 && hour >= 17) return {
    text: "Join Your Time Freedom™",
    accent: "Time Freedom™",
    subheading: "Your business week is complete. Protect the freedom you intentionally created.",
    badge: "TIME FREEDOM™",
    emoji: "🌿",
  }
  if (day === 5) return {
    text: "Join Your Time Freedom™",
    accent: "Time Freedom™",
    subheading: "Your business week is complete. Protect the freedom you intentionally created.",
    badge: "TIME FREEDOM™",
    emoji: "🌿",
  }
  if (day === 6) return {
    text: "Join Your Time Freedom™",
    accent: "Time Freedom™",
    subheading: "Slow down, recharge, connect, and enjoy the life you designed your business to support.",
    badge: "TIME FREEDOM™",
    emoji: "🌿",
  }
  if (day === 0) return {
    text: "Join Your Time Freedom™",
    accent: "Time Freedom™",
    subheading: "Enjoy the final day of your Time Freedom™. Reflect and prepare to begin another Work-Life Balance Business Week™ tomorrow.",
    badge: "TIME FREEDOM™",
    emoji: "🌿",
  }
  if (day === 1 && hour < 7) return {
    text: "Join Your Time Freedom™",
    accent: "Time Freedom™",
    subheading: "Enjoy the final day of your Time Freedom™. Reflect and prepare to begin another Work-Life Balance Business Week™ tomorrow.",
    badge: "TIME FREEDOM™",
    emoji: "🌿",
  }

  // ── Workweek days ─────────────────────────────────────────────────────────
  if (day === 1) return {
    text: "Join Make Time For More Mondays™",
    accent: "Mondays™",
    subheading: "Your Redesigned Entry Into the Workweek. Begin another Work-Life Balance Business Week™ with clarity, purpose, and balance.",
    badge: "MAKE TIME FOR MORE MONDAYS™",
    emoji: "🌸",
  }
  if (day === 2) return {
    text: "Join Tuesday's Work-Life Balance Business Day™",
    accent: "Tuesday's",
    subheading: "Continue living the commitments you designed. Protect your rhythm. Lead with intention.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
    emoji: "🌸",
  }
  if (day === 3) return {
    text: "Join Wednesday's Work-Life Balance Business Day™",
    accent: "Wednesday's",
    subheading: "Consistency creates momentum. Honor today's commitments and continue building the life you designed.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
    emoji: "🌸",
  }
  if (day === 4) return {
    text: "Join Thursday's Work-Life Balance Business Day™",
    accent: "Thursday's",
    subheading: "Finish your business week strong. Complete what matters most before entering Time Freedom™.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
    emoji: "🌸",
  }

  // Fallback
  return {
    text: "Join Your Work-Life Balance Business Day™",
    subheading: "Live, Lead, and Love Today.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
    emoji: "🌸",
  }
}

/**
 * Renders a headline with one accent phrase highlighted in the signature coral
 * italic, so key words (e.g. the day name) stand out against a black title.
 */
function AccentedTitle({ text, accent }: { text: string; accent?: string }) {
  if (!accent || !text.includes(accent)) return <>{text}</>
  const [before, after] = text.split(accent)
  return (
    <>
      {before}
      <span className="italic text-[#C13B6B]">{accent}</span>
      {after}
    </>
  )
}

/** A short, dynamic line that reinforces the rhythm of the current phase. */
function getDayIntention(part: PartOfDay): string {
  switch (part) {
    case "morning":
      return "Today is for intentional beginnings."
    case "ceo":
      return "Today is for focused execution."
    case "evening":
      return "Today is for restoration."
    default:
      return "Today is for intentional living."
  }
}

export function BusinessDayHero() {
  const experience = useOperatingEngine()

  // Stable fallback background before the first client tick.
  const backgroundImage = experience?.theme.backgroundImage ?? "/images/business-day-hero-bg.png"
  const status = experience ? STATUS_META[experience.businessDay.status] : null

  // Calendar-driven invitation — day of week + time is the single source of truth.
  // No workflow state (Synchronize/Execute/Optimize/Finish Strong) involved.
  const invitation = getCalendarInvitation()

  const dayIntention = experience ? getDayIntention(experience.phase.part) : "Today is for intentional living."

  return (
    <section className="relative w-full overflow-hidden">
      {/* Above-hero copy band — centered, no portrait */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex max-w-3xl flex-col items-center px-6 py-[38px] text-center sm:py-[45px]"
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-[#5B835F]/30 bg-[#5B835F]/10 px-4 py-1.5 font-montserrat text-[16px] font-semibold tracking-wide text-[#3a5c3d]">
            <span className="shrink-0 text-[11px] leading-none" aria-hidden>🌸</span>
            Make Time For More™
          </div>

          {/* Primary headline — single line */}
          <h1 className="whitespace-nowrap font-playfair text-3xl font-semibold leading-tight tracking-tight text-[#1C161A] sm:text-4xl lg:text-5xl">
            {"Join "}
            <span className="italic text-[#C13B6B]">{"Today's"}</span>
            {" Work-Life Balance Business Day™"}
          </h1>
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

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-6 py-16 sm:min-h-[640px] lg:py-24">
          {/* Dynamic glass card — its contents change with the phase of the day */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="glass-panel w-full max-w-2xl rounded-2xl p-8 sm:p-10"
            style={{ backgroundColor: "rgba(253, 250, 245, 0.9)" }}
          >
            {experience && (
              <motion.div
                key={`${experience.businessDay.current.id}-${experience.member.greeting}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                {/* Live status */}
                {status && (
                  <motion.span
                    key={status.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] shadow-sm ${status.className}`}
                  >
                    <span aria-hidden className={status.glow ? "blossom-glow" : undefined}>
                      {status.icon}
                    </span>
                    {status.label}
                  </motion.span>
                )}

                {/* Current activity — full title in signature coral (the one non-sage headline) */}
                <p className="mt-4 text-pretty font-playfair text-3xl font-medium leading-tight text-[#C13B6B] sm:text-4xl">
                  {experience.businessDay.current.title}
                </p>
                <p className="mt-1 text-base font-medium text-[#5A4A52]">
                  {experience.businessDay.current.timeLabel}
                </p>

                {/* Up next countdown — directly under the current activity */}
                <p className="mt-2 text-sm font-medium text-[#5A4A52]">
                  Up next: {experience.businessDay.next.shortTitle} ·{" "}
                  <span className="font-semibold text-[#78AD7D]">{experience.businessDay.countdownToNext.label}</span>
                </p>

                {/* Personalized greeting — sage, Playfair italic */}
                <p className="mt-6 font-playfair text-2xl font-medium italic text-[#78AD7D] sm:text-3xl">
                  {experience.member.greeting} <span aria-hidden>{experience.member.greetingEmoji}</span>
                </p>

                {/* Encouraging message about the activity at hand */}
                <p className="mt-2 text-base leading-relaxed text-[#4A3A42]">{experience.phase.message}</p>
              </motion.div>
            )}

            {/* Repeat After Me™ affirmation — relevant to the current block */}
            {experience && (
              <motion.div
                key={experience.motivation.affirmations.join("|")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 rounded-xl border border-[#7FB069]/30 bg-white/55 p-5"
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#78AD7D]">
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

            {/* Enter button at the bottom — label adapts to the current block.
                The planner/tools now live in the full-width Operating Planner™
                workspace BELOW the hero (Phase 3B.1): the hero is orientation
                only and never contains forms or planners. */}
            <div className="mt-8">
              <Button
                size="lg"
                onClick={scrollToRhythm}
                className="bg-[#78AD7D] px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#6a9c6f]"
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
