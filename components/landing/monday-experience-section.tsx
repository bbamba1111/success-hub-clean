"use client"

/**
 * "What if Monday started differently?" — the product, shown simply.
 *
 * Names the Work-Life Balance Business Day™, states the governing principle
 * (Contain the work. Protect the rest. Let life have space to expand™.), then
 * shows the beautiful Monday schedule. This is where the founder sees exactly
 * what she is buying — no methodology lecture, just the rhythm.
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

const KIND_STYLES: Record<Kind, { row: string; time: string; name: string }> = {
  flex: { row: "border-[#4A3A42]/8 bg-[#FDF6F3]", time: "text-[#8A7A82]", name: "text-[#4A3A42]" },
  care: { row: "border-[#4A3A42]/8 bg-white", time: "text-[#8A7A82]", name: "text-[#4A3A42]" },
  work: { row: "border-[#C13B6B]/30 bg-[#FBEBF0]", time: "text-[#C13B6B]/70", name: "text-[#C13B6B]" },
  life: { row: "border-[#7FB069]/30 bg-[#F1F6EC]", time: "text-[#5A7F46]/70", name: "text-[#5A7F46]" },
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.55 },
}

export function MondayExperienceSection() {
  return (
    <section id="monday" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            What if Monday started differently?
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            The Work-Life Balance Business Day&trade;
          </h2>
          <p className="font-poppins mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            A live operating environment where you bring your real business into a protected rhythm — and experience
            the difference in real time.
          </p>
        </motion.div>

        {/* Governing principle */}
        <motion.div
          {...reveal}
          className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] border border-[#C13B6B]/20 bg-white shadow-lg"
        >
          <div className="grid text-center sm:grid-cols-3">
            <div className="border-b border-[#4A3A42]/8 p-7 sm:border-b-0 sm:border-r">
              <p className="font-playfair text-xl font-bold leading-snug text-[#C13B6B]">Contain the work.</p>
            </div>
            <div className="border-b border-[#4A3A42]/8 p-7 sm:border-b-0 sm:border-r">
              <p className="font-playfair text-xl font-bold leading-snug text-[#4A3A42]">Protect the rest.</p>
            </div>
            <div className="p-7">
              <p className="font-playfair text-xl font-bold leading-snug text-[#5A7F46]">
                Let life have space to expand&trade;.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The schedule — the product */}
        <motion.div {...reveal} className="mx-auto mt-6 max-w-3xl">
          <p className="font-poppins mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8A7A82]">
            One Monday, lived in real time
          </p>
          <ul className="space-y-2.5">
            {SCHEDULE.map((b) => {
              const s = KIND_STYLES[b.kind]
              return (
                <li
                  key={b.name}
                  className={`flex items-center gap-4 rounded-2xl border p-4 sm:gap-6 ${s.row}`}
                >
                  <span
                    className={`font-poppins w-24 flex-none text-xs font-bold uppercase tracking-[0.08em] sm:w-32 sm:text-sm ${s.time}`}
                  >
                    {b.time}
                  </span>
                  <span className={`font-poppins text-sm font-semibold leading-snug sm:text-base ${s.name}`}>
                    {b.name}
                  </span>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
