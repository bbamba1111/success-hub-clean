"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Depth of Entry — the Day / Week / Installation presented as how deeply you
 * enter Harmony Lane™, not as three unrelated products. The Week is explicitly
 * seven days: 4 days of guided Work-Life Balance + 3 days of Time Freedom™.
 *
 *   Day  — Make Time For More™ · Work-Life Balance Business Day™   (Paperbell 234456)
 *   Week — Work-Life Balance Business Week™ (7 days)               (Paperbell 234458)
 *   30/60/90 Installation — no public price (routes to internal /pricing)
 *
 * Paperbell package IDs/links are spec-locked — never change or replace the
 * checkout URLs. Displayed pricing is copy set by the site owner.
 */

const PAPERBELL_DAY = "https://app.paperbell.com/checkout/packages/234456"
const PAPERBELL_WEEK = "https://app.paperbell.com/checkout/packages/234458"

const WEEK_GUIDED = [
  "4-Hour Focused CEO Workdays™",
  "Morning GIV•EN™",
  "Workday Design™",
  "Weekly Reality Check™",
  "Decide & Redesign™",
  "Communicate My Boundary™",
  "Flex Time™",
  "Movement & Extended Healthy Hybrid Lunch™",
  "Time Freedom™ & Power Down & Unplug™",
  "Guided support from Thought Leader Barbara",
]

export function MondayOffer() {
  return (
    <section id="offer" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Choose Your Depth of Entry
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Experience it. Live it. Repeat it. Install it.
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Work-Life Balance™ isn&apos;t something you visit — it&apos;s something you build into how the business
            operates. Each entry includes your Harmony Lane™ On-Ramp before you begin.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
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
              Make Time For More™
            </h3>
            <p className="font-poppins mt-1 text-sm text-[#8A7A82]">Work-Life Balance Business Day™ — experience it.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-playfair text-5xl font-bold text-[#C13B6B]">$1,997</span>
            </div>
            <p className="font-poppins mt-4 text-pretty text-sm leading-relaxed text-[#6B5860]">
              A single, fully guided Work-Life Balance Business Day™ — designed around you and lived in real time.
            </p>
            <a
              href={PAPERBELL_DAY}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#7FB069] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#6a9857]"
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
              Live it — 7 days
            </span>
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              Stay for the Week
            </p>
            <h3 className="font-playfair mt-2 text-xl font-bold leading-snug text-[#4A3A42]">
              Work-Life Balance Business Week™
            </h3>
            <p className="font-poppins mt-1 text-sm text-[#8A7A82]">Seven days. Live it.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-playfair text-5xl font-bold text-[#C13B6B]">$3,997</span>
            </div>

            <p className="font-poppins mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
              4 days of guided Work-Life Balance
            </p>
            <ul className="mt-3 space-y-1.5">
              {WEEK_GUIDED.map((item) => (
                <li key={item} className="font-poppins flex items-start gap-2 text-sm leading-snug text-[#5A4A52]">
                  <span className="mt-1 h-1 w-1 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl border border-[#7FB069]/25 bg-[#7FB069]/8 p-4">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                + 3 days of Time Freedom™
              </p>
              <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#5A7F46]">
                An intentional part of the experience — not simply days off. Successful entrepreneurs often know
                how to work, yet struggle to inhabit unstructured time without turning it into another
                productivity project. You&apos;ll practice being unavailable without guilt, stepping away, rest,
                relationships, and simply being.
              </p>
              <p className="font-playfair mt-3 text-pretty text-sm font-bold italic leading-snug text-[#4A3A42]">
                Harmony Lane™ doesn&apos;t simply give you time off. We help you learn how to inhabit it.
              </p>
            </div>

            <a
              href={PAPERBELL_WEEK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#C13B6B] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#a52f59]"
            >
              Live the Week
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>
        </div>

        {/* Repeat it — Installation (no public price) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-6 flex flex-col items-start gap-6 rounded-3xl border border-[#4A3A42]/15 bg-[#4A3A42] p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div className="max-w-2xl">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E8A0AC]">
              Repeat it. Install it.
            </p>
            <h3 className="font-playfair mt-2 text-2xl font-bold leading-snug text-white">
              Work-Life Balance Business Model™ — 30 / 60 / 90 Installation
            </h3>
            <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-white/80">
              Move from experiencing Work-Life Balance™ to installing the operating model into how the business
              actually runs.
            </p>
          </div>
          <Link
            href="/pricing"
            className="font-poppins inline-flex flex-none items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Explore Installation
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>

        <p className="font-poppins mx-auto mt-8 max-w-2xl text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#8A7A82]">
          Experience it → Live it → Repeat it → Install it
        </p>
      </div>
    </section>
  )
}
