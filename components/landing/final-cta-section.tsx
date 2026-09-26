"use client"

/**
 * Final CTA — "Where are you going?" The confident, peer-level close that turns
 * the founder's own success into the reason to enter Harmony Lane™.
 */
import { motion } from "framer-motion"

const MORE = [
  "More life",
  "More freedom",
  "More presence",
  "More time",
  "More connection",
  "More experiences",
  "More room to be human",
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
            You built this business for more.
          </h2>

          <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2.5">
            {MORE.map((line) => (
              <li
                key={line}
                className="font-poppins rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
              >
                {line}
              </li>
            ))}
          </ul>

          <p className="font-poppins mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-white/75">
            Not less ambition. Not less success. But the business has to be designed to make that possible.
          </p>

          <p className="font-playfair mt-10 text-balance text-2xl font-bold italic leading-snug text-[#E8A0AC] sm:text-3xl">
            Where are you going — and is the way you&apos;re building actually taking you there?
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#offer"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-9 py-4 text-base font-semibold text-white shadow-xl shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Experience the Operations Week
            </a>
            <a
              href="/audit"
              className="font-poppins inline-flex items-center justify-center rounded-full border border-white/25 px-9 py-4 text-base font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              Take the Boundary Audit™
            </a>
          </div>

          <p className="font-poppins mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            Contain work. Let life have space to expand™.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
