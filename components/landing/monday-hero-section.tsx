"use client"

/**
 * MondayHeroSection — the /landing hero.
 *
 * Leads with the CATEGORY (Harmony Lane™ — The Work-Life Balance Destination™)
 * and the central brand idea: "You built the business. Now decide what you want
 * it to make possible." The living background slowly cross-fades through the
 * phases of the day so the visitor feels they are looking into a real
 * destination. No clock times, no pricing, no sales urgency.
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
              "linear-gradient(90deg, rgba(255,241,245,0.9) 0%, rgba(255,241,245,0.52) 48%, rgba(255,241,245,0.08) 76%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-16 pt-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-[2rem] border border-white/50 bg-white/30 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
        >
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Harmony Lane™ · The Work-Life Balance Destination™
          </span>

          <h1 className="font-playfair mt-6 text-balance text-4xl font-bold leading-[1.08] text-[#4A3A42] sm:text-[3.3rem]">
            You built the business.
            <span className="mt-2 block text-[#C13B6B]">Now decide what you want it to make possible.</span>
          </h1>

          <p className="font-poppins mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#5A7F46]">
            The Parallel Lane to Hustle Entrepreneurship™
          </p>

          <p className="font-poppins mt-4 max-w-xl text-pretty text-base leading-relaxed text-[#5A4A52] sm:text-lg">
            For successful entrepreneurs who have left hustle behind, rebuilt it inside their business, or want to
            avoid building it in the first place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#offer"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Enter Harmony Lane™
            </a>
            <a
              href="#journey"
              className="font-poppins inline-flex items-center justify-center rounded-full border border-[#7FB069]/40 bg-white/60 px-8 py-3.5 text-base font-semibold text-[#5A7F46] backdrop-blur-sm transition-colors hover:bg-white/80"
            >
              See the journey
            </a>
          </div>

          <p className="font-poppins mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7A82]">
            Come for the Day. Stay for the Week. Repeat it to install it.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
