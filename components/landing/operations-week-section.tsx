"use client"

/**
 * The Work-Life Balance Business Operations Week™ — the core of the page and
 * the primary commercial object. A 7-Day Virtual Real-Business Operating
 * Intensive: the founder brings their ACTUAL business into the week, sets the
 * boundary architecture on Monday, lives the complete Work-Life Balance
 * Business Day™ rhythm Tue–Thu while doing real work, contains that work inside
 * the 4-Hour Focused CEO Workday™, steps away Thu 5 PM → Sun 10 PM to live the
 * 3-Day Weekend™ as proof, and returns to a Reality Check™ that drives redesign.
 *
 * Mechanics that must stay explicit:
 *   Bring actual work → put it inside 1–5 PM → protect the rest of the day →
 *   use Time Freedom™ for the 3 chosen Life Boundaries → step away Fri–Sun →
 *   see whether the business holds.
 */
import { motion } from "framer-motion"

/** The complete Work-Life Balance Business Day™ rhythm the founder lives each day. */
const RHYTHM = [
  "Flex Time\u2122",
  "Morning GIV\u2022EN\u2122",
  "Movement Window\u2122",
  "Extended Healthy Hybrid Lunch\u2122",
  "4-Hour Focused CEO Workday\u2122",
  "Time Freedom\u2122",
  "Power Down\u2122",
  "Unplug\u2122",
]

/** The protected day, with the work contained and everything else preserved. */
const DAY_BLOCKS = [
  { time: "Morning", name: "Morning GIV\u2022EN\u2122", note: "Protected space before business demands." },
  { time: "Midday", name: "Movement Window\u2122", note: "Protected movement." },
  { time: "Midday", name: "Extended Healthy Hybrid Lunch\u2122", note: "Protected nourishment and space." },
  { time: "1 PM\u20135 PM", name: "4-Hour Focused CEO Workday\u2122", note: "The work container.", work: true },
  { time: "5 PM\u201310 PM", name: "Time Freedom\u2122", note: "Protected life.", life: true },
  { time: "10 PM\u201311 PM", name: "Power Down\u2122", note: "Protected transition." },
  { time: "11 PM", name: "Unplug\u2122", note: "Protected digital recovery." },
]

const CONTAIN_QUESTIONS = [
  "What can be delegated?",
  "What can be eliminated?",
  "What can be systematized?",
  "What can technology remove?",
  "What can AI accelerate?",
  "What decisions should move elsewhere?",
  "What is consuming founder capacity unnecessarily?",
]

const LIFE_BOUNDARY_EXAMPLES = [
  "Family",
  "Partner",
  "Health",
  "Recovery",
  "Creativity",
  "Friends",
  "Community",
  "Personal Development",
  "Recreation",
  "Personal Time",
  "Life Experiences",
]

const TIME_FREEDOM_USES = [
  "Family",
  "Partner",
  "Children",
  "Friends",
  "Health",
  "Recovery",
  "Creativity",
  "Community",
  "Recreation",
  "Personal Development",
  "Personal Time",
  "Life Experiences",
  "\u2026or simply being",
]

const TUE_THU_OBSERVE = [
  "Can the actual work fit?",
  "What breaks the boundary?",
  "What requires redesign?",
  "What still depends on the founder?",
]

const WEEKEND_OBSERVE = [
  "Does the business continue without continuous founder availability?",
  "Do decisions still come back to me?",
  "Does the team know what to do?",
  "Do clients still expect access?",
  "Does the founder continue checking?",
  "Does technology pull the founder back?",
  "Does AI create more work?",
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

const LOOP = ["Set", "Live", "Step Away", "Observe", "Reality Check", "Redesign"]

const EXPERIENCE_STATEMENT = [
  "Bring your real business.",
  "Live the rhythm.",
  "Work the boundaries.",
  "Contain the work.",
  "Step away.",
  "See what holds.",
]

function DayMarker({ label }: { label: string }) {
  return (
    <span className="font-poppins inline-flex items-center rounded-full bg-[#4A3A42] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
      {label}
    </span>
  )
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
}

export function OperationsWeekSection() {
  return (
    <section id="week" className="w-full bg-[#FDF6F3] py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Intro */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            The Core Experience
          </p>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            The Work-Life Balance Business Operations Week&trade;
          </h2>
          <p className="font-playfair mt-4 text-balance text-xl font-bold italic leading-snug text-[#C13B6B] sm:text-2xl">
            A 7-Day Virtual Real-Business Operating Intensive.
          </p>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            You bring your actual business into the Week. You experience the complete Work-Life Balance Business
            Day&trade;. You set the boundaries. You choose the 3 Life Boundaries your Time Freedom&trade; needs to
            protect. You bring your real work into the 4-Hour Focused CEO Workday&trade;. You work your business
            inside the boundaries. You step away. You observe what holds. You return with evidence.
          </p>
        </motion.div>

        {/* Bring your real business */}
        <motion.div
          {...reveal}
          className="mt-16 overflow-hidden rounded-[2rem] border border-[#C13B6B]/25 bg-white shadow-lg"
        >
          <div className="grid gap-0 md:grid-cols-5">
            <div className="bg-[#4A3A42] p-8 md:col-span-2 sm:p-10">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E8A0AC]">
                This Is Not A Week Away
              </p>
              <h3 className="font-playfair mt-3 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
                Bring your real business.
              </h3>
              <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-white/80">
                Bring your actual work into the Week — then work it inside the Work-Life Balance Business Day&trade;
                rhythm.
              </p>
            </div>
            <div className="p-8 md:col-span-3 sm:p-10">
              <p className="font-poppins text-sm font-semibold text-[#6B5860]">You bring:</p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Your real priorities.",
                  "Your real decisions.",
                  "Your real workload.",
                  "Your real client demands.",
                  "Your real team issues.",
                  "Your real operational challenges.",
                ].map((item) => (
                  <li key={item} className="font-poppins flex items-start gap-2.5 text-sm leading-snug text-[#5A4A52]">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Experience statement banner */}
        <motion.ul
          {...reveal}
          className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 rounded-[2rem] border border-[#4A3A42]/10 bg-white px-6 py-8 text-center sm:px-10"
        >
          {EXPERIENCE_STATEMENT.map((line) => (
            <li
              key={line}
              className="font-playfair text-lg font-bold leading-snug text-[#4A3A42] sm:text-2xl"
            >
              {line}
            </li>
          ))}
        </motion.ul>

        {/* Timeline */}
        <div className="mt-16 space-y-6">
          {/* Monday — SET */}
          <motion.div {...reveal} className="rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10">
            <DayMarker label="Monday — Set" />
            <h3 className="font-playfair mt-6 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
              Establish the operating boundary architecture for the week.
            </h3>

            {/* Walk the complete Business Day */}
            <div className="mt-8 rounded-[1.5rem] bg-[#FDF6F3] p-6 sm:p-8">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                First, see the complete Work-Life Balance Business Day&trade;
              </p>
              <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
                {RHYTHM.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="font-poppins rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4A3A42]">
                      {step}
                    </span>
                    {i < RHYTHM.length - 1 && (
                      <span className="text-[#C13B6B]" aria-hidden>
                        &rarr;
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <h4 className="font-playfair text-xl font-bold text-[#4A3A42]">Reality Check&trade;</h4>
                <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">
                  Review the actual business — what it truly requires, where it depends on you, and where work
                  crosses into life.
                </p>
              </div>
              <div>
                <h4 className="font-playfair text-xl font-bold text-[#4A3A42]">Decide &amp; Redesign&trade;</h4>
                <ul className="mt-3 space-y-2 font-poppins text-sm leading-relaxed text-[#5A4A52]">
                  {[
                    "Choose your 3 Life Boundaries.",
                    "Identify what Time Freedom\u2122 needs to make possible.",
                    "Identify what the business must change to support those boundaries.",
                    "Begin defining your Human Sustainability\u2122 Operating Standards.",
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

          {/* Your 3 Life Boundaries */}
          <motion.div
            {...reveal}
            className="rounded-[2rem] border border-[#7FB069]/25 bg-[#F1F6EC] p-8 sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              Choose Three
            </p>
            <h3 className="font-playfair mt-3 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
              Your 3 Life Boundaries
            </h3>
            <p className="font-playfair mt-2 text-pretty text-lg font-semibold italic text-[#5A7F46]">
              What does your Time Freedom&trade; need to make possible?
            </p>
            <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
              Your three Life Boundaries are the three things you most want your protected Time Freedom&trade; to
              make possible. You choose them from the larger Boundary Audit&trade; — no one prescribes the same
              three to everyone.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {LIFE_BOUNDARY_EXAMPLES.map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-[#5A7F46]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-[#7FB069]/30 bg-white p-5">
              <p className="font-poppins text-sm leading-relaxed text-[#5A4A52]">
                These are <span className="font-semibold text-[#4A3A42]">not</span> three separate projects. They
                are <span className="font-semibold text-[#4A3A42]">not</span> three activities assigned to three
                hours. They define what the protected Time Freedom&trade; is for.
                <span className="font-semibold text-[#4A3A42]"> You decide how life inhabits that space.</span>
              </p>
            </div>
          </motion.div>

          {/* Contain the work / 4-hour CEO Workday */}
          <motion.div
            {...reveal}
            className="overflow-hidden rounded-[2rem] border border-[#C13B6B]/25 bg-white shadow-lg"
          >
            <div className="bg-[#C13B6B] p-8 text-center sm:p-10">
              <h3 className="font-playfair text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
                Contain the work.
                <span className="block">Protect the rest.</span>
              </h3>
            </div>
            <div className="p-8 sm:p-10">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#C13B6B]">
                Bring your actual work into our 4-Hour Focused CEO Workday&trade;
              </p>
              <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
                The work container is <span className="font-semibold text-[#4A3A42]">1 PM&ndash;5 PM</span>. The
                founder brings actual business work into it. The goal is not to pretend the business only requires
                four hours of work — it is to contain the founder&apos;s focused CEO work inside a defined operating
                boundary. Then ask:
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {CONTAIN_QUESTIONS.map((q) => (
                  <li key={q} className="font-poppins flex items-start gap-2.5 text-sm leading-snug text-[#5A4A52]">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                    {q}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[1.5rem] border border-[#C13B6B]/20 bg-[#FBEBF0] p-6 text-center sm:p-8">
                <p className="font-playfair text-balance text-xl font-bold leading-snug text-[#C13B6B] sm:text-2xl">
                  If the work doesn&apos;t fit, the boundary does not expand.
                </p>
                <p className="font-playfair mt-2 text-balance text-lg font-bold leading-snug text-[#4A3A42] sm:text-xl">
                  The business design has to change.
                </p>
              </div>

              {/* Communicate My Boundary — inside the CEO Workday */}
              <div className="mt-8 rounded-[1.5rem] bg-[#FDF6F3] p-6 sm:p-8">
                <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#5A7F46]">
                  Inside the CEO Workday · Communicate My Boundary&trade;
                </p>
                <p className="font-poppins mt-3 text-pretty text-base leading-relaxed text-[#6B5860]">
                  A boundary you decide only becomes real when the people and systems around you understand it.
                  Inside the 4-Hour Focused CEO Workday&trade;, the founder communicates what is changing, why it
                  matters, who owns what, the new expectation, what requires escalation, and what no longer comes to
                  the founder.
                </p>
                <p className="font-playfair mt-4 text-balance text-lg font-bold italic leading-snug text-[#C13B6B] sm:text-xl">
                  The boundary moves from intention to operation.
                </p>
              </div>

              <p className="font-playfair mt-8 text-center text-balance text-2xl font-bold leading-snug text-[#5A7F46] sm:text-3xl">
                Let Life Have Space To Expand&trade;
              </p>
            </div>
          </motion.div>

          {/* The protected day map */}
          <motion.div {...reveal} className="rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              The Work Is Contained · The Rest Is Protected
            </p>
            <h3 className="font-playfair mt-3 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
              Contain the work &rarr; protect the rest.
            </h3>
            <ul className="mt-8 space-y-3">
              {DAY_BLOCKS.map((b) => (
                <li
                  key={b.name}
                  className={`flex flex-col gap-1 rounded-2xl border p-4 sm:flex-row sm:items-center sm:gap-4 ${
                    b.work
                      ? "border-[#C13B6B]/30 bg-[#FBEBF0]"
                      : b.life
                        ? "border-[#7FB069]/30 bg-[#F1F6EC]"
                        : "border-[#4A3A42]/8 bg-[#FDF6F3]"
                  }`}
                >
                  <span className="font-poppins w-28 flex-none text-xs font-bold uppercase tracking-[0.12em] text-[#8A7A82]">
                    {b.time}
                  </span>
                  <span
                    className={`font-poppins flex-none text-sm font-bold ${
                      b.work ? "text-[#C13B6B]" : b.life ? "text-[#5A7F46]" : "text-[#4A3A42]"
                    } sm:w-64`}
                  >
                    {b.name}
                  </span>
                  <span className="font-poppins text-sm leading-snug text-[#5A4A52]">{b.note}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tuesday–Thursday — Live the rhythm, work your business */}
          <motion.div
            {...reveal}
            className="overflow-hidden rounded-[2rem] border border-[#C13B6B]/25 bg-white shadow-lg"
          >
            <div className="relative h-56 w-full sm:h-72">
              <img
                src="/images/business-day-hero-bg.png"
                alt="A founder living the Work-Life Balance Business Day rhythm while doing real work"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
              <div className="absolute bottom-5 left-6 right-6">
                <DayMarker label="Tuesday–Thursday" />
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <h3 className="font-playfair text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
                Live the rhythm. Work your business.
              </h3>
              <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
                Every day the founder lives the complete Work-Life Balance Business Day&trade; rhythm, brings their
                actual business work into it, and works their real business inside the boundaries.
              </p>
              <ul className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2">
                {RHYTHM.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="font-poppins rounded-full bg-[#FDF6F3] px-3 py-1.5 text-xs font-semibold text-[#4A3A42]">
                      {step}
                    </span>
                    {i < RHYTHM.length - 1 && (
                      <span className="text-[#C13B6B]" aria-hidden>
                        &rarr;
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="font-poppins mt-8 text-sm font-semibold text-[#6B5860]">They observe:</p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {TUE_THU_OBSERVE.map((q) => (
                  <li key={q} className="font-poppins flex items-start gap-2.5 text-sm leading-snug text-[#5A4A52]">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Time Freedom — where the 3 Life Boundaries live */}
          <motion.div
            {...reveal}
            className="rounded-[2rem] border border-[#7FB069]/25 bg-[#F1F6EC] p-8 sm:p-10"
          >
            <DayMarker label="Every Day · 5 PM–10 PM" />
            <h3 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
              Time Freedom&trade;
            </h3>
            <p className="font-playfair mt-2 text-pretty text-lg font-semibold italic text-[#5A7F46]">
              This is where your 3 Life Boundaries live.
            </p>
            <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
              Time Freedom&trade; protects time that belongs to life. It is not divided into prescribed activities,
              and no single Life Boundary is assigned to a single hour.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TIME_FREEDOM_USES.map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-[#5A7F46]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-playfair mt-8 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
              The time belongs to life.
            </p>
            <p className="font-playfair mt-1 text-balance text-2xl font-bold leading-snug text-[#5A7F46] sm:text-3xl">
              Let Life Have Space To Expand&trade;
            </p>
          </motion.div>

          {/* Extended Time Freedom — 3-Day Weekend / proof */}
          <motion.div
            {...reveal}
            className="rounded-[2rem] border border-[#7FB069]/25 bg-white p-8 sm:p-10"
          >
            <DayMarker label="Thursday 5 PM → Sunday 10 PM" />
            <h3 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
              Extended Time Freedom&trade;
            </h3>
            <p className="font-playfair mt-2 text-pretty text-lg font-semibold italic text-[#5A7F46]">
              Live the 3-Day Weekend&trade;.
            </p>
            <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
              This is not additional coursework. This is not homework. The founder steps away from the business and
              lives the time they said they wanted the business to make possible — then observes:
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {WEEKEND_OBSERVE.map((q) => (
                <li key={q} className="font-poppins flex items-start gap-2.5 text-sm leading-snug text-[#5A4A52]">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                  {q}
                </li>
              ))}
            </ul>
            <p className="font-playfair mt-8 text-balance text-3xl font-bold leading-snug text-[#C13B6B] sm:text-4xl">
              This is the proof.
            </p>
          </motion.div>

          {/* Next Monday — comes back around */}
          <motion.div {...reveal} className="rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10">
            <DayMarker label="Next Monday · Reality Check™" />
            <h3 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
              Monday comes back around.
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {NEXT_MONDAY.map((q) => (
                <li
                  key={q}
                  className="font-poppins rounded-lg bg-[#FDF6F3] px-3 py-1.5 text-sm font-medium text-[#5A4A52]"
                >
                  {q}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Keep", "Adjust", "Strengthen", "Redesign"].map((a) => (
                <span
                  key={a}
                  className="font-poppins rounded-full border border-[#4A3A42]/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-[#4A3A42]"
                >
                  {a}
                </span>
              ))}
            </div>
          </motion.div>

          {/* The loop */}
          <motion.ul
            {...reveal}
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-[2rem] bg-[#4A3A42] px-6 py-8 sm:px-10"
          >
            {LOOP.map((node, i) => (
              <li key={node} className="flex items-center gap-2">
                <span className="font-poppins rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm">
                  {node}
                </span>
                {i < LOOP.length - 1 && (
                  <span className="text-[#E8A0AC]" aria-hidden>
                    &rarr;
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
