"use client"

/**
 * 12 — Before You Enter. Sets the founder's posture before arrival: this is a
 * lived experience you engage with, using your real business — not content you
 * passively consume. Establishes the Founder Profile mindset.
 */
import { motion } from "framer-motion"

const BRING = [
  { label: "Your real business", body: "Not a hypothetical. The actual business, with its actual demands." },
  { label: "Your real time", body: "You'll work with the day as it actually unfolds, in real time." },
  { label: "Your honesty", body: "The Reality Check™ only works if you're willing to see clearly." },
  { label: "Your intention", body: "Come to build and install, not just to feel inspired for an afternoon." },
]

export function BeforeYouEnterSection() {
  return (
    <section id="before" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            12 — Before You Enter
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            This is a lived experience — not content to consume.
          </h2>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#6B5860]">
            Harmony Lane™ isn&apos;t a course you watch or a framework you file away. It&apos;s a destination you
            step into and engage with — using your real business, in real time. What you bring shapes what you
            leave with.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {BRING.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
              className="rounded-3xl border border-[#7FB069]/20 bg-[#F1F6EC] p-7"
            >
              <h3 className="font-playfair text-xl font-bold leading-snug text-[#5A7F46]">{item.label}</h3>
              <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#5A4A52]">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-center text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl"
        >
          Enter as the founder who&apos;s ready to build differently — and the day will meet you there.
        </motion.p>
      </div>
    </section>
  )
}
