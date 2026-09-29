"use client"

/**
 * Section 6 — What happens after you reserve. "Your Monday starts before
 * Monday." A five-step journey: Welcome → Reality Check™ → Reality Check
 * Report™ → Guided Tour → Monday. The Reality Check is framed as an orientation
 * into the founder's current reality, NOT a personality quiz or wellness test.
 */
import { motion } from "framer-motion"

const STEPS = [
  { n: "01", label: "Welcome", body: "You enter Harmony Lane\u2122 and receive your orientation." },
  { n: "02", label: "Reality Check\u2122", body: "See where you are before changing how you work." },
  {
    n: "03",
    label: "Reality Check Report\u2122",
    body: "Receive a clearer picture of your current work-life reality and what deserves attention.",
  },
  {
    n: "04",
    label: "Guided Tour",
    body: "Barbara personally guides you through the Work-Life Balance Business Day\u2122 environment before your live experience.",
  },
  { n: "05", label: "Monday", body: "You experience the entire Work-Life Balance Business Day\u2122 in real time." },
]

export function BeforeMondaySection() {
  return (
    <section id="how-it-works" className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-balance text-3xl font-bold uppercase leading-tight text-[#4A3A42] sm:text-5xl"
        >
          Your Monday starts
          <span className="mt-1 block text-[#C13B6B]">before Monday.</span>
        </motion.h2>

        <ol className="mt-14 space-y-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.3) }}
              className="flex items-start gap-5 rounded-3xl border border-[#4A3A42]/10 bg-[#FDF6F3] p-6 sm:gap-7 sm:p-8"
            >
              <span className="font-playfair flex-none text-3xl font-bold text-[#E8A0AC] sm:text-4xl">{step.n}</span>
              <div>
                <h3 className="font-playfair text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
                  {step.label}
                </h3>
                <p className="font-poppins mt-1.5 text-pretty text-sm leading-relaxed text-[#6B5860] sm:text-base">
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
