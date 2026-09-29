"use client"

/**
 * Section 8 — The Bigger Idea. "Build the business. Don't consume the human."
 * The Accelerated AI Age changes what businesses can produce and the
 * responsibility of the people designing them. The human role becomes
 * regulator, boundary setter, decision maker. This is Human Sustainability™.
 */
import { motion } from "framer-motion"

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, delay },
})

const ROLES = ["Regulator.", "Boundary Setter.", "Decision Maker."]

export function HumanSustainabilitySection() {
  return (
    <section id="bigger-idea" className="relative w-full overflow-hidden bg-[#F1F6EC] py-24 sm:py-32">
      {/* Panoramic backdrop — zen stones, full background, no color overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/panoramic-zen-stones.png')" }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          {...reveal()}
          className="font-playfair text-balance text-3xl font-bold uppercase leading-tight text-[#4A3A42] sm:text-5xl"
        >
          Build the business.
          <span className="mt-1 block text-[#C13B6B]">Don&apos;t consume the human.</span>
        </motion.h2>

        <motion.div
          {...reveal(0.08)}
          className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]"
        >
          <p>The Accelerated AI Age changes what businesses can produce.</p>
          <p>It also changes the responsibility of the people designing those businesses.</p>
          <p>
            Harmony Lane&trade; believes humans should not be expected to keep pace with technology simply because
            technology can move faster.
          </p>
          <p className="font-playfair text-xl font-semibold text-[#4A3A42]">The human role becomes increasingly important:</p>
        </motion.div>

        <motion.ul {...reveal(0.16)} className="mt-8 flex flex-wrap gap-3">
          {ROLES.map((role) => (
            <li
              key={role}
              className="font-playfair rounded-full border border-[#5A7F46]/25 bg-white px-6 py-3 text-lg font-bold uppercase tracking-wide text-[#5A7F46]"
            >
              {role}
            </li>
          ))}
        </motion.ul>

        <motion.div {...reveal(0.24)} className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]">
          <p>The goal isn&apos;t to slow innovation.</p>
          <p>It&apos;s to make sure innovation serves a business model that humans can actually sustain.</p>
        </motion.div>

        <motion.p
          {...reveal(0.32)}
          className="font-playfair mt-12 text-balance text-2xl font-bold leading-snug text-[#C13B6B] sm:text-3xl"
        >
          This is Human Sustainability&trade;.
        </motion.p>
      </div>
    </section>
  )
}
