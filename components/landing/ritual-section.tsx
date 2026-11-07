"use client"

/**
 * The weekly ritual that opens every member's week: Reality Check → Priority
 * Focus Areas → Operating Declaration. Presented as three numbered steps.
 */
import { motion } from "framer-motion"

const STEPS = [
  {
    n: "01",
    title: "Weekly Reality Check™",
    body: "Begin each week with an honest look across 15 life values. See exactly where your time and energy are flowing — and where they aren't.",
    emoji: "🌸",
  },
  {
    n: "02",
    title: "Choose 1–3 Priority Focus Areas",
    body: "No overwhelm. Pick the few areas that matter most this week, and let everything else wait. Focus is the whole point.",
    emoji: "🎯",
  },
  {
    n: "03",
    title: "Weekly Operating Declaration",
    body: "Commit to how you'll show up. Your declaration becomes the compass Cherry Blossom™ uses to coach you all week long.",
    emoji: "✍️",
  },
]

export function RitualSection() {
  return (
    <section id="ritual" className="relative w-full overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0">
        <img
          src="/images/reality-check-zen-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/78 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Your Weekly Ritual
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Start every week clear, focused, and intentional
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="font-playfair text-4xl font-bold text-[#7FB069]/40">{step.n}</span>
                <span className="text-2xl" aria-hidden>
                  {step.emoji}
                </span>
              </div>
              <h3 className="font-playfair mt-4 text-xl font-bold text-[#C13B6B]">{step.title}</h3>
              <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
