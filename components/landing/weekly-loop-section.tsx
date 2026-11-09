"use client"

/**
 * The Monday Weekly Loop (spec §11–12). Monday is the entry point, not a
 * one-off. Reality Check™ + Decide & Redesign™ set three weekly priorities;
 * the founder lives them Tuesday–Sunday while running the business, then
 * returns the next Monday. This is the operating rhythm — not a Sunday recheck.
 */
import { motion } from "framer-motion"

const PRIORITIES = [
  {
    label: "Life Priority",
    question: "What am I making time for in my life this week?",
  },
  {
    label: "Delegation Priority",
    question: "What am I no longer going to personally carry?",
  },
  {
    label: "Operating Rule™ Priority",
    question: "What rule, boundary, or way of working am I establishing or reinforcing?",
  },
]

const LOOP = [
  "Reality Check™",
  "Decide & Redesign™",
  "Experience the Business Day™",
  "Live the redesigned week",
  "Return to reality",
  "Decide & Redesign again",
]

export function WeeklyLoopSection() {
  return (
    <section id="weekly-loop" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The Weekly Rhythm
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Monday is the entry point.
            <span className="block text-[#C13B6B]">The redesign continues all week.</span>
          </h2>
          <p className="font-poppins mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Monday begins with your Reality Check™ and Decide &amp; Redesign™. From there, you carry three
            priorities into the rest of the week — while you keep running your business.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {PRIORITIES.map(({ label, question }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="flex flex-col rounded-3xl border border-[#F2E4E8] bg-white p-7"
            >
              <span className="font-playfair text-4xl font-bold text-[#E4B6C2]">{i + 1}</span>
              <h3 className="font-poppins mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                {label}
              </h3>
              <p className="font-playfair mt-2 text-pretty text-lg font-semibold leading-snug text-[#4A3A42]">
                {question}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="font-poppins mx-auto mt-8 max-w-2xl text-center text-pretty text-base leading-relaxed text-[#6B5860]"
        >
          Communicate your decisions. Live your boundaries. Delegate what you decided to delegate. Honor your Life
          Priority. Practice your Operating Rule™. Keep running your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-[2rem] border border-[#7FB069]/25 bg-[#7FB069]/8 p-8 sm:p-10"
        >
          <p className="font-poppins text-center text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
            The loop that turns balance into an operating rhythm
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {LOOP.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="font-poppins rounded-full bg-white px-4 py-2 text-sm font-medium text-[#4A3A42] shadow-sm">
                  {step}
                </span>
                <span className="text-[#7FB069]" aria-hidden>
                  {i < LOOP.length - 1 ? "\u2192" : "\u21BA"}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-poppins mx-auto mt-7 max-w-2xl text-center text-pretty text-sm leading-relaxed text-[#5A7F46]">
            The next Monday, you return to reality. What actually happened? What did you learn? What needs to
            change? Your three priorities can be new — or continued. Tuesday through Sunday is the integration
            period, not a separate program.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
