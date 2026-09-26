"use client"

/**
 * 11 — Make Time For More On Mondays™. Monday is the entry point to the
 * workweek. On the landing page this is reduced to the mechanism — the six
 * moves — not the full time-blocked schedule (that lives inside the experience).
 */
import { motion } from "framer-motion"

const MONDAY_MOVES = [
  "Reality Check™",
  "Decide & Redesign™",
  "Life Priority",
  "Delegation Priority",
  "Operating Rule™",
  "Morning GIV•EN™",
]

export function MondaysSection() {
  return (
    <section id="mondays" className="w-full bg-[#FFF1F5] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B] shadow-sm">
            11 — The Entry Point
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Make Time For More On Mondays™
          </h2>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#6B5860]">
            Monday is the entry point. How you enter the week shapes the entire week — so instead of inheriting last
            week&apos;s momentum and this week&apos;s pressure, you enter through a deliberate sequence.
          </p>
        </motion.div>

        <ul className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
          {MONDAY_MOVES.map((move, i) => (
            <motion.li
              key={move}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="font-poppins flex items-center gap-3 rounded-2xl border border-[#C13B6B]/15 bg-white px-5 py-4 text-base font-semibold text-[#4A3A42]"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
              {move}
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-center text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl"
        >
          Change how you enter the week, and you change the week itself.
        </motion.p>
      </div>
    </section>
  )
}
