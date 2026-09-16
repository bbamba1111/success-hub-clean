"use client"

/**
 * Original Entrepreneurial Intention™ (spec §4) — "Remember why you became an
 * entrepreneur." A recognition beat, not a questionnaire. Reconnects the
 * founder with the intention that predated the business plan, then hands off
 * toward Founder Destination™. Typographic, minimal cards.
 */
import { motion } from "framer-motion"

const INTENTIONS = [
  "Freedom",
  "Autonomy",
  "Time",
  "Family",
  "Creativity",
  "Financial independence",
  "Meaningful work",
  "Impact",
  "A different way to live and work",
]

const PROMPTS = [
  "What did you originally want your business to make possible?",
  "What mattered enough to build around?",
  "What did you imagine your life would look like because you became an entrepreneur?",
]

export function OriginalIntentionSection() {
  return (
    <section id="intention" className="w-full bg-[#FFF1F5] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Original Entrepreneurial Intention™
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Remember why you became an entrepreneur.
          </h2>
          <p className="font-poppins mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Before there was a business plan, there was an intention — something you wanted entrepreneurship to
            make possible. Harmony Lane™ begins there.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5"
        >
          {INTENTIONS.map((item) => (
            <li
              key={item}
              className="font-poppins rounded-full border border-[#C13B6B]/20 bg-white px-4 py-2 text-sm font-medium text-[#C13B6B]"
            >
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-2xl border-t border-[#E4B6C2] pt-8"
        >
          <ul className="space-y-4">
            {PROMPTS.map((q) => (
              <li
                key={q}
                className="font-playfair text-pretty text-xl font-semibold italic leading-snug text-[#4A3A42] sm:text-2xl"
              >
                {q}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
