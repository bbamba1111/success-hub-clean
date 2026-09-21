"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

/**
 * The Offer — the Work-Life Balance Business Operations Week™ is the single
 * primary paid experience ($3,997, Paperbell 234458). The Work-Life Balance
 * Business Day™ is NOT sold separately; it lives inside the week as the
 * signature live experience. Installation (30/60/90) is the deeper tier and
 * routes to the internal /pricing page (no public price).
 *
 * Paperbell package IDs/links are spec-locked — never change or replace the
 * checkout URLs. Displayed pricing is copy set by the site owner.
 */

const PAPERBELL_WEEK = "https://app.paperbell.com/checkout/packages/234458"

const GUIDED = [
  "Weekly Work-Life Balance Reality Check™",
  "Decide & Redesign™ — choose your 3 Life + 3 Business Boundaries",
  "Communicate My Boundary™",
  "4-Hour Focused CEO Workday™",
  "Morning GIV•EN™ & Workday Design™",
  "Movement Window™ & Extended Healthy Hybrid Lunch™",
  "The Work-Life Balance Business Day™ (the signature live experience)",
  "Power Down & Unplug™",
]

export function MondayOffer() {
  return (
    <section id="offer" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The Experience
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Enter the Operations Week™
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            One primary experience: a 7-Day Virtual Real-Business Operating Intensive where you find the boundaries,
            operate by them, and turn them into Human Sustainability™ Operating Standards — guided in real time by
            Thought Leader Barbara.
          </p>
        </div>

        {/* The week at a glance */}
        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2"
        >
          {[
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
          ].map((b) => (
            <li key={b.day} className="rounded-2xl border border-[#4A3A42]/10 bg-white p-5">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.14em] text-[#C13B6B]">{b.day}</p>
              <ul className="mt-3 space-y-1.5">
                {b.lines.map((l) => (
                  <li key={l} className="font-poppins flex items-start gap-2 text-sm leading-snug text-[#5A4A52]">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                    {l}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </motion.ul>

        {/* Primary offer — the Operations Week */}
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
                7 Days · Live It
              </p>
              <h3 className="font-playfair mt-3 text-2xl font-bold leading-snug text-[#4A3A42]">
                Work-Life Balance Business Operations Week™
              </h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-playfair text-5xl font-bold text-[#C13B6B]">$3,997</span>
              </div>
              <p className="font-poppins mt-3 text-sm leading-relaxed text-[#8A7A82]">
                4 days of guided Work-Life Balance + 3 days of Time Freedom™. Includes your Harmony Lane™ On-Ramp.
              </p>
              <a
                href={PAPERBELL_WEEK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C13B6B] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#a52f59]"
              >
                Experience the Operations Week
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="p-8 md:col-span-3 sm:p-10">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                What&apos;s included
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {GUIDED.map((item) => (
                  <li key={item} className="font-poppins flex items-start gap-2 text-sm leading-snug text-[#5A4A52]">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-[#7FB069]/25 bg-[#7FB069]/8 p-4">
                <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                  + 3 days of Time Freedom™
                </p>
                <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#5A7F46]">
                  An intentional part of the experience — not simply days off. You&apos;ll practice being unavailable
                  without guilt, stepping away, rest, relationships, and simply being.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Deeper tier — Installation (no public price) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mx-auto mt-6 flex max-w-3xl flex-col items-start gap-6 rounded-[2rem] border border-[#4A3A42]/15 bg-[#4A3A42] p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div className="max-w-xl">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E8A0AC]">
              Repeat it. Install it.
            </p>
            <h3 className="font-playfair mt-2 text-2xl font-bold leading-snug text-white">
              30 / 60 / 90 Installation
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
          Find the boundary → Operate by it → Install it
        </p>
      </div>
    </section>
  )
}
