"use client"

/**
 * The AI Age — why this matters now. AI is the catalyst and context, not the
 * category. Work-Life Balance and sustainable business/workplace design remain
 * the point.
 */
import { motion } from "framer-motion"

const RETHINK = [
  "Founder Capacity™",
  "Workday Design™",
  "Workweek Design™",
  "How We Enter the Workweek™",
  "Leadership",
  "Workplace Culture™",
  "Human + AI Collaboration",
  "HROI™",
  "Sustainable Business Success",
]

export function AiAgeSection() {
  return (
    <section id="ai-age" className="w-full bg-[#2E2A3A] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            The AI Age
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
            The future of work shouldn&apos;t simply be faster.
            <span className="mt-2 block text-[#E8A0AC]">It should be better designed.</span>
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
            AI can accelerate the way you work. But should it accelerate the way you&apos;ve always worked?
            Harmony Lane™ treats this era as an opportunity to rethink&nbsp;—
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5"
        >
          {RETHINK.map((item) => (
            <li
              key={item}
              className="font-poppins rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85"
            >
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-2xl font-bold leading-snug text-white sm:text-3xl"
        >
          AI changes what work can do.
          <span className="mt-1 block text-[#E8A0AC]">Harmony Lane™ asks us to reconsider what work should be.</span>
        </motion.p>
      </div>
    </section>
  )
}
