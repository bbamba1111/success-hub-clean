"use client"

/**
 * The diagnostic bridge between Original Intention and Method: move the founder
 * from "this is what I originally wanted" to "what did I actually create?" Six
 * areas the business has quietly shaped, then the alignment question.
 */
import { motion } from "framer-motion"

const AREAS = [
  { title: "Business", body: "The engine you built — and what it now demands to keep running." },
  { title: "Founder", body: "The role you actually occupy day to day versus the one you intended." },
  { title: "Time", body: "How your hours are really spent, and who decides where they go." },
  { title: "Life", body: "What's left for the life the business was supposed to make possible." },
  { title: "Workplace", body: "The culture and rhythm others now inherit from how you operate." },
  { title: "Future of Work", body: "The template your business quietly sets for the age of AI." },
]

export function WhatCreatedSection() {
  return (
    <section id="created" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B] shadow-sm">
            The Diagnostic
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            What have you actually created?
          </h2>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#6B5860]">
            You know what you originally intended. Before you redesign anything, look honestly at what the business
            has actually built — across six areas of your work and life.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-[#4A3A42]/10 bg-white p-6"
            >
              <h3 className="font-playfair text-xl font-bold leading-snug text-[#C13B6B]">{area.title}</h3>
              <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#6B5860]">{area.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-center text-2xl font-bold italic leading-snug text-[#4A3A42] sm:text-3xl"
        >
          Is what you built aligned with what you intended?
        </motion.p>
      </div>
    </section>
  )
}
