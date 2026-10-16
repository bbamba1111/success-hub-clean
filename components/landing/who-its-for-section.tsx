"use client"

/**
 * Who Harmony Lane™ is for / and who it isn't (spec §15–16). Five entry points
 * (Starting, Growing, Scaling, Reinventing, Entering the AI Age) qualify the
 * audience; the "may not be for you" list stays elegant and non-judgmental.
 */
import { motion } from "framer-motion"

const ENTRY_POINTS = [
  {
    stage: "Starting",
    body: "You're building your business and want to establish a work-life balance operating model before hustle becomes the operating system.",
  },
  {
    stage: "Growing",
    body: "Your business is working, but growth is increasing the demands on your time, attention, and capacity.",
  },
  {
    stage: "Scaling",
    body: "You're adding revenue, people, technology, and complexity — and want growth without automatically making yourself more indispensable.",
  },
  {
    stage: "Reinventing",
    body: "You've achieved success, but the business you built no longer fully aligns with the life, role, or workplace you want.",
  },
  {
    stage: "Entering the AI Age",
    body: "You're asking more than \u201CHow can AI help me do more?\u201D You're asking \u201CWhat should work become now that AI changes what work can do?\u201D",
  },
]

export function WhoItsForSection() {
  return (
    <section id="who" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Who It&apos;s For
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            This is for the entrepreneur ready to build differently.
          </h2>
        </motion.div>

        <ul className="mt-12 divide-y divide-[#F2E4E8] border-y border-[#F2E4E8]">
          {ENTRY_POINTS.map(({ stage, body }, i) => (
            <motion.li
              key={stage}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid gap-2 py-6 sm:grid-cols-[0.32fr_1fr] sm:gap-8 sm:py-7"
            >
              <h3 className="font-playfair text-xl font-bold text-[#C13B6B] sm:text-2xl">{stage}</h3>
              <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">{body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
