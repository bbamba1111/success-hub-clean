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
import { SegmentWorkspace } from "@/components/segment-workspace"
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
 * The invitation evolves with the week so the platform feels like a living
 * operating system rather than a static page:
 *   Sun → Sunday Design Day™ (a ~20-min ritual within Time Freedom™)
 *   Mon–Thu → enter that day's Business Day
 *   Fri → Time Freedom begins · Sat → Time Freedom continues
 * 0 = Sunday … 6 = Saturday.
 */
function getInvitation(
  dayOfWeek: number,
  dayName: string,
): { emoji: string; text: string; accent?: string; subheading?: string } {
  // Sunday is NOT a workday — it remains part of the 3-Day Time Freedom™ Weekend.
  // The Design Day is a ~20-minute intentional ritual, not the focus of the day.
  if (dayOfWeek === 0)
    return {
      emoji: "🌸",
      text: "Sunday Design Day™",
      accent: "Design Day™",
      subheading: "Still your Time Freedom™ — spend about 20 intentional minutes designing the week ahead, then get back to your Sunday.",
    }
  // Monday marks the intentional beginning of a new weekly rhythm — not just another workday.
  if (dayOfWeek === 1)
    return {
      emoji: "🌸",
      text: "Welcome to Your Work-Life Balance Business Week™",
      accent: "Business Week™",
      subheading: "Your Redesigned Entry Into the Workweek.",
    }
  if (dayOfWeek === 5) return { emoji: "🌿", text: "Welcome to Time Freedom™" }
  if (dayOfWeek === 6) return { emoji: "🌿", text: "Continue Your Time Freedom™" }
  return {
    emoji: "🌸",
    text: `Enter ${dayName}'s Work-Life Balance Business Day™`,
    accent: `${dayName}'s`,
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
  const invitation = experience
    ? getInvitation(experience.time.dayOfWeek, experience.time.dayName)
    : { emoji: "🌸", text: "Enter Your Work-Life Balance Business Day™" }
  const dayIntention = experience ? getDayIntention(experience.phase.part) : "Today is for intentional living."

  return (
    <section className="relative w-full overflow-hidden">
      {/* Invitation — floats on a soft linen band above the imagery (no heavy color block) */}
      <div className="w-full bg-[#FBF7F0] px-6 py-7 text-center sm:py-9">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-none"
        >
          <h1 className="text-balance font-playfair text-4xl font-semibold leading-tight tracking-tight text-[#1C161A] sm:text-5xl">
            <AccentedTitle text={invitation.text} accent={invitation.accent} />
          </h1>
          <p className="mt-3 font-montserrat text-base font-medium tracking-wide text-[#78AD7D] sm:text-lg">
            {(invitation.subheading ?? dayIntention).replace(/\.\s*$/, "")}{" "}
            <span aria-hidden>{invitation.emoji}</span>
          </p>
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
            className="glass-panel w-full max-w-2xl rounded-3xl p-8 sm:p-10"
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
                className="mt-6 rounded-2xl border border-[#7FB069]/30 bg-white/55 p-5"
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

            {/* Appropriate planner + tools for the segment in session — same
                collapsible workspace used on the activity card below ("as above
                so below"), so members reach it without scrolling. */}
            {experience && (
              <SegmentWorkspace
                blockId={experience.businessDay.current.id}
                isCurrent
                tint={experience.businessDay.current.tint}
              />
            )}

            {/* Enter button at the bottom — label adapts to the current block */}
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
