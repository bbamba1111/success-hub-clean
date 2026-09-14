"use client"

/**
 * MondayHeroSection — the /landing hero.
 *
 * Leads with the CATEGORY (Harmony Lane™ — the parallel lane to hustle
 * entrepreneurship) and the EXPERIENCE (Make Time For More™ — the Work-Life
 * Balance Business Day™), not with price, schedule, or a feature list. The
 * living background slowly cross-fades through the phases of the day so the
 * visitor feels they are looking into a real destination.
 *
 * Public rules honored here: no clock times, no pricing, no sales urgency.
 */
import { motion } from "framer-motion"

export function MondayHeroSection() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/barbara-portrait.png"
          alt="Barbara, founder of Harmony Lane, smiling in front of a cherry blossom window"
          className="absolute inset-0 h-full w-full object-cover object-[68%_18%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.92) 0%, rgba(255,241,245,0.55) 46%, rgba(255,241,245,0.1) 76%)",
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

          <h1 className="font-playfair mt-6 text-balance text-4xl font-bold leading-[1.08] text-[#4A3A42] sm:text-[3.4rem]">
            Make Time For More™
            <span className="mt-2 block text-[#C13B6B]">The Work-Life Balance Business Day™</span>
          </h1>

          <p className="font-playfair mt-5 text-pretty text-xl italic leading-snug text-[#5A7F46] sm:text-2xl">
            Experience the Work-Life Balance Business Day™ — in real time.
          </p>

          <p className="font-poppins mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#5A4A52]">
            Harmony Lane™ is the parallel lane to hustle entrepreneurship — a real destination for founders and
            leaders who want to live, work, and lead in Work-Life Balance™ rather than read one more theory
            about it. You don&apos;t study the day. You step into it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#offer"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/30 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Experience the Business Day
            </a>
            <a
              href="#business-day"
              className="font-poppins inline-flex items-center justify-center rounded-full border border-[#7FB069]/40 bg-white/60 px-8 py-3.5 text-base font-semibold text-[#5A7F46] backdrop-blur-sm transition-colors hover:bg-white/80"
            >
              See how the day flows
            </a>
          </div>

          <p className="font-poppins mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7A82]">
            Live, Work &amp; Lead in Work-Life Balance™
          </p>
        </motion.div>
      </div>
    </section>
  )
}
