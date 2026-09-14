"use client"

/**
 * The Problem — "You can leave hustle culture and still rebuild it."
 * Names the ways successful founders unintentionally recreate hustle inside
 * their own business, then speaks to the second audience (build differently
 * from day one). Peer-level, non-judgmental tone.
 */
import { motion } from "framer-motion"

const RECREATIONS = [
  "Founder bottlenecks",
  "Excessive availability",
  "Decision dependency",
  "Overextended workdays",
  "Work bleeding into evenings and weekends",
  "Little real delegation",
  "Growth that adds responsibility instead of freedom",
  "AI accelerating the work without redesigning the model",
]

export function HustleProblemSection() {
  return (
    <section id="problem" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The Invitation
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            You can leave hustle culture
            <span className="block text-[#C13B6B]">and still rebuild it.</span>
          </h2>
          <p className="font-poppins mt-5 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Success doesn&apos;t always end hustle. Often it just relocates it — from a job you left into the
            business you own. It rarely arrives as a decision. It accumulates quietly.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2"
        >
          {RECREATIONS.map((item) => (
            <li
              key={item}
              className="font-poppins flex items-center gap-3 rounded-2xl border border-[#F2E4E8] bg-[#FDF6F3] px-5 py-4 text-sm font-medium text-[#5A4A52]"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[#7FB069]/25 bg-[#7FB069]/8 p-8 text-center sm:p-10"
        >
          <p className="font-playfair text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
            You don&apos;t have to learn this through burnout.
          </p>
          <p className="font-poppins mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[#5A7F46]">
            Some entrepreneurs feel the trap closing and want out. Others see it coming and want to build
            differently from day one. Harmony Lane™ is for both — a place to question whether the operating
            model you&apos;re using is the one you actually want.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
