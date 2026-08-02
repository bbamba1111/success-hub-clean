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
import { useOperatingEngine } from "@/components/operating-engine-provider"
import type { PartOfDay } from "@/operating-engine"

/**
 * Maps each block ID → the full "We're Now ___" phrase (plain + italic parts).
 * plain: the non-italic prefix after "We're Now "
 * italic: the italic accent phrase
 */
const BLOCK_SENTENCE: Record<string, { plain: string; italic: string }> = {
  // Monday-only block
  "monday-reality-check":  { plain: "Making Time For More On", italic: "Mondays™" },
  // Standard blocks
  "early-access":    { plain: "In Flex Time or Preparing For",            italic: "The Work-Life Balance Business Day™" },
  "morning-given":   { plain: "Aligning Our Energy In The",               italic: "Morning GIV\u2022EN™ Routine" },
  "movement-window": { plain: "Moving Our Bodies In The",                 italic: "30-Minute Movement Window™" },
  "lunch-break":     { plain: "Nourishing Ourselves In The",              italic: "Extended Healthy Hybrid Lunch™" },
  "ceo-workday":     { plain: "Building Our Businesses In",               italic: "The 4-Hour Focused CEO Workday™" },
  "time-freedom":    { plain: "Making Time For More In",                  italic: "Time Freedom™" },
  "power-down":      { plain: "Releasing The Day In",                     italic: "Power Down™" },
  "digital-detox":   { plain: "Closed & Resting In The",                  italic: "Unplug Digital Detox™" },
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

  // Use the business-day engine's current block image so weekend overrides
  // (Time Freedom all-day on Fri/Sat/Sun) are reflected correctly.
  const backgroundImage = experience?.businessDay.current.backgroundImage ?? "/images/business-day-hero-bg.png"
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
          className="mx-auto flex max-w-4xl flex-col items-center px-6 py-5 text-center sm:py-6"
        >
          {/* Lines 1+2 — special static heading for Monday, "We're Now..." for all others */}
          {experience ? (() => {
            const isMondayBlock = experience.businessDay.current.id === "monday-reality-check"
            const s = BLOCK_SENTENCE[experience.businessDay.current.id]
            const isLunch = experience.businessDay.current.id === "lunch-break"

            if (isMondayBlock) {
              return (
                <h1 className="flex flex-col items-center gap-0.5 font-playfair leading-tight tracking-tight">
                  {/* Main title — upright, black, same size as other segment H1s */}
                  <span className="not-italic font-semibold text-[#1C161A] text-[27px] sm:text-[32px] lg:text-[43px]">
                    {"Make Time For More On Mondays\u2122"}
                  </span>
                  {/* Subheading — italic, normal weight, pink-to-green gradient */}
                  <span className="italic font-normal text-[18px] sm:text-[21px] lg:text-[28px] bg-gradient-to-r from-[#C13B6B] to-[#4A7C59] bg-clip-text text-transparent">
                    {"Redesign Your Entry Into The Workweek\u2122"}
                  </span>
                </h1>
              )
            }

            return (
              <h1 className="flex flex-col items-center font-playfair text-[27px] font-semibold leading-tight tracking-tight sm:text-[32px] lg:text-[43px] gap-0">
                <span className="text-[#1C161A]">
                  {"We\u2019re Now "}
                  {s ? s.plain : experience.businessDay.current.shortTitle}
                </span>
                {s && (
                  <span className="italic text-[#C13B6B]">{s.italic}</span>
                )}
              </h1>
            )
          })() : (
            <h1 className="flex flex-col items-center gap-0.5 font-playfair text-[27px] font-semibold leading-tight tracking-tight sm:text-[32px] lg:text-[43px]">
              <span className="text-[#1C161A]">{"Join Today\u2019s"}</span>
              <span className="italic text-[#C13B6B]">{"Work-Life Balance Business Day\u2122"}</span>
            </h1>
          )}

          {/* Sub-line — timeLabel • Next: [shortTitle] · countdown
              On the Monday block, always show "Next: Morning GIV•EN™" regardless
              of what the engine's next pointer resolves to. */}
          {experience && (() => {
            const isMondayBlock = experience.businessDay.current.id === "monday-reality-check"
            const timeLabel = isMondayBlock ? "9:00–9:45 AM" : experience.businessDay.current.timeLabel
            const nextLabel = isMondayBlock ? "Morning GIV\u2022EN\u2122" : experience.businessDay.next.shortTitle
            return (
              <p className="mt-1.5 inline-flex flex-wrap items-center gap-2.5 font-montserrat text-[13px] font-medium text-[#5A4A52] sm:text-[14px]">
                {/* Pulsating blossom + NOW LIVING — inherits sub-line color and size, no badge */}
                <span className="inline-flex items-center gap-1 uppercase tracking-[0.18em] text-[#78AD7D]">
                  <span className="relative flex h-[12px] w-[12px] shrink-0 items-center justify-center">
                    <span className="absolute inset-[-2px] animate-ping rounded-full" style={{ backgroundColor: "rgba(120,173,125,0.30)", animationDuration: "2s" }} />
                    <span className="relative text-[10px] leading-none" style={{ animation: "pulse 2s ease-in-out infinite" }}>🌸</span>
                  </span>
                  Now Living
                </span>
                {timeLabel}
                <span className="text-[#C8B89A]">&bull;</span>
                <span className="text-[#78AD7D]">{"Next: "}</span>
                <span className="italic">{nextLabel}</span>
                <span className="text-[#C8B89A]">&bull;</span>
                <span className="tabular-nums text-[#78AD7D]">
                  {experience.businessDay.countdownToNext.label}
                </span>
              </p>
            )
          })()}
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
            className="h-full w-full object-cover object-center"
          />
          {/* Soft left-weighted wash — reduced so more background shows through */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,241,245,0.42) 0%, rgba(255,241,245,0.12) 46%, rgba(255,241,245,0) 68%)",
            }}
          />
        </div>



        <div className="min-h-[420px] sm:min-h-[500px]" />
      </div>
    </section>
  )
}
