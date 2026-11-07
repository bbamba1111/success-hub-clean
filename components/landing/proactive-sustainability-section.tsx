"use client"

/**
 * Proactive Human Sustainability — "Don't Wait For Overwork To Become The
 * Operating System." Placed after the AI / Human Sustainability discussion
 * (Why Now) and before "Start With Monday". Positions Harmony Lane™ as a
 * proactive design approach, NOT a recovery-from-burnout solution. Editorial
 * and spacious; no clinical or medical language.
 */
import { motion } from "framer-motion"

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, delay },
})

export function ProactiveSustainabilitySection() {
  return (
    <section id="proactive" className="w-full bg-[#FDF6F3] py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          {...reveal()}
          className="font-playfair text-balance text-3xl font-bold capitalize leading-tight text-[#4A3A42] sm:text-5xl"
        >
          Don&apos;t Wait For Overwork
          <span className="mt-1 block text-[#C13B6B]">To Become The Operating System.</span>
        </motion.h2>

        <motion.div
          {...reveal(0.08)}
          className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]"
        >
          <p>
            Founders don&apos;t need to wait until the business has consumed their time, attention and capacity to
            redesign how it operates.
          </p>
          <p>
            Harmony Lane&trade; takes a proactive approach&mdash;helping founders establish boundaries and operating
            guardrails for the human non-negotiables that need protection as the business starts, grows and scales.
          </p>
        </motion.div>

        <motion.p
          {...reveal(0.16)}
          className="font-playfair mt-12 text-balance text-2xl font-bold capitalize leading-snug text-[#5A7F46] sm:text-3xl"
        >
          Design The Guardrails Before The Growth.
        </motion.p>
      </div>
    </section>
  )
}
