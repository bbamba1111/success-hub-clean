"use client"

/**
 * LandingHero — a "living" marketing hero that mirrors the Success Hub's
 * Dynamic Hero architecture. Rather than a static image, it slowly cycles the
 * background through the eight phases of the Work-Life Balance Business Day™,
 * so a first-time visitor literally watches the platform move through a day.
 */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"

export function LandingHero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SCHEDULE.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [])

  const block = SCHEDULE[index]

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Cycling full-screen imagery — the day in motion */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={block.backgroundImage}
            src={block.backgroundImage || "/placeholder.svg"}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 6, ease: "easeOut" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {/* Left-weighted wash so the glass panel reads clearly (matches Hub hero) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.82) 0%, rgba(255,241,245,0.42) 46%, rgba(255,241,245,0.05) 72%)",
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
            <span aria-hidden>🌸</span>
            A New Way to Run Your Day
          </span>

          <h1 className="font-playfair mt-6 text-pretty text-4xl font-bold leading-[1.08] text-[#4A3A42] sm:text-6xl">
            Build a business that gives you{" "}
            <span className="text-[#C13B6B]">more life</span>, not less.
          </h1>

          <p className="font-great-vibes mt-4 text-3xl text-[#7FB069] sm:text-4xl">Live Intentionally.</p>

          <p className="font-poppins mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#5A4A52] sm:text-lg">
            Make Time For More is a guided daily operating system for founders and leaders — a full
            Work-Life Balance Business Day™ that moves with you from morning intention to restorative
            night, with AI coaching and a community that keeps you present.
          </p>

          {/* Live "current phase" indicator — the dynamic device made visible */}
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-sm">
            <span className="text-xl" aria-hidden>
              {block.emoji}
            </span>
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={block.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="font-poppins truncate text-sm font-semibold text-[#4A3A42]"
                >
                  {block.shortTitle}
                  <span className="font-normal text-[#8A7A82]"> · {block.timeLabel}</span>
                </motion.p>
              </AnimatePresence>
              <p className="font-poppins text-xs text-[#8A7A82]">The Work-Life Balance Business Day™, in motion</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#experiences"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Begin Your Journey
            </a>
            <a
              href="#business-day"
              className="font-poppins inline-flex items-center justify-center rounded-full border border-[#7FB069]/40 bg-white/60 px-8 py-3.5 text-base font-semibold text-[#5A7F46] backdrop-blur-sm transition-colors hover:bg-white/80"
            >
              See How a Day Flows
            </a>
          </div>
        </motion.div>
      </div>

      {/* Phase progress dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {SCHEDULE.map((b, i) => (
          <span
            key={b.id}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-[#E26C73]" : "w-1.5 bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
