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

export function MondayHeroSection() {
  const [index, setIndex] = useState(0)
  const dayPlan = getPlanByLevel("business-day")
  const price = dayPlan?.priceLabel ?? "$1,997"

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
          <p className="font-poppins text-xs font-semibold uppercase leading-tight tracking-[0.28em] text-[#5A7F46] sm:text-sm">
            Harmony Lane&trade; Presents
          </p>

          {/* One unified glass panel */}
          <div className="mt-8 inline-flex max-w-3xl flex-col gap-5 rounded-2xl border border-white/30 bg-white/10 px-6 py-7 shadow-sm backdrop-blur-sm sm:px-9 sm:py-9">
            <h1 className="font-playfair text-balance text-4xl font-bold uppercase leading-[1.02] tracking-tight text-[#4A3A42] drop-shadow-sm sm:text-6xl">
              Make Time For More&trade;
              <span className="mt-1 block text-[#C13B6B]">On Mondays</span>
            </h1>

            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46] sm:text-base">
              Redesign Your Entry Into The Workweek&trade;
            </p>

            <p className="font-playfair text-pretty text-lg font-semibold uppercase tracking-wide text-[#4A3A42] sm:text-xl">
              The Work-Life Balance Business Day&trade;
            </p>

            <p className="font-poppins max-w-xl text-pretty text-sm leading-relaxed text-[#5A4A52] sm:text-base">
              Where founders set work-life balance boundaries — as they start, grow &amp; scale for Human
              Sustainability&trade; in the Accelerated AI Age.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#offer"
                className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-9 py-4 text-base font-semibold uppercase tracking-wide text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
              >
                Reserve Your Day Now&trade;
              </a>
              <span className="font-playfair text-2xl font-bold text-[#4A3A42] sm:text-3xl">{price}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
