"use client"

/**
 * DestinationSection — Harmony Lane™ as a place you can return to and grow with.
 *
 * Shows the Experience → Discover → Adopt → Implement → Install progression and
 * a sampling of Work-Life Balance Time & Space Boundaries™ presented as
 * possibilities, not mandates. Installation is introduced as a deeper pathway
 * only — no installation pricing and no implementation methodology exposed.
 */
import { motion } from "framer-motion"

const PROGRESSION = [
  { step: "Experience", body: "Experience the Work-Life Balance Business Day™ in real time." },
  {
    step: "Discover",
    body: "Explore Work-Life Balance Time & Space Boundaries™ and different ways work and life can be structured for human capacity.",
  },
  { step: "Adopt", body: "Choose the boundaries and rhythms that fit your life, work, leadership, and business." },
  { step: "Implement", body: "Apply the boundaries that fit to your own workweek — and, where it helps, to your team." },
  {
    step: "Install",
    body: "For founders and organizations ready for deeper change, the full model can be installed through repetition.",
  },
]

const BOUNDARIES = [
  "4-Day Workweek™",
  "4-Hour Focused CEO Workday™",
  "Flex Time™",
  "Protected Movement",
  "Extended Healthy Hybrid Lunch™",
  "Defined Workday Start / Stop",
  "Meeting Boundaries",
  "Response-Time Boundaries",
  "Digital Boundaries",
  "Protected Deep Work",
  "Power Down & Unplug™",
  "Protected Personal Time",
  "Protected Relationship Time",
  "Protected Recreation",
  "Team Accessibility Boundaries",
  "No-Work Zones",
]

export function DestinationSection() {
  return (
    <section id="destination" className="w-full bg-[#F6FAF2] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            A Destination, Not A Download
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Enter it. Discover what&apos;s possible. Make it yours.
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Inside Harmony Lane™ you don&apos;t just complete a program — you discover different ways of
            structuring work and life around human capacity and sustainability, and carry home the ones that fit.
          </p>
        </div>

        {/* Progression */}
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROGRESSION.map((p, i) => (
            <motion.li
              key={p.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-white bg-white p-6 shadow-sm"
            >
              <span className="font-playfair text-3xl font-bold text-[#E26C73]/40">{i + 1}</span>
              <h3 className="font-poppins mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#C13B6B]">
                {p.step}
              </h3>
              <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">{p.body}</p>
            </motion.li>
          ))}
        </ol>

        {/* Boundaries */}
        <div className="mt-16 rounded-3xl border border-[#7FB069]/25 bg-white p-8 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-playfair text-2xl font-bold text-[#4A3A42]">
              Work-Life Balance Time &amp; Space Boundaries™
            </h3>
            <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">
              Not rules. Possibilities. A few of the boundaries founders discover inside the destination —
              there&apos;s no single correct version, only the ones that fit your life.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {BOUNDARIES.map((b) => (
              <span
                key={b}
                className="font-poppins rounded-full border border-[#7FB069]/25 bg-[#F6FAF2] px-4 py-2 text-sm text-[#3F5E30]"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
