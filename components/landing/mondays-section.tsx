"use client"

/**
 * 11 — Make Time For More On Mondays™. Monday is reframed as the entry point to
 * the workweek. The morning is resequenced: check in with life first, decide &
 * design the day, take a brief transition, THEN align and move.
 */
import { motion } from "framer-motion"

const MONDAY_FLOW = [
  { time: "7:00–9:00 AM", label: "Flex Time™", body: "Enter the week on your terms, before the business asks." },
  {
    time: "9:00–9:30 AM",
    label: "Work-Life Balance Reality Check™",
    body: "Check in with your life first — honestly.",
  },
  {
    time: "9:30–10:00 AM",
    label: "Redesign Your Entry Into The Workweek™",
    body: "Decide and design how you'll enter — instead of defaulting to the old rhythm.",
  },
  { time: "10:00–10:15 AM", label: "Transition Space™", body: "A brief, deliberate pause between deciding and doing." },
  { time: "10:15–11:00 AM", label: "Morning GIV•EN™", body: "Only now do you align — and then move." },
]

export function MondaysSection() {
  return (
    <section id="mondays" className="w-full bg-[#FFF1F5] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
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
            How you enter the week shapes the entire week. Most founders enter Monday through urgency — inheriting
            last week&apos;s momentum and this week&apos;s pressure before they&apos;ve decided anything. Harmony
            Lane™ resequences the Monday morning so you check in with your life first, decide and design your day,
            take a brief transition — and only then align and move.
          </p>
        </motion.div>

        <ol className="mx-auto mt-12 max-w-3xl space-y-3">
          {MONDAY_FLOW.map((step, i) => (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex flex-col gap-1 rounded-2xl border border-[#C13B6B]/15 bg-white p-5 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="font-poppins w-32 flex-none text-sm font-bold uppercase tracking-[0.08em] text-[#C13B6B]">
                {step.time}
              </span>
              <div>
                <h3 className="font-playfair text-lg font-bold leading-snug text-[#4A3A42]">{step.label}</h3>
                <p className="font-poppins mt-0.5 text-pretty text-sm leading-relaxed text-[#6B5860]">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

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
