"use client"

/**
 * Why Monday Exists — "Don't Just Design The Boundaries. Experience Them."
 *
 * Placed immediately after the introduction to The Work-Life Balance Business
 * Day™ (Why Monday) and BEFORE the detailed Monday schedule. This is one of the
 * most important conceptual beats on the page: it explains WHY Monday exists.
 * Deliberately editorial and spacious — NOT a feature grid, module list, or
 * SaaS section. The emphasized pull-quote carries the idea.
 */
import { motion } from "framer-motion"

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, delay },
})

export function ExperienceBoundariesSection() {
  return (
    <section id="why-monday-exists" className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          {...reveal()}
          className="font-playfair text-balance text-3xl font-bold capitalize leading-tight text-[#4A3A42] sm:text-5xl"
        >
          Don&apos;t Just Design The Boundaries.
          <span className="mt-1 block text-[#C13B6B]">Experience Them.</span>
        </motion.h2>

        <motion.div
          {...reveal(0.08)}
          className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]"
        >
          <p>You can read about work-life balance.</p>
          <p>You can identify the boundaries you need.</p>
          <p>You can create the rules.</p>
          <p className="font-playfair text-xl font-semibold text-[#4A3A42]">
            But Monday is where those boundaries become operational.
          </p>
          <p>
            Inside The Work-Life Balance Business Day&trade;, you enter an environment where work-life balance
            boundaries are already built into the operating rhythm.
          </p>
          <p>You bring your real business.</p>
          <p>You experience the rhythm.</p>
          <p>You see what it feels like when work has a place&mdash;and life has a place, too.</p>
          <p>You don&apos;t leave Monday with another list of things you should do.</p>
          <p>You leave having experienced:</p>
        </motion.div>

        <motion.blockquote
          {...reveal(0.16)}
          className="font-playfair mt-8 border-l-2 border-[#5A7F46]/40 pl-6 text-pretty text-xl font-semibold italic leading-snug text-[#5A7F46] sm:text-2xl"
        >
          &ldquo;What does my business feel like when Human Sustainability&trade; is built into the way we
          operate?&rdquo;
        </motion.blockquote>

        <motion.div
          {...reveal(0.24)}
          className="mt-16 rounded-[2rem] border border-[#C13B6B]/20 bg-[#FDF6F3] px-8 py-12 text-center sm:px-12 sm:py-16"
        >
          <p className="font-playfair text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
            Monday Is Not Where We Tell You What Your Boundaries Should Be.
          </p>
          <p className="font-playfair mt-4 text-balance text-2xl font-bold leading-snug text-[#C13B6B] sm:text-3xl">
            Monday Is Where You Experience What It Feels Like To Operate Inside Them.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
