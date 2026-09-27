"use client"

/**
 * "Before Monday, we help you see where you are." The simple four-beat journey
 * a founder receives after joining: Reality Check → Report → Tour → Monday.
 * This replaces the old free Sunday Guided Tour front door — the Tour is now
 * part of the paid experience, not a competing entry point.
 */
import { motion } from "framer-motion"

const STEPS = [
  {
    label: "Reality Check\u2122",
    body: "Understand where you\u2019re entering the week from — honestly.",
  },
  {
    label: "Report\u2122",
    body: "See what your Reality Check reveals about your business and your time.",
  },
  {
    label: "Guided Tour",
    body: "See the Business Day before it goes live, so nothing is unfamiliar.",
  },
  {
    label: "Monday",
    body: "Experience the rhythm with your real business, guided in real time.",
  },
]

export function BeforeMondaySection() {
  return (
    <section id="how-it-works" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            When you join
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            Before Monday, we help you see where you are.
          </h2>
          <p className="font-poppins mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Join &rarr; see your reality &rarr; see the destination &rarr; experience Monday.
          </p>
        </motion.div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.08, 0.3) }}
              className="flex flex-col rounded-3xl border border-[#4A3A42]/10 bg-[#FDF6F3] p-6"
            >
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#C13B6B]">
                Step {i + 1}
              </span>
              <h3 className="font-playfair mt-2 text-xl font-bold leading-snug text-[#4A3A42]">{step.label}</h3>
              <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#6B5860]">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
