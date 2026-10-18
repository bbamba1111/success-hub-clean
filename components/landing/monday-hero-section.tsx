"use client"

/**
 * MondayHeroSection — the /landing hero.
 *
 * The living environment (cross-fading through the phases of the day) is the
 * hero. Typography sits over it inside one quiet glass panel and follows the
 * spec hierarchy exactly:
 *   HARMONY LANE™ PRESENTS
 *   MAKE TIME FOR MORE™ ON MONDAYS
 *   Redesign Your Entry Into The Workweek™
 *   THE WORK-LIFE BALANCE BUSINESS DAY™
 *   supporting statement → one CTA (Reserve Your Day Now™) → $1,997
 *
 * There is exactly ONE call to action in the hero. No secondary button.
 */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"
import { getPlanByLevel } from "@/lib/payments/config"

const HERO_PATHWAYS = [
  {
    label: "Starting or Building a Business",
    body: "Design work-life balance into your business from the beginning. Establish your boundaries, intended work rhythm, and operating principles before unsustainable expectations become the norm.",
  },
  {
    label: "Already Running a Business",
    body: "Recognize where business demands have crowded out the freedom you intended to create. Redesign your working rhythm and identify the business practices that need to change.",
  },
]

export function MondayHeroSection() {
  const [index, setIndex] = useState(0)
  const mondayPrice = getPlanByLevel("business-day")?.priceLabel ?? "$997"
  const weekPrice = getPlanByLevel("business-week")?.priceLabel ?? "$1,997"

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SCHEDULE.length)
    }, 4600)
    return () => clearInterval(timer)
  }, [])

  const block = SCHEDULE[index]
  const bg =
    (Array.isArray(block.backgroundImage) ? block.backgroundImage[0] : block.backgroundImage) || "/placeholder.svg"

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={bg}
            src={bg}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 6, ease: "easeOut" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {/* Lighter wash so the environment stays dominant; a soft floor keeps text legible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.62) 0%, rgba(255,241,245,0.32) 46%, rgba(255,241,245,0.04) 80%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(0deg, rgba(74,58,66,0.34) 0%, rgba(74,58,66,0) 100%)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-8 pt-40 sm:px-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Eyebrow lives directly over the background, top-left */}
          <p className="font-poppins text-[10px] font-semibold uppercase leading-tight tracking-[0.28em] text-[#8AA06A] sm:text-[12px]">
            Harmony Lane&trade; Presents
          </p>

          {/* One unified glass panel */}
          <div className="mt-8 inline-flex max-w-[45rem] flex-col gap-3 rounded-2xl border border-white/30 bg-white/10 pl-6 pr-[1.35rem] pt-[1.575rem] pb-[1.575rem] shadow-sm backdrop-blur-sm sm:pl-9 sm:pr-[2.025rem] sm:pt-[2.025rem] sm:pb-[2.025rem]">
            <h1 className="font-playfair text-balance text-[28px] font-bold leading-[0.82] tracking-tight text-[#4A3A42] drop-shadow-sm sm:text-[46px]">
              <span className="whitespace-nowrap">Make Time For More&trade;</span>
              <span className="mt-1 block text-[#C13B6B]">On Mondays</span>
            </h1>

            <p className="font-poppins text-[12px] font-semibold tracking-[0.08em] text-[#5A7F46] sm:text-[14px]">
              Redesign Your Entry Into the Workweek.
            </p>

            <p className="font-playfair text-pretty text-[16px] font-semibold text-[#4A3A42] sm:text-[18px]">
              Live The Work-Life Balance Business Week&trade; &mdash; In Real Time.
            </p>

            <div className="font-poppins max-w-xl text-pretty text-[12px] leading-relaxed text-[#5A4A52] sm:text-[14px]">
              <p className="font-semibold text-[#4A3A42]">You became an entrepreneur for freedom.</p>
              <p className="mt-1">
                Reconnect with the life you intended to create, personalize your human boundaries, and experience a
                different way to live, work, lead, and operate your business.
              </p>
              <p className="mt-2">
                Whether you&apos;re starting a business or redesigning one you&apos;ve already built, Harmony
                Lane&trade; helps you make work-life balance an intentional part of how you work, lead, and operate.
              </p>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              {HERO_PATHWAYS.map((path) => (
                <li key={path.label}>
                  <a
                    href="#monday"
                    className="font-poppins flex h-full flex-col gap-1 rounded-xl border border-white/50 bg-white/55 p-3 transition-colors hover:bg-white/80"
                  >
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-[#C13B6B]">{path.label}</span>
                    <span className="text-pretty text-[12px] leading-relaxed text-[#4A3A42]">{path.body}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <a
                href="#monday"
                className="font-poppins inline-flex items-center justify-center rounded-full bg-[#8AA06A] px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white shadow-xl shadow-[#8AA06A]/30 transition-transform hover:scale-[1.03] hover:bg-[#788e5a]"
              >
                Redesign My Monday
              </a>
              <a
                href="#business-week"
                className="font-poppins inline-flex items-center justify-center rounded-full border border-[#4A3A42]/25 bg-white/60 px-7 py-3.5 text-[13px] font-semibold tracking-wide text-[#4A3A42] transition-colors hover:bg-white/90"
              >
                Experience the Full Week
              </a>
            </div>

            <dl className="font-poppins flex flex-col gap-1 text-[12px] text-[#4A3A42] sm:text-[13px]">
              <div className="flex gap-2">
                <dt>Monday experience</dt>
                <dd className="font-semibold">&mdash; {mondayPrice}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Full Monday&ndash;Sunday Week</dt>
                <dd className="font-semibold">&mdash; {weekPrice}, including Monday</dd>
              </div>
            </dl>

            <p className="font-playfair text-[14px] italic text-[#C13B6B] sm:text-[15px]">
              We don&apos;t hustle &mdash; we harmonize.&trade;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
