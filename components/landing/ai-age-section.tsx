"use client"

/**
 * 05 — The AI Age. The future of work isn't only about what AI can do — it's
 * about what humans need to thrive alongside it. A business operating question,
 * not an HR-only issue. Dark, thought-leadership treatment.
 */
import { motion } from "framer-motion"

const CHAIN = ["AI", "Business", "Work", "Human"]

export function AiAgeSection() {
  return (
    <section id="ai-age" className="w-full bg-[#2E2A3A] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            05 — The AI Age
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
            The future of work isn&apos;t only about what AI can do.
            <span className="mt-2 block text-[#E8A0AC]">It&apos;s about what humans need to thrive alongside it.</span>
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
            AI is changing capacity, productivity, and what one person — and eventually one business — can
            accomplish. But if the businesses being built today become the workplaces of tomorrow, something bigger
            has to be considered: how should work actually work?
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-playfair mx-auto mt-14 max-w-3xl text-balance text-center text-2xl font-bold leading-snug text-white sm:text-4xl"
        >
          When AI gives us back time and capacity, what will we do with it?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-8 max-w-2xl text-center"
        >
          <p className="font-poppins text-pretty text-base leading-relaxed text-white/75">
            Will the time saved simply be reinvested into more work? Will greater capacity simply create greater
            expectations? Or will we intentionally decide what that time and capacity are <em>for</em>?
          </p>
          <p className="font-playfair mt-6 text-balance text-xl font-bold leading-snug text-[#E8A0AC] sm:text-2xl">
            You have to decide now.
          </p>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-white/75">
            Because the way founders design their businesses today will influence the workplaces and human
            experience of work tomorrow. This is not an HR-only issue. It is a business operating question.
          </p>
        </motion.div>

        <motion.ol
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-3"
        >
          {CHAIN.map((node, i) => (
            <li key={node} className="flex items-center gap-3">
              <span className="font-poppins rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white">
                {node}
              </span>
              {i < CHAIN.length - 1 && <span className="text-lg text-[#E8A0AC]" aria-hidden>↓</span>}
            </li>
          ))}
        </motion.ol>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 max-w-xl text-center"
        >
          <p className="font-playfair text-balance text-2xl font-bold leading-snug text-white sm:text-3xl">
            Design the system around both.
          </p>
          <p className="font-poppins mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#F7C6CE]">
            Business performance · Human sustainability · Human life
          </p>
        </motion.div>
      </div>
    </section>
  )
}
