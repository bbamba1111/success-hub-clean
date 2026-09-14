"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Depth of Entry — the Day / Week / Installation presented as how deeply you
 * enter Harmony Lane™, not as three unrelated products.
 *
 *   $297 — Work-Life Balance Business Day™   (Paperbell package 234456)
 *   $497 — Work-Life Balance Business Week™   (Paperbell package 234458)
 *   30/60/90 Installation — no public price (routes to internal /pricing)
 *
 * Paperbell mappings and $297/$497 pricing are spec-locked. Do not invent or
 * replace the checkout URLs, and do not reintroduce retired tiers.
 */

const PAPERBELL_DAY = "https://app.paperbell.com/checkout/packages/234456"
const PAPERBELL_WEEK = "https://app.paperbell.com/checkout/packages/234458"

export function MondayOffer() {
  return (
    <section id="offer" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Depth of Entry
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Choose how deeply you want to enter.
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Come for the Day. Stay for the Week. Stay longer to install it. Each includes your Harmony Lane™
            On-Ramp before you begin.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Come for the Day */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-3xl border border-[#7FB069]/25 bg-white p-8 shadow-lg"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">Come for the Day</p>
            <h3 className="font-playfair mt-2 text-xl font-bold leading-snug text-[#4A3A42]">
              Work-Life Balance Business Day™
            </h3>
            <p className="font-poppins mt-1 text-sm text-[#8A7A82]">Experience Harmony Lane in real time.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-playfair text-5xl font-bold text-[#C13B6B]">$297</span>
            </div>
            <a
              href={PAPERBELL_DAY}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#7FB069] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#6a9857]"
            >
              Experience the Day
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>

          {/* Stay for the Week */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative flex flex-col rounded-3xl border border-[#C13B6B]/40 bg-white p-8 shadow-xl ring-1 ring-[#C13B6B]/15"
          >
            <span className="font-poppins absolute -top-3 left-8 rounded-full bg-[#C13B6B] px-3 py-1 text-xs font-semibold text-white">
              Live the rhythm
            </span>
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              Stay for the Week
            </p>
            <h3 className="font-playfair mt-2 text-xl font-bold leading-snug text-[#4A3A42]">
              Work-Life Balance Business Week™
            </h3>
            <p className="font-poppins mt-1 text-sm text-[#8A7A82]">Live the rhythm Monday&ndash;Thursday.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-playfair text-5xl font-bold text-[#C13B6B]">$497</span>
            </div>
            <a
              href={PAPERBELL_WEEK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#C13B6B] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#a52f59]"
            >
              Live the Week
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>

          {/* Stay Longer — Installation (no public price) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="flex flex-col rounded-3xl border border-[#4A3A42]/15 bg-[#4A3A42] p-8 shadow-lg"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E8A0AC]">Stay Longer</p>
            <h3 className="font-playfair mt-2 text-xl font-bold leading-snug text-white">
              Work-Life Balance Business Model™ Installation
            </h3>
            <p className="font-poppins mt-1 text-sm text-white/70">30 / 60 / 90 days.</p>
            <p className="font-poppins mt-5 text-pretty text-sm leading-relaxed text-white/80">
              Move from experiencing Work-Life Balance™ to installing the operating model into the business.
            </p>
            <Link
              href="/pricing"
              className="font-poppins mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Installation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
