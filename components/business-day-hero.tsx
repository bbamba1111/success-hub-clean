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
import type { PartOfDay } from "@/operating-engine"

/** Scroll to the currently-active segment card by its sectionId. */
function scrollToActiveSegment(sectionId?: string) {
  const target = sectionId
    ? document.getElementById(sectionId)
    : document.getElementById("todays-business-day")
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
}

/** Per-block motivational copy shown in the glass hero. `btn` overrides the Enter Here label. */
const BLOCK_HERO: Record<string, { encouragement: string; cta: string; btn?: string }> = {
  "monday-flex":           { encouragement: "Prepare today with intention.",                   cta: "It\u2019s Time To Prepare" },
  "monday-reality-check":  { encouragement: "Redesign your entry into the workweek.",          cta: "Take Your Reality Check\u2122" },
  "early-access":          { encouragement: "Prepare today with intention.",                   cta: "It\u2019s Time To Prepare" },
  "morning-given":         { encouragement: "Align your mind before you lead.",                cta: "It\u2019s Time To Align" },
  "movement-window":       { encouragement: "Move your body. Renew your energy.",              cta: "It\u2019s Time To Move" },
  "lunch-break":           { encouragement: "Nourish your body. Enjoy the moment.",            cta: "It\u2019s Time To Nourish" },
  "ceo-workday":           { encouragement: "Build a business that leaves room for life.",     cta: "It\u2019s Time To Build" },
  "time-freedom":          { encouragement: "Enjoy the life your business exists to support.", cta: "It\u2019s Time To Live" },
  "power-down":            { encouragement: "Release today so tomorrow begins with clarity.",  cta: "It\u2019s Time To Release" },
  "digital-detox":         { encouragement: "Rest well. Tomorrow begins with you.",            cta: "It\u2019s Time To Rest",  btn: "Unplug Now \u2192" },
}

/**
 * Maps each block ID → the full "We're Now ___" phrase (plain + italic parts).
 * plain: the non-italic prefix after "We're Now "
 * italic: the italic accent phrase
 */
const BLOCK_SENTENCE: Record<string, { plain: string; italic: string }> = {
  // Monday-only blocks
  "monday-flex":           { plain: "Preparing For",                      italic: "Make Time For More™ On Mondays™" },
  "monday-reality-check":  { plain: "Redesigning Our Entry Into The Workweek", italic: "Work-Life Balance Reality Check™" },
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

  // Stable fallback background before the first client tick.
  const backgroundImage = experience?.theme.backgroundImage ?? "/images/business-day-hero-bg.png"
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
          className="mx-auto flex max-w-4xl flex-col items-center px-6 py-[38px] text-center sm:py-[45px]"
        >
          {/* Lines 1+2 — "We're Now [plain]" then italic segment name on its own line */}
          {experience ? (() => {
            const s = BLOCK_SENTENCE[experience.businessDay.current.id]
            const isLunch = experience.businessDay.current.id === "lunch-break"
            return (
              <h1 className={`flex flex-col items-center font-playfair text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px] lg:text-[46px] ${isLunch ? "gap-0" : "gap-0.5"}`}>
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
            <h1 className="flex flex-col items-center gap-0.5 font-playfair text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-[#1C161A]">{"Join Today\u2019s"}</span>
              <span className="italic text-[#C13B6B]">{"Work-Life Balance Business Day\u2122"}</span>
            </h1>
          )}

          {/* Sub-line — timeLabel • Next: [shortTitle] */}
          {experience && (
            <p className="mt-3 font-montserrat text-[13px] font-medium text-[#5A4A52] sm:text-[14px]">
              {experience.businessDay.current.timeLabel}
              <span className="mx-2 text-[#C8B89A]">&bull;</span>
              <span className="text-[#78AD7D]">{"Next: "}</span>
              <span className="italic">{experience.businessDay.next.shortTitle}</span>
            </p>
          )}
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
          {/* Soft left-weighted wash — reduced so more background shows through */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,241,245,0.42) 0%, rgba(255,241,245,0.12) 46%, rgba(255,241,245,0) 68%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-6 py-16 sm:min-h-[640px] lg:py-24">
          {/* Dynamic glass card — its contents change with the phase of the day */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="glass-panel w-full max-w-md rounded-2xl p-8 sm:p-10"
            style={{ backgroundColor: "rgba(253, 250, 245, 0.72)" }}
          >
            {experience && (() => {
              const blockId = experience.businessDay.current.id
              const hero = BLOCK_HERO[blockId]
              return (
                <motion.div
                  key={blockId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                >
                  {/* Greeting + "It's Time To ___" on one line, no gap */}
                  <p className="font-playfair text-[14px] font-medium italic text-[#78AD7D] sm:text-[20px]">
                    {experience.member.greeting}
                    {hero?.cta && (
                      <span className="ml-2 text-[11px] not-italic text-[#78AD7D] sm:text-[14px]">
                        &bull; {hero.cta}
                      </span>
                    )}
                  </p>
                </motion.div>
              )
            })()}

            {/* CTA button */}
            <div className="mt-6">
              <Button
                size="lg"
                id="hero-cta"
                onClick={() => scrollToActiveSegment(experience?.businessDay.current.sectionId)}
                className="w-fit bg-[#78AD7D] px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#6a9c6f]"
              >
                {experience
                  ? (BLOCK_HERO[experience.businessDay.current.id]?.btn ?? "Enter Here \u2192")
                  : "Enter Here \u2192"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
