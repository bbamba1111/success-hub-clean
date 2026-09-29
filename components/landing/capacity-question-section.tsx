"use client"

/**
 * Section 3 — The New Business Question. "What happens when capacity isn't the
 * problem?" Frames Harmony Lane's stance: regulate the acceleration, set the
 * boundaries, protect Human Sustainability™. This is the "Why Now" beat.
 */
import { motion } from "framer-motion"

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, delay },
})

const STANCE = ["Regulate the acceleration.", "Set the boundaries.", "Protect Human Sustainability\u2122."]

export function CapacityQuestionSection() {
  return (
    <section id="why-now" className="w-full bg-[#FDF6F3] py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          {...reveal()}
          className="font-playfair text-balance text-3xl font-bold capitalize leading-tight text-[#4A3A42] sm:text-5xl"
        >
          What happens when
          <span className="mt-1 block text-[#C13B6B]">capacity isn&apos;t the problem?</span>
        </motion.h2>

        <motion.div
          {...reveal(0.08)}
          className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]"
        >
          <p>AI gives businesses more capacity.</p>
          <p className="font-playfair text-xl font-semibold text-[#4A3A42]">The question is: where does that capacity go?</p>
          <p>
            If every gain is immediately spent on more work, more speed and more demand, we haven&apos;t necessarily
            created freedom. We&apos;ve increased the rate at which human capacity is consumed.
          </p>
          <p>Harmony Lane&trade; takes a different approach:</p>
        </motion.div>

        <motion.ul {...reveal(0.16)} className="mt-8 space-y-3">
          {STANCE.map((line) => (
            <li
              key={line}
              className="font-playfair rounded-2xl border border-[#5A7F46]/20 bg-white px-6 py-4 text-xl font-bold capitalize tracking-wide text-[#5A7F46]"
            >
              {line}
            </li>
          ))}
        </motion.ul>

        <motion.p {...reveal(0.24)} className="font-poppins mt-8 text-pretty text-base leading-relaxed text-[#6B5860]">
          This is how we begin designing for Human Sustainability&trade;.
        </motion.p>
      </div>
    </section>
  )
}
