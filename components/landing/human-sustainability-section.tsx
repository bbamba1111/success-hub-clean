"use client"

/**
 * Human Sustainability™ — whether a business can increase capability without
 * requiring the continuous consumption of human life to sustain that
 * capability. When the boundary lives in the business, the freedom stops
 * depending on the founder.
 */
import { motion } from "framer-motion"

const WORDS = ["Time", "Attention", "Energy", "Relationships", "Creativity", "Presence", "Autonomy", "Life"]

export function HumanSustainabilitySection() {
  return (
    <section id="human-sustainability" className="w-full bg-[#F1F6EC] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            The Bigger Idea
          </p>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Human Sustainability&trade;
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Human Sustainability&trade; asks whether a business can increase capability without requiring the
            continuous consumption of human life to sustain that capability.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5"
        >
          {WORDS.map((w) => (
            <li
              key={w}
              className="font-poppins rounded-full border border-[#5A7F46]/25 bg-white px-4 py-2 text-sm font-semibold text-[#5A7F46]"
            >
              {w}
            </li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-playfair mx-auto mt-14 max-w-3xl text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl"
        >
          When the boundary lives in the business &mdash; not just in you &mdash;
          <span className="mt-2 block text-[#C13B6B]">the freedom stops depending on you.</span>
        </motion.p>
      </div>
    </section>
  )
}
