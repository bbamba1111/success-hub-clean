"use client"

/**
 * Section 4 — Why Monday. Start with the day you actually have to live. Monday
 * is where business ambition meets human reality; the Business Day gives
 * founders a live environment to experience a different operating rhythm before
 * redesigning the whole business.
 */
import { motion } from "framer-motion"

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, delay },
})

export function WhyMondaySection() {
  return (
    <section id="why-monday" className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          {...reveal()}
          className="font-playfair text-balance text-3xl font-bold capitalize leading-tight text-[#4A3A42] sm:text-5xl"
        >
          Start with the day
          <span className="mt-1 block text-[#C13B6B]">you actually have to live.</span>
        </motion.h2>

        <motion.div
          {...reveal(0.08)}
          className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]"
        >
          <p>Monday is where business ambition meets human reality.</p>
          <p>It is where founders decide how the week will begin.</p>
          <p>It is where work expands — or where boundaries contain it.</p>
          <p>
            The Work-Life Balance Business Day&trade; gives founders a live environment to experience a different
            operating rhythm before attempting to redesign the entire business.
          </p>
        </motion.div>

        <motion.p
          {...reveal(0.16)}
          className="font-playfair mt-12 text-balance text-2xl font-bold leading-snug text-[#5A7F46] sm:text-3xl"
        >
          You don&apos;t just learn about work-life balance.
          <span className="mt-1 block text-[#4A3A42]">You experience the boundaries in real time.</span>
        </motion.p>
      </div>
    </section>
  )
}
