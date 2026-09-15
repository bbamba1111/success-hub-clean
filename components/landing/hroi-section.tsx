"use client"

/**
 * HROI™ — Holistic Return on Investment. Widens the definition of "return"
 * beyond financial ROI. No proprietary formulas or scoring exposed.
 */
import { motion } from "framer-motion"

const LENS = [
  "Business performance",
  "Founder capacity",
  "Human capability",
  "Time",
  "Wellbeing",
  "Culture",
  "Sustainable success",
]

export function HroiSection() {
  return (
    <section id="hroi" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            HROI™
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Holistic Return on Investment
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-[#4A3A42]/12 bg-white p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#8A7A82]">Traditional ROI asks</p>
            <p className="font-playfair mt-4 text-pretty text-2xl font-bold leading-snug text-[#4A3A42]">
              What did the business return financially?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-[#7FB069]/30 bg-[#7FB069]/8 p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">HROI™ asks</p>
            <p className="font-playfair mt-4 text-pretty text-2xl font-bold leading-snug text-[#4A3A42]">
              What is the whole system of success returning?
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <p className="font-poppins text-pretty text-lg leading-relaxed text-[#6B5860]">
            HROI™ expands the lens beyond the financial line to the full return on how a business is built and led.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {LENS.map((item) => (
              <li
                key={item}
                className="font-poppins rounded-full border border-[#C13B6B]/20 bg-white px-4 py-2 text-sm font-medium text-[#C13B6B]"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
