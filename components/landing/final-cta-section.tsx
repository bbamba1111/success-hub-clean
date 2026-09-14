"use client"

/**
 * Final CTA — "Where are you going?" The confident, peer-level close that turns
 * the founder's own success into the reason to enter Harmony Lane™.
 */
import { motion } from "framer-motion"

const EARNED = [
  "You've already learned how to build.",
  "You've already learned how to lead.",
  "You've already learned how to make money.",
]

export function FinalCtaSection() {
  return (
    <section id="enter" className="w-full bg-[#2E2A3A] py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-balance text-4xl font-bold leading-tight text-white sm:text-6xl">
            Where are you going?
          </h2>

          <ul className="mx-auto mt-8 space-y-1.5">
            {EARNED.map((line) => (
              <li key={line} className="font-poppins text-pretty text-base text-white/70 sm:text-lg">
                {line}
              </li>
            ))}
          </ul>

          <p className="font-playfair mt-8 text-balance text-2xl font-bold italic leading-snug text-[#E8A0AC] sm:text-3xl">
            What do you want your success to make possible?
          </p>
          <p className="font-poppins mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/75">
            And is the way you&apos;re building your business actually taking you there?
          </p>

          <a
            href="#offer"
            className="font-poppins mt-10 inline-flex items-center justify-center rounded-full bg-[#E26C73] px-9 py-4 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
          >
            Enter Harmony Lane™
          </a>
        </motion.div>
      </div>
    </section>
  )
}
