"use client"

/**
 * Section 5 — The Work-Life Balance Business Day™. "One business day. Designed
 * differently." Shows the day as an editorial vertical timeline.
 *
 * Visual behavior (per spec): the workday (1–5 PM CEO Workday) is visually
 * CONTAINED — compact, bordered, tucked in — while the life/recovery blocks
 * (Flex, Time Freedom, Unplug) visually EXPAND around it with more air. Not a
 * corporate calendar.
 */
import { motion } from "framer-motion"

type Kind = "flex" | "work" | "life" | "care"

const SCHEDULE: { time: string; name: string; kind: Kind }[] = [
  { time: "7:00 – 9:00", name: "Flex Time\u2122", kind: "flex" },
  { time: "9:00 – 9:45", name: "Morning GIV\u2022EN\u2122", kind: "care" },
  { time: "9:45 – 10:30", name: "Decide & Design\u2122", kind: "care" },
  { time: "10:30 – 11:00", name: "Movement Window\u2122", kind: "care" },
  { time: "11:00 – 1:00", name: "Extended Healthy Hybrid Lunch\u2122", kind: "care" },
  { time: "1:00 – 5:00", name: "4-Hour Focused CEO Workday\u2122", kind: "work" },
  { time: "5:00 – 10:00", name: "Time Freedom\u2122", kind: "life" },
  { time: "10:00 – 11:00", name: "Power Down\u2122", kind: "care" },
  { time: "11:00", name: "Unplug\u2122", kind: "life" },
]

// Row styling carries the "contained work / expanding life" idea:
// work rows are compact and tightly bordered; life rows are taller and airy.
const KIND_STYLES: Record<Kind, { row: string; pad: string; time: string; name: string; note?: string }> = {
  flex: { row: "border-[#7FB069]/25 bg-[#F1F6EC]", pad: "py-6", time: "text-[#5A7F46]/70", name: "text-[#5A7F46]" },
  care: { row: "border-[#4A3A42]/8 bg-white", pad: "py-4", time: "text-[#8A7A82]", name: "text-[#4A3A42]" },
  work: {
    row: "border-[#C13B6B]/40 bg-[#FBEBF0] ring-1 ring-inset ring-[#C13B6B]/15",
    pad: "py-3",
    time: "text-[#C13B6B]/70",
    name: "text-[#C13B6B]",
    note: "Contained",
  },
  life: { row: "border-[#7FB069]/30 bg-[#F1F6EC]", pad: "py-7", time: "text-[#5A7F46]/70", name: "text-[#5A7F46]" },
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.55 },
}

export function MondayExperienceSection() {
  return (
    <section id="monday" className="relative w-full overflow-hidden bg-[#FDF6F3] py-24 sm:py-32">
      {/* Panoramic backdrop — soft, tinted so the timeline stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/images/panoramic-design-weekly.png')" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#FDF6F3]/60" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
          <h2 className="font-playfair text-balance text-3xl font-bold uppercase leading-tight text-[#4A3A42] sm:text-5xl">
            One Business Day.
            <span className="mt-1 block text-[#C13B6B]">Designed Differently.</span>
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            The Work-Life Balance Business Day&trade; is a live operating experience designed around the reality that
            a sustainable business must make room for the human beings operating it.
          </p>
        </motion.div>

        {/* The day as an editorial vertical timeline */}
        <motion.div {...reveal} className="mx-auto mt-14 max-w-2xl">
          <ul className="space-y-3">
            {SCHEDULE.map((b) => {
              const s = KIND_STYLES[b.kind]
              return (
                <li
                  key={b.name}
                  className={`flex items-center gap-4 rounded-2xl border px-5 sm:gap-6 ${s.pad} ${s.row}`}
                >
                  <span
                    className={`font-poppins w-24 flex-none text-xs font-bold uppercase tracking-[0.08em] sm:w-32 sm:text-sm ${s.time}`}
                  >
                    {b.time}
                  </span>
                  <span className={`font-poppins flex-1 text-sm font-semibold leading-snug sm:text-base ${s.name}`}>
                    {b.name}
                  </span>
                  {s.note && (
                    <span className="font-poppins hidden flex-none rounded-full bg-[#C13B6B]/12 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#C13B6B] sm:inline">
                      {s.note}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="font-poppins mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#8A7A82]">
            The work is contained. Life expands around it.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
