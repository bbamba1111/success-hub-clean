"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { getPlanByLevel } from "@/lib/payments/config"
import { getUpgradeCredit, formatCredit } from "@/lib/payments/upgrade-credits"

/**
 * The Offer — the Work-Life Balance Business Day™ (Monday) is the single
 * primary paid experience ($1,997). It is the public entry point into
 * Harmony Lane™: the complete Business Day rhythm, lived once and guided in
 * real time by Thought Leader Barbara. The Operations Week™ and the 30/60/90
 * Installation are the deeper tiers and route to the internal /pricing page
 * (no public checkout).
 *
 * Price and checkout URL are read from the single product ladder in
 * `lib/payments/config.ts` (the Business Day level) so this page never
 * hardcodes pricing or Paperbell links.
 */

const MONDAY_INCLUDED = [
  "Weekly Work-Life Balance Reality Check™",
  "Your Reality Check Report™",
  "Guided Tour of the Business Day",
  "Decide & Redesign™ — choose your 3 Life + 3 Business Boundaries",
  "Communicate My Boundary™",
  "4-Hour Focused CEO Workday™",
  "Morning GIV•EN™, Movement Window™ & Extended Lunch™",
  "The Work-Life Balance Business Day™ (the signature live experience)",
]

const WEEK_AT_A_GLANCE = [
  {
    day: "Monday — Set",
    lines: ["Set the operating boundaries.", "Choose 3 Life Boundaries.", "Determine what the business must change."],
  },
  {
    day: "Tuesday–Thursday — Live + Work",
    lines: ["Live the complete Business Day rhythm.", "Bring actual work.", "Contain the work inside 1–5 PM.", "Protect the rest."],
  },
  {
    day: "Thursday 5 PM–Sunday 10 PM — Freedom + Proof",
    lines: ["Live Extended Time Freedom™.", "Live the 3-Day Weekend™.", "Observe what holds."],
  },
  {
    day: "Next Monday — Reality Check",
    lines: ["Return with evidence.", "Redesign."],
  },
]

export function MondayOffer() {
  const day = getPlanByLevel("business-day")
  const dayToWeek = getUpgradeCredit("business-day", "business-week")
  return (
    <section id="offer" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The Offer
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Make Time For More On Mondays™
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Experience Work-Life Balance — in real time. Your complete entry into the Work-Life Balance Business
            Experience, guided in real time by Thought Leader Barbara.
          </p>
        </div>

        {/* Primary offer — the Monday Business Day */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] border border-[#C13B6B]/30 bg-white shadow-xl ring-1 ring-[#C13B6B]/10"
        >
          <div className="grid gap-0 md:grid-cols-5">
            <div className="border-b border-[#C13B6B]/12 p-8 md:col-span-2 md:border-b-0 md:border-r sm:p-10">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
                1 Day · Live It
              </p>
              <h3 className="font-playfair mt-3 text-2xl font-bold leading-snug text-[#4A3A42]">
                Work-Life Balance Business Day™
              </h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-playfair text-5xl font-bold text-[#C13B6B]">{day?.priceLabel ?? "$1,997"}</span>
              </div>
              <p className="font-poppins mt-3 text-sm leading-relaxed text-[#8A7A82]">
                The complete Business Day rhythm, lived once and guided in real time. Includes your Harmony Lane™
                On-Ramp.
              </p>
              <a
                href={day?.checkoutUrl || "#offer"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C13B6B] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#a52f59]"
              >
                Join Monday
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="p-8 md:col-span-3 sm:p-10">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                What&apos;s included
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {MONDAY_INCLUDED.map((item) => (
                  <li key={item} className="font-poppins flex items-start gap-2 text-sm leading-snug text-[#5A4A52]">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-[#7FB069]/25 bg-[#7FB069]/8 p-4">
                <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                  Why start here
                </p>
                <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#5A7F46]">
                  Monday is the smallest complete unit of the model. Live it once, feel the difference, and you&apos;ll
                  know exactly what it means to go deeper into the full week.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Deeper tier — go further */}
        <div className="mx-auto mt-6 grid max-w-3xl gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-[2rem] border border-[#C13B6B]/20 bg-white p-8 shadow-lg sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              7 Days · Go Further
            </p>
            <h3 className="font-playfair mt-2 text-2xl font-bold leading-snug text-[#4A3A42]">
              Operations Week™
            </h3>
            <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#6B5860]">
              4 days of guided Work-Life Balance + 3 days of Time Freedom™ — the full 7-Day Virtual Real-Business
              Operating Intensive that turns boundaries into Human Sustainability™ Operating Standards.
            </p>
            <ul className="mt-5 space-y-3">
              {WEEK_AT_A_GLANCE.map((b) => (
                <li key={b.day} className="rounded-xl border border-[#4A3A42]/8 bg-[#FDF6F3] p-3">
                  <p className="font-poppins text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#C13B6B]">
                    {b.day}
                  </p>
                  <p className="font-poppins mt-1 text-xs leading-snug text-[#5A4A52]">{b.lines.join(" ")}</p>
                </li>
              ))}
            </ul>
            {dayToWeek && (
              <p className="font-poppins mt-5 rounded-xl border border-[#7FB069]/25 bg-[#7FB069]/8 p-3 text-xs leading-relaxed text-[#5A7F46]">
                <span className="font-semibold">Your investment follows you.</span> Your{" "}
                {formatCredit(dayToWeek.creditAmount)} Business Day™ investment counts toward the Week — you add just{" "}
                {formatCredit(dayToWeek.additionalAmount)}.
              </p>
            )}
            <Link
              href="/pricing"
              className="font-poppins mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#C13B6B]/40 px-6 py-3 text-sm font-semibold text-[#C13B6B] transition-colors hover:bg-[#C13B6B]/8"
            >
              Explore the Week
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col rounded-[2rem] border border-[#4A3A42]/15 bg-[#4A3A42] p-8 shadow-lg sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E8A0AC]">
              Repeat it. Install it.
            </p>
            <h3 className="font-playfair mt-2 text-2xl font-bold leading-snug text-white">
              30 / 60 / 90 Installation
            </h3>
            <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-white/80">
              Move from experiencing Work-Life Balance™ to installing the operating model into how the business
              actually runs — the deepest tier.
            </p>
            <Link
              href="/pricing"
              className="font-poppins mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Installation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        <p className="font-poppins mx-auto mt-8 max-w-2xl text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#8A7A82]">
          Find the boundary → Operate by it → Install it
        </p>
      </div>
    </section>
  )
}
