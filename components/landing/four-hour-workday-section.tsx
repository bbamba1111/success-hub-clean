"use client"

/**
 * The 4-Hour Workday, explained correctly (spec §10). Reframes it away from
 * "work less, get more done." The four-hour container is a constraint that
 * forces the redesign — not the promise itself. Typographic vertical sequence
 * on a dark ground for contrast.
 */
import { motion } from "framer-motion"

const SEQUENCE = [
  "Contain the work",
  "Let go",
  "Delegate",
  "Communicate boundaries",
  "Stop being the bottleneck",
  "Prioritize CEO-level work",
  "Create operating rules",
  "Protect human capacity",
  "Make time for life",
]

export function FourHourWorkdaySection() {
  return (
    <section id="four-hour" className="w-full bg-[#2E2A3A] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            The 4-Hour Focused CEO Workday™
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
            You don&apos;t create a four-hour workday by deciding to work four hours.
            <span className="mt-2 block text-[#E8A0AC]">
              You create it by redesigning what happens around those four hours.
            </span>
          </h2>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mx-auto mt-12 flex max-w-md flex-col items-center gap-0"
        >
          {SEQUENCE.map((step, i) => (
            <motion.li
              key={step}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4 }}
              className="flex w-full flex-col items-center"
            >
              <span className="font-poppins w-full rounded-2xl border border-white/12 bg-white/5 px-6 py-3.5 text-center text-base font-medium text-white/90">
                {step}
              </span>
              {i < SEQUENCE.length - 1 && (
                <span className="py-1.5 text-lg text-[#E8A0AC]/60" aria-hidden>
                  &darr;
                </span>
              )}
            </motion.li>
          ))}
        </motion.ol>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-center text-2xl font-bold leading-snug text-white sm:text-3xl"
        >
          The four-hour container is not the destination.
          <span className="mt-1 block text-[#E8A0AC]">It is the constraint that reveals what needs to change.</span>
        </motion.p>
      </div>
    </section>
  )
}
