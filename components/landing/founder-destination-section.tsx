"use client"

/**
 * Founder Destination™ — introduced as a CONCEPT only (it is an authenticated,
 * post-purchase experience, never a public signup page). Presents the five
 * destination dimensions so a prospect understands what Harmony Lane helps them
 * think about.
 */
import { motion } from "framer-motion"
import { Compass, Heart, Layers, GitCompareArrows, MapPin, Cpu, LineChart } from "lucide-react"

const DIMENSIONS = [
  {
    icon: Compass,
    name: "Original Entrepreneurial Intention™",
    question: "Why did I choose entrepreneurship, and what did I want it to make possible?",
  },
  {
    icon: Heart,
    name: "Values",
    question: "What matters enough to build around?",
  },
  {
    icon: Layers,
    name: "What I've Created",
    question: "What have I actually created across the business, my role, my time, my life, and my workplace?",
  },
  {
    icon: GitCompareArrows,
    name: "Intention vs. Reality",
    question: "Where are they aligned? Where are the gaps? What have I learned?",
  },
  {
    icon: MapPin,
    name: "Future Destination",
    question: "What do I want success to make possible now?",
  },
  {
    icon: Cpu,
    name: "Future Workplace / AI Age",
    question: "What should work become? What should humans do, and what should AI do?",
  },
  {
    icon: LineChart,
    name: "HROI™",
    question: "What should success return beyond financial performance?",
  },
]

export function FounderDestinationSection() {
  return (
    <section id="destination" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The Destination
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Founder Destination™
          </h2>
          <p className="font-poppins mt-5 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Before you redesign anything, you decide where you&apos;re going — not only with the business, but
            with the founder role, your life, your workplace, and the future of work itself.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map(({ icon: Icon, name, question }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Icon className="h-6 w-6 text-[#C13B6B]" aria-hidden />
              </span>
              <h3 className="font-playfair mt-5 text-lg font-bold leading-snug text-[#4A3A42]">{name}</h3>
              <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#6B5860]">{question}</p>
            </motion.div>
          ))}
        </div>

        <p className="font-poppins mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-[#8A7A82]">
          Founder Destination™ is a facilitated experience inside Harmony Lane™, entered after you arrive — not a
          form to fill out today.
        </p>
      </div>
    </section>
  )
}
