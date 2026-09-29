"use client"

/**
 * 17 — The Destination. The progression from where the founder is now to where
 * Harmony Lane™ leads: from a business that depends on you to one designed
 * around the life it was built to make possible.
 */
import { motion } from "framer-motion"

const PROGRESSION = [
  {
    from: "The business decides your day",
    to: "You decide how the business enters your day",
  },
  {
    from: "Freedom depends on you being available",
    to: "Freedom is built into how the business operates",
  },
  {
    from: "Success measured by how much gets done",
    to: "Success measured by the life the business makes possible",
  },
  {
    from: "You are the employee of your own company",
    to: "You are the founder the business is designed around",
  },
]

export function DestinationProgressionSection() {
  return (
    <section id="destination" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            17 — The Destination
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Where the Lane leads.
          </h2>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#6B5860]">
            Harmony Lane™ isn&apos;t a temporary escape from the business. It&apos;s a progression — from the
            pattern you fell into, to a business intentionally designed around the human who built it.
          </p>
        </motion.div>

        <ul className="mx-auto mt-12 max-w-3xl space-y-3">
          {PROGRESSION.map((row, i) => (
            <motion.li
              key={row.from}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="grid items-center gap-3 rounded-2xl border border-[#4A3A42]/10 bg-[#FDF6F3] p-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-5"
            >
              <p className="font-poppins text-pretty text-sm leading-relaxed text-[#8A7A82] line-through decoration-[#8A7A82]/40">
                {row.from}
              </p>
              <span className="hidden text-lg text-[#C13B6B] sm:block" aria-hidden>
                →
              </span>
              <p className="font-poppins text-pretty text-sm font-semibold leading-relaxed text-[#5A7F46]">
                {row.to}
              </p>
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
          Not less ambition. Not less success. A business designed to make the life possible.
        </motion.p>
      </div>
    </section>
  )
}
