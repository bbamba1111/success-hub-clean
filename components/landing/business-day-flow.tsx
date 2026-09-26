"use client"

/**
 * BusinessDayFlow — "What is the Work-Life Balance Business Day™?"
 *
 * Presents the signature experience and its public sequence in the exact
 * canonical order, WITHOUT clock times and WITHOUT exposing proprietary
 * internals (the 4-Hour Focused CEO Workday™ appears as a single named
 * component, never its subsections). Images are pulled from the engine's
 * SCHEDULE by id so the marketing surface stays visually in sync with the
 * real product without republishing its operating rules.
 */
import { motion } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"

/** Canonical public sequence (section 26 of the brief). */
const SEQUENCE: { id: string; label: string; blurb: string; part?: "one" }[] = [
  {
    id: "flex-time",
    label: "Flex Time™",
    blurb: "Space to prepare yourself, your environment, and your mind to enter the day — without rushing.",
    part: "one",
  },
  {
    id: "monday-reality-check",
    label: "Weekly Work-Life Balance Reality Check™",
    blurb: "See what is actually true about your current work-life balance before the week takes over.",
    part: "one",
  },
  {
    id: "monday-debrief",
    label: "Redesign Your Entry Into The Workweek™",
    blurb: "Use what you discovered to intentionally redesign how you enter the week. This is Part One of Monday.",
    part: "one",
  },
  {
    id: "morning-given",
    label: "Morning GIV•EN™",
    blurb: "Move directly into the morning routine that grounds the day.",
  },
  {
    id: "movement-window",
    label: "Workout & Movement Window™",
    blurb: "Movement is protected inside the day, not squeezed around it.",
  },
  {
    id: "lunch-break",
    label: "Extended Healthy Hybrid Lunch™",
    blurb: "Protected space to nourish, step away, connect, and reset.",
  },
  {
    id: "focused-work",
    label: "4-Hour Focused CEO Workday™",
    blurb: "The focused work container where the real business gets done — contained, not endless.",
  },
  {
    id: "time-freedom",
    label: "Time Freedom™",
    blurb: "Once the work container ends, work stays contained so life has room to expand.",
  },
  {
    id: "power-down",
    label: "Power Down & Unplug™",
    blurb: "The protected closing boundary of the Business Day.",
  },
]

const IMAGE_BY_ID = new Map<string, string | undefined>(
  SCHEDULE.map((b) => [
    b.id as string,
    (Array.isArray(b.backgroundImage) ? b.backgroundImage[0] : b.backgroundImage) || undefined,
  ]),
)

export function BusinessDayFlow() {
  return (
    <section id="business-day" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            The Signature Experience
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            One intentional day, lived from first light to last boundary
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Make Time For More™ is the signature experience of Harmony Lane™ — the complete Work-Life Balance
            Business Day™, experienced in real time. Not a course, a webinar, or a coworking session. A day you
            step into and live, in sequence, with a community moving through it beside you.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SEQUENCE.map((step, i) => {
            const img = IMAGE_BY_ID.get(step.id) || "/placeholder.svg"
            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group overflow-hidden rounded-3xl border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={step.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <span className="font-poppins absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-xs font-bold text-[#C13B6B] backdrop-blur-sm">
                    {i + 1}
                  </span>
                  {step.part === "one" && (
                    <span className="font-poppins absolute right-3 top-3 rounded-full bg-[#7FB069] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                      Part One
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-bold leading-snug text-[#4A3A42]">{step.label}</h3>
                  <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">{step.blurb}</p>
                </div>
              </motion.article>
            )
          })}
        </div>

        <p className="font-poppins mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-[#8A7A82]">
          The rhythm flows in one unbroken sequence — from Flex Time™ through Power Down &amp; Unplug™ — with no
          interruptions and nothing to buy in the middle of your day.
        </p>
      </div>
    </section>
  )
}
