"use client"

/**
 * Cherry Blossom™ — the AI co-pilot. Editorial split layout: immersive imagery
 * on one side, a glass panel describing the always-present coach on the other.
 */
import { motion } from "framer-motion"

const CAPABILITIES = [
  "Remembers your scores, focus areas, and declaration week to week",
  "Coaches you through your Results Dashboard the moment it's ready",
  "Nudges you toward presence during Time Freedom™ and rest at night",
  "Grows with you — a relationship, not a chatbot",
]

export function CherryBlossomSection() {
  return (
    <section id="cherry-blossom" className="w-full bg-[#2E2A3A] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative order-2 overflow-hidden rounded-[2rem] shadow-2xl lg:order-1"
        >
          <img
            src="/images/barbara-cherry-garden.jpg"
            alt="Cherry Blossom, your AI coach, amid a cherry blossom garden"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2E2A3A]/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            <span aria-hidden>🌸</span>
            Meet Cherry Blossom™
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-white sm:text-5xl">
            An AI coach who actually remembers you
          </h2>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
            Cherry Blossom is woven through your entire day. She knows where you are in the Business
            Day™, what you committed to this week, and how you've grown — so her guidance is always
            personal, never generic.
          </p>

          <ul className="mt-8 space-y-3">
            {CAPABILITIES.map((cap) => (
              <li key={cap} className="font-poppins flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7FB069] text-xs text-white">
                  ✓
                </span>
                {cap}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
