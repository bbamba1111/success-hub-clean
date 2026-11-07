"use client"

/**
 * 02 — The Two Lanes. Hustle and Harmony as two lanes in one entrepreneurial
 * ecosystem — not either/or. Elegant two-column treatment.
 */
import { motion } from "framer-motion"

const HUSTLE = ["Speed", "Urgency", "Acceleration", "Performance"]
const HARMONY = ["Rhythm", "Space", "Intentionality", "Boundaries", "Sustainability"]

export function TwoLanesSection() {
  return (
    <section id="two-lanes" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            02 — The Two Lanes
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Two lanes. Different speeds.
            <span className="mt-2 block text-[#C13B6B]">One entrepreneurial ecosystem.</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-[#4A3A42]/12 bg-[#F6F1F3] p-8 sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#8A7A82]">
              Hustle Entrepreneurship™
            </p>
            <ul className="mt-6 space-y-3">
              {HUSTLE.map((item) => (
                <li key={item} className="font-playfair text-2xl font-bold text-[#6B5860] sm:text-3xl">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-[#7FB069]/30 bg-[#F1F6EC] p-8 shadow-lg sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              Harmony Lane™
            </p>
            <ul className="mt-6 space-y-3">
              {HARMONY.map((item) => (
                <li key={item} className="font-playfair text-2xl font-bold text-[#5A7F46] sm:text-3xl">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-3xl text-center"
        >
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
            Entrepreneurship doesn&apos;t have to be either/or. Hustle and Harmony can coexist. Sometimes you
            accelerate. Sometimes you create spaciousness. Sometimes you merge between the two intentionally. The
            point isn&apos;t to eliminate ambition.
          </p>
          <p className="font-playfair mt-6 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
            The point is to stop letting one operating pattern define the entire business.
          </p>
          <p className="font-playfair mt-8 text-balance text-2xl font-bold leading-snug text-[#C13B6B] sm:text-3xl">
            Harmony Lane™ is the parallel lane.
          </p>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            A different way to enter the workweek. A different way to experience the business. A different way to
            think about what success is supposed to make possible.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
