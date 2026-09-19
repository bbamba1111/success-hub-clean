"use client"

/**
 * The Bigger Purpose — reframes "more" as the point of success, not less
 * ambition. Aspirational, peer-level close before the final CTA.
 */
import { motion } from "framer-motion"

const MORE = [
  "More life",
  "More freedom",
  "More creativity",
  "More relationships",
  "More capacity",
  "More meaningful work",
  "More human possibility",
]

export function BiggerPurposeSection() {
  return (
    <section id="purpose" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-balance text-4xl font-bold leading-tight text-[#4A3A42] sm:text-6xl">
            Make Time For More™
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Not less ambition. Not less success. More of what success was supposed to make possible.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5"
        >
          {MORE.map((item) => (
            <li
              key={item}
              className="font-poppins rounded-full border border-[#7FB069]/30 bg-[#7FB069]/8 px-4 py-2 text-sm font-medium text-[#5A7F46]"
            >
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
