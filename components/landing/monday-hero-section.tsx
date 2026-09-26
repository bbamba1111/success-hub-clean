"use client"

/**
 * MondayHeroSection — the /landing hero.
 *
 * The photograph/environment is the hero. The typography identifies the
 * experience and sits directly OVER the living background (which slowly
 * cross-fades through the phases of the day). Only a small, very translucent
 * glass panel floats within the scene — carrying the invitation line and the
 * CTAs. Hierarchy: Harmony Lane™ (the world) → The Work-Life Balance Business
 * Day™ (the signature experience) → The Desired Work-Lifestyle Destination™
 * (the descriptor). No clock times, no pricing.
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
        {/* Lighter wash so the environment stays dominant; a soft floor keeps text legible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.60) 0%, rgba(255,241,245,0.30) 46%, rgba(255,241,245,0.02) 80%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(0deg, rgba(74,58,66,0.34) 0%, rgba(74,58,66,0) 100%)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-6 pt-40 sm:px-8 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Brand line lives directly over the background, top-left */}
          <p className="font-poppins text-sm font-semibold uppercase leading-tight tracking-[0.24em] text-[#5A7F46] sm:text-base">
            Harmony Lane™
          </p>

          {/* "presents…" sits directly under Harmony Lane™, small and quiet */}
          <p className="font-poppins mt-1 text-sm font-medium italic tracking-[0.1em] text-[#5A7F46]/80">
            presents&hellip;
          </p>

          {/* One unified glass panel — lowered ~1in, starting at Make Time For More */}
          <div className="mt-24 inline-flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/30 bg-white/10 px-6 py-5 shadow-sm backdrop-blur-sm sm:px-8">
            <p className="font-poppins text-xs font-semibold uppercase tracking-[0.22em] text-[#5A7F46] sm:text-sm">
              Make Time For More™
            </p>
            <p className="font-poppins text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#5A7F46]/80">
              As You Start, Grow &amp; Scale
            </p>
            <h1 className="font-playfair mt-1 text-balance text-3xl font-bold leading-[1.05] text-[#4A3A42] drop-shadow-sm sm:text-5xl">
              The Work-Life Balance
              <span className="mt-1 block whitespace-nowrap text-[#C13B6B]">
                Business Operations Week<sup className="text-[0.5em] align-super">™</sup>
              </span>
            </h1>
            <p className="font-playfair text-pretty text-base font-semibold italic leading-snug text-[#4A3A42] sm:text-lg">
              Where Founders Experience Work-Life Balance Boundaries In Real Time &amp; Turn Them Into
              Non-Negotiable Human Sustainability™ Operating Standards.
            </p>
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.16em] text-[#5A7F46]">
              A 7-Day Virtual Real-Business Operating Intensive.
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#offer"
                className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
              >
                Experience the Operations Week
              </a>
              <a
                href="/audit"
                className="font-poppins inline-flex items-center justify-center rounded-full border border-[#7FB069]/50 bg-white/70 px-8 py-3.5 text-base font-semibold text-[#5A7F46] backdrop-blur-sm transition-colors hover:bg-white/90"
              >
                Take the Boundary Audit™
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
