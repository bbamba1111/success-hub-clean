"use client"

/**
 * The Journey — the post-purchase destination path, explained without implying
 * any stage is publicly accessible before purchase. Presented as a destination
 * journey, not a course curriculum.
 */
import { motion } from "framer-motion"

const STAGES = [
  {
    name: "On-Ramp™",
    body: "Get to know the founder, the business, and the current work-life and time-leak reality.",
  },
  { name: "Founder Destination™", body: "Define where you want to go — with the business, the role, and your life." },
  { name: "Weekly Work-Life Balance Reality Check™", body: "See what is actually happening right now." },
  {
    name: "Decide & Redesign™",
    body: "Choose the priorities, boundaries, delegation decisions, and operating rules for the week.",
  },
  {
    name: "Communicate My Boundary™",
    body: "Turn those decisions into clear communication with the people affected by them.",
  },
  { name: "Make Time For More™", body: "Experience the redesigned operating rhythm in real time." },
  { name: "30 / 60 / 90 Installation", body: "Move from experiencing the model to installing it into the business." },
]

export function JourneySection() {
  return (
    <section id="journey" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            The Journey
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            A destination journey, not a curriculum.
          </h2>
          <p className="font-poppins mt-5 text-pretty text-lg leading-relaxed text-[#6B5860]">
            It begins the moment you enter Harmony Lane™ — and moves from understanding where you are to living a
            redesigned rhythm.
          </p>
        </motion.div>

        <ol className="relative mt-12 space-y-4 border-l border-[#E4B6C2] pl-8">
          {STAGES.map((stage, i) => (
            <motion.li
              key={stage.name}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative rounded-2xl border border-[#F2E4E8] bg-white p-5"
            >
              <span className="font-poppins absolute -left-[3.15rem] flex h-8 w-8 items-center justify-center rounded-full bg-[#C13B6B] text-sm font-bold text-white shadow-sm">
                {i + 1}
              </span>
              <h3 className="font-playfair text-lg font-bold text-[#4A3A42]">{stage.name}</h3>
              <p className="font-poppins mt-1.5 text-pretty text-sm leading-relaxed text-[#6B5860]">{stage.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
