"use client"

/**
 * MondayHeroSection — the /landing hero.
 *
 * Destination-first. Leads with the CATEGORY (Harmony Lane™ — The Desired
 * Work-Lifestyle Destination™) and the full positioning hierarchy. The living
 * background slowly cross-fades through the phases of the day so the visitor
 * feels they are looking into a real destination. Barbara is introduced
 * immediately AFTER the hero, never inside it. No clock times, no pricing.
 */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"

export function MondayHeroSection() {
  const [index, setIndex] = useState(0)

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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.92) 0%, rgba(255,241,245,0.55) 48%, rgba(255,241,245,0.08) 78%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-16 pt-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-[2rem] border border-white/40 bg-white/10 p-8 shadow-2xl backdrop-blur-md sm:p-12"
        >
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Harmony Lane™
          </span>

          <h1 className="font-playfair mt-6 text-balance text-4xl font-bold leading-[1.06] text-[#4A3A42] sm:text-[3.4rem]">
            The Desired Work-Lifestyle
            <span className="mt-1 block text-[#C13B6B]">Destination™</span>
          </h1>

          <div className="mt-6 space-y-2.5">
            <p className="font-playfair text-lg font-bold leading-snug text-[#4A3A42] sm:text-xl">
              Experience Work-Life Balance — In Real Time.
            </p>
            <p className="font-poppins text-pretty text-sm leading-relaxed text-[#5A4A52] sm:text-base">
              Redesign how you enter, live, work &amp; lead your workweek. Build work-life balance boundaries into
              your day. Install them into your business — and build a workplace of the future.
            </p>
          </div>

          <p className="font-poppins mt-6 max-w-xl text-pretty text-sm italic leading-relaxed text-[#6B5860] sm:text-base">
            A virtual immersive experience for founders who want to experience a different way of working before
            redesigning the business around it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#offer"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Enter Harmony Lane™
            </a>
            <a
              href="#guide"
              className="font-poppins inline-flex items-center justify-center rounded-full border border-[#7FB069]/40 bg-white/60 px-8 py-3.5 text-base font-semibold text-[#5A7F46] backdrop-blur-sm transition-colors hover:bg-white/80"
            >
              Meet Thought Leader Barbara
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
