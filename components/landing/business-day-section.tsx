"use client"

/**
 * 07 — The Work-Life Balance Business Day™. The signature virtual immersion,
 * presented as 10 transitions (not tasks), followed by the day's rhythm visual.
 * Time Freedom™ comes BEFORE Power Down™; Unplug™ begins at 11:00 PM.
 */
import { motion } from "framer-motion"

const EXPERIENCES = [
  { title: "Flex Time™", sub: "Arrive With Intention", body: "Create space before the business begins asking for it." },
  {
    title: "Reality Check™",
    sub: "See What Is Actually Happening",
    body: "Look honestly at how your business is currently using your time, capacity, energy, and attention.",
  },
  {
    title: "Decide & Redesign™",
    sub: "Redesign Your Entry Into The Workweek",
    body: "Stop automatically entering the week through the old rhythm. Choose how you want to enter — and what your business needs to make that possible.",
  },
  {
    title: "Align™",
    sub: "Morning GIV•EN™",
    body: "Gratitude · Intention · Vision & Visualization · Emotional Embodiment · Nurture. Before the business gets your attention, reconnect with you.",
  },
  {
    title: "Move™",
    sub: "30-Minute Movement Window",
    body: "The human operating the business is part of the operating system.",
  },
  {
    title: "Lunch Break™",
    sub: "Extended Healthy Hybrid Lunch Break",
    body: "Create actual space to nourish, reset, connect, and step away from work.",
  },
  {
    title: "The 4-Hour Workday™",
    sub: "Focused CEO Workday",
    body: "You don't create a four-hour workday by simply deciding to work four hours. You create it by redesigning what happens around those four hours — focused work, protected capacity, intentional boundaries.",
  },
  {
    title: "Time Freedom™",
    sub: "Experience Time That Belongs to Your Life",
    body: "The focused workday is over. Now the time belongs to you — family, connection, creativity, recreation, rest, your interests, or simply being. This is what the business was built to make possible.",
  },
  {
    title: "Power Down™",
    sub: "Release the Day. Prepare the Body for Sleep.",
    body: "Not about shutting down the business — you've already entered Time Freedom™. This is releasing yourself from the workday. You stop producing, stop problem-solving, stop consuming work, and begin teaching your body: the day is over.",
  },
  {
    title: "Unplug™",
    sub: "11:00 PM — Digital Detox",
    body: "The final digital boundary. At 11:00 PM the devices go down. No work. No social media. No scrolling. No notifications. The digital world goes quiet. The human gets to rest.",
  },
]

const RHYTHM = [
  { label: "Enter", when: "Morning" },
  { label: "Align", when: "Morning" },
  { label: "Move", when: "Morning" },
  { label: "Create Space", when: "Midday" },
  { label: "Focus", when: "Afternoon" },
  { label: "Time Freedom", when: "Evening" },
  { label: "Power Down", when: "Night" },
  { label: "Unplug", when: "11:00 PM" },
  { label: "Rest", when: "" },
]

export function BusinessDaySection() {
  return (
    <section id="experience" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            07 — The Signature Virtual Experience
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            The Work-Life Balance Business Day™
          </h2>
          <p className="font-great-vibes mt-3 text-3xl text-[#7FB069]">Make Time For More™ — In Real Time</p>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#6B5860]">
            Live. Work. Lead — through a redesigned business day. This is a virtual immersive experience, not a
            schedule you simply follow. The day unfolds through a sequence of time-and-space boundaries. As the
            rhythm changes, you decide how you&apos;ll enter, live, work, lead, pause, focus, release, and rest.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
              className="flex gap-4 rounded-3xl border border-[#7FB069]/20 bg-white p-6 shadow-sm"
            >
              <span className="font-playfair flex-none text-2xl font-bold text-[#E8A0AC]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-playfair text-lg font-bold leading-snug text-[#4A3A42]">{exp.title}</h3>
                <p className="font-poppins mt-0.5 text-sm font-semibold text-[#5A7F46]">{exp.sub}</p>
                <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#6B5860]">{exp.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The rhythm visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-[2rem] border border-[#4A3A42]/12 bg-white p-8 shadow-lg sm:p-12"
        >
          <p className="font-poppins text-center text-xs font-bold uppercase tracking-[0.18em] text-[#8A7A82]">
            The rhythm of the day
          </p>
          <ol className="mt-8 flex flex-wrap items-stretch justify-center gap-3">
            {RHYTHM.map((node, i) => (
              <li key={node.label} className="flex items-center gap-3">
                <div className="flex min-w-[7.5rem] flex-col items-center rounded-2xl border border-[#7FB069]/25 bg-[#F1F6EC] px-4 py-3 text-center">
                  <span className="font-poppins text-sm font-bold uppercase tracking-[0.1em] text-[#4A3A42]">
                    {node.label}
                  </span>
                  {node.when && <span className="font-poppins mt-1 text-xs text-[#8A7A82]">{node.when}</span>}
                </div>
                {i < RHYTHM.length - 1 && <span className="text-lg text-[#C13B6B]" aria-hidden>→</span>}
              </li>
            ))}
          </ol>
          <p className="font-playfair mx-auto mt-10 max-w-2xl text-balance text-center text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
            The Business Day doesn&apos;t simply tell you what time it is.
            <span className="mt-1 block text-[#C13B6B]">It gives you a boundary for what time is for.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
