"use client"

/**
 * Section 7 — What's Included. Elegant cards (not a dense feature grid) for the
 * six things a $1,997 reservation includes. No Week or Installation here.
 */
import { motion } from "framer-motion"
import { getPlanByLevel } from "@/lib/payments/config"

const INCLUDED = [
  { label: "Welcome", body: "Your entry and orientation into Harmony Lane\u2122." },
  { label: "Work-Life Balance Reality Check\u2122", body: "A structured look at your current reality." },
  { label: "Reality Check Report\u2122", body: "A personalized picture of what deserves attention." },
  { label: "Guided Tour", body: "A pre-Monday walkthrough of the destination." },
  { label: "The Work-Life Balance Business Day\u2122", body: "Your complete live Monday experience." },
  {
    label: "The Full Monday Environment",
    body: "Access to the live workspaces and experiences that make up the day.",
  },
]

export function WhatsIncludedSection() {
  const price = getPlanByLevel("business-day")?.priceLabel ?? "$1,997"
  return (
    <section id="included" className="w-full bg-[#FDF6F3] py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-balance text-3xl font-bold capitalize leading-tight text-[#4A3A42] sm:text-5xl"
        >
          Your {price} reservation includes:
        </motion.h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
              className="flex flex-col rounded-3xl border border-[#4A3A42]/10 bg-white p-7 shadow-sm"
            >
              <span className="h-1 w-10 rounded-full bg-[#C9A24B]" aria-hidden />
              <h3 className="font-playfair mt-5 text-xl font-bold leading-snug text-[#4A3A42]">{item.label}</h3>
              <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#6B5860]">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
