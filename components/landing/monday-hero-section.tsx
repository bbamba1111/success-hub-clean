"use client"

/**
 * MondayHeroSection — the /landing hero, reframed so Monday itself is the hero.
 *
 * Reuses the same "living background" device as LandingHero (a slow cross-fade
 * through the phases of the Work-Life Balance Business Day™) so the premium
 * Harmony Lane™ identity is preserved, but leads with the spec headline:
 * "What if Monday didn't have to begin the way last week ended?"
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

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={block.backgroundImage as string}
            src={(Array.isArray(block.backgroundImage) ? block.backgroundImage[0] : block.backgroundImage) || "/placeholder.svg"}
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
              "linear-gradient(90deg, rgba(255,241,245,0.86) 0%, rgba(255,241,245,0.48) 48%, rgba(255,241,245,0.08) 74%)",
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
            Make Time For More™ Starts Monday
          </span>

          <h1 className="font-playfair mt-6 text-balance text-4xl font-bold leading-[1.08] text-[#4A3A42] sm:text-[3.4rem]">
            What if Monday didn&apos;t have to begin{" "}
            <span className="text-[#C13B6B]">the way last week ended?</span>
          </h1>

          <p className="font-playfair mt-5 text-pretty text-xl italic leading-snug text-[#5A7F46] sm:text-2xl">
            Redesign Your Entry Into The Workweek™ — then live Work-Life Balance™ in real time.
          </p>

          <p className="font-poppins mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#5A4A52]">
            You don&apos;t need another course telling you how to create Work-Life Balance. You need a different
            way to enter your workweek. Every Monday inside Harmony Lane™, you step out of your existing work
            pattern, see what&apos;s actually happening, and intentionally redesign how you want to work, live,
            and lead in the week ahead.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#entry-offer"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Start Your Monday Here
            </a>
            <a
              href="#your-monday"
              className="font-poppins inline-flex items-center justify-center rounded-full border border-[#7FB069]/40 bg-white/60 px-8 py-3.5 text-base font-semibold text-[#5A7F46] backdrop-blur-sm transition-colors hover:bg-white/80"
            >
              See How Monday Flows
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
