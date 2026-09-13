import { Check } from "lucide-react"

/**
 * MondayJourney — the "YOUR MONDAY" section on /landing.
 *
 * Makes the single most important message unmistakable: Monday is ONE complete
 * experience with TWO connected parts. Part One (Redesign Your Entry Into The
 * Workweek™) is the FIRST part of Monday — not the entire Monday experience.
 * Part Two is living Work-Life Balance™ in real time, beginning at 10:15 AM.
 */

const PART_ONE = [
  "Founder Profile™",
  "Business Context Profile™",
  "Work-Life Balance Time-Leak Check™",
  "Weekly Work-Life Balance Reality Check™",
  "Redesign Your Entry Into The Workweek™",
]

const TIMELINE = [
  { time: "7:00–9:00 AM", label: "Flex Time™", part: "one" as const },
  { time: "9:00–9:30 AM", label: "Weekly Work-Life Balance Reality Check™", part: "one" as const },
  { time: "9:30–10:00 AM", label: "Redesign Your Entry Into The Workweek™", part: "one" as const },
  { time: "10:00–10:15 AM", label: "Transition Space™", part: "bridge" as const },
  { time: "10:15 AM", label: "Live The Work-Life Balance Business Day/Week™ begins", part: "two" as const },
]

const LIVE_EXPERIENCE = [
  "Morning GIV•EN™",
  "30-Minute Workday Workout Window™",
  "Extended Healthy Hybrid Lunch™",
  "4-Hour Focused CEO Workday™",
  "Time Freedom™",
  "Power Down & Unplug™",
]

function partStyles(part: "one" | "bridge" | "two") {
  if (part === "one") return { dot: "bg-[#7FB069]", rail: "border-[#7FB069]/30" }
  if (part === "bridge") return { dot: "bg-[#E26C73]", rail: "border-[#E26C73]/40" }
  return { dot: "bg-[#C13B6B]", rail: "border-[#C13B6B]/30" }
}

export function MondayJourney() {
  return (
    <section id="your-monday" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Your Monday
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Your Monday Starts Here.
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Monday is one complete experience with two connected parts. First you redesign how you enter the
            week. Then, at 10:15 AM, you begin living it.
          </p>
        </div>

        {/* Two connected parts */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Part One */}
          <div className="flex flex-col rounded-3xl border border-[#7FB069]/25 bg-[#F6FAF2] p-8">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">Part One</p>
            <h3 className="font-playfair mt-2 text-2xl font-bold text-[#4A3A42]">
              Redesign Your Entry Into The Workweek™
            </h3>
            <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">
              You step out of your existing work pattern, see what&apos;s actually happening, and intentionally
              redesign how you want to work, live, and lead in the week ahead.
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {PART_ONE.map((item) => (
                <li key={item} className="font-poppins flex items-start gap-2.5 text-sm text-[#5A4A52]">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7FB069]/15 text-[#5A7F46]">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-poppins mt-6 rounded-xl bg-[#7FB069]/10 px-4 py-3 text-sm font-semibold leading-relaxed text-[#3F5E30]">
              Redesign is the first part of Monday. It is not the entire Monday experience.
            </p>
          </div>

          {/* Part Two */}
          <div className="flex flex-col rounded-3xl border border-[#C13B6B]/25 bg-[#FDF1F4] p-8">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#C13B6B]">Part Two</p>
            <h3 className="font-playfair mt-2 text-2xl font-bold text-[#4A3A42]">
              Live The Work-Life Balance Business Day/Week™ — In Real Time
            </h3>
            <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">
              This is where you stop preparing for Work-Life Balance and begin living it — the full rhythm of the
              day, experienced with us in real time.
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {LIVE_EXPERIENCE.map((item) => (
                <li key={item} className="font-poppins flex items-start gap-2.5 text-sm text-[#5A4A52]">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#C13B6B]/12 text-[#C13B6B]">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-poppins mt-6 rounded-xl bg-[#C13B6B]/8 px-4 py-3 text-sm font-semibold leading-relaxed text-[#8E2B4E]">
              The 10:00 Transition Space™ is the bridge between Part One and Part Two.
            </p>
          </div>
        </div>

        {/* Monday timeline */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="font-playfair text-center text-2xl font-bold text-[#4A3A42]">The Monday Rhythm</h3>
          <ol className="mt-8 space-y-0">
            {TIMELINE.map((step, i) => {
              const s = partStyles(step.part)
              const last = i === TIMELINE.length - 1
              return (
                <li key={step.label} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1.5 h-3 w-3 flex-none rounded-full ${s.dot}`} aria-hidden />
                    {!last && <span className={`w-px flex-1 border-l-2 ${s.rail}`} aria-hidden />}
                  </div>
                  <div className={`pb-8 ${last ? "pb-0" : ""}`}>
                    <p className="font-poppins text-xs font-bold uppercase tracking-[0.14em] text-[#8A7A82]">
                      {step.time}
                    </p>
                    <p
                      className={`font-poppins mt-1 text-pretty leading-snug ${
                        step.part === "two"
                          ? "text-lg font-bold text-[#C13B6B]"
                          : step.part === "bridge"
                            ? "font-semibold text-[#4A3A42]"
                            : "text-[#4A3A42]"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
