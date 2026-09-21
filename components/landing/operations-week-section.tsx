"use client"

/**
 * The Work-Life Balance Business Operations Week™ — the core of the page and
 * the primary commercial object. A 7-day real-business operating experience:
 * find the boundary → operate by it → experience it → practice it → step away →
 * observe → redesign. The Work-Life Balance Business Day™ lives INSIDE the week
 * as the signature live experience (Tue–Thu), never as a separate paid offer.
 */
import { motion } from "framer-motion"

const DAY_CONTAINERS = [
  { name: "Align", note: "Create space before the business begins." },
  { name: "Move", note: "Protect movement." },
  { name: "Nourish", note: "Protect the space to eat, pause, and reset." },
  { name: "Focus", note: "Protect the 4-Hour Focused CEO Workday\u2122." },
  { name: "Live", note: "Protect Time Freedom\u2122." },
  { name: "Power Down", note: "Release the workday." },
  { name: "Unplug", note: "End digital availability." },
]

const NEXT_MONDAY = [
  "What held?",
  "What didn\u2019t?",
  "What depended on you?",
  "What changed?",
  "What did your people experience?",
  "What did your clients experience?",
  "What did your life experience?",
]

function DayMarker({ label }: { label: string }) {
  return (
    <span className="font-poppins inline-flex items-center rounded-full bg-[#4A3A42] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
      {label}
    </span>
  )
}

export function OperationsWeekSection() {
  return (
    <section id="week" className="w-full bg-[#FDF6F3] py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            Then The Week Begins
          </p>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            The Work-Life Balance Business Operations Week&trade;
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            A 7-day real-business operating experience. You identify the boundaries, determine what the business
            must change, communicate them, practice them, step away, observe what holds, and return with evidence
            &mdash; then redesign.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mt-16 space-y-6">
          {/* Monday — Operate */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10"
          >
            <DayMarker label="Monday — Operate" />
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-playfair text-xl font-bold text-[#4A3A42]">Reality Check&trade;</h3>
                <ul className="mt-4 space-y-2 font-poppins text-sm leading-relaxed text-[#5A4A52]">
                  {[
                    "What actually happened last week?",
                    "What held? What broke?",
                    "Where did the business still depend on you?",
                    "Where did work cross into life?",
                    "What did the business reveal?",
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-playfair text-xl font-bold text-[#4A3A42]">Decide &amp; Redesign&trade;</h3>
                <ul className="mt-4 space-y-2 font-poppins text-sm leading-relaxed text-[#5A4A52]">
                  {[
                    "Choose your 3 Life Boundaries.",
                    "Choose your 3 Business Boundaries.",
                    "Identify stakeholder impact.",
                    "Determine what must change.",
                    "Turn the boundaries into operating standards.",
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Monday — CEO Workday / Communicate My Boundary */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10"
          >
            <DayMarker label="Monday — CEO Workday" />
            <h3 className="font-playfair mt-6 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
              The business has to hear the boundary.
            </h3>
            <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
              A boundary you decide only becomes real when the people and systems around you understand it. Inside
              the 4-Hour Focused CEO Workday&trade;, <span className="font-semibold text-[#4A3A42]">Communicate My
              Boundary&trade;</span> makes clear what is changing, why it matters, who owns what, the new
              expectation, what requires escalation, and what no longer comes to the founder.
            </p>
            <p className="font-playfair mt-6 text-balance text-lg font-bold italic leading-snug text-[#C13B6B] sm:text-xl">
              The boundary moves from intention to operation.
            </p>
          </motion.div>

          {/* Tuesday–Thursday — Experience + Practice + Business Day */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[2rem] border border-[#C13B6B]/25 bg-white shadow-lg"
          >
            <div className="relative h-56 w-full sm:h-72">
              <img
                src="/images/business-day-hero-bg.png"
                alt="A founder experiencing the Work-Life Balance Business Day in real time"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
              <div className="absolute bottom-5 left-6 right-6">
                <DayMarker label="Tuesday–Thursday — Experience + Practice" />
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <p className="font-poppins text-pretty text-base leading-relaxed text-[#6B5860]">
                Now the boundary enters the real business. You practice it. You delegate. You communicate. You
                observe. You notice resistance. You discover dependency. You adjust.
              </p>

              <div className="mt-8 rounded-[1.5rem] bg-[#FDF6F3] p-6 sm:p-8">
                <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
                  The Signature Live Experience
                </p>
                <h3 className="font-playfair mt-3 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
                  The Work-Life Balance Business Day&trade;
                </h3>
                <p className="font-poppins mt-3 text-pretty text-base leading-relaxed text-[#6B5860]">
                  A virtual destination experienced in real time. Not a schedule you are told to follow &mdash; a
                  business day you design, enter, experience, and practice.
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {DAY_CONTAINERS.map((c) => (
                    <li key={c.name} className="flex items-start gap-3 rounded-2xl border border-[#4A3A42]/8 bg-white p-4">
                      <span className="font-poppins mt-0.5 text-xs font-bold uppercase tracking-[0.14em] text-[#5A7F46]">
                        {c.name}
                      </span>
                      <span className="font-poppins text-sm leading-snug text-[#5A4A52]">{c.note}</span>
                    </li>
                  ))}
                </ul>

                <p className="font-playfair mt-8 text-balance text-center text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
                  The destination is virtual.
                  <span className="mt-1 block text-[#C13B6B]">The experience is real.</span>
                </p>
              </div>

              {/* The 4-hour container reveal */}
              <div className="mt-8">
                <h3 className="font-playfair text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
                  The four-hour container reveals what needs to change.
                </h3>
                <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
                  The 4-Hour Focused CEO Workday&trade; (1 PM&ndash;5 PM) is not the destination. It is the
                  constraint that reveals what only you can do, what should be delegated, what should be
                  systematized, what should disappear, what decisions still depend on you, what technology can
                  remove, and what AI can accelerate &mdash; what the business has been asking the founder to carry
                  unnecessarily.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Thursday–Sunday — Time Freedom + Proof */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#7FB069]/25 bg-[#F1F6EC] p-8 sm:p-10"
          >
            <DayMarker label="Thursday 5 PM → Sunday 10 PM — Extended Time Freedom™" />
            <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-[#5A7F46]">
              Now the boundary leaves the workday. You step away. You live. You reconnect. You rest. You experience
              your life &mdash; and you observe whether the business can honor the boundary without continuous
              founder enforcement.
            </p>
            <p className="font-playfair mt-6 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
              This is the proof.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="font-poppins rounded-full border border-[#7FB069]/30 bg-white px-4 py-2 text-sm font-semibold text-[#5A7F46]">
                Sunday 10 PM → 11 PM · Power Down&trade;
              </span>
              <span className="font-poppins rounded-full border border-[#7FB069]/30 bg-white px-4 py-2 text-sm font-semibold text-[#5A7F46]">
                11 PM · Unplug&trade;
              </span>
            </div>
          </motion.div>

          {/* Next Monday — Redesign */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10"
          >
            <DayMarker label="Monday — Comes Back Around" />
            <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-[#6B5860]">
              This is the learning loop. You return with evidence and ask:
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {NEXT_MONDAY.map((q) => (
                <li
                  key={q}
                  className="font-poppins rounded-lg bg-[#FDF6F3] px-3 py-1.5 text-sm font-medium text-[#5A4A52]"
                >
                  {q}
                </li>
              ))}
            </ul>
            <p className="font-playfair mt-8 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
              Then redesign &mdash; the next boundary, the next operating standard, the next step toward
              installation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
