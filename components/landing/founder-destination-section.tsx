"use client"

/**
 * Founder Destination™ — introduced as a CONCEPT only (it is an authenticated,
 * post-purchase experience, never a public signup page). Presents the five
 * destination dimensions so a prospect understands what Harmony Lane helps them
 * think about.
 */
import { motion } from "framer-motion"
import { Briefcase, Gauge, Heart, Users, Cpu, LineChart } from "lucide-react"

const DIMENSIONS = [
  {
    icon: Briefcase,
    name: "Business",
    question: "What do I want the business to be — and what do I want it to make possible?",
  },
  {
    icon: Gauge,
    name: "Founder Capacity",
    question: "How do I want to use my time, energy, attention, and leadership capacity?",
  },
  {
    icon: Heart,
    name: "Life",
    question: "What do I want my life to look like alongside the business I'm building?",
  },
  {
    icon: Users,
    name: "Workplace Culture",
    question: "What kind of environment do I want to create for the people who work with me?",
  },
  {
    icon: Cpu,
    name: "Future Workplace",
    question: "What should work look like as AI, technology, and human expectations evolve?",
  },
  {
    icon: LineChart,
    name: "HROI™",
    question: "What is the whole system of success actually returning — beyond the financial line?",
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
