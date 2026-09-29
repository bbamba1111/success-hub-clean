"use client"

/**
 * Final CTA — "What if Monday didn't have to take your life with it?" The
 * confident, spacious close. One call to action: Reserve Your Day Now™.
 */
import { motion } from "framer-motion"
import { getPlanByLevel } from "@/lib/payments/config"

export function FinalCtaSection() {
  const day = getPlanByLevel("business-day")
  const price = day?.priceLabel ?? "$1,997"

  return (
    <section id="enter" className="w-full bg-[#2E2A3A] py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-balance text-4xl font-bold uppercase leading-tight text-white sm:text-6xl">
            What if Monday
            <span className="mt-1 block text-[#E8A0AC]">didn&apos;t have to take your life with it?</span>
          </h2>

          <div className="font-poppins mx-auto mt-10 space-y-2 text-pretty text-lg leading-relaxed text-white/80">
            <p>Start with one day.</p>
            <p>Experience the boundary.</p>
            <p>See what changes when the business makes room for the human.</p>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            <a
              href={day?.checkoutUrl || "#offer"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins inline-flex items-center justify-center rounded-full bg-[#E26C73] px-10 py-4 text-base font-semibold uppercase tracking-wide text-white shadow-xl shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Reserve Your Day Now&trade;
            </a>
            <span className="font-playfair text-3xl font-bold text-white">{price}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
