"use client"

/**
 * 16 — The Free Sunday Guided Tour. A no-cost way to walk the destination with
 * Barbara before committing — the gentle on-ramp that sits right after the paid
 * offers. CTA routes to account creation (lead capture), never an invented
 * checkout URL.
 */
import { motion } from "framer-motion"

const TOUR = [
  "Walk the Work-Life Balance Business Day™ from entry to Unplug™",
  "See how the boundaries are built into the rhythm of the day",
  "Understand how the experience installs into a real business",
  "Decide, without pressure, whether the Lane is for you",
]

export function GuidedTourSection() {
  return (
    <section id="tour" className="w-full bg-[#F1F6EC] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-[#7FB069]/25 bg-white p-8 shadow-lg sm:p-12"
        >
          <div className="text-center">
            <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
              16 — Free · No Card Required
            </span>
            <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
              Start with the Free Sunday Guided Tour™
            </h2>
            <p className="font-great-vibes mt-2 text-3xl text-[#C13B6B]">Come see the destination first</p>
            <p className="font-poppins mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[#6B5860]">
              Before you enter fully, take a guided walk through Harmony Lane™ on a Sunday — the day designed for
              restoration and looking ahead. It&apos;s free, there&apos;s no pressure, and it&apos;s the simplest
              way to feel what the Lane actually is.
            </p>
          </div>

          <ul className="mx-auto mt-8 grid max-w-2xl gap-2.5 sm:grid-cols-2">
            {TOUR.map((item) => (
              <li
                key={item}
                className="font-poppins flex items-start gap-3 rounded-2xl border border-[#7FB069]/20 bg-[#F1F6EC] p-4 text-sm leading-relaxed text-[#5A4A52]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col items-center gap-3">
            <a
              href="/auth/signup"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#7FB069] px-9 py-4 text-base font-semibold text-white shadow-lg shadow-[#7FB069]/25 transition-transform hover:scale-[1.03] hover:bg-[#6ba058]"
            >
              Reserve the Free Sunday Guided Tour™
            </a>
            <p className="font-poppins text-xs font-semibold uppercase tracking-[0.16em] text-[#8A7A82]">
              Free to walk · Yours to enter when you&apos;re ready
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
