"use client"

/**
 * 18 — The Bigger Question. Zooms out from the individual founder to the era:
 * the businesses being designed today become the workplaces of tomorrow. A
 * quiet, dark, thought-leadership beat before the final CTA.
 */
import { motion } from "framer-motion"

export function BiggerQuestionSection() {
  return (
    <section id="bigger" className="w-full bg-[#2E2A3A] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            18 — The Bigger Question
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
            The businesses being designed today
            <span className="mt-2 block text-[#E8A0AC]">become the workplaces of tomorrow.</span>
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
            Every founder building right now is quietly answering a question far larger than their own calendar:
            what should work become in the age of AI? The answer won&apos;t be written in a policy. It will be built
            into the way businesses actually operate — one founder, one design decision at a time.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-playfair mx-auto mt-12 max-w-3xl text-balance text-2xl font-bold italic leading-snug text-white sm:text-3xl"
        >
          If your business is the prototype for a future workplace — is it a future worth working in?
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-poppins mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-white/70"
        >
          Harmony Lane™ is one answer: design the business around business performance, human sustainability, and
          human life — all three, on purpose.
        </motion.p>
      </div>
    </section>
  )
}
