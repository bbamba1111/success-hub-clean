"use client"

/**
 * The Work-Life Balance Boundary Audit™ — the diagnostic entry point (not a
 * generic 15-question balance quiz). Two editorial columns: 3 Life Boundaries
 * and 3 Business Boundaries, the stakeholder lens, and the secondary CTA into
 * the real audit at /audit.
 */
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const LIFE = [
  "Family",
  "Partner",
  "Health",
  "Recovery",
  "Friends",
  "Community",
  "Creativity",
  "Personal Development",
  "Spiritual / Reflection",
  "Personal Time",
  "Life Experiences",
  "Evenings",
  "Weekends",
]

const BUSINESS = [
  "Founder Availability",
  "Decision Ownership",
  "Delegation",
  "Client Access",
  "Response Times",
  "Meetings",
  "Team Communication",
  "Workload",
  "Capacity",
  "After-Hours Work",
  "Digital Notifications",
  "AI Usage",
  "Escalation",
  "Founder Dependency",
]

const STAKEHOLDERS = ["Founder", "Team", "Family", "Clients / Partners", "Business"]

export function BoundaryAuditSection() {
  return (
    <section id="boundary-audit" className="w-full bg-[#F1F6EC] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            The Diagnostic Entry Point
          </p>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            First, find the boundaries.
          </h2>
          <p className="font-great-vibes mt-2 text-3xl text-[#C13B6B]">The Work-Life Balance Boundary Audit&trade;</p>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#6B5860]">
            The Boundary Audit&trade; helps founders identify where the business is crossing boundaries that matter
            &mdash; and what needs to change so those boundaries can actually hold. You don&apos;t have to invent the
            answer from scratch. We give you examples. You recognize what matters. You choose what matters now.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#7FB069]/25 bg-white p-8 sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              3 Life Boundaries
            </p>
            <h3 className="font-playfair mt-3 text-pretty text-xl font-bold leading-snug text-[#4A3A42]">
              What does your life need protected, preserved, or made possible?
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {LIFE.map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-lg bg-[#F1F6EC] px-3 py-1.5 text-sm font-medium text-[#5A7F46]"
                >
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
            className="rounded-[2rem] border border-[#C13B6B]/25 bg-white p-8 sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              3 Business Boundaries
            </p>
            <h3 className="font-playfair mt-3 text-pretty text-xl font-bold leading-snug text-[#4A3A42]">
              What must change in the business so those life boundaries can hold?
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {BUSINESS.map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-lg bg-[#FBEBF0] px-3 py-1.5 text-sm font-medium text-[#C13B6B]"
                >
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
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10"
        >
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
            Stakeholder Impact
          </p>
          <p className="font-poppins mt-3 text-pretty text-base leading-relaxed text-[#6B5860]">
            Every meaningful boundary may affect more than the founder:
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {STAKEHOLDERS.map((s) => (
              <li
                key={s}
                className="font-poppins rounded-full border border-[#4A3A42]/12 px-4 py-2 text-sm font-semibold text-[#4A3A42]"
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-[#6B5860]">
            The point is not to redesign the entire business at once. The point is to identify the boundaries that
            matter <span className="font-semibold text-[#4A3A42]">now</span> &mdash; and turn them into your Human
            Sustainability&trade; Operating Standards.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="mt-6 rounded-[2rem] border border-[#7FB069]/30 bg-[#7FB069]/8 p-8 sm:p-10"
        >
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">Choose Three</p>
          <h3 className="font-playfair mt-3 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
            Your 3 Life Boundaries
          </h3>
          <p className="font-playfair mt-2 text-pretty text-lg font-semibold italic text-[#5A7F46]">
            What does your Time Freedom&trade; need to make possible?
          </p>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            From the larger Boundary Library, you choose <span className="font-semibold text-[#4A3A42]">three</span>
            &nbsp;Life Boundaries — the three things you most want your protected Time Freedom&trade; to make
            possible. No one prescribes the same three to everyone. These are not three separate projects, and not
            three activities assigned to three hours. They define what the protected time is <em>for</em>. You
            decide how life inhabits that space.
          </p>
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/audit"
            className="font-poppins inline-flex items-center justify-center gap-2 rounded-full border border-[#5A7F46]/40 bg-white px-8 py-3.5 text-base font-semibold text-[#5A7F46] shadow-sm transition-colors hover:bg-[#5A7F46] hover:text-white"
          >
            Take the Work-Life Balance Boundary Audit&trade;
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
