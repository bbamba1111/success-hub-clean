"use client"

/**
 * 08 — From Day to Week. The redesigned day scales into a redesigned week:
 * a 4-day CEO workweek and a 3-day weekend, made possible by design rather
 * than willpower.
 */
import { motion } from "framer-motion"

const WEEK = [
  { day: "Mon", label: "Enter", tone: "work" },
  { day: "Tue", label: "Build", tone: "work" },
  { day: "Wed", label: "Lead", tone: "work" },
  { day: "Thu", label: "Complete", tone: "work" },
  { day: "Fri", label: "Freedom", tone: "life" },
  { day: "Sat", label: "Freedom", tone: "life" },
  { day: "Sun", label: "Restore", tone: "life" },
]

const MONDAY_MOVES = [
  "Reality Check™",
  "Decide & Redesign™",
  "Life Priority",
  "Delegation Priority",
  "Operating Rule™",
  "Morning GIV•EN™",
]

export function DayToWeekSection() {
  return (
    <section id="week" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            08 — From Day to Week
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            When the day is designed, the week can be redesigned.
          </h2>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#6B5860]">
            The 4-Hour Workday™ scales into a 4-Day CEO Workweek™ — and a 3-Day Weekend™. Not by working harder in
            less time, but by redesigning what the business needs so the calendar can hold the life.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-7 gap-2 sm:gap-3">
          {WEEK.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`flex flex-col items-center rounded-2xl border p-3 text-center sm:p-4 ${
                d.tone === "life"
                  ? "border-[#7FB069]/35 bg-[#F1F6EC]"
                  : "border-[#C13B6B]/20 bg-[#FFF1F5]"
              }`}
            >
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.1em] text-[#8A7A82]">{d.day}</span>
              <span
                className={`font-playfair mt-2 text-sm font-bold leading-tight sm:text-base ${
                  d.tone === "life" ? "text-[#5A7F46]" : "text-[#C13B6B]"
                }`}
              >
                {d.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="font-poppins flex items-center gap-2 text-sm text-[#6B5860]">
            <span className="h-3 w-3 rounded-sm bg-[#FFD9E4]" aria-hidden /> 4-Day CEO Workweek™
          </span>
          <span className="font-poppins flex items-center gap-2 text-sm text-[#6B5860]">
            <span className="h-3 w-3 rounded-sm bg-[#DDEBCF]" aria-hidden /> 3-Day Weekend™
          </span>
        </div>

        {/* Monday — the entry point, as a compact callout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#C13B6B]/15 bg-[#FFF1F5] p-6 sm:p-8"
        >
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
            It starts with Monday
          </p>
          <p className="font-poppins mt-3 text-pretty text-base leading-relaxed text-[#5A4A52]">
            Monday is the entry point — how you enter the week shapes the whole week. Instead of inheriting last
            week&apos;s momentum, you enter through a deliberate sequence:
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {MONDAY_MOVES.map((move) => (
              <li
                key={move}
                className="font-poppins rounded-full border border-[#C13B6B]/20 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#C13B6B]"
              >
                {move}
              </li>
            ))}
          </ul>
        </motion.div>

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
