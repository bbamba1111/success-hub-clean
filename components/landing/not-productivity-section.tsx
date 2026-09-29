"use client"

/**
 * What They Experience — the hard reframe. This is not another productivity
 * program. It is business design that makes room for a human life. Image-led,
 * full-width.
 */
import { motion } from "framer-motion"

const NEGATIONS = [
  "It isn\u2019t about squeezing more output into your day.",
  "It isn\u2019t about optimizing yourself to tolerate an unsustainable business.",
  "It isn\u2019t about working less so you can work more efficiently.",
]

export function NotProductivitySection() {
  return (
    <section id="not-productivity" className="relative w-full overflow-hidden bg-[#2E2A3A] py-24 sm:py-32">
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/images/harmony-family-picnic.png"
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E2A3A] via-[#2E2A3A]/85 to-[#2E2A3A]/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-balance text-3xl font-bold leading-tight text-white sm:text-5xl"
        >
          This is not another productivity program.
        </motion.h2>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 space-y-3"
        >
          {NEGATIONS.map((line) => (
            <li key={line} className="font-poppins text-pretty text-lg leading-relaxed text-white/75">
              {line}
            </li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-playfair mt-10 text-balance text-2xl font-bold italic leading-snug text-[#E8A0AC] sm:text-3xl"
        >
          It is about designing a business that makes room for a human life.
        </motion.p>
      </div>
    </section>
  )
}
