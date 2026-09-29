"use client"

import { motion } from "framer-motion"
import { getPlanByLevel } from "@/lib/payments/config"

/**
 * Section 9 — The Offer. The Work-Life Balance Business Day™ (Monday) is the
 * single public paid experience ($1,997). Per spec, this page shows NO Week or
 * Installation pricing — those are discovered inside Harmony Lane™ after entry.
 *
 * Price and checkout URL are read from the single product ladder in
 * `lib/payments/config.ts` (the Business Day level) so this page never
 * hardcodes pricing or Paperbell links.
 */

const INCLUDED = [
  "Welcome",
  "Work-Life Balance Reality Check\u2122",
  "Reality Check Report\u2122",
  "Guided Tour",
  "Full Work-Life Balance Business Day\u2122",
  "Full Monday environment",
]

export function MondayOffer() {
  const day = getPlanByLevel("business-day")
  const price = day?.priceLabel ?? "$1,997"

  return (
    <section id="offer" className="w-full bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2.5rem] border border-[#C13B6B]/25 bg-[#FDF6F3] shadow-xl"
        >
          <div className="p-9 text-center sm:p-14">
            <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
              <span className="whitespace-nowrap">Make Time For More&trade;</span>
              <span className="mt-1 block text-[#C13B6B]">On Mondays</span>
            </h2>
            <p className="font-poppins mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">
              The Work-Life Balance Business Day&trade;
            </p>

            <p className="font-playfair mt-8 text-6xl font-bold text-[#C13B6B]">{price}</p>

            <p className="font-poppins mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-[#6B5860]">
              Reserve one Monday to experience a different way to enter the workweek.
            </p>

            <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left">
              {INCLUDED.map((item) => (
                <li key={item} className="font-poppins flex items-start gap-3 text-base leading-snug text-[#5A4A52]">
                  <span className="mt-0.5 flex-none font-semibold text-[#5A7F46]" aria-hidden>
                    &#10003;
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3">
              <a
                href={day?.checkoutUrl || "#offer"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-10 py-4 text-base font-semibold uppercase tracking-wide text-white shadow-xl shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
              >
                Reserve Monday Now&trade; &mdash; {price}
              </a>
              <span className="font-poppins text-pretty text-sm italic text-[#6B5860]">
                Sync Into The Human Sustainability Circadian Rhythm Today&trade;
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
